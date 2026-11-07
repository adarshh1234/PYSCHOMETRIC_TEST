"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRoleStore } from "@/store/roleStore";

export default function RootPage() {
  const router = useRouter();
  const { currentUser } = useRoleStore();

  useEffect(() => {
    if (currentUser.role === "CANDIDATE") {
      router.replace("/candidate/dashboard");
    } else {
      router.replace("/dashboard");
    }
  }, [currentUser.role, router]);

  return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-xs text-slate-500 font-medium">Loading MindGauge workspace...</p>
      </div>
    </div>
  );
}

