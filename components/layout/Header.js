"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { Menu, X, ArrowRight, Sun, Moon, Search } from "lucide-react";
import { site } from "@/data/site";
import { readTheme, toggleTheme } from "@/lib/theme";
import { lockScroll, unlockScroll } from "@/lib/scrollLock";
import {
  shouldShowMotionNotice,
  dismissMotionNotice,
  setMotionPreference,
} from "@/lib/motion";
import dynamic from "next/dynamic";
import { useT } from "@/components/i18n/LanguageProvider";
import MotionSwitch from "@/components/ui/MotionSwitch";
import styles from "./Header.module.css";

const CommandPalette = dynamic(() => import("@/components/ui/CommandPalette"), {
  ssr: false,
});

// Tema: SSR-neutral "dark" (getServerSnapshot). Cliente lee data-theme
// (aplicado por el script inline antes del primer pintado); MutationObserver
// notifica cambios post-montaje. Sin efectos en cascada.
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

// Antes del primer pintado en cliente; en SSR cae a useEffect.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function LangToggle({ lang, setLang, groupLabel }) {
  return (
    <div className={styles.langToggle} role="group" aria-label={groupLabel}>
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
  );
}

function ThemeButton({ theme, onToggle, label }) {
  const isLight = theme === "light";
  return (
    <button
      type="button"
      className={styles.iconButton}
      onClick={onToggle}
      aria-label={label}
      aria-pressed={isLight}
      title={label}
    >
      {isLight ? (
        <Sun size={18} aria-hidden="true" />
      ) : (
        <Moon size={18} aria-hidden="true" />
      )}
    </button>
  );
}

// Solo icono (sin pista visible). El atajo va en aria-keyshortcuts y title.
function PaletteButton({ label }) {
  const open = () => {
    window.dispatchEvent(new CustomEvent("ingenio:palette-open"));
  };
  return (
    <button
      type="button"
      className={styles.iconButton}
      onClick={open}
      aria-label={label}
      title={`${label} — Ctrl K`}
      aria-keyshortcuts="Control+K Meta+K"
    >
      <Search size={18} aria-hidden="true" />
    </button>
  );
}

// Aviso UNA vez: la preferencia del sistema pide reducir movimiento
// y el usuario aún no eligió. No vuelve a salir tras el botón.
const subscribeNoop = () => () => {};
const getMotionNoticeSnapshot = () => shouldShowMotionNotice();
const getServerMotionNoticeSnapshot = () => false;

function MotionNotice({ t }) {
  const [dismissed, setDismissed] = useState(false);
  const visible = useSyncExternalStore(
    subscribeNoop,
    getMotionNoticeSnapshot,
    getServerMotionNoticeSnapshot,
  );
  if (!visible || dismissed) return null;
  return (
    <div className={styles.motionNotice} role="status" aria-live="polite">
      <p className={styles.motionNoticeText}>{t("motion.notice")}</p>
      <div className={styles.motionNoticeActions}>
        <button
          type="button"
          className={styles.motionNoticeCta}
          onClick={() => setMotionPreference("on")}
        >
          {t("motion.noticeCta")}
        </button>
        <button
          type="button"
          className={styles.motionNoticeDismiss}
          onClick={() => {
            dismissMotionNotice();
            setDismissed(true);
          }}
        >
          {t("motion.noticeDismiss")}
        </button>
      </div>
    </div>
  );
}

