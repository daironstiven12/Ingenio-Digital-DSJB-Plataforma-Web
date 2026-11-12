import styles from "./StatusBadge.module.css";

// Badge de estado de proyecto. El estado siempre va acompañado de texto
// (nunca se comunica solo por color).
export default function StatusBadge({ label, tone = "neutral" }) {
  const toneClass =
    tone === "success"
      ? styles.success
      : tone === "warning"
        ? styles.warning
        : styles.neutral;

  return <span className={`${styles.badge} ${toneClass}`}>{label}</span>;
}
