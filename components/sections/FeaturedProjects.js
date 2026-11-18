"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarCheck, CircleDashed, Gift, Link2, Recycle, Store } from "lucide-react";
import LoadingLink from "@/components/ui/LoadingLink";
import useSpotlight from "@/lib/useSpotlight";
import { useT } from "@/components/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import styles from "./FeaturedProjects.module.css";

const DEMO_ENABLED =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_DEMO_PROJECT === "1";

function hostnameOf(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .filter((word) => /[A-Za-zÀ-ÿ0-9]/.test(word))
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

const projectIcons = {
  "asistencias-utch": CalendarCheck,
  "suenos-de-papiro": Gift,
  "panaderia-la-reina": Store,
  "binova-ia": Recycle,
};

function splitAccent(text) {
  const words = text.split(" ");
  const last = words.pop();
  if (!words.length) return text;
  return (
    <>
      {words.join(" ")}{" "}
      <span className={styles.titleAccent}>{last}</span>
    </>
  );
}

// Tarjeta de proyecto real. Media: imagen si existe en /public/images/projects,
// degradado del accent con iniciales si no. Sin métricas ni tecnologías inventadas.
function ProjectCard({ project, t, spotlight }) {
  const item = t(`sections.projects.items.${project.id}`) || {};
  const name = item.name ?? project.id;
  const description = item.description ?? "";
  const alt = t("sections.projects.imageAlt").replace("{name}", name);
  const host = hostnameOf(project.url);
  const Icon = projectIcons[project.id];

  return (
    <article className={`${styles.card} spotlight`} onPointerMove={spotlight}>
      <div className={styles.cardMedia}>
        {project.imageSrc ? (
          <Image
            src={project.imageSrc}
            alt={alt}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            quality={80}
            loading="lazy"
            className={styles.cardImg}
          />
        ) : (
          <span
            className={styles.cardInitials}
            style={{
              background: `linear-gradient(140deg, ${project.accent} 0%, color-mix(in srgb, ${project.accent} 55%, #000000) 100%)`,
            }}
            aria-hidden="true"
          >
            {initials(name)}
          </span>
        )}
        {/* Gradiente inferior para contraste del chip y la flecha */}
        <span className={styles.cardScrim} aria-hidden="true" />
        <span className={styles.liveChip}>
          <span className={styles.liveDot} aria-hidden="true" />
          {t("sections.projects.live")}
        </span>
        <span className={styles.cardExt} aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>

      <div className={styles.cardBody}>
        {Icon ? (
          <span className={styles.projIcon} aria-hidden="true">
            <Icon size={28} />
          </span>
        ) : null}
        <h3 className={styles.cardTitle}>{name}</h3>
        <p className={styles.cardText}>{description}</p>

        <div className={styles.cardFooter}>
          <div className={styles.cardHostGroup}>
            <Link2 size={14} aria-hidden="true" className={styles.cardHostIcon} />
            <p className={styles.cardHost}>{host}</p>
          </div>
          <LoadingLink
            href={project.url}
            className={styles.cardCta}
            rel="noopener noreferrer"
            label={name}
            accent={project.accent}
          >
            {t("sections.projects.view")}
            <ArrowUpRight size={16} aria-hidden="true" />
          </LoadingLink>
        </div>
      </div>
    </article>
  );
}

// DEMO exclusiva de desarrollo (flag NEXT_PUBLIC_DEMO_PROJECT=1). Nunca en producción.
function DemoCard({ t }) {
  return (
    <article className={`${styles.card} ${styles.demoCard}`}>
      <div className={styles.cardMedia}>
        <span className={styles.demoBadge}>{t("sections.projects.demoBadge")}</span>
      </div>
      <div className={styles.cardBody}>
        <p className={`eyebrow ${styles.cardArea}`}>DEMO</p>
        <h3 className={styles.cardTitle}>{t("sections.projects.demoTitle")}</h3>
        <p className={styles.cardText}>{t("sections.projects.demoText")}</p>
        <LoadingLink href="https://github.com" className={styles.cardCta} rel="noopener noreferrer">
          {t("sections.projects.view")}
          <ArrowUpRight size={16} aria-hidden="true" />
        </LoadingLink>
      </div>
    </article>
  );
}

// Marcadores de reserva mientras no hay proyectos publicados.
function EmptySlot({ slotIndex, t, spotlight }) {
  const slotAreas = t("sections.projects.slotAreas");
  const slotArea = Array.isArray(slotAreas) ? slotAreas[slotIndex] : "";

  return (
    <article className={`${styles.card} spotlight`} onPointerMove={spotlight}>
      <div className={styles.cardMedia}>
        <CircleDashed size={36} strokeWidth={1.5} aria-hidden="true" className={styles.slotIcon} />
        <p className={styles.slotText}>{t("sections.projects.reserved")}</p>
      </div>
      <div className={styles.cardBody}>
        <p className={`eyebrow ${styles.cardArea}`}>{slotArea}</p>
        <h3 className={styles.cardTitle}>
          {t("sections.projects.undocumentedTitle")}
        </h3>
        <p className={styles.cardText}>
          {t("sections.projects.undocumentedText")}
        </p>
        <span className={styles.cardPending}>
          {t("sections.projects.pendingLink")}
        </span>
      </div>
    </article>
  );
}

// Proyectos reales + guía de los tres estados solo si está vacío.
// Recibe los proyectos ya enriquecidos con imageSrc desde el servidor.
export default function FeaturedProjects({ projects }) {
  const { t } = useT();
  const spotlight = useSpotlight();
  const list = Array.isArray(projects) ? projects : [];
  const hasProjects = list.length > 0;

  return (
    <section
      className={`band-alt ${styles.section}`}
      id="proyectos"
      aria-labelledby="proyectos-titulo"
    >
      <div className="container">
        <Reveal>
          <SectionHeading
            index="02"
            kicker={t("sections.projects.kicker")}
            title={splitAccent(t("sections.projects.title"))}
            lead={
              hasProjects
                ? t("sections.projects.leadFilled")
                : t("sections.projects.leadEmpty")
            }
            id="proyectos-titulo"
          />
        </Reveal>

        <div className={styles.grid}>
          {hasProjects ? (
            list.map((project, index) => (
              <Reveal key={project.id} y={26} delay={index * 0.08}>
                <ProjectCard project={project} t={t} spotlight={spotlight} />
              </Reveal>
            ))
          ) : (
            <>
              {DEMO_ENABLED ? (
                <Reveal key="demo" y={26}>
                  <DemoCard t={t} />
                </Reveal>
              ) : null}
              {[0, 1, 2].map((slotIndex, index) => (
                <Reveal key={`slot-${slotIndex}`} y={26} delay={(index + 1) * 0.08}>
                  <EmptySlot slotIndex={slotIndex} t={t} spotlight={spotlight} />
                </Reveal>
              ))}
            </>
          )}
        </div>

        {/* Guía de los tres estados: solo mientras no haya proyectos publicados */}
        {!hasProjects ? (
          <Reveal as="div" className={styles.stateGuide} delay={0.2}>
            <p className={`eyebrow ${styles.stateGuideKicker}`}>
              {t("sections.projects.stateGuideKicker")}
            </p>
            <div className={styles.stateGuideGrid}>
              {[
                { tone: "blue", key: "stateDev", textKey: "stateDevText" },
                { tone: "violet", key: "stateDesign", textKey: "stateDesignText" },
                { tone: "cyan", key: "statePublished", textKey: "statePublishedText" },
              ].map(({ tone, key, textKey }, index) => (
                <article
                  key={key}
                  className={`${styles.stateCard} ${styles[`stateCard_${tone}`]}`}
                >
                  <span className={styles.stateBadge}>0{index + 1}</span>
                  <h3 className={styles.stateTitle}>{t(`sections.projects.${key}`)}</h3>
                  <p className={styles.stateText}>{t(`sections.projects.${textKey}`)}</p>
                </article>
              ))}
            </div>
          </Reveal>
        ) : null}

        {!hasProjects ? (
          <Reveal className={styles.note} y={16} delay={0.24}>
            <p>{t("sections.projects.note")}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
