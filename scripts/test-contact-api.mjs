#!/usr/bin/env node
// scripts/test-contact-api.mjs
// Pruebas del endpoint POST /api/contact contra el servidor local.
// Uso: node scripts/test-contact-api.mjs [baseUrl]   (por defecto
// http://localhost:3000). Exit code 1 si algo no se cumple.
//
// Espera que el servidor esté en marcha y que las variables de correo/
// WhatsApp NO estén configuradas (dry-run en desarrollo). Si estás en
// producción y hay canales configurados, los casos "válido" pueden enviar
// de verdad: se avisa por salida por consola.
//
// El rate-limit por IP (5/hora) obliga a dar una IP única a cada caso;
// el caso "12" comprueba el propio límite con su IP propia.

const base = process.argv[2] ?? "http://localhost:3000";
const url = `${base}/api/contact`;

const runId = Math.floor(Date.now() / 1000);
let ipSeq = 1;
const uniqueIp = () => `10.${(runId % 200) + 1}.0.${ipSeq++}`;

const valid = {
  need: "web",
  detail: "venta",
  audience: "negocio",
  timing: "pronto",
  name: "Prueba QA",
  email: "qa@example.com",
  phone: "+57 300 1234567",
  preferred: "email",
  message: "Mensaje de prueba automatizada, por favor ignorar.",
  consent: true,
  lang: "es",
  hp: "",
  elapsedMs: 5000,
};

const cases = [
  {
    name: "01 · válido en dry-run → 200 ok + mode dry-run",
    body: () => ({ ...valid }),
    expect: (res, json) =>
      res.status === 200 && json.ok === true && json.mode === "dry-run",
  },
  {
    name: "02 · falta consentimiento → 400",
    body: () => ({ ...valid, consent: false }),
    expect: (res) => res.status === 400,
  },
  {
    name: "03 · correo inválido → 400",
    body: () => ({ ...valid, email: "no-es-un-correo" }),
    expect: (res) => res.status === 400,
  },
  {
    name: "04 · id de need inexistente → 400",
    body: () => ({ ...valid, need: "inexistente" }),
    expect: (res) => res.status === 400,
  },
  {
    name: "04b · id de detail inexistente → 400",
    body: () => ({ ...valid, detail: "inexistente" }),
    expect: (res) => res.status === 400,
  },
  {
    name: "05 · honeypot relleno → 200 silencioso (sin enviar)",
    body: () => ({ ...valid, hp: "spam-bot-relleno" }),
    expect: (res, json) => res.status === 200 && json.ok === true && !json.mode,
  },
  {
    name: "06 · cuerpo demasiado grande → 413 o 400",
    body: () => ({ ...valid, message: "x".repeat(6000) }),
    expect: (res) => res.status === 413 || res.status === 400,
  },
  {
    name: "07 · sin ningún medio de contacto → 400",
    body: () => ({ ...valid, email: "", phone: "" }),
    expect: (res) => res.status === 400,
  },
  {
    name: "08 · elapsedMs < 2500 → 200 silencioso (anti-bot)",
    body: () => ({ ...valid, elapsedMs: 800 }),
    expect: (res, json) => res.status === 200 && json.ok === true,
  },
  {
    name: "09 · content-type incorrecto → 4xx",
    body: () => ({ ...valid }),
    contentType: "text/plain",
    expect: (res) => res.status >= 400 && res.status < 500,
  },
  {
    name: "10 · solo teléfono (sin correo) → 200 válido",
    body: () => ({ ...valid, email: "", preferred: "whatsapp" }),
    expect: (res) => res.status === 200,
  },
  {
    name: "11 · mensaje excesivo se recorta pero valida → 200",
    body: () => ({ ...valid, message: "muy largo. ".repeat(120).slice(0, 4999) }),
    expect: (res) => res.status === 200,
  },
];

let passed = 0;
let failed = 0;

console.log(`\nPOST ${url}\n`);

for (const testCase of cases) {
  const ip = uniqueIp();
  try {
    const payload = JSON.stringify(testCase.body());
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": testCase.contentType ?? "application/json",
        "x-forwarded-for": ip,
      },
      body: payload,
    });
    let json = null;
    try {
      json = await res.json();
    } catch {
      json = null;
    }
    const ok = testCase.expect(res, json);
    if (ok) {
      passed++;
      console.log(`  ✓ ${testCase.name}`);
    } else {
      failed++;
      console.log(`  ✗ ${testCase.name} — status=${res.status} body=${JSON.stringify(json)}`);
    }
  } catch (error) {
    failed++;
    console.log(`  ✗ ${testCase.name} — error de red: ${error.message}`);
  }
}

// Caso 12: rate-limit propio (misma IP, 6 envíos; el 6.º debe ser 429)
{
  const ip = uniqueIp();
  let lastStatus = 0;
  let all200Before = true;
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({ ...valid, message: `intento ${i + 1}` }),
    });
    if (res.status !== 200) all200Before = false;
    lastStatus = res.status;
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify({ ...valid, message: "intento 6" }),
  });
  const ok = all200Before && res.status === 429;
  if (ok) {
    passed++;
    console.log("  ✓ 12 · 6.º envío desde la misma IP → 429 rate_limited");
  } else {
    failed++;
    console.log(
      `  ✗ 12 · rate-limit — antes=${all200Before ? "ok" : `falló (último ${lastStatus})`}, 6.º=${res.status}`,
    );
  }
}

console.log(`\n${passed} ok · ${failed} fallidas\n`);
process.exit(failed === 0 ? 0 : 1);
