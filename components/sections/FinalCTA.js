"use client";

import { ArrowRight, Mail } from "lucide-react";
import { contact } from "@/data/site";
import { useT } from "@/components/i18n/LanguageProvider";
import Reveal from "@/components/motion/Reveal";
import useMagnetic from "@/lib/useMagnetic";
import styles from "./FinalCTA.module.css";

// Cierre: banda índigo profundo con texto claro (ambos temas).
// El botón solo se activa cuando existe un canal real (data/site.js).
export default function FinalCTA() {
  const { t } = useT();
  const magneticRef = useMagnetic(6);

  return (
    <section
      className={`band-cta ${styles.section}`}
      id="contacto"
      aria-labelledby="contacto-titulo"
    >
      <div className={`container ${styles.inner}`}>
        <Reveal className={styles.card} y={20}>
          <p className={`eyebrow ${styles.eyebrow}`}>{t("sections.finalCta.eyebrow")}</p>
          <h2 id="contacto-titulo" className={`section-title ${styles.title}`}>
            {t("sections.finalCta.title")}
          </h2>
          <p className={`section-lead ${styles.lead}`}>
            {t("sections.finalCta.lead")}
          </p>

          <div className={styles.actions}>
            {contact.email ? (
              <a
                ref={magneticRef}
                href={`mailto:${contact.email}`}
                className={`btn-primary ${styles.primary}`}
              >
                <Mail size={18} aria-hidden="true" />
                {t("sections.finalCta.emailCta")}
              </a>
            ) : (
              <p className={styles.pending}>{t("sections.finalCta.pending")}</p>
            )}
            <a href="#proyectos" className={`btn-secondary ${styles.secondary}`}>
              {t("sections.finalCta.projectsCta")}
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
