/**
 * Resume variants for the print PDF. The web resume always shows everything.
 *
 *  - `playercoach` — built AND still build. Lead/Director at mid-size mission
 *    orgs, and the player-coach roles that dominate the actual search
 *    (CfA Data Science Manager, Ignite Reading Senior Analytics Manager).
 *  - `platform`    — Staff/Principal IC at larger orgs. Leads with the migration,
 *    pipelines, and modern stack; drops budget/vendor framing.
 *  - `research`    — evaluation shops, policy teams, research orgs. Leads with
 *    supply modeling, the bond-package index, RTM, and published analysis.
 *
 * Untagged bullets appear in EVERY variant, so tagging is additive.
 */
export type Variant = 'playercoach' | 'platform' | 'research';

export const VARIANTS: Variant[] = ['playercoach', 'platform', 'research'];

export interface Bullet {
  /** Canonical text. Used by the web resume, and by print unless `print` is set. */
  text: string;
  /** Tighter wording for the page-constrained print resume. */
  print?: string;
  /** Variants this belongs to. Omit for "all variants". */
  variants?: Variant[];
  /** Restrict to one medium. Omit for both. */
  only?: 'web' | 'print';
}

export type BulletInput = string | Bullet;

export interface Experience {
  title: string;
  company: string;
  dates: string;
  /** Compact dates for print (en dashes, abbreviated months). */
  printDates?: string;
  /**
   * Print layout groups CPAL roles under one company header and condenses
   * everything else into a short "Earlier" section.
   */
  group?: 'cpal' | 'earlier';
  /** One-line condensed form used by print for `group: 'earlier'` roles. */
  printLine?: string;
  /** Set false to omit from the print resume entirely. */
  inPrint?: boolean;
  summary?: string;
  bullets: BulletInput[];
}

/** Normalizes the `string | Bullet` union. */
export function toBullet(b: BulletInput): Bullet {
  return typeof b === 'string' ? { text: b } : b;
}

/** Bullets for a given variant, in print form. */
export function printBullets(role: Experience, variant: Variant): string[] {
  return role.bullets
    .map(toBullet)
    .filter((b) => b.only !== 'web')
    .filter((b) => !b.variants || b.variants.includes(variant))
    .map((b) => b.print ?? b.text);
}

/** Bullets for the web resume: everything not print-only. */
export function webBullets(role: Experience): string[] {
  return role.bullets
    .map(toBullet)
    .filter((b) => b.only !== 'print')
    .map((b) => b.text);
}

export interface Education {
  degree: string;
  school: string;
  /** Optional. Omit to display a degree without a date. */
  year?: string;
}

export interface SkillCategory {
  label: string;
  items: string[];
  /** Variants this row appears in for print. Omit for all. */
  variants?: Variant[];
}

export interface SelectedProject {
  name: string;
  description: string;
  href?: string;
  /** Shorter description for print. */
  print?: string;
  /** Bare domain shown as a chip on the print resume. */
  tag?: string;
  variants?: Variant[];
  only?: 'web' | 'print';
}

export interface MediaItem {
  outlet: string;
  title: string;
  date: string;
  href: string;
  /** 'press' = news mention; 'visualization' = data viz I contributed to a publication */
  type: 'press' | 'visualization';
  /** Condensed line for print; several web entries can collapse into one. */
  print?: string;
  only?: 'web' | 'print';
}

/**
 * Per-variant lead. The top third of page 1 has to commit to one story —
 * a resume that opens by being slightly everything reads as nothing.
 */
export interface VariantMeta {
  /** Suffix on the output file. Empty string = the default resume. */
  fileSuffix: string;
  /** Summary paragraph under the header. */
  summary: string;
  /** Human label, printed by --measure and --list. */
  label: string;
}

export const variantMeta: Record<Variant, VariantMeta> = {
  playercoach: {
    fileSuffix: '',
    label: 'Player-coach (leadership + platform) — DEFAULT',
    summary:
      "Data leader who still builds. Six years growing the Child Poverty Action Lab's data function from one analyst to a seven-person team while personally building the Databricks platform, the eviction pipeline, and the spatial models underneath it. I take teams and systems from nothing to running.",
  },
  platform: {
    fileSuffix: '_Platform',
    label: 'Platform (senior IC / Staff+)',
    summary:
      "Data and platform engineer with six years turning public and administrative data into systems people rely on. I lead the Child Poverty Action Lab's migration of 35-40 pipelines onto Databricks, built its eviction data infrastructure from scratch, and run a production analytics platform of my own end to end.",
  },
  research: {
    fileSuffix: '_Research',
    label: 'Research & policy (measurement + platform)',
    summary:
      'Policy-trained data scientist working on housing, public safety, and benefits delivery. I build the measurement itself: a rental supply-gap model published annually, a community-resource index that helped direct a $1.25B bond package, and citywide spatial risk models a city agency used to decide where to work.',
  },
};

