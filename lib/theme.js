"use client";

// Aplicar/leer el tema desde un único punto para Header y paleta.

export function readTheme() {
  if (typeof window === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

export function applyTheme(next) {
  const target = next === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", target);
  try {
    window.localStorage.setItem("theme", target);
  } catch {
    // localStorage no disponible
  }
}

export function toggleTheme() {
  applyTheme(readTheme() === "light" ? "dark" : "light");
}
