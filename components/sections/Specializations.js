"use client";

import {
  Code2,
  Boxes,
  Network,
  CircuitBoard,
  GraduationCap,
} from "lucide-react";
import { useT } from "@/components/i18n/LanguageProvider";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/motion/Reveal";
import SpecializationsVideo from "./SpecializationsVideo";
import useSpotlight from "@/lib/useSpotlight";
import styles from "./Specializations.module.css";

const icons = { software: Code2, arquitectura: Boxes, redes: Network, electronica: CircuitBoard, formacion: GraduationCap };

// Bento Grid asimétrico: celda de vídeo (circuitos digitales reales)
// + 5 celdas de disciplina. Se reflowa a 1 columna en móvil.
// Las celdas entran escalonadas (stagger 0.08 s).
export default function Specializations() {
  const { t } = useT();
  const spotlight = useSpotlight();
  const areas = t("sections.specs.areas");
  const list = Array.isArray(areas) ? areas : [];
  const [first, ...rest] = list;

  return (
    <section
      className={`band panel-next ${styles.section}`}
      id="especializaciones"
      aria-labelledby="areas-titulo"
    >
      <div className="container">
        <Reveal>
          <SectionHeading
            index="01"
            kicker={t("sections.specs.kicker")}
            title={t("sections.specs.title")}
            lead={t("sections.specs.lead")}
            id="areas-titulo"
          />
        </Reveal>

        <div className={styles.grid}>
          <Reveal className={styles.mediaCell} y={26}>
            <SpecializationsVideo />
            <div className={styles.chip}>
              <p className="eyebrow">{t("sections.specs.mediaTag")}</p>
            </div>
          </Reveal>

          {first ? (
            <Reveal
              as="article"
              id="area-software"
              data-area={first.id}
              tabIndex={0}
              className={`${styles.cell} ${styles.cellWide} ${styles[`cell_${first.id}`]} spotlight`}
              y={26}
              delay={0.08}
              onPointerMove={spotlight}
              onPointerEnter={() =>
                window.dispatchEvent(
                  new CustomEvent("ingenio:orbital-highlight", { detail: { area: first.id } }),
                )
              }
              onPointerLeave={() =>
                window.dispatchEvent(
                  new CustomEvent("ingenio:orbital-highlight", { detail: {} }),
                )
              }
              onFocus={() =>
                window.dispatchEvent(
                  new CustomEvent("ingenio:orbital-highlight", { detail: { area: first.id } }),
                )
              }
              onBlur={() =>
                window.dispatchEvent(
                  new CustomEvent("ingenio:orbital-highlight", { detail: {} }),
                )
              }
            >
              <div className={styles.cellHead}>
                <span className={styles.cellIconWrap}>
                  {(() => {
                    const Icon = icons[first.id] ?? Code2;
                    return <Icon size={22} aria-hidden="true" />;
                  })()}
                </span>
                <span className={styles.cellIndex}>01</span>
              </div>
              <h3 className={styles.cellTitle} id={`texto-${first.id}`}>{first.title}</h3>
              <p className={styles.cellText}>{first.description}</p>
            </Reveal>
          ) : null}

          {rest.map((area, index) => {
            const Icon = icons[area.id] ?? Code2;
            const number = String(index + 2).padStart(2, "0");
            return (
              <Reveal
                as="article"
                key={area.id}
                id={`area-${area.id}`}
                data-area={area.id}
                tabIndex={0}
                className={`${styles.cell} ${styles[`cell_${area.id}`]} spotlight`}
                y={26}
                delay={(index + 2) * 0.08}
                onPointerMove={spotlight}
                onPointerEnter={() =>
                  window.dispatchEvent(
                    new CustomEvent("ingenio:orbital-highlight", { detail: { area: area.id } }),
                  )
                }
                onPointerLeave={() =>
                  window.dispatchEvent(
                    new CustomEvent("ingenio:orbital-highlight", { detail: {} }),
                  )
                }
                onFocus={() =>
                  window.dispatchEvent(
                    new CustomEvent("ingenio:orbital-highlight", { detail: { area: area.id } }),
                  )
                }
                onBlur={() =>
                  window.dispatchEvent(
                    new CustomEvent("ingenio:orbital-highlight", { detail: {} }),
                  )
                }
              >
                <div className={styles.cellHead}>
                  <span className={styles.cellIconWrap}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className={styles.cellIndex}>{number}</span>
                </div>
                <h3 className={styles.cellTitle}>{area.title}</h3>
                <p className={styles.cellText}>{area.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
