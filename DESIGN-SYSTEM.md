# DESIGN-SYSTEM.md — Ingenio Digital DSJB

Documento de dirección de diseño aprobado como fuente única de verdad para la fase de construcción visual.
Estado: **Propuesta para aprobación** · Fase: pre-desarrollo · Alcance: tokens, componentes base y estructura de la página principal.

---

## 1. Referencias estudiadas y sus características

### 1.1 Metodología

Se investigaron referencias públicas reales de sitios corporativos tecnológicos, estudios de ingeniería y empresas de software mediante fuentes verificables (Awwwards, CSS Design Awards, análisis públicos de design systems y los propios sitios de las marcas). **No se tuvo acceso a Refero ni a herramientas MCP de investigación de interfaces** en este entorno; se sustituyó por investigación web directa. No se copia una sola referencia: se sintetizan patrones de al menos nueve fuentes.

### 1.2 Fuentes principales

| Referencia | Tipo | Características extraídas |
|---|---|---|
| **Linear** (linear.app) | SaaS / herramientas | Oscuro editorial minimalista; titulares con tracking apretado; un solo acento cian/violeta; hover100–150 ms; motion que "recompensa la atención" sin gritar. |
| **Vercel + Geist** (vercel.com) | Infraestructura / dev tools | Precisión blanco/negro; bordes hairline (1 px); textura de grid tipo blueprint a baja opacidad; tokens con nombres tipo `obsidian #171717`; mono para etiquetas técnicas. |
| **Railway** (railway.app) | Infraestructura | Casi negro sobre blanco cálido; paneles monoespaciados tipo CLI; disciplina de un solo acento en toda la interfaz; visualización técnica como imagen de héroe. |
| **Arup** (arup.com) | Ingeniería multidisciplinaria | IA profunda servicios × sectores; casos de estudio con datos concretos; landing pages por disciplina; secciones claras de lectura editorial; credibilidad institucional. |
| **iCOMAT** (icomat.co.uk) | Ingeniería avanzada B2B | Héroe con declaración contundente; secciones numeradas (01/04); lista de industrias; profundidad técnica con acabado premium. |
| **Bento: Apple, Dovetail, Literal** | Productos / datos / portafolio | Celdas modulares asimétricas que se reflowan (nunca scroll horizontal); tipografía contundente sobre paleta apagada; mezcla de celdas de media y de texto. |
| **Portafolios de equipo: Snyk, Pitch, Major Tom** | SaaS / agencias | Retratos con proporción constante; pie minimalista (foto → nombre → rol); fotografía real por encima de stock genérico. |
| **By-Kin, Uncommon Studio** (Awwwards 2026) | Estudios digitales | Tipografía editorial + GSAP contenido; transiciones que se sienten continuas; disciplina de rendimiento en páginas muy dirigidas artísticamente. |
| **Benchmarks de firmas de ingeniería** (listas Windmill/Whitelam) | Ingeniería B2B | Casos con especificidad verificable; posicionamiento claro; pensamiento de liderazgo como contenido; profesionales visibles. |
| **Baymard, NN/g, web.dev** | UX research | Barra horizontal con 1–2 niveles (el menú hamburguesa perjudica el descubrimiento en escritorio); 96% de sitios no resalta la sección actual; `prefers-reduced-motion` obligatorio; contraste por luminancia. |

### 1.3 Lecciones transversales

1. **El oscuro funciona cuando es intencional** (contraste para imágenes técnicas, contexto de trabajo del público técnico), no por moda. Peor uso: oscuro "porque se ve moderno".
2. **Bento Grid es estructura, no decoración**: sirve para capacidades, servicios y casos; no para texto largo.
3. **Un solo acento** por interfaz; el resto es neutro. La jerarquía se resuelve con contraste, tamaño y espacio.
4. **La especificidad vende en B2B**: casos nombrados, datos reales, estados honestos. Nada de cifras inventadas.
5. **El movimiento es refuerzo**:120–160 ms en microinteracciones; 500–700 ms en reveals; nunca bloquear la lectura.

---

## 2. Dirección visual seleccionada

### 2.1 Concepto: "Ingeniería editorial en negativo"

