"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/components/i18n/LanguageProvider";
import { triggerNavLoader } from "@/lib/nav-loader";

// Enlace de "salida" (proyectos, repositorios, portafolio externo).
// Sigue siendo un <a href> real: SEO, teclado, Ctrl/Cmd+clic nativo.
// - Clic izquierdo sin modificadores: loader CSS-first (#nav-loader global)
//   y navega en la MISMA pestaña. Ctrl/Cmd/Shift/clic medio: nativo.
// - Sin movimiento permitido: navegación inmediata.
// - NO usar en anclas internas (#sección).
export default function LoadingLink({
  href,
  children,
  className = "",
  label,
  accent,
  ...rest
}) {
  const { t } = useT();
  const preconnected = useRef(false);

  // Limpieza ante bfcache al volver con el botón Atrás
  useEffect(() => {
    const clear = () => {
      const html = document.documentElement;
      html.classList.remove("nav-loading");
      html.style.removeProperty("--nav-accent");
      const overlay = document.getElementById("nav-loader");
      if (overlay) overlay.setAttribute("aria-hidden", "true");
    };
    const onPageShow = (event) => {
      if (event.persisted) clear();
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") clear();
    };
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pageshow", onPageShow);
      document.removeEventListener("visibilitychange", onVisibility);
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
    if (modified || event.button !== 0) return;

    event.preventDefault();
    triggerNavLoader(href, {
      labelText: t("loading.openingProject").replace("{name}", label ?? ""),
      accent,
    });
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
