"use client";

import Image from "next/image";
import { BookOpen, PenLine, FlaskConical, ArrowRight } from "lucide-react";
import { labPillars, publications } from "@/data/lab";
import { useT } from "@/components/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import useSpotlight from "@/lib/useSpotlight";
import ParallaxImage from "@/components/motion/ParallaxImage";
import styles from "./DigitalLab.module.css";

const icons = { articulos: BookOpen, "notas-proceso": PenLine, experimentos: FlaskConical };

// Laboratorio digital: pilares reales + publicaciones cuando existan.
// Las entradas de publicaciones llevan su propia fecha y enlace verificables.
export default function DigitalLab() {
  const { t } = useT();
  const spotlight = useSpotlight();
  const hasPosts = publications.length > 0;
  const pillars = t("sections.lab.pillars");
  const pillarList = Array.isArray(pillars) ? pillars : [];

  return (
    <section
      className={`band-alt ${styles.section}`}
      id="laboratorio"
      aria-labelledby="laboratorio-titulo"
    >
      <div className="container">
        <div className={styles.headerRow}>
          <Reveal>
            <SectionHeading
              index="04"
              kicker={t("sections.lab.kicker")}
              title={t("sections.lab.title")}
              lead={
                hasPosts
                  ? t("sections.lab.leadFilled")
                  : t("sections.lab.leadEmpty")
              }
              id="laboratorio-titulo"
            />
          </Reveal>
          <Reveal className={styles.mediaWrap} y={26} delay={0.1}>
            <div className={styles.media}>
              <ParallaxImage
                src="/images/lab-codigo.jpg"
                alt={t("sections.lab.mediaAlt")}
                sizes="(min-width: 1024px) 480px, 100vw"
                className={styles.mediaInner}
              />
            </div>
          </Reveal>
        </div>

        <div className={styles.pillars}>
          {pillarList.map((pillar, index) => {
            const source = labPillars[index];
            const Icon = icons[source?.id] ?? BookOpen;
            return (
              <Reveal
                as="article"
                key={source?.id ?? index}
                className={`${styles.pillar} spotlight`}
                y={26}
                delay={index * 0.08}
                onPointerMove={spotlight}
              >
                <span className={styles.pillarIcon}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarText}>{pillar.description}</p>
              </Reveal>
            );
          })}
        </div>

        {hasPosts ? (
          <div className={styles.postList}>
            {publications.map((post) => (
              <a key={post.id} href={post.href} className={styles.postRow}>
                <span className={styles.postMeta}>{post.date}</span>
                <span className={styles.postTitle}>{post.title}</span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : (
          <Reveal className={styles.pending} y={16}>
            <p>{t("sections.lab.pending")}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
