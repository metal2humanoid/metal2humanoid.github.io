# Handoff: confirmations and missing assets

Status at handoff (October 21, 2026): the site is live at https://metal2humanoid.github.io (repository made public and Pages enabled on your instruction). Everything below is either a fact to confirm or an asset to supply. None of it blocks publication; the public pages read coherently with these items pending.

## 1. Confirm before or soon after launch

- [ ] **Approval status wording.** The site says "proposed … pending departmental approval; meeting times and rooms are provisional." Update `site.json → status.approvalNote` and the `Provisional` notes in `course.json` once EECS approves and rooms are assigned.
- [ ] **Rooms and times.** `schedule.json → location`, `meetings`, and `course.json → facts` still say TBD / provisional. Office-hour time is "to be arranged."
- [ ] **Registration link.** No real destination exists, so no registration button is shown. When one exists, set `site.json → status.registration` (`open`, `url`, `label`).
- [ ] **Contact addresses.** Course and sponsor contact both point to Willie McClinton (wbm3@mit.edu), as requested. Change in one place: `site.json → contact`.
- [ ] **Instructor roles.** Ben Zandonati is listed as "Co-instructor; course proposer" (no longer "lead instructor"), Willie McClinton and Seth Robles as co-instructors, James Kim as co-instructor and hardware laboratory instructor. The syllabus PDF on the site still reads "Course proposer and lead instructor" for Ben; regenerate the PDF or accept the difference. The EECS proposal form requires the proposer to be the course leader and principal lecturer, so check the wording against what was submitted.
- [ ] **Seth Robles' link.** His entry links to his MIT School of Engineering profile (engineering.mit.edu/people/seth-robles). That page lists him under Mechanical Engineering; the site shows only "MIT", per your instruction not to add a department.
- [ ] **Rob Britton.** Added to Community contributors from the LinkedIn profile you supplied: "Fractional CTO; Founder and CEO, Sovernus", role "Homebrew Robotics Network contributor", LinkedIn link. Confirm the role wording and that he wants to be listed; no photo was available without a LinkedIn login.
- [ ] **Emails shown on the Team section.** MIT addresses for Ben, Willie, and Seth are displayed because the public syllabus lists them. James Kim's personal Gmail is on record but hidden (`showEmail: false`); flip it only with his OK. The syllabus PDF on the site does contain all four addresses.
- [ ] **Ben Zandonati's link.** His personal site (benzandonati.co.uk, listed on the MIT LIS group page) returned 404 at build time, so his entry has no link. Add a preferred URL to `people.json` when available.
- [ ] **Name spelling.** The faculty sponsor is written "Tomás Lozano-Pérez" (as on his MIT homepage); the syllabus omits the accents. Pick one and keep it consistent.
- [ ] **@clauses entry.** Listed by Discord handle with the role "Homebrew Robotics Network team" (the old site listed the handle under Team with no title). Confirm preferred public name, role wording, and links.
- [ ] **Simulation videos.** Two short MuJoCo clips (Berkeley Humanoid Lite stand and walk policies, from the `standwalk` training work, October 2026) appear under Progress, labelled "Simulation" and attributed to Willie McClinton with the BHL model credited under CC BY-SA 4.0. Confirm you are happy to show them publicly and that the captions (PPO, 50 Hz position targets to a PD controller, forward velocity command) are accurate.
- [ ] **Discord invite.** `https://discord.gg/jGWZzaQwqt` (from the old site) appeared to resolve to the HBRN server at build time; confirm it is set to never expire.
- [ ] **HBRN relationship sentence.** `site.json → hbrn.relationship` currently reads: "Metal2Humanoid is organized by its instructors together with members of the Homebrew Robotics Network (HBRN), the builder community behind the initiative." Edit as needed.
- [ ] **License for the site and course materials.** No LICENSE file was added because that is the organizers' decision. The reference course site uses CC BY-NC-SA for content; the HBRN course repository has no license file either.

## 2. Assets to supply (all optional; the site degrades gracefully without them)

