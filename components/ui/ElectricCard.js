"use client";

import { useEffect, useRef, useState } from "react";
import { resolveMotion } from "@/lib/motion";
import styles from "./ElectricCard.module.css";

// Tarjeta "eléctrica" reutilizable: borde con corriente, glow de fondo,
// badge, título, descripción y acciones (children).
// Tonos: blue (#2F7BFF) · violet (#7C5CFF) · cyan (#22D3EE).
// El filtro SVG solo se activa cuando la tarjeta está en el viewport
// (.live) + puntero fino + movimiento permitido + ≥768 px.
// Tilt 3D solo con puntero fino (≤8°, perspectiva en .frame).

export default function ElectricCard({
  badge,
  title,
  description,
  tone = "blue",
  className = "",
  as: Tag = "article",
  leading = null,
  children,
}) {
  const cardRef = useRef(null);
  const frameRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return undefined;

    const motion = resolveMotion();
    if (!motion.allowed) return undefined;

    // Solo con puntero fino y pantalla ancha
    if (
      !window.matchMedia("(pointer: fine)").matches ||
      window.innerWidth < 768
    ) {
      return undefined;
    }

    const update = (visible, state) => {
      // Pausa del filtro fuera del viewport y con la pestaña oculta
      setLive(visible && state !== "hidden");
    };

    const io = new IntersectionObserver(
      ([entry]) => update(entry.isIntersecting, document.visibilityState),
      { rootMargin: "120px", threshold: 0.05 },
    );
    io.observe(node);

    const onVisibility = () => {
      const rect = node.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight && rect.bottom > 0;
      update(inView, document.visibilityState);
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // Tilt 3D (puntero fino, movimiento permitido)
  useEffect(() => {
    const node = cardRef.current;
    if (!node) return undefined;
    if (!window.matchMedia("(pointer: fine)").matches) return undefined;
    if (!resolveMotion().allowed) return undefined;

    let raf = 0;
    const onPointerMove = (event) => {
      const rect = node.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateX = (0.5 - py) * 9;
      const rotateY = (px - 0.5) * 11;
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        node.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
        node.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
      });
    };
    const onPointerLeave = () => {
      cancelAnimationFrame(raf);
      node.style.setProperty("--tilt-x", "0deg");
      node.style.setProperty("--tilt-y", "0deg");
    };

    node.addEventListener("pointermove", onPointerMove, { passive: true });
    node.addEventListener("pointerleave", onPointerLeave);
    return () => {
      cancelAnimationFrame(raf);
      node.removeEventListener("pointermove", onPointerMove);
      node.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <Tag
      ref={cardRef}
      className={`${styles.card} ${styles[`tone_${tone}`]} ${live ? styles.live : ""} ${className}`}
    >
      {/* Marco con borde en degradado (light) o sólido (dark) */}
      <span className={styles.frame} aria-hidden="true" />

      {/* Borde eléctrico distorsionado (doble capa SVG, filtro solo .live) */}
      <svg className={styles.borderSvg} viewBox="0 0 100 143" preserveAspectRatio="none" aria-hidden="true">
        <rect
          className={`${styles.borderRect} ${styles.borderRectB}`}
          x="2.5"
          y="2.5"
          width="95"
          height="138"
          rx="9"
          pathLength="100"
        />
        <rect
          className={`${styles.borderRect} ${styles.borderRectA}`}
          x="2.5"
          y="2.5"
          width="95"
          height="138"
          rx="9"
          pathLength="100"
        />
      </svg>

      {/* Glows */}
      <span className={styles.glowA} aria-hidden="true" />
      <span className={styles.glowB} aria-hidden="true" />
      <span className={styles.bgGlow} aria-hidden="true" />

      {/* Contenido */}
      <div className={styles.content}>
        {leading ? <div className={styles.leading}>{leading}</div> : null}
        {badge ? <span className={styles.badge}>{badge}</span> : null}
        {title ? <h3 className={styles.title}>{title}</h3> : null}
        {description ? <p className={styles.description}>{description}</p> : null}
        <span className={styles.divider} aria-hidden="true" />
        {children ? <div className={styles.actions}>{children}</div> : null}
      </div>
    </Tag>
  );
}
