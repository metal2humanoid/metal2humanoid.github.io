'use strict';
const { esc, linkAttrs, fmtDate, initials, mailto, join, icons, statusPill } = require('./html');
const { progression } = require('./svg');


/** Render a media object {type:'video'|'image', src, poster, alt, width, height}. */
function mediaTag(m, cls) {
  if (!m) return '';
  if (m.type === 'video') {
    return `<video class="${esc(cls)}" controls muted loop playsinline preload="none" poster="${esc(m.poster)}" width="${esc(m.width)}" height="${esc(m.height)}" aria-label="${esc(m.alt)}">
        <source src="${esc(m.src)}" type="video/mp4">
        <a href="${esc(m.src)}">Download the video</a>
      </video>`;
  }
  return `<img class="${esc(cls)}" src="${esc(m.src)}" alt="${esc(m.alt)}" width="${esc(m.width)}" height="${esc(m.height)}" loading="lazy" decoding="async">`;
}

const MATERIAL_LABELS = { slides: 'Slides', notes: 'Notes', recording: 'Recording', instructions: 'Lab instructions', code: 'Code', notebook: 'Notebook' };

/** Links for a session/assignment materials object; nulls collapse into one "Coming soon". */
function materialLinks(materials) {
  const entries = Object.entries(materials || {});
  if (entries.length === 0) return '';
  const available = entries.filter(([, url]) => url);
  const missing = entries.filter(([, url]) => !url);
  const parts = available.map(([key, url]) =>
    `<a class="material-link" ${linkAttrs(url)}>${esc(MATERIAL_LABELS[key] || key)}</a>`);
  if (missing.length === entries.length) parts.push(statusPill('coming'));
  else if (missing.length) parts.push(`<span class="status status-coming">${esc(missing.map(([k]) => MATERIAL_LABELS[k] || k).join(', '))}: coming soon</span>`);
  return parts.join(' ');
}

function personCard(p) {
  const avatar = p.photo
    ? `<img class="avatar" src="${esc(p.photo)}" alt="" width="64" height="64" loading="lazy">`
    : `<span class="avatar avatar-initials" aria-hidden="true">${esc(initials(p.name))}</span>`;
  const links = [];
  (p.links || []).forEach((l) => links.push(`<a ${linkAttrs(l.url)}>${esc(l.label)}</a>`));
  if (p.email && p.showEmail !== false) links.push(`<a href="${esc(mailto(p.email))}">${esc(p.email)}</a>`);
  const site = (p.links || []).find((l) => /website|homepage/i.test(l.label));
  const name = site ? `<a ${linkAttrs(site.url)}>${esc(p.name)}</a>` : esc(p.name);
  return `<li class="person">
  ${avatar}
  <div class="person-body">
    <h4 class="person-name">${name}${p.handle ? ` <span class="person-handle">${esc(p.handle)}</span>` : ''}</h4>
    ${p.affiliation ? `<p class="person-affiliation">${esc(p.affiliation)}</p>` : ''}
    <p class="person-role">${esc(p.role)}</p>
    ${links.length ? `<p class="person-links">${links.join(' <span aria-hidden="true">·</span> ')}</p>` : ''}
  </div>
</li>`;
}

function renderHero(data) {
  const { site, course } = data;
  const reg = site.status.registration;
  const regAction = reg.open && reg.url
    ? `<a class="button button-primary" ${linkAttrs(reg.url)}>${esc(reg.label || 'Register')}</a>`
    : '';
  const heroImg = course.hero && course.hero.image;
  return `<section class="hero${heroImg ? ' has-image' : ''}" id="overview" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
  <div class="hero-copy">
    <p class="eyebrow">${course.eyebrow.map((t) => `<span>${esc(t)}</span>`).join('<span class="sep" aria-hidden="true">·</span>')}</p>
    <h1 id="hero-title" class="hero-title">${esc(site.name)}</h1>
    <p class="hero-subtitle">${esc(site.tagline)}</p>
    <p class="hero-lede">${esc(course.intro)}</p>
    <p class="hero-secondary">${esc(course.introSecondary)}</p>
    <p class="actions">
      <a class="button button-primary" ${linkAttrs(site.links.syllabusPdf)}>${icons.download} View the syllabus <span class="muted-inline">(PDF)</span></a>
      <a class="button" href="#schedule">Explore the schedule</a>
      <a class="button" href="sponsor.html">Support the course</a>
      ${regAction}
    </p>
    <p class="status-line"><strong>Status:</strong> ${esc(site.status.approvalNote)} ${esc(reg.note)} Questions: <a href="${esc(mailto(site.contact.course.email, site.contact.course.subject))}">${esc(site.contact.course.email)}</a>.</p>
  </div>
  ${heroImg ? `<figure class="hero-figure">
    <img src="${esc(heroImg.src)}" alt="${esc(heroImg.alt)}" width="${esc(heroImg.width)}" height="${esc(heroImg.height)}" decoding="async" fetchpriority="high">
    <figcaption>${esc(heroImg.caption)}</figcaption>
  </figure>` : ''}
  </div>
  <div class="wrap wrap-wide">
    ${progression(course.stages, data.schedule.weeks)}
  </div>
</section>`;
}

