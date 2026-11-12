"use client";

import { useEffect, useRef } from "react";
import { resolveMotion } from "@/lib/motion";

// Efecto magnético sutil (≤ strength px) para el botón principal.
// Solo puntero fino y con movimiento permitido (lib/motion).
// El elemento es visible y funcional sin JS ni animación.
export default function useMagnetic(strength = 6) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let cleanup;
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const fine = window.matchMedia("(pointer: fine)").matches;
      if (!fine || !resolveMotion().allowed) {
        return undefined;
      }
      {
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

        const onMove = (event) => {
          const rect = el.getBoundingClientRect();
          const relX = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
          const relY = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
          xTo(relX * strength);
          yTo(relY * strength);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);

        cleanup = () => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          xTo(0);
          yTo(0);
        };
      }
    })();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [strength]);

  return ref;
}
