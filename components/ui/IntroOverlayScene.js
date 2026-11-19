// Intro V5 "Órbita que enciende" — markup SSR compartido en producción y
// en /intro-test (solo desarrollo). Gating: <html class="intro-on"> (o .force
// en /intro-test). Composición centrada en un eje vertical:
//   emblema circular (150–220 px) → órbita R = radio + 56 px (+40 en móvil)
//   → 8 nodos de 26–38 px con iconos Lucide al 55 % → palabras en columna.
//
// Fases (1× ≈ 4.8 s, ritmo con intro.speed; repeticiones con repeatSpeed):
//   0.0–0.9   nombre centrado entra (0–0.6 s) + franja de luz 0.8 s;
//               quieto ~0.3 s
//   1.2–2.0   separación vertical (Digital sube / Ingenio baja); órbita y
//               conectores aparecen con stagger 50 ms
//   2.0–3.2   emblema scale 0.5→1; barrido de luz + nodos encienden en orden
//               (cada 0.15 s) + anillo de progreso (stroke-dashoffset)
//   3.2–3.8   pausa con todo encendido + pulso suave del emblema
//   3.8–4.8   apertura circular + FLIP del emblema/palabras al header (WAAPI)
//
// splitOrder se lee de data/site.js ("digitalUp" | "ingenioUp").

import Image from "next/image";
import {
  Sigma,
  Globe,
  Database,
  Network,
  Wifi,
  Cpu,
  Activity,
  GraduationCap,
} from "lucide-react";
import { site } from "@/data/site";
import styles from "./IntroOverlay.module.css";

// Ángulos deterministas (grados, 0° = arriba, sentido horario) — el barrido
// enciende los nodos en este orden (i·0.15 s = ángulo/360 · 1.2 s).
const NODES = [
  { Icon: Sigma, area: "software", angle: 0 },
  { Icon: Globe, area: "software", angle: 45 },
  { Icon: Network, area: "redes", angle: 90 },
  { Icon: Wifi, area: "redes", angle: 135 },
  { Icon: Cpu, area: "electronica", angle: 180 },
  { Icon: Activity, area: "electronica", angle: 225 },
  { Icon: Database, area: "arquitectura", angle: 270 },
  { Icon: GraduationCap, area: "formacion", angle: 315 },
];

// Trazos de circuito OPCIONALES (intro.traces=true): 4 elementos máx.,
// líneas rectas, sin filtros. Desactivados por defecto.
const TRACES = [
  "M 60 -450 L 60 -210 L 0 -210 L 0 -96",
  "M 800 -60 L 300 -60 L 300 0 L 96 0",
  "M -60 450 L -60 210 L 0 210 L 0 96",
  "M -800 -60 L -300 -60 L -300 0 L -96 0",
];
const TRACE_COLORS = ["#2F7BFF", "#22D3EE", "#19E3D0", "#7C5CFF"];

export default function IntroOverlayScene({ dict, force, id = "intro", extraClass = "" }) {
  const traces = site.intro?.traces === true;
  const splitOrder = site.intro?.splitOrder === "ingenioUp" ? "ingenioUp" : "digitalUp";
  // splitOrder: digitalUp → Digital sube (−1), Ingenio baja (+1); invertido
  const signDigital = splitOrder === "digitalUp" ? -1 : 1;
  const signIngenio = -signDigital;
  // La palabra que sube va arriba en la columna: así la separación es siempre
  // hacia afuera (nunca se cruzan) y el hueco de 28 px se cumple en ambos flags.
  const wordOrder = splitOrder === "digitalUp" ? ["digital", "ingenio"] : ["ingenio", "digital"];

  return (
    <div
      id={id}
      className={`${styles.introOverlay} ${force ? `${styles.force} ` : ""}${extraClass}`}
      style={{
        "--sign-ingenio": signIngenio,
        "--sign-digital": signDigital,
      }}
      role="status"
      aria-live="polite"
      aria-label={dict.loading.label}
    >
      {/* Capa de fondo que se abre en círculo revelando la página. */}
      <div className={styles.openingLayer} aria-hidden="true" data-intro-open />

      {/* Trazos de circuito opcionales (flag intro.traces) */}
      {traces ? (
        <svg
          className={styles.traces}
          viewBox="-800 -450 1600 900"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          focusable="false"
          role="presentation"
        >
          {TRACES.map((d, index) => (
            <path
              key={`trace-${index}`}
              d={d}
              className={styles.trace}
              pathLength="1"
              stroke={TRACE_COLORS[index]}
              style={{ "--d": `${0.35 + index * 0.09}s` }}
            />
          ))}
        </svg>
      ) : null}

      {/* Escenario centrado: todo comparte el eje del emblema */}
      <div className={styles.stage} aria-hidden="true" data-intro-stage>
        <div className={styles.chrome} data-intro-chrome>
          {/* Órbita punteada (gira 24 s/vuelta) */}
          <span className={styles.orbit} data-intro-orbit />

          {/* Barrido de luz (conic-gradient en corona de ~6 px) */}
          <span className={styles.sweep} data-intro-sweep />

          {/* Conectores: 1 px desde el borde del emblema al nodo */}
          {NODES.map(({ area, angle }, index) => (
            <span
              key={`connector-wrap-${index}`}
              className={styles.connectorWrap}
              style={{ "--a": `${angle}deg` }}
            >
              <span
                className={`${styles.connector} ${styles[`nodeArea_${area}`]}`}
                style={{ "--i": index }}
                data-intro-connector={index}
              />
            </span>
          ))}

          {/* Nodos: contorno → relleno del color del área al pasar el barrido */}
          {NODES.map(({ Icon, area, angle }, index) => (
            <span
              key={`node-${index}`}
              className={`${styles.node} ${styles[`nodeArea_${area}`]}`}
              style={{ "--i": index, "--a": `${angle}deg` }}
              data-intro-node={index}
            >
              <span className={styles.nodeCore}>
                <Icon size={24} strokeWidth={2} aria-hidden="true" className={styles.nodeIcon} />
              </span>
            </span>
          ))}

          {/* Anillo de progreso: un ÚNICO circle, stroke-dashoffset 0→100 % */}
          <svg
            className={styles.chargeSvg}
            viewBox="0 0 100 100"
            aria-hidden="true"
            focusable="false"
            data-intro-progress
          >
            <defs>
              <linearGradient id="introChargeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="45%" stopColor="#2f7bff" />
                <stop offset="100%" stopColor="#7c5cff" />
              </linearGradient>
            </defs>
            <circle className={styles.chargeRing} cx="50" cy="50" r="48" pathLength="1" />
          </svg>
        </div>

        {/* Emblema oficial recortado en círculo */}
        <div className={styles.emblem} data-intro-emblem>
          <Image
            src={site.logo ?? "/logo.jpeg"}
            alt=""
            width={320}
            height={320}
            sizes="(max-width: 640px) 150px, 220px"
            className={styles.emblemImage}
            priority
          />
        </div>

        {/* Palabras: columna centrada; la que sube arriba, la que baja abajo */}
        <div className={styles.words} data-intro-words>
          {wordOrder.map((kind) => (
            <span
              key={kind}
              className={`${styles.word} ${
                kind === "digital" ? styles.wordDigital : styles.wordIngenio
              }`}
              data-text={kind === "digital" ? "Digital" : "Ingenio"}
              data-intro-word={kind}
            >
              {kind === "digital" ? "Digital" : "Ingenio"}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={styles.skip}
        data-intro-skip
        aria-label={dict.loading.skip}
      >
        {dict.loading.skip}
      </button>
    </div>
  );
}
