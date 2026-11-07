"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { RoleSelector } from "./RoleSelector";
import { useRoleStore } from "@/store/roleStore";
import {
  Bell,
  Search,
  HelpCircle,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { MOCK_RECENT_ACTIVITIES } from "@/lib/mock/data/analytics.mock";

interface HeaderProps {
  onToggleMobileNav?: () => void;
}

export function Header({ onToggleMobileNav }: HeaderProps) {
  const pathname = usePathname();
  const { currentUser } = useRoleStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Format breadcrumbs from pathname
  const pathParts = pathname.split("/").filter(Boolean);
  const breadcrumbItems = pathParts.map((part, index) => {
    const href = "/" + pathParts.slice(0, index + 1).join("/");
    const label = part
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { href, label };
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 sm:px-6">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        {onToggleMobileNav && (
          <button
            onClick={onToggleMobileNav}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        <nav className="hidden items-center space-x-1.5 text-xs text-slate-500 md:flex">
          <Link
            href="/dashboard"
            className="hover:text-slate-800 dark:hover:text-slate-200"
          >
            MindGauge
          </Link>
          {breadcrumbItems.length > 0 ? (
            breadcrumbItems.map((item, idx) => (
              <React.Fragment key={item.href}>
                <ChevronRight className="h-3 w-3 text-slate-400" />
                <Link
                  href={item.href}
                  className={
                    idx === breadcrumbItems.length - 1
                      ? "font-semibold text-slate-800 dark:text-slate-200"
                      : "hover:text-slate-800 dark:hover:text-slate-200"
                  }
                >
                  {item.label}
                </Link>
              </React.Fragment>
            ))
          ) : (
            <>
              <ChevronRight className="h-3 w-3 text-slate-400" />
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Dashboard
              </span>
            </>
          )}
        </nav>
      </div>

      {/* Center: Global Search Simulation */}
      <div className="hidden max-w-xs flex-1 items-center px-4 xl:flex">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assessments, candidates, competencies..."
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-xs text-slate-800 transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
          />
        </div>
      </div>

      {/* Right Actions: Role Selector, Notifications, Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Role Selector & Demo Reset */}
        <RoleSelector />

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            title="Activity Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600"></span>
            </span>
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-2xl z-50 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    Live System Feed
                  </span>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Real-time
                  </span>
                </div>
                <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                  {MOCK_RECENT_ACTIVITIES.map((act) => (
                    <div
                      key={act.id}
                      className="rounded-lg p-2 hover:bg-slate-50 text-xs transition-colors dark:hover:bg-slate-800"
                    >
                      <p className="font-medium text-slate-800 dark:text-slate-200 leading-snug">
                        {act.title}
                      </p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                        <span>{act.timestamp}</span>
                        <span className="text-blue-600 font-medium">
                          {act.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Avatar */}
        <div className="hidden items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-800 sm:flex">
          {currentUser.avatar ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {currentUser.name.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

