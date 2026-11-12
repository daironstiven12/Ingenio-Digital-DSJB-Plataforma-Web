"use client";

// ============================================================
// Decisión ÚNICA de movimiento para todo el sitio.
// Por defecto sigue prefers-reduced-motion del sistema.
// Override para pruebas del dueño: ?motion=on|off  (sessionStorage,
// solo la pestaña actual; sin localStorage ni persistencia cruzada).
//
// Uso en cliente: const { allowed, reason } = resolveMotion();
// El script inline de <head> replica esta decisión antes de pintar
// (para la intro y la clase CSS motion-off) porque no puede importar
// este módulo. Mantener ambas mitades sincronizadas.
// ============================================================

const SESSION_KEY = "motion-override";

export function resolveMotionParamFromSearch(search) {
  const match = /[?&]motion=(on|off)(?:&|$)/.exec(search ?? "");
  return match ? match[1] : null;
}

// Sincroniza sessionStorage con la URL (llamado por el inline script…
// y reutilizable en pruebas): ?motion=on|off gana sobre lo previo.
export function persistMotionParamFromSearch(search) {
  const param = resolveMotionParamFromSearch(search);
  if (!param) return null;
  try {
    window.sessionStorage.setItem(SESSION_KEY, param);
  } catch {
    // sessionStorage no disponible: la decisión dura solo la lectura actual.
  }
  return param;
}

export function resolveMotion() {
  if (typeof window === "undefined") {
    return { allowed: true, reason: "ssr" };
  }

  let override = null;
  try {
    // La URL manda y se persiste para que navegar sin parámetro la conserve
    // en esta misma pestaña.
    override =
      persistMotionParamFromSearch(window.location?.search) ??
      window.sessionStorage.getItem(SESSION_KEY);
    // ?intro=1 es una herramienta de prueba explícita: también permite movimiento.
    if (/[?&]intro=1(?:&|$)/.test(window.location?.search ?? "")) override = "on";
  } catch {
    override = resolveMotionParamFromSearch(window.location?.search);
  }

  if (override === "on") return { allowed: true, reason: "param" };
  if (override === "off") return { allowed: false, reason: "param" };

  let reduced = false;
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    reduced = false;
  }
  return reduced
    ? { allowed: false, reason: "reducedMotion" }
    : { allowed: true, reason: "system" };
}
