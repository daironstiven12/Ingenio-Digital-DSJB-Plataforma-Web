"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useT } from "@/components/i18n/LanguageProvider";
import { resolveMotion } from "@/lib/motion";
import { site } from "@/data/site";
import styles from "./LoadingLink.module.css";

// Enlace de "salida" (proyectos, repositorios, portafolio externo):
// sigue siendo un <a href> real con SEO y teclado.
// - Clic izquierdo sin modificadores: muestra un loader compacto de marca
//   (~1 s, "Abriendo proyecto…") y navega en la MISMA pestaña.
// - Ctrl/Cmd/Shift/Alt o clic medio: comportamiento nativo, sin animación.
// - Decisión de movimiento: sin movimiento, navegación inmediata.
// - NO usar en anclas internas (#sección).
export default function LoadingLink({ href, children, className = "", ...rest }) {
  const { t } = useT();
  const [opening, setOpening] = useState(false);
  const timerRef = useRef(null);

  useEffect(
    () => () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    },
    [],
  );

  const handleClick = (event) => {
    const modified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (modified || event.button !== 0) return; // comportamiento nativo

    event.preventDefault();

    if (!resolveMotion().allowed) {
      window.location.assign(href);
      return;
    }

    document.body.style.overflow = "hidden";
    setOpening(true);
    timerRef.current = window.setTimeout(() => {
      window.location.assign(href);
    }, 950);
  };

  return (
    <>
      <a href={href} className={className} onClick={handleClick} {...rest}>
        {children}
      </a>

      {opening ? (
        <div
          className={styles.overlay}
          role="status"
          aria-live="polite"
          aria-label={t("loading.opening")}
        >
          <div className={styles.emblemWrap}>
            <Image
              src={site.logo ?? "/logo.jpeg"}
              alt=""
              width={72}
              height={72}
              sizes="72px"
              className={styles.emblem}
              priority
            />
          </div>
          <p className={styles.label}>{t("loading.opening")}</p>
        </div>
      ) : null}
    </>
  );
}
