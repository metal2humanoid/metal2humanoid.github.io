'use strict';
// Small HTML helpers shared by the templates. No dependencies.

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ESC[c]);

const isExternal = (url) => /^(https?:)?\/\//i.test(url);

/** Attributes for an <a>: external links get rel="noopener". */
function linkAttrs(url, extra) {
  const attrs = [`href="${esc(url)}"`];
  if (isExternal(url)) attrs.push('rel="noopener"');
  if (extra) attrs.push(extra);
  return attrs.join(' ');
}

/** "2027-01-05" -> "Tue, Jan 5" (no timezone shifting). */
function fmtDate(iso, options) {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString('en-US', options || { weekday: 'short', month: 'short', day: 'numeric' });
}

function initials(name) {
  const parts = String(name).replace(/^@/, '').split(/[\s-]+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function mailto(email, subject) {
  return `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;
}

const join = (arr, fn) => arr.map(fn).join('\n');

const icons = {
  external: '<svg class="icon" aria-hidden="true" viewBox="0 0 16 16" width="12" height="12"><path d="M6.5 3H3.5A1.5 1.5 0 0 0 2 4.5v8A1.5 1.5 0 0 0 3.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-3M9.5 2H14v4.5M14 2 7.5 8.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  download: '<svg class="icon" aria-hidden="true" viewBox="0 0 16 16" width="14" height="14"><path d="M8 2v8m0 0 3-3M8 10 5 7M3 13h10" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  mail: '<svg class="icon" aria-hidden="true" viewBox="0 0 16 16" width="14" height="14"><path d="M2.5 4h11v8h-11zM2.5 4.5 8 9l5.5-4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  arrow: '<svg class="icon" aria-hidden="true" viewBox="0 0 16 16" width="14" height="14"><path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play: '<svg class="icon" aria-hidden="true" viewBox="0 0 16 16" width="12" height="12"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>'
};

const STATUS_LABELS = {
  available: 'Available',
  coming: 'Coming soon',
  'in-progress': 'In progress',
  external: 'External resource',
  demonstrated: 'Demonstrated',
  goal: 'Goal'
};

function statusPill(status, label) {
  const text = label || STATUS_LABELS[status] || status;
  return `<span class="status status-${esc(status)}">${esc(text)}</span>`;
}

module.exports = { esc, isExternal, linkAttrs, fmtDate, initials, mailto, join, icons, statusPill, STATUS_LABELS };
