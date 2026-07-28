// Generates designed, ATS-friendly resume PDFs with Playwright (real selectable
// text, embedded Inter).
//
//   npm run resume:pdf                    → all variants
//   npm run resume:pdf -- --variant=platform
//   npm run resume:pdf -- --measure       → report page fill, write nothing
//   npm run resume:pdf -- --list          → list variants
//
// SINGLE SOURCE OF TRUTH: all content comes from src/data/resume.ts, imported
// directly (Node strips TS types natively; verified on Node 25). There is no
// mirrored copy here anymore. Print-specific wording lives in the data as
// `print` overrides, and per-variant inclusion via `variants` / `only` tags.
// If you are on Node < 22.6 this import will fail; that is the only constraint.
//
// PAGE BUDGET — every variant must stay 2 pages. Each one is RENDERED and its
// pages COUNTED; the script fails rather than silently emitting a 3-page resume.
// If a variant overflows, cut a bullet tagged for it (prefer ones already
// covered in Selected Projects). Run with --measure to see remaining room.
//
// Content flows naturally across the two pages. There used to be a forced break
// before "Earlier Leadership & Policy Experience", which meant page 1 alone had
// to hold all CPAL experience — a strictly tighter constraint than "2 pages",
// and it left the default variant with 15px of slack while a fifth of page 2 sat
// empty. Removing it changed no output (the content already broke at that
// boundary) and returned ~12 lines of headroom. `break-inside: avoid` keeps
// roles and skill rows from splitting mid-element. To force a hard break again,
// add class="page-break" to a heading; the rule is still defined below.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  experience as allExperience,
  education,
  skills,
  skillOrder,
  selectedMedia,
  selectedProjects,
  variantMeta,
  VARIANTS,
  printBullets,
} from '../src/data/resume.ts';

// Resolve from this file rather than a hardcoded absolute path, so the script
// works from any clone or checkout location (the data import at the top of this
// file was already relative; the two disagreed).
const root = fileURLToPath(new URL('..', import.meta.url));
const fdir = path.join(root, 'node_modules/@fontsource/inter/files');
const b64 = (f) => fs.readFileSync(path.join(fdir, f)).toString('base64');
const f400 = b64('inter-latin-400-normal.woff2');
const f500 = b64('inter-latin-500-normal.woff2');
const f600 = b64('inter-latin-600-normal.woff2');
const f700 = b64('inter-latin-700-normal.woff2');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- variant selection ---
const argv = process.argv.slice(2);
const MEASURE = argv.includes('--measure');
if (argv.includes('--list')) {
  for (const v of VARIANTS) console.log(`${v.padEnd(12)} ${variantMeta[v].label}`);
  process.exit(0);
}

// Parse --variant strictly. A bare `--variant`, an empty `--variant=`, or a
// space-separated `--variant platform` used to fall through to "regenerate
// everything", which silently rewrote the default resume that /resume links to
// when the caller meant to touch exactly one file.
const die = (msg) => { console.error(msg); process.exit(1); };
let requested;
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === '--measure' || a === '--list') continue;
  if (a === '--variant') {
    die(`"--variant" needs a value: --variant=<${VARIANTS.join('|')}>` +
        (argv[i + 1] && !argv[i + 1].startsWith('--') ? ` (did you mean --variant=${argv[i + 1]}?)` : ''));
  }
  if (a.startsWith('--variant=')) {
    const value = a.slice('--variant='.length);
    if (!VARIANTS.includes(value)) {
      die(`Unknown variant ${JSON.stringify(value)}. Known: ${VARIANTS.join(', ')}`);
    }
    requested = value;
    continue;
  }
  die(`Unrecognized argument ${JSON.stringify(a)}. Usage: [--variant=<name>] [--measure] [--list]`);
}
const targets = requested ? [requested] : VARIANTS;

// --- data derived from src/data/resume.ts ---
// `inPrint: false` now excludes a role from print regardless of its group. It
// used to be consulted only on the `earlier` branch, so a `cpal` role marked
// inPrint:false would still have printed.
const inPrint = (r) => r.inPrint !== false;

for (const r of allExperience) {
  if (!r.group) {
    throw new Error(
      `Experience entry "${r.title}" has no \`group\`. Print needs 'cpal' or 'earlier'; ` +
      `an untagged role is silently dropped from every PDF.`
    );
  }
}

