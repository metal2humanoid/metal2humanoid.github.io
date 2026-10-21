'use strict';
const { esc, linkAttrs, icons } = require('./html');
const { mark } = require('./svg');

/**
 * Wrap page content in the shared document shell.
 * opts: { site, title, description, path, current, body, root }
 *  - path: output path of this page ('index.html', 'sponsor.html'), used for canonical/og:url
 *  - current: nav href that is the current page (for aria-current)
 *  - root: prefix for internal links ('' for root pages; basePath + '/' for the 404 page)
 */
function page(opts) {
  const { site, title, description, path, current, body } = opts;
  const root = opts.root || '';
  const base = (site.basePath || '').replace(/\/$/, '');
  const abs = (p) => `${site.siteUrl.replace(/\/$/, '')}${base}/${p.replace(/^\//, '')}`;
  const canonical = path === 'index.html' ? abs('') : abs(path);
  const onIndex = path === 'index.html';

  const navItems = site.nav.map((item) => {
    // On the index page, anchor links stay same-document (#schedule) to avoid reloads.
    let href = item.href;
    if (onIndex && href.startsWith('index.html#')) href = href.slice('index.html'.length);
    const isCurrent = current && item.href === current;
    return `<li><a href="${esc(root + href)}"${isCurrent ? ' aria-current="page"' : ''}>${esc(item.label)}</a></li>`;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(abs(site.social.image))}">
<meta property="og:image:alt" content="${esc(site.social.imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(abs(site.social.image))}">
${site.draft && site.draft.enabled ? '<meta name="robots" content="noindex, nofollow">\n' : ''}<meta name="theme-color" content="#FBFAF7">
<link rel="icon" href="${root}assets/img/favicon.svg" type="image/svg+xml">
<link rel="icon" href="${root}assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${root}assets/img/apple-touch-icon.png">
<link rel="stylesheet" href="${root}assets/css/site.css">
</head>
<body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${esc(root + 'index.html')}">${mark(26)}<span class="brand-name">${esc(site.name)}</span></a>
    <nav class="site-nav" aria-label="Primary">
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-menu" hidden>Menu</button>
      <ul id="site-menu" class="nav-list">${navItems}</ul>
    </nav>
  </div>
</header>
${site.draft && site.draft.enabled ? `<div class="draft-banner" role="note"><div class="wrap">${esc(site.draft.notice)}</div></div>` : ''}
<main id="main" tabindex="-1">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <p class="footer-disclaimer">${esc(site.footer.disclaimer)}</p>
    <p class="footer-links">
      <a ${linkAttrs(site.contact.course.email ? `mailto:${site.contact.course.email}` : '#')}>Contact</a>
      <a ${linkAttrs(site.links.discord)}>HBRN Discord</a>
      <a ${linkAttrs(site.links.hbrnSite)}>Homebrew Robotics Network</a>
      <a ${linkAttrs(site.links.siteSource)}>Site source</a>
    </p>
    <p class="footer-copy">${esc(site.footer.copyright)}</p>
  </div>
</footer>
<script>
(function () {
  var btn = document.querySelector('.nav-toggle'), menu = document.getElementById('site-menu');
  if (!btn || !menu) return;
  document.documentElement.classList.add('js');
  btn.hidden = false;
  function setOpen(open) { btn.setAttribute('aria-expanded', String(open)); menu.classList.toggle('is-open', open); }
  btn.addEventListener('click', function () { setOpen(btn.getAttribute('aria-expanded') !== 'true'); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setOpen(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setOpen(false); btn.focus(); } });
})();
</script>
</body>
</html>
`;
}

module.exports = { page };
