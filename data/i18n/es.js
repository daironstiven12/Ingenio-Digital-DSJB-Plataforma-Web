// Dictionary ES — única fuente de textos visibles en español.
// Nada de contenido inventado: las mismas afirmaciones que ya usa el sitio.

export const es = {
  team: {
    roleCreator: "Creador de Ingenio Digital",
    linkedinAria: "LinkedIn de {name}",
    githubAria: "GitHub de {name}",
    siteAria: "Sitio de {name}",
    photoAlt: "Retrato de {name}",
    emailAria: "Correo para {name}",
  },
  brandDesc:
    "Organización tecnológica multidisciplinaria: ingeniería de sistemas, desarrollo de software, arquitectura tecnológica, redes, electrónica e innovación educativa.",
  skipLink: "Saltar al contenido",
  nav: {
    mainLabel: "Navegación principal",
    mobileLabel: "Navegación móvil",
    footerLabel: "Navegación del pie",
    homeLabel: "Ingenio Digital DSJB — inicio",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    cta: "Contacto",
    labShort: "Laboratorio",
    teamShort: "Equipo",
    search: "Buscar",
    items: [
      { label: "Inicio", href: "#inicio" },
      { label: "Nosotros", href: "#propuesta" },
      { label: "Servicios", href: "#especializaciones" },
      { label: "Proyectos", href: "#proyectos" },
      { label: "Laboratorio digital", href: "#laboratorio" },
      { label: "Profesionales", href: "#equipo" },
      { label: "Contacto", href: "#contacto" },
    ],
  },
  theme: {
    toLight: "Cambiar a tema claro",
    toDark: "Cambiar a tema oscuro",
  },
  motion: {
    toggle: "Animaciones",
    on: "activadas",
    off: "pausadas",
    notice: "Tu sistema pide reducir el movimiento, por eso las animaciones están en pausa.",
    noticeCta: "Activar animaciones",
    noticeDismiss: "Entendido",
  },
  commandPalette: {
    label: "Paleta de comandos",
    search: "Buscar secciones, proyectos, acciones…",
    sections: "Secciones",
    projects: "Proyectos",
    actions: "Acciones",
    team: "Equipo",
    noMatches: "Sin resultados",
    hint: "Ctrl K",
    toggleTheme: "Cambiar tema",
    toggleLanguage: "Cambiar idioma",
    toggleMotion: "Cambiar animaciones",
    copyEmail: "Copiar correo",
    openWhatsApp: "Abrir WhatsApp",
    emailCopied: "Correo copiado",
    openProfile: "{name} en {network}",
  },
  lang: {
    groupLabel: "Idioma",
  },
  marqueeLabel:
    "Disciplinas de la organización: software, arquitectura, redes, electrónica y formación",
  disciplines: ["Software", "Arquitectura", "Redes", "Electrónica", "Formación"],
  hero: {
    eyebrow: "Ingeniería · Software · Redes · Electrónica",
    titleBefore: "Transformamos ideas en\u00a0",
    titleKeyword: "soluciones tecnológicas",
    lead: "Desarrollamos, experimentamos y compartimos tecnología desde la práctica.",
    ctaPrimary: "Ver proyectos",
    ctaSecondary: "Conocer la organización",
    scrollHint: "Bajar a la siguiente sección",
    scrollHintShort: "Bajar",
    orbitalLabel:
      "Emblema oficial de Ingenio Digital DSJB rodeado de ocho nodos: ingeniería de sistemas, desarrollo de software, redes, conectividad, electrónica, datos, innovación educativa y laboratorio digital.",
    nodes: [
      "Ingeniería de sistemas",
      "Desarrollo de software",
      "Redes e infraestructura",
      "Conectividad",
      "Electrónica e innovación",
      "Datos y sistemas",
      "Innovación educativa",
      "Laboratorio digital",
    ],
  },
  sections: {
    specs: {
      kicker: "Capacidades",
      title: "Áreas de especialización",
      lead: "Cinco disciplinas que se conectan en cada proyecto: del código a los circuitos, y de la infraestructura a la formación.",
      mediaAlt:
        "Patch panel con cables de red conectados en un rack de infraestructura",
      mediaTag: "Electrónica e innovación",
      areas: [
        {
          id: "software",
          title: "Ingeniería de software",
          description:
            "Desarrollo de aplicaciones y sistemas con bases sólidas: lógica, algoritmos y buenas prácticas.",
        },
        {
          id: "arquitectura",
          title: "Arquitectura tecnológica",
          description:
            "Diseño de soluciones y estructuras de software pensadas para durar y escalar.",
        },
        {
          id: "redes",
          title: "Redes e infraestructura",
          description:
            "Diseño, direccionamiento y configuración de redes con enfoque en estabilidad y seguridad.",
        },
        {
          id: "electronica",
          title: "Electrónica e innovación",
          description:
            "Circuitos, sistemas embebidos y prototipado para resolver problemas concretos.",
        },
        {
          id: "formacion",
          title: "Formación tecnológica",
          description:
            "Divulgación y acompañamiento técnico para que el conocimiento circule.",
        },
      ],
    },
    projects: {
      kicker: "Portafolio",
      title: "Proyectos destacados",
      live: "Desplegado",
      view: "Ver proyecto",
      imageAlt: "Vista previa de {name}",
      items: {
        "asistencias-utch": {
          name: "Registro de Asistencia UTCH",
          description:
            "Registro de asistencia a clases, con acceso para estudiantes, docentes y representantes.",
        },
        "suenos-de-papiro": {
          name: "Sueños de Papiro · Dedicación Eterna",
          description:
            "Tienda web de productos personalizados (agendas, regalos y velas), con catálogo y pedidos por WhatsApp.",
        },
        "panaderia-la-reina": {
          name: "Panadería La Reina · POS",
          description:
            "Sistema de facturación y punto de venta para una panadería de Quibdó.",
        },
        "binova-ia": {
          name: "BINOVA IA",
          description:
            "Contenedores inteligentes con IA para clasificar residuos, con app, trazabilidad y monitoreo.",
        },
      },
      stateGuideKicker: "Cómo publicamos",
      stateGuideTitle: "Tres estados honestos",
      stateDev: "En desarrollo",
      stateDevText: "En construcción. Sin fechas, cifras ni clientes inventados hasta documentarlo de verdad.",
      stateDesign: "En diseño",
      stateDesignText: "Diseñado y validado, aún sin construir. Se publica cuando exista algo verificable.",
      statePublished: "Publicado",
      statePublishedText: "Caso completo y verificable: contexto, decisiones, resultado y enlaces.",
      leadEmpty:
        "Cada proyecto se publicará con su descripción, imágenes y estado verificables. Aquí va la estructura del portafolio.",
      leadFilled:
        "Casos reales de nuestra práctica, con el estado de cada uno declarado de forma explícita.",
      reserved: "Espacio reservado",
      undocumentedTitle: "Proyecto por documentar",
      undocumentedText:
        "Espacio reservado para publicar este caso con su descripción, imágenes y estado verificables.",
      pendingLink: "Enlace pendiente",
      demoBadge: "DEMO (solo desarrollo)",
      demoTitle: "Proyecto de muestra",
      demoText: "Tarjeta de demostración de la transición al abrir enlaces externos. Disponible solo en desarrollo con NEXT_PUBLIC_DEMO_PROJECT=1.",
      viewProject: "Ver proyecto",
      viewRepository: "Repositorio",
      note: "No publicamos proyectos que no podamos documentar. Cuando haya casos reales, aparecerán aquí con su estado: experimental, en desarrollo o completado.",
      slotAreas: [
        "Ingeniería de software",
        "Redes e infraestructura",
        "Electrónica e innovación",
      ],
    },
    status: {
      experimental: "Experimental",
      "en-desarrollo": "En desarrollo",
      completado: "Completado",
    },
    valueProp: {
      kicker: "Propuesta de valor",
      title: "Compartimos el proceso real de desarrollo",
      lead: "Publicamos el camino completo: las ideas, los tropiezos, las soluciones y el conocimiento adquirido. No solo la versión final pulida.",
      pillars: [
        {
          title: "El proceso, no solo el resultado",
          text: "Mostramos cómo se construye: decisiones técnicas, alternativas evaluadas y el contexto de cada elección.",
        },
        {
          title: "Errores y soluciones",
          text: "Lo que falló y cómo se resolvió también se documenta. De ahí sale la parte más útil del aprendizaje.",
        },
        {
          title: "Conocimiento que circula",
          text: "Lo aprendido se convierte en publicaciones y formación para quienes vienen detrás.",
        },
      ],
    },
    lab: {
      kicker: "Divulgación",
      title: "Laboratorio digital",
      leadEmpty:
        "Aquí vivirá el contenido educativo: artículos técnicos, notas de proceso y experimentos documentados.",
      leadFilled:
        "Artículos, notas de proceso y experimentos publicados desde la práctica.",
      mediaAlt: "Gafas sobre un escritorio reflejando pantallas con código",
      pillars: [
        {
          title: "Artículos y guías",
          description:
            "Explicaciones técnicas sobre ingeniería, software, redes y electrónica, escritas desde la práctica.",
        },
        {
          title: "Notas de proceso",
          description:
            "El desarrollo real contado paso a paso: decisiones, errores encontrados y cómo se resolvieron.",
        },
        {
          title: "Experimentos y prototipos",
          description:
            "Pruebas del laboratorio digital, identificadas claramente como experimentales o en desarrollo.",
        },
      ],
      pending:
        "Publicaciones en preparación. Cada artículo se publicará con su fecha, autoría y enlace verificables.",
    },
    team: {
      kicker: "Profesionales",
      title: "Equipo y colaboradores",
      leadEmpty:
        "Un espacio para los profesionales y colaboradores reales de Ingenio Digital DSJB. Los perfiles se publicarán cuando estén confirmados.",
      leadFilled:
        "Las personas detrás de Ingenio Digital DSJB, con su área y rol verificables.",
      nameFallback: "Por confirmar",
      roleFallback: "Rol por confirmar",
      areaFallback: "Área en preparación",
      slotLabel: "Espacio",
      note: "No publicamos perfiles sin confirmación. Cuando el equipo esté listo, cada tarjeta incluirá retrato, nombre, rol y área reales.",
    },
    finalCta: {
      eyebrow: "Contacto",
      title: "Hablemos de tu próximo proyecto",
      lead: "Empresas, profesionales y personas interesadas en tecnología: cuéntanos qué necesitas y encontramos la forma de trabajarlo juntos.",
      pending:
        "Canal de contacto en configuración. Los datos oficiales se publicarán aquí cuando estén confirmados.",
      emailCta: "Escribir a Ingenio Digital DSJB",
      projectsCta: "Ver proyectos",
      microcopy: "Se abrirá tu app; no guardamos nada.",
      nameLabel: "Nombre (opcional)",
      messageLabel: "Mensaje",
      messagePlaceholder: "Cuéntanos qué necesitas…",
      sendWhatsApp: "Enviar por WhatsApp",
      sendEmail: "Enviar por correo",
      copyEmail: "Copiar correo",
      copied: "Copiado al portapapeles",
      subject: "Contacto desde la web",
      channelsTitle: "Canales",
      channelWhatsapp: "WhatsApp",
      channelEmail: "Correo",
      channelSocial: "Redes",
      whatsappPending: "WhatsApp en configuración.",
      emailPending: "Correo en configuración.",
      socialPending: "Redes en configuración.",
    },
  },
  notFound: {
    title: "Esta página no está conectada",
    lead: "Puede que el enlace haya cambiado o ya no exista.",
    backHome: "Volver al inicio",
    viewProjects: "Ver proyectos",
    suggestionHome: "Inicio",
    suggestionProjects: "Ver proyectos",
    suggestionLab: "Laboratorio digital",
  },
  loading: {
    label: "Cargando Ingenio Digital DSJB",
    welcome: "Bienvenido a Ingenio Digital",
    welcomeEn: "Welcome to Ingenio Digital",
    skip: "Saltar",
    opening: "Abriendo proyecto…",
    openingProject: "Abriendo {name}…",
  },
  footer: {
    sections: "Secciones",
    contact: "Contacto",
    social: "Redes",
    tagline: "Ingeniería, software, redes y electrónica.",
    professionals: "Profesionales",
    findUs: "Encuéntranos",
    professionalsPending: "Perfiles en confirmación.",
    seeTeam: "Ver equipo",
    channelsPending: "Canales oficiales en configuración.",
    rights: "Todos los derechos reservados.",
    logoAlt: "",
  },
};