function renderFacts(course) {
  return `<section class="section section-facts" aria-labelledby="facts-title">
  <div class="wrap">
    <h2 id="facts-title">At a glance</h2>
    <dl class="facts">
      ${join(course.facts, (f) => `<div class="fact"><dt>${esc(f.label)}</dt><dd>${esc(f.value)}${f.note ? ` <span class="status status-provisional">${esc(f.note)}</span>` : ''}</dd></div>`)}
    </dl>
  </div>
</section>`;
}

function renderLearn(course) {
  return `<section class="section" id="learn" aria-labelledby="learn-title">
  <div class="wrap">
    <h2 id="learn-title">What students will learn</h2>
    <ol class="stages">
      ${join(course.learn, (s) => `<li class="stage">
        ${s.media ? `<figure class="stage-figure">${mediaTag(s.media, 'stage-media')}<figcaption>${esc(s.media.caption || '')}</figcaption></figure>` : ''}
        <p class="stage-week">Week ${s.week}</p>
        <h3 class="stage-title">${esc(s.from)} <span class="arrow" aria-hidden="true">→</span><span class="visually-hidden"> to </span>${esc(s.to)}</h3>
        <p>${esc(s.text)}</p>
      </li>`)}
    </ol>
    <div class="columns">
      <div>
        <h3>${esc(course.format.title)}</h3>
        ${join(course.format.paragraphs, (p) => `<p>${esc(p)}</p>`)}
      </div>
      <div>
        <h3>${esc(course.outcomes.title)}</h3>
        ${join(course.outcomes.paragraphs, (p) => `<p>${esc(p)}</p>`)}
      </div>
    </div>
    <h3>Learning objectives</h3>
    <ul class="objectives">
      ${join(course.objectives, (o) => `<li>${esc(o)}</li>`)}
    </ul>
  </div>
</section>`;
}

