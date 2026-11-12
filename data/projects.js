// Proyectos destacados — estructura lista para contenido real.
//
// IMPORTANTE: no se inventan proyectos, URLs ni estados.
// Para publicar un proyecto real, añadir una entrada con:
//   - status: "experimental" | "en-desarrollo" | "completado"
//   - href: enlace real al proyecto (null = la tarjeta no muestra enlace)
//   - repository: enlace real a su repositorio público (opcional, mismo formato)
//   - image: ruta real en /public/images (null = usa el marcador de reserva)
//
// Mientras el array esté vacío, la sección muestra espacios reservados.

export const projects = [];

// Las etiquetas visibles viven en data/i18n/ (localizadas). Aquí solo el tono.
export const projectStatus = {
  experimental: { tone: "neutral" },
  "en-desarrollo": { tone: "warning" },
  completado: { tone: "success" },
};
