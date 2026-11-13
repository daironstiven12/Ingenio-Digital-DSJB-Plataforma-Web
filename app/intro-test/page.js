import { notFound } from "next/navigation";
import IntroTestClient from "./IntroTestClient";

// Página SOLO de desarrollo para aislar y probar el mecanismo visual
// del intro. 404 en producción.
export default function IntroTestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <IntroTestClient />;
}
