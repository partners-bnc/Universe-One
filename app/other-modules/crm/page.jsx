"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCrm } from './context/CrmContext';

export default function CRMIndex() {
  const router = useRouter();
  const { currentUser } = useCrm();

  useEffect(() => {
    // Role-based redirection logic
    if (currentUser.role === "admin" || currentUser.role === "manager") {
      router.replace('/other-modules/crm/dashboard');
    } else {
      router.replace('/other-modules/crm/leads');
    }
  }, [currentUser.role, router]);

  return (
    <div className="flex h-full items-center justify-center p-8 bg-[#F5F5F7] dark:bg-[#1D1D1F] transition-colors">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-8 h-8 border-3 border-[#0071E3] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#86868B] text-sm font-medium">Authenticating & Routing...</p>
      </div>
    </div>
  );
}