Combinación aprobada en el encargo:

- **Dark editorial tecnológico** como base de marca (héroe, proyectos, cierre).
- **Superficies claras editoriales** (blanco, gris muy claro) donde el contenido es de lectura (servicios, profesionales, laboratorio). No toda la interfaz es negra: el contraste entre bloques oscuros y claros organiza el ritmo de la página.
- **Bento Grid** para capacidades y servicios; composición asimétrica, no tarjetas repetitivas.
- **Corporativo minimalista**: bordes hairline, sombras mínimas, sin gradientes decorativos, sin neón.
- **Tipografía contundente** en display, neutra y legible en cuerpo.
- **Cian tecnológico como acento controlado** (≤ ~5% del área visual: CTA principal, enlaces, foco, etiquetas, detalles de datos).
- **Fotografía realista y visualización de proyectos**: imagen técnica de calidad, capturas o visualizaciones reales; nunca stock genérico de "personas con laptop".

### 2.2 Principios de diseño

1. **Contraste antes que color**: jerarquía con escala tipográfica, peso y espacio.
2. **Mobile-first real**: la composición Bento se diseña primero apilada y luego se expande.
3. **Accesibilidad como restricción de diseño**: AA (4.5:1 texto normal, 3:1 texto grande/gráficos), foco visible, navegación por teclado completa.
4. **Rendimiento como estética**: sin elementos decorativos pesados; animación solo donde aporta.
5. **Contenido verificable**: los estados de proyecto (experimental / en desarrollo / completado) se muestran explícitamente; cero cifras o clientes inventados.
6. **Preparado para i18n**: textos de interfaz centralizados en `data/`, sin cadenas incrustadas en componentes (implementación futura, sin forzarla ahora).

### 2.3 Ritmo de superficies (regla de composición)

Alternar bloques oscuros y claros cada1–2 secciones:

`Oscuro (héroe + bento) → Claro (servicios) → Oscuro (proyectos) → Claro (laboratorio) → Claro/blanco (profesionales) → Oscuro (CTA + footer)`

El texto largo siempre sobre superficie clara; la imagen técnica y la marca siempre sobre oscuro.

---

## 3. Paleta de colores

### 3.1 Tokens (variables CSS en `globals.css`)

**Base oscura (obsidiana / grafito)**

| Token | Hex | Uso |
|---|---|---|
| `--color-obsidian-950` | `#08090A` | Fondo principal oscuro, footer |
| `--color-graphite-900` | `#101216` | Superficie elevada oscura (bento, paneles) |
| `--color-graphite-800` | `#16191F` | Tarjeta oscura, hover de superficie oscura |
| `--color-graphite-700` | `#1E222A` | Borde fuerte oscuro, divisores |
| `--color-graphite-600` | `#2B313C` | Controles, bordes de input en oscuro |

**Superficies claras (editorial)**

| Token | Hex | Uso |
|---|---|---|
| `--color-white` | `#FFFFFF` | Fondo editorial principal |
| `--color-paper-50` | `#F6F8FB` | Sección alterna clara |
| `--color-paper-100` | `#EDF1F7` | Tarjeta/clara elevada, hover en claro |
| `--color-ink-900` | `#0D1117` | Texto principal sobre claro |
| `--color-ink-700` | `#3D4654` | Texto secundario sobre claro (≈9.5:1) |
| `--color-ink-500` | `#5C6675` | Texto atenuado/meta sobre claro (≈5.8:1) |

**Texto sobre oscuro**

| Token | Hex | Uso |
|---|---|---|
| `--color-slate-300` | `#C4CBD7` | Texto secundario sobre oscuro |
| `--color-slate-400` | `#98A1B2` | Texto atenuado/meta sobre oscuro (≈7.6:1) |

**Acento cian (controlado)**

| Token | Hex | Uso |
|---|---|---|
| `--color-cyan-300` | `#7EE7F8` | Hover/activo del acento sobre oscuro |
| `--color-cyan-400` | `#22D3EE` | **Acento primario**: CTA, enlaces y foco sobre oscuro, detalles de datos |
| `--color-cyan-500` | `#06B6D4` | Rellenos de acento en contexto claro |
| `--color-cyan-600` | `#0891B2` | Bordes de acento, estados activos en claro |
| `--color-cyan-700` | `#0E7490` | **Texto/enlace cian sobre blanco** (≈5.4:1) |

