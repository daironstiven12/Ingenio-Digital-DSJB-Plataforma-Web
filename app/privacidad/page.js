import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { resolveLang } from "@/lib/i18n";
import { es } from "@/data/i18n/es";
import { en } from "@/data/i18n/en";
import styles from "./privacidad.module.css";

const dicts = { es, en };

export async function generateMetadata() {
  const lang = await resolveLang();
  const dict = dicts[lang];
  return {
    title: dict.privacy.title,
    description: dict.privacy.s1body,
    robots: { index: false, follow: false },
  };
}

export const instant = false;

// Aviso de privacidad PROVISIONAL (ver dict.privacy.todo): texto factual,
// sin promesas legales ni afirmaciones de cumplimiento. El dueño debe
// revisarlo con un responsable de protección de datos o asesor legal.
//
// TODO(dueño/a): revisar con un responsable de datos o asesor legal antes de
// publicitarlo. Texto provisional; no sustituye asesoría legal.
export default async function PrivacidadPage() {
  const lang = await resolveLang();
  const p = dicts[lang].privacy;

  return (
    <section className={`band-cta ${styles.section}`} aria-labelledby="privacidad-titulo">
      <div className={`container ${styles.inner}`}>
        <p className={`eyebrow ${styles.eyebrow}`}>{p.updated}</p>
        <h1 id="privacidad-titulo" className={`section-title ${styles.title}`}>
          {p.title}
        </h1>
        <p className={`section-lead ${styles.lead}`}>{p.intro}</p>

        <div className={styles.body}>
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>{p.s1title}</h2>
            <p className={styles.blockText}>{p.s1body}</p>
          </div>
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>{p.s2title}</h2>
            <p className={styles.blockText}>{p.s2body}</p>
          </div>
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>{p.s3title}</h2>
            <p className={styles.blockText}>{p.s3body}</p>
          </div>
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>{p.s4title}</h2>
            <p className={styles.blockText}>{p.s4body}</p>
          </div>
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>{p.s5title}</h2>
            <p className={styles.blockText}>{p.s5body}</p>
          </div>
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>{p.s6title}</h2>
            <p className={styles.blockText}>{p.s6body}</p>
          </div>
        </div>

        {/* TODO(dueño/a): que un responsable de protección de datos o un asesor legal
            revise este texto antes de publicitarlo. Es un borrador provisional
            y no sustituye asesoría legal. (Ver también p.todo en data/i18n/*.js) */}

        <Link href="/" className={styles.backHome}>
          <ArrowLeft size={18} aria-hidden="true" />
          {p.backHome}
        </Link>
      </div>
    </section>
  );
}
