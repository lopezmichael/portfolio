// Generates public/files/Michael_Lopez_Resume.pdf — a designed, ATS-friendly
// resume rendered with Playwright (real selectable text, embedded Inter).
// Run: `npm run resume:pdf` (needs `npx playwright install chromium`).
// NOTE: the data below MIRRORS src/data/resume.ts. It is NOT auto-synced —
// if you edit resume.ts, update the arrays here and re-run this script.
//
// PAGE BUDGET (measured 2026-07-27) — this resume must stay 2 pages.
// "Earlier Leadership & Policy Experience" forces a break, so:
//   page 1 = header + summary + all CPAL experience  → 950px used of 965px (15px headroom)
//   page 2 = earlier roles + skills + education + projects + media → 770px of 965px
// Page 1 has room for roughly ONE more line. Adding a bullet there will push the
// resume to 3 pages. If you add one, cut one. The print version is deliberately
// leaner than src/data/resume.ts (the web version has no page constraint), so
// prefer dropping bullets already covered in Selected Projects.
// To re-measure: copy this file, replace the page.pdf() call with a
// getBoundingClientRect() probe on h2.page-break at viewport width (8.5-1.2)*96.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const root = '/Users/michaellopez/repos/lopezmichael-web';
const fdir = path.join(root, 'node_modules/@fontsource/inter/files');
const b64 = (f) => fs.readFileSync(path.join(fdir, f)).toString('base64');
const f400 = b64('inter-latin-400-normal.woff2');
const f500 = b64('inter-latin-500-normal.woff2');
const f600 = b64('inter-latin-600-normal.woff2');
const f700 = b64('inter-latin-700-normal.woff2');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// --- data (mirrors src/data/resume.ts) ---
const experience = [
  { title: 'Director, Data Operations', dates: 'Jan 2026 – Present', bullets: [
    "Lead CPAL's data platform migration to Databricks (Unity Catalog, Workflows, Lakebase + Lakehouse on AWS, Git-tracked orchestration), systematizing 35–40 pipelines from file-based storage onto unified cloud infrastructure",
    'Manage a 6-person external data engineering team via vendor partnership executing the internal data roadmap, alongside one full-time data engineer reporting directly to me',
    'Built AI-enabled team workflows (Claude Code with custom skills and agents, prompt caching with the Anthropic API), including multi-agent code review with independent verification, accelerating how we develop pipelines, write documentation, review code, and communicate with stakeholders',
    // Parcel-outreach bullet intentionally dropped from the print resume: it is
    // already covered in Selected Projects and page 1 is height-constrained.
    'Maintain the eviction data workstream across four North Texas counties (~48,000 Dallas filings in 2025), feeding 12+ partners daily including the Dallas Eviction Advocacy Center and the Princeton Eviction Lab',
  ]},
  { title: 'Director, Data', dates: 'May 2023 – Dec 2025', bullets: [
    "Built CPAL's data function from the ground up; led hiring for the org's first data engineer and prior analyst roles",
    'Led the data org through the CDO transition (Dec 2024 to Dec 2025): set department roadmap, hiring, vendor strategy, and budget, reporting directly to the CTO',
    "Directed CPAL's citywide risk terrain modeling through 2024; division-level findings informed Office of Integrated Public Safety Solutions deployment and drove blight-remediation site selection and neighborhood amenity construction",
    "Modeled Dallas's rental supply gap for CPAL's annual Rental Housing Needs Assessment (2023–2024): a 33,660-unit shortfall at or below 50% AMI, projected to 83,500 by 2030",
    'Oversaw a 30+ app R Shiny suite informing decisions across housing, public safety, maternal health, benefits delivery, and criminal justice',
    'Evaluated and selected the enterprise tooling stack: Databricks (over Snowflake / dbt-Cloud after a capacity assessment), Claude Enterprise org-wide, vendor data feeds (MySidewalk, DataAxle)',
  ]},
  { title: 'Manager, Data', dates: 'May 2022 – May 2023', bullets: [
    "Ran CPAL's citywide risk terrain modeling on Dallas PD incident data joined to Data Axle property and business records (SIMSI), producing division-level environmental risk surfaces to target place-based violence prevention",
    'Led development of R Shiny applications, shifting the organization toward interactive data products',
    // northtexasevictions.org bullet dropped here — already in Selected Projects.
    'Mentored analytics interns; one was subsequently hired as a full-time analyst',
  ]},
  { title: 'Associate, Data', dates: 'Jun 2020 – Apr 2022', bullets: [
    'Created the initial eviction data pipeline in R, laying the groundwork for the system now serving four counties',
    'Built the Community Resource Explorer, indexing community-resource access within two miles of every Dallas school campus to find the least-resourced neighborhoods; helped define disbursement of a $1.25B bond package',
    'Developed dashboards and reports in R, QGIS, Tableau, and ArcGIS for internal teams and community partners',
  ]},
];

const earlier = [
  { title: 'Health & Social Policy Intern', company: 'Children at Risk', dates: 'Jun 2019 – Aug 2019', line: 'Led policy research on early childhood development and developed policy briefs for senior leadership and state stakeholders.' },
  { title: 'Research Coordinator', company: 'University of Texas at Dallas', dates: 'Aug 2016 – Dec 2018', line: 'Managed the Developmental Neurolinguistics Lab; recruited, trained, and supervised 10–15 research assistants each semester and 300+ participants.' },
];

const education = [
  { degree: 'Master of Public Policy', school: 'University of Texas at Dallas' },
  { degree: 'B.A., Psychology & Anthropology', school: 'Florida International University', year: '2015' },
];

