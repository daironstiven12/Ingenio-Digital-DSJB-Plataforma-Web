"use client";

// Dispara el loader global de navegación (#nav-loader) y navega a href en
// la misma pestaña. Usado por LoadingLink y por la paleta de comandos.
import { resolveMotion } from "@/lib/motion";
import { lockScroll, unlockScroll, resetNavigationOverlays } from "@/lib/scrollLock";

export function triggerNavLoader(
  href,
  { labelText = null, domainText = null, accent = null } = {},
) {
  if (typeof window === "undefined") return;
  if (!resolveMotion().allowed) {
    window.location.assign(href);
    return;
  }

  const overlay = document.getElementById("nav-loader");
  if (!overlay) {
    window.location.assign(href);
    return;
  }

  lockScroll("nav");

  const labelEl = overlay.querySelector("[data-nav-label]");
  const domainEl = overlay.querySelector("[data-nav-domain]");
  const progressEl = overlay.querySelector("[data-nav-progress]");

  if (labelEl && labelText) labelEl.textContent = labelText;
  if (domainEl) {
    if (domainText) {
      domainEl.textContent = domainText;
    } else {
      try {
        domainEl.textContent = new URL(href, window.location.href).hostname.replace(
          /^www\./,
          "",
        );
      } catch {
        domainEl.textContent = href;
      }
    }
  }

  const html = document.documentElement;
  if (accent) html.style.setProperty("--nav-accent", accent);

  // Reinicia las animaciones: quitar clase → reflow → añadirla
  html.classList.remove("nav-loading");
  void window.document.documentElement.offsetHeight; // fuerza reflow
  html.classList.add("nav-loading");
  overlay.setAttribute("aria-hidden", "false");

  let navigated = false;
  const finish = () => {
    if (navigated) return;
    navigated = true;
    unlockScroll("nav");
    window.location.assign(href);
  };
  const cancel = () => {
    if (navigated) return;
    navigated = true;
    window.clearTimeout(failsafe);
    document.removeEventListener("keydown", onEscape);
    unlockScroll("nav");
    resetNavigationOverlays();
  };
  const onEscape = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
    }
  };
  document.addEventListener("keydown", onEscape);
  const failsafe = window.setTimeout(finish, 3200);

  if (progressEl) {
    progressEl.addEventListener(
      "animationend",
      () => {
        window.clearTimeout(failsafe);
        document.removeEventListener("keydown", onEscape);
        finish();
      },
      { once: true },
    );
  } else {
    window.setTimeout(() => {
      document.removeEventListener("keydown", onEscape);
      finish();
    }, 1800);
  }
}
