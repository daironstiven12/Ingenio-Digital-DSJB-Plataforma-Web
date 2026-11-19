// EN dictionary — every visible string in English. Same claims, no invented facts.

export const en = {
  team: {
    roleCreator: "Creator of Ingenio Digital",
    linkedinAria: "{name} on LinkedIn",
    githubAria: "{name} on GitHub",
    siteAria: "{name}'s website",
    photoAlt: "Portrait of {name}",
    emailAria: "Email {name}",
  },
  brandDesc:
    "Multidisciplinary technology organization: systems engineering, software development, technology architecture, networks, electronics and educational innovation.",
  skipLink: "Skip to content",
  nav: {
    mainLabel: "Main navigation",
    mobileLabel: "Mobile navigation",
    footerLabel: "Footer navigation",
    homeLabel: "Ingenio Digital DSJB — home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    cta: "Contact",
    labShort: "Lab",
    teamShort: "Team",
    search: "Search",
    items: [
      { label: "Home", href: "#inicio" },
      { label: "About", href: "#propuesta" },
      { label: "Services", href: "#especializaciones" },
      { label: "Projects", href: "#proyectos" },
      { label: "Digital Lab", href: "#laboratorio" },
      { label: "Professionals", href: "#equipo" },
      { label: "Contact", href: "#contacto" },
    ],
  },
  theme: {
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
  },
  motion: {
    toggle: "Animations",
    on: "on",
    off: "paused",
    notice: "Your system prefers reduced motion, so animations are paused.",
    noticeCta: "Enable animations",
    noticeDismiss: "Got it",
  },
  commandPalette: {
    label: "Command palette",
    search: "Search sections, projects, actions…",
    sections: "Sections",
    projects: "Projects",
    actions: "Actions",
    team: "Team",
    noMatches: "No results",
    hint: "Ctrl K",
    toggleTheme: "Toggle theme",
    toggleLanguage: "Switch language",
    toggleMotion: "Toggle animations",
    copyEmail: "Copy email",
    openWhatsApp: "Open WhatsApp",
    emailCopied: "Email copied",
    openProfile: "{name} on {network}",
  },
  lang: {
    groupLabel: "Language",
  },
  marqueeLabel:
    "Organization disciplines: software, architecture, networks, electronics and training",
  disciplines: ["Software", "Architecture", "Networks", "Electronics", "Training"],
  hero: {
    eyebrow: "Engineering · Software · Networks · Electronics",
    titleBefore: "We turn ideas into\u00a0",
    titleKeyword: "technology solutions",
    lead: "We build, experiment with and share technology from practice.",
    ctaPrimary: "View projects",
    ctaSecondary: "About the organization",
    scrollHint: "Scroll down to the next section",
    scrollHintShort: "Scroll",
    orbitalLabel:
      "Official Ingenio Digital DSJB emblem surrounded by eight nodes: systems engineering, software development, networks, connectivity, electronics, data, educational innovation and the digital lab.",
    nodes: [
      "Systems engineering",
      "Software development",
      "Networks & infrastructure",
      "Connectivity",
      "Electronics & innovation",
      "Data & systems",
      "Educational innovation",
      "Digital Lab",
    ],
  },
  contactFlow: {
    cta: {
      eyebrow: "Contact",
      title: "Tell us what you need",
      lead: "Answer a few quick questions and leave your details so we can help.",
      start: "Start",
    },
    back: "Back",
    stepOf: "Step {n} of {total}",
    stepAnnounce: "Step {n} of {total}",
    direct: {
      toggle: "I prefer to write directly",
    },
    needs: {
      web: "Website or platform",
      automatizar: "Automate processes",
      redes: "Networks & infrastructure",
      electronica: "Electronics & IoT",
      formacion: "Learning & training",
      otra: "Something else",
    },
    details: {
      web: {
        negocio: "Showcase my business or portfolio",
        venta: "Sell online",
        sistema: "Internal system (inventory, invoicing)",
        otra: "Other / not sure yet",
      },
      automatizar: {
        facturacion: "Invoicing & sales",
        registros: "Records & attendance",
        reportes: "Reports & data",
        otra: "Other / not sure yet",
      },
      redes: {
        disenar: "Design or configure a network",
        estabilidad: "Improve stability or security",
        local: "Infrastructure for a shop or office",
        otra: "Other / not sure yet",
      },
      electronica: {
        prototipo: "Prototype or IoT project",
        sensores: "Sensors & automation",
        embebidos: "Embedded systems",
        otra: "Other / not sure yet",
      },
      formacion: {
        programacion: "Learn programming",
        redes: "Networking or electronics",
        taller: "Workshop for a group",
        otra: "Other / not sure yet",
      },
    },
    audiences: {
      yo: "For me",
      negocio: "My business or company",
      institucion: "An institution or educational center",
      otro: "Other",
    },
    timings: {
      pronto: "As soon as possible",
      uno3meses: "In 1 to 3 months",
      explorando: "Just exploring",
    },
    steps: {
      need: { title: "What are you looking for?" },
      detail: { title: "What exactly do you need?" },
      audience: { title: "Who is it for?" },
      timing: { title: "When?" },
      contact: { title: "Where should we contact you?" },
    },
    fields: {
      name: "Name",
      email: "Email (optional)",
      phone: "WhatsApp with country code",
      preferred: "Preferred channel",
      preferEmail: "Email",
      message: "Message (optional)",
      messagePlaceholder: "Tell us in your own words…",
    },
    consent: {
      before: "I accept the ",
      link: "privacy notice",
      after: " and the sending of my data by email and WhatsApp to the team.",
    },
    submit: "Send inquiry",
    summary: {
      need: "Looking for",
      detail: "Detail",
      audience: "For whom",
      timing: "When",
      name: "Name",
      email: "Email",
      phone: "WhatsApp",
      preferred: "Preferred channel",
      message: "Message",
    },
    success: {
      title: "Inquiry sent!",
      sentLead: "We received it by email/WhatsApp. Thanks for reaching out.",
      dryRunLead: "Your inquiry is ready. Once the delivery channels are active, the team will receive it.",
      announce: "Inquiry sent successfully",
      copy: "Copy summary",
      copied: "Summary copied",
      again: "Send another inquiry",
      whatsapp: "Also message us on WhatsApp",
    },
    error: {
      title: "We couldn't send right now",
      lead: "Your answers are still here. Retry or message us directly.",
      retry: "Retry",
      directHint: "You can also message us directly:",
      announce: "Couldn't send the inquiry; you can retry",
    },
    errors: {
      name: "Your name must be 2–80 characters.",
      email: "That email doesn't look valid.",
      phone: "Phone must be 7–15 digits including the country code.",
      contact: "Provide at least an email or a phone number.",
      message: "Message can't be longer than 500 characters.",
      consent: "You must accept the privacy notice.",
      summary: "Please review the highlighted fields before sending.",
    },
  },
  privacy: {
    title: "Privacy notice",
    updated: "Last updated: November 2026",
    intro:
      "This notice describes, provisionally and without legal force, what data we ask for when you use this site's contact form.",
    s1title: "What we ask for",
    s1body:
      "Name, one email or phone (at least one), your form answers (need, detail, who it's for, when) and, if you write it, your message.",
    s2title: "What for",
    s2body:
      "To answer your inquiry. The team uses your data only to reach you through the channels you accept.",
    s3title: "Where it travels",
    s3body:
      "It is sent by email (Resend) and/or WhatsApp to the team. The site does not store your data in its own database nor uses tracking pixels.",
    s4title: "Retention",
    s4body:
      "There is no database: your data lives in the email and WhatsApp used to answer you. Retention is managed internally by the team.",
    s5title: "Third-party services",
    s5body:
      "Email is sent via Resend (which processes data under its own policy). The WhatsApp button opens wa.me with your message in your own client.",
    s6title: "Your rights",
    s6body:
      "You can ask us to delete your data by writing to the site's channels.",
    todo: "TODO(owner): have a data-protection officer or legal advisor review this text before promoting it. It is a provisional draft and is not legal advice.",
    backHome: "Back to home",
  },
  sections: {
    specs: {
      kicker: "Capabilities",
      title: "Areas of expertise",
      lead: "Five disciplines connected in every project: from code to circuits, and from infrastructure to training.",
      mediaAlt:
        "Patch panel with network cables plugged into an infrastructure rack",
      mediaTag: "Electronics & innovation",
      areas: [
        {
          id: "software",
          title: "Software engineering",
          description:
            "Application and system development with solid foundations: logic, algorithms and best practices.",
        },
        {
          id: "arquitectura",
          title: "Technology architecture",
          description:
            "Solution and software structure design built to last and scale.",
        },
        {
          id: "redes",
          title: "Networks & infrastructure",
          description:
            "Network design, addressing and configuration focused on stability and security.",
        },
        {
          id: "electronica",
          title: "Electronics & innovation",
          description:
            "Circuits, embedded systems and prototyping to solve concrete problems.",
        },
        {
          id: "formacion",
          title: "Technology training",
          description:
            "Technical outreach and mentoring so knowledge keeps circulating.",
        },
      ],
    },
    projects: {
      kicker: "Portfolio",
      title: "Featured projects",
      live: "Live",
      view: "View project",
      imageAlt: "Preview of {name}",
      items: {
        "asistencias-utch": {
          name: "Registro de Asistencia UTCH",
          description:
            "Class attendance tracking with access for students, teachers and guardians.",
        },
        "suenos-de-papiro": {
          name: "Sueños de Papiro · Dedicación Eterna",
          description:
            "Custom products web store (planners, gifts and candles), with a catalog and orders via WhatsApp.",
        },
        "panaderia-la-reina": {
          name: "Panadería La Reina · POS",
          description:
            "Billing system and point of sale for a bakery in Quibdó.",
        },
        "binova-ia": {
          name: "BINOVA IA",
          description:
            "AI-powered smart containers for waste sorting, with app, traceability and monitoring.",
        },
      },
      stateGuideKicker: "How we publish",
      stateGuideTitle: "Three honest states",
      stateDev: "In development",
      stateDevText: "In build. No invented dates, figures or client names until it is properly documented.",
      stateDesign: "In design",
      stateDesignText: "Designed and validated, not built yet. Published only when there is something verifiable.",
      statePublished: "Published",
      statePublishedText: "Complete, verifiable case: context, decisions, outcome and links.",
      leadEmpty:
        "Every project will be published with verifiable description, images and status. This is the portfolio structure.",
      leadFilled:
        "Real cases from our practice, each with its status declared explicitly.",
      reserved: "Reserved slot",
      undocumentedTitle: "Project to be documented",
      undocumentedText:
        "Reserved space to publish this case with verifiable description, images and status.",
      pendingLink: "Link pending",
      demoBadge: "DEMO (development only)",
      demoTitle: "Sample project",
      demoText: "Demonstration card for the transition when opening external links. Only available in development with NEXT_PUBLIC_DEMO_PROJECT=1.",
      viewProject: "View project",
      viewRepository: "Repository",
      note: "We don't publish projects we cannot document. Real cases will appear here with their status: experimental, in development or completed.",
      slotAreas: [
        "Software engineering",
        "Networks & infrastructure",
        "Electronics & innovation",
      ],
    },
    status: {
      experimental: "Experimental",
      "en-desarrollo": "In development",
      completado: "Completed",
    },
    valueProp: {
      kicker: "Value proposition",
      title: "We share the real development process",
      lead: "We publish the full path: the ideas, the missteps, the solutions and the knowledge gained. Not just the polished final version.",
      pillars: [
        {
          title: "The process, not just the result",
          text: "We show how things are built: technical decisions, evaluated alternatives and the context behind each choice.",
        },
        {
          title: "Mistakes and solutions",
          text: "What failed and how it was fixed is also documented. That's where the most useful learning happens.",
        },
        {
          title: "Knowledge that circulates",
          text: "What we learn becomes publications and training for those who come next.",
        },
      ],
    },
    lab: {
      kicker: "Outreach",
      title: "Digital Lab",
      leadEmpty:
        "This is where the educational content will live: technical articles, process notes and documented experiments.",
      leadFilled:
        "Articles, process notes and experiments published from practice.",
      mediaAlt: "Glasses on a desk reflecting screens with code",
      pillars: [
        {
          title: "Articles & guides",
          description:
            "Technical explanations about engineering, software, networks and electronics, written from practice.",
        },
        {
          title: "Process notes",
          description:
            "Real development told step by step: decisions, mistakes found and how they were solved.",
        },
        {
          title: "Experiments & prototypes",
          description:
            "Digital Lab tests, clearly labeled as experimental or in development.",
        },
      ],
      pending:
        "Publications in preparation. Each article will be published with verifiable date, authorship and link.",
    },
    team: {
      kicker: "Professionals",
      title: "Team & collaborators",
      leadEmpty:
        "A space for the real professionals and collaborators of Ingenio Digital DSJB. Profiles will be published once confirmed.",
      leadFilled:
        "The people behind Ingenio Digital DSJB, with their verifiable area and role.",
      nameFallback: "To be confirmed",
      roleFallback: "Role to be confirmed",
      areaFallback: "Area in preparation",
      slotLabel: "Slot",
      note: "We don't publish unconfirmed profiles. Once the team is ready, each card will include portrait, name, role and area.",
    },
    finalCta: {
      eyebrow: "Contact",
      title: "Let's talk about your next project",
      lead: "Companies, professionals and people interested in technology: tell us what you need and we'll find a way to build it together.",
      pending:
        "Contact channel being configured. Official details will be published here once confirmed.",
      emailCta: "Email Ingenio Digital DSJB",
      projectsCta: "View projects",
      microcopy: "Your app will open; we store nothing.",
      nameLabel: "Name (optional)",
      messageLabel: "Message",
      messagePlaceholder: "Tell us what you need…",
      sendWhatsApp: "Send via WhatsApp",
      sendEmail: "Send via email",
      copyEmail: "Copy email",
      copied: "Copied to clipboard",
      subject: "Contact from the website",
      channelsTitle: "Channels",
      channelWhatsapp: "WhatsApp",
      channelEmail: "Email",
      channelSocial: "Social",
      whatsappPending: "WhatsApp being configured.",
      emailPending: "Email being configured.",
      socialPending: "Social being configured.",
    },
  },
  notFound: {
    title: "This page isn't connected",
    lead: "The link may have changed or no longer exists.",
    backHome: "Back to home",
    viewProjects: "View projects",
    suggestionHome: "Home",
    suggestionProjects: "View projects",
    suggestionLab: "Digital Lab",
  },
  loading: {
    label: "Loading Ingenio Digital DSJB",
    welcome: "Welcome to Ingenio Digital",
    welcomeEn: "Welcome to Ingenio Digital",
    skip: "Skip",
    opening: "Opening project…",
    openingProject: "Opening {name}…",
  },
  footer: {
    sections: "Sections",
    privacy: "Privacy",
    contact: "Contact",
    social: "Social",
    tagline: "Engineering, software, networks and electronics.",
    professionals: "Professionals",
    findUs: "Find us",
    professionalsPending: "Profiles being confirmed.",
    seeTeam: "See team",
    channelsPending: "Official channels being configured.",
    rights: "All rights reserved.",
    logoAlt: "",
  },
};
