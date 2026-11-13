"use client";

import { useEffect, useRef } from "react";
import { resolveMotion } from "@/lib/motion";

// Barra de progreso de lectura fina (2 px) con el degradado de marca.
// Basada en scaleX + ScrollTrigger con scrub; estática con reduced-motion
// (globals.css la oculta en ese caso). Visible solo con scrollY >= 8 px.
export default function ScrollProgress() {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (!resolveMotion().allowed) {
      node.style.display = "none";
      return undefined;
    }

    let ctx;
    let cancelled = false;

    // Puntero al listener, registrado antes de su primer uso y disponible en el cleanup
    const applyOpacity = () => {
      node.style.opacity = window.scrollY >= 8 ? "0.7" : "0";
    };
    applyOpacity();
    window.addEventListener("scroll", applyOpacity, { passive: true });

    (async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        ctx = gsap.context(() => {
          gsap.fromTo(
            node,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                start: 0,
                end: () =>
                  document.documentElement.scrollHeight - window.innerHeight,
                scrub: 0.3,
              },
            },
          );
        }, node);
      } catch {
        node.style.display = "none";
      }
    })();

    return () => {
      cancelled = true;
      window.removeEventListener("scroll", applyOpacity);
      if (ctx) ctx.revert();
    };
  }, []);

  return <div ref={ref} className="scroll-progress" aria-hidden="true" />;
}
