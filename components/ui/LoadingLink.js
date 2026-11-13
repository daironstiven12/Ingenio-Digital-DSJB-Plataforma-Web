"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/components/i18n/LanguageProvider";
import { resolveMotion } from "@/lib/motion";

// Enlace de "salida" (proyectos, repositorios, portafolio externo).
// Sigue siendo un <a href> real: SEO, teclado, Ctrl/Cmd+clic nativo.
//
// Clic izquierdo sin modificadores:
//   1. preventDefault
//   2. escribe el texto y --nav-accent en el overlay #nav-loader (global,
//      hijo de body, CSS-first, oculto por defecto);
//   3. añade la clase nav-loading a <html> (display:none → flex reinicia
//      las animaciones del orbital + barra de progreso; un reflow fuerza el
//      reinicio aunque la clase ya estuviera presente);
//   4. navega en la MISMA pestaña cuando la barra completa (animationend)
//      o, como techo, a los 2,2 s.
// Ctrl/Cmd/Shift/Alt o clic medio: comportamiento nativo, sin overlay.
// Sin movimiento permitido (o prefers-reduced-motion): navegación inmediata.
//
// bfcache: pageshow (persisted) / visibilitychange → quita nav-loading.
// Failsafe: 5 s con la clase puesta → se retira.
export default function LoadingLink({ href, children, className = "", label, accent, ...rest }) {
  const { t } = useT();
  const preconnected = useRef(false);
  const fallbackRef = useRef(null);
  const failsafeRef = useRef(null);

  useEffect(() => {
    const clear = () => {
      const html = document.documentElement;
      html.classList.remove("nav-loading");
      html.style.removeProperty("--nav-accent");
      if (failsafeRef.current) {
        window.clearTimeout(failsafeRef.current);
        failsafeRef.current = null;
      }
      const overlay = document.getElementById("nav-loader");
      if (overlay) overlay.setAttribute("aria-hidden", "true");
    };

    const onPageShow = (event) => {
      if (event.persisted) clear();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") clear();
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape" && document.documentElement.classList.contains("nav-loading")) {
        event.preventDefault();
        clear();
      }
    };

    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
      document.removeEventListener("keydown", onKeyDown);
      if (fallbackRef.current) window.clearTimeout(fallbackRef.current);
      if (failsafeRef.current) window.clearTimeout(failsafeRef.current);
    };
  }, []);

  // Preconexión: un único <link rel="preconnect"> del origen de destino
  const handlePreconnect = () => {
    if (preconnected.current) return;
    preconnected.current = true;
    try {
      const origin = new URL(href, window.location.href).origin;
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = origin;
      document.head.appendChild(link);
    } catch {
      // URL inválida: sin preconexión, nada más
    }
  };

  const handleClick = (event) => {
    const modified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (modified || event.button !== 0) return; // comportamiento nativo

    event.preventDefault();

    if (!resolveMotion().allowed) {
      window.location.assign(href);
      return;
    }

    const html = document.documentElement;
    const overlay = document.getElementById("nav-loader");
    if (!overlay) {
      window.location.assign(href);
      return;
    }

    const labelEl = overlay.querySelector("[data-nav-label]");
    const domainEl = overlay.querySelector("[data-nav-domain]");
    const progressEl = overlay.querySelector("[data-nav-progress]");

    if (labelEl) {
      labelEl.textContent = t("loading.openingProject").replace(
        "{name}",
        label ?? "",
      );
    }
    if (domainEl) {
      try {
        domainEl.textContent = new URL(href, window.location.href).hostname.replace(/^www\./, "");
      } catch {
        domainEl.textContent = href;
      }
    }
    html.style.setProperty("--nav-accent", accent || "#2f7bff");

    // Reiniciar las animaciones: retirar la clase → reflow → añadirla
    html.classList.remove("nav-loading");
    void html.offsetHeight;
    html.classList.add("nav-loading");
    overlay.setAttribute("aria-hidden", "false");

    const navigate = () => {
      if (fallbackRef.current) {
        window.clearTimeout(fallbackRef.current);
        fallbackRef.current = null;
      }
      window.location.assign(href);
    };

    if (progressEl) {
      progressEl.addEventListener("animationend", navigate, { once: true });
    }
    fallbackRef.current = window.setTimeout(navigate, 2200);

    // Failsafe: si por lo que sea la clase sigue tras 5 s, se retira
    failsafeRef.current = window.setTimeout(() => {
      html.classList.remove("nav-loading");
      html.style.removeProperty("--nav-accent");
      overlay.setAttribute("aria-hidden", "true");
    }, 5000);
  };

  return (
    <a
      href={href}
      className={className}
      onClick={handleClick}
      onPointerEnter={handlePreconnect}
      onFocus={handlePreconnect}
      {...rest}
    >
      {children}
    </a>
  );
}
