'use strict';
// Inline SVG: the site mark and the Motor -> Actuator -> Motion -> Learning -> Humanoid progression.
const { esc } = require('./html');

/** Brand mark: schematic motor end view (rotor, shaft) on a rounded square. */
function mark(size, opts) {
  const rx = opts && opts.square ? 0 : 14;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true" focusable="false">` +
    `<rect width="64" height="64" rx="${rx}" fill="#A64B1F"/>` +
    `<circle cx="29" cy="32" r="15" fill="none" stroke="#fff" stroke-width="4.5"/>` +
    `<circle cx="29" cy="32" r="4.5" fill="#fff"/>` +
    `<path d="M46 32h11" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>` +
    `</svg>`;
}

// Stage icons drawn around (0,0) inside a 72px node; stroke-based line art.
const ICONS = {
  Motor:
    '<rect x="-22" y="-13" width="34" height="26" rx="4"/>' +
    '<path d="M12 0h12M-22-6h-7M-22 6h-7"/>' +
    '<path d="M-14-13v26M-6-13v26M2-13v26" opacity=".45"/>',
  Actuator:
    '<circle cx="-4" cy="0" r="13"/>' +
    '<path d="M-4-20v4M-4 16v4M-24 0h4M12 0h4M-18.1-14.1l2.8 2.8M7.3 11.3l2.8 2.8M-18.1 14.1l2.8-2.8M7.3-11.3l2.8-2.8"/>' +
    '<circle cx="-4" cy="0" r="4"/>' +
    '<path d="M9 0h17" opacity=".8"/>',
  Motion:
    '<path d="M-20 18-6-6 16 2"/>' +
    '<circle cx="-20" cy="18" r="4"/><circle cx="-6" cy="-6" r="4"/><circle cx="16" cy="2" r="4"/>' +
    '<path d="M18-14a18 18 0 0 1 4 12" stroke-dasharray="3 4" opacity=".7"/>',
  Learning:
    '<path d="M-20-18v36h40"/>' +
    '<path d="M-14 12c6 0 7-4 10-12s4-10 8-12 8-2 14-2" />' +
    '<circle cx="18" cy="-13" r="2.5" fill="currentColor" stroke="none"/>',
  Humanoid:
    '<circle cx="0" cy="-18" r="5"/>' +
    '<rect x="-7" y="-10" width="14" height="16" rx="3"/>' +
    '<path d="M-7-6l-9 10M7-6l9 10M-4 6l-5 16M4 6l5 16"/>'
};

function node(x, y, name) {
  return `<g transform="translate(${x} ${y})">` +
    `<circle r="34" fill="#F6E9E0" stroke="#A64B1F" stroke-width="2"/>` +
    `<g fill="none" stroke="#1C1B19" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" color="#1C1B19">${ICONS[name] || ''}</g>` +
    `</g>`;
}

const ARROW = '<marker id="prog-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 10 5 0 10z" fill="#8C8577"/></marker>';

/** Horizontal progression for wide layouts. weeks: [{number, shortDates}] */
function progressionHorizontal(stages, weeks) {
  const W = 1000, H = 190, y = 78;
  const xs = stages.map((_, i) => 100 + i * 200);
  let out = `<svg class="progression-h" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" aria-hidden="true" focusable="false"><defs>${ARROW}</defs>`;
  for (let i = 0; i < stages.length - 1; i++) {
    const x1 = xs[i] + 42, x2 = xs[i + 1] - 42, cx = (x1 + x2) / 2;
    out += `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#B8B2A7" stroke-width="2" marker-end="url(#prog-arrow)"/>`;
    const wk = weeks[i];
    if (wk) {
      out += `<text x="${cx}" y="${y - 16}" text-anchor="middle" font-family="ui-monospace, SF Mono, Menlo, Consolas, monospace" font-size="13" fill="#5D5A54">Week ${wk.number}</text>`;
      out += `<text x="${cx}" y="${y + 24}" text-anchor="middle" font-family="ui-monospace, SF Mono, Menlo, Consolas, monospace" font-size="12" fill="#8C8577">${esc(wk.shortDates || '')}</text>`;
    }
  }
  stages.forEach((name, i) => {
    out += node(xs[i], y, name);
    out += `<text x="${xs[i]}" y="${y + 66}" text-anchor="middle" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="19" font-weight="600" fill="#1C1B19">${esc(name)}</text>`;
  });
  return out + '</svg>';
}

/** Vertical progression for narrow layouts. */
function progressionVertical(stages, weeks) {
  const step = 118, x = 56, top = 52;
  const H = top + (stages.length - 1) * step + 60;
  let out = `<svg class="progression-v" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 ${H}" aria-hidden="true" focusable="false"><defs>${ARROW}</defs>`;
  for (let i = 0; i < stages.length - 1; i++) {
    const y1 = top + i * step + 42, y2 = top + (i + 1) * step - 42, cy = (y1 + y2) / 2;
    out += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#B8B2A7" stroke-width="2" marker-end="url(#prog-arrow)"/>`;
    const wk = weeks[i];
    if (wk) {
      out += `<text x="${x + 58}" y="${cy + 5}" font-family="ui-monospace, SF Mono, Menlo, Consolas, monospace" font-size="13" fill="#5D5A54">Week ${wk.number} <tspan fill="#8C8577">· ${esc(wk.shortDates || '')}</tspan></text>`;
    }
  }
  stages.forEach((name, i) => {
    const y = top + i * step;
    out += node(x, y, name);
    out += `<text x="${x + 58}" y="${y + 7}" font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif" font-size="21" font-weight="600" fill="#1C1B19">${esc(name)}</text>`;
  });
  return out + '</svg>';
}

function progression(stages, weeks) {
  const text = stages.join(' → ');
  return `<figure class="progression" aria-labelledby="progression-caption">` +
    progressionHorizontal(stages, weeks) + progressionVertical(stages, weeks) +
    `<figcaption id="progression-caption">Course progression: ${esc(text)}. One step per week, from a single motor to an integrated humanoid.</figcaption></figure>`;
}

module.exports = { mark, progression, progressionHorizontal, ICONS };
