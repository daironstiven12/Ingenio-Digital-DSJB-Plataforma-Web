// Profesionales reales de Ingenio Digital DSJB.
//
// Regla: nada inventado — solo los dos creadores confirmados por el dueño.
// Los nombres son PROVISIONALES hasta confirmar su publicación oficial (ver informe).
// TODO(dúos): confirmar con cada persona su nombre público preferido antes de publicar.
//
// Campos:
//   id:        identificador estable
//   name:      nombre público (PROVISIONAL, por confirmar)
//   roleKey:   clave i18n del rol (resuelto en la interfaz)
//   linkedin:  URL completa al perfil público
//   github:    null (sin cuenta confirmada) — botón oculto si no hay valor
//   photo:     null → avatar con iniciales; con foto: ruta local /public/images/team/<id>.jpg
//
// Para añadir GitHub: rellenar github con la URL completa.
// Para añadir foto: colocar <id>.jpg en public/images/team/ y poner photo: "/images/team/<id>.jpg".

export const members = [
  {
    id: "dairon-orejuela",
    // TODO: confirmar nombre público preferido antes de publicar
    name: "Dairon Orejuela",
    roleKey: "team.roleCreator",
    linkedin: "https://www.linkedin.com/in/daironorejuela/",
    github: null,
    photo: null,
  },
  {
    id: "jeanpier-buenano",
    // TODO: confirmar nombre público preferido antes de publicar
    name: "Jeanpier Buenaño",
    roleKey: "team.roleCreator",
    linkedin: "https://www.linkedin.com/in/jeanpier-buena%C3%B1o-742601437/",
    github: null,
    photo: null,
  },
];