export const experience: Experience[] = [
  {
    title: 'Director, Data Operations',
    company: 'Child Poverty Action Lab',
    dates: 'January 2026 - Present',
    summary:
      'Director role evolved in January 2026 with a sharpened focus on CPAL\'s Databricks migration, AI-enabled team workflows, and managing external data engineering capacity alongside in-house staff.',
    printDates: 'Jan 2026 – Present',
    group: 'cpal',
    bullets: [
      {
        text: 'Leading CPAL\'s data platform migration to Databricks (Unity Catalog, Workflows, Lakebase + Lakehouse on AWS, Git-tracked orchestration), systematizing 35-40 pipelines from file-based storage onto unified cloud infrastructure',
        print: "Lead CPAL's data platform migration to Databricks (Unity Catalog, Workflows, Lakebase + Lakehouse on AWS, Git-tracked orchestration), systematizing 35–40 pipelines from file-based storage onto unified cloud infrastructure",
      },
      {
        text: 'Manage a 6-person external data engineering team via vendor partnership executing on the internal data roadmap, alongside one full-time data engineer reporting directly to me',
        print: 'Manage a 6-person external data engineering team via vendor partnership executing the internal data roadmap, alongside one full-time data engineer reporting directly to me',
        variants: ['playercoach'],
      },
      {
        text: 'Built AI-enabled team workflows (Claude Code with custom skills and agents, prompt caching with the Anthropic API), including multi-agent code review that puts findings through independent verification before release, meaningfully accelerating how we develop pipelines, write documentation, review code, and communicate with stakeholders',
        print: 'Built AI-enabled team workflows (Claude Code with custom skills and agents, prompt caching with the Anthropic API), including multi-agent code review with independent verification, accelerating how we develop pipelines, write documentation, review code, and communicate with stakeholders',
      },
      {
        text: 'Develop internal tools that let non-data staff act on data without analyst intervention, including a parcel-level outreach tool with 20 active field-team users',
        variants: ['platform'],
      },
      {
        text: 'Maintain the eviction data workstream across four North Texas counties (~48,000 filings in Dallas County alone in 2025; daily updates to 12+ partners including the Dallas Eviction Advocacy Center, the Princeton Eviction Lab, and Dallas Health & Human Services), now running on Databricks Python notebooks after migration from the original R implementation',
        print: 'Maintain the eviction data workstream across four North Texas counties (~48,000 Dallas filings in 2025), feeding 12+ partners daily including the Dallas Eviction Advocacy Center and the Princeton Eviction Lab',
      },
    ],
  },
  {
    title: 'Director, Data',
    company: 'Child Poverty Action Lab',
    dates: 'May 2023 - December 2025',
    summary:
      'Led data strategy, infrastructure, and operations for the backbone organization working to reduce child poverty across North Texas. Built CPAL\'s data engineering function and assumed expanded scope during the org\'s CDO transition.',
    printDates: 'May 2023 – Dec 2025',
    group: 'cpal',
    bullets: [
      {
        text: 'Built CPAL\'s data function from the ground up; led hiring for the org\'s first data engineer and prior analyst roles',
        // Kept in `platform` too: scope-of-ownership reads well for Staff/Principal.
        variants: ['playercoach', 'research', 'platform'],
      },
      {
        text: 'Led the data org during CDO transition (Dec 2024 - Dec 2025): set department roadmap, hiring, vendor strategy, and budget; reported directly to the CTO',
        print: 'Led the data org through the CDO transition (Dec 2024 to Dec 2025): set department roadmap, hiring, vendor strategy, and budget, reporting directly to the CTO',
        variants: ['playercoach'],
      },
      {
        text: 'Directed CPAL\'s citywide risk terrain modeling program through 2024; division-level findings informed Office of Integrated Public Safety Solutions resource deployment and drove site selection for blight remediation and the neighborhood amenities that followed, including basketball courts, soccer fields, and parks',
        print: "Directed CPAL's citywide risk terrain modeling through 2024; division-level findings informed Office of Integrated Public Safety Solutions deployment and drove blight-remediation site selection and neighborhood amenity construction",
        variants: ['playercoach', 'research'],
      },
      {
        text: 'Modeled Dallas\'s rental housing supply gap for CPAL\'s annual Rental Housing Needs Assessment (2023 and 2024 editions), quantifying a 33,660-unit shortfall for households at or below 50% AMI and projecting growth to 83,500 units by 2030',
        print: "Modeled Dallas's rental supply gap for CPAL's annual Rental Housing Needs Assessment (2023–2024): a 33,660-unit shortfall at or below 50% AMI, projected to 83,500 by 2030",
        variants: ['playercoach', 'research'],
      },
      {
        text: 'Oversaw development of an internal Shiny app suite (30+ apps) informing decisions across CPAL focus areas: housing, public safety, maternal health, benefits delivery, and criminal justice',
        print: 'Oversaw a 30+ app R Shiny suite informing decisions across housing, public safety, maternal health, benefits delivery, and criminal justice',
      },
      {
        text: 'Evaluated and selected the org\'s enterprise tooling stack: Databricks (chosen over Snowflake/dbt-Cloud after capacity assessment), Claude Enterprise org-wide, vendor data feeds (MySidewalk, DataAxle)',
        print: 'Evaluated and selected the enterprise tooling stack: Databricks (over Snowflake / dbt-Cloud after a capacity assessment), Claude Enterprise org-wide, vendor data feeds (MySidewalk, DataAxle)',
        variants: ['playercoach', 'platform'],
      },
      {
        text: 'Built project management infrastructure in Notion now adopted across multiple CPAL departments',
        only: 'web',
      },
    ],
  },
  {
    title: 'Manager, Data',
    company: 'Child Poverty Action Lab',
    dates: 'May 2022 - May 2023',
    summary:
      'Transitioned from individual contributor to project leadership, managing cross-functional data initiatives and mentoring junior team members.',
    printDates: 'May 2022 – May 2023',
    group: 'cpal',
    bullets: [
      {
        text: 'Ran CPAL\'s citywide risk terrain modeling on Dallas Police Department incident data joined to Data Axle property and business records (SIMSI platform), producing division-level environmental risk surfaces used to target place-based violence prevention',
        print: "Ran CPAL's citywide risk terrain modeling on Dallas PD incident data joined to Data Axle property and business records (SIMSI), producing division-level environmental risk surfaces to target place-based violence prevention",
        // In `platform` as well: it is the strongest evidence of modeling depth
        // beyond pipeline work, which a Staff/Principal screen looks for.
        variants: ['playercoach', 'research', 'platform'],
      },
      {
        text: 'Led development of R Shiny applications, shifting organization toward interactive data products',
        print: 'Led development of R Shiny applications, shifting the organization toward interactive data products',
      },
      {
        text: 'Contributed to development of northtexasevictions.org, a public-facing eviction data transparency tool',
        print: 'Contributed to northtexasevictions.org, a public-facing eviction data transparency tool',
        variants: ['platform'],
      },
      {
        text: 'Mentored analytics interns; one intern subsequently hired as full-time analyst',
        print: 'Mentored analytics interns; one was subsequently hired as a full-time analyst',
        variants: ['playercoach'],
      },
      {
        text: 'Managed projects spanning afterschool programming, child care accessibility, and housing stability',
        only: 'web',
      },
      {
        text: 'Established data collection and sharing procedures that became organizational standards',
        only: 'web',
      },
    ],
  },
  {
    title: 'Associate, Data',
    company: 'Child Poverty Action Lab',
    dates: 'June 2020 - April 2022',
    summary:
      'Early analytics team member who built foundational data infrastructure and reporting systems.',
    printDates: 'Jun 2020 – Apr 2022',
    group: 'cpal',
    bullets: [
      {
        text: 'Created initial eviction data pipeline in R, laying groundwork for system now processing 40K+ records annually',
        print: 'Created the initial eviction data pipeline in R, laying the groundwork for the system now serving four counties',
      },
      {
        text: 'Built the Community Resource Explorer, an index measuring access to community resources (clinics, grocery stores, parks) within a two-mile band of every Dallas school campus to identify the least-resourced school neighborhoods; the analysis helped define disbursement of a $1.25B bond package',
        print: 'Built the Community Resource Explorer, indexing community-resource access within two miles of every Dallas school campus to find the least-resourced neighborhoods; helped define disbursement of a $1.25B bond package',
        variants: ['playercoach', 'research', 'platform'],
      },
      'Developed dashboards and reports in R, QGIS, Tableau, and ArcGIS for internal teams and community partners',
      {
        text: 'Automated routine data processes, establishing repeatable frameworks used across the organization',
        variants: ['platform'],
      },
      {
        text: 'Presented findings on housing instability, afterschool programming, and public safety to partner organizations',
        variants: ['research'],
      },
    ],
  },
  {
    title: 'Research Project Assistant',
    company: 'UT Southwestern Medical Center',
    dates: 'Dec 2019 - May 2020',
    group: 'earlier',
    inPrint: false,
    bullets: [
      'Conducted participant interviews and assessments for biomedical research projects',
      'Analyzed data and produced reports for internal research findings',
      'Performed literature and policy reviews; coordinated project logistics across departments',
    ],
  },
  {
    title: 'Health and Social Policy Intern',
    company: 'Children at Risk',
    dates: 'June 2019 - August 2019',
    printDates: 'Jun 2019 – Aug 2019',
    group: 'earlier',
    printLine:
      'Led policy research on early childhood development and developed policy briefs for senior leadership and state stakeholders.',
    summary:
      'First exposure to the Dallas nonprofit sector. Taught me the gap between how policy works in textbooks and how it actually moves between research desks and state stakeholders.',
    bullets: [
      'Led policy research on early childhood development and school performance',
      'Developed policy briefs on Texas education best practices for senior leadership and state stakeholders',
    ],
  },
  {
    title: 'Research Coordinator',
    company: 'University of Texas at Dallas',
    dates: 'Aug 2016 - Dec 2018',
    printDates: 'Aug 2016 – Dec 2018',
    group: 'earlier',
    printLine:
      'Managed the Developmental Neurolinguistics Lab; recruited, trained, and supervised 10–15 research assistants each semester and 300+ participants.',
    summary:
      'My first management role: coordinating a lab and supervising 10–15 unpaid research assistants each semester. Volunteers respond to motivation and meaning, not pay. The muscle of running a small team came from here.',
    bullets: [
      'Managed research operations for the Developmental Neurolinguistics Lab',
      'Recruited, trained, and supervised 10-15 research assistants each semester',
      'Recruited 300+ participants from local schools and youth programs',
      'Conducted community outreach, presenting findings to families and local organizations',
    ],
  },
  {
    title: 'Research Assistant',
    company: 'Florida International University',
    dates: 'May 2013 - May 2015',
    group: 'earlier',
    inPrint: false,
    bullets: [
      "Assessed pre-kindergarten children's spatial abilities and verbal intelligence",
      'Trained research assistants on assessment protocols and transcription procedures',
      'Recruited participants across Miami-Dade County schools',
    ],
  },
];

