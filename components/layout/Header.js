"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { site } from "@/data/site";
import { useT } from "@/components/i18n/LanguageProvider";
import useMagnetic from "@/lib/useMagnetic";
import styles from "./Header.module.css";

// El tema lo aplica el script inline de layout.js y lo persiste el toggle;
// useSyncExternalStore lo lee del atributo data-theme sin efectos en cascada.
function subscribeTheme(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getThemeSnapshot = () =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
const getServerThemeSnapshot = () => "dark";

// Barra sticky: emblema + "Ingenio Digital" (una línea), selector de idioma
// ES|EN, selector de tema, scroll-spy con aria-current, compacta al hacer
// scroll y menú móvil (Escape, focus trap, bloqueo de scroll).
export default function Header() {
  const { t, lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("inicio");
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const ctaRef = useMagnetic(4);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);

  const navItems = t("nav.items");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: marca la sección visible como aria-current.
  useEffect(() => {
    const ids = Array.isArray(navItems)
      ? navItems.map((item) => item.href.replace("#", ""))
      : [];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    if (sections.length === 0) return undefined;

    const visible = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(
            entry.target.id,
            entry.isIntersecting ? entry.intersectionRatio : 0,
          );
        }
        let best = null;
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            best = id;
          }
        }
        if (best) setActive(best);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.75, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navItems]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const firstLink = panelRef.current?.querySelector("a");
    firstLink?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll("a, button");
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("theme", next);
    } catch {
      // localStorage no disponible: el tema solo dura la sesión.
    }
  };

  const isLight = theme === "light";
  const navList = Array.isArray(navItems) ? navItems : [];

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <a href="#inicio" className={styles.brand} aria-label={t("nav.homeLabel")}>
          <Image
            src={site.logo ?? "/logo.jpeg"}
            alt=""
            width={80}
            height={80}
            sizes="44px"
            className={styles.brandLogo}
            priority
          />
          <span className={styles.brandName}>Ingenio&nbsp;Digital</span>
        </a>

        <nav className={styles.nav} aria-label={t("nav.mainLabel")}>
          <ul className={styles.navList}>
            {navList
              .filter((item) => item.href !== "#contacto")
              .map((item) => {
                const id = item.href.replace("#", "");
                const isActive = active === id;
                const label = id === "laboratorio" ? t("nav.labShort") : item.label;
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                      aria-current={isActive ? "true" : undefined}
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
          </ul>
          <a
            ref={ctaRef}
            href="#contacto"
            className={`btn-primary ${styles.cta}`}
            aria-current={active === "contacto" ? "true" : undefined}
          >
            {t("nav.cta")}
            <ArrowRight size={16} aria-hidden="true" />
          </a>
        </nav>

        <div className={styles.actions}>
          <div className={styles.langToggle} role="group" aria-label={t("lang.groupLabel")}>
            {["es", "en"].map((code) => (
              <button
                key={code}
                type="button"
                className={`${styles.langButton} ${lang === code ? styles.langButtonActive : ""}`}
                aria-pressed={lang === code}
                onClick={() => setLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>

          <span className={styles.actionDivider} aria-hidden="true" />
          <button
            type="button"
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={isLight ? t("theme.toDark") : t("theme.toLight")}
            aria-pressed={isLight}
          >
            {isLight ? (
              <Sun size={20} aria-hidden="true" />
            ) : (
              <Moon size={20} aria-hidden="true" />
            )}
          </button>

          <span className={styles.actionDivider} aria-hidden="true" />
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div
        id="menu-movil"
        ref={panelRef}
        className={`${styles.panel} ${open ? styles.panelOpen : ""}`}
        aria-hidden={!open}
      >
        <nav aria-label={t("nav.mobileLabel")}>
          <ul className={styles.panelList}>
            {navList.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = active === id;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={styles.panelLink}
                    aria-current={isActive ? "true" : undefined}
                    onClick={() => setOpen(false)}
                    tabIndex={open ? 0 : -1}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <a
          href="#contacto"
          className={`btn-primary ${styles.panelCta}`}
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
        >
          {t("nav.cta")}
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
    </header>
  );
}
