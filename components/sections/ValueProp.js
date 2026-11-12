"use client";

import { Compass, Wrench, BookOpen } from "lucide-react";
import { useT } from "@/components/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import styles from "./ValueProp.module.css";

const icons = [Compass, Wrench, BookOpen];

// Propuesta de valor: compartimos el proceso real de desarrollo.
export default function ValueProp() {
  const { t } = useT();
  const pillars = t("sections.valueProp.pillars");
  const pillarList = Array.isArray(pillars) ? pillars : [];

  return (
    <section
      className={`band ${styles.section}`}
      id="propuesta"
      aria-labelledby="propuesta-titulo"
    >
      <div className={`container ${styles.inner}`}>
        <Reveal>
          <SectionHeading
            index="03"
            kicker={t("sections.valueProp.kicker")}
            title={t("sections.valueProp.title")}
            lead={t("sections.valueProp.lead")}
            id="propuesta-titulo"
          />
        </Reveal>

        <div className={styles.list}>
          {pillarList.map((pillar, index) => {
            const Icon = icons[index] ?? Compass;
            return (
              <Reveal
                key={pillar.title}
                className={styles.item}
                y={24}
                delay={index * 0.08}
              >
                <span className={styles.itemIcon}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <div>
                  <h3 className={styles.itemTitle}>{pillar.title}</h3>
                  <p className={styles.itemText}>{pillar.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
