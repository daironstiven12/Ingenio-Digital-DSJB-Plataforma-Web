// Language resolution on the server (root layout).
// Priority: cookie "lang" → Accept-Language header → default Spanish.
// The same value seeds <html lang> and the client provider, so there is
// no flash and no hydration mismatch.

import { cookies, headers } from "next/headers";

export const LANGS = ["es", "en"];
export const DEFAULT_LANG = "es";
export const LANG_COOKIE = "lang";

function normalize(tag) {
  if (!tag) return null;
  const short = String(tag).trim().toLowerCase().split("-")[0];
  return LANGS.includes(short) ? short : null;
}

export async function resolveLang() {
  try {
    const store = await cookies();
    const fromCookie = normalize(store.get(LANG_COOKIE)?.value);
    if (fromCookie) return fromCookie;
  } catch {
    // Sin acceso a cookies (p. ej. prerender estático): seguir con cabeceras.
  }

  try {
    const headerList = await headers();
    const accept = headerList.get("accept-language") ?? "";
    for (const part of accept.split(",")) {
      const match = normalize(part.split(";")[0]);
      if (match) return match;
    }
  } catch {
    // Sin cabeceras: idioma por defecto.
  }

  return DEFAULT_LANG;
}
