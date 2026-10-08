// Standard Preloaded Compliances from Master Template (SC&H / Indian Statutory Compliances)
export const DEFAULT_STANDARD_COMPLIANCES = [
  {
    s_no: 1,
    category: 'TAX',
    compliance_nature: 'TDS - Salary Payments',
    frequency: 'Monthly',
    statutory_due_date: '7th of following month',
    internal_control_due_date: '1st of following month',
    default_status: 'Completed',
  },
  {
    s_no: 2,
    category: 'TAX',
    compliance_nature: 'TDS - Vendor / Professional Payments',
    frequency: 'Monthly',
    statutory_due_date: '7th of following month',
    internal_control_due_date: '1st of following month',
    default_status: 'Completed',
  },
  {
    s_no: 3,
    category: 'BRS',
    compliance_nature: 'Bank Reconciliation Statement',
    frequency: 'Monthly',
    statutory_due_date: '10th of following month',
    internal_control_due_date: '9th of following month',
    default_status: 'Completed',
  },
  {
    s_no: 4,
    category: 'TAX',
    compliance_nature: 'Inter-Company Invoicing',
    frequency: 'Monthly',
    statutory_due_date: '9th of following month',
    internal_control_due_date: '5th of following month',
    default_status: 'Completed',
  },
  {
    s_no: 5,
    category: 'TAX',
    compliance_nature: 'Intercompany Signed Invoices to be shared with Client',
    frequency: 'Monthly',
    statutory_due_date: '9th of following month',
    internal_control_due_date: '5th of following month',
    default_status: 'Completed',
  },
  {
    s_no: 6,
    category: 'TAX',
    compliance_nature: 'Working capital computation for Sep.',
    frequency: 'Monthly',
    statutory_due_date: '2nd Sep',
    internal_control_due_date: 'Monthly',
    default_status: 'Completed',
  },
  {
    s_no: 7,
    category: 'GST',
    compliance_nature: 'GST Return "1"',
    frequency: 'Monthly',
    statutory_due_date: '11th of following month',
    internal_control_due_date: '10th of following month',
    default_status: 'Completed',
  },
  {
    s_no: 8,
    category: 'GST',
    compliance_nature: 'GST Return "3B"',
    frequency: 'Monthly',
    statutory_due_date: '20th of following month',
    internal_control_due_date: '18th of following month',
    default_status: 'Completed',
  },
  {
    s_no: 9,
    category: 'GST',
    compliance_nature: 'GSTR Reco till date',
    frequency: 'Monthly',
    statutory_due_date: '20th of following month',
    internal_control_due_date: '18th of following month',
    default_status: 'Pending',
  },
  {
    s_no: 10,
    category: 'TAX',
    compliance_nature: 'TDS Reco - Vendor till date',
    frequency: 'Monthly',
    statutory_due_date: '25th of following month',
    internal_control_due_date: '20th of following month',
    default_status: 'Pending',
  },
  {
    s_no: 11,
    category: 'TAX',
    compliance_nature: 'TDS Reco - Salary till date',
    frequency: 'Monthly',
    statutory_due_date: '25th of following month',
    internal_control_due_date: '20th of following month',
    default_status: 'Pending',
  },
  {
    s_no: 12,
    category: 'TAX',
    compliance_nature: 'Revise Q1 TDS Return',
    frequency: 'One time',
    statutory_due_date: '30th Sep 2026',
    internal_control_due_date: '25th Sep 2026',
    default_status: 'In Progress',
  },
  {
    s_no: 13,
    category: 'Form 16',
    compliance_nature: 'Form 16 to be revised for FY 25-26',
    frequency: 'One time',
    statutory_due_date: '30th Sep 2026',
    internal_control_due_date: '25th Sep 2026',
    default_status: 'In Progress',
  },
  {
    s_no: 14,
    category: 'TAX',
    compliance_nature: 'Lease Rental Payments',
    frequency: 'Monthly',
    statutory_due_date: '10th of following month',
    internal_control_due_date: '10th of following month',
    default_status: 'Completed',
  },
  {
    s_no: 15,
    category: 'PF',
    compliance_nature: 'PF Working for Payment of employees',
    frequency: 'Monthly',
    statutory_due_date: '15th of following month',
    internal_control_due_date: '12th of following month',
    default_status: 'In Progress',
  },
  {
    s_no: 16,
    category: 'PF',
    compliance_nature: 'EPF Set up with PAM / Konark F&F',
    frequency: 'One time',
    statutory_due_date: '30th Sep 2026',
    internal_control_due_date: '20th Sep 2026',
    default_status: 'Completed',
  },
  {
    s_no: 17,
    category: 'ESI',
    compliance_nature: 'ESI Nil Returns to be filed',
    frequency: 'Monthly',
    statutory_due_date: '15th of following month',
    internal_control_due_date: '12th of following month',
    default_status: 'Completed',
  },
  {
    s_no: 18,
    category: 'TAX',
    compliance_nature: 'Vendor Payments',
    frequency: 'Monthly',
    statutory_due_date: '20th of following month',
    internal_control_due_date: '20th of following month',
    default_status: 'Completed',
  },
  {
    s_no: 19,
    category: 'Salary',
    compliance_nature: 'Salary and Reimbursements',
    frequency: 'Monthly',
    statutory_due_date: '28th of following month',
    internal_control_due_date: '28th of following month',
    default_status: 'Pending',
  },
  {
    s_no: 20,
    category: 'Salary',
    compliance_nature: 'Performance Appraisal file to be completed',
    frequency: 'Annual',
    statutory_due_date: '15th Sep',
    internal_control_due_date: '10th Sep',
    default_status: 'Pending',
  },
  {
    s_no: 21,
    category: 'Audit',
    compliance_nature: 'Monthly filing of Documents including Soft and Hard Copy',
    frequency: 'Monthly',
    statutory_due_date: '25th of following month',
    internal_control_due_date: '20th of following month',
    default_status: 'In Progress',
  },
  {
    s_no: 22,
    category: 'Audit',
    compliance_nature: 'Books of Accounts',
    frequency: 'Monthly',
    statutory_due_date: '25th of following month',
    internal_control_due_date: '20th of following month',
    default_status: 'In Progress',
  },
  {
    s_no: 23,
    category: 'Audit',
    compliance_nature: 'Fixed Asset Register',
    frequency: 'One time',
    statutory_due_date: '30th Sep 2026',
    internal_control_due_date: '25th Sep 2026',
    default_status: 'In Progress',
  },
  {
    s_no: 24,
    category: 'GST',
    compliance_nature: 'GST Refund of Export of services',
    frequency: 'Quarterly',
    statutory_due_date: 'Quarterly - 30th',
    internal_control_due_date: 'Quarterly - 20th',
    default_status: 'In Progress',
  },
  {
    s_no: 25,
    category: 'ROC / Secretarial',
    compliance_nature: 'Shops and Establishment Registration',
    frequency: 'One time',
    statutory_due_date: '4th Sep',
    internal_control_due_date: '1st Sep',
    default_status: 'Completed',
  },
  {
    s_no: 26,
    category: 'BRS',
    compliance_nature: 'BIRC to be received from bank',
    frequency: 'Monthly',
    statutory_due_date: '30th of following month',
    internal_control_due_date: '25th of following month',
    default_status: 'Pending',
  },
  {
    s_no: 27,
    category: 'ROC / Secretarial',
    compliance_nature: 'DSC of All Directors to be collected / Director KYC',
    frequency: 'Annual',
    statutory_due_date: '30th Sep',
    internal_control_due_date: '20th Sep',
    default_status: 'Pending',
  },
  {
    s_no: 28,
    category: 'BRS',
    compliance_nature: 'e-BRC Generation',
    frequency: 'Monthly',
    statutory_due_date: '30th of following month',
    internal_control_due_date: '25th of following month',
    default_status: 'Completed',
  },
  {
    s_no: 29,
    category: 'Salary',
    compliance_nature: 'GreytHR Implementation for Entire payroll processing',
    frequency: 'Monthly',
    statutory_due_date: 'Monthly',
    internal_control_due_date: 'Monthly',
    default_status: 'In Progress',
  },
  {
    s_no: 30,
    category: 'TAX',
    compliance_nature: 'Safe Harbor Rules Cost plus 15%',
    frequency: 'Annual',
    statutory_due_date: '30th Nov',
    internal_control_due_date: '15th Nov',
    default_status: 'Pending',
  },
];

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTH_SHORT_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function formatPeriodLabel(monthIndex, year) {
  const shortMonth = MONTH_SHORT_NAMES[monthIndex - 1] || 'Sep';
  const shortYear = String(year).slice(-2);
  return `${shortMonth}'${shortYear}`;
}

