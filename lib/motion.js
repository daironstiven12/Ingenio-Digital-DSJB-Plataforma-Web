"use client";

// ============================================================
// Decisión de movimiento para todo el sitio.
//
// Tres estados guardados en localStorage (clave "motion-preference"):
//   "auto" → sigue prefers-reduced-motion del sistema (por defecto)
//   "on"   → fuerza movimiento permitido
//   "off"  → fuerza preferencia de reducción
//
// Override de prueba por URL: ?motion=on|off  (sessionStorage + parámetro;
// gana sobre localStorage en esa pestaña).
//
// La decisión se aplica en el cliente mediante la clase html.motion-off.
// El script inline de <head> replica esta decisión antes del primer pintado
// (para intro/video/CSS) porque no puede importar este módulo.
//
// Cambio en vivo: tras escribir localStorage se hace recarga suave
// (window.location.reload()) porque los consumidores (vídeo, GSAP, three,
// Reveal…) leen la decisión al montar y no todos tienen suscripción a un
// cambio en caliente. Documentado en el informe; ?motion=on|off sigue siendo
// el override para pruebas.
// ============================================================

const STORAGE_KEY = "motion-preference";
const NOTICE_KEY = "motion-notice-dismissed";
const SESSION_KEY = "motion-override";

export const MOTION = { AUTO: "auto", ON: "on", OFF: "off" };
export const MOTION_EVENT = "ingenio:motion-change";

function parseUrlParam(search) {
  const match = /[?&]motion=(on|off)(?:&|$)/.exec(search ?? "");
  return match ? match[1] : null;
}

// Sincroniza sessionStorage con la URL (?motion gana en esta pestaña).
export function persistMotionParamFromSearch(search) {
  const param = parseUrlParam(search);
  if (!param) return null;
  try {
    window.sessionStorage.setItem(SESSION_KEY, param);
  } catch {
    // sessionStorage no disponible: la decisión vive solo en la URL.
  }
  return param;
}

// Lee la preferencia (URL → sessionStorage → localStorage → auto).
export function resolveMotion() {
  if (typeof window === "undefined") {
    return { allowed: true, reason: "ssr", mode: MOTION.AUTO };
  }

  let override = null;
  try {
    override =
      persistMotionParamFromSearch(window.location?.search) ??
      window.sessionStorage.getItem(SESSION_KEY);
    if (/[?&]intro=1(?:&|$)/.test(window.location?.search ?? "")) override = "on";
    if (!override) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "on" || stored === "off") override = stored;
    }
  } catch {
    override = parseUrlParam(window.location?.search);
  }

  if (override === "on") return { allowed: true, reason: "forced-on", mode: MOTION.ON };
  if (override === "off") return { allowed: false, reason: "forced-off", mode: MOTION.OFF };

  let reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    reduced = false;
  }
  return {
    allowed: !reduced,
    reason: reduced ? "reduced-motion" : "system",
    mode: MOTION.AUTO,
  };
}

// Preferencia guardada (sin URL): para el botón "AUTO/ON/OFF".
export function readMotionPreference() {
  if (typeof window === "undefined") return MOTION.AUTO;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "on" || stored === "off" || stored === "auto"
      ? stored
      : MOTION.AUTO;
  } catch {
    return MOTION.AUTO;
  }
}

// Aplica y persiste la preferencia. Recarga suave para que todos
// los consumidores lean la nueva decisión al montar.
export function setMotionPreference(mode) {
  if (typeof window === "undefined") return;
  const safe = mode === "on" || mode === "off" ? mode : "auto";
  try {
    if (safe === "auto") {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, safe);
    }
  } catch {
    // Sin storage: no persistimos; la decisión afecta al DOM durante esta sesión.
  }
  const decision = resolveMotion();
  document.documentElement.classList.toggle("motion-off", !decision.allowed);
  window.dispatchEvent(
    new CustomEvent(MOTION_EVENT, {
      detail: { mode: decision.mode, allowed: decision.allowed },
    }),
  );
  window.location.reload();
}

// Aviso UNA vez: sistema pide reducir movimiento + preferencia libre.
export function shouldShowMotionNotice() {
  if (typeof window === "undefined") return false;
  try {
    if (window.localStorage.getItem(STORAGE_KEY)) return false; // ya eligió
    if (window.localStorage.getItem(NOTICE_KEY)) return false; // ya descartado
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function dismissMotionNotice() {
  try {
    window.localStorage.setItem(NOTICE_KEY, "1");
  } catch {
    // sin storage: no persistimos
  }
}
