'use client';

import React, { useCallback, useEffect, useState } from 'react';
import EmployeePageHeader from '../../ui/EmployeePageHeader';
import { useHrmFeedback } from '../../ui/HrmFeedback';

type Settings = {
  show_greeting: boolean;
  show_date_card: boolean;
  show_attendance_notice: boolean;
  show_festive_decor: boolean;
};

const DEFAULTS: Settings = {
  show_greeting: true,
  show_date_card: true,
  show_attendance_notice: true,
  show_festive_decor: false,
};

const ITEMS: Array<{ key: keyof Settings; icon: string; title: string; description: string; warning?: string }> = [
  {
    key: 'show_festive_decor',
    icon: 'celebration',
    title: 'Festive decoration & crackers',
    description: 'Hanging lanterns and cracker animation at the top of every employee’s home page. Turn on for Diwali and off when the festival ends.',
  },
  {
    key: 'show_greeting',
    icon: 'waving_hand',
    title: 'Greeting header',
    description: 'The “Good Morning / Evening, <name>” heading and login ID line.',
  },
  {
    key: 'show_date_card',
    icon: 'today',
    title: 'Date card',
    description: 'The date and day card at the top right.',
  },
  {
    key: 'show_attendance_notice',
    icon: 'warning',
    title: 'Attendance notice',
    description: 'The warning shown when the previous shift was incomplete.',
    warning: 'Hiding this removes the missed-hours warning for all employees.',
  },
];

function Switch({ checked, disabled, onChange, label }: { checked: boolean; disabled?: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition disabled:opacity-60 ${checked ? 'bg-violet-600' : 'bg-slate-300'}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

export default function HomeSettingsManager() {
  const { showFeedback } = useHrmFeedback();
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ updatedAt?: string | null; updatedBy?: string | null }>({});
  const [setupPending, setSetupPending] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/HRM/api/admin/home-settings', { cache: 'no-store' });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Failed to load settings');
      setSettings({ ...DEFAULTS, ...(result.settings || {}) });
      setMeta({ updatedAt: result.updatedAt, updatedBy: result.updatedBy });
      setSetupPending(Boolean(result.setupPending));
    } catch (error: any) {
      showFeedback({ type: 'error', title: 'Could not load settings', message: error.message || 'Please refresh and try again.' });
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  useEffect(() => {
    load();
  }, [load]);

  async function toggle(key: keyof Settings, value: boolean) {
    const previous = settings;
    setSettings({ ...settings, [key]: value });
    setSavingKey(key);
    try {
      const response = await fetch('/HRM/api/admin/home-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Failed to save');
      setSettings({ ...DEFAULTS, ...result.settings });
      showFeedback({ type: 'success', title: 'Saved', message: 'Home screen updated for all employees.' });
    } catch (error: any) {
      setSettings(previous);
      showFeedback({ type: 'error', title: 'Could not save', message: error.message || 'Please try again.' });
    } finally {
      setSavingKey(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <EmployeePageHeader
        icon="tune"
        title="Home Screen Settings"
        description="Choose which sections appear at the top of the employee home page. Changes apply to all employees immediately."
      />

      {setupPending ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          The settings table isn’t created yet. Run the latest Supabase migration (<code>hrm_home_settings</code>) and refresh this page.
        </div>
      ) : null}

      <div className="divide-y divide-outline-variant/10 rounded-[1.75rem] border border-outline-variant/10 bg-surface-container-lowest shadow-sm">
        {ITEMS.map((item) => (
          <div key={item.key} className="flex items-start gap-4 px-6 py-5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-on-surface">{item.title}</p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">{item.description}</p>
              {item.warning && !settings[item.key] ? (
                <p className="mt-1 text-xs font-semibold text-amber-700">{item.warning}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="w-8 text-right text-xs font-semibold text-slate-500">{settings[item.key] ? 'On' : 'Off'}</span>
              <Switch
                checked={settings[item.key]}
                disabled={loading || savingKey === item.key || setupPending}
                onChange={(value) => toggle(item.key, value)}
                label={item.title}
              />
            </div>
          </div>
        ))}
      </div>

      {meta.updatedAt ? (
        <p className="text-xs text-on-surface-variant">
          Last changed {new Date(meta.updatedAt).toLocaleString()}{meta.updatedBy ? ` by ${meta.updatedBy}` : ''}.
        </p>
      ) : null}
    </div>
  );
}
