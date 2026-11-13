// Rutas solo de desarrollo. En producción devuelven 404 con cuerpo vacío.
import { NextResponse } from "next/server";

export const config = { matcher: ["/intro-test", "/nav-test"] };

export function proxy() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }
  return NextResponse.next();
}