export function formatPeriodFull(monthIndex, year) {
  const monthName = MONTH_NAMES[monthIndex - 1] || 'September';
  return `${monthName} ${year}`;
}

/**
 * Resolves the statutory deadline as a Date object based on the compliance item and tracking period.
 * @param {Object} item - Compliance item { frequency, statutory_due_date, ... }
 * @param {number} activeMonth - Month index (1 to 12)
 * @param {number} activeYear - Year (e.g. 2026)
 * @returns {Date|null}
 */
export function resolveStatutoryDueDate(item, activeMonth, activeYear) {
  if (!item) return null;
  const raw = (item.statutory_due_date || '').trim();
  if (!raw) return null;

  const m = Number(activeMonth) || 9;
  const y = Number(activeYear) || 2026;

  // 1. Direct YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const [year, month, day] = raw.split('-').map(Number);
    return new Date(year, month - 1, day, 23, 59, 59, 999);
  }

  // 2. "...of following month" (e.g., "7th of following month", "20th of following month")
  const followingMatch = raw.match(/(\d{1,2})(?:st|nd|rd|th)?\s+of\s+following\s+month/i);
  if (followingMatch) {
    const day = parseInt(followingMatch[1], 10);
    let dueMonth = m + 1;
    let dueYear = y;
    if (dueMonth > 12) {
      dueMonth = 1;
      dueYear += 1;
    }
    const maxDays = new Date(dueYear, dueMonth, 0).getDate();
    return new Date(dueYear, dueMonth - 1, Math.min(day, maxDays), 23, 59, 59, 999);
  }

  // 3. Day + Month + Year (e.g., "30th Sep 2026", "15th October 2026")
  const dayMonthYearMatch = raw.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\s+(\d{4})/i);
  if (dayMonthYearMatch) {
    const day = parseInt(dayMonthYearMatch[1], 10);
    const monthStr = dayMonthYearMatch[2].toLowerCase();
    const year = parseInt(dayMonthYearMatch[3], 10);
    const monthIdx = MONTH_NAMES.findIndex(
      (name, idx) =>
        name.toLowerCase().startsWith(monthStr.slice(0, 3)) ||
        MONTH_SHORT_NAMES[idx].toLowerCase() === monthStr.slice(0, 3)
    );
    if (monthIdx !== -1) {
      const maxDays = new Date(year, monthIdx + 1, 0).getDate();
      return new Date(year, monthIdx, Math.min(day, maxDays), 23, 59, 59, 999);
    }
  }

  // 4. Day + Month in active year (e.g., "2nd Sep", "30th Sep", "30th Nov", "31st Oct")
  const dayMonthMatch = raw.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)/i);
  if (dayMonthMatch) {
    const day = parseInt(dayMonthMatch[1], 10);
    const monthStr = dayMonthMatch[2].toLowerCase();
    const monthIdx = MONTH_NAMES.findIndex(
      (name, idx) =>
        name.toLowerCase().startsWith(monthStr.slice(0, 3)) ||
        MONTH_SHORT_NAMES[idx].toLowerCase() === monthStr.slice(0, 3)
    );
    if (monthIdx !== -1) {
      const maxDays = new Date(y, monthIdx + 1, 0).getDate();
      return new Date(y, monthIdx, Math.min(day, maxDays), 23, 59, 59, 999);
    }
  }

  // 5. Fallback for "Quarterly" or "Monthly" text
  if (item.frequency?.toLowerCase() === 'monthly') {
    let dueMonth = m + 1;
    let dueYear = y;
    if (dueMonth > 12) {
      dueMonth = 1;
      dueYear += 1;
    }
    return new Date(dueYear, dueMonth - 1, 20, 23, 59, 59, 999);
  }

  return null;
}

