# AGENTS.md — Ingenio Digital DSJB

## Identidad del proyecto

Ingenio Digital DSJB es una marca tecnológica multidisciplinaria enfocada en ingeniería de sistemas, desarrollo de software, arquitectura tecnológica, redes, electrónica e innovación educativa.

El objetivo es construir una plataforma corporativa profesional que presente la identidad de la organización, sus servicios, proyectos, profesionales, publicaciones y canales digitales.

## Stack tecnológico

- Next.js con App Router.
- React.
- JavaScript exclusivamente.
- CSS Modules.
- GSAP para animaciones justificadas.
- Lucide React para iconografía.
- Next.js Image para imágenes.
- npm como gestor de paquetes.

## Principios obligatorios

1. Priorizar rendimiento, accesibilidad, SEO y responsive design.
2. Diseñar primero para móviles y escalar a tabletas y escritorio.
3. Utilizar Server Components por defecto.
4. Utilizar Client Components únicamente cuando exista una necesidad interactiva.
5. Evitar dependencias innecesarias.
6. Optimizar imágenes, fuentes y videos.
7. Evitar reproducción automática de videos pesados.
8. Mantener componentes pequeños, reutilizables y organizados.
9. No duplicar código ni crear archivos innecesarios.
10. Mantener JavaScript y no introducir TypeScript.
11. Utilizar variables CSS para los tokens visuales.
12. Respetar la identidad y los recursos oficiales de la marca.

## Dirección visual

La plataforma debe transmitir una organización tecnológica profesional, moderna y confiable.

Dirección visual:
- Negro obsidiana y grafito como base.
- Blanco y superficies claras para contraste editorial.
- Cian tecnológico como acento controlado.
- Tipografía moderna, legible y consistente.
- Composición editorial y Bento Grid cuando tenga sentido.
- Fotografía tecnológica de calidad.
- Interfaces limpias, precisas y profesionales.

Evitar:
- Diseños genéricos de plantillas.
- Exceso de gradientes y neón.
- Animaciones exageradas.
- Emojis como iconografía.
- Tarjetas repetitivas sin propósito.
- Textos inventados sobre resultados o experiencia.
- Elementos decorativos que afecten el rendimiento.

## Arquitectura del sitio

- Inicio.
- Nosotros.
- Servicios.
- Proyectos.
- Laboratorio digital.
- Profesionales.
- Contacto.

## Reglas de contenido

- No inventar integrantes, clientes, certificaciones, estadísticas ni proyectos terminados.
- Identificar claramente los proyectos experimentales y los que están en desarrollo.
- Utilizar información verificable.
- Mantener textos profesionales en español.
- Preparar la estructura para internacionalización futura, sin implementarla innecesariamente ahora.

## Reglas de trabajo

- Antes de modificar archivos, inspeccionar su contenido.
- No reemplazar configuraciones funcionales sin justificación.
- No instalar paquetes sin explicar su necesidad.
- No eliminar funcionalidades existentes sin autorización.
- No modificar archivos fuera del alcance solicitado.
- Ejecutar las comprobaciones correspondientes después de cada fase.
- Informar archivos creados, modificados y resultados de las pruebas.

## Calidad

La plataforma debe ofrecer:
- Diseño responsive real.
- Accesibilidad mediante teclado.
- Contraste adecuado.
- SEO técnico.
- Metadatos por página.
- Imágenes optimizadas.
- Carga diferida de recursos no esenciales.
- Ausencia de errores de consola.
- Buena experiencia en dispositivos de recursos limitados.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
