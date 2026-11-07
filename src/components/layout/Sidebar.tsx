"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRoleStore } from "@/store/roleStore";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileCheck2,
  FolderKanban,
  HelpCircle,
  Users2,
  MailCheck,
  Award,
  FileSpreadsheet,
  GitCompare,
  BarChart4,
  Sparkles,
  ShieldAlert,
  UserCog,
  Settings,
  GraduationCap,
  BrainCircuit,
  Building,
  CheckCircle2,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[]; // Allowed roles or '*' for all
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  // Primary Dashboard
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [
      "SUPER_ADMIN",
      "TENANT_ADMIN",
      "HR_MANAGER",
      "RECRUITER",
      "ASSESSMENT_AUTHOR",
      "ANALYST",
    ],
  },
  // Assessments
  {
    label: "Assessments",
    href: "/assessments",
    icon: FileCheck2,
    roles: [
      "SUPER_ADMIN",
      "TENANT_ADMIN",
      "HR_MANAGER",
      "RECRUITER",
      "ASSESSMENT_AUTHOR",
    ],
    badge: "14",
  },
  {
    label: "Assessment Library",
    href: "/assessments/library",
    icon: FolderKanban,
    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "HR_MANAGER", "ASSESSMENT_AUTHOR"],
  },
  // Question Bank & AI
  {
    label: "Question Banks",
    href: "/questions",
    icon: HelpCircle,
    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "ASSESSMENT_AUTHOR"],
    badge: "Rich Bank",
  },
  {
    label: "AI Question Generator",
    href: "/ai-generator",
    icon: Sparkles,
    roles: ["SUPER_ADMIN", "ASSESSMENT_AUTHOR", "HR_MANAGER"],
    badge: "AI Lab",
  },
  // Candidates & Invitations
  {
    label: "Candidates",
    href: "/candidates",
    icon: Users2,
    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "HR_MANAGER", "RECRUITER"],
    badge: "Active",
  },
  {
    label: "Invitations",
    href: "/invitations",
    icon: MailCheck,
    roles: ["TENANT_ADMIN", "HR_MANAGER", "RECRUITER"],
  },
  // Results & Reports
  {
    label: "Results",
    href: "/results",
    icon: Award,
    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "HR_MANAGER", "RECRUITER", "ANALYST"],
  },
  {
    label: "Candidate Comparison",
    href: "/candidates/compare",
    icon: GitCompare,
    roles: ["TENANT_ADMIN", "HR_MANAGER", "RECRUITER", "ANALYST"],
  },
  {
    label: "Evaluation Reports",
    href: "/reports",
    icon: FileSpreadsheet,
    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "HR_MANAGER", "RECRUITER", "ANALYST"],
  },
  // Analytics & Integrity
  {
    label: "Assessment Analytics",
    href: "/analytics",
    icon: BarChart4,
    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "HR_MANAGER", "ANALYST"],
  },
  {
    label: "Integrity Monitoring",
    href: "/integrity",
    icon: ShieldAlert,
    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "HR_MANAGER", "RECRUITER", "ANALYST"],
    badge: "Live",
  },
  // Admin & System
  {
    label: "User Management",
    href: "/users",
    icon: UserCog,
    roles: ["SUPER_ADMIN", "TENANT_ADMIN"],
  },
  {
    label: "Settings & Config",
    href: "/settings",
    icon: Settings,
    roles: ["SUPER_ADMIN", "TENANT_ADMIN", "HR_MANAGER"],
  },

  // Candidate Dedicated Experience
  {
    label: "Candidate Hub",
    href: "/candidate/dashboard",
    icon: LayoutDashboard,
    roles: ["CANDIDATE"],
  },
  {
    label: "Assigned Assessments",
    href: "/candidate/assessments",
    icon: GraduationCap,
    roles: ["CANDIDATE"],
    badge: "1 Pending",
  },
  {
    label: "Take Assessment (Live)",
    href: "/candidate/take-assessment",
    icon: CheckCircle2,
    roles: ["CANDIDATE"],
    badge: "Launch",
  },
  {
    label: "Candidate Report",
    href: "/candidate/results",
    icon: Award,
    roles: ["CANDIDATE"],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { currentUser } = useRoleStore();

  const accessibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 lg:flex">
      {/* Brand Logo & Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6 dark:border-slate-800">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-md shadow-blue-500/20">
          <BrainCircuit className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            MindGauge<span className="text-blue-600">.ai</span>
          </span>
          <span className="text-[10px] font-medium text-slate-400">
            Psychometric Talent Suite
          </span>
        </div>
      </div>

      {/* Tenant Context Pill */}
      {currentUser.tenantName && currentUser.role !== "SUPER_ADMIN" && (
        <div className="mx-4 mt-3 rounded-lg border border-slate-100 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center gap-2">
            <Building className="h-3.5 w-3.5 text-slate-400" />
            <span className="truncate text-xs font-semibold text-slate-700 dark:text-slate-300">
              {currentUser.tenantName}
            </span>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-400">
            Enterprise Tier • 1,250 Licenses
          </p>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {currentUser.role === "CANDIDATE" ? "Candidate Portal" : "Platform Navigation"}
        </div>
        <nav className="space-y-1">
          {accessibleItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all",
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25 dark:bg-blue-600"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "h-4 w-4 transition-colors",
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Active User Card at bottom */}
      <div className="border-t border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500/20"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
              {currentUser.name.charAt(0)}
            </div>
          )}
          <div className="flex flex-col truncate">
            <span className="truncate text-xs font-semibold text-slate-800 dark:text-slate-200">
              {currentUser.name}
            </span>
            <span className="truncate text-[11px] text-slate-400">
              {currentUser.email}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

