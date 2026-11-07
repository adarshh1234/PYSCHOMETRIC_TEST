"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import {
  MOCK_ANALYTICS_KPIS,
  MOCK_COMPLETION_TRENDS,
  MOCK_SCORE_DISTRIBUTION,
  MOCK_CATEGORY_DISTRIBUTION,
  MOCK_DEPARTMENT_METRICS,
} from "@/lib/mock/data/analytics.mock";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart4,
  TrendingUp,
  Percent,
  Clock,
  Users2,
  Calendar,
  Filter,
  FileCheck2,
  Award,
  Layers,
  ArrowUpRight,
  ShieldAlert,
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
  Legend,
  CartesianGrid,
} from "recharts";

export default function AnalyticsDashboardPage() {
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedTimeframe, setSelectedTimeframe] = useState("6M");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Assessment Analytics & Psychometric Science
            </h1>
            <Badge variant="purple" className="text-xs">
              Live Aggregate Telemetry
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Enterprise analytics on candidate completion velocity, score normative distributions, and construct reliability.
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Finance">Corporate Finance</option>
            <option value="Product">Product Management</option>
            <option value="Success">Customer Operations</option>
          </select>

          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs dark:border-slate-800 dark:bg-slate-800">
            {["1M", "3M", "6M", "1Y"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTimeframe(t)}
                className={`rounded px-2.5 py-0.5 font-medium transition-colors ${
                  selectedTimeframe === t
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Aggregate Assessments Attempted
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {MOCK_ANALYTICS_KPIS.completedAssessments}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" /> +18.4%
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Out of {MOCK_ANALYTICS_KPIS.totalCandidates} total candidates
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Completion Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-600">
              {MOCK_ANALYTICS_KPIS.completionRatePercent}%
            </span>
            <span className="text-xs text-slate-500">Above SaaS benchmark</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Low dropout rate (&lt; 6.2%)
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Average Completion Duration
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              31.8m
            </span>
            <span className="text-xs text-slate-500">Allocated: 40m</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Balanced pacing observed
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Composite Mean Score
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600">
              {MOCK_ANALYTICS_KPIS.averageAssessmentScore}%
            </span>
            <span className="text-xs text-slate-500">SD = 11.2%</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Standard normal curve distribution
          </span>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Monthly Completion Velocity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Assessment Velocity & Completion</CardTitle>
            <CardDescription>
              Invited candidates vs. verified completions per month
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_COMPLETION_TRENDS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaInvited" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="areaCompleted" x1="0" y1="0" x2="0" y2="1">
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
                    name="Invited"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#areaInvited)"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#areaCompleted)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Chart 2: Score Normal Bell Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Score Distribution Curve</CardTitle>
            <CardDescription>
              Histogram of candidate performance against psychometric cutoffs
            </CardDescription>
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
      </div>

      {/* Secondary Row: Category Volume & Department Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Category-Wise Assessment Metrics</CardTitle>
            <CardDescription>
              Volume and average scores across psychometric domains
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-3">
              {MOCK_CATEGORY_DISTRIBUTION.map((cat) => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {cat.category}
                    </span>
                    <span className="text-slate-500 font-medium">
                      {cat.testsCount} tests • Avg {cat.avgScore}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        backgroundColor: cat.fill,
                        width: `${cat.avgScore}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Benchmark Comparison */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Department-Wise Performance Comparison</CardTitle>
            <CardDescription>
              Talent acquisition funnel metrics across departments
            </CardDescription>
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
                    <tr key={dept.department}>
                      <td className="py-2.5 font-semibold text-slate-800 dark:text-slate-200">
                        {dept.department}
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-400">
                        {dept.candidates}
                      </td>
                      <td className="py-2.5 font-medium text-emerald-600">
                        {dept.completionRate}%
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
    </div>
  );
}

