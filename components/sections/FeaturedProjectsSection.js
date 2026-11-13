// Proyectos: componente servidor que resuelve la existencia real de
// /public/images/projects/<id>.jpg (o .png/.webp) y pasa los datos al cliente.
import { projects } from "@/data/projects";
import fs from "node:fs";
import path from "node:path";
import FeaturedProjects from "./FeaturedProjects";

const EXTS = ["jpg", "jpeg", "webp", "png"];

function resolveProjectImage(id) {
  const dir = path.join(process.cwd(), "public", "images", "projects");
  for (const ext of EXTS) {
    if (fs.existsSync(path.join(dir, `${id}.${ext}`))) {
      return `/images/projects/${id}.${ext}`;
    }
  }
  return null;
}

export default function FeaturedProjectsSection() {
  const withImages = projects.map((project) => ({
    ...project,
    imageSrc: resolveProjectImage(project.id),
  }));

  return <FeaturedProjects projects={withImages} />;
}
