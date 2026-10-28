// Section 01 · About the Company — all text and data shown in this section.
// Source: BNC_Global_Company_Profile_and_Service_Catalogue.docx (public website content reviewed 25 Oct 2026).

import summitPhoto from './assets/summit-goyal.png';
import gurvinderPhoto from './assets/gurvinder-singh.png';

export const COMPANY = {
  name: 'BNC Global',
  legalName: 'BNC Global Consultech Pvt. Ltd.',
  intro:
    'BNC Global is a multidisciplinary consulting and business-services company. Across our brands we bring together finance and accounting, risk and governance, privacy and cybersecurity, ESG and sustainability, technology-enabled transformation, and a partner ecosystem.',
  positioning:
    'Practical, structured business solutions combining domain expertise, compliance awareness, and execution discipline.',
};

export const AT_A_GLANCE = [
  { label: 'Company', value: 'BNC Global Consultech Pvt. Ltd.', icon: 'domain' },
  { label: 'Positioning', value: 'Practical, structured solutions with domain expertise, compliance awareness and execution discipline.', icon: 'track_changes' },
  { label: 'Locations', value: 'Gurugram, India and Riyadh, Saudi Arabia', icon: 'public' },
  { label: 'Specialist brands', value: 'Sustaind for ESG and sustainability; BNC Data Privacy for privacy and cybersecurity.', icon: 'hub' },
  { label: 'Partner platform', value: 'BNC LEG connects businesses, technology providers, service experts and partners.', icon: 'handshake' },
];

export const WHO_WE_ARE = {
  paragraphs: [
    'BNC Global is an integrated business-services and consulting firm supporting organizations through business change and growth. Clients access multiple disciplines through coordinated teams, which reduces vendor fragmentation and operational friction.',
    'Our work links finance operations and advisory with governance, risk, compliance, assurance, ESG, cybersecurity, technology and hiring. It spans recurring outsourced operations, specialist advisory, assessments, implementation support and partner-enabled services.',
  ],
  principles: [
    { title: 'One coordinated team', text: 'Multiple disciplines under one roof, so clients deal with fewer vendors and less friction.', icon: 'groups' },
    { title: 'Fit for the client', text: 'Recommendations shaped to each client’s business model, industry and stage of growth.', icon: 'tune' },
    { title: 'Outcomes over theory', text: 'A focus on implementation and measurable results, not advice that stays on paper.', icon: 'rocket_launch' },
  ],
};

export const FOUNDERS = [
  {
    name: 'Summit Goyal',
    title: 'Founder',
    focus: 'CFO services, finance transformation, ERM, GRC, strategic MIS',
    photo: summitPhoto.src,
  },
  {
    name: 'Gurvinder Singh',
    title: 'Co-Founder',
    focus: 'Assurance, risk management, ICFR, internal audit, controls, automation',
    photo: gurvinderPhoto.src,
  },
];

export const LEADERS = [
  { name: 'Karandeep Singh', area: 'GCC and CFO practice' },
  { name: 'Sushmeet Singh', area: 'Digital transformation' },
  { name: 'Praveen Ladha', area: 'KSA country head' },
  { name: 'Saurabh Verma', area: 'UK division; climate and risk advisory' },
  { name: 'Pankhuri Jain', area: 'Social practice' },
  { name: 'Pranav Bhardwaj', area: 'ESG practice' },
  { name: 'Anwar Akhtar', area: 'Cybersecurity' },
  { name: 'Shailesh Dayal', area: 'Growth, leadership training, workshops and podcasts' },
];