function renderSchedule(data) {
  const { schedule } = data;
  let lectureN = 0, labN = 0;
  const weeks = schedule.weeks.map((w) => {
    const rows = w.sessions.map((s) => {
      const isLab = s.type === 'lab';
      const label = isLab ? `Lab ${++labN}` : `Lecture ${++lectureN}`;
      return `<tr class="session session-${esc(s.type)}">
        <td data-label="Date"><time datetime="${esc(s.date)}">${esc(fmtDate(s.date))}</time></td>
        <td data-label="Session"><span class="pill pill-${esc(s.type)}">${esc(label)}</span><span class="session-title">${esc(s.title)}</span></td>
        <td data-label="Topics">${s.topics && s.topics.length ? `<ul class="topics">${s.topics.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}</td>
        <td data-label="Materials">${materialLinks(s.materials)}</td>
      </tr>`;
    }).join('\n');
    const a = w.assignment;
    const assignmentRow = a ? `<tr class="assignment">
        <th scope="row">Assignment</th>
        <td colspan="3" data-label="Assignment"><span class="session-title">${esc(a.title)}</span> ${materialLinks(a.materials)}</td>
      </tr>` : '';
    return `<article class="week" id="week-${w.number}" aria-labelledby="week-${w.number}-title">
  <h3 id="week-${w.number}-title"><span class="week-num">Week ${w.number}</span> ${esc(w.title)} <span class="week-dates">${esc(w.dates)}</span></h3>
  <table class="schedule">
    <thead><tr><th scope="col">Date</th><th scope="col">Session</th><th scope="col">Topics</th><th scope="col">Materials</th></tr></thead>
    <tbody>
${rows}
${assignmentRow}
    </tbody>
  </table>
</article>`;
  }).join('\n');

  return `<section class="section" id="schedule" aria-labelledby="schedule-title">
  <div class="wrap">
    <h2 id="schedule-title">Schedule</h2>
    <div class="meeting-times">
      <dl class="meetings">
        ${join(schedule.meetings, (m) => `<div><dt>${esc(m.kind)}</dt><dd>${esc(m.when)}<br><span class="muted">${esc(m.range)}</span></dd></div>`)}
        <div><dt>Location</dt><dd>${esc(schedule.location)}</dd></div>
      </dl>
      <p class="muted small">${esc(schedule.hoursNote)} Times are ${esc(schedule.timezone)}. ${esc(schedule.provisionalNote)}</p>
    </div>
    ${weeks}
  </div>
</section>`;
}

function renderMaterials(data) {
  const { materials } = data;
  const item = (it) => {
    const title = it.url
      ? `<a class="resource-title" ${linkAttrs(it.url, it.download ? 'download' : '')}>${esc(it.title)}${/^https?:/.test(it.url) ? ` ${icons.external}` : ''}</a>`
      : `<span class="resource-title">${esc(it.title)}</span>`;
    return `<li class="resource">
      ${title} ${statusPill(it.status)}
      ${it.note ? `<p class="resource-note">${esc(it.note)}</p>` : ''}
      ${it.attribution ? `<p class="resource-note">Source: ${esc(it.attribution)}</p>` : ''}
    </li>`;
  };
  const platform = materials.platform;
  return `<section class="section" id="materials" aria-labelledby="materials-title">
  <div class="wrap">
    <h2 id="materials-title">Course materials</h2>
    <p>${esc(materials.intro)}</p>
    <div class="resource-groups">
      ${join(materials.groups, (g) => `<div class="resource-group">
        <h3>${esc(g.title)}</h3>
        <ul class="resources">${join(g.items, item)}</ul>
      </div>`)}
    </div>
    ${platform ? `<aside class="platform${platform.media ? ' has-media' : ''}" aria-labelledby="platform-title">
      ${platform.media ? `<figure class="platform-figure">${mediaTag(platform.media, 'platform-media')}<figcaption>${esc(platform.media.caption || '')}</figcaption></figure>` : ''}
      <div class="platform-body">
      <h3 id="platform-title">${esc(platform.title)}</h3>
      <p>${esc(platform.text)}</p>
      <p class="inline-links">${platform.links.map((l) => `<a ${linkAttrs(l.url)}>${esc(l.label)} ${icons.external}</a>`).join(' ')}</p>
      </div>
    </aside>` : ''}
  </div>
</section>`;
}

function renderTeam(data) {
  const { people, site } = data;
  return `<section class="section" id="team" aria-labelledby="team-title">
  <div class="wrap">
    <h2 id="team-title">Team</h2>
    <h3>${esc(people.teaching.title)}</h3>
    <ul class="people">${join(people.teaching.people, personCard)}</ul>
    <h3>${esc(people.facultySponsor.title)}</h3>
    <ul class="people">${join(people.facultySponsor.people, personCard)}</ul>
    <p class="muted small">${esc(people.facultySponsor.note)}</p>
    <h3>${esc(people.community.title)}</h3>
    <p>${esc(people.community.intro)}</p>
    <ul class="people">${join(people.community.people, personCard)}</ul>
    <p>${esc(people.community.join)} <a ${linkAttrs(site.links.discord)}>Join the HBRN Discord ${icons.external}</a></p>
  </div>
</section>`;
}

function renderProgress(data) {
  const { progress } = data;
  const entries = progress.entries.filter((e) => e.published !== false);
  const media = (m) => {
    if (!m) return '';
    if (m.type === 'video') {
      return `<video class="progress-media" controls muted loop playsinline preload="none" poster="${esc(m.poster)}" width="${esc(m.width)}" height="${esc(m.height)}" aria-label="${esc(m.alt)}">
        <source src="${esc(m.src)}" type="video/mp4">
        <a href="${esc(m.src)}">Download the video</a>
      </video>`;
    }
    return `<img class="progress-media" src="${esc(m.src)}" alt="${esc(m.alt)}" width="${esc(m.width)}" height="${esc(m.height)}" loading="lazy" decoding="async">`;
  };
  return `<section class="section" id="progress" aria-labelledby="progress-title">
  <div class="wrap">
    <h2 id="progress-title">Progress</h2>
    <p>${esc(progress.intro)}</p>
    <ul class="legend" aria-label="Status labels">
      ${join(progress.legend, (l) => `<li>${statusPill(l.status, l.label)} <span class="muted">${esc(l.text)}</span></li>`)}
    </ul>
    <ol class="progress-list">
      ${join(entries, (e) => `<li class="progress-entry${e.media ? ' has-media' : ''}" id="${esc(e.id)}">
        ${e.media ? `<figure class="progress-figure">${mediaTag(e.media, 'progress-media')}<figcaption class="visually-hidden">${esc(e.title)}</figcaption></figure>` : ''}
        <div class="progress-body">
          <p class="progress-meta">${statusPill(e.status)}${e.tag ? ` <span class="status status-tag">${esc(e.tag)}</span>` : ''}${e.dateDisplay ? ` <span class="muted">${esc(e.dateDisplay)}</span>` : ''}</p>
          <h3 class="progress-title">${esc(e.title)}</h3>
          <p>${esc(e.text)}</p>
          ${e.framing ? `<p class="muted small">${esc(e.framing)}</p>` : ''}
          ${e.attribution ? `<p class="attribution">${esc(e.attribution)}</p>` : ''}
        </div>
      </li>`)}
    </ol>
    ${progress.gallery && progress.gallery.items && progress.gallery.items.length ? `<div class="gallery-block" id="gallery">
      <h3>${esc(progress.gallery.title)}</h3>
      <p>${esc(progress.gallery.intro)}</p>
      <ul class="gallery">
        ${join(progress.gallery.items, (g) => `<li class="gallery-item">
          <figure>
            ${mediaTag(g.media, 'gallery-media')}
            <figcaption>
              <span class="gallery-title">${esc(g.title)}</span>${g.tag ? ` <span class="status status-tag">${esc(g.tag)}</span>` : ''}
              <span class="gallery-caption">${esc(g.caption)}</span>
              ${g.attribution ? `<span class="attribution">${esc(g.attribution)}</span>` : ''}
            </figcaption>
          </figure>
        </li>`)}
      </ul>
    </div>` : ''}
  </div>
</section>`;
}

function renderHbrn(data) {
  const { site } = data;
  const h = site.hbrn;
  return `<section class="section" id="hbrn" aria-labelledby="hbrn-title">
  <div class="wrap">
    <h2 id="hbrn-title">About the Homebrew Robotics Network</h2>
    <div class="hbrn">
      <picture class="hbrn-logo">
        ${h.logoWebp ? `<source srcset="${esc(h.logoWebp)}" type="image/webp">` : ''}
        <img src="${esc(h.logo)}" alt="Homebrew Robotics Network logo: a robot hand raising a mug" width="160" height="160" loading="lazy" decoding="async">
      </picture>
      <div>
        <p>${esc(h.relationship)}</p>
        <p>${esc(h.blurb)}</p>
        <h3>What comes next</h3>
        <p>${esc(h.next)}</p>
        <p class="inline-links"><a ${linkAttrs(site.links.hbrnSite)}>HBRN website ${icons.external}</a> <a ${linkAttrs(site.links.discord)}>Discord ${icons.external}</a> <a ${linkAttrs(site.links.hbrnGithub)}>GitHub ${icons.external}</a></p>
      </div>
    </div>
  </div>
</section>`;
}

function renderContact(data) {
  const { site } = data;
  const c = site.contact.course;
  return `<section class="section section-contact" id="contact" aria-labelledby="contact-title">
  <div class="wrap">
    <h2 id="contact-title">Contact</h2>
    <p>Questions about the course: <a href="${esc(mailto(c.email, c.subject))}">${esc(c.name)} (${esc(c.email)})</a>. ${esc(site.status.registration.note)}</p>
    <p>Interested in supporting the course with hardware, tools, or funding? <a href="sponsor.html">See how to sponsor ${icons.arrow}</a></p>
  </div>
</section>`;
}

function renderIndex(data) {
  return [
    renderHero(data),
    renderFacts(data.course),
    renderLearn(data.course),
    renderSchedule(data),
    renderMaterials(data),
    renderTeam(data),
    renderProgress(data),
    renderHbrn(data),
    renderContact(data)
  ].join('\n');
}

module.exports = { renderIndex, personCard };
