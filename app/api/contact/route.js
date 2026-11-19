// POST /api/contact — contacto conversacional.
// Sin SDK (fetch), sin base de datos, sin variables NEXT_PUBLIC_.
// (El runtime es nodejs por defecto; no se declara por compatibilidad con
// cacheComponents de Next 16.)
//
// Reglas de privacidad:
//  - Las etiquetas de los envíos se toman SIEMPRE de data/contact-flow.js
//    (nunca del cliente).
//  - No se registra ningún dato personal en logs (los errores solo llevan
//    el nombre del canal, nunca valores).
//  - Los datos no se guardan en una base de datos; solo viajan por correo
//    y/o WhatsApp al equipo.
//
// Spam: honeypot + elapsedMs mínimo + rate-limit por IP (mejor esfuerzo,
// ver rateLimit más abajo). Nada de esto bloquea el canal directo al
// visitante (wa.me/mailto con el resumen).

import { NextResponse } from "next/server";
import {
  labelForNeed,
  labelForDetail,
  labelForAudience,
  labelForTiming,
  isValidNeed,
  isValidDetail,
  isValidAudience,
  isValidTiming,
} from "@/data/contact-flow";
import { send as sendWhatsApp } from "@/lib/notifiers";

const MAX_BODY_BYTES = 5 * 1024;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hora
const RATE_LIMIT_MAX = 5; // 5 envíos por IP por hora
const FETCH_TIMEOUT_MS = 8000;

// Rate-limit en memoria (Map ip → timestamps). Mejor esfuerzo:
//  - En serverless cada instancia tiene su propia memoria: el límite es
//    por instancia, no global.
//  - Para un límite global habría que usar un store externo (p. ej.
//    Turnstile + Vercel KV / Upstash). Siguiente paso documentado.
const rateHits = new Map();

function rateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = (rateHits.get(ip) ?? []).filter((t) => t > windowStart);
  if (hits.length >= RATE_LIMIT_MAX) {
    rateHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  rateHits.set(ip, hits);
  // Cap defensivo de tamaño del Map
  if (rateHits.size > 5000) {
    for (const [key, list] of rateHits) {
      const live = list.filter((t) => t > windowStart);
      if (live.length === 0) rateHits.delete(key);
    }
  }
  return true;
}

function clientIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return "unknown";
}

function json(body, status = 200, headers = {}) {
  return NextResponse.json(body, { status, headers });
}

// Email "razonable": no pretende ser RFC 5322, sí filtrar basura.
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

const sanitizeLine = (value) =>
  String(value)
    .replace(/[\r\n]+/g, " ")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

const stripControl = (value) => String(value).replace(/[\x00-\x1f\x7f]/g, " ");