const cpalRoles = allExperience.filter((r) => r.group === 'cpal' && inPrint(r));
const earlier = allExperience
  .filter((r) => r.group === 'earlier' && inPrint(r))
  .map((e) => {
    // An included `earlier` role with no printLine used to render an empty
    // <p class="earlier-line"> under a real job title.
    if (!e.printLine) {
      throw new Error(
        `Earlier role "${e.title}" is included in print but has no \`printLine\`. ` +
        `Add one, or set \`inPrint: false\`.`
      );
    }
    return {
      title: e.title,
      company: e.company,
      dates: e.printDates ?? e.dates,
      line: e.printLine,
    };
  });

const experienceFor = (variant) =>
  cpalRoles
    .map((r) => ({
      title: r.title,
      dates: r.printDates ?? r.dates,
      bullets: printBullets(r, variant),
    }))
    .filter((r) => r.bullets.length > 0);

const skillsFor = (variant) => {
  const order = skillOrder[variant] ?? skills.map((s) => s.label);
  return order.map((label) => {
    const row = skills.find((s) => s.label === label);
    // skillOrder joins on hand-typed label strings. Silently dropping an
    // unresolved one deletes a whole skills row from the PDF, and the page
    // budget then passes MORE easily because the page got shorter — the
    // guardrail would confirm the bug. Fail loudly instead.
    if (!row) {
      throw new Error(
        `skillOrder.${variant} names "${label}", which is not a label in \`skills\`. ` +
        `Known labels: ${skills.map((s) => s.label).join(', ')}`
      );
    }
    return row;
  }).filter((s) => !s.variants || s.variants.includes(variant));
};

const projectsFor = (variant) =>
  selectedProjects
    .filter((p) => p.only !== 'web')
    .filter((p) => !p.variants || p.variants.includes(variant))
    .map((p) => ({ name: p.name, desc: p.print ?? p.description, tag: p.tag }));

const media = selectedMedia
  .filter((m) => m.only !== 'web')
  .map((m) => ({ outlet: m.outlet, title: m.print ?? `${m.title} (${m.date})` }));


// contour paths (echoes the site OG / hero terrain motif)
const contour = `
  <path d="M0 34 Q120 22 240 30 T480 26 T720 34 T960 28 T1000 32" />
  <path d="M0 58 Q140 46 280 54 T560 50 T840 58 T1000 54" />
  <path d="M0 82 Q100 72 220 78 T460 74 T700 82 T940 76 T1000 80" />`;

// --- render helpers ---
const roleHtmlFor = (variant) => experienceFor(variant).map((e) => `
  <div class="role">
    <div class="role-head"><span class="role-title">${esc(e.title)}</span><span class="dates">${esc(e.dates)}</span></div>
    <ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  </div>`).join('');

const earlierHtml = earlier.map((e) => `
  <div class="earlier">
    <div class="role-head"><span class="e-title">${esc(e.title)}<span class="e-co">, ${esc(e.company)}</span></span><span class="dates">${esc(e.dates)}</span></div>
    <p class="earlier-line">${esc(e.line)}</p>
  </div>`).join('');

const skillsHtmlFor = (variant) => skillsFor(variant).map((c) => `
  <div class="skill-row">
    <div class="skill-label">${esc(c.label)}</div>
    <div class="chips">${c.items.map((i) => `<span class="chip">${esc(i)}</span>`).join('')}</div>
  </div>`).join('');

const eduHtml = education.map((e) => `<div class="edu-row"><span><strong>${esc(e.degree)}</strong>, ${esc(e.school)}</span>${e.year ? `<span class="dates">${esc(e.year)}</span>` : ''}</div>`).join('');

// Print renders project descriptions as sentences, so it terminates them.
// This used to live in the data as `print` overrides that differed from the web
// copy by a trailing period and nothing else — three duplicated strings to keep
// in lockstep for one character. Punctuation is a rendering concern.
const sentence = (s) => (/[.!?]$/.test(s) ? s : `${s}.`);

const projHtmlFor = (variant) => projectsFor(variant).map((p) => `<li><span class="p-name">${esc(p.name)}${p.tag ? ` <span class="p-tag">${esc(p.tag)}</span>` : ''}.</span> ${esc(sentence(p.desc))}</li>`).join('');

const mediaHtml = media.map((m) => `<li><strong>${esc(m.outlet)}:</strong> ${esc(m.title)}</li>`).join('');

