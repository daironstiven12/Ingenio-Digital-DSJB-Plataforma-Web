import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LanguageProvider from "@/components/i18n/LanguageProvider";
import ScrollProgress from "@/components/motion/ScrollProgress";
import BrandLoader from "@/components/ui/BrandLoader";
import { resolveLang } from "@/lib/i18n";
import { es } from "@/data/i18n/es";
import { en } from "@/data/i18n/en";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Dominio público del sitio. Sin variable definida, los metadatos OG/Twitter
// y el sitemap apuntarán a localhost (avisado en build). Definir en hosting:
// NEXT_PUBLIC_SITE_URL=https://tudominio.com
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!siteUrl) {
  console.warn(
    "[ingenio-digital] NEXT_PUBLIC_SITE_URL no está definida. " +
      "metadataBase usará http://localhost:3000; los enlaces canónicos y " +
      "Open Graph no serán válidos en producción hasta definirla.",
  );
}
const metadataBase = new URL(siteUrl ?? "http://localhost:3000");

const dicts = { es, en };

// Metadata localizada según la cookie/Accept-Language (documentado en el
// informe: la solución con rutas /es /en + hreflang es la alternativa completa).
export async function generateMetadata() {
  const lang = await resolveLang();
  const dict = dicts[lang];
  const description = dict.brandDesc;

  return {
    metadataBase,
    title: {
      default: "Ingenio Digital DSJB",
      template: "%s | Ingenio Digital DSJB",
    },
    description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: lang === "en" ? "en_US" : "es_ES",
      siteName: "Ingenio Digital DSJB",
      title: "Ingenio Digital DSJB",
      description,
      url: "/",
    },
    twitter: {
      card: "summary_large_image",
      title: "Ingenio Digital DSJB",
      description,
    },
  };
}

// La resolución de idioma (cookie / Accept-Language) es dinámica por diseño:
// el HTML se sirve en el idioma correcto sin parpadeo ni recarga. Se permite
// la ruta bloqueante con esta opción documentada de Next (cacheComponents).
// Alternativa a futuro: rutas estáticas /es y /en con hreflang (ver informe).
export const instant = false;

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0b1e" },
    { media: "(prefers-color-scheme: light)", color: "#fafaff" },
  ],
};

// Sin JS aún en el servidor: este script decide ANTES del primer pintado:
//   1) tema (data-theme, con localStorage o prefers-color-scheme),
//   2) decisión ÚNICA de movimiento (clase motion-off),
//   3) intro (clase intro-on).
// En desarrollo imprime [intro] decision=... y expone window.__motion.
const isDev = process.env.NODE_ENV !== "production";
const devLog = isDev
  ? 'try{console.log("[intro] decision="+decision+" reason="+decReason);}catch(e){}'
  : "";

const themeInit = `(function(){
  try{var t=window.localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}
  var q="";try{q=(window.location&&window.location.search)?window.location.search:"";}catch(e){}
  var mo=null;var mMo=/[?&]motion=(on|off)(?:&|$)/.exec(q);if(mMo)mo=mMo[1];
  try{if(mo){window.sessionStorage.setItem("motion-override",mo);}else{mo=window.sessionStorage.getItem("motion-override");}}catch(e){}
  var allowed=true,reason="system";
  if(mo==="on"){allowed=true;reason="param";}
  else if(mo==="off"){allowed=false;reason="param";}
  else{try{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){allowed=false;reason="reducedMotion";}}catch(e){}}
  if(!allowed){document.documentElement.classList.add("motion-off");}
  var force=/[?&]intro=1/.test(q),off=/[?&]intro=0/.test(q),seen=false;
  try{var raw=window.localStorage.getItem("ingenio-intro");if(raw){try{var d=JSON.parse(raw);if(d&&typeof d.t==="number"&&(Date.now()-d.t)<2592000000){seen=true;}}catch(e){}}}catch(e){}
  var decision="skip",decReason=reason;
  if(off){decision="skip";decReason="param";}
  else if(force){decision="show";decReason="param";}
  else if(!allowed&&!force){decision="skip";decReason=reason;}; if(force){allowed=true;reason="param";document.documentElement.classList.remove("motion-off");}
  else if(seen){decision="skip";decReason="seen";}
  else{decision="show";decReason="fresh";}
  if(decision==="show"){document.documentElement.classList.add("intro-on");}
  window.__motion={allowed:allowed,reason:reason};
  ${devLog}
  document.documentElement.classList.add("js");
})();`;

// Datos estructurados mínimos: sin URLs, `sameAs` ni datos de contacto sin confirmar.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ingenio Digital DSJB",
  description:
    "Organización tecnológica multidisciplinaria: ingeniería de sistemas, desarrollo de software, arquitectura tecnológica, redes, electrónica e innovación educativa.",
  knowsAbout: [
    "Ingeniería de sistemas",
    "Desarrollo de software",
    "Arquitectura tecnológica",
    "Redes e infraestructura",
    "Electrónica",
    "Formación tecnológica",
  ],
};

export default async function RootLayout({ children }) {
  const lang = await resolveLang();
  const dict = dicts[lang];

  return (
    <html
      lang={lang}
      data-theme="dark"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <LanguageProvider initialLang={lang}>
          <BrandLoader />
          <ScrollProgress />
          <a href="#contenido" className="skip-link">
            {dict.skipLink}
          </a>
          <Header />
          <main id="contenido" tabIndex={-1}>{children}</main>
          <Footer />
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