export async function POST(request) {
  // 1) Content-Type y tamaño (fail-fast, sin leer el cuerpo dos veces)
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return json({ ok: false, error: "content_type" }, 415);
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    return json({ ok: false, error: "body" }, 400);
  }
  if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return json({ ok: false, error: "too_large" }, 413);
  }

  // 2) Rate-limit por IP
  const ip = clientIp(request);
  if (!rateLimit(ip)) {
    return json({ ok: false, error: "rate_limited" }, 429, {
      "Retry-After": "3600",
    });
  }

  // 3) Origin/Host en producción (el sitio llama desde su propio dominio)
  if (process.env.NODE_ENV === "production") {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin) {
      try {
        if (new URL(origin).host !== host) {
          return json({ ok: false, error: "origin" }, 403);
        }
      } catch {
        return json({ ok: false, error: "origin" }, 403);
      }
    }
  }

  // 4) Parse del cuerpo
  let input;
  try {
    input = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "json" }, 400);
  }
  if (input == null || typeof input !== "object" || Array.isArray(input)) {
    return json({ ok: false, error: "json" }, 400);
  }

  const {
    need,
    detail,
    audience,
    timing,
    name,
    email,
    phone,
    preferred,
    message,
    consent,
    lang,
    hp,
    elapsedMs,
  } = input;

  // 5) Antispam: honeypot lleno o envío demasiado rápido → 200 silencioso
  //    (no revelamos al bot que fue filtrado; no se envía nada).
  if (typeof hp === "string" && hp.trim().length > 0) {
    return json({ ok: true });
  }
  if (typeof elapsedMs === "number" && Number.isFinite(elapsedMs) && elapsedMs < 2500) {
    return json({ ok: true });
  }

  // 6) Validación (los ids se contrastan con las listas del servidor)
  if (!isValidNeed(need)) {
    return json({ ok: false, error: "invalid", field: "need" }, 400);
  }
  if (!isValidDetail(need, detail ?? null)) {
    return json({ ok: false, error: "invalid", field: "detail" }, 400);
  }
  if (!isValidAudience(audience)) {
    return json({ ok: false, error: "invalid", field: "audience" }, 400);
  }
  if (!isValidTiming(timing)) {
    return json({ ok: false, error: "invalid", field: "timing" }, 400);
  }

  const cleanName = typeof name === "string" ? sanitizeLine(name) : "";
  if (cleanName.length < 2 || cleanName.length > 80) {
    return json({ ok: false, error: "invalid", field: "name" }, 400);
  }

  // Al menos un medio de contacto; ambos opcionales pero >= 1 presente.
  const cleanEmail =
    typeof email === "string" ? sanitizeLine(email).toLowerCase() : "";
  const emailOk = cleanEmail.length > 0 && EMAIL_RE.test(cleanEmail);
  if (cleanEmail.length > 0 && !emailOk) {
    return json({ ok: false, error: "invalid", field: "email" }, 400);
  }

  const phoneDigits =
    typeof phone === "string" ? phone.replace(/\D/g, "") : "";
  const phoneOk = phoneDigits.length >= 7 && phoneDigits.length <= 15;
  if (phoneDigits.length > 0 && !phoneOk) {
    return json({ ok: false, error: "invalid", field: "phone" }, 400);
  }

  if (!emailOk && !phoneOk) {
    return json({ ok: false, error: "no_contact" }, 400);
  }

  // Canal preferido: solo tiene sentido si da ambos medios.
  let cleanPreferred = null;
  if (preferred != null) {
    if (preferred === "email" && emailOk) cleanPreferred = "email";
    else if (preferred === "whatsapp" && phoneOk) cleanPreferred = "whatsapp";
    else return json({ ok: false, error: "invalid", field: "preferred" }, 400);
  }

  const cleanMessage =
    typeof message === "string" ? stripControl(message).trim().slice(0, 500) : "";

  if (consent !== true) {
    return json({ ok: false, error: "consent" }, 400);
  }

  const cleanLang = lang === "en" ? "en" : "es";

  // 7) Etiquetas en español para los envíos (del servidor, nunca del cliente)
  const summary = {
    needLabel: labelForNeed(need),
    detailLabel: need === "otra" ? null : labelForDetail(need, detail),
    audienceLabel: labelForAudience(audience),
    timingLabel: labelForTiming(timing),
  };

  const isoDate = new Date().toISOString();
  const contactLine = [
    emailOk ? `Correo: ${cleanEmail}` : "Correo: no indicado",
    phoneOk ? `WhatsApp: +${phoneDigits}` : "WhatsApp: no indicado",
    `Canal preferido: ${
      cleanPreferred === "email" ? "correo" : cleanPreferred === "whatsapp" ? "WhatsApp" : "no indicado"
    }`,
  ].join("\n");

  const emailBody = [
    `Nuevo contacto desde la web — Ingenio Digital DSJB`,
    ``,
    `Qué busca: ${summary.needLabel}`,
    `Detalle: ${summary.detailLabel ?? "no especificado"}`,
    `Para quién: ${summary.audienceLabel}`,
    `Para cuándo: ${summary.timingLabel}`,
    ``,
    `Nombre: ${cleanName}`,
    contactLine,
    `Mensaje: ${cleanMessage || "(sin mensaje)"}`,
    ``,
    `Idioma del visitante: ${cleanLang}`,
    `Fecha (UTC): ${isoDate}`,
  ].join("\n");

  const subject = sanitizeLine(
    `Nuevo contacto web: ${summary.needLabel} — ${cleanName}`,
  ).slice(0, 120);

  // Resumen ≤ 600 chars sin control (para WhatsApp)
  const whatsappText = stripControl(
    [
      `Nuevo contacto web: ${summary.needLabel}`,
      summary.detailLabel ? `· ${summary.detailLabel}` : null,
      `· Para: ${summary.audienceLabel}`,
      `· Cuándo: ${summary.timingLabel}`,
      `· ${cleanName}`,
      emailOk ? `· ${cleanEmail}` : null,
      phoneOk ? `· +${phoneDigits}` : null,
      cleanPreferred ? `· Prefiere: ${cleanPreferred === "whatsapp" ? "WhatsApp" : "correo"}` : null,
      cleanMessage ? `· ${cleanMessage.slice(0, 120)}` : null,
    ]
      .filter(Boolean)
      .join(" "),
  )
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 600);

  // 8) Envío en paralelo: Resend por fetch + WhatsApp por proveedor
  const resendKey = process.env.RESEND_API_KEY;
  const contactTo = process.env.CONTACT_TO_EMAIL;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? "Ingenio Digital <onboarding@resend.dev>";

  const sendEmail = async () => {
    if (!resendKey || !contactTo) return "skipped";
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: contactTo,
          ...(emailOk ? { reply_to: cleanEmail } : {}),
          subject,
          text: emailBody,
        }),
        signal: controller.signal,
      });
      return response.ok ? "sent" : "failed";
    } catch {
      return "failed";
    } finally {
      clearTimeout(timer);
    }
  };

  const [emailResult, whatsappResult] = await Promise.allSettled([
    sendEmail(),
    sendWhatsApp(whatsappText),
  ]);
  const emailStatus =
    emailResult.status === "fulfilled" ? emailResult.value : "failed";
  const whatsappStatus =
    whatsappResult.status === "fulfilled"
      ? whatsappResult.value.status
      : "failed";

  // 9) Estado agregado
  const attempted =
    (resendKey && contactTo ? 1 : 0) +
    (process.env.WHATSAPP_PROVIDER === "callmebot" ? 1 : 0);
  const sent = [emailStatus, whatsappStatus].filter((s) => s === "sent").length;

  if (attempted === 0) {
    if (process.env.NODE_ENV !== "production") {
      // Dry-run: nada configurado, se imprime el contenido en la consola
      // del servidor (solo desarrollo; nunca en producción).
      console.log("[contact] dry-run — payload saneado (sin enviar):");
      console.log(emailBody);
      console.log("[contact] whatsapp:", whatsappText);
      return json({
        ok: true,
        mode: "dry-run",
        email: "skipped",
        whatsapp: "skipped",
      });
    }
    // Producción sin canales: 503, la UI ofrece los canales directos.
    return json({ ok: false, error: "unconfigured" }, 503);
  }

  if (sent === 0) {
    // Se intentó al menos un canal y todos fallaron. Sin PII en logs.
    console.error(`[contact] envío fallido: email=${emailStatus} whatsapp=${whatsappStatus}`);
    return json(
      { ok: false, error: "delivery_failed", email: emailStatus, whatsapp: whatsappStatus },
      502,
    );
  }

  return json({ ok: true, email: emailStatus, whatsapp: whatsappStatus });
}

export function GET() {
  return json({ ok: false, error: "method_not_allowed" }, 405, {
    Allow: "POST",
  });
}
