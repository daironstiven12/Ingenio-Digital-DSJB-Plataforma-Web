"use client";

import Image from "next/image";
import { ArrowUpRight, CircleDashed, Link2 } from "lucide-react";
import LoadingLink from "@/components/ui/LoadingLink";
import useSpotlight from "@/lib/useSpotlight";
import { projects, projectStatus } from "@/data/projects";
import { useT } from "@/components/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import StatusBadge from "@/components/ui/StatusBadge";
import Reveal from "@/components/motion/Reveal";
import styles from "./FeaturedProjects.module.css";

// Tarjeta DEMO exclusiva de desarrollo: si NEXT_PUBLIC_DEMO_PROJECT=1 y
// NODE_ENV !== "production", se muestra una tarjeta claramente rotulada
// "DEMO (solo desarrollo)" enlazando a un repositorio público de muestra.
// NUNCA aparece en el build de producción (se verifica con un grep del bundle).
const DEMO_ENABLED =
  process.env.NODE_ENV !== "production" &&
  process.env.NEXT_PUBLIC_DEMO_PROJECT === "1";

// Marcadores de reserva mientras no hay proyectos publicados
// (proj-*.jpg no se usan hasta que existan proyectos reales).
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
        <LoadingLink href="https://github.com" className={styles.cardLink} rel="noopener noreferrer">
          {t("sections.projects.viewProject")}
          <ArrowUpRight size={16} aria-hidden="true" />
        </LoadingLink>
      </div>
    </article>
  );
}

function ProjectCard({ project, slotIndex, t, spotlight }) {
  const status = project?.status ? projectStatus[project.status] : null;
  const image = project?.image || null;
  const alt =
    project?.alt || "Ingenio Digital DSJB — reserved project slot";
  const slotAreas = t("sections.projects.slotAreas");
  const slotArea = Array.isArray(slotAreas) ? slotAreas[slotIndex] : "";

  return (
    <article className={`${styles.card} spotlight`} onPointerMove={spotlight}>
      <div className={styles.cardMedia}>
        {image ? (
          <Image
            src={image}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className={styles.cardImg}
          />
        ) : (
          <>
            <CircleDashed
              size={36}
              strokeWidth={1.5}
              aria-hidden="true"
              className={styles.slotIcon}
            />
            <p className={styles.slotText}>{t("sections.projects.reserved")}</p>
          </>
        )}
        {status ? (
          <span className={styles.cardBadge}>
            <StatusBadge
              label={t(`sections.status.${project.status}`)}
              tone={status.tone}
            />
          </span>
        ) : null}
      </div>

      <div className={styles.cardBody}>
        <p className={`eyebrow ${styles.cardArea}`}>
          {project?.area || slotArea}
        </p>
        <h3 className={styles.cardTitle}>
          {project?.title || t("sections.projects.undocumentedTitle")}
        </h3>
        <p className={styles.cardText}>
          {project?.summary || t("sections.projects.undocumentedText")}
        </p>
        {project?.href || project?.repository ? (
          <div className={styles.cardLinks}>
            {project?.href ? (
              <LoadingLink href={project.href} className={styles.cardLink} rel="noopener noreferrer">
                {t("sections.projects.viewProject")}
                <ArrowUpRight size={16} aria-hidden="true" />
              </LoadingLink>
            ) : null}
            {project?.repository ? (
              <LoadingLink href={project.repository} className={styles.cardRepo} rel="noopener noreferrer">
                <Link2 size={16} aria-hidden="true" />
                {t("sections.projects.viewRepository")}
              </LoadingLink>
            ) : null}
          </div>
        ) : (
          <span className={styles.cardPending}>
            {t("sections.projects.pendingLink")}
          </span>
        )}
      </div>
    </article>
  );
}

export default function FeaturedProjects() {
  const { t } = useT();
  const spotlight = useSpotlight();
  const hasProjects = projects.length > 0;
  const demoItems = DEMO_ENABLED && !hasProjects ? ["demo"] : [];

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
            title={t("sections.projects.title")}
            lead={
              hasProjects
                ? t("sections.projects.leadFilled")
                : t("sections.projects.leadEmpty")
            }
            id="proyectos-titulo"
          />
        </Reveal>

        <div className={styles.grid}>
          {demoItems.map((_, index) => (
            <Reveal key="demo" y={26} delay={index * 0.08}>
              <DemoCard t={t} />
            </Reveal>
          ))}
          {hasProjects
            ? projects.map((project, index) => (
                <Reveal
                  key={project.id ?? index}
                  y={26}
                  delay={(index + demoItems.length) * 0.08}
                >
                  <ProjectCard project={project} slotIndex={index} t={t} spotlight={spotlight} />
                </Reveal>
              ))
            : [0, 1, 2].map((slotIndex, index) => (
                <Reveal
                  key={`slot-${slotIndex}`}
                  y={26}
                  delay={(index + demoItems.length) * 0.08}
                >
                  <ProjectCard project={null} slotIndex={slotIndex} t={t} spotlight={spotlight} />
                </Reveal>
              ))}
        </div>

        {!hasProjects ? (
          <Reveal className={styles.note} y={16} delay={0.24}>
            <p>{t("sections.projects.note")}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
