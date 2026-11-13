"use client";

// Panel de depuración SOLO en desarrollo o con NEXT_PUBLIC_DEBUG=1.
// Requiere ?debug=1 en la URL — nunca activo por defecto en producción.
// No intercepta el scroll: la caja es pointer-events: none (solo el botón
// "Copiar" re-habilita eventos para sí mismo).
// Muestra clases de <html>, overflow de html/body, scrollHeight vs
// innerHeight, elemento en el centro y a la altura del header, UA,
// prefers-reduced-motion y la decisión de movimiento/intro expuesta en
// window.__motion.

import { useEffect, useState } from "react";
import { Copy, Check } from "lucide-react";
import styles from "./DebugPanel.module.css";

function describe(element) {
  if (!element) return "(ninguno)";
  const id = element.id ? `#${element.id}` : "";
  const cls = element.className
    ? `.${String(element.className).split(" ").filter(Boolean).slice(0, 3).join(".")}`
    : "";
  return `${element.tagName.toLowerCase()}${id}${cls}`;
}

function snapshot() {
  const root = document.documentElement;
  const body = document.body;
  const rootStyle = getComputedStyle(root);
  const bodyStyle = getComputedStyle(body);
  const header = document.querySelector("header");
  const headerHeight = header?.offsetHeight ?? 64;
  const centerX = Math.floor(window.innerWidth / 2);
  const centerY = Math.floor(window.innerHeight / 2);
  const midX = centerX;

  let reduced = "no soportado";
  try {
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "true"
      : "false";
  } catch {
    reduced = "no soportado";
  }

  const motion = window.__motion ?? null;

  return {
    htmlClasses: root.className || "(ninguna)",
    htmlOverflow: rootStyle.overflow,
    bodyOverflow: bodyStyle.overflow,
    scrollHeight: `${document.documentElement.scrollHeight} vs innerHeight ${window.innerHeight}`,
    centerElement: describe(document.elementFromPoint(centerX, centerY)),
    headerElement: describe(document.elementFromPoint(midX, headerHeight + 2)),
    headerHeight,
    userAgent: navigator.userAgent,
    reducedMotion: reduced,
    motionDecision: motion
      ? `reason=${motion.reason} · allowed=${motion.allowed}`
      : "(sin decisión expuesta)",
    introState: ["intro-on", "intro-done", "scroll-locked", "nav-loading", "motion-off"]
      .map((cls) => `${cls}:${root.classList.contains(cls)}`)
      .join(" "),
  };
}

export default function DebugPanel() {
  const [enabled, setEnabled] = useState(false);
  const [snap, setSnap] = useState(null);
  const [copied, setCopied] = useState(false);

  // Activación solo en cliente (evita mismatch de hidratación): NODE_ENV o NEXT_PUBLIC_DEBUG=1 + ?debug=1
  useEffect(() => {
    const dev = process.env.NODE_ENV !== "production";
    const allowed = dev || process.env.NEXT_PUBLIC_DEBUG === "1";
    if (!allowed) return undefined;
    let params;
    try {
      params = new URLSearchParams(window.location.search);
    } catch {
      return undefined;
    }
    if (params.get("debug") !== "1") return undefined;
    const raf = requestAnimationFrame(() => setEnabled(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Muestreo ligero (~400 ms) + eventos no bloqueantes
  useEffect(() => {
    if (!enabled) return undefined;
    const update = () => setSnap(snapshot());
    const raf = requestAnimationFrame(update);
    const interval = window.setInterval(update, 400);
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    document.addEventListener("visibilitychange", update);
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(interval);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [enabled]);

  if (!enabled || !snap) return null;

  const text = Object.entries(snap)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard no disponible: no hacemos nada más
    }
  };

  return (
    <aside className={styles.panel} aria-label="Panel de depuración">
      <pre className={styles.pre}>{text}</pre>
      <button type="button" className={styles.copy} onClick={copy}>
        {copied ? (
          <Check size={12} aria-hidden="true" />
        ) : (
          <Copy size={12} aria-hidden="true" />
        )}
        <span>{copied ? "Copiado" : "Copiar"}</span>
      </button>
    </aside>
  );
}
