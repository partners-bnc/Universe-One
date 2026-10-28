'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useHrmFeedback } from '../../ui/HrmFeedback';
import GlassKpi from './dashboard/GlassKpi';
import TodayAttendance from './dashboard/TodayAttendance';
import ProbationPanel, { buildProbationRows } from './dashboard/ProbationPanel';
import CelebrationCard from './dashboard/CelebrationCard';
import LeaveToday from './dashboard/LeaveToday';
import { Avatar, Panel } from './dashboard/shared';

// HR admin home: glass KPIs, today's check-ins, probation progress, leave today and celebrations.
// UI only — it reads the existing APIs: /HRM/api/admin/dashboard, /HRM/api/employees and /HRM/api/admin/attendance (daily).

function formatDate(value) {
  if (!value) {
    return '--';
  }
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatBirthday(value) {
  if (!value) {
    return '--';
  }
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

function formatAnniversary(value) {
  if (!value) {
    return '--';
  }
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

function formatBirthdayNames(employees = []) {
  const names = employees
    .map((employee) => String(employee?.name || '').trim())
    .filter(Boolean)
    .slice(0, 3);

  if (names.length === 0) {
    return 'Your team';
  }

  if (names.length === 1) {
    return names[0];
  }

  if (names.length === 2) {
    return `${names[0]} & ${names[1]}`;
  }

  return `${names[0]}, ${names[1]} & ${names[2]}`;
}

function getBirthdayCopy(employees = []) {
  const leadEmployee = employees[0];
  const groupedNames = formatBirthdayNames(employees);

  if (!leadEmployee) {
    return {
      heading: 'No birthdays lined up yet',
      body: 'Add employee birth dates in the HR master record to show upcoming birthdays here.',
    };
  }

  if (employees.length > 1) {
    if (leadEmployee.daysUntilBirthday === 0) {
      return {
        heading: `Happy Birthday ${groupedNames}!`,
        body: 'Wishing them joy, laughter, and a truly beautiful celebration together.',
      };
    }

    if (leadEmployee.daysUntilBirthday === 1) {
      return {
        heading: `${groupedNames} celebrate tomorrow`,
        body: 'A lovely celebration is almost here. Wishing them smiles and happy moments ahead.',
      };
    }

    return {
      heading: `Happy Birthday ${groupedNames}`,
      body: 'Sending warm wishes for a joyful celebration and a wonderful year ahead.',
    };
  }

  if (leadEmployee.daysUntilBirthday === 0) {
    return {
      heading: `Today is ${leadEmployee.name}'s birthday`,
      body: 'Wishing them happiness, celebration, and a day full of special moments.',
    };
  }

  if (leadEmployee.daysUntilBirthday === 1) {
    return {
      heading: `${leadEmployee.name}'s birthday is tomorrow`,
      body: 'A special day is almost here. Sending warm wishes for a joyful celebration.',
    };
  }

  return {
    heading: `${leadEmployee.name}'s birthday is coming up`,
    body: 'A special celebration is on the way. Sending warm wishes for a beautiful birthday ahead.',
  };
}

function formatAnniversaryNames(employees = []) {
  const names = employees
    .map((employee) => String(employee?.name || '').trim())
    .filter(Boolean)
    .slice(0, 3);

  if (names.length === 0) {
    return 'Your team';
  }

  if (names.length === 1) {
    return names[0];
  }

  if (names.length === 2) {
    return `${names[0]} & ${names[1]}`;
  }

  return `${names[0]}, ${names[1]} & ${names[2]}`;
}

function getAnniversaryYearLabel(years) {
  const value = Number(years || 0);
  if (!value) {
    return 'Work anniversary';
  }
  if (value % 100 >= 11 && value % 100 <= 13) {
    return `${value}th work anniversary`;
  }
  const suffix = value % 10 === 1 ? 'st' : value % 10 === 2 ? 'nd' : value % 10 === 3 ? 'rd' : 'th';
  return `${value}${suffix} work anniversary`;
}

function getAnniversaryCopy(employees = []) {
  const leadEmployee = employees[0];
  const groupedNames = formatAnniversaryNames(employees);

  if (!leadEmployee) {
    return {
      heading: 'No anniversaries lined up yet',
      body: 'Employee work anniversaries will appear here once joining dates are available in HR records.',
    };
  }

  if (employees.length > 1) {
    if (leadEmployee.daysUntilAnniversary === 0) {
      return {
        heading: `${groupedNames} celebrate today`,
        body: 'A wonderful milestone day is here. Take a moment to celebrate their time and contribution.',
      };
    }

    if (leadEmployee.daysUntilAnniversary === 1) {
      return {
        heading: `${groupedNames} celebrate tomorrow`,
        body: 'Their work anniversary is just around the corner. A lovely team moment is coming up.',
      };
    }

    return {
      heading: `${groupedNames} anniversaries are coming up`,
      body: 'Their next work milestone is approaching soon. A perfect time to celebrate their journey with the team.',
    };
  }

  if (leadEmployee.daysUntilAnniversary === 0) {
    return {
      heading: `${leadEmployee.name} completes ${leadEmployee.completedYears} year${leadEmployee.completedYears === 1 ? '' : 's'} today`,
      body: 'Today marks a meaningful work milestone worth celebrating and recognizing with the team.',
    };
  }

  if (leadEmployee.daysUntilAnniversary === 1) {
    return {
      heading: `${leadEmployee.name} completes ${leadEmployee.completedYears} year${leadEmployee.completedYears === 1 ? '' : 's'} tomorrow`,
      body: 'Their next work anniversary is almost here. A thoughtful celebration can be planned in advance.',
    };
  }

  return {
    heading: `${leadEmployee.name}'s work anniversary is coming up`,
    body: `They will soon complete ${leadEmployee.completedYears} year${leadEmployee.completedYears === 1 ? '' : 's'} with the company.`,
  };
}

export default function AdminDashboard({ admin, setCurrentTab, setSelectedEmployeeId }) {
  const { showFeedback } = useHrmFeedback();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDownloadingBirthdayCard, setIsDownloadingBirthdayCard] = useState(false);
  // the clock starts after mount, so the server and browser render the same first frame
  const [currentDateTime, setCurrentDateTime] = useState(null);
  // extra data for the attendance and probation panels (existing APIs, read-only)
  const [people, setPeople] = useState({ employees: [], loading: true, error: '' });
  const [attendance, setAttendance] = useState({ rows: [], loading: true, error: '' });

  useEffect(() => {
    let active = true;
    const load = async (url, pick) => {
      const response = await fetch(url, { method: 'GET' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Failed to load');
      return pick(result);
    };
    load('/HRM/api/employees', (r) => r.employees || [])
      .then((employees) => { if (active) setPeople({ employees, loading: false, error: '' }); })
      .catch((e) => { if (active) setPeople({ employees: [], loading: false, error: e.message || 'Failed to load employees' }); });
    load('/HRM/api/admin/attendance?mode=daily', (r) => r.rows || [])
      .then((rows) => { if (active) setAttendance({ rows, loading: false, error: '' }); })
      .catch((e) => { if (active) setAttendance({ rows: [], loading: false, error: e.message || 'Failed to load attendance' }); });
    return () => { active = false; };
  }, []);

  const photos = useMemo(() => new Map(people.employees.map((e) => [e.id, e.profile_picture_url || ''])), [people.employees]);
  const probationRows = useMemo(() => buildProbationRows(people.employees), [people.employees]);
  const workingToday = attendance.rows.filter((row) => !['on_leave', 'holiday', 'weekend'].includes(String(row.status || '').toLowerCase()));
  const checkedInToday = workingToday.filter((row) => (row.checkIn && !['--', '-'].includes(row.checkIn)) || Number(row.swipeCount) > 0).length;


  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('/HRM/api/admin/dashboard', { method: 'GET' });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to load HR admin dashboard');
        }

        if (active) {
          setDashboard(result);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message || 'Failed to load HR admin dashboard');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const tick = () => setCurrentDateTime(new Date());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);

    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, []);

  const greetingName = String(admin?.name || dashboard?.admin?.name || 'HR Admin').replace(/\bHr\b/g, 'HR');
  const liveDateTimeLabel = currentDateTime?.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const helperText = useMemo(() => {
    const department = dashboard?.admin?.department || admin?.department || 'HR';
    const designation = dashboard?.admin?.designation || admin?.designation || 'Administrator';
    return `${designation} • ${department}`;
  }, [admin?.department, admin?.designation, dashboard?.admin?.department, dashboard?.admin?.designation]);

  const metrics = dashboard?.metrics || {
    employeeCount: 0,
    activeEmployeeCount: 0,
    onLeaveEmployeeCount: 0,
    pendingTaskCount: 0,
    todayHalfDayAttendanceCount: 0,
  };
  const featuredBirthdayGroup = useMemo(() => {
    const upcomingBirthdays = dashboard?.upcomingBirthdays || [];
    if (!upcomingBirthdays.length) {
      return [];
    }

    const nearestOffset = upcomingBirthdays[0].daysUntilBirthday;
    return upcomingBirthdays.filter((employee) => employee.daysUntilBirthday === nearestOffset);
  }, [dashboard?.upcomingBirthdays]);
  const featuredBirthday = featuredBirthdayGroup[0] || null;
  const birthdayCopy = getBirthdayCopy(featuredBirthdayGroup);
  const birthdayLabel = featuredBirthday?.daysUntilBirthday === 0 ? 'Today Birthday' : 'Upcoming Birthday';
  const visibleBirthdayEmployees = featuredBirthdayGroup.slice(0, 4);
  const featuredAnniversaryGroup = useMemo(() => {
    const upcomingAnniversaries = dashboard?.upcomingAnniversaries || [];
    if (!upcomingAnniversaries.length) {
      return [];
    }

    const nearestOffset = upcomingAnniversaries[0].daysUntilAnniversary;
    return upcomingAnniversaries.filter((employee) => employee.daysUntilAnniversary === nearestOffset);
  }, [dashboard?.upcomingAnniversaries]);
  const featuredAnniversary = featuredAnniversaryGroup[0] || null;
  const anniversaryCopy = getAnniversaryCopy(featuredAnniversaryGroup);
  const anniversaryLabel = featuredAnniversary?.daysUntilAnniversary === 0 ? 'Today Anniversary' : 'Upcoming Anniversary';
  const visibleAnniversaryEmployees = featuredAnniversaryGroup.slice(0, 4);

  const handleBirthdayCardDownload = async () => {
    if (isDownloadingBirthdayCard || !featuredBirthday) {
      return;
    }

    try {
      setIsDownloadingBirthdayCard(true);
      const normalizedDate = formatBirthday(featuredBirthday.date_of_birth).replace(/\s+/g, '-').toLowerCase();
      const response = await fetch('/HRM/api/admin/birthday-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          label: birthdayLabel,
          heading: birthdayCopy.heading,
          message: birthdayCopy.body,
          dateLabel: formatBirthday(featuredBirthday.date_of_birth),
          moreCount: Math.max(0, featuredBirthdayGroup.length - visibleBirthdayEmployees.length),
          employees: visibleBirthdayEmployees.map((employee) => ({
            id: employee.id,
            name: employee.name,
            profilePictureUrl: employee.profile_picture_url || '',
          })),
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(result?.error || 'Unable to generate birthday card image.');
      }

      const blob = await response.blob();
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `birthday-card-${normalizedDate}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (downloadError) {
      showFeedback({
        type: 'error',
        title: 'Download Failed',
        message: downloadError?.message || 'Unable to download the birthday card right now.',
      });
    } finally {
      setIsDownloadingBirthdayCard(false);
    }
  };
  const lifecycleReminders = dashboard?.lifecycleReminders || [];
  const upcomingBirthdays = dashboard?.upcomingBirthdays || [];
  const upcomingAnniversaries = dashboard?.upcomingAnniversaries || [];
  const featuredBirthdayIds = new Set(featuredBirthdayGroup.map((employee) => employee.id));
  const featuredAnniversaryIds = new Set(featuredAnniversaryGroup.map((employee) => employee.id));
  const nextBirthdays = upcomingBirthdays.filter((employee) => !featuredBirthdayIds.has(employee.id)).slice(0, 4);
  const nextAnniversaries = upcomingAnniversaries.filter((employee) => !featuredAnniversaryIds.has(employee.id)).slice(0, 4);
  const openEmployee = (employeeId) => {
    setSelectedEmployeeId?.(employeeId);
    setCurrentTab?.('admin-employee-profile');
  };
  const countdown = (days, todayWord) => (days === 0 ? todayWord : days === 1 ? 'Tomorrow' : `In ${days} days`);
  const kpiLoading = loading || !dashboard;

  return (
    <div className="relative min-h-full">
      {/* soft page backdrop so the glass has something to sit on */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#dbe8ff] opacity-70 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-[#ffe4ef] opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#fff1d6] opacity-60 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1400px] p-5 md:p-7">
        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-headline text-[28px] font-extrabold tracking-tight text-slate-900 lg:text-[32px]">Welcome, {greetingName} 👋</h2>
            <p className="mt-1 text-sm font-medium tabular-nums text-slate-500">{liveDateTimeLabel || ' '}</p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentTab?.('admin-add-employee')}
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-gradient-to-b from-[#4d8be6] to-[#2559b0] px-5 py-3 text-sm font-bold text-white shadow-[0_14px_28px_-12px_rgba(37,89,176,0.7)] transition hover:-translate-y-0.5 sm:self-auto"
          >
            <span className="material-symbols-outlined text-[19px]">person_add</span>
            Add Employee
          </button>
        </section>

        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">{error}</div>
        ) : null}

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
          <GlassKpi label="Active employees" value={metrics.activeEmployeeCount} icon="groups" tone="blue" loading={kpiLoading} delay={0} />
          <GlassKpi label="Checked in today" value={checkedInToday} of={workingToday.length || undefined} icon="how_to_reg" tone="emerald" loading={attendance.loading} delay={60} />
          <GlassKpi label="On leave today" value={metrics.onLeaveEmployeeCount} icon="beach_access" tone="amber" loading={kpiLoading} delay={120} />
          <GlassKpi label="Pending HR tasks" value={metrics.pendingTaskCount} icon="pending_actions" tone="purple" loading={kpiLoading} delay={180} />
          <GlassKpi label="On probation" value={probationRows.length} icon="hourglass_top" tone="blue" loading={people.loading} delay={240} />
        </section>

        {/* left: attendance + probation; right: birthday and anniversary cards stacked close together */}
        <section className="mt-6 grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0 space-y-6">
            <TodayAttendance rows={attendance.rows} photos={photos} loading={attendance.loading} error={attendance.error} onOpenEmployee={openEmployee} />
            <ProbationPanel rows={probationRows} loading={people.loading} error={people.error} onOpenEmployee={openEmployee} />
          </div>
          <div className="space-y-4">
            <CelebrationCard
              kind="birthday"
              label={birthdayLabel}
              icon="cake"
              featured={kpiLoading ? [] : visibleBirthdayEmployees}
              heading={birthdayCopy.heading}
              body={birthdayCopy.body}
              chips={featuredBirthday ? [<>{countdown(featuredBirthday.daysUntilBirthday, 'Today 🎉')} · {formatBirthday(featuredBirthday.date_of_birth)}</>] : []}
              next={nextBirthdays}
              nextMeta={(employee) => formatBirthday(employee.date_of_birth)}
              moreCount={Math.max(0, featuredBirthdayGroup.length - visibleBirthdayEmployees.length)}
              empty={{ icon: 'cake', title: kpiLoading ? 'Loading birthdays…' : 'No birthdays available yet', message: kpiLoading ? '' : 'Add employee birth dates in the HR records to show upcoming birthdays here.' }}
            />
            <CelebrationCard
              kind="anniversary"
              label={anniversaryLabel}
              icon="workspace_premium"
              featured={kpiLoading ? [] : visibleAnniversaryEmployees}
              heading={anniversaryCopy.heading}
              body={anniversaryCopy.body}
              badge={featuredAnniversary ? <span className="whitespace-nowrap rounded-full bg-[#faf3e3] px-2.5 py-1 text-[11px] font-extrabold text-[#9a6b14] ring-1 ring-[#efe0bf]">{featuredAnniversary.completedYears} yr{featuredAnniversary.completedYears === 1 ? '' : 's'}</span> : null}
              chips={featuredAnniversary ? [<>{countdown(featuredAnniversary.daysUntilAnniversary, 'Today 🎉')} · {formatAnniversary(featuredAnniversary.date_of_joining)}</>, <>{getAnniversaryYearLabel(featuredAnniversary.completedYears)}</>] : []}
              next={nextAnniversaries}
              nextMeta={(employee) => `${employee.completedYears} yr${employee.completedYears === 1 ? '' : 's'} · ${formatAnniversary(employee.date_of_joining)}`}
              moreCount={Math.max(0, featuredAnniversaryGroup.length - visibleAnniversaryEmployees.length)}
              empty={{ icon: 'workspace_premium', title: kpiLoading ? 'Loading anniversaries…' : 'No anniversaries available yet', message: kpiLoading ? '' : 'Add employee joining dates in the HR records to show work anniversaries here.' }}
            />
          </div>
        </section>

        <section className={`mt-6 grid grid-cols-1 items-start gap-6 ${lifecycleReminders.length ? 'xl:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]' : ''}`}>
          <LeaveToday employees={dashboard?.employeesOnLeaveToday || []} onOpenEmployee={openEmployee} />
          {lifecycleReminders.length ? (
            <Panel title="Action Needed" icon="notification_important" badge={<span className="rounded-full bg-[#eef4ff] px-3 py-1 text-xs font-bold text-[#2558a2]">{lifecycleReminders.length}</span>}>
              <div className="space-y-2">
                {lifecycleReminders.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openEmployee(item.id)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-white/70 px-3 py-2.5 text-left transition hover:border-[#d3e2f8] hover:bg-white"
                  >
                    <Avatar name={item.name} src={item.profile_picture_url} size={36} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-bold text-slate-900">{item.name || 'Employee'}</p>
                      <p className="truncate text-xs text-slate-500">{item.stage === 'probation' ? 'Confirm after probation' : 'Review notice period'} · {item.employee_id || '—'}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[#eef4ff] px-2.5 py-1 text-[11px] font-bold text-[#2558a2]">{formatDate(item.dueDate)}</span>
                  </button>
                ))}
              </div>
            </Panel>
          ) : null}
        </section>
      </div>
    </div>
  );
}
