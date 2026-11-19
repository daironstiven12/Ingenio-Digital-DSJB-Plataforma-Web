"use client";

// Compositor clásico (pre-flujo conversacional): mensaje + envío por
// wa.me / mailto, sincronizado con los datos de contacto reales.
// Vive plegado bajo "Prefiero escribir directamente" en el flujo; se
// extrajo intacto del cierre de la página.
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Mail, MessageCircle } from "lucide-react";
import { contact } from "@/data/site";
import { useT } from "@/components/i18n/LanguageProvider";
import styles from "@/components/sections/FinalCTA.module.css";

export default function DirectComposer() {
  const { t } = useT();
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef(null);

  const hasWhatsapp =
    typeof contact.whatsapp === "string" && contact.whatsapp.trim().length > 0;
  const hasEmail =
    typeof contact.email === "string" && contact.email.trim().length > 0;

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
      // clipboard bloqueado (permiso): nada que copiar
    }
  };

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>
          {t("sections.finalCta.nameLabel")}
        </span>
        <input
          type="text"
          className={styles.input}
          value={name}
          onChange={(event) => setName(event.target.value)}
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
          onChange={(event) => setMessage(event.target.value.slice(0, 600))}
          maxLength={600}
          required
          rows={4}
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
            onClick={(event) => {
              if (!canSend) event.preventDefault();
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
            onClick={(event) => {
              if (!canSend) event.preventDefault();
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
            {copied ? t("sections.finalCta.copied") : t("sections.finalCta.copyEmail")}
          </button>
        ) : null}
      </div>

      <p className={styles.microcopy}>{t("sections.finalCta.microcopy")}</p>
    </form>
  );
}