/**
 * Computes the authoritative status for a compliance item.
 * Rules:
 *  1. 'Completed' is ONLY valid if actual_payment_date is provided.
 *  2. If the period is BEFORE company creation / onboarding, it is NOT Overdue (returns 'N/A' or 'Pending').
 *  3. If the statutory due date is in the past and item is not completed, status is automatically 'Overdue'.
 *  4. Otherwise, returns user status or default status.
 *
 * @param {Object} item - Compliance item
 * @param {Object} entry - Tracking entry { status, actual_payment_date, remarks }
 * @param {number} activeMonth - Active month index (1-12)
 * @param {number} activeYear - Active year
 * @param {Date} [now] - Current date
 * @param {string|Date} [companyCreatedAt] - Company creation / inception date
 * @returns {string} - 'Completed' | 'Overdue' | 'In Progress' | 'Pending' | 'N/A'
 */
export function computeEffectiveStatus(item, entry, activeMonth, activeYear, now = new Date(), companyCreatedAt = null) {
  const hasPaymentDate = Boolean(entry?.actual_payment_date && entry.actual_payment_date.trim().length > 0);
  const userStatus = entry?.status || (hasPaymentDate ? 'Completed' : item?.default_status || 'Pending');

  // Rule 1: Completed status is authoritative ONLY if actual payment date is entered
  if (userStatus === 'Completed' && hasPaymentDate) {
    return 'Completed';
  }

  // Rule 2: If this period is prior to company onboarding, do not flag as Overdue
  if (companyCreatedAt) {
    const cd = new Date(companyCreatedAt);
    if (!isNaN(cd.getTime())) {
      const createdYear = cd.getFullYear();
      const createdMonth = cd.getMonth() + 1;
      if (activeYear < createdYear || (activeYear === createdYear && activeMonth < createdMonth)) {
        return userStatus !== 'Completed' ? 'N/A' : 'Completed';
      }
    }
  }

  // Rule 3: Check if statutory deadline has passed for this period
  const dueDate = resolveStatutoryDueDate(item, activeMonth, activeYear);
  if (dueDate && now > dueDate) {
    return 'Overdue';
  }

  // If user explicitly chose In Progress and not overdue
  if (userStatus === 'In Progress') {
    return 'In Progress';
  }

  return userStatus === 'Completed' && !hasPaymentDate ? 'Pending' : userStatus;
}

