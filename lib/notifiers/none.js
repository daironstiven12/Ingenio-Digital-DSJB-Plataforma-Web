// Proveedor "none": WhatsApp no configurado, el canal queda "skipped".

export async function send() {
  return { status: "skipped" };
}
