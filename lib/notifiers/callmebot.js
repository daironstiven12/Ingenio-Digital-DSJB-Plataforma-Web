// Proveedor callmebot — https://www.callmebot.com/blog/free-api-whatsapp-messages/
//
// ADVERTENCIA HONESTA (verificada en su sitio y en su documentación):
//  - Es un servicio GRATUITO y NO OFICIAL. Su FAQ lo clasifica como
//    "solo uso personal" y no da garantías de disponibilidad.
//  - Solo envía mensajes AL NÚMERO con el que se activó la API (envío a
//    uno mismo o al equipo que activó el bot). No es un canal de envío
//    saliente hacia terceros.
//  - Para un negocio que crece, la alternativa es la Cloud API oficial
//    de WhatsApp Business Platform (Meta), con plantillas aprobadas y
//    verificación de negocio — se integraría como otro provider
//    lib/notifiers/meta.js sin tocar la ruta.
//
// Activación manual (una sola vez por el número destino): seguir las
// instrucciones de callmebot (enviar un WhatsApp desde el número a su
// bot) y guardar el apikey devuelto en CALLMEBOT_APIKEY.
//
// Variables de servidor (sin NEXT_PUBLIC_):
//   CALLMEBOT_PHONE  — número que activó el bot, con prefijo, solo dígitos
//   CALLMEBOT_APIKEY — apikey entregada por callmebot

const CALLMEBOT_URL = "https://api.callmebot.com/whatsapp.php";
const TIMEOUT_MS = 8000;

export async function send(text) {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return { status: "skipped" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const url = `${CALLMEBOT_URL}?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
    const response = await fetch(url, { signal: controller.signal });
    return { status: response.status === 200 ? "sent" : "failed" };
  } catch {
    // timeout/red: el envío falló, pero sin filtrar datos en logs
    return { status: "failed" };
  } finally {
    clearTimeout(timer);
  }
}
