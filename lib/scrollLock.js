"use client";

// ============================================================
// Gestor ÚNICO de bloqueo de scroll para toda la web.
//
// La clase html.scroll-locked pone CLÁSICAMENTE overflow: hidden
// sobre <html> (no sobre <body>): el motor antiguo (Haiku) y los
// modernos lo resuelven idéntico: la ventana deja de desplazarse.
// Prohibido overflow: hidden en <body> (colapsa el viewport en
// Chrome/Brave moderno vía propagación de overflow del body al
// viewport).
//
// Contador de referencias por nombre ("intro", "nav", "menu",
// "palette"): html.scroll-locked se añade cuando el total > 0 y se
// quita cuando vuelve a 0.
//
// Nadie bloquea/desbloquea scroll DIRECTAMENTE: todos usan lockScroll/
// unlockScroll. El failsafe inline de <head> llama a unlockAllScroll()
// (expuesto en window.__scrollUnlockAll) aunque el React se haya roto.
// ============================================================

const counters = new Map();

function total() {
  let sum = 0;
  for (const count of counters.values()) sum += count;
  return sum;
}

function applyClass(present) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("scroll-locked", present);
}

export function lockScroll(name) {
  if (typeof window === "undefined") return;
  counters.set(name, (counters.get(name) ?? 0) + 1);
  applyClass(true);
}

export function unlockScroll(name) {
  if (typeof window === "undefined") return;
  const current = counters.get(name) ?? 0;
  if (current <= 1) {
    counters.delete(name);
  } else {
    counters.set(name, current - 1);
  }
  applyClass(total() > 0);
}

export function unlockAllScroll() {
  if (typeof window === "undefined") return;
  counters.clear();
  applyClass(false);
}

// Limpieza de estado visual por si algo queda a medias tras bfcache,
// visibilitychange, error de hidratación o fallo de red al navegar.
export function resetNavigationOverlays() {
  if (typeof window === "undefined") return;
  unlockAllScroll();
  const root = document.documentElement;
  root.classList.remove("intro-on", "nav-loading");
  root.classList.add("intro-done");
  root.style.removeProperty("--nav-accent");
}

// Hidrata desde el <head> inline (que no puede importar este módulo):
// el script llama window.__scrollUnlockAll() como failsafe universal.
if (typeof window !== "undefined") {
  window.__scrollUnlockAll = resetNavigationOverlays;
  // El intro pre-pinta scroll-locked sin pasar todavía por este gestor;
  // lo contabilizamos como lock "intro" para que unlockAllScroll()
  // mantenga el invariante entre el resto del sitio.
  try {
    if (
      typeof document !== "undefined" &&
      document.documentElement.classList.contains("scroll-locked") &&
      total() === 0
    ) {
      counters.set("intro", 1);
    }
  } catch {
    // sin documento: nada
  }
}