export const education: Education[] = [
  {
    degree: 'Master of Public Policy',
    school: 'University of Texas at Dallas',
  },
  {
    degree: 'Bachelor of Arts, Psychology & Anthropology',
    school: 'Florida International University',
    year: '2015',
  },
];

export const skills: SkillCategory[] = [
  {
    label: 'Analysis & Languages',
    items: ['R (tidyverse, sf, Shiny)', 'SQL', 'Python', 'TypeScript'],
  },
  {
    label: 'Visualization & Geospatial',
    items: ['R Shiny', 'Tableau', 'Highcharts', 'Mapbox GL', 'Spatial SQL', 'QGIS', 'ArcGIS'],
  },
  {
    label: 'Methods',
    items: ['Risk Terrain Modeling', 'Index Construction & PCA', 'Spatial Analysis', 'Needs Assessment & Supply Modeling'],
  },
  {
    label: 'Domains',
    items: ['Housing & Eviction', 'Public Safety', 'Criminal Justice', 'Maternal Health', 'Benefits Delivery', 'Community Development'],
  },
  {
    label: 'Data Platform',
    items: ['Databricks (Lakehouse + Unity Catalog)', 'PostgreSQL / Neon', 'DuckDB', 'Polars', 'PostGIS', 'CKAN'],
  },
  {
    label: 'AI Workflows',
    items: ['Claude Code (custom skills & agents)', 'Anthropic API', 'Google Cloud Vision (OCR)'],
  },
  {
    label: 'Orchestration & Infra',
    items: ['Terraform', 'GitHub Actions', 'Docker', 'AWS', 'Vercel', 'Prefect', 'Structured logging'],
  },
];

