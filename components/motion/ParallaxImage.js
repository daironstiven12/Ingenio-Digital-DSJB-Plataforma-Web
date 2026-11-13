"use client";

import { useEffect, useRef } from "react";
import { resolveMotion } from "@/lib/motion";
import Image from "next/image";

// Imagen con revelado clip-path + parallax interno (la imagen se mueve
// más lento que su marco, con scrub) y escalado 1.08 → 1 al entrar.
// Se anima si el movimiento está permitido; sin movimiento, estática.
export default function ParallaxImage({
  src,
  alt,
  sizes,
  priority = false,
  className = "",
}) {
  const frameRef = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const frame = frameRef.current;
    const img = imgRef.current;
    if (!frame || !img) return undefined;

    let ctx;
    let cancelled = false;

    (async () => {
      try {
        const { gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);
        // No restituye estado al cambiar la altura de viewport en móvil (barra dinámica del navegador):
        ScrollTrigger.config({ ignoreMobileResize: true });

        const motion = resolveMotion();
        if (motion.allowed) {
          const inner = gsap.context(() => {
            // Revelado con clip-path desde abajo
            gsap.fromTo(
              frame,
              { clipPath: "inset(14% 6% 14% 6% round 20px)" },
              {
                clipPath: "inset(0% 0% 0% 0% round 20px)",
                duration: 0.7,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: {
                  trigger: frame,
                  start: "top 85%",
                  once: true,
                },
              },
            );
            // Escalado de entrada 1.08 → 1
            gsap.fromTo(
              img,
              { scale: 1.08 },
              {
                scale: 1,
                duration: 0.7,
                ease: "power3.out",
                immediateRender: false,
                scrollTrigger: {
                  trigger: frame,
                  start: "top 85%",
                  once: true,
                },
              },
            );
            // Parallax interno con scrub
            gsap.fromTo(
              img,
              { yPercent: -7 },
              {
                yPercent: 7,
                ease: "none",
                immediateRender: false,
                scrollTrigger: {
                  trigger: frame,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          }, frame);
          ctx = { revert: () => inner.revert() };
        }

        ScrollTrigger.refresh();
      } catch {
        // Sin animación: imagen estática visible.
      }
    })();

    return () => {
      cancelled = true;
      if (ctx) ctx.revert();
    };
  }, []);

  return (
    <div ref={frameRef} className={className}>
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="parallax-img"
      />
    </div>
  );
}
