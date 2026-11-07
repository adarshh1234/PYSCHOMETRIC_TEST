"use client";

import React, { useState } from "react";
import { useRoleStore } from "@/store/roleStore";
import { useAssessmentStore } from "@/store/assessmentStore";
import { MOCK_USERS } from "@/lib/mock/data/users.mock";
import { UserRole } from "@/types";
import {
  ShieldCheck,
  Building2,
  Users,
  UserCheck,
  FileEdit,
  BarChart3,
  GraduationCap,
  RotateCcw,
  ChevronDown,
  Check,
} from "lucide-react";

export function RoleSelector() {
  const { currentUser, setRole } = useRoleStore();
  const resetAllData = useAssessmentStore((s) => s.resetAllData);
  const [isOpen, setIsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const roleMeta: Record<
    UserRole,
    { label: string; icon: React.ComponentType<{ className?: string }>; color: string }
  > = {
    SUPER_ADMIN: { label: "Super Admin", icon: ShieldCheck, color: "text-purple-600 bg-purple-50" },
    TENANT_ADMIN: { label: "Tenant Admin", icon: Building2, color: "text-indigo-600 bg-indigo-50" },
    HR_MANAGER: { label: "HR Manager", icon: Users, color: "text-blue-600 bg-blue-50" },
    RECRUITER: { label: "Recruiter", icon: UserCheck, color: "text-emerald-600 bg-emerald-50" },
    ASSESSMENT_AUTHOR: { label: "Assessment Author", icon: FileEdit, color: "text-amber-600 bg-amber-50" },
    ANALYST: { label: "Psychometric Analyst", icon: BarChart3, color: "text-cyan-600 bg-cyan-50" },
    CANDIDATE: { label: "Candidate Experience", icon: GraduationCap, color: "text-rose-600 bg-rose-50" },
  };

  const handleReset = () => {
    resetAllData();
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const CurrentIcon = roleMeta[currentUser.role]?.icon || Users;

  return (
    <div className="relative inline-flex items-center gap-2">
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-all text-xs font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          title="Switch Active Demo Role"
        >
          <span className={`p-1 rounded-md ${roleMeta[currentUser.role]?.color}`}>
            <CurrentIcon className="h-3.5 w-3.5" />
          </span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Demo Role
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {roleMeta[currentUser.role]?.label}
            </span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 dark:border-slate-800 dark:bg-slate-900 animate-in fade-in slide-in-from-top-2">
              <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Select User Experience
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Switch perspectives to test role-tailored dashboards and workflows.
                </p>
              </div>

              <div className="space-y-1">
                {MOCK_USERS.map((user) => {
                  const meta = roleMeta[user.role];
                  const Icon = meta.icon;
                  const isSelected = currentUser.role === user.role;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        setRole(user.role);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors ${
                        isSelected
                          ? "bg-blue-50 text-blue-900 font-medium dark:bg-blue-900/30 dark:text-blue-200"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`p-1.5 rounded-md ${meta.color}`}>
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-semibold">{meta.label}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                            {user.name} ({user.department || user.tenantName})
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reset Demo Data button */}
      <button
        onClick={handleReset}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition-all shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        title="Reset mock data to pristine defaults"
      >
        <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
        <span className="hidden sm:inline">Reset Demo</span>
      </button>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <RotateCcw className="h-4 w-4 text-emerald-400" />
          <span>Demo datasets refreshed to pristine factory state!</span>
        </div>
      )}
    </div>
  );
}

