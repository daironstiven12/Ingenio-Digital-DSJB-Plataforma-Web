"use client";

import { useSyncExternalStore } from "react";

// Lectura reactiva del atributo data-theme (aplicado por el script inline
// de <head> y mutado por el toggle del header). Evita duplicar la lógica
// de detección en cada componente.

function subscribeTheme(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getSnapshot = () =>
  document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
const getServerSnapshot = () => "dark";

export default function useTheme() {
  return useSyncExternalStore(subscribeTheme, getSnapshot, getServerSnapshot);
}
