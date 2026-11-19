"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleAlert,
  Copy,
  Globe,
  Workflow,
  Network,
  Cpu,
  GraduationCap,
  HelpCircle,
  LoaderCircle,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { useT } from "@/components/i18n/LanguageProvider";
import { site, contact } from "@/data/site";
import { CONTACT_FLOW } from "@/data/contact-flow";
import useTheme from "@/lib/useTheme";
import DirectComposer from "./DirectComposer";
import ContactChannels from "./ContactChannels";
import styles from "./ContactFlow.module.css";

// Iconos Lucide por id de opción (los ids viven en data/contact-flow.js)
const NEED_ICONS = {
  Globe: Globe,
  Workflow: Workflow,
  Network: Network,
  Cpu: Cpu,
  GraduationCap: GraduationCap,
  HelpCircle: HelpCircle,
};

const AREA_STYLE = {
  software: { color: "#2f7bff", soft: "rgba(47, 123, 255, 0.16)" },
  arquitectura: { color: "#7c5cff", soft: "rgba(124, 92, 255, 0.16)" },
  redes: { color: "#22d3ee", soft: "rgba(34, 211, 238, 0.16)" },
  electronica: { color: "#19e3d0", soft: "rgba(25, 227, 208, 0.16)" },
  formacion: { color: "#ffb454", soft: "rgba(255, 180, 84, 0.18)" },
};
// Variantes con contraste AA en tema claro
const AREA_STYLE_LIGHT = {
  software: { color: "#2563eb", soft: "rgba(37, 99, 235, 0.12)" },
  arquitectura: { color: "#7c3aed", soft: "rgba(124, 58, 237, 0.12)" },
  redes: { color: "#0e7490", soft: "rgba(14, 116, 144, 0.12)" },
  electronica: { color: "#0d9488", soft: "rgba(13, 148, 136, 0.12)" },
  formacion: { color: "#b45309", soft: "rgba(180, 83, 9, 0.14)" },
};

const STEP_AREAS = Object.fromEntries(
  CONTACT_FLOW.needs.map((need) => [need.id, need.area]),
);

const EMPTY_ANSWERS = {
  need: null,
  detail: null,
  audience: null,
  timing: null,
  name: "",
  email: "",
  phone: "",
  preferred: null,
  message: "",
  consent: false,
  website: "", // honeypot
};

const SAMPLE_ANSWERS = {
  need: "web",
  detail: "venta",
  audience: "negocio",
  timing: "pronto",
  name: "Alex Rivera",
  email: "alex@example.com",
  phone: "+57 300 123 4567",
  preferred: "email",
  message: "Quiero una tienda en línea para mi catálogo.",
  consent: true,
  website: "",
};

const PHONE_DIGITS = (value) => String(value ?? "").replace(/\D/g, "");
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

// Orden de pasos visibles; "otra" salta el paso de detalle.
function stepsFor(need) {
  return need === "otra"
    ? ["need", "audience", "timing", "contact"]
    : ["need", "detail", "audience", "timing", "contact"];
}