/**
 * Print skill-row order per variant. Rows not listed are omitted from that
 * variant's PDF; the web resume always shows all of them in declaration order.
 * Leading rows carry the most weight, so each variant front-loads its lane.
 */
export const skillOrder: Record<Variant, string[]> = {
  playercoach: [
    'Analysis & Languages',
    'Data Platform',
    'Visualization & Geospatial',
    'AI Workflows',
    'Orchestration & Infra',
    'Methods',
    'Domains',
  ],
  platform: [
    'Data Platform',
    'Orchestration & Infra',
    'Analysis & Languages',
    'AI Workflows',
    'Visualization & Geospatial',
    'Domains',
  ],
  research: [
    'Methods',
    'Analysis & Languages',
    'Visualization & Geospatial',
    'Domains',
    'Data Platform',
    'AI Workflows',
  ],
};

export const selectedMedia: MediaItem[] = [
  {
    outlet: 'The Lab Report',
    title: 'How Dallas Police Ramped Up Homeless Enforcement',
    date: 'April 2026',
    href: 'https://labreportdallas.com/criminal-justice/how-dallas-police-ramped-up-homeless-enforcement/',
    type: 'visualization',
    // The two Lab Report entries collapse into one line on the print resume.
    print: 'Data visualizations for Dallas homeless-enforcement and patrol-staffing analyses (2026)',
  },
  {
    outlet: 'The Lab Report',
    title: 'Where Did the Patrol Cops Go?',
    date: 'February 2026',
    href: 'https://labreportdallas.com/criminal-justice/dallas-patrol-officers-staffing-analysis/',
    type: 'visualization',
    only: 'web',
  },
  {
    outlet: 'D Magazine',
    title: "The Lawyer Who Landlords Don't Want to See in Court",
    date: 'May 2024',
    href: 'https://www.dmagazine.com/publications/d-magazine/2024/may/the-lawyer-who-landlords-dont-want-to-see-in-court/',
    type: 'press',
    print: '“The Lawyer Who Landlords Don’t Want to See in Court” (2024)',
  },
  {
    outlet: 'KERA News',
    title: "Eviction less likely for Dallas County tenants who get a lawyer, but most don't have one",
    date: 'January 2024',
    href: 'https://www.keranews.org/news/2024-01-17/eviction-less-likely-for-dallas-county-tenants-who-get-a-lawyer-but-most-dont-have-one',
    type: 'press',
    print: '“Eviction less likely for Dallas County tenants who get a lawyer” (2024)',
  },
];

