"use client";

import { useT } from "@/components/i18n/LanguageProvider";
import Reveal from "@/components/motion/Reveal";
import ContactChannels from "@/components/contact/ContactChannels";
import ContactFlow from "@/components/contact/ContactFlow";
import styles from "./FinalCTA.module.css";

// Cierre de la página: hub de contacto.
// Izquierda: título, texto y tarjetas de canal real (WhatsApp / Correo / Redes).
// Derecha: flujo de contacto conversacional ("Cuéntanos qué necesitas")
// con envío por correo (Resend) + WhatsApp (proveedor) vía /api/contact.
// El compositor clásico queda plegado bajo "Prefiero escribir directamente".
export default function FinalCTA() {
  const { t } = useT();

  return (
    <section
      className={`band-cta ${styles.section}`}
      id="contacto"
      aria-labelledby="contacto-titulo"
    >
      <div className={`container ${styles.inner}`}>
        <div className={styles.hub}>
          {/* Izquierda: título, texto y canales reales */}
          <Reveal className={styles.hubCopy} y={20}>
            <p className={`eyebrow ${styles.eyebrow}`}>
              {t("sections.finalCta.eyebrow")}
            </p>
            <h2 id="contacto-titulo" className={`section-title ${styles.title}`}>
              {t("sections.finalCta.title")}
            </h2>
            <p className={`section-lead ${styles.lead}`}>
              {t("sections.finalCta.lead")}
            </p>
            <ContactChannels />
          </Reveal>

          {/* Derecha: flujo conversacional (tarjeta + steps) */}
          <Reveal className={styles.composer} y={20} delay={0.1}>
            <ContactFlow />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
