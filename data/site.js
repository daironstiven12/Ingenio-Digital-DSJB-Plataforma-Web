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
};

// La navegación (etiquetas localizadas ES/EN) vive en data/i18n/.

export const contact = {
  email: null,
  phone: null,
  whatsapp: null,
  location: null,
  social: [], // { name, href } — solo perfiles confirmados
};
