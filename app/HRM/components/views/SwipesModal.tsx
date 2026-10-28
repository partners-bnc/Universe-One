'use client';

import React, { useEffect, useState } from 'react';
import { formatDateLong } from './attendanceShared';

export interface SwipeItem {
  id: string;
  swipeTime: string;
  swipeType: 'IN' | 'OUT' | string;
  doorAddress: string;
}

interface SwipesModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  employeeId?: string;
  employeeName?: string;
}

export default function SwipesModal({
  isOpen,
  onClose,
  date,
  employeeId,
  employeeName,
}: SwipesModalProps) {
  const [swipes, setSwipes] = useState<SwipeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resolvedEmpCode, setResolvedEmpCode] = useState<string>('');
  const [resolvedEmpName, setResolvedEmpName] = useState<string>('');

  useEffect(() => {
    if (!isOpen || !date) return;

    let active = true;
    async function fetchSwipes() {
      try {
        setIsLoading(true);
        setError(null);
        const params = new URLSearchParams({ date });
        if (employeeId) {
          params.set('employeeId', employeeId);
        }
        const res = await fetch(`/HRM/api/attendance/swipes?${params.toString()}`);
        const data = await res.json();
        if (!active) return;

        if (!res.ok || data.error) {
          setError(data.error || 'Failed to load swipe records');
          setSwipes([]);
        } else {
          setSwipes(Array.isArray(data.swipes) ? data.swipes : []);
          if (data.employeeId) setResolvedEmpCode(data.employeeId);
          if (data.employeeName) setResolvedEmpName(data.employeeName);
        }
      } catch (err: any) {
        if (!active) return;
        setError(err.message || 'Network error occurred while fetching swipes');
        setSwipes([]);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    fetchSwipes();
    return () => {
      active = false;
    };
  }, [isOpen, date, employeeId]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const displayName = employeeName || resolvedEmpName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-outline-variant/15 bg-surface-container-lowest shadow-[0_24px_80px_rgba(15,23,42,0.25)] flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-outline-variant/10 px-6 py-5 bg-surface-container-lowest">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[24px]">fingerprint</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-headline text-lg font-bold text-on-surface">Daily Swipe Details</h3>
                <span className="inline-flex items-center rounded-full bg-surface-container-low px-2.5 py-0.5 text-[11px] font-bold text-on-surface-variant">
                  {swipes.length} {swipes.length === 1 ? 'Swipe' : 'Swipes'}
                </span>
              </div>
              <p className="mt-1 text-xs text-on-surface-variant">
                {formatDateLong(date)}
                {displayName ? ` • ${displayName}` : ''}
                {resolvedEmpCode ? ` (${resolvedEmpCode})` : ''}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
            aria-label="Close dialog"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-3 py-6">
              <div className="h-10 w-full animate-pulse rounded-xl bg-surface-container-low" />
              <div className="h-14 w-full animate-pulse rounded-xl bg-surface-container-low" />
              <div className="h-14 w-full animate-pulse rounded-xl bg-surface-container-low" />
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>
                <span>{error}</span>
              </div>
            </div>
          ) : swipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant/40 mb-3">
                <span className="material-symbols-outlined text-3xl">touch_app</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">No Swipes Recorded</h4>
              <p className="text-xs text-on-surface-variant mt-1 max-w-xs">
                No biometric or door punch logs were detected for {formatDateLong(date)}.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="border-b border-outline-variant/10 bg-surface-container-low/60 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/80">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Swipe Time</th>
                    <th className="px-4 py-3">Direction</th>
                    <th className="px-4 py-3">Door / Device Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10 font-medium text-on-surface">
                  {swipes.map((swipe, idx) => {
                    const isCheckIn = swipe.swipeType.toUpperCase() === 'IN';
                    return (
                      <tr key={swipe.id || idx} className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="px-4 py-3.5 text-on-surface-variant/60 font-mono text-[11px]">{idx + 1}</td>
                        <td className="px-4 py-3.5 font-bold font-mono text-xs text-on-surface">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[15px] text-on-surface-variant/70">
                              schedule
                            </span>
                            <span>{swipe.swipeTime}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isCheckIn
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[13px]">
                              {isCheckIn ? 'login' : 'logout'}
                            </span>
                            {swipe.swipeType.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-on-surface-variant">
                          <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[15px] text-on-surface-variant/50">
                              location_on
                            </span>
                            <span>{swipe.doorAddress || 'Main Entrance'}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-outline-variant/10 px-6 py-4 bg-surface-container-lowest flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-outline-variant/20 bg-surface-container-low px-4 py-2 text-xs font-bold text-on-surface hover:bg-surface-container transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