**Semánticos (solo estados; uso puntual)**

| Token | Hex | Uso |
|---|---|---|
| `--color-success` | `#2FBF71` | Estado "completado" (con etiqueta de texto, nunca solo color) |
| `--color-warning` | `#E8A33D` | Estado "en desarrollo" |
| `--color-neutral-status` | `#98A1B2` | Estado "experimental" |

### 3.2 Reglas de uso

1. El cian **nunca** es fondo de sección ni color de párrafo largo.
2. Texto cian solo `cyan-700` sobre claro y `cyan-400` sobre oscuro (verificado AA).
3. El texto principal sobre obsidiana es blanco `#FFFFFF` o `slate-300`; no gris pálido de bajo contraste.
4. Sin degradados decorativos. Único degradado permitido: sombreado de imagen (overlay) para legibilidad de texto sobre foto.
5. Cian como texto sobre blanco **nunca** `cyan-400/500` (falla contraste).

---

## 4. Sistema tipográfico

### 4.1 Familias (auto-hospedadas con `next/font`, `display: swap`)

| Rol | Familia | Justificación |
|---|---|---|
| **Display / titulares** | **Space Grotesk** (400–700) | Geométrica con carácter técnico, contundente sin ser agresiva; distingue la marca de las sans corporativas genéricas. |
| **Cuerpo / UI** | **Inter** (400–600) | Legibilidad excepcional en tamaños pequeños, métricas consistentes, amplia cobertura de acentos latinos. |
| **Etiquetas / meta / datos** | **IBM Plex Mono** (400–500) | Referencia técnica/CLI (patrón Railway/Vercel): eyebrows, códigos, estados, cifras de proyecto. |

Alternativa pendiente de aprobación: sustituir Space Grotesk por **Archivo** si se prefiere un display más neutro/corporativo.

Reglas de carga: precarga solo del display; subset `latin` (+ `latin-ext` si se requiere); pesos explícitos (sin variantes innecesarias).

### 4.2 Escala tipográfica (fluida, `clamp`)

| Token | Tamaño | Peso | Interlínea | Tracking | Uso |
|---|---|---|---|---|---|
| `--fs-display-xl` | `clamp(2.5rem, 7vw, 4.75rem)` (40→76 px) | 700 | 1.02 | -0.02em | H1 héroe |
| `--fs-display-l` | `clamp(2rem, 4.5vw, 3.5rem)` (32→56 px) | 600 | 1.08 | -0.02em | Títulos de sección |
| `--fs-h2` | `clamp(1.375rem, 2.2vw, 1.75rem)` (22→28 px) | 600 | 1.2 | -0.01em | Subtítulos de bloque |
| `--fs-h3` | `1.25rem` (20 px) | 600 | 1.3 | 0 | Títulos de tarjeta |
| `--fs-body-lg` | `clamp(1.0625rem, 1.2vw, 1.125rem)` | 400 | 1.65 | 0 | Lead, párrafos de entrada |
| `--fs-body` | `1rem` (16 px) | 400 | 1.65 | 0 | Cuerpo |
| `--fs-small` | `0.875rem` (14 px) | 400 | 1.5 | 0 | Apoyos, pies de tarjeta |
| `--fs-mono` | `0.8125rem` (13 px) | 500 | 1.4 | +0.02em | Meta, datos, estados |
| `--fs-eyebrow` | `0.75rem` (12 px) | 500 | 1.4 | +0.14em (mayúsculas) | Eyebrows mono, etiquetas de sección |

### 4.3 Reglas editoriales

1. Medida de lectura: **60–72 caracteres** por línea (`max-width: 68ch` en párrafos).
2. Contraste de escala: el H1 del héroe debe ser ≥ 4× el cuerpo (firma tipográfica 2026: display enorme + caption discreto).
3. Titulares en sentence case (no mayúsculas completas), excepto eyebrows mono.
4. Nunca centrar párrafos largos; centrado solo en CTAs finales.
5. Numeración de secciones en mono (`01 — Capacidades`) como firma editorial.

