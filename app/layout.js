import Script from "next/script";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LanguageProvider from "@/components/i18n/LanguageProvider";
import ScrollProgress from "@/components/motion/ScrollProgress";
import OrbitEmblem from "@/components/ui/OrbitEmblem";
import NavLoader from "@/components/ui/NavLoader";
import intro from "@/components/ui/IntroOverlay.module.css";
import "@/components/ui/OrbitEmblem.css";
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

// Script de cierre del intro (unas pocas líneas): quita la clase pre-pintada,
// restaura el scroll y marca la visita SOLO al terminar/saltar. Si el overlay
// desaparece por el failsafe CSS, no se marca (la intro pudo no verse).
const introExitScript = `(function(){
  var root=document.documentElement;
  function end(seen){
    if(!root.classList.contains("intro-on"))return;
    if(root.classList.contains("intro-done"))return;
    root.classList.add("intro-done");
    root.classList.remove("intro-on");
    try{if(seen){window.localStorage.setItem("ingenio-intro",JSON.stringify({t:Date.now()}));}}catch(e){}
    var m=document.getElementById("contenido");
    if(m){try{m.focus({preventScroll:true});}catch(e){}}
  }
  var skip=document.querySelector("[data-intro-skip]");
  if(skip){skip.addEventListener("click",function(){end(true);});}
  document.addEventListener("keydown",function(e){if(e.key==="Escape"){end(true);}});
  var overlay=document.getElementById("intro");
  if(!overlay){end(false);return;}
  overlay.addEventListener("animationend",function(e){
    if(e.target!==overlay)return;
    if(e.animationName==="introExit"){end(true);}
    else if(e.animationName==="introFailsafe"){end(false);}
  });
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
        <Script id="theme-init" strategy="beforeInteractive">
          {themeInit}
        </Script>
      </head>
      <body>
        {/* Filtro "electric" único para las tarjetas (solo en viewport mediante .live) */}
        <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
          <filter id="electric" width="240%" height="240%" x="-70%" y="-70%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" result="noiseA" />
            <feDisplacementMap in="SourceGraphic" in2="noiseA" scale="18" xChannelSelector="R" yChannelSelector="G" result="dispA" />
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="19" result="noiseB" />
            <feDisplacementMap in="dispA" in2="noiseB" scale="14" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        {/* Intro CSS-first: visible solo si <html class="intro-on"> (script inline).
            Sin JS nunca se muestra; el failsafe oculta a los 4 s aunque falle todo. */}
        <div id="intro" className={intro.introOverlay} role="status" aria-live="polite" aria-label={dict.loading.label}>
          <button type="button" className={intro.skip} data-intro-skip aria-label={dict.loading.skip}>
            {dict.loading.skip}
          </button>
          <div className={intro.introStage}>
            <OrbitEmblem size={240} uid="orbitEmblemIntroClip" />
            <p className={intro.welcome}>
              <span className={intro.welcomeEs} lang="es">{dict.loading.welcome}</span>
              <span className={intro.welcomeEn} lang="en">{dict.loading.welcomeEn}</span>
            </p>
          </div>
        </div>
        {/* Loader global para salidas externas (LoadingLink). Servidor-rendered,
            CSS-first; el anillo de progreso manda el cierre (animationend). */}
        <NavLoader dict={dict} />
        <Script id="intro-exit" strategy="beforeInteractive">
          {introExitScript}
        </Script>
        <LanguageProvider initialLang={lang}>
          <ScrollProgress />
          <a href="#contenido" className="skip-link">
            {dict.skipLink}
          </a>
          <Header />
          <main id="contenido" tabIndex={-1}>{children}</main>
          <Footer />
        </LanguageProvider>
        <Script id="organization-jsonld" type="application/ld+json" strategy="beforeInteractive">
          {JSON.stringify(organizationJsonLd)}
        </Script>
      </body>
    </html>
  );
}
