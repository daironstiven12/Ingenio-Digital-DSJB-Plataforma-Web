"use client";

import { useState } from "react";
import IntroOverlayScene from "@/components/ui/IntroOverlayScene";
import { es } from "@/data/i18n/es";
import styles from "./IntroTest.module.css";

// /intro-test (solo desarrollo; 404 en producción)
// Herramienta de inspección de la secuencia de bienvenida:
//   - "Repetir" vuelve a montar el emblema y todas las animaciones desde cero.
//   - Velocidad: 1× (~4.8 s) · 0.25× · 0.1× (aplica var(--intro-speed) o ?introSpeed=).
//   - Congelar: pausa todas las animaciones y rebobina (-t s) para inspeccionar.
//   - Tema claro/oscuro: remonta el marco con data-theme alterno.
//   - Casilla "simular": el test NUNCA escribe localStorage (ingenio-intro);
//     deja el estado de visita intacto para que no afecte tus pruebas reales.
// URL: http://localhost:3000/intro-test
export default function IntroTestClient() {
  const [cycle, setCycle] = useState(0);
  const [speed, setSpeed] = useState("1");
  const [freeze, setFreeze] = useState(0);
  const [theme, setTheme] = useState("dark");
  const [simulate, setSimulate] = useState(true);

  const frozen = freeze > 0.01;

  return (
    <main className={styles.page} data-theme={theme}>
      <div className={styles.heading}>
        <p className={styles.eyebrow}>Intro · herramienta de desarrollo</p>
        <h1 className={styles.title}>Banco de pruebas del intro</h1>
        <p className={styles.hint}>
          Esta página monta la misma escena que sirve producción en{" "}
          <kbd>http://localhost:3000/intro-test?intro=0</kbd> (usa{" "}
          <code>?intro=0</code> para que no se monte el intro real de producción).
          En producción devuelve 404.
          La secuencia dura ~4.8&nbsp;s a velocidad 1× (configurable con intro.speed en data/site.js; ?introSpeed=0.8 en desarrollo); usa las velocidades lentas
          y el marcador de congelado para inspeccionar cada fase
          (A&nbsp;entrada&nbsp;0–0.9 → B&nbsp;separación&nbsp;1.2–2.0 → C&nbsp;carga&nbsp;2.0–3.2 → pausa&nbsp;3.2–3.8 → D&nbsp;apertura&nbsp;3.8–4.8).
          La casilla «simular» deja <em>fuera</em> localStorage: ninguna visita cuenta.
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.group}>
          <p className={styles.groupLabel}>Velocidad</p>
          <div className={styles.speedGroup} role="group" aria-label="Velocidad de reproducción">
            {["1", "0.25", "0.1"].map((value) => (
              <button
                key={value}
                type="button"
                className={styles.speedButton}
                aria-pressed={speed === value}
                data-active={speed === value ? "true" : "false"}
                onClick={() => setSpeed(value)}
              >
                {value}×
              </button>
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <label htmlFor="intro-freeze" className={styles.groupLabel}>
            Congelar (rebobinar)
          </label>
          <div className={styles.sliderRow}>
            <input
              id="intro-freeze"
              type="range"
              min="0"
              max="4.8"
              step="0.05"
              value={freeze}
              onChange={(event) => setFreeze(Number(event.target.value))}
              className={styles.slider}
              aria-valuetext={`${freeze.toFixed(2)} s`}
            />
            <span className={styles.sliderValue}>-{freeze.toFixed(2)}s</span>
          </div>
        </div>

        <div className={styles.group}>
          <p className={styles.groupLabel}>Tema</p>
          <button
            type="button"
            className={styles.themeButton}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-pressed={theme === "light"}
          >
            {theme === "dark" ? "Cambiar a claro" : "Cambiar a oscuro"}
          </button>
        </div>

        <div className={styles.group}>
          <p className={styles.groupLabel}>Marcar visita</p>
          <label className={styles.toggleRow}>
            <input
              type="checkbox"
              checked={simulate}
              onChange={(event) => setSimulate(event.target.checked)}
            />
            simular que no marca la visita
          </label>
        </div>

        <button
          type="button"
          className={styles.repeatButton}
          onClick={() => setCycle((value) => value + 1)}
        >
          Repetir
        </button>
      </div>

      <div
        className={`${styles.sceneWrap} ${frozen ? styles.frozen : ""}`}
        data-speed={speed}
        style={{ "--intro-speed": speed, "--freeze": `${freeze}s`, "--intro-at": `${freeze}s` }}
      >
        <IntroOverlayScene
          key={cycle}
          dict={es}
          force
          id="intro"
          extraClass={styles.introTestRoot}
        />
      </div>

      <p className={styles.hint}>
        {simulate
          ? "Modo simular: este escenario no escribe localStorage ni el flag de visita."
          : "Mismo comportamiento: el test nunca marca la visita; la marca solo ocurre en producción al terminar o saltar. Borra localStorage para ver el intro como primera visita."}
      </p>
    </main>
  );
}
