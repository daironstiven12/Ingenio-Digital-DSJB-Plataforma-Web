// Flujo de contacto conversacional — única fuente de verdad para ids,
// áreas (color) e iconos. Sin imports: lo usan tanto el cliente
// (components/contact/ContactFlow.js) como el servidor
// (app/api/contact/route.js) para tomar etiquetas en español.
//
// Regla de marca: el correo y el WhatsApp que recibe el equipo SIEMPRE
// van en español, así que los envíos se construyen con label.es (las
// etiquetas es/en viven juntas en cada opción).

export const CONTACT_FLOW = {
  // Paso 1 — ¿Qué estás buscando? (single select, 6 opciones con icono)
  needs: [
    {
      id: "web",
      icon: "Globe",
      area: "software",
      label: { es: "Página web o plataforma", en: "Website or platform" },
    },
    {
      id: "automatizar",
      icon: "Workflow",
      area: "arquitectura",
      label: { es: "Automatizar procesos", en: "Automate processes" },
    },
    {
      id: "redes",
      icon: "Network",
      area: "redes",
      label: { es: "Redes e infraestructura", en: "Networks & infrastructure" },
    },
    {
      id: "electronica",
      icon: "Cpu",
      area: "electronica",
      label: { es: "Electrónica e IoT", en: "Electronics & IoT" },
    },
    {
      id: "formacion",
      icon: "GraduationCap",
      area: "formacion",
      label: { es: "Aprender o formación", en: "Learning & training" },
    },
    {
      id: "otra",
      icon: "HelpCircle",
      area: "arquitectura",
      label: { es: "Otra cosa", en: "Something else" },
    },
  ],

  // Paso 2 — depende de la elección. Última opción siempre "otra".
  // id ausente (need="otra"): el flujo salta este paso.
  details: {
    web: [
      { id: "negocio", label: { es: "Presentar mi negocio o portafolio", en: "Showcase my business or portfolio" } },
      { id: "venta", label: { es: "Vender en línea", en: "Sell online" } },
      { id: "sistema", label: { es: "Sistema interno (inventario, facturación)", en: "Internal system (inventory, invoicing)" } },
      { id: "otra", label: { es: "Otra / no estoy seguro", en: "Other / not sure yet" } },
    ],
    automatizar: [
      { id: "facturacion", label: { es: "Facturación y ventas", en: "Invoicing & sales" } },
      { id: "registros", label: { es: "Registros y asistencia", en: "Records & attendance" } },
      { id: "reportes", label: { es: "Reportes y datos", en: "Reports & data" } },
      { id: "otra", label: { es: "Otra / no estoy seguro", en: "Other / not sure yet" } },
    ],
    redes: [
      { id: "disenar", label: { es: "Diseñar o configurar una red", en: "Design or configure a network" } },
      { id: "estabilidad", label: { es: "Mejorar estabilidad o seguridad", en: "Improve stability or security" } },
      { id: "local", label: { es: "Infraestructura para un local u oficina", en: "Infrastructure for a shop or office" } },
      { id: "otra", label: { es: "Otra / no estoy seguro", en: "Other / not sure yet" } },
    ],
    electronica: [
      { id: "prototipo", label: { es: "Prototipo o proyecto IoT", en: "Prototype or IoT project" } },
      { id: "sensores", label: { es: "Sensores y automatización", en: "Sensors & automation" } },
      { id: "embebidos", label: { es: "Sistemas embebidos", en: "Embedded systems" } },
      { id: "otra", label: { es: "Otra / no estoy seguro", en: "Other / not sure yet" } },
    ],
    formacion: [
      { id: "programacion", label: { es: "Aprender programación", en: "Learn programming" } },
      { id: "redes", label: { es: "Aprender redes o electrónica", en: "Learn networking or electronics" } },
      { id: "taller", label: { es: "Taller para un grupo", en: "Workshop for a group" } },
      { id: "otra", label: { es: "Otra / no estoy seguro", en: "Other / not sure yet" } },
    ],
  },

  // Paso 3 — ¿Para quién es?
  audiences: [
    { id: "yo", label: { es: "Para mí", en: "For me" } },
    { id: "negocio", label: { es: "Mi negocio o empresa", en: "My business or company" } },
    { id: "institucion", label: { es: "Una institución o centro educativo", en: "An institution or educational center" } },
    { id: "otro", label: { es: "Otro", en: "Other" } },
  ],

  // Paso 4 — ¿Para cuándo?
  timings: [
    { id: "pronto", label: { es: "Lo antes posible", en: "As soon as possible" } },
    { id: "uno3meses", label: { es: "En 1 a 3 meses", en: "In 1 to 3 months" } },
    { id: "explorando", label: { es: "Solo estoy explorando", en: "Just exploring" } },
  ],
};

export const NEED_AREAS = Object.fromEntries(
  CONTACT_FLOW.needs.map((need) => [need.id, need.area]),
);

export const NEED_ICONS = Object.fromEntries(
  CONTACT_FLOW.needs.map((need) => [need.id, need.icon]),
);

// ===== Validación de lado del servidor: solo ids permitidos =====

export const NEED_IDS = CONTACT_FLOW.needs.map((need) => need.id);
export const AUDIENCE_IDS = CONTACT_FLOW.audiences.map((a) => a.id);
export const TIMING_IDS = CONTACT_FLOW.timings.map((t) => t.id);

export function isValidNeed(id) {
  return typeof id === "string" && NEED_IDS.includes(id);
}

export function isValidDetail(needId, detailId) {
  if (needId === "otra") return detailId == null || detailId === "";
  const list = CONTACT_FLOW.details[needId];
  return (
    typeof detailId === "string" &&
    Array.isArray(list) &&
    list.some((option) => option.id === detailId)
  );
}

export function isValidAudience(id) {
  return typeof id === "string" && AUDIENCE_IDS.includes(id);
}

export function isValidTiming(id) {
  return typeof id === "string" && TIMING_IDS.includes(id);
}

// ===== Etiquetas en español para los envíos (correo/WhatsApp) =====

export function labelForNeed(id) {
  return CONTACT_FLOW.needs.find((need) => need.id === id)?.label.es ?? null;
}

export function labelForDetail(needId, id) {
  return CONTACT_FLOW.details[needId]?.find((option) => option.id === id)?.label.es ?? null;
}

export function labelForAudience(id) {
  return CONTACT_FLOW.audiences.find((a) => a.id === id)?.label.es ?? null;
}

export function labelForTiming(id) {
  return CONTACT_FLOW.timings.find((t) => t.id === id)?.label.es ?? null;
}