export default function Header() {
  const { t, lang, setLang } = useT();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(null);
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const toggleRef = useRef(null);
  const panelRef = useRef(null);
  const headerRef = useRef(null);

  const navItems = t("nav.items");
  const navList = useMemo(
    () => (Array.isArray(navItems) ? navItems : []),
    [navItems],
  );

  // SSR = TOP. Antes del primer pintado, si la página carga con scroll
  // restaurado (>24px) se decide SCROLLED sincrónicamente y se retira la clase
  // pre-pintada scrolled-early (el marco ya está en el estado correcto).
  useIsoLayoutEffect(() => {
    setScrolled(window.scrollY > 24);
    document.documentElement.classList.remove("scrolled-early");
  }, []);

  // Histéresis: activa pasados 24px, desactiva por debajo de 8px; rAF + pasivo.
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      setScrolled((prev) => (prev ? y > 8 : y > 24));
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: marca aria-current la sección más visible.
  useEffect(() => {
    const ids = navList
      .map((item) => item.href.replace("#", ""))
      .filter((id) => id && id !== "inicio" && id !== "contacto");
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
        setActive(best); // null: cuando nada está suficientemente visible (tope)
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.15, 0.4, 0.75, 1] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [navList]);

  const closePanel = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    lockScroll("menu");

    const firstLink = panelRef.current?.querySelector("a");
    firstLink?.focus();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closePanel();
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

    const onPointerDown = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      unlockScroll("menu");
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, closePanel]);

  // Hash o retorno a escritorio (>=1240px): cerrar + liberar
  useEffect(() => {
    if (!open) return undefined;
    const onHashChange = () => closePanel();
    const desktopQuery = window.matchMedia("(min-width: 1240px)");
    const onBreakpoint = (event) => {
      if (event.matches) closePanel();
    };
    window.addEventListener("hashchange", onHashChange);
    desktopQuery.addEventListener("change", onBreakpoint);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      desktopQuery.removeEventListener("change", onBreakpoint);
    };
  }, [open, closePanel]);

  const isLight = theme === "light";
  // Escritorio: sin Inicio (logo) ni Contacto (va en las acciones)
  const desktopItems = navList.filter(
    (item) => item.href !== "#contacto" && item.href !== "#inicio",
  );

  return (
    <header ref={headerRef} className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <CommandPalette />
      <div className={styles.bar}>
        <a href="#inicio" className={styles.brand} aria-label={t("nav.homeLabel")}>
          <Image
            src={site.logo ?? "/logo.jpeg"}
            alt=""
            width={64}
            height={64}
            sizes="36px"
            className={styles.brandLogo}
            data-intro-target="emblem"
            priority
          />
          <span className={styles.brandName}>
            <span className={styles.brandWord} data-intro-target="ingenio">Ingenio</span>
            {" "}
            <span className={styles.brandWord} data-intro-target="digital">Digital</span>
          </span>
        </a>

        {/* Escritorio: enlaces centrados */}
        <nav className={styles.nav} aria-label={t("nav.mainLabel")}>
          <ul className={styles.navList}>
            {desktopItems.map((item) => {
              const id = item.href.replace("#", "");
              const isActive = active === id;
              const label =
                id === "laboratorio"
                  ? t("nav.labShort")
                  : id === "equipo"
                    ? t("nav.teamShort")
                    : item.label;
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
        </nav>

        {/* Acciones (escritorio): buscar · ES|EN · tema · contacto */}
        <div className={styles.actionsDesktop}>
          <PaletteButton label={t("nav.search")} />
          <LangToggle lang={lang} setLang={setLang} groupLabel={t("lang.groupLabel")} />
          <ThemeButton
            theme={theme}
            onToggle={toggleTheme}
            label={isLight ? t("theme.toDark") : t("theme.toLight")}
          />
          <a
            href="#contacto"
            className={`${styles.cta} ${active === "contacto" ? styles.ctaActive : ""}`}
            aria-current={active === "contacto" ? "true" : undefined}
          >
            {t("nav.cta")}
          </a>
        </div>

        {/* Móvil / tablet (<1240px): tema + hamburguesa */}
        <div className={styles.actionsMobile}>
          <ThemeButton
            theme={theme}
            onToggle={toggleTheme}
            label={isLight ? t("theme.toDark") : t("theme.toLight")}
          />
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

      {/* Panel móvil: enlaces (con Inicio), buscar, ES|EN, animaciones, CTA */}
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
                    className={`${styles.panelLink} ${isActive ? styles.panelLinkActive : ""}`}
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

        <div className={styles.panelControls}>
          <PaletteButton label={t("nav.search")} />
          <LangToggle lang={lang} setLang={setLang} groupLabel={t("lang.groupLabel")} />
          <MotionSwitch className={styles.panelSwitch} />
        </div>

        <a
          href="#contacto"
          className={`${styles.panelCta} ${active === "contacto" ? styles.ctaActive : ""}`}
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          aria-current={active === "contacto" ? "true" : undefined}
        >
          {t("nav.cta")}
          <ArrowRight size={18} aria-hidden="true" />
        </a>
      </div>
      <MotionNotice t={t} />
    </header>
  );
}