export const PRACTICES = [
  {
    id: 'finance',
    short: 'Finance & CFO',
    title: 'Finance, accounting and CFO services',
    icon: 'account_balance',
    summary:
      'Finance operations, management information, financial planning and strategic finance leadership, from outsourced bookkeeping for small businesses to virtual CFO support for growing organizations.',
    items: [
      { title: 'Accounting operations', text: 'Chart-of-accounts setup, transaction posting, invoicing and receipts, payables, banking, month-end and year-end entries, and bookkeeping.' },
      { title: 'Accounts payable & receivable', text: 'Invoice and PO processing, vendor and customer reconciliations, collections, payment controls, aging analysis and cash forecasting.' },
      { title: 'Payroll & tax support', text: 'Payroll setup, processing, records and reconciliation, plus tax reports and preparation support.' },
      { title: 'Reporting & controllership', text: 'Balance sheet, P&L, trial balance, cash-flow and fund-flow, bank reconciliations, general ledger, fixed assets and dashboards.' },
      { title: 'Virtual CFO & advisory', text: 'FP&A, budgeting and forecasting, MIS, internal controls, working capital, capital budgeting, valuation, restructuring and tax advisory.' },
      { title: 'Financial statements', text: 'US GAAP and IFRS preparation, schedules, deferred tax, consolidation, audit coordination and review.' },
    ],
  },
  {
    id: 'risk',
    short: 'Audit & Risk',
    title: 'Audit, risk, governance and compliance',
    icon: 'verified_user',
    summary:
      'Helping clients understand risk, strengthen controls, improve processes and prepare for audit or regulatory scrutiny, covering ERM, GRC, ICFR, internal audit and control reviews.',
    items: [
      { title: 'Audit support', text: 'Financial statement, tax, forensic, internal, compliance and SOX-related support, from planning and testing to workpapers and reporting.' },
      { title: 'Internal controls & ICFR', text: 'Documenting processes, assessing control design and operation, identifying gaps and improving controls.' },
      { title: 'Policies & procedures', text: 'Accounting policies, SOP documentation, control design, templates and implementation support.' },
      { title: 'Risk advisory', text: 'Risk assessment, governance support, process reengineering, business intelligence and continuous improvement.' },
      { title: 'Saudi compliance', text: 'Statutory audit support, VAT and withholding tax, Zakat and corporate tax, bookkeeping and accounting.' },
    ],
  },
  {
    id: 'privacy',
    short: 'Privacy & Cyber',
    title: 'Data privacy, information security and cybersecurity',
    icon: 'shield_lock',
    brand: 'BNC Data Privacy',
    summary:
      'Through BNC Data Privacy we protect sensitive information, help clients meet privacy and security requirements, and manage technology risk with consulting, compliance audits and implementation support.',
    items: [
      { title: 'ISO/IEC 27001', text: 'Information security management system design and certification support.' },
      { title: 'SOC reporting', text: 'Support for SOC Type 1 and Type 2 engagements.' },
      { title: 'Privacy compliance', text: 'GDPR, HIPAA, India’s DPDP framework and other global requirements.' },
      { title: 'Cybersecurity', text: 'Security implementation and security risk assessment.' },
      { title: 'AI audits', text: 'Assessing AI systems for risk, bias and compliance.' },
      { title: 'GRC tooling', text: 'GRC and automated risk-management tools.' },
    ],
    stats: [
      { value: 140, suffix: '+', label: 'Compliance and assessment projects' },
      { value: 800, suffix: '+', label: 'Training certifications delivered' },
      { value: 100, suffix: '+', label: 'Information security advisors' },
    ],
  },
  {
    id: 'esg',
    short: 'ESG & Climate',
    title: 'ESG, sustainability, climate and carbon',
    icon: 'eco',
    brand: 'Sustaind',
    summary:
      'Sustaind is our specialist sustainability brand: global frameworks with local execution and measurable business outcomes, across India and the Middle East.',
    items: [
      { title: 'Carbon emissions', text: 'Scope 1, 2 and 3 quantification, baselines, reduction pathways and reporting.' },
      { title: 'Carbon credits', text: 'Measure and reduce first, then use high-quality credits for residual emissions with transparent claims.' },
      { title: 'ESG advisory', text: 'ESG risk, governance and data processes, supply-chain transparency, responsible sourcing and green finance.' },
      { title: 'IFRS S1 & S2', text: 'Support with IFRS sustainability disclosure requirements.' },
      { title: 'Climate risk', text: 'Physical and transition risks, scenario analysis, resilience planning and regulatory alignment.' },
      { title: 'Sustainability strategy', text: 'Roadmaps that build sustainability into strategy, compliance and long-term value.' },
    ],
    frameworks: ['GHG Protocol', 'IFRS S1/S2', 'CDP', 'BRSR', 'Science-aligned targets'],
  },
  {
    id: 'tech',
    short: 'Technology',
    title: 'Technology, analytics and transformation',
    icon: 'insights',
    summary:
      'Digital transformation through stakeholder alignment, scope definition, operational governance, systems integration and multi-country team mobilization, backed by deep business analysis.',
    items: [
      { title: 'Business analysis', text: 'Financial, retail, cost, variance, profit-centre, supply-chain, scenario, trend and risk analysis, and more.' },
      { title: 'Systems integration', text: 'Connecting platforms and processes with clear governance and scope.' },
      { title: 'Technology partnerships', text: 'API integrations, data analytics, AI agents, tools and robotic process automation (RPA).' },
    ],
  },
  {
    id: 'growth',
    short: 'Hiring & Growth',
    title: 'Hiring, training and growth services',
    icon: 'school',
    summary:
      'Hiring is one of our integrated capabilities, alongside leadership training, business podcasts and corporate workshops delivered by our growth practice.',
    items: [
      { title: 'BNC Hiring', text: 'Recruitment support and the BNC Hiring community.' },
      { title: 'Leadership training', text: 'Programmes and workshops that build leadership capability.' },
      { title: 'Podcasts & workshops', text: 'Business podcasts and corporate workshops run by our growth team.' },
    ],
  },
];