export default function ContactFlow() {
  const { t, lang } = useT();
  const [phase, setPhase] = useState("cta"); // cta | flow | done | error
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState(EMPTY_ANSWERS);
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);
  const [directOpen, setDirectOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState(null); // { email, whatsapp } del servidor

  const changeTimer = useRef(null);
  const contactStartedAt = useRef(0);
  const legendRef = useRef(null);
  const copyTimer = useRef(null);

  const areaKey = answers.need ? STEP_AREAS[answers.need] : null;
  const theme = useTheme();
  const isLight = theme === "light";
  const areaStyle = areaKey
    ? (isLight ? AREA_STYLE_LIGHT[areaKey] : AREA_STYLE[areaKey])
    : null;

  const visibleSteps = stepsFor(answers.need);
  const totalSteps = visibleSteps.length;
  const stepId = visibleSteps[Math.min(stepIndex, totalSteps - 1)];
  const isDev = process.env.NODE_ENV !== "production";

  // Foco al título de la pregunta en cada paso
  useEffect(() => {
    if (phase !== "flow") return;
    const node = legendRef.current;
    if (node) node.focus({ preventScroll: true });
  }, [phase, stepIndex]);

  useEffect(
    () => () => {
      if (changeTimer.current) window.clearTimeout(changeTimer.current);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    [],
  );

  // Solo desarrollo: ?cfStep=1..5 renderiza un paso con datos de ejemplo
  useEffect(() => {
    if (!isDev) return;
    let cancelled = false;
    try {
      const match = /[?&]cfStep=([1-5])(?:&|$)/.exec(window.location.search);
      if (!match) return;
      const index = Number(match[1]) - 1;
      window.setTimeout(() => {
        if (cancelled) return;
        const sample = { ...SAMPLE_ANSWERS };
        setAnswers(sample);
        setStepIndex(Math.min(index, stepsFor(sample.need).length - 1));
        setPhase("flow");
      }, 0);
    } catch {
      // sin window (SSR): nada
    }
    return () => {
      cancelled = true;
    };
  }, [isDev]);

  useEffect(() => {
    if (stepId === "contact") contactStartedAt.current = Date.now();
  }, [stepId]);

  const setAnswer = useCallback((key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Selección de tarjeta de opción: conserva la elección, avanza en ~350 ms
  const selectAndAdvance = useCallback((key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    if (changeTimer.current) window.clearTimeout(changeTimer.current);
    changeTimer.current = window.setTimeout(() => {
      setStepIndex((current) => {
        const list = stepsFor(answers.need);
        // "need" recién elegido puede cambiar el total de pasos
        if (key === "need") {
          return Math.min(current + 1, stepsFor(value).length - 1);
        }
        return Math.min(current + 1, list.length - 1);
      });
    }, 350);
  }, [answers.need]);

  const goBack = useCallback(() => {
    setStepIndex((current) => Math.max(0, current - 1));
  }, []);

  const backToCta = useCallback(() => {
    setAnswers(EMPTY_ANSWERS);
    setStepIndex(0);
    setErrors({});
    setResponse(null);
    setPhase("cta");
  }, []);

  // ===== Validación del paso de contacto =====
  const validateContact = useCallback((current) => {
    const next = {};
    const name = current.name.trim();
    if (name.length < 2 || name.length > 80) next.name = t("contactFlow.errors.name");
    const email = current.email.trim().toLowerCase();
    const phoneDigits = PHONE_DIGITS(current.phone);
    const emailOk = email.length > 0 && EMAIL_RE.test(email);
    const phoneOk = phoneDigits.length >= 7 && phoneDigits.length <= 15;
    if (email.length > 0 && !emailOk) next.email = t("contactFlow.errors.email");
    if (phoneDigits.length > 0 && !phoneOk) next.phone = t("contactFlow.errors.phone");
    if (!emailOk && !phoneOk) next.contact = t("contactFlow.errors.contact");
    if (current.message.length > 500) next.message = t("contactFlow.errors.message");
    if (!current.consent) next.consent = t("contactFlow.errors.consent");
    return next;
  }, [t]);

  const handleSubmit = useCallback(async (event) => {
    if (event) event.preventDefault();
    if (submitting) return;
    const snapshot = { ...answers, name: answers.name.trim() };
    const nextErrors = validateContact(snapshot);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      // Llevar foco al primer campo con error
      const first = document.querySelector("[data-field-error='true'] input, [data-field-error='true'] textarea, [data-field-error='true']");
      if (first instanceof HTMLElement) first.focus();
      return;
    }
    setSubmitting(true);
    try {
      const elapsed = contactStartedAt.current ? Date.now() - contactStartedAt.current : 9999;
      const payload = {
        need: snapshot.need,
        detail: snapshot.need === "otra" ? null : snapshot.detail,
        audience: snapshot.audience,
        timing: snapshot.timing,
        name: snapshot.name,
        email: snapshot.email.trim() || undefined,
        phone: snapshot.phone.trim() || undefined,
        preferred: snapshot.preferred ?? undefined,
        message: snapshot.message.trim() || undefined,
        consent: true,
        lang,
        hp: snapshot.website,
        elapsedMs: elapsed,
      };
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data = null;
      try {
        data = await res.json();
      } catch {
        data = null;
      }
      if (res.ok && data?.ok) {
        setResponse({ email: data.email ?? "skipped", whatsapp: data.whatsapp ?? "skipped" });
        setPhase("done");
      } else {
        setPhase("error");
      }
    } catch {
      setPhase("error");
    } finally {
      setSubmitting(false);
    }
  }, [answers, lang, submitting, validateContact]);

  // ===== Resumen (pantalla de éxito y copia/WhatsApp) — siempre en español
  const summaryLines = useMemo(() => {
    const findLabel = (list, id) =>
      list.find((option) => option.id === id)?.label ?? null;
    const lines = [];
    const needLabel = findLabel(CONTACT_FLOW.needs, answers.need);
    if (needLabel) lines.push(`${t("contactFlow.summary.need")}: ${needLabel.es}`);
    if (answers.need !== "otra") {
      const detailLabel = CONTACT_FLOW.details[answers.need]?.find(
        (option) => option.id === answers.detail,
      )?.label;
      if (detailLabel) lines.push(`${t("contactFlow.summary.detail")}: ${detailLabel.es}`);
    }
    const audienceLabel = findLabel(CONTACT_FLOW.audiences, answers.audience);
    if (audienceLabel) lines.push(`${t("contactFlow.summary.audience")}: ${audienceLabel.es}`);
    const timingLabel = findLabel(CONTACT_FLOW.timings, answers.timing);
    if (timingLabel) lines.push(`${t("contactFlow.summary.timing")}: ${timingLabel.es}`);
    lines.push(`${t("contactFlow.summary.name")}: ${answers.name.trim()}`);
    const email = answers.email.trim();
    const phone = answers.phone.trim();
    if (email) lines.push(`${t("contactFlow.summary.email")}: ${email}`);
    if (phone) lines.push(`${t("contactFlow.summary.phone")}: ${phone}`);
    if (answers.preferred) {
      lines.push(
        `${t("contactFlow.summary.preferred")}: ${
          answers.preferred === "whatsapp" ? "WhatsApp" : t("contactFlow.summary.email")
        }`,
      );
    }
    if (answers.message.trim()) {
      lines.push(`${t("contactFlow.summary.message")}: ${answers.message.trim()}`);
    }
    return lines;
  }, [answers, t]);

  const summaryText = summaryLines.join("\n");

  const whatsappSummary = useMemo(
    () =>
      summaryText
        .replace(/\n/g, " · ")
        .replace(/\s{2,}/g, " ")
        .trim()
        .slice(0, 550),
    [summaryText],
  );

  const whatsappNumber =
    typeof contact.whatsapp === "string" && contact.whatsapp.trim()
      ? contact.whatsapp.replace(/\D/g, "")
      : null;

  const copySummary = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // clipboard bloqueado: la confirmación queda como no copiada
      setCopied(false);
    }
  }, [summaryText]);

  const startOver = useCallback(() => {
    setAnswers(EMPTY_ANSWERS);
    setStepIndex(0);
    setErrors({});
    setResponse(null);
    setPhase("cta");
  }, []);

  // ===== Texto derivado para lector de pantalla (sin efectos) =====
  const announceText =
    phase === "flow"
      ? t("contactFlow.stepAnnounce")
          .replace("{n}", String(stepIndex + 1))
          .replace("{total}", String(totalSteps))
      : phase === "done"
        ? t("contactFlow.success.announce")
        : phase === "error"
          ? t("contactFlow.error.announce")
          : "";

  // ===== Render =====
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  if (phase === "done") {
    return (
      <div className={styles.flowCard} data-phase="done">
        <div className={styles.successBadge} aria-hidden="true">
          <Check size={28} strokeWidth={2.5} />
        </div>
        <h3 className={styles.successTitle}>{t("contactFlow.success.title")}</h3>
        <p className={styles.successLead}>
          {response && (response.email === "sent" || response.whatsapp === "sent")
            ? t("contactFlow.success.sentLead")
            : t("contactFlow.success.dryRunLead")}
        </p>
        {site.contact?.responseTime ? (
          <p className={styles.responseTime}>{site.contact.responseTime}</p>
        ) : null}
        <ul className={styles.summaryList}>
          {summaryLines.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
        <div className={styles.successActions}>
          {whatsappNumber ? (
            <a
              className={styles.whatsappButton}
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappSummary)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} aria-hidden="true" />
              {t("contactFlow.success.whatsapp")}
            </a>
          ) : null}
          <button type="button" className={styles.secondaryButton} onClick={copySummary}>
            {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            {copied ? t("contactFlow.success.copied") : t("contactFlow.success.copy")}
          </button>
          <button type="button" className={styles.ghostButton} onClick={startOver}>
            {t("contactFlow.success.again")}
          </button>
        </div>
        <p className="sr-only" role="status" aria-live="polite">{copied ? t("contactFlow.success.copied") : ""}</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className={styles.flowCard} data-phase="error">
        <div className={styles.errorBadge} aria-hidden="true">
          <CircleAlert size={28} strokeWidth={2} />
        </div>
        <h3 className={styles.successTitle}>{t("contactFlow.error.title")}</h3>
        <p className={styles.successLead}>{t("contactFlow.error.lead")}</p>
        <ul className={styles.summaryList}>
          {summaryLines.map((line, index) => (
            <li key={index}>{line}</li>
          ))}
        </ul>
        <div className={styles.successActions}>
          <button type="button" className={styles.primaryButton} onClick={handleSubmit} disabled={submitting}>
            {submitting ? (
              <LoaderCircle size={18} aria-hidden="true" className={styles.spin} />
            ) : (
              <ArrowRight size={18} aria-hidden="true" />
            )}
            {t("contactFlow.error.retry")}
          </button>
        </div>
        <p className={styles.errorHint}>{t("contactFlow.error.directHint")}</p>
        <ContactChannels className={styles.errorChannels} />
      </div>
    );
  }

  const stepQuestion = stepId
    ? t(`contactFlow.steps.${stepId}.title`)
    : "";

  return (
    <div className={styles.flowWrap}>
      {phase === "cta" ? (
        <div className={styles.flowCard} data-phase="cta">
          <p className={`eyebrow ${styles.ctaEyebrow}`}>{t("contactFlow.cta.eyebrow")}</p>
          <h3 className={styles.ctaTitle}>{t("contactFlow.cta.title")}</h3>
          <p className={styles.ctaLead}>{t("contactFlow.cta.lead")}</p>
          <button type="button" className={styles.primaryButton} onClick={() => setPhase("flow")}>
            {t("contactFlow.cta.start")}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      ) : (
        <div
          className={styles.flowCard}
          data-phase="flow"
          data-area={areaKey ?? undefined}
          style={areaStyle ? { "--area-color": areaStyle.color, "--area-soft": areaStyle.soft } : undefined}
        >
          <div className={styles.flowHeader}>
            <button type="button" className={styles.backButton} onClick={stepIndex === 0 ? backToCta : goBack}>
              <ArrowLeft size={16} aria-hidden="true" />
              {t("contactFlow.back")}
            </button>
            <p className={styles.progressLabel}>
              {t("contactFlow.stepOf").replace("{n}", String(stepIndex + 1)).replace("{total}", String(totalSteps))}
            </p>
          </div>
          <div className={styles.progressTrack} aria-hidden="true">
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>

          <form
            className={styles.flowForm}
            onSubmit={handleSubmit}
            noValidate
            aria-describedby={Object.keys(errors).length ? "cf-errors" : undefined}
          >
            {stepId === "need" && (
              <fieldset className={styles.fieldset}>
                <legend ref={legendRef} tabIndex={-1} className={styles.question}>
                  {stepQuestion}
                </legend>
                <div className={styles.optionsList} role="radiogroup" aria-label={t("contactFlow.steps.need.group")}>
                  {CONTACT_FLOW.needs.map((option) => {
                    const Icon = NEED_ICONS[option.icon] ?? HelpCircle;
                    const selected = answers.need === option.id;
                    const style = isLight ? AREA_STYLE_LIGHT[option.area] : AREA_STYLE[option.area];
                    return (
                      <label
                        key={option.id}
                        className={`${styles.optionCard} ${selected ? styles.optionCardSelected : ""}`}
                        style={{ "--opt-color": style.color, "--opt-soft": style.soft }}
                      >
                        <input
                          type="radio"
                          name="need"
                          value={option.id}
                          className={styles.visuallyHidden}
                          checked={selected}
                          onChange={() => selectAndAdvance("need", option.id)}
                        />
                        <span className={styles.optionIcon} aria-hidden="true">
                          <Icon size={22} strokeWidth={1.8} />
                        </span>
                        <span className={styles.optionLabel}>
                          {t(`contactFlow.needs.${option.id}`)}
                        </span>
                        <span className={styles.optionCheck} aria-hidden="true">
                          {selected ? <Check size={18} strokeWidth={3} /> : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {stepId === "detail" && (
              <fieldset className={styles.fieldset}>
                <legend ref={legendRef} tabIndex={-1} className={styles.question}>
                  {stepQuestion}
                </legend>
                <div className={styles.optionsList}>
                  {CONTACT_FLOW.details[answers.need]?.map((option) => {
                    const selected = answers.detail === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`${styles.optionCard} ${styles.optionCardText} ${selected ? styles.optionCardSelected : ""}`}
                      >
                        <input
                          type="radio"
                          name="detail"
                          value={option.id}
                          className={styles.visuallyHidden}
                          checked={selected}
                          onChange={() => selectAndAdvance("detail", option.id)}
                        />
                        <span className={styles.optionLabel}>
                          {t(`contactFlow.details.${answers.need}.${option.id}`)}
                        </span>
                        <span className={styles.optionCheck} aria-hidden="true">
                          {selected ? <Check size={18} strokeWidth={3} /> : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {stepId === "audience" && (
              <fieldset className={styles.fieldset}>
                <legend ref={legendRef} tabIndex={-1} className={styles.question}>
                  {stepQuestion}
                </legend>
                <div className={styles.optionsList}>
                  {CONTACT_FLOW.audiences.map((option) => {
                    const selected = answers.audience === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`${styles.optionCard} ${styles.optionCardText} ${selected ? styles.optionCardSelected : ""}`}
                      >
                        <input
                          type="radio"
                          name="audience"
                          value={option.id}
                          className={styles.visuallyHidden}
                          checked={selected}
                          onChange={() => selectAndAdvance("audience", option.id)}
                        />
                        <span className={styles.optionLabel}>
                          {t(`contactFlow.audiences.${option.id}`)}
                        </span>
                        <span className={styles.optionCheck} aria-hidden="true">
                          {selected ? <Check size={18} strokeWidth={3} /> : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {stepId === "timing" && (
              <fieldset className={styles.fieldset}>
                <legend ref={legendRef} tabIndex={-1} className={styles.question}>
                  {stepQuestion}
                </legend>
                <div className={styles.optionsList}>
                  {CONTACT_FLOW.timings.map((option) => {
                    const selected = answers.timing === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`${styles.optionCard} ${styles.optionCardText} ${selected ? styles.optionCardSelected : ""}`}
                      >
                        <input
                          type="radio"
                          name="timing"
                          value={option.id}
                          className={styles.visuallyHidden}
                          checked={selected}
                          onChange={() => selectAndAdvance("timing", option.id)}
                        />
                        <span className={styles.optionLabel}>
                          {t(`contactFlow.timings.${option.id}`)}
                        </span>
                        <span className={styles.optionCheck} aria-hidden="true">
                          {selected ? <Check size={18} strokeWidth={3} /> : null}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {stepId === "contact" && (
              <fieldset className={styles.fieldset}>
                <legend ref={legendRef} tabIndex={-1} className={styles.question}>
                  {stepQuestion}
                </legend>
                {Object.keys(errors).length > 0 ? (
                  <div id="cf-errors" className={styles.errorSummary} data-field-error="true" role="alert" tabIndex={-1}>
                    <CircleAlert size={18} aria-hidden="true" />
                    <span>{t("contactFlow.errors.summary")}</span>
                  </div>
                ) : null}
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{t("contactFlow.fields.name")} <span aria-hidden="true">*</span></span>
                  <input
                    id="cf-name"
                    type="text"
                    className={styles.input}
                    value={answers.name}
                    onChange={(event) => setAnswer("name", event.target.value)}
                    autoComplete="name"
                    maxLength={80}
                    required
                    aria-invalid={errors.name ? "true" : undefined}
                    aria-describedby={errors.name ? "cf-name-error" : undefined}
                    data-field-error={errors.name ? "true" : undefined}
                  />
                  {errors.name ? (
                    <span id="cf-name-error" className={styles.fieldError} role="alert">{errors.name}</span>
                  ) : null}
                </label>
                <div className={styles.twoCols}>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>{t("contactFlow.fields.email")}</span>
                    <input
                      id="cf-email"
                      type="email"
                      className={styles.input}
                      value={answers.email}
                      onChange={(event) => setAnswer("email", event.target.value)}
                      autoComplete="email"
                      inputMode="email"
                      maxLength={254}
                      aria-invalid={errors.email ? "true" : undefined}
                      aria-describedby={errors.email ? "cf-email-error" : undefined}
                      data-field-error={errors.email ? "true" : undefined}
                    />
                    {errors.email ? (
                      <span id="cf-email-error" className={styles.fieldError} role="alert">{errors.email}</span>
                    ) : null}
                  </label>
                  <label className={styles.field}>
                    <span className={styles.fieldLabel}>{t("contactFlow.fields.phone")}</span>
                    <input
                      id="cf-phone"
                      type="tel"
                      className={styles.input}
                      value={answers.phone}
                      onChange={(event) => setAnswer("phone", event.target.value)}
                      autoComplete="tel"
                      inputMode="tel"
                      maxLength={24}
                      placeholder="+57 300 123 4567"
                      aria-invalid={errors.phone ? "true" : undefined}
                      aria-describedby={errors.phone ? "cf-phone-error" : undefined}
                      data-field-error={errors.phone ? "true" : undefined}
                    />
                    {errors.phone ? (
                      <span id="cf-phone-error" className={styles.fieldError} role="alert">{errors.phone}</span>
                    ) : null}
                  </label>
                </div>
                {errors.contact ? (
                  <p id="cf-contact-error" className={styles.fieldError} role="alert">{errors.contact}</p>
                ) : null}
                {answers.email.trim() && PHONE_DIGITS(answers.phone).length > 0 ? (
                  <fieldset className={styles.preferGroup}>
                    <legend className={styles.preferLegend}>{t("contactFlow.fields.preferred")}</legend>
                    <div className={styles.preferChips}>
                      {["email", "whatsapp"].map((value) => {
                        const active = answers.preferred === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            className={`${styles.chip} ${active ? styles.chipActive : ""}`}
                            aria-pressed={active}
                            onClick={() => setAnswer("preferred", active ? null : value)}
                          >
                            {value === "email" ? <Mail size={14} aria-hidden="true" /> : <MessageCircle size={14} aria-hidden="true" />}
                            {value === "email" ? t("contactFlow.fields.preferEmail") : "WhatsApp"}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ) : null}
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{t("contactFlow.fields.message")}</span>
                  <textarea
                    id="cf-message"
                    className={styles.textarea}
                    value={answers.message}
                    onChange={(event) => setAnswer("message", event.target.value.slice(0, 500))}
                    maxLength={500}
                    rows={3}
                    placeholder={t("contactFlow.fields.messagePlaceholder")}
                  />
                  <span className={styles.counter} aria-hidden="true">{answers.message.length}/500</span>
                </label>
                <div
                  className={`${styles.hp} ${answers.website ? "hp-filled" : ""}`}
                  aria-hidden="true"
                >
                  <label htmlFor="cf-website">Website</label>
                  <input
                    id="cf-website"
                    type="text"
                    name="website"
                    value={answers.website}
                    onChange={(event) => setAnswer("website", event.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>
                <div
                  className={`${styles.consentRow} ${errors.consent ? styles.consentError : ""}`}
                  data-field-error={errors.consent ? "true" : undefined}
                >
                  <input
                    id="cf-consent"
                    type="checkbox"
                    className={styles.consentInput}
                    checked={answers.consent}
                    onChange={(event) => setAnswer("consent", event.target.checked)}
                    required
                    aria-invalid={errors.consent ? "true" : undefined}
                    aria-describedby={errors.consent ? "cf-consent-error" : undefined}
                  />
                  <label htmlFor="cf-consent" className={styles.consentLabel}>
                    {t("contactFlow.consent.before")}
                    <a href="/privacidad">{t("contactFlow.consent.link")}</a>
                    {t("contactFlow.consent.after")}
                  </label>
                </div>
                {errors.consent ? (
                  <p id="cf-consent-error" className={styles.fieldError} role="alert">{errors.consent}</p>
                ) : null}
                <button type="submit" className={styles.primaryButton} disabled={submitting}>
                  {submitting ? (
                    <LoaderCircle size={18} aria-hidden="true" className={styles.spin} />
                  ) : (
                    <Send size={18} aria-hidden="true" />
                  )}
                  {t("contactFlow.submit")}
                </button>
              </fieldset>
            )}
          </form>
          <p className="sr-only" role="status" aria-live="polite">{announceText}</p>
        </div>
      )}

      {/* El compositor clásico queda plegado bajo esta divulgación */}
      <div className={styles.directWrap}>
        <button
          type="button"
          className={styles.directToggle}
          aria-expanded={directOpen}
          aria-controls="cf-direct"
          onClick={() => setDirectOpen((value) => !value)}
        >
          <span className={styles.directToggleLabel}>{t("contactFlow.direct.toggle")}</span>
          <span className={`${styles.directChevron} ${directOpen ? styles.directChevronOpen : ""}`} aria-hidden="true">›</span>
        </button>
        <div id="cf-direct" className={`${styles.directPanel} ${directOpen ? styles.directPanelOpen : ""}`}>
          {directOpen ? <DirectComposer /> : null}
        </div>
      </div>
    </div>
  );
}