const skills = [
  { label: 'Analysis & Languages', items: ['R (tidyverse, sf, Shiny)', 'SQL', 'Python', 'TypeScript'] },
  { label: 'Visualization & Geospatial', items: ['R Shiny', 'Tableau', 'Highcharts', 'Mapbox GL', 'Spatial SQL', 'QGIS', 'ArcGIS'] },
  { label: 'Data Platform', items: ['Databricks (Lakehouse + Unity Catalog)', 'PostgreSQL / Neon', 'DuckDB', 'Polars', 'PostGIS', 'CKAN'] },
  { label: 'AI Workflows', items: ['Claude Code (custom skills & agents)', 'Anthropic API', 'Google Cloud Vision (OCR)'] },
  { label: 'Orchestration & Infra', items: ['Terraform', 'GitHub Actions', 'Docker', 'AWS', 'Vercel', 'Prefect', 'Structured logging'] },
  { label: 'Methods', items: ['Risk Terrain Modeling', 'Index Construction & PCA', 'Spatial Analysis', 'Needs Assessment & Supply Modeling'] },
  { label: 'Domains', items: ['Housing & Eviction', 'Public Safety', 'Criminal Justice', 'Maternal Health', 'Benefits Delivery', 'Community Development'] },
];

const projects = [
  { name: 'Dallas County Eviction Data', desc: 'Daily eviction-filing feed reaching 12+ legal-aid and outreach partners; ~48,000 Dallas filings a year turned into tenant outreach.' },
  { name: 'DigiLab', desc: 'Community-sourced tournament data platform for the global Digimon TCG scene; 5,000+ tournaments logged in six months, with regional meta analysis players use to prep.', tag: 'digilab.cards' },
  { name: 'Parcel Block Walking Tool', desc: 'Field-outreach tool flagging homes likely missing a homestead exemption; ~20 active field-team users across outreach partners.' },
  // NOTE: Rental Housing Needs Assessment and Community Resource Explorer are
  // intentionally NOT listed here — both already appear as experience bullets,
  // and the print resume is page-constrained. They ARE listed in src/data/resume.ts
  // for the web version, which has no such constraint.
  { name: 'North Texas Evictions', desc: 'Public-facing eviction data transparency dashboard for Dallas County.', tag: 'northtexasevictions.org' },
];

const media = [
  { outlet: 'The Lab Report', title: 'Data visualizations for Dallas homeless-enforcement and patrol-staffing analyses (2026)' },
  { outlet: 'D Magazine', title: "“The Lawyer Who Landlords Don’t Want to See in Court” (2024)" },
  { outlet: 'KERA News', title: '“Eviction less likely for Dallas County tenants who get a lawyer” (2024)' },
];

// contour paths (echoes the site OG / hero terrain motif)
const contour = `
  <path d="M0 34 Q120 22 240 30 T480 26 T720 34 T960 28 T1000 32" />
  <path d="M0 58 Q140 46 280 54 T560 50 T840 58 T1000 54" />
  <path d="M0 82 Q100 72 220 78 T460 74 T700 82 T940 76 T1000 80" />`;

// --- render helpers ---
const roleHtml = experience.map((e) => `
  <div class="role">
    <div class="role-head"><span class="role-title">${esc(e.title)}</span><span class="dates">${esc(e.dates)}</span></div>
    <ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  </div>`).join('');

const earlierHtml = earlier.map((e) => `
  <div class="earlier">
    <div class="role-head"><span class="e-title">${esc(e.title)}<span class="e-co">, ${esc(e.company)}</span></span><span class="dates">${esc(e.dates)}</span></div>
    <p class="earlier-line">${esc(e.line)}</p>
  </div>`).join('');

const skillsHtml = skills.map((c) => `
  <div class="skill-row">
    <div class="skill-label">${esc(c.label)}</div>
    <div class="chips">${c.items.map((i) => `<span class="chip">${esc(i)}</span>`).join('')}</div>
  </div>`).join('');

const eduHtml = education.map((e) => `<div class="edu-row"><span><strong>${esc(e.degree)}</strong>, ${esc(e.school)}</span>${e.year ? `<span class="dates">${esc(e.year)}</span>` : ''}</div>`).join('');

const projHtml = projects.map((p) => `<li><span class="p-name">${esc(p.name)}${p.tag ? ` <span class="p-tag">${esc(p.tag)}</span>` : ''}.</span> ${esc(p.desc)}</li>`).join('');

const mediaHtml = media.map((m) => `<li><strong>${esc(m.outlet)}:</strong> ${esc(m.title)}</li>`).join('');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
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

  <p class="summary">Data strategist and operations leader. Six years building the Child Poverty Action Lab's data function from the ground up: the team, the Databricks platform, and the tools that turn public and administrative data into decisions across housing, public safety, maternal health, and benefits delivery.</p>

  <h2>Experience</h2>
  <div class="company">Child Poverty Action Lab <span class="co-meta">DALLAS, TX · 2020 – PRESENT</span></div>
  <div class="spine">${roleHtml}</div>

  <h2 class="page-break">Earlier Leadership &amp; Policy Experience</h2>
  ${earlierHtml}

  <h2>Skills</h2>
  ${skillsHtml}

  <h2>Education</h2>
  ${eduHtml}

  <h2>Selected Projects</h2>
  <ul class="section-list">${projHtml}</ul>

  <h2>Selected Media</h2>
  <ul class="section-list">${mediaHtml}</ul>
</body></html>`;

const out = path.join(root, 'public/files/Michael_Lopez_Resume.pdf');
fs.mkdirSync(path.dirname(out), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(async () => { await document.fonts.ready; });
await page.pdf({ path: out, format: 'Letter', printBackground: true, margin: { top: '0.5in', bottom: '0.45in', left: '0.6in', right: '0.6in' } });
await browser.close();
console.log('wrote', out);
