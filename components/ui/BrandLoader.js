"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/components/i18n/LanguageProvider";
import OrbitSystem from "@/components/ui/OrbitSystem";
import styles from "./BrandLoader.module.css";

// Intro de bienvenida ("variante intro" del sistema orbital).
// - La clase .intro-on la decide el script inline de <head> ANTES del primer
//   pintado; sin JS o sin la clase, el overlay no se muestra (globals.css).
// - Secuencia (~2.6 s): emblema → dibujo del anillo y 8 líneas → nodos se
//   rellenan → "Bienvenido…" → clip-path de salida. Failsafe global de 4 s.
// - Solo primera visita (30 días, localStorage con try/catch); ?intro=1 fuerza,
//   ?intro=0 desactiva. BrandLoader solo anima; al terminar quita la clase
//   y marca la visita. prefers-reduced-motion: nunca se muestra.
// - role=status aria-live=polite; botón Saltar + Escape; scroll bloqueado y
//   restaurado después; foco devuelto a #contenido.
export default function BrandLoader() {
  const { t } = useT();
  const [gone, setGone] = useState(false);
  const overlayRef = useRef(null);
  const skipRef = useRef(null);
  const ringRef = useRef(null);
  const innerRef = useRef(null);
  const emblemImageRef = useRef(null);
  const emblemCircleRef = useRef(null);
  const spokeRefs = useRef([]);
  const nodeRefs = useRef([]);
  const welcomeRef = useRef(null);
  const timelineRef = useRef(null);

  // finish(true)  → el usuario vio o saltó la intro: marcar visita.
  // finish(false) → intro no llegó a mostrarse (error/timeout): no marcar.
  const finish = useCallback((markSeen = false) => {
    const overlay = overlayRef.current;
    if (overlay) overlay.style.display = "none";
    document.body.style.overflow = "";
    if (markSeen) {
      try {
        window.localStorage.setItem("ingenio-intro", JSON.stringify({ t: Date.now() }));
      } catch {
        // localStorage no disponible: la intro puede reaparecer.
      }
    }
    document.documentElement.classList.remove("intro-on");
    setGone(true);
    const target = document.getElementById("contenido");
    target?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return undefined;
    // Sin la clase decidida por el script inline: ocultar y listo.
    if (!document.documentElement.classList.contains("intro-on")) {
      overlay.style.display = "none";
      return undefined;
    }

    document.body.style.overflow = "hidden";
    skipRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        timelineRef.current?.kill();
        finish(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // Cap duro: pase lo que pase, la intro no dura más de 3.2 s
    const hardStop = window.setTimeout(() => finish(false), 3200);

    let ctx;
    let cancelled = false;

    (async () => {
      try {
        const { gsap } = await import("gsap");
        if (cancelled) return;

        ctx = gsap.context(() => {
          const tl = gsap.timeline({
            defaults: { ease: "power3.out" },
            onComplete: () => {
              window.clearTimeout(hardStop);
              finish(true);
            },
          });
          timelineRef.current = tl;

          // 1) Emblema aparece
          tl.fromTo(
            [emblemCircleRef.current, emblemImageRef.current],
            { opacity: 0, scale: 0.55, transformOrigin: "50% 50%" },
            { opacity: 1, scale: 1, duration: 0.45 },
          );

          // 2) Anillo punteado y círculo interior se dibujan
          const ringC = 2 * Math.PI * 168;
          const innerC = 2 * Math.PI * 82;
          tl.fromTo(
            ringRef.current,
            { strokeDasharray: `${ringC}`, strokeDashoffset: ringC },
            { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" },
            "-=0.1",
          );
          tl.fromTo(
            innerRef.current,
            { strokeDasharray: `${innerC}`, strokeDashoffset: innerC },
            { strokeDashoffset: 0, duration: 0.65, ease: "power2.inOut" },
            "-=0.7",
          );

          // 3) Las 8 líneas se van dibujando
          tl.fromTo(
            spokeRefs.current,
            { strokeDasharray: "70", strokeDashoffset: 70, opacity: 0 },
            {
              strokeDashoffset: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.05,
              ease: "power2.inOut",
            },
            "-=0.5",
          );

          // 4) Cada nodo se rellena de color al ser alcanzado
          tl.fromTo(
            nodeRefs.current,
            { scale: 0.35, transformOrigin: "50% 50%", opacity: 0, fill: "transparent" },
            {
              scale: 1,
              opacity: 1,
              fill: (_i, el) =>
                getComputedStyle(el).getPropertyValue("--fill").trim() || "#2f7bff",
              stroke: "transparent",
              duration: 0.32,
              stagger: 0.06,
              immediateRender: false,
            },
            "-=0.15",
          );

          // 5) Bienvenida
          tl.fromTo(
            welcomeRef.current,
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.4 },
            "+=0.05",
          );

          // 6) El overlay sale con clip-path y revela el hero
          tl.to(overlay, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.55,
            ease: "power3.inOut",
          });
        }, overlay);
      } catch {
        window.clearTimeout(hardStop);
        // No marcar la visita: la intro no llegó a verse.
        finish(false);
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(hardStop);
      if (ctx) ctx.revert();
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [finish]);

  if (gone) return null;

  return (
    <div
      ref={overlayRef}
      className="intro-overlay"
      role="status"
      aria-live="polite"
      aria-label={t("loading.label")}
    >
      <button
        ref={skipRef}
        type="button"
        className={styles.skip}
        onClick={() => {
          timelineRef.current?.kill();
          finish(true);
        }}
      >
        {t("loading.skip")}
      </button>

      <div className={styles.stage}>
        <OrbitSystem
          mode="loader"
          loaderRefs={{
            ringRef,
            innerRef,
            emblemCircleRef,
            emblemImageRef,
            spokeRefs,
            nodeRefs,
          }}
        />
        <p ref={welcomeRef} className={styles.welcome}>
          {t("loading.welcome")}
        </p>
      </div>
    </div>
  );
}
