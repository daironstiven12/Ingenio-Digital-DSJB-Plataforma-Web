"use client";

// Hook SSR-safe para la decisión de movimiento REAL (localStorage + sistema).
// getServerSnapshot devuelve true (neutral: movimiento permitido) — idéntico
// en SSR y en el primer render del cliente. La suscripción reacciona a
// MOTION_EVENT (cambio de preferencia por parte del usuario) y a los
// cambios de prefers-reduced-motion del sistema.
import { useSyncExternalStore } from "react";
import { resolveMotion, MOTION_EVENT } from "./motion";

const subscribe = (callback) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(MOTION_EVENT, callback);
  let mq = null;
  try {
    mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener?.("change", callback);
  } catch {
    // matchMedia no soportado: solo reacciona a MOTION_EVENT
  }
  return () => {
    window.removeEventListener(MOTION_EVENT, callback);
    mq?.removeEventListener?.("change", callback);
  };
};

export function useMotionEnabled() {
  return useSyncExternalStore(
    subscribe,
    () => resolveMotion().allowed,
    () => true, // getServerSnapshot neutral
  );
}