---

## 5. Escala de espaciados

Base **4 px** (multiplos de 8 para ritmo mayor).

| Token | px | Uso típico |
|---|---|---|
| `--space-1` | 4 | separación intra-elemento |
| `--space-2` | 8 | icono–texto, gaps de badge |
| `--space-3` | 12 | padding de controles pequeños |
| `--space-4` | 16 | gaps de grid móvil, padding de tarjeta |
| `--space-5` | 24 | padding de tarjeta desktop, gaps de bloque |
| `--space-6` | 32 | separación entre bloques |
| `--space-7` | 48 | separación entre subsecciones (tablet) |
| `--space-8` | 64 | padding vertical de sección (móvil) |
| `--space-9` | 96 | padding vertical de sección (tablet) |
| `--space-10` | 128 | padding vertical de sección (desktop) |
| `--space-11` | 160 | respiración de héroe desktop |

**Contenedores**

- `--container-max: 1280px` (contenido estándar)
- `--container-wide: 1440px` (media a sangre controlada)
- `--container-pad: clamp(20px, 5vw, 48px)` (gutter lateral fluido)

**Grid**

- Móvil (<768 px): 4 columnas, gap 16 px
- Tablet (768–1023 px): 6 columnas, gap 24 px
- Desktop (≥1024 px): 12 columnas, gap 32 px

---

## 6. Radios, bordes y superficies

### 6.1 Radios

| Token | Valor | Uso |
|---|---|---|
| `--radius-xs` | 6 px | badges, chips |
| `--radius-sm` | 8 px | **botones, inputs** |
| `--radius-md` | 14 px | tarjetas estándar |
| `--radius-lg` | 20 px | celdas Bento, paneles, media |
| `--radius-full` | 9999 px | pills de estado, avatares |

Regla: radios contenidos (6–20 px). Prohibido el look "burbuja" (>24 px en tarjetas).

### 6.2 Bordes

- Hairline universal: **1 px**.
- Oscuro: `--border-dark: rgba(255, 255, 255, 0.10)`; fuerte `#1E222A`.
- Claro: `--border-light: #E4E7EC`.
- Separación por borde, no por sombra, en contexto oscuro.

### 6.3 Superficies y elevación

| Contexto | Superficie | Elevación |
|---|---|---|
| Oscuro | `obsidian-950` → `graphite-900` (panel) → `graphite-800` (hover) | cambio de superficie + borde hairline; **sin sombras** |
| Claro | `white` → `paper-50` (sección alterna) → `paper-100` (tarjeta/hover) | sombra mínima opcional: `--shadow-sm: 0 1px 2px rgba(13,17,23,.06)`; `--shadow-md: 0 8px 24px rgba(13,17,23,.08)` en elementos flotantes (dropdown, modal) |

Textura opcional: grid blueprint tipo Vercel a **≤ 8% de opacidad**, solo en bloques oscuros de marca, generada con CSS puro (sin imágenes).

---

## 7. Sistema de botones

### 7.1 Variantes

| Variante | Contexto oscuro | Contexto claro | Uso |
|---|---|---|---|
| **Primary** | Fondo `cyan-400`, texto `obsidian-950` | Fondo `cyan-400`, texto `obsidian-950` | Único CTA de conversión por vista (Contacto / Iniciar proyecto) |
| **Secondary (invertido)** | Fondo blanco, texto `obsidian-950` | Fondo `ink-900`, texto blanco | CTA principal alternativo |
| **Outline** | Transparente, borde `rgba(255,255,255,.18)`, texto blanco | Transparente, borde `#D0D5DD`, texto `ink-900` | Acciones terciarias |
| **Link con flecha** | Texto blanco + `ArrowRight` cian | Texto `ink-900` + `ArrowRight` cian | Navegación "Ver todos…" |

Iconografía: **solo Lucide React** (16/18/20 px), sin emojis.

### 7.2 Tamaños

| Tamaño | Alto | Padding X | Fuente |
|---|---|---|---|
| `sm` | 44 px | 16 px | 14 px |
| `md` | 48 px | 24 px | 15 px |
| `lg` | 56 px | 32 px | 16 px |

