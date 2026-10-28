// Small formatting helpers for Section 04.

// "2023-03-12" or an ISO timestamp → Date in local time (date-only values never shift a day)
export function parseDate(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value || '');
  if (!m) return null;
  const d = new Date(+m[1], +m[2] - 1, +m[3]);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const formatDate = (value) => {
  const d = parseDate(value);
  return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
};

// whole years and months from a date until today
export function tenure(value) {
  const d = parseDate(value);
  if (!d) return null;
  const now = new Date();
  let months = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth();
  if (now.getDate() < d.getDate()) months -= 1;
  months = Math.max(0, months);
  return { years: Math.floor(months / 12), months: months % 12 };
}

export const tenureText = (t) => {
  if (!t) return '';
  const parts = [];
  if (t.years) parts.push(`${t.years} ${t.years === 1 ? 'year' : 'years'}`);
  if (t.months || !t.years) parts.push(`${t.months} ${t.months === 1 ? 'month' : 'months'}`);
  return parts.join(' ');
};

export function formatMoney(value) {
  const n = Number(value);
  if (value === null || value === '' || !Number.isFinite(n)) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

export function formatSize(bytes) {
  const n = Number(bytes);
  if (!Number.isFinite(n) || n <= 0) return '';
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export const firstName = (name = '') => name.trim().split(/\s+/)[0] || '';
