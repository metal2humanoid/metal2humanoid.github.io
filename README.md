# Metal2Humanoid website

Public site for **Metal2Humanoid: Building a Humanoid Robot from the Ground Up**, a proposed non-credit MIT IAP 2027 course and open robotics education initiative of the Homebrew Robotics Network (HBRN).

Live site: https://metal2humanoid.github.io

The site is static HTML generated from JSON data files by a dependency-free Node script, so people, schedule, materials, progress updates, and sponsors can be updated without touching layout code.

## Layout

```
data/           Content, one JSON file per concern (edit these)
  site.json       name, description, navigation, contact emails, status flags, HBRN copy, footer
  course.json     facts, intro copy, what students learn, outcomes
  schedule.json   meeting times and the four weekly tables (sessions, topics, material links)
  materials.json  resource groups for the Materials section
  people.json     teaching team, faculty sponsor, community contributors
  progress.json   progress entries with status labels and media
  sponsors.json   sponsor page copy and the list of confirmed sponsors
src/            Templates (JavaScript functions that return HTML) and the SVG diagram
assets/         css/, img/, video/, docs/ (syllabus PDF)
build.js        node build.js  → writes index.html, sponsor.html, 404.html
tools/          make-og.js (social-sharing image), see below
index.html, sponsor.html, 404.html   Generated. Do not edit by hand.
```

## Local development

Requires Node 18 or newer. There are no packages to install.

```bash
node build.js                 # regenerate the pages from data/ and src/
python3 -m http.server 8000   # preview at http://localhost:8000
node build.js --check         # exit 1 if the committed pages are stale
```

The build validates the data (status values, dates, required fields) and fails if any internal link or asset path points at a missing file, so a typo in a path cannot ship as a broken link.

## Updating content

Edit the relevant file in `data/`, run `node build.js`, and commit the data **and** the regenerated HTML. If you edit a data file directly on GitHub, the workflow in `.github/workflows/build.yml` rebuilds the pages and commits them for you; pull before making further local changes.

Conventions used throughout the data files:

- **Unreleased material** is a `null` link (schedule) or `"status": "coming"` (materials). It renders as plain "Coming soon" text, never as a dead link. Replace with a real URL when the item is published.
- **Status values.** Materials: `available`, `coming`, `in-progress`, `external`. Progress: `demonstrated`, `in-progress`, `goal`. The build rejects anything else.
- **Provisional facts.** Course facts can carry a `note` (for example `"Provisional"`) that renders as a small label.
- **Registration.** `site.json → status.registration`: set `open` to `true` and provide a `url` only when a real registration destination exists; until then the status note is shown with the contact email.
- **Contact addresses** live only in `site.json → contact` (`course` and `sponsor`). Every mailto link on the site is derived from them.
- **People.** `photo` is a path under `assets/img/people/` or `null` (initials are shown). `links` should be verified public pages. `showEmail` hides an address without deleting it. Community contributors are listed by public handle; do not add names, titles, or roles the person has not confirmed.
- **Progress entries** need caption-quality `text` and an `attribution`. `published: false` keeps a slot in the file without rendering it. Label simulation results as simulation (`tag`).
- **Sponsors.** `sponsors.json → confirmed` lists confirmed sponsors only: `{ "name", "kind": "financial" | "in-kind" | "mentorship", "url", "logo", "note" }`. Logos go in `assets/img/sponsors/` (SVG or PNG, about 400 px wide). `url` is emitted verbatim, so a sponsor's own tracking parameters can be included. Faculty sponsorship stays in `people.json` and is never listed here.
- **Site base path.** For a project-page deployment under `https://<org>.github.io/<repo>/`, set `"basePath": "/<repo>"` and `siteUrl` in `site.json`. Internal links are relative, so the pages work under any subpath; `basePath` is used for canonical URLs, the social image, and the 404 page.

### Adding photos and video

Put files under `assets/img/` or `assets/video/` and reference them from the data. Keep images at or below about 1600 px wide and use JPEG or WebP for photographs. For video, use a short H.264 MP4 with a poster image; the template lazy-loads video (`preload="none"`) and never autoplays.

```bash
ffmpeg -i input.mp4 -an -vf "scale=960:-2,format=yuv420p" -c:v libx264 -crf 25 -preset slow -movflags +faststart assets/video/clip.mp4
ffmpeg -ss 1 -i assets/video/clip.mp4 -frames:v 1 -q:v 3 assets/img/clip-poster.jpg
```

Every asset needs a meaningful caption, a date if known, and attribution. Third-party material (for example Berkeley Humanoid Lite files, CC BY-SA 4.0) must keep its attribution and license.

### Social-sharing image

`assets/img/og-image.png` (1200×630) is a typographic card generated from the data. To regenerate after changing the title, eyebrow, or stages:

```bash
node tools/make-og.js /tmp/og/og.html
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --screenshot=/tmp/og/og.png --window-size=1200,630 file:///tmp/og/og.html
# optimize (optional) and copy to assets/img/og-image.png
```

Any browser or tool that can render HTML at 1200×630 works.

## Deployment

The repository is an organization site (`metal2humanoid.github.io`), so GitHub Pages serves the `main` branch root as is. The `.nojekyll` file disables Jekyll processing. The repository must be **public** for Pages to publish on a free organization plan (a private repository shows "Site not found"). After pushing, the site updates within a few minutes.

If Pages is configured to deploy from a different branch or folder, either change it back to `main` / root in the repository settings or build into that folder.

The rebuild workflow needs "Read and write permissions" for workflow tokens (repository settings → Actions → General → Workflow permissions). If that is not allowed by the organization, run `node build.js` locally and commit the output instead; the site still deploys.

## Design notes

- Light background, dark type, one copper accent; system font stack (no font or script downloads, no analytics).
- Semantic HTML with a skip link, landmark regions, keyboard-accessible menu, visible focus states, labelled tables that reflow into cards below 640 px, and `alt`/caption text for media.
- The progression diagram (Motor → Actuator → Motion → Learning → Humanoid) is inline SVG generated in `src/svg.js`; a vertical variant is shown on narrow screens.

## Attribution

- Berkeley Humanoid Lite is a project of the Hybrid Robotics group at UC Berkeley (software MIT License, hardware CC BY-SA 4.0). The simulation videos on the Progress section render its robot model and credit it accordingly.
- The Homebrew Robotics Network logo belongs to HBRN.