- [ ] **Headshots.** Found online and added, so each person should confirm they are happy with the choice: Ben Zandonati (MIT LIS group page; only 135 px, replace with a larger file when possible), Tomás Lozano-Pérez (MIT LIS group page headshot), Seth Robles (MIT School of Engineering profile photo), Willie McClinton (USF College of Engineering news photo from 2020). Still initials: James Kim, Rob Britton, @clauses. Drop square files (≥ 400 px) in `assets/img/people/` and set `photo` in `people.json`.
- [ ] **Pilot evidence (University of Miami).** Photos or a short video of the Berkeley Humanoid Lite legs standing, with date and photographer, plus consent from Ahmed and Zara if they appear. A slot exists in `progress.json` (`lab-robot-photos-willie`, `published: false`); the pilot text entry is already live and framed as reported status.
- [ ] **@clauses project videos.** Verified public links (YouTube or similar) with dates and one-line captions. Slot: `community-videos-clauses`.
- [ ] **Arm-building work (community contributor).** Public handle, consent, dates, photos or video. Slot: `arm-build-bot`. Nothing about this contributor is published now.
- [ ] **Actuator tests, limb assembly, kit preparation.** Add entries as they are documented (photos, bench videos, short captions). The "before January" goal entry can be replaced with real results.
- [ ] **Sponsor logos and approved outbound URLs** (with any sponsor-supplied tracking parameters) once sponsors are confirmed: `sponsors.json → confirmed`, logos in `assets/img/sponsors/`.
- [ ] **Renders and simulation clips (added).** The hero, the four stage cards, the hardware-platform box, and the gallery now use renders of the Berkeley Humanoid Lite design made from its published files (CC BY-SA 4.0) and MuJoCo clips from the standwalk training work (Berkeley Humanoid Lite, Asimov v0, Roboto Origin, and the Asimov-plus-BHL composite). Every caption says render or simulation and credits the model licenses. Check the captions, and replace renders with real build photos as they become available. Do not substitute stock or generated imagery.

## 3. Public resource URLs still pending

All of these render as "Coming soon" until a URL is entered:

- [ ] Slides, notes, and recordings for Lectures 1–8 (`schedule.json → weeks[].sessions[].materials`).
- [ ] Lab instructions and code for Labs 1–4.
- [ ] Assignment notebooks 1–4 (`materials` on each week's `assignment`, and the Materials section).
- [ ] Course-specific assembly notes and kit checklists; course kit bill of materials.
- [ ] Simulation environment setup guide.
- [ ] Course repository: https://github.com/hbrnetwork/metal2humanoid is linked as "in progress." Make sure nothing private is pushed there before pointing students at it.

Draft material that exists but was **not** published: the `iap/` homework notebooks and lab `.mdx` drafts in the private copy of the old site repository, and the earlier ten-lecture "Metal2Humanoid Textbook" PDFs. Review, adapt to the eight-lecture IAP structure, and publish through the data files when ready.

## 4. Source discrepancies (syllabus scope was kept)

- **Robot scope.** The planning document discusses a larger and more capable robot than the syllabus describes. The syllabus describes assembling and testing components of a Berkeley Humanoid Lite–based robot, with lower-body integration and supported tests in Week 3 and system integration in Week 4; untethered walking and manipulation are stretch goals. The site follows the syllabus. Do not promote planning targets to the site until they are built and documented.
- **Internal timeline and milestone dates** from the planning document are not published anywhere on the site.
- **Budget figures, prospect lists, and outreach notes** from the planning document are not published. The sponsor page lists needs and benefits only; it names no amounts, tiers, tax status, hiring access, exclusivity, or fundraising progress.
- **Old site collaborator logos** (Menlo Research, Hugging Face, LeRobot, MIT) were not carried over: their current relationship to the IAP course is unverified, and an MIT logo would imply institutional endorsement. Re-add any of them only as a confirmed sponsor or collaborator with permission.
- **Old site hardware PDFs** (`hml/` chapters of "Humanity's Last Machine", authored by Sourish Jasti, Zoey Tang, Intel Chen, and Vishnu Mano, supported by RoboStrategy) are third-party material. Redistribution rights are unverified and no public canonical URL was found, so they were not copied to the new site. If you have permission and a source link, add them to `materials.json` as an external resource with that attribution; do not present them as course notes.
- **Comparative claims** from the planning document (for example about other robots' capabilities) were left out.
- **Lecture topic split.** Each week's two lecture titles and sub-topics on the schedule are a reasonable split of the syllabus wording and are marked provisional.

## 5. Repository and infrastructure notes

- **Stray git repository in the parent folder.** `~/Documents/GitHub/.git` is a repository whose remote also points at `metal2humanoid/metal2humanoid.github.io` (it holds the original "first commit"). It was left untouched. This project now has its own `.git` inside `metal2humanoid.github.io/`, which is what was pushed. You may want to delete or re-point the parent `.git` so that `git` commands run from `~/Documents/GitHub` do not confuse the two.
- **GitHub Pages is live.** On October 21, 2026, at your request, the repository was switched from private to public and Pages was enabled (deploy from `main`, root) using the GitHub token stored in your macOS keychain. Everything committed here is public, including this file.
- **Rebuild workflow.** `.github/workflows/build.yml` regenerates the HTML when `data/` or `src/` change, but the organization's Actions policy currently gives workflow tokens read-only access (the repository-level setting cannot override it), so the commit step fails with a clear message. Either allow write permissions under Organization settings → Actions → General → Workflow permissions, or keep running `node build.js` locally before committing.
- **No analytics or third-party scripts** are included. Add any tracking only with a privacy notice.
