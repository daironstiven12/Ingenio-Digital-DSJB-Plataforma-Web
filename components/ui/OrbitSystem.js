"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sigma,
  Globe,
  Network,
  Wifi,
  Cpu,
  Database,
  GraduationCap,
  Activity,
} from "lucide-react";
import Image from "next/image";
import { useT } from "@/components/i18n/LanguageProvider";
import { resolveMotion } from "@/lib/motion";
import { site } from "@/data/site";
import styles from "./OrbitSystem.module.css";

const NODE_ICONS = [Sigma, Globe, Network, Wifi, Cpu, Database, GraduationCap, Activity];
// Mapeo nodo → área real (Claves i18n de Especializaciones)
const NODE_AREAS = [
  "software",
  "software",
  "redes",
  "redes",
  "electronica",
  "arquitectura",
  "formacion",
  "electronica",
];

const RADIUS_PCT = 42;
const CENTER = 50;
const ORBIT_R = 168;
const SPOKE_FROM = 100;
const SPOKE_TO = ORBIT_R;
const VIEW = 400;

function nodePosition(index) {
  const angle = ((index * 45 - 90) * Math.PI) / 180;
  return {
    x: CENTER + RADIUS_PCT * Math.cos(angle),
    y: CENTER + RADIUS_PCT * Math.sin(angle),
    angle,
  };
}

