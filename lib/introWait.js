"use client";

// Esperas del intro del sitio. Sin overlay nunca bloquean; con overlay,
// esperan el estado pedido en <html>; con timeout defensivo de 6.5 s
// para que el contenido jamás quede invisible si algo falla a mitad.
//
// waitForIntroOpening: vídeo del héroe, three.js (HeroGraph), creación de
// ScrollTriggers y parallax. Se desbloquean al abrir la apertura +150 ms.
// waitForIntroDone (legado): Reveal y SectionHeading (contenido bajo el fold).

function isIntroSettled(root, mode) {
  if (!root.classList.contains("intro-on")) return true;
  if (root.classList.contains("intro-done")) return true;
  if (mode === "opening" && root.classList.contains("intro-opening")) return true;
  return false;
}

export function waitForIntroOpening(extraMs = 150, timeoutMs = 6500) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve();
  }
  const root = document.documentElement;
  const delay = () => new Promise((resolve) => window.setTimeout(resolve, extraMs));
  if (isIntroSettled(root, "opening")) {
    return delay();
  }
  return new Promise((resolve) => {
    const cleanup = () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
    const done = () => {
      if (isIntroSettled(root, "opening")) {
        cleanup();
        resolve(delay());
      }
    };
    const observer = new MutationObserver(done);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    const timer = window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, timeoutMs);
    done(); // por si ya terminó entre el gate y el montaje del observer
  });
}

export function waitForIntroDone(timeoutMs = 6500) {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve();
  }
  const root = document.documentElement;
  if (!root.classList.contains("intro-on")) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const done = () => {
      if (
        !root.classList.contains("intro-on") ||
        root.classList.contains("intro-done") ||
        root.classList.contains("intro-opening")
      ) {
        observer.disconnect();
        window.clearTimeout(timer);
        resolve();
      }
    };
    const observer = new MutationObserver(done);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    const timer = window.setTimeout(() => {
      observer.disconnect();
      resolve();
    }, timeoutMs);
    done(); // por si ya terminó entre el gate y el montaje del observer
  });
}
