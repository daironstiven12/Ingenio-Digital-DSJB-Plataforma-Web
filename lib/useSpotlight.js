"use client";

import { useCallback } from "react";

// Spotlight que sigue el cursor en tarjetas.
// Variables CSS --mx/--my consumidas por el CSS (.spotlight).
// Solo puntero fino; en táctil no hace nada. Sin estado → sin re-renders.
export default function useSpotlight() {
  return useCallback((event) => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = event.currentTarget;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    el.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }, []);
}
