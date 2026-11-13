"use client";

import { useEffect, useRef } from "react";
import { resolveMotion } from "@/lib/motion";

// Revelado al hacer scroll con GSAP — mejora progresiva:
// - Sin JS, el contenido es visible (globals.css solo oculta bajo html.js).
// - Con reduced-motion, no se anima nada: el contenido queda visible.
// - gsap.context() con revert() en el cleanup (Strict Mode seguro).
// - fromTo con immediateRender: false; desplazamiento 16 px, ~400 ms.
// - Respaldo: si tras 1.5 s un elemento sigue oculto, se muestra.

const FALLBACK_MS = 1500;

// Refresco de ScrollTrigger una sola vez por sesión: tras fuentes e imágenes.
let refreshRegistered = false;
function registerScrollRefresh(ScrollTrigger) {
  if (refreshRegistered) return;
  refreshRegistered = true;
  const refresh = () => ScrollTrigger.refresh();
  if (typeof document !== "undefined") {
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }
    window.addEventListener("load", refresh, { once: true });
    document.querySelectorAll("img").forEach((img) => {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });
  }
}

export default function Reveal({
  children,
  delay = 0,
  y = 16,
  className = "",
  as: Tag = "div",
  id,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const motion = resolveMotion();

    // Sin animación: contenido visible de inmediato.
    if (!motion.allowed) {
      node.classList.remove("reveal-pending");
      return undefined;
    }

    let ctx;
    let cancelled = false;
    let restored = false;

    const showFallback = (force = false) => {
      if (restored) return;
      // Con force (GSAP no disponible) se muestra todo; sin force (respaldo
      // por temporizador) solo lo que ya debería estar visible: lo que está
      // bajo el fold conserva su revelado al hacer scroll.
      const rect = node.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!force && !inView) return;
      restored = true;
      node.classList.remove("reveal-pending");
      if (ctx) {
        ctx.revert();
        ctx = undefined;
      }
      node.style.opacity = "";
      node.style.transform = "";
    };

    (async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        // No restituye estado al cambiar la altura de viewport en móvil (barra dinámica del navegador):
        ScrollTrigger.config({ ignoreMobileResize: true });

        ctx = gsap.context(() => {
          // Estado inicial coherente con html.js .reveal-pending
          gsap.set(node, { opacity: 0, y });
          gsap.fromTo(
            node,
            { opacity: 0, y },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              delay,
              ease: "power2.out",
              immediateRender: false,
              scrollTrigger: {
                trigger: node,
                start: "top 88%",
                once: true,
              },
            },
          );
        }, node);

        // GSAP ya fija el estado inline; el CSS bajo html.js no debe competir.
        node.classList.remove("reveal-pending");
        registerScrollRefresh(ScrollTrigger);
      } catch {
        // GSAP no disponible o fallo de chunk: mostrar contenido.
        showFallback(true);
      }
    })();

    const fallback = window.setTimeout(() => showFallback(false), FALLBACK_MS);

    return () => {
      cancelled = true;
      window.clearTimeout(fallback);
      if (ctx) ctx.revert();
      node.classList.remove("reveal-pending");
      node.style.opacity = "";
      node.style.transform = "";
    };
  }, [delay, y]);

  return (
    <Tag id={id} ref={ref} className={`${className} reveal-pending`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
