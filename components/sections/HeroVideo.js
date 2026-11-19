"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { resolveMotion } from "@/lib/motion";
import { waitForIntroOpening } from "@/lib/introWait";
import useTheme from "@/lib/useTheme";

// Vídeo de fondo del héroe (circuitos digitales, mismo archivo que el bento,
// sin duplicar). A sangre: inset 0, detrás del contenido. Se carga solo en
// ≥768 px, sin prefers-reduced-motion y sin saveData; en el resto, el hero
// conserva poster + resplandores. Se pausa al salir del viewport.
export default function HeroVideo() {
  const videoRef = useRef(null);
  const wrapRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const theme = useTheme();

  // El vídeo no compite durante el intro: espera a la apertura +150 ms
  useEffect(() => {
    let alive = true;
    waitForIntroOpening(150).then(() => {
      if (alive) setReady(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const motion = resolveMotion();
    const saveData =
      typeof navigator !== "undefined" && (navigator.connection?.saveData ?? false);

    // Vídeo SOLO en tema oscuro (en claro va la escena 3D)
    const update = () =>
      setEnabled(
        site.media?.heroVideo === true &&
          ready &&
          theme === "dark" &&
          wide.matches &&
          motion.allowed &&
          !saveData,
      );

    update();
    wide.addEventListener("change", update);
    return () => {
      wide.removeEventListener("change", update);
    };
  }, [theme, ready]);

  // Pausar cuando el héroe sale del viewport
  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!enabled || !wrap || !video) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.02 },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={wrapRef} className="hero-media" data-hero-media aria-hidden="true">
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/hero-poster.jpg"
        tabIndex={-1}
        aria-hidden="true"
      >
        <source src="/media/hero.webm" type="video/webm" />
        <source src="/media/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
