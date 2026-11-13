// Resuelve la foto de un miembro desde /public. SOLO servidor (fs).
// Orden: <id>.jpg → <id>.jpeg → <id>.png → <id>.webp → null (iniciales).
// Documentado: colocar el archivo en public/images/team/<id>.<ext>.
import fs from "node:fs";
import path from "node:path";

const EXTS = ["jpg", "jpeg", "png", "webp"];

export function resolveTeamPhoto(id) {
  if (!id || typeof id !== "string" || /[/\\.]/.test(id)) return null;
  const dir = path.join(process.cwd(), "public", "images", "team");
  for (const ext of EXTS) {
    if (fs.existsSync(path.join(dir, `${id}.${ext}`))) {
      return `/images/team/${id}.${ext}`;
    }
  }
  return null;
}