/**
 * Resolves the effective entry for an item across monthly_entries considering its frequency.
 * - 'One time': If completed in ANY period, persists as Completed across all future/other months.
 * - 'Annual' / 'Yearly': If completed in any month within the same year, persists as Completed for that year.
 * - 'Half-Yearly': If completed in that half-year (Apr-Sep or Oct-Mar), persists within that half-year.
 * - 'Quarterly': If completed in that quarter, persists within that quarter.
 * - 'Monthly': Only scoped to the specific month.
 *
 * @param {Object} item - Compliance item { id, frequency, ... }
 * @param {Object} allMonthlyEntries - Map of all periods { "2026_9": { ... }, "2026_10": { ... } }
 * @param {number} activeMonth - Active month (1-12)
 * @param {number} activeYear - Active year
 * @returns {Object} Effective entry object
 */
export function resolveEffectiveEntry(item, allMonthlyEntries = {}, activeMonth = 9, activeYear = 2026) {
  if (!item?.id) return {};
  const currentPeriodKey = `${activeYear}_${activeMonth}`;
  const directEntry = allMonthlyEntries?.[currentPeriodKey]?.[item.id];

  // If already directly recorded as completed for this active period, return direct entry
  if (directEntry?.actual_payment_date && directEntry.actual_payment_date.trim().length > 0) {
    return directEntry;
  }

  const freq = (item.frequency || 'Monthly').toLowerCase().trim();

  // 1. One time: Check all periods for any completed payment
  if (freq === 'one time' || freq === 'onetime' || freq === 'one-time') {
    for (const [periodKey, periodMap] of Object.entries(allMonthlyEntries || {})) {
      const e = periodMap?.[item.id];
      if (e?.actual_payment_date && e.actual_payment_date.trim().length > 0) {
        return {
          ...e,
          status: 'Completed',
          isInheritedFromPeriod: periodKey,
        };
      }
    }
  }

  // 2. Annual / Yearly: Check all months in the activeYear for a completed payment
  if (freq === 'annual' || freq === 'yearly' || freq.includes('year')) {
    for (let m = 1; m <= 12; m++) {
      const pKey = `${activeYear}_${m}`;
      const e = allMonthlyEntries?.[pKey]?.[item.id];
      if (e?.actual_payment_date && e.actual_payment_date.trim().length > 0) {
        return {
          ...e,
          status: 'Completed',
          isInheritedFromPeriod: pKey,
        };
      }
    }
  }

  // 3. Half-Yearly: Check months in the same half-year
  if (freq.includes('half')) {
    const isHY1 = activeMonth >= 4 && activeMonth <= 9;
    const hyMonths = isHY1 ? [4, 5, 6, 7, 8, 9] : [10, 11, 12, 1, 2, 3];
    for (const m of hyMonths) {
      const pKey = `${activeYear}_${m}`;
      const e = allMonthlyEntries?.[pKey]?.[item.id];
      if (e?.actual_payment_date && e.actual_payment_date.trim().length > 0) {
        return {
          ...e,
          status: 'Completed',
          isInheritedFromPeriod: pKey,
        };
      }
    }
  }

  // 4. Quarterly: Check months in the same quarter
  if (freq.includes('quarter')) {
    const qIndex = Math.floor((activeMonth - 1) / 3);
    const qMonths = [qIndex * 3 + 1, qIndex * 3 + 2, qIndex * 3 + 3];
    for (const m of qMonths) {
      const pKey = `${activeYear}_${m}`;
      const e = allMonthlyEntries?.[pKey]?.[item.id];
      if (e?.actual_payment_date && e.actual_payment_date.trim().length > 0) {
        return {
          ...e,
          status: 'Completed',
          isInheritedFromPeriod: pKey,
        };
      }
    }
  }

  return directEntry || {};
}
