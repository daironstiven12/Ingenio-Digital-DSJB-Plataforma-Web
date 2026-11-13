// Emblema orbital compartido (intro de bienvenida CSS-first y loader compacto
// de transiciones). SVG estático, sin JS, sin estado. Las clases y keyframes
// viven en IntroOverlay.module.css y se aplican con CSS propio.
// Geometría calculada una vez: viewBox 0 0 240 240, centro (120,120).

const NODES = [
  { cx: 120.0, cy: 28.0, cls: "n-sw" },
  { cx: 185.05, cy: 54.95, cls: "n-sw" },
  { cx: 212.0, cy: 120.0, cls: "n-redes" },
  { cx: 185.05, cy: 185.05, cls: "n-redes" },
  { cx: 120.0, cy: 212.0, cls: "n-ele" },
  { cx: 54.95, cy: 185.05, cls: "n-arq" },
  { cx: 28.0, cy: 120.0, cls: "n-for" },
  { cx: 54.95, cy: 54.95, cls: "n-ele" },
];

const SPOKES = [
  { x1: 120.0, y1: 68.0, x2: 120.0, y2: 28.0 },
  { x1: 156.77, y1: 83.23, x2: 185.05, y2: 54.95 },
  { x1: 172.0, y1: 120.0, x2: 212.0, y2: 120.0 },
  { x1: 156.77, y1: 156.77, x2: 185.05, y2: 185.05 },
  { x1: 120.0, y1: 172.0, x2: 120.0, y2: 212.0 },
  { x1: 83.23, y1: 156.77, x2: 54.95, y2: 185.05 },
  { x1: 68.0, y1: 120.0, x2: 28.0, y2: 120.0 },
  { x1: 83.23, y1: 83.23, x2: 54.95, y2: 54.95 },
];

export default function OrbitEmblem({ size = 240, uid = "orbitEmblemClip" }) {
  return (
    <svg
      viewBox="0 0 240 240"
      width={size}
      height={size}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className="orbitEmblem"
    >
      <defs>
        <clipPath id={uid}>
          <circle cx="120" cy="120" r="44" />
        </clipPath>
      </defs>

      {/* 8 spokes se dibujan en cascada */}
      {SPOKES.map((s, i) => (
        <line
          key={`spoke-${i}`}
          x1={s.x1}
          y1={s.y1}
          x2={s.x2}
          y2={s.y2}
          className={`orbitSpoke orbitSpoke-${i}`}
          pathLength="100"
        />
      ))}

      {/* Anillo exterior punteado */}
      <circle
        cx="120"
        cy="120"
        r="68"
        className="orbitRing orbitDraw"
        pathLength="100"
      />
      {/* Círculo interior */}
      <circle
        cx="120"
        cy="120"
        r="52"
        className="orbitInner orbitDraw orbitDrawSlow"
        pathLength="100"
      />
      <circle cx="120" cy="120" r="48" className="orbitEmblemDisc" />
      <image
        href="/logo.jpeg"
        x="76"
        y="76"
        width="88"
        height="88"
        clipPath={`url(#${uid})`}
        preserveAspectRatio="xMidYMid slice"
        className="orbitEmblemImg"
      />

      {/* 8 nodos: se rellenan en cascada */}
      {NODES.map((n, i) => (
        <circle
          key={`node-${i}`}
          cx={n.cx}
          cy={n.cy}
          r="14"
          className={`orbitNode orbitNode-${i} ${n.cls}`}
        />
      ))}
    </svg>
  );
}
