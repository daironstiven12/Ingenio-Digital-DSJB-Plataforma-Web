"use client";

// Canales directos para el visitante (wa.me / mailto). Se renderizan
// SOLO los configurados en data/site.js; con ninguno, una línea honesta.
// Compartidos por la columna izquierda del cierre y el estado de error
// del flujo de contacto (sin inventar canales).
import { ArrowRight, Mail, MessageCircle, Share2 } from "lucide-react";
import { contact, social } from "@/data/site";
import { useT } from "@/components/i18n/LanguageProvider";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import GithubIcon from "@/components/ui/GithubIcon";
import styles from "@/components/sections/FinalCTA.module.css";

const SOCIAL_META = {
  linkedin: { name: "LinkedIn", Icon: LinkedinIcon },
  github: { name: "GitHub", Icon: GithubIcon },
  facebook: { name: "Facebook", Icon: Share2 },
  instagram: { name: "Instagram", Icon: Share2 },
};

function hostnameOf(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export default function ContactChannels({ className }) {
  const { t } = useT();

  const socialLinks = Object.entries(social ?? {})
    .filter(
      ([key, url]) =>
        key in SOCIAL_META &&
        typeof url === "string" &&
        /^https?:\/\//.test(url),
    )
    .map(([key, url]) => ({
      key,
      url,
      name: SOCIAL_META[key].name,
      Icon: SOCIAL_META[key].Icon,
      host: hostnameOf(url) ?? "",
    }));

  const hasWhatsapp =
    typeof contact.whatsapp === "string" && contact.whatsapp.trim().length > 0;
  const hasEmail =
    typeof contact.email === "string" && contact.email.trim().length > 0;
  const digits = hasWhatsapp ? contact.whatsapp.replace(/\D/g, "") : "";

  if (!hasWhatsapp && !hasEmail && socialLinks.length === 0) {
    return <p className={styles.pending}>{t("sections.finalCta.pending")}</p>;
  }

  return (
    <ul
      className={`${styles.channels} ${className ?? ""}`}
      aria-label={t("sections.finalCta.channelsTitle")}
    >
      {hasWhatsapp ? (
        <li>
          <a
            className={styles.channelCard}
            href={`https://wa.me/${digits}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={20} aria-hidden="true" className={styles.channelIcon} />
            <span className={styles.channelText}>
              <span className={styles.channelName}>
                {t("sections.finalCta.channelWhatsapp")}
              </span>
              <span className={styles.channelHint}>+{digits}</span>
            </span>
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </li>
      ) : null}
      {hasEmail ? (
        <li>
          <a className={styles.channelCard} href={`mailto:${contact.email}`}>
            <Mail size={20} aria-hidden="true" className={styles.channelIcon} />
            <span className={styles.channelText}>
              <span className={styles.channelName}>
                {t("sections.finalCta.channelEmail")}
              </span>
              <span className={styles.channelHint}>{contact.email}</span>
            </span>
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </li>
      ) : null}
      {socialLinks.length > 0 ? (
        <li>
          <div className={styles.channelCardStatic}>
            <Share2 size={20} aria-hidden="true" className={styles.channelIcon} />
            <span className={styles.channelText}>
              <span className={styles.channelName}>
                {t("sections.finalCta.channelSocial")}
              </span>
              <span className={styles.socialRow}>
                {socialLinks.map(({ key, url, name, Icon, host }) => (
                  <a
                    key={key}
                    href={url}
                    className={styles.socialIconButton}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={name}
                  >
                    <Icon size={18} aria-hidden="true" />
                    <span className="sr-only">{host}</span>
                  </a>
                ))}
              </span>
            </span>
          </div>
        </li>
      ) : null}
    </ul>
  );
}
