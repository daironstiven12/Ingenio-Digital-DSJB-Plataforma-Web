// Notificador por WhatsApp — patrón de proveedores intercambiables.
// Misma interfaz para todos: send(text) → { status: "sent" | "skipped" | "failed" }
//
// WHATSAPP_PROVIDER (variable de servidor, sin NEXT_PUBLIC_):
//   "callmebot" → lib/notifiers/callmebot.js (gratuito, no oficial)
//   "none"      → lib/notifiers/none.js (por defecto: el canal queda "skipped")
//
// Añadir otro proveedor (p. ej. WhatsApp Cloud API de Meta) = crear
// lib/notifiers/<nombre>.js con `export async function send(text)` que
// devuelva el mismo objeto, y registrarlo aquí. La ruta
// app/api/contact/route.js no cambia.
//
// callmebot es un servicio GRATUITO NO OFICIAL, de "solo uso personal":
// solo puede enviar mensajes AL NÚMERO con el que se activó la API.
// No es apto como canal de negocio a escala; la alternativa oficial es
// la Cloud API de WhatsApp Business Platform (Meta), verificada y con
// plantillas aprobadas.
import * as none from "./none";
import * as callmebot from "./callmebot";

const providers = { none, callmebot };

export function currentProvider() {
  return process.env.WHATSAPP_PROVIDER === "callmebot" ? "callmebot" : "none";
}

// Texto ya saneado (sin caracteres de control) y ≤ 600 caracteres.
export async function send(text) {
  const provider = currentProvider();
  return providers[provider].send(text);
}

export const WHATSAPP_PROVIDERS = Object.keys(providers);
