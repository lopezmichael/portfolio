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
// PAGE BUDGET — every variant must stay 2 pages. "Earlier Leadership & Policy
// Experience" forces a break, so page 1 holds the header, summary, and all CPAL
// experience. This script MEASURES each variant and FAILS if one overflows,
// rather than silently emitting a 3-page resume. If a variant overflows, cut a
// bullet from that variant's tags, prefer ones already covered in Selected
// Projects. Run with --measure to see current headroom.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
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

const root = '/Users/michaellopez/repos/lopezmichael-web';
const fdir = path.join(root, 'node_modules/@fontsource/inter/files');
const b64 = (f) => fs.readFileSync(path.join(fdir, f)).toString('base64');
const f400 = b64('inter-latin-400-normal.woff2');
const f500 = b64('inter-latin-500-normal.woff2');
const f600 = b64('inter-latin-600-normal.woff2');
const f700 = b64('inter-latin-700-normal.woff2');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- variant selection ---
const argv = process.argv.slice(2);
const arg = (name) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=')[1] : undefined;
};
const MEASURE = argv.includes('--measure');
if (argv.includes('--list')) {
  for (const v of VARIANTS) console.log(`${v.padEnd(12)} ${variantMeta[v].label}`);
  process.exit(0);
}
const requested = arg('variant');
if (requested && !VARIANTS.includes(requested)) {
  console.error(`Unknown variant "${requested}". Known: ${VARIANTS.join(', ')}`);
  process.exit(1);
}
const targets = requested ? [requested] : VARIANTS;

// --- data derived from src/data/resume.ts ---
const cpalRoles = allExperience.filter((r) => r.group === 'cpal');
const earlier = allExperience
  .filter((r) => r.group === 'earlier' && r.inPrint !== false)
  .map((e) => ({
    title: e.title,
    company: e.company,
    dates: e.printDates ?? e.dates,
    line: e.printLine ?? '',
  }));

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
  return order
    .map((label) => skills.find((s) => s.label === label))
    .filter(Boolean)
    .filter((s) => !s.variants || s.variants.includes(variant));
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

const projHtmlFor = (variant) => projectsFor(variant).map((p) => `<li><span class="p-name">${esc(p.name)}${p.tag ? ` <span class="p-tag">${esc(p.tag)}</span>` : ''}.</span> ${esc(p.desc)}</li>`).join('');

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
h2.page-break{break-before:page;page-break-before:always;margin-top:0;padding-top:2px;}
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

  <h2 class="page-break">Earlier Leadership &amp; Policy Experience</h2>
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
let failed = false;

for (const variant of targets) {
  const meta = variantMeta[variant];
  const page = await browser.newPage();
  await page.setViewportSize({ width: PRINT_W, height: Math.round(AVAIL) });
  await page.setContent(htmlFor(variant), { waitUntil: 'load' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(async () => { await document.fonts.ready; });

  // Measure the two forced-break sections before committing to a PDF.
  const fill = await page.evaluate(() => {
    const brk = document.querySelector('h2.page-break');
    const p1 = brk.getBoundingClientRect().top + window.scrollY;
    return { p1, p2: document.body.getBoundingClientRect().height - p1 };
  });
  const over1 = fill.p1 - AVAIL;
  const over2 = fill.p2 - AVAIL;
  const fmt = (used, over) =>
    `${Math.round(used)}/${Math.round(AVAIL)}px ` +
    (over > 0 ? `OVERFLOW +${Math.round(over)}px` : `(${Math.round(-over)}px headroom)`);

  console.log(`\n${variant} — ${meta.label}`);
  console.log(`  page 1: ${fmt(fill.p1, over1)}`);
  console.log(`  page 2: ${fmt(fill.p2, over2)}`);

  if (over1 > 0 || over2 > 0) {
    console.error(`  ✗ ${variant} exceeds 2 pages. Cut a bullet tagged '${variant}' (prefer ones already in Selected Projects).`);
    failed = true;
    await page.close();
    continue;
  }

  if (!MEASURE) {
    const out = path.join(root, `public/files/Michael_Lopez_Resume${meta.fileSuffix}.pdf`);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await page.pdf({
      path: out,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.5in', bottom: '0.45in', left: '0.6in', right: '0.6in' },
    });
    console.log(`  wrote ${path.relative(root, out)}`);
  }
  await page.close();
}

await browser.close();
if (failed) process.exit(1);
