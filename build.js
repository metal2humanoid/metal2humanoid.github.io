#!/usr/bin/env node
'use strict';
/**
 * Metal2Humanoid site builder (no dependencies).
 *   node build.js          write index.html, sponsor.html, 404.html from data/ and src/
 *   node build.js --check  verify the committed pages match the data (exit 1 if stale)
 */
const fs = require('fs');
const path = require('path');
const { page } = require('./src/layout');
const { renderIndex } = require('./src/index');
const { renderSponsor, renderNotFound } = require('./src/sponsor');

const ROOT = __dirname;
const CHECK = process.argv.includes('--check');

function loadJson(name) {
  const file = path.join(ROOT, 'data', `${name}.json`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.error(`Could not read ${path.relative(ROOT, file)}: ${err.message}`);
    process.exit(1);
  }
}

const data = {
  site: loadJson('site'),
  course: loadJson('course'),
  schedule: loadJson('schedule'),
  materials: loadJson('materials'),
  people: loadJson('people'),
  progress: loadJson('progress'),
  sponsors: loadJson('sponsors')
};

// ---- light validation so content mistakes fail loudly -------------------------------------
const problems = [];
const need = (cond, msg) => { if (!cond) problems.push(msg); };

need(/^https?:\/\//.test(data.site.siteUrl), 'site.siteUrl must be an absolute URL');
need(!data.site.basePath || /^\/[^/]/.test(data.site.basePath), "site.basePath must be '' or start with '/' (e.g. '/metal2humanoid')");
need(/@/.test(data.site.contact.course.email), 'site.contact.course.email is required');
need(/@/.test(data.site.contact.sponsor.email), 'site.contact.sponsor.email is required');

const MATERIAL_KEYS = ['slides', 'notes', 'recording', 'instructions', 'code', 'notebook'];
data.schedule.weeks.forEach((w) => {
  need(Number.isInteger(w.number) && w.title, 'each schedule week needs a number and title');
  (w.sessions || []).forEach((s) => {
    need(/^\d{4}-\d{2}-\d{2}$/.test(s.date || ''), `week ${w.number}: session dates must be YYYY-MM-DD (got ${s.date})`);
    need(['lecture', 'lab'].includes(s.type), `week ${w.number}: session type must be 'lecture' or 'lab'`);
    need(s.title, `week ${w.number}: every session needs a title`);
    Object.keys(s.materials || {}).forEach((k) => need(MATERIAL_KEYS.includes(k), `week ${w.number}: unknown material key '${k}'`));
  });
});

const STATUSES = ['available', 'coming', 'in-progress', 'external'];
data.materials.groups.forEach((g) => (g.items || []).forEach((it) => {
  need(STATUSES.includes(it.status), `materials: '${it.title}' has unknown status '${it.status}'`);
  need(it.status !== 'available' || it.url, `materials: '${it.title}' is 'available' but has no url`);
  need(it.status !== 'coming' || !it.url, `materials: '${it.title}' is 'coming' but has a url; use 'available' or 'in-progress'`);
}));

const PROGRESS_STATUSES = ['demonstrated', 'in-progress', 'goal'];
data.progress.entries.forEach((e) => {
  need(PROGRESS_STATUSES.includes(e.status), `progress: '${e.title}' has unknown status '${e.status}'`);
  if (e.published !== false) {
    need(e.text && e.attribution, `progress: '${e.title}' needs text and attribution before publishing`);
    if (e.media) need(e.media.src && e.media.alt && (e.media.type !== 'video' || e.media.poster), `progress: '${e.title}' media needs src, alt (and poster for video)`);
  }
});

[data.people.teaching, data.people.facultySponsor, data.people.community].forEach((group) =>
  group.people.forEach((p) => need(p.name && p.role, `people: every entry needs a name and role (${p.name || '?'})`)));

(data.sponsors.confirmed || []).forEach((s) => need(s.name, 'sponsors.confirmed entries need a name'));

if (problems.length) {
  console.error('Content problems:\n - ' + problems.join('\n - '));
  process.exit(1);
}

// ---- render ---------------------------------------------------------------------------------
const site = data.site;
const base = (site.basePath || '').replace(/\/$/, '');
const pages = {
  'index.html': page({
    site,
    title: `${site.name}: ${site.tagline}`,
    description: site.description,
    path: 'index.html',
    current: 'index.html#overview',
    body: renderIndex(data)
  }),
  'sponsor.html': page({
    site,
    title: `How to Sponsor · ${site.name}`,
    description: `${data.sponsors.headline} Support the proposed MIT IAP 2027 course with hardware, tools, fabrication, funding, or mentorship.`,
    path: 'sponsor.html',
    current: 'sponsor.html',
    body: renderSponsor(data)
  }),
  '404.html': page({
    site,
    title: `Page not found · ${site.name}`,
    description: site.description,
    path: '404.html',
    current: null,
    root: `${base}/`,
    body: renderNotFound(data)
  })
};

// robots.txt follows the draft flag: disallow crawling while the site is marked as a draft.
const robotsTxt = site.draft && site.draft.enabled
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\nSitemap: ${site.siteUrl.replace(/\/$/, '')}${base}/sitemap.txt\n`;
pages['robots.txt'] = robotsTxt;
pages['sitemap.txt'] = ['index.html', 'sponsor.html'].map((f) => `${site.siteUrl.replace(/\/$/, '')}${base}/${f === 'index.html' ? '' : f}`).join('\n') + '\n';

// ---- check that every internal link and asset exists -------------------------------------
const linkProblems = [];
const generated = new Set(Object.keys(pages));
for (const [file, html] of Object.entries(pages)) {
  const re = /(?:href|src|poster|srcset)="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    let url = m[1].split(' ')[0];
    if (/^(https?:|mailto:|tel:|#|data:)/i.test(url)) continue;
    if (base && url.startsWith(base + '/')) url = url.slice(base.length + 1);
    url = url.replace(/^\//, '').split('#')[0].split('?')[0];
    if (!url || generated.has(url)) continue;
    if (!fs.existsSync(path.join(ROOT, url))) linkProblems.push(`${file}: missing local target '${url}'`);
  }
}
if (linkProblems.length) {
  console.error('Broken local links:\n - ' + linkProblems.join('\n - '));
  process.exit(1);
}

// ---- write or verify ------------------------------------------------------------------------
let stale = 0;
for (const [file, html] of Object.entries(pages)) {
  const out = path.join(ROOT, file);
  if (CHECK) {
    const current = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
    if (current !== html) { stale++; console.error(`${file} is out of date; run 'node build.js'`); }
  } else {
    fs.writeFileSync(out, html);
    console.log(`wrote ${file} (${(html.length / 1024).toFixed(1)} kB)`);
  }
}
if (CHECK) {
  if (stale) process.exit(1);
  console.log('Generated pages are up to date.');
}
