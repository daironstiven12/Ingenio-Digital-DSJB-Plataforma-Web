import Script from "next/script";
import { Inter, Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LanguageProvider from "@/components/i18n/LanguageProvider";
import ScrollProgress from "@/components/motion/ScrollProgress";
import NavLoader from "@/components/ui/NavLoader";
import IntroOverlayScene from "@/components/ui/IntroOverlayScene";
import DebugPanel from "@/components/ui/DebugPanel";
import "@/components/ui/OrbitEmblem.css";
import { resolveLang } from "@/lib/i18n";
import { es } from "@/data/i18n/es";
import { en } from "@/data/i18n/en";
import { site } from "@/data/site";
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
      locale: lang === "en" ? "en_US" : "es_CO",
      alternateLocale: lang === "en" ? ["es_CO"] : ["en_US"],
      siteName: "Ingenio Digital DSJB",
      title: "Ingenio Digital DSJB",
      description,
      url: "/",
      images: [
        {
          url: "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          alt: "Ingenio Digital DSJB — emblema oficial",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ingenio Digital DSJB",
      description,
      images: ["/twitter-image.jpg"],
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
//   3) intro (clase intro-on según site.intro.frequency).
// En desarrollo imprime [intro] decision=... y expone window.__motion.
// NEXT_PUBLIC_INTRO_ALWAYS=1 (solo desarrollo): el intro salta en cada carga.
const isDev = process.env.NODE_ENV !== "production";
const INTRO_ALWAYS = isDev && process.env.NEXT_PUBLIC_INTRO_ALWAYS === "1";
// Frecuencia: session (una vez por pestaña) · once (una vez por navegador,
// 30 días) · always (en cada carga). ?intro=1 fuerza y ?intro=0 desactiva.
const INTRO_FREQUENCY = ["session", "once", "always"].includes(site.intro?.frequency)
  ? site.intro.frequency
  : "session";
// Repetición en la misma pestaña: multiplica la velocidad (repeatSpeed).
const siteRepeatRaw = Number(site.intro?.repeatSpeed);
const INTRO_REPEAT_SPEED =
  Number.isFinite(siteRepeatRaw) && siteRepeatRaw > 0
    ? Math.min(4, Math.max(0.25, siteRepeatRaw))
    : 1;
// Ritmo del intro: site.intro.speed (default 1). En desarrollo, ?introSpeed=0.8
// lo sobreescribe por petición. El inline lo expone como var(--intro-speed).
const siteSpeedRaw = Number(site.intro?.speed);
const INTRO_SPEED =
  Number.isFinite(siteSpeedRaw) && siteSpeedRaw > 0
    ? Math.min(4, Math.max(0.25, siteSpeedRaw))
    : 1;
const devSpeedOverride = isDev
  ? 'var qSpeedM=/[?&]introSpeed=([0-9]+(?:\\.[0-9]+)?)/.exec(q);if(qSpeedM){var sv=parseFloat(qSpeedM[1]);if(isFinite(sv)&&sv>0){introSpeed=Math.min(4,Math.max(0.25,sv));}}'
  : "";
const devLog = isDev
  ? 'try{console.log("[intro] decision="+decision+" reason="+decReason);}catch(e){}'
  : "";

const themeInit = `(function(){
  ${isDev ? `var thM=/[?&]theme=(light|dark)(?:&|$)/.exec((window.location&&window.location.search)||"");if(thM){document.documentElement.setAttribute("data-theme",thM[1]);}else ` : ''}try{var t=window.localStorage.getItem("theme");if(t!=="dark"&&t!=="light"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}
  var q="";try{q=(window.location&&window.location.search)?window.location.search:"";}catch(e){}
  var mo=null;var mMo=/[?&]motion=(on|off)(?:&|$)/.exec(q);if(mMo)mo=mMo[1];
  try{if(mo){window.sessionStorage.setItem("motion-override",mo);}else{mo=window.sessionStorage.getItem("motion-override");}}catch(e){}
  if(!mo){try{var mp=window.localStorage.getItem("motion-preference");if(mp==="on"||mp==="off"){mo=mp;}}catch(e){}}
  var allowed=true,reason="system";
  if(mo==="on"){allowed=true;reason="forced-on";}
  else if(mo==="off"){allowed=false;reason="forced-off";}
  else{try{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){allowed=false;reason="reduced-motion";}}catch(e){}}
  var root2=document.documentElement;
  if(!allowed){document.documentElement.classList.add("motion-off");}
  /* Intro: frecuencia configurable (site.intro.frequency):
       session → una vez por pestaña (sessionStorage "ingenio-intro-session")
       once    → una vez por navegador (localStorage "ingenio-intro", 30 días)
       always  → en cada carga
     La marca se escribe SOLO al terminar o saltar el intro (nunca aquí,
     nunca por el failsafe). ?intro=0 desactiva; ?intro=1 fuerza la salida
     ignorando cualquier marca y reduced-motion. Sin movimiento → skip. */
  var force=/[?&]intro=1/.test(q),off=/[?&]intro=0/.test(q),seen=false;
  var freq="${INTRO_FREQUENCY}";
  var sessionSeen=false;
  try{sessionSeen=window.sessionStorage.getItem("ingenio-intro-session")==="1";}catch(e){}
  if(freq==="once"){try{var raw=window.localStorage.getItem("ingenio-intro");if(raw){try{var d=JSON.parse(raw);if(d&&typeof d.t==="number"&&(Date.now()-d.t)<2592000000){seen=true;}}catch(e){}}}catch(e){}}
  var decision="skip",decReason=reason;
  if(off){decision="skip";decReason="off";}
  else if(force){allowed=true;reason="param";document.documentElement.classList.remove("motion-off");decision="show";decReason="param";}
  else if(!allowed){decision="skip";decReason="reduced-motion";}
  else if(${INTRO_ALWAYS ? "true" : "false"}||freq==="always"){decision="show";decReason="always";}
  else if(freq==="session"&&sessionSeen){decision="skip";decReason="session";}
  else if(freq==="once"&&seen){decision="skip";decReason="seen";}
  else{decision="show";decReason="fresh";}
  try{root2.setAttribute("data-intro-frequency",freq);root2.setAttribute("data-intro-decision",decision);}catch(e){}
  if(decision==="show"){document.documentElement.classList.add("intro-on");try{document.documentElement.classList.add("scroll-locked");}catch(e){}}
  /* Congelado determinista (?intro=1[&motion=on]&introAt=SEGUNDOS):
     congela todas las animaciones en ese instante y pausa el cierre. */
  var iaM=/[?&]introAt=([0-9]+(?:\.[0-9]+)?)/.exec(q),frozenAt=null;
  if(force&&iaM){var ia=parseFloat(iaM[1]);if(isFinite(ia)&&ia>=0&&ia<99){frozenAt=ia;root2.setAttribute("data-intro-at",frozenAt.toFixed(2));root2.style.setProperty("--intro-at",frozenAt+"s");}}
  var frozen=frozenAt!==null;
  /* IMPORTANTE: los failsafes NO tocan atributos de los overlays React.
     Las clases en <html> sobran: los overlays vuelven a display:none sin
     .intro-on/.nav-loading (indicado por intro/nav-loader como es SSR). */
  var bail=function(){try{
    ${isDev ? 'if(!window.__introExit){try{console.warn("[intro] exit=failsafe");}catch(e){}}' : ''}
    window.__scrollUnlockAll&&window.__scrollUnlockAll();
    var d=document.documentElement;
    d.classList.remove("intro-on","nav-loading","scroll-locked","intro-opening");
    d.classList.add("intro-done");
  }catch(e){}};
  /* Ritmo del intro: site.intro.speed en producción; si ya se vio en esta
     pestaña (sessionSeen) se multiplica por intro.repeatSpeed; ?introSpeed=
     en desarrollo tiene la última palabra. Se expone como --intro-speed. */
  var introSpeed=${INTRO_SPEED};
  var repeatSpeed=${INTRO_REPEAT_SPEED};
  if(sessionSeen&&repeatSpeed!==1){introSpeed=Math.min(8,introSpeed*repeatSpeed);}
  ${devSpeedOverride}
  try{root2.style.setProperty("--intro-speed",String(introSpeed));}catch(e){}
  /* Header: si la página carga con scroll restaurado (>24px), el estado
     SCROLLED se aplica antes del primer pintado (sin transición). */
  try{if(window.scrollY>24){root2.classList.add("scrolled-early");}}catch(e){}
  /* pageshow: SOLO restore desde bfcache (persisted). En carga inicial NO
     dispara bail (el intro vive su ciclo). En restore: cerrar el intro
     (bail) o liberar nav/scroll si está congelado — nunca dejar
     scroll-locked atascado ni intro-on congelado matando la vuelta. */
  var unlockStuck=function(event){try{
    if(!(event&&event.persisted)){return;}
    if(!frozen){bail();return;}
    var d=document.documentElement;
    d.classList.remove("nav-loading","scroll-locked");
  }catch(e){}};
  if(!frozen){setTimeout(bail, Math.max(6000, Math.ceil((4.8 / introSpeed + 1) * 1000)));} /* failsafe ≥ 6 s y siempre mayor que duración/speed + 1 s */
  window.addEventListener("pageshow",unlockStuck);   /* solo persisted; la carga inicial no lo dispara */
  document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible"&&!frozen)bail();});
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

// Script de cierre del intro: <script src="/intro-exit.js" defer> en <body>.
// Sin build: public/intro-exit.js es autocontenido; node --check lo verifica.

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
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

        {/* Intro CSS-first: visible solo si <html class="intro-on"> (script inline,
            frecuencia intro.frequency; ?intro=0/1). Sin JS nunca se muestra; el
            failsafe del inline lo oculta a los ≥6 s escalados por velocidad. */}
        <IntroOverlayScene dict={dict} />
        {/* Loader global para salidas externas (LoadingLink). Servidor-rendered,
            CSS-first; el anillo de progreso manda el cierre (animationend). */}
        <NavLoader dict={dict} />
        <script src="/intro-exit.js" defer />
        <div className="page-shell">
          <LanguageProvider initialLang={lang}>
            <ScrollProgress />
            <a href="#contenido" className="skip-link">
              {dict.skipLink}
            </a>
            <Header />
            <main id="contenido" tabIndex={-1}>{children}</main>
            <Footer />
            <DebugPanel />
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