// Sistema orbital compartido.
// mode="hero":  interactivo (botones con foco por teclado, etiqueta al
//                hover/foco/tap, clic → scroll al card del área).
// mode="loader": estático para la intro (BrandLoader anima stroke/fill).
export default function OrbitSystem({ mode = "hero", ringsRef, loaderRefs, ariaHidden = false }) {
  const { t } = useT();
  const [activeNode, setActiveNode] = useState(null);
  const containerRef = useRef(null);

  const nodeLabels = t("hero.nodes");
  const labels = Array.isArray(nodeLabels) ? nodeLabels : [];
  const areas = t("sections.specs.areas");
  const areaList = Array.isArray(areas) ? areas : [];
  const areaById = Object.fromEntries(areaList.map((a) => [a.id, a]));

  // En táctil, tocar fuera cierra la etiqueta activa
  useEffect(() => {
    if (mode !== "hero") return undefined;
    const clear = () => setActiveNode(null);
    document.addEventListener("pointerdown", clear);

    // Resaltado cruzado: un card de Especializaciones resalta el nodo equivalente
    const onHighlight = (event) => {
      const root = containerRef.current;
      if (!root) return;
      const area = event?.detail?.area;
      root.querySelectorAll("[data-area]").forEach((node) => {
        node.classList.toggle("orbitalNodeBoost", area != null && node.dataset.area === area);
      });
    };
    window.addEventListener("ingenio:orbital-highlight", onHighlight);

    return () => {
      document.removeEventListener("pointerdown", clear);
      window.removeEventListener("ingenio:orbital-highlight", onHighlight);
    };
  }, [mode]);

  const spokes = NODE_ICONS.map((_, index) => {
    const { angle } = nodePosition(index);
    return {
      x1: VIEW / 2 + SPOKE_FROM * Math.cos(angle),
      y1: VIEW / 2 + SPOKE_FROM * Math.sin(angle),
      x2: VIEW / 2 + SPOKE_TO * Math.cos(angle),
      y2: VIEW / 2 + SPOKE_TO * Math.sin(angle),
    };
  });

  const ringCircle = (
    <circle
      ref={loaderRefs?.ringRef}
      className={styles.ringDashed}
      cx={VIEW / 2}
      cy={VIEW / 2}
      r={ORBIT_R}
      fill="none"
      stroke="var(--color-blue)"
      strokeOpacity="0.55"
      strokeWidth="1.25"
      strokeDasharray="5 9"
    />
  );

  const innerCircle = (
    <circle
      ref={loaderRefs?.innerRef}
      cx={VIEW / 2}
      cy={VIEW / 2}
      r="82"
      fill="none"
      stroke="var(--color-violet)"
      strokeOpacity="0.55"
      strokeWidth="1.25"
    />
  );

  const spokeLines = spokes.map((spoke, index) => (
    <line
      key={index}
      {...spoke}
      ref={(el) => {
        if (loaderRefs?.spokeRefs) loaderRefs.spokeRefs.current[index] = el;
      }}
      stroke="var(--color-border-strong)"
      strokeOpacity="0.9"
      strokeWidth="1"
    />
  ));

  /* ===== Modo loader: SVG puro, lo anima BrandLoader ===== */
  if (mode === "loader") {
    return (
      <svg
        className={styles.loaderSvg}
        viewBox={`0 0 ${VIEW} ${VIEW}`}
        aria-hidden="true"
        focusable="false"
      >
        {ringCircle}
        {innerCircle}
        {spokeLines}
        <circle
          ref={loaderRefs?.emblemCircleRef}
          cx={VIEW / 2}
          cy={VIEW / 2}
          r="64"
          fill="var(--color-indigo-band)"
          stroke="var(--color-border-strong)"
        />
        <clipPath id="loader-emblem-clip">
          <circle cx={VIEW / 2} cy={VIEW / 2} r="60" />
        </clipPath>
        <image
          ref={loaderRefs?.emblemImageRef}
          href={site.logo ?? "/logo.jpeg"}
          x={VIEW / 2 - 60}
          y={VIEW / 2 - 60}
          width="120"
          height="120"
          clipPath="url(#loader-emblem-clip)"
          preserveAspectRatio="xMidYMid slice"
        />
        {NODE_ICONS.map((_, index) => {
          const { angle } = nodePosition(index);
          const cx = VIEW / 2 + ORBIT_R * Math.cos(angle);
          const cy = VIEW / 2 + ORBIT_R * Math.sin(angle);
          const area = NODE_AREAS[index];
          return (
            <circle
              key={index}
              ref={(el) => {
                if (loaderRefs?.nodeRefs) loaderRefs.nodeRefs.current[index] = el;
              }}
              className={`${styles.loaderNode} ${styles[`node_${area}`]}`}
              cx={cx}
              cy={cy}
              r="17"
            />
          );
        })}
      </svg>
    );
  }

  /* ===== Modo hero: interactivo ===== */
  const goToArea = (area, index) => {
    const card = document.getElementById(`area-${area}`);
    if (!card) return;
    const motion = resolveMotion();
    card.scrollIntoView({ behavior: motion.allowed ? "smooth" : "auto", block: "center" });
    card.classList.add(styles.cardHighlight);
    window.setTimeout(() => card.classList.remove(styles.cardHighlight), 1800);
  };

  return (
    <div
      ref={containerRef}
      className={`${styles.system} ${styles.heroMode}`}
      role={ariaHidden ? undefined : "group"}
      aria-hidden={ariaHidden || undefined}
      aria-label={ariaHidden ? undefined : t("hero.orbitalLabel")}
    >
      <div ref={ringsRef} className={styles.ringsWrap}>
        <svg
          className={styles.rings}
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          aria-hidden="true"
          focusable="false"
        >
          {ringCircle}
          {innerCircle}
          {spokeLines}
        </svg>
      </div>

      <div className={styles.emblem}>
        <Image
          src={site.logo ?? "/logo.jpeg"}
          alt=""
          width={200}
          height={200}
          sizes="(min-width: 1024px) 168px, 112px"
          className={styles.emblemImg}
          priority
        />
      </div>

      {labels.map((label, index) => {
        const Icon = NODE_ICONS[index] ?? Sigma;
        const { x, y } = nodePosition(index);
        const area = NODE_AREAS[index];
        const isActive = activeNode === `${index}`;
        const areaTitle = areaById[area]?.title ?? label;
        return (
          <button
            key={index}
            type="button"
            className={`${styles.node} ${styles[`node_${area}`]} ${isActive ? styles.nodeActive : ""}`}
            style={{
              left: `${x}%`,
              top: `${y}%`,
              "--i": index,
            }}
            aria-label={areaTitle}
            onClick={(event) => {
              event.stopPropagation();
              const coarse = window.matchMedia("(pointer: coarse)").matches;
              if (coarse && !isActive) {
                setActiveNode(`${index}`);
                return;
              }
              setActiveNode(null);
              goToArea(area, index);
            }}
            data-area={area}
            onPointerEnter={() => setActiveNode(null)}
          >
            <Icon size={19} aria-hidden="true" className={styles.nodeIcon} strokeWidth={1.8} />
            <span className={styles.nodeLabel} aria-hidden="true">
              {areaTitle}
            </span>
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
