"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/other-modules/crm/leads");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-[#F5F5F7] dark:bg-[#1D1D1F]">
      <div className="text-[14px] font-medium text-[#86868B] animate-pulse">
        Loading...
      </div>
    </div>
  );
}
