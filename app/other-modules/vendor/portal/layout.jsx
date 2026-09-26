'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import {
  LogOut,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export default function VendorPortalLayout({ children }) {
  const router = useRouter();
  const supabase = createClient();
  const [mounted, setMounted] = useState(false);
  const [vendorName, setVendorName] = useState('Vendor');
  const [vendorEmail, setVendorEmail] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('portal_vendor_name');
      if (cached) setVendorName(cached);
    }

    async function loadVendorInfo() {
      try {
        const { data, error: userError } = await supabase.auth.getUser().catch(() => ({ data: { user: null }, error: null }));
        const user = data?.user;
        if (!user) {
          router.push('/login');
          return;
        }

        setVendorEmail(user.email || '');

        if (user.user_metadata?.full_name) {
          setVendorName(user.user_metadata.full_name);
          if (typeof window !== 'undefined') {
            localStorage.setItem('portal_vendor_name', user.user_metadata.full_name);
          }
        }

        const res = await fetch('/other-modules/vendor/api/portal/profile').catch(() => null);
        if (res && res.ok) {
          let data = null;
          try {
            const text = await res.text();
            if (text) data = JSON.parse(text);
          } catch {}
          if (data?.profile?.vendor_name) {
            setVendorName(data.profile.vendor_name);
            if (typeof window !== 'undefined') {
              localStorage.setItem('portal_vendor_name', data.profile.vendor_name);
            }
            setIsCompleted(Boolean(data.profile.is_profile_completed));
          } else if (user.user_metadata?.full_name) {
            setVendorName(user.user_metadata.full_name);
          }
        }
      } catch (err) {
        console.error('Error loading vendor layout info:', err);
      } finally {
        setLoading(false);
      }
    }

    loadVendorInfo();

    const handleProfileUpdate = (e) => {
      if (e.detail?.vendor_name) {
        setVendorName(e.detail.vendor_name);
        if (typeof window !== 'undefined') {
          localStorage.setItem('portal_vendor_name', e.detail.vendor_name);
        }
      }
      if (typeof e.detail?.is_profile_completed !== 'undefined') {
        setIsCompleted(Boolean(e.detail.is_profile_completed));
      }
    };

    window.addEventListener('vendor_profile_updated', handleProfileUpdate);
    return () => window.removeEventListener('vendor_profile_updated', handleProfileUpdate);
  }, [router, supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut().catch(() => {});
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {});
    } catch {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portal_vendor_name');
    }
    router.push('/login');
  };

  const displayName = mounted ? vendorName : 'Vendor';
  const avatarInitial = displayName?.trim()?.charAt(0)?.toUpperCase() || 'V';

  return (
    <div className="min-h-screen flex flex-col bg-[linear-gradient(180deg,#f8fafc_0%,#eef6ff_100%)] text-slate-900 selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Bar styled like Universe One Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/75 backdrop-blur-md transition-all duration-300 py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex items-center justify-between">
          {/* Left: Universe One Logo */}
          <div className="flex items-center gap-3">
            <div className="h-14 w-48 flex items-center justify-start bg-transparent">
              <Image
                src="/assets/6a9fabaa-d09b-4d25-9e8c-75bad4b9389f.png"
                alt="Universe One logo"
                width={190}
                height={56}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* Right: User Pill & Signature Logout */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-100/60 p-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)] backdrop-blur-sm">
              <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 shadow-xs">
                <div
                  suppressHydrationWarning
                  className="relative h-7 w-7 overflow-hidden rounded-full border border-violet-100 bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700"
                >
                  {avatarInitial}
                </div>
                <div
                  suppressHydrationWarning
                  className="text-xs font-semibold text-slate-700 max-w-[140px] sm:max-w-[200px] truncate"
                >
                  {displayName}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-all duration-300 hover:text-white hover:bg-[#0372CC] hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.6),_0_2px_6px_rgba(3,114,204,0.3)] hover:scale-105 active:scale-95"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:px-10 lg:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/70 py-4 mt-auto backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} BNC Global. All rights reserved.</span>
          <span>Vendora &bull; Powered by Universe One</span>
        </div>
      </footer>
    </div>
  );
}
