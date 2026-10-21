'use strict';
const { esc, linkAttrs, mailto, join, icons } = require('./html');

function renderSponsor(data) {
  const { site, sponsors } = data;
  const c = site.contact.sponsor;
  const href = mailto(c.email, c.subject || sponsors.contact.subject);
  const confirmed = sponsors.confirmed || [];
  const KIND = { financial: 'Financial support', 'in-kind': 'In-kind support', mentorship: 'Technical mentorship' };

  const sponsorList = confirmed.length
    ? `<ul class="sponsor-list">${join(confirmed, (s) => `<li class="sponsor">
        ${s.logo ? `<a ${linkAttrs(s.url, 'rel="sponsored noopener"')}><img src="${esc(s.logo)}" alt="${esc(s.name)}" loading="lazy" decoding="async" width="200" height="80"></a>` : ''}
        <p class="sponsor-name">${s.url ? `<a ${linkAttrs(s.url, 'rel="sponsored noopener"')}>${esc(s.name)}</a>` : esc(s.name)}</p>
        <p class="muted small">${esc(KIND[s.kind] || s.kind || '')}${s.note ? ` · ${esc(s.note)}` : ''}</p>
      </li>`)}</ul>`
    : `<p class="muted">${esc(sponsors.noSponsorsNote)}</p>`;

  return `<section class="hero hero-compact" aria-labelledby="sponsor-title">
  <div class="wrap">
    <p class="eyebrow"><span>How to sponsor</span><span class="sep" aria-hidden="true">·</span><span>Metal2Humanoid, proposed MIT IAP 2027</span></p>
    <h1 id="sponsor-title" class="hero-title hero-title-long">${esc(sponsors.headline)}</h1>
    <p class="hero-lede">${esc(sponsors.lede)}</p>
    <p class="actions">
      <a class="button button-primary" href="${esc(href)}">${icons.mail} ${esc(sponsors.contact.buttonLabel)}</a>
      <a class="button" href="index.html#progress">See progress so far</a>
      <a class="button" href="${esc(site.links.syllabusPdf)}">${icons.download} Syllabus <span class="muted-inline">(PDF)</span></a>
    </p>
  </div>
</section>

<section class="section" aria-labelledby="provides-title">
  <div class="wrap">
    <h2 id="provides-title">${esc(sponsors.whatSupportProvides.title)}</h2>
    <ul class="three-up">
      ${join(sponsors.whatSupportProvides.items, (i) => `<li><h3>${esc(i.title)}</h3><p>${esc(i.text)}</p></li>`)}
    </ul>
  </div>
</section>

<section class="section section-alt" id="needs" aria-labelledby="needs-title">
  <div class="wrap">
    <h2 id="needs-title">${esc(sponsors.needs.title)}</h2>
    <p>${esc(sponsors.needs.intro)}</p>
    <ol class="needs">
      ${join(sponsors.needs.items, (n) => `<li><h3>${esc(n.title)}</h3><p>${esc(n.text)}</p></li>`)}
    </ol>
  </div>
</section>

${sponsors.whereItGoes ? `<section class="section" id="where" aria-labelledby="where-title">
  <div class="wrap">
    <h2 id="where-title">${esc(sponsors.whereItGoes.title)}</h2>
    <p>${esc(sponsors.whereItGoes.intro)}</p>
    <ul class="benefits">
      ${join(sponsors.whereItGoes.items, (i) => `<li>${esc(i)}</li>`)}
    </ul>
  </div>
</section>` : ''}

<section class="section" id="benefits" aria-labelledby="benefits-title">
  <div class="wrap">
    <h2 id="benefits-title">${esc(sponsors.benefits.title)}</h2>
    <p>${esc(sponsors.benefits.intro)}</p>
    <ul class="benefits">
      ${join(sponsors.benefits.items, (b) => `<li>${esc(b)}</li>`)}
    </ul>
  </div>
</section>

<section class="section section-alt" id="big-companies" aria-labelledby="big-title">
  <div class="wrap">
    <h2 id="big-title">${esc(sponsors.bigCompanies.title)}</h2>
    <p>${esc(sponsors.bigCompanies.intro)}</p>
    <div class="columns exchange">
      <div>
        <h3>${esc(sponsors.bigCompanies.companies.title)}</h3>
        <ul>${join(sponsors.bigCompanies.companies.items, (i) => `<li>${esc(i)}</li>`)}</ul>
      </div>
      <div>
        <h3>${esc(sponsors.bigCompanies.community.title)}</h3>
        <ul>${join(sponsors.bigCompanies.community.items, (i) => `<li>${esc(i)}</li>`)}</ul>
      </div>
    </div>
    ${sponsors.bigCompanies.partnerNote ? `<p class="partner-note">${esc(sponsors.bigCompanies.partnerNote)}</p>` : ''}
  </div>
</section>

<section class="section" id="sponsors" aria-labelledby="sponsors-title">
  <div class="wrap">
    <h2 id="sponsors-title">${esc(sponsors.confirmedTitle)}</h2>
    ${sponsorList}
    <p class="muted small">${esc(sponsors.facultyNote)} <a href="index.html#team">See the team ${icons.arrow}</a></p>
  </div>
</section>

<section class="section section-contact" id="contact" aria-labelledby="sponsor-contact-title">
  <div class="wrap">
    <h2 id="sponsor-contact-title">${esc(sponsors.contact.title)}</h2>
    <p>${esc(sponsors.contact.text)}</p>
    <p class="actions"><a class="button button-primary" href="${esc(href)}">${icons.mail} ${esc(sponsors.contact.buttonLabel)}</a></p>
    <p class="muted small">Email: <a href="${esc(href)}">${esc(c.email)}</a> (${esc(c.name)}${c.title ? `, ${esc(c.title)}` : ""}).</p>
  </div>
</section>`;
}

function renderNotFound(data) {
  return `<section class="section" aria-labelledby="nf-title">
  <div class="wrap">
    <h1 id="nf-title">Page not found</h1>
    <p>The page you asked for does not exist. Try the <a href="${esc((data.site.basePath || '') + '/')}">course overview</a> or the <a href="${esc((data.site.basePath || '') + '/sponsor.html')}">sponsor page</a>.</p>
  </div>
</section>`;
}

module.exports = { renderSponsor, renderNotFound };
