// Section 04 · Your Role & Team — fixed text. The employee's own details come live from HRM (../../api/me).

export const ROLE_HERO = {
  eyebrow: 'Onboarding · Section 04',
  serifLine: 'Your place',
  boldLine: 'at BNC Global.',
  intro: 'Everything HR has on record for you in one place: your role, who you report to, the people you work alongside and your documents.',
};

export const CHAPTERS = {
  line: {
    index: '01',
    eyebrow: 'Your reporting line',
    title: ['Who you report to, and ', { bold: 'who reports to you.' }],
    text: 'Your reporting manager at the top, you in the middle, and below you the people whose reporting manager is you.',
  },
  role: {
    index: '02',
    eyebrow: 'Your role',
    title: ['How your job is ', { bold: 'set up.' }],
    text: 'Your employment details, working week, experience and the Universe One modules you can use.',
  },
  about: {
    index: '03',
    eyebrow: 'About you',
    title: ['Your contact and ', { bold: 'personal details.' }],
    text: 'If anything here is wrong, ask HR to correct it in your HRM profile.',
  },
  documents: {
    index: '04',
    eyebrow: 'Your documents',
    title: ['Your files, ', { bold: 'kept safely on record.' }],
    text: 'Upload missing documents from HRM → My Profile → Documents. Each document can be uploaded once.',
  },
};

// the same document list as HRM → My Profile → Documents
export const DOCUMENT_SLOTS = [
  { key: 'aadhaar_card', label: 'Aadhaar Card', hint: 'Government ID card', required: true, icon: 'badge' },
  { key: 'pan_card', label: 'PAN Card', hint: 'Permanent Account Number', required: true, icon: 'credit_card' },
  { key: 'bank_passbook_cancel_cheque', label: 'Bank Passbook / Cancelled Cheque', hint: 'For salary payments', required: true, icon: 'account_balance' },
  { key: 'passport', label: 'Passport', hint: 'First and last page', required: false, icon: 'travel_explore' },
  { key: 'appointment_letter', label: 'Appointment Letter', hint: 'From your previous employer', required: false, icon: 'description' },
  { key: 'experience_letter', label: 'Experience Letter', hint: 'Relieving / experience certificate', required: false, icon: 'workspace_premium' },
  { key: 'salary_slip', label: 'Salary Slip', hint: 'Recent payslip from your previous employer', required: false, icon: 'receipt_long' },
];

// Universe One modules HR can switch on, with the role field that goes with each (if any)
export const MODULES = [
  { key: 'hrm_admin', label: 'HRM', icon: 'badge' },
  { key: 'task_manager', label: 'Task Manager', icon: 'task_alt', role: 'task_manager_role' },
  { key: 'crm', label: 'CRM', icon: 'handshake', role: 'crm_role' },
  { key: 'finance', label: 'Finance', icon: 'account_balance_wallet', role: 'finance_role' },
  { key: 'auditing', label: 'Auditing', icon: 'fact_check', role: 'auditing_role' },
  { key: 'vendor', label: 'Vendor', icon: 'storefront', role: 'vendor_role' },
];

export const SECTION_END = { number: '04', headline: 'You know your role, your manager and your team.' };
