"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { es } from "@/data/i18n/es";
import { en } from "@/data/i18n/en";

// Provider de idioma: sin dependencias. El servidor fija initialLang
// (cookie o Accept-Language), por lo que SSR y primer render coinciden.
// Cambiar idioma no recarga la página: setLang actualiza contexto,
// <html lang>, cookie y localStorage.
const dicts = { es, en };

const LanguageContext = createContext(null);

function resolvePath(dict, path) {
  return path.split(".").reduce(
    (acc, key) => (acc == null ? undefined : acc[key]),
    dict,
  );
}

export default function LanguageProvider({ initialLang = "es", children }) {
  const [lang, setLangState] = useState(dicts[initialLang] ? initialLang : "es");

  const setLang = useCallback((next) => {
    if (!dicts[next]) return;
    setLangState(next);
    document.documentElement.lang = next;
    try {
      window.localStorage.setItem("lang", next);
      document.cookie = `lang=${next};path=/;max-age=31536000;samesite=lax`;
    } catch {
      // Almacenamiento no disponible: el idioma dura solo la sesión.
    }
  }, []);

  const t = useCallback(
    (path) => {
      const value =
        resolvePath(dicts[lang], path) ?? resolvePath(dicts.es, path);
      return value ?? path;
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, t, dict: dicts[lang] }),
    [lang, setLang, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useT() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useT() debe usarse dentro de <LanguageProvider>");
  }
  return ctx;
}