Alto mínimo 44 px (objetivo táctil WCAG 2.5.8). Radio `--radius-sm`. Peso 600.

### 7.3 Estados

- **Hover**: `translateY(-1px)` + cambio de tono; 150 ms `ease-out`.
- **Active**: `translateY(0)`, opacidad .92.
- **Focus-visible**: anillo2 px (`cyan-400` en oscuro / `cyan-700` en claro) con offset 2 px — nunca eliminar el foco.
- **Disabled**: opacidad .55, `cursor: not-allowed`, sin transiciones.
- **Loading**: spinner Lucide `Loader2` con `aria-busy`; mantener el ancho estable (sin layout shift).

---

## 8. Comportamiento responsive

### 8.1 Breakpoints (mobile-first)

| Alias | Ancho | Ajustes |
|---|---|---|
| `--bp-sm` | 480 px | gaps +8 px, tipografía fluida intermedia |
| `--bp-md` | 768 px | grid 6 col, nav pasa de menú a barra, Bento 2 col |
| `--bp-lg` | 1024 px | grid 12 col, nav horizontal completa, Bento asimétrico |
| `--bp-xl` | 1280 px | contenedor completo, escala display al máximo |

### 8.2 Comportamiento por componente

| Componente | Móvil | Tablet | Desktop |
|---|---|---|---|
| **Navegación** | Hamburguesa → panel a pantalla completa con targets ≥44 px, cierre con Escape, foco atrapado | Barra horizontal compacta | Barra completa: logo + 7 enlaces + CTA; sticky con blur al hacer scroll; sección actual resaltada (subrayado cian) |
| **Héroe** | Texto arriba, media abajo (aspect 4:3), CTAs apilados a ancho completo | Split 50/50 | Composición asimétrica 7/5; media con `next/image` + `sizes` |
| **Bento Grid** | 1 columna, orden por prioridad (nunca scroll horizontal) | 2 columnas | 12 col con spans asimétricos (p. ej. 8+4, 4+4+4, 6+6) |
| **Proyectos** | 1 tarjeta/col; imagen `aspect-ratio: 4/3` | 2 col | 3 col o lista editorial destacada |
| **Profesionales** | 1 col (retrato 4:5 + nombre/rol) | 2 col | 3–4 col |
| **Tablas/datos** | scroll horizontal contenedor con `tabindex` y label ARIA | parcial | completo |
| **Tipografía** | `clamp` crece sin saltos | idem | idem |
| **Media** | sin video autoplay pesado; poster + play bajo demanda | idem | video solo si <2 MB y lazy |

### 8.3 Reglas transversales

1. Ninguna información dependiente solo de `hover`: todo tiene estado focus/tap.
2. `sizes` y `aspect-ratio` en toda imagen para evitar CLS.
3. Menú móvil: `aria-expanded`, `aria-controls`, focus trap, scroll del body bloqueado.
4. Probar a 320 px sin desbordes horizontales.

---

## 9. Reglas de animación

### 9.1 Tokens de movimiento

| Token | Valor | Uso |
|---|---|---|
| `--duration-micro` | 140 ms | hover, foco, toggles |
| `--duration-fast` | 220 ms | menús, acordeones, tooltips |
| `--duration-reveal` | 600 ms | entradas al hacer scroll |
| `--duration-section` | 800 ms | máx. transiciones de sección |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | estándar (salidas) |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | desplazamientos, pinning |

### 9.2 División de responsabilidades

- **CSS/transiciones** para microinteracciones (hover, foco, tabs, accordion). GSAP no se usa para hover.
- **GSAP + ScrollTrigger** (justificado) solo para: reveals escalonados de secciones, secuencias del héroe, contadores de datos reales, composiciones Bento con orden, anclajes/pinning puntuales.
- GSAP se importa de forma **dinámica** (`import()`), solo en páginas que lo requieran.

### 9.3 Reglas duras

