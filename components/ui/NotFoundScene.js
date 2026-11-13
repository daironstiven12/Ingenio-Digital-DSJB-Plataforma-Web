import { Unplug } from "lucide-react";
import styles from "./NotFoundScene.module.css";

// Escena del 404: orbital reducido con un nodo desconectado.
// CSS-first: el pulso viaja por la línea cortada y se apaga antes del corte.
// 8 nodos en la geometría estándar, solo el "6" (izquierda-medio) está roto.

const NODES = [
  { x: 100, y: 12 },
  { x: 166, y: 44 },
  { x: 200, y: 100 },
  { x: 166, y: 156 },
  { x: 100, y: 188 },
  { x: 34, y: 156 },
  { x: 0, y: 100 },
  { x: 34, y: 44 },
];

const SPOKES = NODES.map((n, i) => ({ from: { x: 100, y: 100 }, to: n, index: i }));

export default function NotFoundScene({ className = "" }) {
  // ViewBox 0 0 200 200 · centro (100,100) · emblema r=34 · nodos r=10 · órbita r=88
  return (
    <div className={`${styles.wrapper} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200" className={styles.svg} fill="none" focusable="false">
        {/* Anillo contenedor punteado */}
        <circle cx="100" cy="100" r="86" strokeDasharray="4 10" className={styles.ring} />

        {/* Conexiones */}
        {SPOKES.map(({ from, to, index }) =>
          index === 6 ? (
            <line
              key={index}
              x1={from.x}
              y1={from.y}
              x2="52"
              y2="100"
              className={styles.spokeBroken}
            />
          ) : (
            <line
              key={index}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              className={styles.spoke}
            />
          ),
        )}

        {/* Emblema central */}
        <circle cx="100" cy="100" r="28" className={styles.emblemDisc} />

        {/* Nodos */}
        {NODES.map((node, index) =>
          index === 6 ? (
            <circle key={index} cx={node.x} cy={node.y} r="11" className={styles.nodeBroken} />
          ) : (
            <circle key={index} cx={node.x} cy={node.y} r="11" className={styles.node} />
          ),
        )}
      </svg>

      {/* Icono "desconectado" sobre el nodo roto (junto a su coordenada %) */}
      <span
        className={styles.unplugBadge}
        style={{ left: "0%", top: "50%", transform: "translate(-50%, -50%)" }}
      >
        <Unplug size={18} aria-hidden="true" className={styles.unplugGlyph} strokeWidth={1.6} />
      </span>

      {/* Pulso que viaja y se apaga en el corte */}
      <span className={styles.pulse} aria-hidden="true" />
    </div>
  );
}