export const selectedProjects: SelectedProject[] = [
  {
    name: 'Dallas County Eviction Data',
    description:
      'Daily eviction-filing feed reaching 12+ legal-aid and outreach partners; 40,000+ filings a year turned into tenant outreach',
    print:
      'Daily eviction-filing feed reaching 12+ legal-aid and outreach partners; ~48,000 Dallas filings a year turned into tenant outreach.',
  },
  {
    name: 'North Texas Evictions',
    description: 'Public-facing data transparency tool',
    print: 'Public-facing eviction data transparency dashboard for Dallas County.',
    href: 'https://northtexasevictions.org',
    tag: 'northtexasevictions.org',
    variants: ['playercoach', 'platform'],
  },
  {
    name: 'Parcel Block Walking Tool',
    description:
      'Housing assistance eligibility identifier with 20 active users',
    print:
      'Field-outreach tool flagging homes likely missing a homestead exemption; ~20 active field-team users across outreach partners.',
  },
  {
    name: 'Rental Housing Needs Assessment',
    description:
      'Annual public report modeling Dallas\'s rental supply gap; 33,660-unit shortfall at or below 50% AMI, projected to 83,500 by 2030',
    print:
      "Annual public report modeling Dallas's rental supply gap; 33,660-unit shortfall at or below 50% AMI, projected to 83,500 by 2030.",
    href: 'https://childpovertyactionlab.imgix.net/CPAL-Rental-Housing-Needs-Assessment-2024.pdf',
    // Already an experience bullet in playercoach/research, so print only where
    // it is NOT duplicated. Web always shows it.
    variants: ['platform'],
  },
  {
    name: 'Community Resource Explorer',
    description:
      'Index of community-resource access around every Dallas school campus; helped define disbursement of a $1.25B bond package',
    // Now an experience bullet in every print variant, so listing it here too
    // would duplicate. Web keeps it (no page constraint, and the list is a
    // browsable index rather than a summary).
    only: 'web',
  },
  {
    name: '30+ R Shiny Dashboards',
    description:
      'Interactive tools for housing stability, public safety, and resource allocation',
    only: 'web',
  },
  {
    name: 'DigiLab',
    description:
      'Community-sourced tournament data platform for the global Digimon TCG scene; 5,000+ tournaments logged in six months, with regional meta analysis players use to prep',
    print:
      'Community-sourced tournament data platform for the global Digimon TCG scene; 5,000+ tournaments logged in six months, built and run solo through agentic workflows.',
    href: 'https://digilab.cards',
    tag: 'digilab.cards',
  },
  {
    name: 'atomtemplates',
    description: 'R package for standardized project creation and handling',
    href: 'https://github.com/lopezmichael/atomtemplates',
    only: 'web',
  },
];
