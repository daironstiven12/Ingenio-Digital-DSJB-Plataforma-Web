// Profesionales reales de Ingenio Digital DSJB.
//
// Regla: nada inventado — solo los dos creadores confirmados por el dueño.
// Los nombres son PROVISIONALES hasta confirmar su publicación oficial (ver informe).
// TODO(dúos): confirmar con cada persona su nombre público preferido antes de publicar.
//
// Campos:
//   id:        identificador estable. La foto vive en /public/images/team/<id>.<ext>
//              (se resuelve en el servidor con lib/team-photo.js: jpg → jpeg → png → webp).
//   name:      nombre público (PROVISIONAL, por confirmar)
//   roleKey:   clave i18n del rol (resuelto en la interfaz)
//   linkedin:  URL completa al perfil público
//   github:    null o URL completa → botón visible solo si tiene valor
//   website:   null o URL completa → botón Portafolio/Sitio (opcional)
//   photo:     null → avatar con iniciales (se rellena automáticamente si el archivo existe)
//
// Para añadir GitHub: rellenar github con la URL completa.
// Para añadir foto: colocar <id>.<ext> en public/images/team/

export const members = [
  {
    id: "dairon-orejuela",
    // TODO: confirmar nombre público preferido antes de publicar
    name: "Dairon Orejuela",
    roleKey: "team.roleCreator",
    linkedin: "https://www.linkedin.com/in/daironorejuela/",
    github: "https://github.com/daironstiven12",
    website: "https://daironstiven12.github.io/Portafolio/",
    photo: null,
  },
  {
    id: "jeanpier-buenano",
    // TODO: confirmar nombre público preferido antes de publicar
    name: "Jeanpier Buenaño",
    roleKey: "team.roleCreator",
    linkedin: "https://www.linkedin.com/in/jeanpier-buena%C3%B1o-742601437/",
    github: "https://github.com/jeanpier2303",
    website: null,
    photo: null,
  },
];
