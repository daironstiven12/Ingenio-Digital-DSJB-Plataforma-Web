"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useT } from "@/components/i18n/LanguageProvider";
import { resolveMotion } from "@/lib/motion";
import dynamic from "next/dynamic";
import OrbitSystem from "@/components/ui/OrbitSystem";
import HeroVideo from "./HeroVideo";
import useMagnetic from "@/lib/useMagnetic";
import useTheme from "@/lib/useTheme";
import styles from "./Hero.module.css";

// La escena 3D solo para tema claro; se importa de forma diferida
// (ssr: false) y no entra en el bundle inicial ni en tema oscuro.
const HeroGraph = dynamic(() => import("@/components/three/HeroGraph"), {
  ssr: false,
});

// Héroe a pantalla completa (100svh): contenido verticalmente centrado,
// parallax scrub al salir, sistema orbital interactivo y (tema claro)
// escena 3D "grafo vivo". En tema oscuro, vídeo + velo detrás del contenido.
// Indicador de scroll accesible.
export default function Hero() {
  const { t } = useT();
  const theme = useTheme();
  const isDark = theme === "dark";
  const [hintVisible, setHintVisible] = useState(true);
  const magneticRef = useMagnetic(6);
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const ringsRef = useRef(null);

  // Ocultar el indicador de scroll al salir del hero
  useEffect(() => {
    const onScroll = () => setHintVisible(window.scrollY < 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Parallax del héroe + rotación del anillo con el scroll (scrub)
  useEffect(() => {
    const section = sectionRef.current;
    const inner = innerRef.current;
    const rings = ringsRef.current;
    if (!section || !inner) return undefined;
    if (!resolveMotion().allowed) {
      return undefined;
    }

    let ctx;
    let cancelled = false;

    (async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          // El vídeo sube más lento que el contenido y se atenúa (scrub)
          const media = section.querySelector("[data-hero-media]");
          if (media) {
            gsap.fromTo(
              media,
              { yPercent: 0, opacity: 1 },
              {
                yPercent: 8,
                opacity: 0.35,
                ease: "none",
                immediateRender: false,
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.5,
                },
              },
            );
          }
          gsap.fromTo(
            inner,
            { y: 0, scale: 1, opacity: 1 },
            {
              y: -150,
              scale: 0.96,
              opacity: 0.18,
              ease: "none",
              immediateRender: false,
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom top",
                scrub: 0.6,
              },
            },
          );
          if (rings) {
            gsap.fromTo(
              rings,
              { rotate: 0 },
              {
                rotate: 160,
                ease: "none",
                immediateRender: false,
                scrollTrigger: {
                  trigger: section,
                  start: "top top",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
          }
        }, section);

        // Contenido legible en <500 ms desde que entra en pantalla
        ScrollTrigger.refresh();
      } catch {
        // Sin animación: héroe estático visible.
      }
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      id="inicio"
      aria-labelledby="hero-titulo"
    >
      {/* Tema oscuro: poster + (vídeo opcional) + velo · tema claro: lavender + 3D */}
      {isDark ? (
        <>
          <Image
            src="/media/hero-poster.jpg"
            alt=""
            fill
            sizes="100vw"
            className={styles.poster}
            aria-hidden="true"
            priority
          />
          <HeroVideo />
          <div className="hero-veil" aria-hidden="true" />
        </>
      ) : (
        <HeroGraph />
      )}
      {!isDark ? <div className={styles.veilLight} aria-hidden="true" /> : null}
      <div className={styles.glowBlue} aria-hidden="true" />
      <div className={styles.glowViolet} aria-hidden="true" />

      <div ref={innerRef} className={`container ${styles.inner}`}>
        <div className={styles.copy}>
          <span className={styles.accentLine} aria-hidden="true" />
          <p className={`eyebrow ${styles.eyebrow}`}>{t("hero.eyebrow")}</p>
          <h1 id="hero-titulo" className={styles.title}>
            {t("hero.titleBefore")}
            <span className={styles.titleKeyword}>{t("hero.titleKeyword")}</span>
          </h1>
          <p className={styles.lead}>{t("hero.lead")}</p>
          <div className={styles.actions}>
            <a ref={magneticRef} href="#proyectos" className="btn-primary">
              {t("hero.ctaPrimary")}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <a href="#propuesta" className="btn-secondary">
              {t("hero.ctaSecondary")}
            </a>
          </div>
        </div>

        <OrbitSystem mode="hero" ringsRef={ringsRef} />
      </div>

      {/* Indicador de scroll: enlace accesible; se oculta al hacer scroll */}
      <a
        href="#especializaciones"
        className={`${styles.scrollHint} ${hintVisible ? "" : styles.scrollHintHidden}`}
        aria-label={t("hero.scrollHint")}
      >
        <ChevronDown size={20} aria-hidden="true" />
        <span className="sr-only">{t("hero.scrollHintShort")}</span>
      </a>
    </section>
  );
}
