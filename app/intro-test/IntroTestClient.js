"use client";

import { useState } from "react";
import OrbitEmblem from "@/components/ui/OrbitEmblem";
import styles from "@/components/ui/IntroOverlay.module.css";

// "Repetir" remonta el emblema + mensaje: todas las animaciones CSS
// del intro arrancan de nuevo desde cero, independientemente de
// localStorage, del script de decisión de <head> y de ?intro.
export default function IntroTestClient() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        minHeight: "calc(100svh - var(--header-h))",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2rem",
        padding: "2rem",
        background: "var(--color-bg)",
      }}
    >
      <p
        style={{
          maxWidth: "60ch",
          textAlign: "center",
          color: "var(--color-text-secondary)",
          fontSize: "0.875rem",
        }}
      >
        Página solo de desarrollo. El emblema y el mensaje se animan con los
        keyframes CSS del intro. El botón <strong>Repetir</strong> los reinicia.
      </p>

      {/* Escena del intro (sin gate de html.intro-on) */}
      <div key={count} className={styles.introStage}>
        <OrbitEmblem size={240} uid={`orbitIntroTestClip-${count}`} />
        <p className={styles.welcome}>
          <span className={styles.welcomeEs} lang="es">
            Bienvenido a Ingenio Digital
          </span>
          <span className={styles.welcomeEn} lang="en">
            Welcome to Ingenio Digital
          </span>
        </p>
      </div>

      <button
        type="button"
        onClick={() => setCount((value) => value + 1)}
        data-intro-repeat
        style={{
          minHeight: 48,
          paddingInline: "2rem",
          fontWeight: 600,
          color: "#081633",
          background: "var(--color-primary)",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          transition: "background-color 140ms",
        }}
      >
        Repetir
      </button>

      <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>
        Escenario {count + 1}. El overlay se ordena con los keyframes de IntroOverlay.module.css.
      </p>
    </div>
  );
}
