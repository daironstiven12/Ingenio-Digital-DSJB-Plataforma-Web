#!/usr/bin/env node
// scripts/check-inline-scripts.mjs
// Descarga el HTML servido y verifica FUERA DEL BUNDLER que cada <script>
// inline (sin src y sin JSON-LD) parsea correctamente. Sin esto, el intro
// deja de ejecutarse y no hay nadie que lo detecte con lint/build.
// Uso: node scripts/check-inline-scripts.mjs [urls...]
// Exit code 1 si algún script falla.

import vm from "node:vm";

const defaultUrls = [
  "http://localhost:3000/?intro=1&motion=on",
  "http://localhost:3000/",
];
const urls = process.argv.slice(2);
const targets = urls.length > 0 ? urls : defaultUrls;

let failures = 0;

for (const url of targets) {
  console.log(`\n— ${url}`);
  let html;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.log(`  HTTP ${res.status} — no se puede verificar`);
      failures++;
      continue;
    }
    html = await res.text();
  } catch (error) {
    console.log(`  fetch falló: ${error.message}`);
    failures++;
    continue;
  }

  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let match, i = 0;
  while ((match = re.exec(html))) {
    i++;
    const attrs = match[1];
    const body = match[2];
    if (/src\s*=/i.test(attrs)) continue;
    if (/application\/ld\+json/i.test(attrs)) continue;
    if (!body.trim()) continue;
    try {
      new vm.Script(body);
      console.log(`  script ${i}: OK (${body.length} chars)`);
    } catch (error) {
      console.log(`  script ${i}: FAIL`);
      console.log(`    error: ${error.message}`);
      failures++;
    }
  }
}

if (failures > 0) {
  console.error(`\n✗ ${failures} script(s) inline con error de sintaxis`);
  process.exit(1);
}
console.log("\n✓ Todos los scripts inline son sintácticamente válidos");