const htmlFor = (variant) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Inter';font-weight:400;src:url(data:font/woff2;base64,${f400}) format('woff2');}
@font-face{font-family:'Inter';font-weight:500;src:url(data:font/woff2;base64,${f500}) format('woff2');}
@font-face{font-family:'Inter';font-weight:600;src:url(data:font/woff2;base64,${f600}) format('woff2');}
@font-face{font-family:'Inter';font-weight:700;src:url(data:font/woff2;base64,${f700}) format('woff2');}
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Inter',system-ui,sans-serif;color:#2A2520;font-size:9.9pt;line-height:1.33;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
a{color:#8B2D3D;text-decoration:none;}

/* Header */
.header{position:relative;overflow:hidden;padding:2px 0 12px;margin-bottom:4px;border-bottom:2px solid #A04428;}
.header .contour{position:absolute;top:-6px;right:-10px;width:1000px;height:110px;opacity:.16;pointer-events:none;}
.header .contour path{fill:none;stroke:#A04428;stroke-width:1.4;stroke-linecap:round;}
.head-row{position:relative;display:flex;justify-content:space-between;align-items:flex-end;gap:20px;}
.name{font-size:25pt;font-weight:700;letter-spacing:-.6px;line-height:1;color:#2A2520;}
.tagline{font-size:10.5pt;font-weight:600;color:#8B2D3D;margin-top:4px;}
.contact{text-align:right;font-size:8.6pt;color:#5a4f45;line-height:1.5;}
.contact a{color:#5a4f45;}
.contact .c-loc{font-weight:600;color:#2A2520;}

.summary{font-size:9.9pt;margin:9px 0 2px;color:#332e28;}

/* Section headings */
h2{display:flex;align-items:center;gap:8px;font-size:9pt;font-weight:700;text-transform:uppercase;letter-spacing:1.4px;color:#8B2D3D;margin:13px 0 7px;}
/* Available if a hard break is ever wanted again: add class="page-break". */
h2.page-break{break-before:page;page-break-before:always;margin-top:0;padding-top:2px;}
/* Keep a role, an earlier entry, or a skill row from splitting across pages. */
.role,.earlier,.skill-row,.edu-row{break-inside:avoid;page-break-inside:avoid;}
/* Never strand a section heading at the bottom of a page. */
h2{break-after:avoid;page-break-after:avoid;}
h2::before{content:'';width:11px;height:11px;background:#A04428;border-radius:2px;flex:0 0 auto;}
h2::after{content:'';flex:1;height:1px;background:#e3c9a6;}

/* Experience — CPAL timeline spine */
.company{display:flex;align-items:baseline;gap:8px;font-size:11.5pt;font-weight:700;color:#2A2520;margin-bottom:2px;}
.company .co-meta{font-size:8.6pt;font-weight:500;color:#8a7d70;letter-spacing:.2px;}
.spine{border-left:2px solid #e3b98f;padding-left:15px;margin-left:5px;}
.role{position:relative;margin:7px 0 5px;}
.role::before{content:'';position:absolute;left:-19px;top:3.5px;width:7px;height:7px;border-radius:50%;background:#A04428;box-shadow:0 0 0 2px #fff;}
.role-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;}
.role-title{font-size:10pt;font-weight:700;color:#2A2520;}
.dates{font-size:8.4pt;font-weight:600;color:#8a7d70;white-space:nowrap;}
ul{margin:3px 0 0 14px;}
li{margin-bottom:2.5px;padding-left:2px;}
li::marker{color:#A04428;}

.earlier{margin:5px 0;}
.e-title{font-size:9.8pt;font-weight:700;color:#2A2520;}
.e-co{font-weight:500;color:#5a4f45;}
.earlier-line{font-size:9.3pt;color:#4a4038;margin-top:1px;}

/* Skills chips */
.skill-row{display:flex;gap:10px;margin-bottom:5px;align-items:baseline;}
.skill-label{flex:0 0 138px;font-size:9pt;font-weight:700;color:#2A2520;padding-top:1px;}
.chips{display:flex;flex-wrap:wrap;gap:4px;}
.chip{display:inline-block;background:#f7ead2;border:0.5px solid #e6cfa4;border-radius:9px;padding:1.5px 8px;font-size:8.4pt;font-weight:500;color:#4a3d30;}

.edu-row{display:flex;justify-content:space-between;margin-bottom:3px;font-size:9.9pt;}

.section-list{margin:0;list-style:none;}
.section-list li{font-size:9.4pt;margin-bottom:3.5px;padding-left:12px;position:relative;color:#332e28;}
.section-list li::before{content:'';position:absolute;left:0;top:5px;width:4px;height:4px;background:#A04428;border-radius:1px;}
.p-name{font-weight:700;color:#2A2520;}
.p-tag{font-weight:600;color:#8B2D3D;font-size:8.6pt;}
</style></head><body>

  <div class="header">
    <svg class="contour" viewBox="0 0 1000 110" preserveAspectRatio="none">${contour}</svg>
    <div class="head-row">
      <div>
        <div class="name">Michael Lopez</div>
        <div class="tagline">Data Strategist · Civic Tech & Social Impact</div>
      </div>
      <div class="contact">
        <div><span class="c-loc">Dallas, TX</span> · (305) 546-8721</div>
        <div><a href="mailto:michael@lopezstudio.dev">michael@lopezstudio.dev</a> · <a href="https://lopezmichael.dev">lopezmichael.dev</a></div>
        <div><a href="https://linkedin.com/in/michael-d-lopez">linkedin.com/in/michael-d-lopez</a> · <a href="https://github.com/lopezmichael">github.com/lopezmichael</a></div>
      </div>
    </div>
  </div>

  <p class="summary">${esc(variantMeta[variant].summary)}</p>

  <h2>Experience</h2>
  <div class="company">Child Poverty Action Lab <span class="co-meta">DALLAS, TX · 2020 – PRESENT</span></div>
  <div class="spine">${roleHtmlFor(variant)}</div>

  <h2>Earlier Leadership &amp; Policy Experience</h2>
  ${earlierHtml}

  <h2>Skills</h2>
  ${skillsHtmlFor(variant)}

  <h2>Education</h2>
  ${eduHtml}

  <h2>Selected Projects</h2>
  <ul class="section-list">${projHtmlFor(variant)}</ul>

  <h2>Selected Media</h2>
  <ul class="section-list">${mediaHtml}</ul>
</body></html>`;

const AVAIL = (11 - 0.5 - 0.45) * 96; // Letter height minus vertical margins
const PRINT_W = Math.round((8.5 - 1.2) * 96); // Letter width minus horizontal margins

const browser = await chromium.launch();
const MAX_PAGES = 2;
const BUDGET = MAX_PAGES * AVAIL;
const pdfOpts = {
  format: 'Letter',
  printBackground: true,
  margin: { top: '0.5in', bottom: '0.45in', left: '0.6in', right: '0.6in' },
};

// Count pages from the rendered bytes. Height alone is only an ESTIMATE: with
// break-inside:avoid, a role that will not fit at the bottom of a page moves
// wholly to the next one and leaves a gap, so total height can be under budget
// while the real document spills to 3 pages. Rendering first and counting is
// exact.
const pageCount = (buf) => (buf.toString('latin1').match(/\/Type\s*\/Page(?![s])/g) || []).length;

// PASS 1 — measure every requested variant before writing ANY of them.
// Writing as we go left a mixed state on failure: an overflowing default would
// stay stale on disk while the other two refreshed, and all three are tracked
// in git, so the stale one ships.
const measured = [];
let failed = false;

for (const variant of targets) {
  const meta = variantMeta[variant];
  const page = await browser.newPage();
  await page.setViewportSize({ width: PRINT_W, height: Math.round(AVAIL) });
  await page.setContent(htmlFor(variant), { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => { await document.fonts.ready; });

  // Render once, to a buffer, and count the pages that actually came out.
  const buf = await page.pdf(pdfOpts);
  const pages = pageCount(buf);
  const height = await page.evaluate(() => document.body.getBoundingClientRect().height);
  const slack = BUDGET - height;

  console.log(`\n${variant} — ${meta.label}`);
  console.log(
    `  ${pages} page${pages === 1 ? '' : 's'} · content ${Math.round(height)}/${Math.round(BUDGET)}px · ` +
    (slack >= 0 ? `~${Math.round(slack)}px (${Math.round(slack / 17.6)} lines) of room` : `over by ${Math.round(-slack)}px`)
  );

  if (pages > MAX_PAGES) {
    console.error(
      `  ✗ ${variant} renders ${pages} pages, max is ${MAX_PAGES}. ` +
      `Cut a bullet tagged '${variant}' (prefer ones already covered in Selected Projects).`
    );
    failed = true;
    await page.close();
    continue;
  }
  measured.push({ variant, meta, buf });
  await page.close();
}

// PASS 2 — all clear, so write. On failure nothing is written at all, leaving
// the previously-good PDFs on disk rather than a half-updated set.
await browser.close();

if (failed) {
  console.error(`\n✗ No PDFs written — fix the overflow above and re-run.`);
  process.exit(1);
}

if (!MEASURE) {
  for (const { variant, meta, buf } of measured) {
    const out = path.join(root, `public/files/Michael_Lopez_Resume${meta.fileSuffix}.pdf`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, buf);
    console.log(`  wrote ${path.relative(root, out)} (${variant})`);
  }
}
