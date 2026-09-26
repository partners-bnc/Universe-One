export const LOGIN_PORTALS = ['super_admin', 'hr_admin', 'support', 'employee', 'vendor'];

export function normalizeProfileRole(role) {
  const normalized = String(role || '').trim().toLowerCase();

  if (!normalized) return null;
  if (normalized === 'admin') return 'hr_admin';
  if (normalized === 'vendor' || normalized === 'vendor_client' || normalized === 'client_vendor') return 'vendor';

  return normalized;
}

export function normalizeLoginPortal(portal) {
  const normalized = String(portal || '').trim().toLowerCase();

  if (normalized === 'superadmin') return 'super_admin';
  if (normalized === 'hr') return 'hr_admin';
  if (normalized === 'supportteam') return 'support';
  if (normalized === 'vendor' || normalized === 'vendor_client' || normalized === 'client') return 'vendor';

  return normalized || 'employee';
}

export function isSuperAdminRole(role) {
  return normalizeProfileRole(role) === 'super_admin';
}

export function isHrAdminRole(role) {
  const normalized = normalizeProfileRole(role);
  return normalized === 'hr_admin' || normalized === 'super_admin';
}

export function isSupportRole(role) {
  return normalizeProfileRole(role) === 'support';
}

export function isVendorRole(role) {
  return normalizeProfileRole(role) === 'vendor';
}

export function resolveAccountType({ profileRole, employee, vendorProfile }) {
  const normalizedProfileRole = normalizeProfileRole(profileRole);

  if (normalizedProfileRole === 'super_admin') {
    return 'super_admin';
  }

  if (normalizedProfileRole === 'hr_admin') {
    return 'hr_admin';
  }

  if (normalizedProfileRole === 'support') {
    return 'support';
  }

  if (normalizedProfileRole === 'vendor' || vendorProfile) {
    return 'vendor';
  }

  if (employee) {
    return 'employee';
  }

  return null;
}

export function matchesLoginPortal(selectedPortal, accountType) {
  const normalizedPortal = normalizeLoginPortal(selectedPortal);
  return normalizedPortal === accountType;
}

export function getDefaultDestinationForAccountType(accountType) {
  switch (accountType) {
    case 'super_admin':
      return '/Taskmanager/admin';
    case 'hr_admin':
    case 'support':
      return '/HRM/hrm/admin';
    case 'employee':
      return '/HRM/hrm';
    case 'vendor':
      return '/other-modules/vendor/portal';
    default:
      return '/login';
  }
}

export function getAccountTypeLabel(accountType) {
  switch (accountType) {
    case 'super_admin':
      return 'Super Admin';
    case 'hr_admin':
      return 'HR Admin';
    case 'employee':
      return 'Employee';
    case 'support':
      return 'Support';
    case 'vendor':
      return 'Vendor Partner';
    default:
      return 'User';
  }
}

