export interface Experience {
  title: string;
  company: string;
  dates: string;
  summary?: string;
  bullets: string[];
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
}

export interface SelectedProject {
  name: string;
  description: string;
  href?: string;
}

export interface MediaItem {
  outlet: string;
  title: string;
  date: string;
  href: string;
  /** 'press' = news mention; 'visualization' = data viz I contributed to a publication */
  type: 'press' | 'visualization';
}

export const experience: Experience[] = [
  {
    title: 'Director, Data Operations',
    company: 'Child Poverty Action Lab',
    dates: 'January 2026 - Present',
    summary:
      'Director role evolved in January 2026 with a sharpened focus on CPAL\'s Databricks migration, AI-enabled team workflows, and managing external data engineering capacity alongside in-house staff.',
    bullets: [
      'Leading CPAL\'s data platform migration to Databricks (Unity Catalog, Workflows, Lakebase + Lakehouse on AWS, Git-tracked orchestration), systematizing 35-40 pipelines from file-based storage onto unified cloud infrastructure',
      'Manage a 6-person external data engineering team via vendor partnership executing on the internal data roadmap, alongside one full-time data engineer reporting directly to me',
      'Built AI-enabled team workflows (Claude Code with custom skills and agents, prompt caching with the Anthropic API), including multi-agent code review that puts findings through independent verification before release, meaningfully accelerating how we develop pipelines, write documentation, review code, and communicate with stakeholders',
      'Develop internal tools that let non-data staff act on data without analyst intervention, including a parcel-level outreach tool with 20 active field-team users',
      'Maintain the eviction data workstream across four North Texas counties (~48,000 filings in Dallas County alone in 2025; daily updates to 12+ partners including the Dallas Eviction Advocacy Center, the Princeton Eviction Lab, and Dallas Health & Human Services), now running on Databricks Python notebooks after migration from the original R implementation',
    ],
  },
  {
    title: 'Director, Data',
    company: 'Child Poverty Action Lab',
    dates: 'May 2023 - December 2025',
    summary:
      'Led data strategy, infrastructure, and operations for the backbone organization working to reduce child poverty across North Texas. Built CPAL\'s data engineering function and assumed expanded scope during the org\'s CDO transition.',
    bullets: [
      'Built CPAL\'s data function from the ground up; led hiring for the org\'s first data engineer and prior analyst roles',
      'Led the data org during CDO transition (Dec 2024 - Dec 2025): set department roadmap, hiring, vendor strategy, and budget; reported directly to the CTO',
      'Directed CPAL\'s citywide risk terrain modeling program through 2024; division-level findings informed Office of Integrated Public Safety Solutions resource deployment and drove site selection for blight remediation and the neighborhood amenities that followed, including basketball courts, soccer fields, and parks',
      'Modeled Dallas\'s rental housing supply gap for CPAL\'s annual Rental Housing Needs Assessment (2023 and 2024 editions), quantifying a 33,660-unit shortfall for households at or below 50% AMI and projecting growth to 83,500 units by 2030',
      'Oversaw development of an internal Shiny app suite (30+ apps) informing decisions across CPAL focus areas: housing, public safety, maternal health, benefits delivery, and criminal justice',
      'Evaluated and selected the org\'s enterprise tooling stack: Databricks (chosen over Snowflake/dbt-Cloud after capacity assessment), Claude Enterprise org-wide, vendor data feeds (MySidewalk, DataAxle)',
      'Built project management infrastructure in Notion now adopted across multiple CPAL departments',
    ],
  },
  {
    title: 'Manager, Data',
    company: 'Child Poverty Action Lab',
    dates: 'May 2022 - May 2023',
    summary:
      'Transitioned from individual contributor to project leadership, managing cross-functional data initiatives and mentoring junior team members.',
    bullets: [
      'Ran CPAL\'s citywide risk terrain modeling on Dallas Police Department incident data joined to Data Axle property and business records (SIMSI platform), producing division-level environmental risk surfaces used to target place-based violence prevention',
      'Led development of R Shiny applications, shifting organization toward interactive data products',
      'Contributed to development of northtexasevictions.org, a public-facing eviction data transparency tool',
      'Mentored analytics interns; one intern subsequently hired as full-time analyst',
      'Managed projects spanning afterschool programming, child care accessibility, and housing stability',
      'Established data collection and sharing procedures that became organizational standards',
    ],
  },
  {
    title: 'Associate, Data',
    company: 'Child Poverty Action Lab',
    dates: 'June 2020 - April 2022',
    summary:
      'Early analytics team member who built foundational data infrastructure and reporting systems.',
    bullets: [
      'Created initial eviction data pipeline in R, laying groundwork for system now processing 40K+ records annually',
      'Built the Community Resource Explorer, an index measuring access to community resources (clinics, grocery stores, parks) within a two-mile band of every Dallas school campus to identify the least-resourced school neighborhoods; the analysis helped define disbursement of a $1.25B bond package',
      'Developed dashboards and reports in R, QGIS, Tableau, and ArcGIS for internal teams and community partners',
      'Automated routine data processes, establishing repeatable frameworks used across the organization',
      'Presented findings on housing instability, afterschool programming, and public safety to partner organizations',
    ],
  },
  {
    title: 'Research Project Assistant',
    company: 'UT Southwestern Medical Center',
    dates: 'Dec 2019 - May 2020',
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

export const selectedMedia: MediaItem[] = [
  {
    outlet: 'The Lab Report',
    title: 'How Dallas Police Ramped Up Homeless Enforcement',
    date: 'April 2026',
    href: 'https://labreportdallas.com/criminal-justice/how-dallas-police-ramped-up-homeless-enforcement/',
    type: 'visualization',
  },
  {
    outlet: 'The Lab Report',
    title: 'Where Did the Patrol Cops Go?',
    date: 'February 2026',
    href: 'https://labreportdallas.com/criminal-justice/dallas-patrol-officers-staffing-analysis/',
    type: 'visualization',
  },
  {
    outlet: 'D Magazine',
    title: "The Lawyer Who Landlords Don't Want to See in Court",
    date: 'May 2024',
    href: 'https://www.dmagazine.com/publications/d-magazine/2024/may/the-lawyer-who-landlords-dont-want-to-see-in-court/',
    type: 'press',
  },
  {
    outlet: 'KERA News',
    title: "Eviction less likely for Dallas County tenants who get a lawyer, but most don't have one",
    date: 'January 2024',
    href: 'https://www.keranews.org/news/2024-01-17/eviction-less-likely-for-dallas-county-tenants-who-get-a-lawyer-but-most-dont-have-one',
    type: 'press',
  },
];

export const selectedProjects: SelectedProject[] = [
  {
    name: 'Dallas County Eviction Data',
    description:
      'Daily eviction-filing feed reaching 12+ legal-aid and outreach partners; 40,000+ filings a year turned into tenant outreach',
  },
  {
    name: 'North Texas Evictions',
    description: 'Public-facing data transparency tool',
    href: 'https://northtexasevictions.org',
  },
  {
    name: 'Parcel Block Walking Tool',
    description:
      'Housing assistance eligibility identifier with 20 active users',
  },
  {
    name: 'Rental Housing Needs Assessment',
    description:
      'Annual public report modeling Dallas\'s rental supply gap; 33,660-unit shortfall at or below 50% AMI, projected to 83,500 by 2030',
    href: 'https://childpovertyactionlab.imgix.net/CPAL-Rental-Housing-Needs-Assessment-2024.pdf',
  },
  {
    name: 'Community Resource Explorer',
    description:
      'Index of community-resource access around every Dallas school campus; helped define disbursement of a $1.25B bond package',
  },
  {
    name: '30+ R Shiny Dashboards',
    description:
      'Interactive tools for housing stability, public safety, and resource allocation',
  },
  {
    name: 'DigiLab',
    description:
      'Community-sourced tournament data platform for the global Digimon TCG scene; 5,000+ tournaments logged in six months, with regional meta analysis players use to prep',
    href: 'https://digilab.cards',
  },
  {
    name: 'atomtemplates',
    description: 'R package for standardized project creation and handling',
    href: 'https://github.com/lopezmichael/atomtemplates',
  },
];
