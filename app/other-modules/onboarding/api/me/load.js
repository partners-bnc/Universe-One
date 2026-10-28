import { adminClient } from '@/utils/supabase/admin';
import { deriveEmploymentFields, formatEmploymentValue, getEmployeeTypeLabel } from '@/utils/hrm-employment';

// Loads everything Section 04 (Your Role & Team) shows for one employee. Used by ./route.js (signed-in employee only).

const SELF_BASE = `
  id, employee_id, name, email, role, profile_picture_url, phone, personal_email, date_of_joining, employee_status,
  experience_company_name, total_experience, working_schedule_label, working_days, second_saturday_off, address,
  nationality, marital_status, reporting_manager_id,
  module_access:hrm_module_access!module_access_employee_id_fkey (
    task_manager, task_manager_role, hrm_admin, auditing, auditing_role, crm, crm_role, vendor, vendor_role, finance, finance_role
  ),
  department:hrm_departments (id, name),
  designation:hrm_designations (id, title)
`;
const SELF_WITH_SALARY = `${SELF_BASE}, salary`;
const SELF_FULL = `${SELF_WITH_SALARY}, employee_type, employment_lifecycle_status, current_stage, probation_started_at,
  probation_ends_at, notice_started_at, notice_ends_at, confirmation_date`;

const COLLEAGUE = `id, employee_id, name, email, profile_picture_url, employee_status, employment_lifecycle_status, separated_at,
  access_disabled_at, designation:hrm_designations (id, title), department:hrm_departments (id, name)`;

const isMissingColumn = (error) => {
  const m = String(error?.message || '').toLowerCase();
  return m.includes('could not find the column') || (m.includes('column') && m.includes('does not exist'));
};

const isActive = (e) => {
  if (!e || e.separated_at || e.access_disabled_at) return false;
  const lifecycle = String(e.employment_lifecycle_status || '').toLowerCase();
  const status = String(e.employee_status || '').toLowerCase();
  if (lifecycle === 'separated' || status === 'separated') return false;
  return lifecycle === 'active' || !lifecycle || ['active', 'probation', 'confirmed'].includes(status);
};

const person = (e) => ({
  id: e.id,
  code: e.employee_id || '',
  name: e.name || '',
  role: e.designation?.title || '',
  department: e.department?.name || '',
  photo: e.profile_picture_url || '',
  email: e.email || '',
});

async function loadSelf(id) {
  for (const select of [SELF_FULL, SELF_WITH_SALARY, SELF_BASE]) {
    const result = await adminClient.from('hrm_employees').select(select).eq('id', id).single();
    if (!result.error || !isMissingColumn(result.error)) return result;
  }
  return { data: null, error: new Error('Employee not found') };
}

/** The employee's own profile in full, plus their manager, their direct reports and their documents. */
export async function loadRoleAndTeam(employeeId) {
  const { data: me, error } = await loadSelf(employeeId);
  if (error || !me) return null;

  const [managerRes, reportsRes, docsRes] = await Promise.all([
    me.reporting_manager_id
      ? adminClient.from('hrm_employees').select(COLLEAGUE).eq('id', me.reporting_manager_id).maybeSingle()
      : Promise.resolve({ data: null }),
    adminClient.from('hrm_employees').select(COLLEAGUE).eq('reporting_manager_id', me.id).neq('id', me.id).order('name'),
    adminClient.from('hrm_employee_documents').select('*').eq('employee_id', me.id).order('created_at', { ascending: false }),
  ]);

  const employment = deriveEmploymentFields(me);
  const moduleAccess = Array.isArray(me.module_access) ? me.module_access[0] : me.module_access;

  return {
    profile: {
      id: me.id,
      code: me.employee_id || '',
      name: me.name || '',
      photo: me.profile_picture_url || '',
      role: me.designation?.title || me.role || '',
      department: me.department?.name || '',
      email: me.email || '',
      personalEmail: me.personal_email || '',
      phone: me.phone || '',
      address: me.address || '',
      nationality: me.nationality || '',
      maritalStatus: me.marital_status || '',
      joined: me.date_of_joining || '',
      confirmed: me.confirmation_date || '',
      probationStart: me.probation_started_at || '',
      probationEnd: me.probation_ends_at || '',
      employeeType: getEmployeeTypeLabel(me.employee_type ?? employment.employeeType),
      lifecycle: formatEmploymentValue(me.employment_lifecycle_status ?? employment.employmentLifecycleStatus ?? 'active'),
      stage: formatEmploymentValue(me.current_stage ?? employment.currentStage ?? 'none'),
      schedule: me.working_schedule_label || '',
      workingDays: me.working_days ?? null,
      secondSaturdayOff: Boolean(me.second_saturday_off),
      previousCompany: me.experience_company_name || '',
      totalExperience: me.total_experience ?? '',
      salary: me.salary ?? null,
      modules: moduleAccess || {},
    },
    manager: managerRes.data ? person(managerRes.data) : null,
    reports: (reportsRes.data || []).filter(isActive).map(person),
    documents: (docsRes.data || []).map((d) => ({
      id: d.id,
      type: d.document_type || '',
      name: d.file_name || '',
      url: d.file_url || '',
      size: d.file_size ?? null,
      uploaded: d.updated_at || d.created_at || '',
    })),
  };
}
