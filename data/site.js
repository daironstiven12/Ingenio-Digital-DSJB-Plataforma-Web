// Identidad, navegación y canales de Ingenio Digital DSJB.
// Regla: los campos null se ocultan en la interfaz hasta confirmar datos reales.

export const site = {
  name: "Ingenio Digital DSJB",
  tagline: "Organización tecnológica multidisciplinaria",
  description:
    "Ingeniería de sistemas, desarrollo de software, arquitectura tecnológica, redes, electrónica e innovación educativa.",
  // Logotipo oficial: /public/logo.jpeg, referenciado directamente en Header y Footer.
  logo: "/logo.jpeg",
  // Vídeo de circuitos digitales (public/media/). Se muestra en
  // Especializaciones. Solo se carga cerca del viewport, ≥768 px,
  // sin prefers-reduced-motion y sin saveData. Para desactivarlo: false.
  media: {
    specializationsVideo: true,
    heroVideo: true,
  },
  // Redes oficiales: null por defecto; el pie solo muestra lo que tenga URL real.
  social: {
    linkedin: null,
    github: null,
    facebook: null,
    instagram: null,
  },
  // Año estático para el pie (Cache Components no permite new Date() en render).
  // Actualizar al cambiar de año.
  copyrightYear: 2026,
  // Opción de marca (del dueño): si false, al terminar el intro las palabras
  // viajan FLIP al header (configurado en layout.js/IntroOverlayScene). Si true,
  // quedarían como tipografía gigante en las esquinas del hero (sin implementar
  // — ver informe: layout sin tocar para no romper el diseño actual).
  intro: {
    wordsInHero: false,
    // Capa de trazos de circuito (V3): desactivada por defecto. Si se
    // reactiva: máx. 4 elementos, líneas rectas, sin filtros ni sombras.
    traces: false,
    // Orden de la separación vertical (fase B): "digitalUp" | "ingenioUp".
    splitOrder: "digitalUp",
    // Ritmo del intro: 1 = tiempos base V5 (~4.8 s), <1 más lento, >1 más rápido.
    speed: 1,
    // Multiplicador de velocidad cuando el intro ya se vio en esta pestaña
    // (sessionStorage "ingenio-intro-session"). 1 = misma duración.
    repeatSpeed: 1,
    // Frecuencia: "always" (en cada carga, por defecto) | "session" (una vez
    // por pestaña, sessionStorage) | "once" (una vez por navegador,
    // localStorage, TTL 30 días). ?intro=1 tiene prioridad en todos los casos.
    frequency: "always",
  },
};

// La navegación (etiquetas localizadas ES/EN) vive en data/i18n/.

// Canales reales del equipo — solo se muestran los que tengan valor.
// Formatos: whatsapp "573001234567" (solo dígitos con prefijo país) · email "hola@dominio.com"
export const contact = {
  whatsapp: null,
  email: null,
  // Texto de siguiente paso tras enviar el formulario (pantalla de éxito).
  // null → no se muestra nada (no prometemos plazos).
  // Ej.: "Te respondemos personalmente lo antes posible."
  responseTime: null,
};

// Redes oficiales — null/no confirmadas no se renderizan.
export const social = {
  linkedin: null,
  github: null,
  facebook: null,
  instagram: null,
};