1. Animar **solo `transform` y `opacity`** (GPU-friendly); prohibido animar `width/height/top/left`.
2. Reveal una sola vez (`once: true`); stagger 60–100 ms, máximo 6 elementos por grupo.
3. **Estados iniciales ocultos solo si JS controla el fallback**: sin el clásico "contenido fantasma" si falla el script (clase `js` en `<html>` o estados puestos por GSAP).
4. **`prefers-reduced-motion: reduce` obligatorio**:
   - CSS: desactivar transiciones/animaciones globales.
   - GSAP: `gsap.matchMedia()` para omitir timelines (patrón documentado por GSAP y web.dev).
   - El contenido debe ser visible y navegable sin animación.
5. Sin parallax en móvil; sin loops continuos; sin autoplay de video pesado (poster + clic).
6. Presupuesto: ≤ 8 elementos animados simultáneamente por viewport; sin `will-change` permanente.
7. Nunca retrasar el LCP: el contenido del héroe es visible en carga (el reveal aplica a bloques posteriores).

---

## 10. Estructura de la página principal (propuesta, sin construir)

Superficie por sección según la regla de ritmo (§2.3). Contenido sujeto a datos reales: **no se inventan cifras, clientes, integrantes ni proyectos**.

| # | Sección | Superficie | Composición | Contenido |
|---|---|---|---|---|
| 0 | **Skip link + Header** | oscuro/transparente | barra sticky, logo izq., nav + CTA "Contacto" der. | 7 secciones: Inicio, Nosotros, Servicios, Proyectos, Laboratorio digital, Profesionales, Contacto |
| 1 | **Héroe** | Oscuro (`obsidian-950`) | eyebrow mono + H1 display-xl + lead + 2 CTAs + media (foto técnica/visualización) | Declaración de valor verificable de la marca; sin stats inventadas |
| 2 | **Capacidades (Bento)** | Oscuro (continúa, `graphite-900`) | grid asimétrico: 6 celdas de disciplina (icono Lucide + título + resumen) + 1–2 celdas de media | Ingeniería de sistemas, software, arquitectura, redes, electrónica, formación |
| 3 | **Servicios** | Claro (`white`) | intro editorial + grid/lista con iconos y enlaces a `/servicios` | Descripción honesta de oferta; formulario de contacto como salida |
| 4 | **Proyectos destacados** | Oscuro | tarjetas con imagen, título, disciplina, **badge de estado** (Experimental / En desarrollo / Completado) | Solo proyectos reales con estado explícito |
| 5 | **Laboratorio digital** | Claro (`paper-50`) | tarjetas editoriales: experimentos, publicaciones, prototipos | Etiqueta "experimental" visible; enlace a `/laboratorio-digital` |
| 6 | **Profesionales** | Blanco (`white`) | retratos 4:5, nombre + rol minimalista, sin biografías largas en home | Solo integrantes reales; estructura lista aunque el contenido llegue después |
| 7 | **CTA final** | Oscuro | declaración + botón primario + canales digitales | Datos de contacto reales (pendientes de aportar) |
| 8 | **Footer** | `obsidian-950` | sitemap de 7 secciones, canales, aviso legal, © | Preparado para i18n |

### 10.1 Reglas de contenido de la home

- Estados de proyecto siempre visibles como texto (el color no comunica solo).
- Fotografía: prioridad a material oficial/proyecto; stock técnico solo como interino licenciado.
- Sin emojis; iconos Lucide; imágenes con `next/image`.
- Metadatos por página en fase de construcción (título, descripción, Open Graph).
- Cadenas de interfaz en `data/` para i18n futura.

---

## 11. Decisiones pendientes de aprobación

1. **Familia display**: Space Grotesk (recomendada) vs. Archivo.
2. **Fotografía**: disponibilidad de material oficial (proyectos, equipos, instalaciones) o aprobación de stock técnico licenciado como interino.
3. **Contenido real**: lista de proyectos con estado, integrantes, canales digitales y datos de contacto para poblar `data/`.
4. **Dominio** para `metadataBase` y URLs canónicas.
5. Aprobación formal de este documento antes de iniciar la construcción de `globals.css` y componentes.

---

*Documento generado en fase de dirección creativa. No incluye implementación: la construcción visual comienza tras aprobación explícita.*
