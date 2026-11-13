import { notFound } from "next/navigation";
import NavTestClient from "./NavTestClient";

// Página SOLO de desarrollo. 404 en producción (ver proxy.js).
export default function NavTestPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <NavTestClient />;
}
