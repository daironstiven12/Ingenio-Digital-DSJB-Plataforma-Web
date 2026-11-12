"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { resolveMotion } from "@/lib/motion";

// Vídeo del bento de Especializaciones (Circuitos digitales, H.264/WebM).
// - Se muestra solo en ≥768 px, sin prefers-reduced-motion y sin saveData.
// - preload="none": se empieza a cargar solo al acercarse al viewport
//   (IntersectionObserver, rootMargin amplio). Se pausa al salir.
// - Sin flag o sin archivo, la celda muestra el poster (sin 404 ni red extra).
export default function SpecializationsVideo({ posterAlt = "" }) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [near, setNear] = useState(false);

  // Condiciones de entorno
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const motion = resolveMotion();
    const saveData =
      typeof navigator !== "undefined" && (navigator.connection?.saveData ?? false);

    const update = () =>
      setEnabled(
        site.media?.specializationsVideo === true &&
          wide.matches &&
          motion.allowed &&
          !saveData,
      );

    update();
    wide.addEventListener("change", update);
    // El movimiento no cambia sin recargar (sessionStorage/preferencia).
    return () => {
      wide.removeEventListener("change", update);
    };
  }, []);

  // Carga anticipada suave: al acercarse al viewport, el vídeo monta y reproduce
  useEffect(() => {
    if (!enabled) return undefined;
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px", threshold: 0 },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [enabled]);

  // Pausar cuando sale del viewport
  useEffect(() => {
    if (!enabled || !near) return undefined;
    const video = videoRef.current;
    if (!video) return undefined;
    const wrap = wrapRef.current;
    if (!wrap) return undefined;

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
  }, [enabled, near]);

  return (
    <div ref={wrapRef} className="specializations-video">
      {/* Poster como base: sin vídeo activo o fuera de condiciones, el bento
          sigue mostrando la escena en vez de hueco vacío. */}
      <Image
        src="/media/hero-poster.jpg"
        alt={posterAlt}
        fill
        sizes="(min-width: 1024px) 400px, 100vw"
        className="specializations-poster"
      />
      {enabled && near ? (
        <video
          ref={videoRef}
          className="specializations-video-el"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/hero-poster.jpg"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/media/hero.webm" type="video/webm" />
          <source src="/media/hero.mp4" type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
