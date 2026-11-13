// Profesionales: componente servidor que resuelve la existencia real de
// las fotos (/public/images/team/<id>.<ext>) y las pasa al cliente.
// No se inventa ninguna foto: si no existe el archivo, hay iniciales.
import { members } from "@/data/team";
import { resolveTeamPhoto } from "@/lib/team-photo";
import Team from "./Team";

export default function TeamSection() {
  const withPhotos = members.map((member) => ({
    ...member,
    photoSrc: resolveTeamPhoto(member.id),
  }));

  return <Team members={withPhotos} />;
}
