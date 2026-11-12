"use client";

import { useT } from "@/components/i18n/LanguageProvider";

// Marquee lento con las cinco disciplinas reales (data del diccionario).
// Pausable al hover; estático y envuelto con reduced-motion (globals.css).
export default function Marquee() {
  const { t } = useT();
  const disciplines = t("disciplines");
  const items = Array.isArray(disciplines) ? disciplines : [];
  const track = [...items, ...items]; // duplicado para loop continuo

  return (
    <div className="marquee" role="img" aria-label={t("marqueeLabel")}>
      <div className="marquee-track" aria-hidden="true">
        {track.map((item, index) => (
          <span key={index} className="marquee-item">
            {item}
            <span className="marquee-dot" />
          </span>
        ))}
      </div>
    </div>
  );
}
