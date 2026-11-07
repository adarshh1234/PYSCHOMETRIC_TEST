"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRoleStore } from "@/store/roleStore";
import { useAssessmentStore } from "@/store/assessmentStore";
import {
  MOCK_ANALYTICS_KPIS,
  MOCK_COMPLETION_TRENDS,
  MOCK_SCORE_DISTRIBUTION,
  MOCK_CATEGORY_DISTRIBUTION,
  MOCK_DEPARTMENT_METRICS,
  MOCK_RECENT_ACTIVITIES,
} from "@/lib/mock/data/analytics.mock";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileCheck2,
  Users2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Percent,
  MailCheck,
  Award,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  FolderPlus,
  Send,
  GitCompare,
  BarChart3,
  Calendar,
  Filter,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function DashboardPage() {
  const { currentUser } = useRoleStore();
  const { assessments, candidates, invitations } = useAssessmentStore();
  const [timeRange, setTimeRange] = useState("6M");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");

  // Dynamic metrics computed from store
  const totalAssessments = assessments.length;
  const activeAssessments = assessments.filter((a) => a.status === "Active" || a.status === "Published").length;
  const totalCandidates = candidates.length;
  const completedCandidates = candidates.filter((c) => c.status === "COMPLETED" || c.status === "EVALUATED").length;
  const pendingCandidates = candidates.filter((c) => c.status === "INVITED" || c.status === "IN_PROGRESS").length;
  const activeInvitations = invitations.filter((i) => i.status === "SENT" || i.status === "OPENED" || i.status === "STARTED").length;

  return (
    <div className="space-y-6">
      {/* Role-Specific Hero Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {currentUser.role === "SUPER_ADMIN" && "Super Admin Platform Intelligence"}
              {currentUser.role === "TENANT_ADMIN" && `Enterprise Hub • ${currentUser.tenantName || "Nexus Corp"}`}
              {currentUser.role === "HR_MANAGER" && "Talent Acquisition & Assessment Control"}
              {currentUser.role === "RECRUITER" && "Candidate Pipeline & Assessment Tracker"}
              {currentUser.role === "ASSESSMENT_AUTHOR" && "Psychometric R&D & Test Authoring Hub"}
              {currentUser.role === "ANALYST" && "Psychometric Science & Analytics Suite"}
              {currentUser.role === "CANDIDATE" && "Candidate Assessment Portal"}
            </h1>
            <Badge variant="default" className="text-[11px] font-semibold">
              Live Simulation
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Welcome back, <span className="font-semibold text-slate-700 dark:text-slate-300">{currentUser.name}</span>. Here is your psychometric recruitment performance overview.
          </p>
        </div>

        {/* Global Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role !== "CANDIDATE" && (
            <>
              <Link href="/assessments/create">
                <Button size="sm" className="gap-1.5 shadow-sm">
                  <FolderPlus className="h-3.5 w-3.5" />
                  <span>Create Assessment</span>
                </Button>
              </Link>
              <Link href="/invitations">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Send className="h-3.5 w-3.5" />
                  <span>Invite Candidate</span>
                </Button>
              </Link>
              <Link href="/ai-generator">
                <Button variant="secondary" size="sm" className="gap-1.5 text-blue-600 dark:text-blue-400">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  <span>AI Generator</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <Card className="hover:border-blue-200 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Total Assessments
              </span>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <FileCheck2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {totalAssessments}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="h-3 w-3" /> {activeAssessments} Active
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Cognitive, Big 5, DISC & SJTs
            </p>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="hover:border-blue-200 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Candidate Pool
              </span>
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400">
                <Users2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {totalCandidates}
              </span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center">
                <ArrowUpRight className="h-3 w-3" /> +14% this month
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Across 5 departments
            </p>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="hover:border-blue-200 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Completion Rate
              </span>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                <Percent className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {MOCK_ANALYTICS_KPIS.completionRatePercent}%
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {completedCandidates} / {totalCandidates}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Avg test duration: 32 mins
            </p>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="hover:border-blue-200 transition-all">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Average Score
              </span>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {MOCK_ANALYTICS_KPIS.averageAssessmentScore}%
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                Top 80th Percentile
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Standardized against global norms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Chart 1: Completion & Score Trends (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Assessment Completion & Volume Trends</CardTitle>
              <CardDescription>
                Monthly candidate completion velocity vs. invited pool
              </CardDescription>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs dark:border-slate-800 dark:bg-slate-800">
              {["3M", "6M", "1Y"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`rounded px-2 py-0.5 font-medium transition-colors ${
                    timeRange === range
                      ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                      : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={MOCK_COMPLETION_TRENDS}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorInvited" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "12px",
                      border: "none",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                  <Area
                    type="monotone"
                    dataKey="invited"
                    name="Candidates Invited"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorInvited)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Assessments Completed"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Category Breakdown Donut */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Volume across psychometric dimensions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_CATEGORY_DISTRIBUTION}
                    dataKey="testsCount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {MOCK_CATEGORY_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "11px",
                      border: "none",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {MOCK_CATEGORY_DISTRIBUTION.slice(0, 4).map((cat) => (
                <div key={cat.category} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: cat.fill }}
                    />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">
                      {cat.category}
                    </span>
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {cat.testsCount} tests
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Row: Score Distribution & Department Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Score Distribution Histogram */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Candidate Performance Distribution</CardTitle>
                <CardDescription>
                  Score bell curve compared to normative standardization
                </CardDescription>
              </div>
              <Badge variant="purple" className="text-[10px]">
                Normed (N=14.2k)
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_SCORE_DISTRIBUTION} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      color: "#fff",
                      borderRadius: "8px",
                      fontSize: "12px",
                      border: "none",
                    }}
                  />
                  <Bar dataKey="count" name="Candidates" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Department Benchmark Table */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Department-Wise Assessment Metrics</CardTitle>
                <CardDescription>
                  Participation, pass rate, and average cognitive scores
                </CardDescription>
              </div>
              <Link href="/analytics">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 gap-1">
                  View Full Analytics <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 dark:border-slate-800">
                    <th className="pb-2 font-medium">Department</th>
                    <th className="pb-2 font-medium">Candidates</th>
                    <th className="pb-2 font-medium">Completion Rate</th>
                    <th className="pb-2 font-medium">Avg Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {MOCK_DEPARTMENT_METRICS.map((dept) => (
                    <tr key={dept.department} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">
                        {dept.department}
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-400">
                        {dept.candidates}
                      </td>
                      <td className="py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                            <div
                              className="h-full bg-emerald-500 rounded-full"
                              style={{ width: `${dept.completionRate}%` }}
                            />
                          </div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {dept.completionRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-slate-100">
                        {dept.avgScore}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Integrity Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Recent Activity Feed (2 cols) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Recent Recruitment Activities</CardTitle>
              <CardDescription>
                Live feed of assessments, invitations, and generated reports
              </CardDescription>
            </div>
            <Link href="/candidates">
              <Button variant="outline" size="sm" className="text-xs">
                Candidate Directory
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {MOCK_RECENT_ACTIVITIES.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 hover:border-slate-200 transition-all dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={act.avatar}
                      alt="avatar"
                      className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                        {act.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        <span>{act.role}</span>
                        <span>•</span>
                        <span>{act.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      {act.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Right: Integrity & Anti-Cheat Summary Card */}
        <Card className="border-amber-200/80 bg-gradient-to-b from-amber-50/30 to-white dark:border-amber-900/40 dark:from-slate-900 dark:to-slate-900">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-600" />
                <CardTitle>Integrity Telemetry</CardTitle>
              </div>
              <Badge variant="warning" className="text-[10px]">
                Active Shield
              </Badge>
            </div>
            <CardDescription>
              Non-invasive behavioral anomaly detection
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-3.5 dark:border-amber-900/40 dark:bg-amber-950/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Global Integrity Score
                </span>
                <span className="text-lg font-bold text-emerald-600">
                  96.8 / 100
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                98.4% of candidate test sessions exhibited standard focus profiles with zero anomalous copy/paste attempts.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Active Test Sessions</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">1 Live Session</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Flagged Anomalies (24h)</span>
                <span className="font-semibold text-amber-600">1 Review Flagged</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Focus Retention</span>
                <span className="font-semibold text-emerald-600">99.1% In-Window</span>
              </div>
            </div>

            <Link href="/integrity" className="block pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 border-amber-300 hover:bg-amber-50 text-amber-900 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-950/40">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>Open Integrity Monitoring UI</span>
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