export const BRANDS = [
  { name: 'BNC Global', focus: 'Multidisciplinary consulting and business services: finance, accounting, risk, governance, technology and related capabilities.', url: 'https://www.bncglobal.in/', core: true },
  { name: 'Sustaind', focus: 'ESG, sustainability strategy, carbon, climate risk and sustainability reporting.', url: 'https://www.sustaind.in/' },
  { name: 'BNC Data Privacy', focus: 'Data privacy, information security, cybersecurity and compliance consulting.', url: 'https://www.bncdataprivacy.com/' },
  { name: 'BNC LEG', focus: 'Partner network, service marketplace, partner applications and collaboration portal.', url: 'https://partners.bncglobal.in/' },
  { name: 'BNC Hiring', focus: 'Recruitment consulting: sourcing candidates and supplying manpower to companies as per their requirements.' },
];

export const PARTNER_TYPES = [
  { title: 'International partners', text: 'Cross-border market expansion, local compliance alignment, global partnership enablement.', icon: 'travel_explore' },
  { title: 'Sales partners', text: 'Reseller programs, distributor network, sales partners, channel enablement.', icon: 'storefront' },
  { title: 'Technology partners', text: 'API integration, data analytics, AI agents, tools and RPA.', icon: 'memory' },
  { title: 'Service partners', text: 'IFRS, M&A advisory, cross-border advisory, compliance and specialist delivery.', icon: 'support_agent' },
];

export const PARTNER_JOURNEY = ['Registration & KYC', 'Product access & onboarding', 'Training & certification', 'Opportunities & commission tracking'];

export const PARTNER_FEATURES = [
  'Partner dashboard for leads, earnings and commissions',
  'AI-powered lead matching and deal collaboration',
  'Product catalogue and multi-product distribution',
  'Training modules, webinars, certification and relationship support',
  'Partner reports on portfolio performance, pending commissions and client acquisition',
];

export const OFFICES = [
  { city: 'Gurugram', country: 'India', role: 'Headquarters', address: 'Plot No. C-15 & C-16, Ground Floor, Udyog Vihar Phase 5, Gurgaon, India' },
  { city: 'Riyadh', country: 'Saudi Arabia', role: 'Saudi Arabia office', address: '8163 Abi Barzah Al Aslami, 4362 Al Dhubbat District, Riyadh 12623, Saudi Arabia' },
];

export const CONTACTS = [
  { label: 'Consulting inquiries', value: 'summit@bncglobal.in', type: 'email' },
  { label: 'General inquiries', value: 'info@bncglobal.in', type: 'email' },
  { label: 'Main line', value: '+91 98105 75613', type: 'phone' },
  { label: 'Partner ecosystem', value: 'partners@bncglobal.in · +91 99587 11796', type: 'email' },
];

export const WEBSITES = [
  { name: 'BNC Global home', url: 'https://www.bncglobal.in/', covers: 'Positioning, services overview and contact details' },
  { name: 'Meet the team', url: 'https://www.bncglobal.in/about-us/meet-our-team', covers: 'Leadership and practice biographies' },
  { name: 'Accounting services', url: 'https://www.bncglobal.in/accounting', covers: 'Outsourced accounting, bookkeeping, reporting, payroll and tax' },
  { name: 'Virtual CFO', url: 'https://www.bncglobal.in/virtual-cfo', covers: 'Virtual CFO and financial advisory' },
  { name: 'Accounts payable & receivable', url: 'https://www.bncglobal.in/ar-ap', covers: 'Invoices, collections, vendors, reconciliation and cash flow' },
  { name: 'Controller services', url: 'https://www.bncglobal.in/controller-services', covers: 'Management reporting and controllership' },
  { name: 'Financial statement preparation', url: 'https://www.bncglobal.in/financial-statment-preparation-services', covers: 'US GAAP and IFRS statement preparation' },
  { name: 'Audit support', url: 'https://www.bncglobal.in/audit-support-service', covers: 'Audit support types, phases and examples' },
  { name: 'Business analysis', url: 'https://www.bncglobal.in/business-analysis', covers: 'Analytics services and analysis categories' },
  { name: 'Working capital management', url: 'https://www.bncglobal.in/working-capital-management-services', covers: 'Cash forecasting, receivables and payables' },
  { name: 'Sustaind', url: 'https://www.sustaind.in/', covers: 'Sustainability, ESG, carbon credits, IFRS and climate risk' },
  { name: 'BNC Data Privacy', url: 'https://www.bncdataprivacy.com/', covers: 'Privacy, cybersecurity, frameworks, AI audits and compliance' },
  { name: 'BNC LEG partner portal', url: 'https://partners.bncglobal.in/', covers: 'Partner ecosystem, opportunities and partner login' },
];
