import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { resolveLang } from "@/lib/i18n";
import { es } from "@/data/i18n/es";
import { en } from "@/data/i18n/en";
import NotFoundScene from "@/components/ui/NotFoundScene";
import styles from "./not-found.module.css";

// 404 de marca dentro del layout normal. Escena orbital con un nodo
// desconectado; texto grande con degradado; CTA principal sólido.
export const metadata = {
  title: "404 — No conectada",
  robots: {
    index: false,
    follow: false,
  },
};

const dicts = { es, en };

export default async function NotFoundPage() {
  const lang = await resolveLang();
  const dict = dicts[lang];

  // Es una página de error: se respetan las mismas reglas i18n que el resto.
  // Escape directo si algo rompe en la resolución de idioma.
  return (
    <section className={styles.section} aria-labelledby="not-found-title">
      <div className={`container ${styles.inner}`}>
        <NotFoundScene className={styles.scene} />

        <p className={styles.errorNumber} aria-hidden="true" data-404="404">
          404
        </p>

        <h1 id="not-found-title" className={styles.title}>
          {dict.notFound.title}
        </h1>
        <p className={styles.lead}>{dict.notFound.lead}</p>

        <div className={styles.actions}>
          <Link href="/" className={`btn-solid ${styles.ctaPrimary}`}>
            <ArrowLeft size={18} aria-hidden="true" />
            {dict.notFound.backHome}
          </Link>
          <Link href="/#proyectos" className={`btn-secondary ${styles.ctaSecondary}`}>
            {dict.notFound.viewProjects}
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <nav aria-label={lang === "es" ? "Páginas sugeridas" : "Suggested pages"} className={styles.suggestions}>
          <Link href="/#inicio" className={styles.suggestionLink}>
            {dict.notFound.suggestionHome}
          </Link>
          <Link href="/#proyectos" className={styles.suggestionLink}>
            {dict.notFound.suggestionProjects}
          </Link>
          <Link href="/#laboratorio" className={styles.suggestionLink}>
            {dict.notFound.suggestionLab}
          </Link>
        </nav>
      </div>
    </section>
  );
}
