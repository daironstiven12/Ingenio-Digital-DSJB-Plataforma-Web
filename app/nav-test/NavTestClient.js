"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { es } from "@/data/i18n/es";
import styles from "./NavTestClient.module.css";

// Página SOLO de desarrollo. Botón por cada proyecto real; selector de
// velocidad, congelador de animaciones en un instante, modo simular
// (sin navegar) y conmutador de tema.
export default function NavTestClient() {
  const [speed, setSpeed] = useState("1");
  const [freeze, setFreeze] = useState(false);
  const [freezeAt, setFreezeAt] = useState("1");
  const [simulate, setSimulate] = useState(false);
  const [dark, setDark] = useState(true);
  const pageReadyTimer = useRef(null);
  const navTimer = useRef(null);

  const applyTheme = (next) => {
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  };

  const applySpeed = (value) => {
    const overlay = document.getElementById("nav-loader");
    if (overlay) overlay.style.setProperty("--nav-speed", value);
    setSpeed(value);
  };

  const applyFreeze = (enabled, at) => {
    const overlay = document.getElementById("nav-loader");
    if (!overlay) return;
    overlay.classList.toggle(styles.frozen, enabled);
    overlay.style.setProperty("--freeze-delay", `${-parseFloat(at)}s`);
    setFreeze(enabled);
  };

  useEffect(() => {
    applyTheme(dark);
  }, [dark]);

  useEffect(
    () => () => {
      if (pageReadyTimer.current) window.clearTimeout(pageReadyTimer.current);
      if (navTimer.current) window.clearTimeout(navTimer.current);
    },
    [],
  );

  const openLoader = (project) => {
    const html = document.documentElement;
    const overlay = document.getElementById("nav-loader");
    if (!overlay) return;

    const labelEl = overlay.querySelector("[data-nav-label]");
    const domainEl = overlay.querySelector("[data-nav-domain]");
    if (labelEl) {
      labelEl.textContent = `Abriendo ${project.name}…`;
    }
    if (domainEl) {
      try {
        domainEl.textContent = new URL(project.url).hostname.replace(/^www\./, "");
      } catch {
        domainEl.textContent = project.url;
      }
    }
    html.style.setProperty("--nav-accent", project.accent);

    html.classList.remove("nav-loading");
    // reflow para reiniciar las animaciones
    void overlay.offsetHeight;
    html.classList.add("nav-loading");
    overlay.setAttribute("aria-hidden", "false");

    if (simulate) {
      const safeTotal = 2400 * parseFloat(speed) + 400;
      if (navTimer.current) window.clearTimeout(navTimer.current);
      navTimer.current = window.setTimeout(() => {
        html.classList.remove("nav-loading");
        html.style.removeProperty("--nav-accent");
        overlay.setAttribute("aria-hidden", "true");
      }, safeTotal);
    }
  };

  return (
    <main className={styles.page}>
      <p className={styles.note}>
        Página solo de desarrollo. 404 en producción.
      </p>

      <h1 className={styles.title}>Prueba del loader de navegación</h1>
      <p className={styles.lead}>
        Cada botón abre el overlay real sobre la página (gatillo y cierre idénticos
        a los de las tarjetas de proyecto). Modos:
      </p>

      <section className={styles.panel}>
        <p className={styles.panelLabel}>Proyectos reales ({projects.length})</p>
        <div className={styles.buttons}>
          {projects.map((project) => {
            const item = es.sections.projects.items[project.id];
            const name = item?.name ?? project.id;
            return (
              <button
                key={project.id}
                type="button"
                className={styles.projectButton}
                style={{
                  borderColor: project.accent,
                  boxShadow: `0 0 0 1px ${project.accent}`,
                }}
                onClick={() => openLoader({ ...project, name })}
              >
                <span
                  className={styles.accentDot}
                  style={{ background: project.accent }}
                  aria-hidden="true"
                />
                <span className={styles.projectName}>{name}</span>
                <span className={styles.projectDomain}>
                  {new URL(project.url).hostname.replace(/^www\./, "")}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className={styles.panel}>
        <p className={styles.panelLabel}>Velocidad de las animaciones</p>
        <div className={styles.segmented} role="group" aria-label="Velocidad">
          {[
            { label: "1×", value: "1" },
            { label: "0.25×", value: "0.25" },
            { label: "0.1×", value: "0.1" },
          ].map(({ label, value }) => (
            <button
              key={value}
              type="button"
              className={`${styles.segment} ${speed === value ? styles.segmentActive : ""}`}
              aria-pressed={speed === value}
              onClick={() => applySpeed(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.panel}>
        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={simulate}
            onChange={(event) => setSimulate(event.target.checked)}
          />
          <span>Simular (mostrar el loader, no navegar)</span>
        </label>

        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={freeze}
            onChange={(event) => applyFreeze(event.target.checked, freezeAt)}
          />
          <span>Congelar en t =</span>
          <input
            type="number"
            min="0"
            max="3"
            step="0.1"
            value={freezeAt}
            onChange={(event) => {
              setFreezeAt(event.target.value);
              if (freeze) applyFreeze(true, event.target.value);
            }}
            className={styles.numberInput}
            aria-label="Tiempo de congelado en segundos"
          />
          <span>s</span>
        </label>

        <label className={styles.toggleRow}>
          <input
            type="checkbox"
            checked={!dark}
            onChange={(event) => setDark(!event.target.checked)}
          />
          <span>Tema claro</span>
        </label>
      </section>

      <p className={styles.hint}>
        Modo simular: el overlay desaparece solo a los {Math.round(2400 * parseFloat(speed) + 400)} ms.
        Modo real: navega al dominio (usa el botón Atrás para volver).
      </p>
    </main>
  );
}
