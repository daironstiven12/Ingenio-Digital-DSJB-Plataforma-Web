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
import styles from "./NavLoader.module.css";

// Loader global de ejecución CSS-first para salidas externas (LoadingLink).
// Se muestra cuando <html> lleva .nav-loading; invisible si no.
// Sin JS: no se muestra en absoluto (sin clase → display none).
// Con prefers-reduced-motion: LoadingLink navega de inmediato.
//
// Geometría: viewBox 0 0 400 400 · centro (200,200) · órbita r=178.
// Nodos/HTML posicionados en % del contenedor; el SVG dibuja spokes y anillos.

const NODES = [
  { icon: Sigma, area: "software", x: 50.0, y: 5.5 },
  { icon: Globe, area: "software", x: 81.47, y: 18.53 },
  { icon: Network, area: "redes", x: 94.5, y: 50.0 },
  { icon: Wifi, area: "redes", x: 81.47, y: 81.47 },
  { icon: Cpu, area: "electronica", x: 50.0, y: 94.5 },
  { icon: Database, area: "arquitectura", x: 18.53, y: 81.47 },
  { icon: GraduationCap, area: "formacion", x: 5.5, y: 50.0 },
  { icon: Activity, area: "electronica", x: 18.53, y: 18.53 },
];

const SPOKES = [
  { x1: 200, y1: 200, x2: 200.0, y2: 22.0 },
  { x1: 200, y1: 200, x2: 325.9, y2: 74.1 },
  { x1: 200, y1: 200, x2: 378.0, y2: 200.0 },
  { x1: 200, y1: 200, x2: 325.9, y2: 325.9 },
  { x1: 200, y1: 200, x2: 200.0, y2: 378.0 },
  { x1: 200, y1: 200, x2: 74.1, y2: 325.9 },
  { x1: 200, y1: 200, x2: 22.0, y2: 200.0 },
  { x1: 200, y1: 200, x2: 74.1, y2: 74.1 },
];

const ORBIT_ANIM_CLASSES = [
  "n-sw",
  "n-sw",
  "n-redes",
  "n-redes",
  "n-ele",
  "n-arq",
  "n-for",
  "n-ele",
];

export default function NavLoader({ dict }) {
  return (
    <div
      id="nav-loader"
      className={styles.navOverlay}
      role="status"
      aria-live="polite"
      aria-hidden="true"
      aria-label={dict?.loading?.label ?? "Loading Ingenio Digital DSJB"}
    >
      {/* Capa translúcida (la web se sigue viendo detrás; con blur donde hay soporte) */}
      <span className={styles.navBackdrop} aria-hidden="true" />
      {/* Halo radial con el acento del proyecto (--nav-accent inyectado por LoadingLink) */}
      <span className={styles.navGlow} aria-hidden="true" />

      {/* Contenedor orbital */}
      <div className={styles.orbitWrap} aria-hidden="true">
        <svg
          viewBox="0 0 400 400"
          className={styles.orbitSvg}
          fill="none"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id="navRingGradient" x1="0" y1="0" x2="400" y2="400">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="0.45" stopColor="#2f7bff" />
              <stop offset="1" stopColor="#7c5cff" />
            </linearGradient>
          </defs>

          {/* Anillo punteado contenedor (girando muy lento) */}
          <circle
            cx="200"
            cy="200"
            r="182"
            className={styles.orbitRing}
            strokeDasharray="3 11"
            strokeLinecap="round"
          />

          {/* Spokes: se dibujan desde el centro hacia el nodo */}
          {SPOKES.map((spoke, index) => (
            <line
              key={`spoke-${index}`}
              x1={spoke.x1}
              y1={spoke.y1}
              x2={spoke.x2}
              y2={spoke.y2}
              pathLength="100"
              className={`${styles.spoke} ${styles[`spoke-${index}`]}`}
            />
          ))}

          {/* Anillo eléctrico alrededor del emblema (filtro solo durante .nav-loading) */}
          <circle
            cx="200"
            cy="200"
            r="116"
            className={styles.emberRing}
          />

          {/* Anillo de progreso (0 → 100 %) */}
          <circle
            cx="200"
            cy="200"
            r="128"
            pathLength="100"
            className={styles.progressRing}
            data-nav-progress=""
          />
        </svg>

        {/* Emblema central */}
        <div className={styles.emblemWrap}>
          <Image
            src="/logo.jpeg"
            alt=""
            fill
            sizes="(min-width: 1024px) 168px, 120px"

            className={styles.emblemImg}
            priority={false}
          />
        </div>

        {/* 8 nodos con icono Lucide; se rellenan en cascada */}
        {NODES.map(({ icon: Icon, area, x, y }, index) => (
          <div
            key={`node-${index}`}
            className={`${styles.node} ${styles[`node-${index}`]} ${styles[ORBIT_ANIM_CLASSES[index]]}`}
            style={{ left: `${x}%`, top: `${y}%` }}
            data-node-area={area}
          >
            <span className={styles.nodeFill} />
            <Icon size={18} aria-hidden="true" className={styles.nodeIcon} strokeWidth={1.8} />
          </div>
        ))}

        {/* 8 pulsos: uno por spoke, desde el emblema hacia el nodo */}
        {SPOKES.map((spoke, index) => {
          // Ruta circular del centro (200,200) → el nodo
          const path = `M${spoke.x1},${spoke.y1} L${spoke.x2},${spoke.y2}`;
          return (
            <span
              key={`pulse-${index}`}
              className={`${styles.pulse} ${styles[`pulse-${index}`]}`}
              style={{ offsetPath: `path("${path}")` }}
              aria-hidden="true"
            />
          );
        })}

        {/* Pulso simultáneo al cierre */}
        <span className={styles.finalPulse} aria-hidden="true" />
      </div>

      {/* Texto bajo el conjunto */}
      <div className={styles.textBlock}>
        <p data-nav-label className={styles.label}>
          {dict?.loading?.openingProject?.replace("{name}", "…") ??
            "Opening project…"}
        </p>
        <p data-nav-domain className={styles.domain} />
      </div>
    </div>
  );
}
