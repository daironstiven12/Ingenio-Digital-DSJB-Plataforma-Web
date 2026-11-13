"use client";

// Interruptor de animaciones: role="switch", SSR-safe (neutral=true en
// servidor/primer render del cliente). Lo usan el footer (Preferencias) y
// el panel móvil. El estado real se aplica post-montaje sin hidratación
// desajustada.
import { Sparkles } from "lucide-react";
import { useMotionEnabled } from "@/lib/motionHooks";
import { setMotionPreference } from "@/lib/motion";
import { useT } from "@/components/i18n/LanguageProvider";
import styles from "./MotionSwitch.module.css";

export default function MotionSwitch({ className = "" }) {
  const { t } = useT();
  const enabled = useMotionEnabled();

  const handleToggle = () => {
    setMotionPreference(enabled ? "off" : "on");
  };

  const labelText = `${t("motion.toggle")}: ${
    enabled ? t("motion.on") : t("motion.off")
  }`;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={labelText}
      className={`${styles.switch} ${className}`}
      onClick={handleToggle}
    >
      <span className={styles.track} data-on={enabled ? "true" : "false"} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
      <span className={styles.switchText}>
        <Sparkles size={15} aria-hidden="true" className={styles.switchIcon} />
        {labelText}
      </span>
    </button>
  );
}
