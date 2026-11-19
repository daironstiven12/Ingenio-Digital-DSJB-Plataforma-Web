"use client";

import { useEffect, useRef } from "react";
import { resolveMotion } from "@/lib/motion";
import { waitForIntroDone } from "@/lib/introWait";
import styles from "./SectionHeading.module.css";

// Encabezado de sección: título revelado línea a línea con máscara
// (SplitText) + línea de acento que se dibuja bajo él.
// La decisión de movimiento viene de lib/motion; sin movimiento, estático
// y visible por defecto. Sin SplitText disponible, el título queda tal cual.
export default function SectionHeading({ index, kicker, title, lead, id, align = "left" }) {
  const titleRef = useRef(null);
  const ruleRef = useRef(null);

  useEffect(() => {
    const node = titleRef.current;
    const rule = ruleRef.current;
    if (!node) return undefined;

    let ctx;
    let cancelled = false;

    (async () => {
      try {
        await waitForIntroDone(6500);
        if (cancelled) return;
        const { gsap } = await import("gsap");
        const { SplitText } = await import("gsap/SplitText");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        // Esperar a las fuentes para que el reparto en líneas sea correcto
        if (typeof document !== "undefined" && document.fonts?.ready) {
          await document.fonts.ready.catch(() => {});
        }
        if (cancelled) return;
        gsap.registerPlugin(SplitText, ScrollTrigger);
        // No restituye estado al cambiar la altura de viewport en móvil (barra dinámica del navegador):
        ScrollTrigger.config({ ignoreMobileResize: true });

        const motion = resolveMotion();
        if (motion.allowed) {
          const inner = gsap.context(() => {
            const split = new SplitText(node, {
              type: "lines",
              mask: "lines",
              linesClass: "split-line",
            });
            gsap.fromTo(
              split.lines,
              { yPercent: 112 },
              {
                yPercent: 0,
                duration: 0.65,
                stagger: 0.08,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: {
                  trigger: node,
                  start: "top 88%",
                  once: true,
                },
              },
            );
            // Línea de acento que se dibuja bajo el título
            if (rule) {
              gsap.fromTo(
                rule,
                { scaleX: 0, transformOrigin: "0 50%" },
                {
                  scaleX: 1,
                  duration: 0.6,
                  ease: "power3.out",
                  immediateRender: false,
                  scrollTrigger: {
                    trigger: node,
                    start: "top 88%",
                    once: true,
                  },
                },
              );
            }
          }, node);
          ctx = { revert: () => inner.revert() };
        }

        ScrollTrigger.refresh();
      } catch {
        // SplitText no disponible: el título queda visible sin animación.
      }
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, [title]);

  return (
    <div className={`${styles.heading} ${styles[`align_${align}`] ?? ""}`}>
      <p className={`eyebrow ${styles.eyebrow}`}>
        <span className={styles.index}>{index}</span>
        <span aria-hidden="true"> — </span>
        {kicker}
      </p>
      <h2 id={id} ref={titleRef} className={`section-title ${styles.title}`}>
        {title}
      </h2>
      <span ref={ruleRef} className={styles.rule} aria-hidden="true" />
      {lead ? <p className={`section-lead ${styles.lead}`}>{lead}</p> : null}
    </div>
  );
}
