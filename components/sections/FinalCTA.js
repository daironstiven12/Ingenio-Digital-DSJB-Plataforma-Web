"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, Copy, Mail, MessageCircle, Share2 } from "lucide-react";
import { contact, social } from "@/data/site";
import { useT } from "@/components/i18n/LanguageProvider";
import LinkedinIcon from "@/components/ui/LinkedinIcon";
import GithubIcon from "@/components/ui/GithubIcon";
import Reveal from "@/components/motion/Reveal";
import styles from "./FinalCTA.module.css";

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

// Cierre de la página: hub de contacto sin backend.
// Izquierda: título, texto y tarjetas de canal real (WhatsApp / Correo / Redes).
// Derecha: compositor (nombre opcional, mensaje obligatorio) con envío por
// WhatsApp (wa.me) y por correo (mailto), más copiar correo. Todo cliente:
// sin fetch, sin guardar nada. Sin canales configurados: estado honesto compacto.
export default function FinalCTA() {
  const { t } = useT();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef(null);

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

  const hasWhatsapp = typeof contact.whatsapp === "string" && contact.whatsapp.trim().length > 0;
  const hasEmail = typeof contact.email === "string" && contact.email.trim().length > 0;
  const hasSocial = socialLinks.length > 0;
  const hasAnyChannel = hasWhatsapp || hasEmail || hasSocial;

  const digits = useMemo(
    () => (hasWhatsapp ? contact.whatsapp.replace(/\D/g, "") : ""),
    [hasWhatsapp],
  );

  const composedText = useMemo(() => {
    const trimmed = message.trim();
    const signature = name.trim();
    return signature ? `${trimmed}\n\n— ${signature}` : trimmed;
  }, [message, name]);

  const waUrl = hasWhatsapp
    ? `https://wa.me/${digits}?text=${encodeURIComponent(composedText)}`
    : null;
  const mailUrl = hasEmail
    ? `mailto:${contact.email}?subject=${encodeURIComponent(t("sections.finalCta.subject"))}&body=${encodeURIComponent(composedText)}`
    : null;

  const canSend = message.trim().length > 0;

  useEffect(
    () => () => {
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
    },
    [],
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      if (copyTimerRef.current) window.clearTimeout(copyTimerRef.current);
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // clipboard bloqueado (permiso): nada que copiar, la UI lo refleja
    }
  };

  // Sin canales configurados: estado compacto y honesto, sin columnas vacías
  if (!hasAnyChannel) {
    return (
      <section
        className={`band-cta ${styles.section}`}
        id="contacto"
        aria-labelledby="contacto-titulo"
      >
        <div className={`container ${styles.inner}`}>
          <Reveal className={styles.card} y={20}>
            <p className={`eyebrow ${styles.eyebrow}`}>
              {t("sections.finalCta.eyebrow")}
            </p>
            <h2 id="contacto-titulo" className={`section-title ${styles.title}`}>
              {t("sections.finalCta.title")}
            </h2>
            <p className={`section-lead ${styles.lead}`}>
              {t("sections.finalCta.lead")}
            </p>
            <p className={styles.pending}>{t("sections.finalCta.pending")}</p>
          </Reveal>
        </div>
      </section>
    );
  }

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

            <ul className={styles.channels} aria-label={t("sections.finalCta.channelsTitle")}>
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
              {hasSocial ? (
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
          </Reveal>

          {/* Derecha: compositor */}
          <Reveal className={styles.composer} y={20} delay={0.1}>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  {t("sections.finalCta.nameLabel")}
                </span>
                <input
                  type="text"
                  className={styles.input}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  maxLength={120}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  {t("sections.finalCta.messageLabel")} <span aria-hidden="true">*</span>
                </span>
                <textarea
                  className={styles.textarea}
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 600))}
                  maxLength={600}
                  required
                  rows={5}
                  placeholder={t("sections.finalCta.messagePlaceholder")}
                />
                <span className={styles.counter} aria-hidden="true">
                  {message.length}/600
                </span>
              </label>

              <div className={styles.formActions}>
                {waUrl ? (
                  <a
                    className={`${styles.sendWhatsApp} ${canSend ? "" : styles.sendDisabled}`}
                    href={canSend ? waUrl : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-disabled={!canSend}
                    tabIndex={canSend ? 0 : -1}
                    onClick={(e) => {
                      if (!canSend) e.preventDefault();
                    }}
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    {t("sections.finalCta.sendWhatsApp")}
                  </a>
                ) : null}
                {mailUrl ? (
                  <a
                    className={`${styles.sendEmail} ${canSend ? "" : styles.sendDisabled}`}
                    href={canSend ? mailUrl : undefined}
                    aria-disabled={!canSend}
                    tabIndex={canSend ? 0 : -1}
                    onClick={(e) => {
                      if (!canSend) e.preventDefault();
                    }}
                  >
                    <Mail size={18} aria-hidden="true" />
                    {t("sections.finalCta.sendEmail")}
                  </a>
                ) : null}
                {hasEmail ? (
                  <button
                    type="button"
                    className={styles.copyEmail}
                    onClick={copyEmail}
                    aria-live="polite"
                  >
                    {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                    {copied
                      ? t("sections.finalCta.copied")
                      : t("sections.finalCta.copyEmail")}
                  </button>
                ) : null}
              </div>

              <p className={styles.microcopy}>
                {t("sections.finalCta.microcopy")}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
