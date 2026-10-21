#!/usr/bin/env node
'use strict';
// Writes the HTML for the 1200x630 social-sharing card. Render it with headless Chrome:
//   node tools/make-og.js /tmp/og.html
//   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --screenshot=og.png --window-size=1200,630 file:///tmp/og.html
// then optimize/copy the PNG to assets/img/og-image.png (see README).
const fs = require('fs');
const path = require('path');
const { progressionHorizontal } = require('../src/svg');
const site = require('../data/site.json');
const course = require('../data/course.json');
const schedule = require('../data/schedule.json');

const out = process.argv[2];
if (!out) { console.error('usage: node tools/make-og.js <output.html>'); process.exit(1); }
const svg = progressionHorizontal(course.stages, schedule.weeks);
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
html,body{margin:0}
body{width:1200px;height:630px;background:#FBFAF7;color:#1C1B19;font-family:Inter,system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;display:flex;flex-direction:column;justify-content:space-between;padding:54px 64px 40px;box-sizing:border-box;overflow:hidden}
.eyebrow{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:20px;letter-spacing:.05em;text-transform:uppercase;color:#5D5A54}
h1{font-size:92px;margin:10px 0 0;letter-spacing:-.035em;line-height:1;font-weight:700}
.sub{font-size:34px;color:#5D5A54;margin-top:12px;font-weight:500;letter-spacing:-.01em}
.bar{height:6px;width:120px;background:#A64B1F;margin-top:26px}
svg{width:1072px;height:auto;display:block}
</style></head><body>
<div><div class="eyebrow">${esc(course.eyebrow.join(' · '))}</div><h1>${esc(site.name)}</h1><div class="sub">${esc(site.tagline)}</div><div class="bar"></div></div>
${svg}
</body></html>`;
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`wrote ${out}`);
