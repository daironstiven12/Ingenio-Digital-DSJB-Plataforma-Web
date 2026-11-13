// Proyectos reales — publicados con permiso del dueño.
// Regla: no se inventan métricas, ni tecnologías, ni compromisos.
// Accent = theme-color real de cada sitio desplegado.

export const projectStatus = {
  experimental: { tone: "neutral" },
  "en-desarrollo": { tone: "warning" },
  completado: { tone: "success" },
};

// TODO(clientes): confirmar autorización para mostrar públicamente los proyectos
// de clientes (Sueños de Papiro y Panadería La Reina). Confirmar caso por caso.
export const projects = [
  {
    id: "asistencias-utch",
    url: "https://asistencias-utch.vercel.app/",
    accent: "#0A2350",
    live: true,
  },
  {
    id: "suenos-de-papiro",
    url: "https://dedicacion-eterna.vercel.app/",
    accent: "#8B4513",
    live: true,
  },
  {
    id: "panaderia-la-reina",
    url: "https://panaderia-la-reina-phi.vercel.app/login",
    accent: "#56351F",
    live: true,
  },
  {
    id: "binova-ia",
    url: "https://binova-ia.netlify.app/",
    accent: "#0A5FB0",
    live: true,
  },
];
