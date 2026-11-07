"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  Award,
  Search,
  Filter,
  FileSpreadsheet,
  GitCompare,
  ChevronRight,
  ShieldCheck,
  Clock,
  TrendingUp,
  Percent,
} from "lucide-react";

export default function ResultsPage() {
  const { candidates, results, toggleCandidateComparison, comparedCandidateIds } = useAssessmentStore();
  const [search, setSearch] = useState("");
  const [selectedScoreFilter, setSelectedScoreFilter] = useState("ALL");

  // Candidates who have results
  const completedCandidates = candidates.filter((c) => c.status === "COMPLETED" || c.status === "EVALUATED");

  const filtered = completedCandidates.filter((cand) => {
    const res = results[cand.id] || results["cand-001"];
    const score = res?.overallScore || cand.overallScore || 0;

    const matchesSearch =
      cand.name.toLowerCase().includes(search.toLowerCase()) ||
      cand.appliedRole.toLowerCase().includes(search.toLowerCase()) ||
      cand.department.toLowerCase().includes(search.toLowerCase());

    const matchesScore =
      selectedScoreFilter === "ALL" ||
      (selectedScoreFilter === "TOP" && score >= 90) ||
      (selectedScoreFilter === "MID" && score >= 80 && score < 90) ||
      (selectedScoreFilter === "BASIC" && score < 80);

    return matchesSearch && matchesScore;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Assessment Results Directory
            </h1>
            <Badge variant="purple" className="text-xs">
              {completedCandidates.length} Completed Batteries
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Psychometric benchmarks, cognitive percentiles, Big Five dimensional profiles, and candidate telemetry reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparedCandidateIds.length > 0 && (
            <Link href="/candidates/compare">
              <Button size="sm" variant="secondary" className="gap-1.5 text-blue-600 dark:text-blue-400">
                <GitCompare className="h-3.5 w-3.5 text-blue-600" />
                <span>Compare Selected ({comparedCandidateIds.length})</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate results by name, applied role, department..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedScoreFilter}
            onChange={(e) => setSelectedScoreFilter(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="ALL">All Performance Tiers</option>
            <option value="TOP">Top Decile (&ge; 90%)</option>
            <option value="MID">Proficient (80% - 89%)</option>
            <option value="BASIC">Standard (&lt; 80%)</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                <th className="py-3 px-4 font-semibold w-10">Compare</th>
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">Battery Attempted</th>
                <th className="py-3 px-4 font-semibold">Score</th>
                <th className="py-3 px-4 font-semibold">Percentile</th>
                <th className="py-3 px-4 font-semibold">Integrity Score</th>
                <th className="py-3 px-4 font-semibold">Completion Date</th>
                <th className="py-3 px-4 font-semibold text-right">Psychometric Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((cand) => {
                const res = results[cand.id] || results["cand-001"]!;
                const isCompared = comparedCandidateIds.includes(cand.id);

                return (
                  <tr
                    key={cand.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                      isCompared ? "bg-blue-50/40 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => toggleCandidateComparison(cand.id)}
                        className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                      <Link href={`/candidates/${cand.id}`} className="hover:text-blue-600">
                        {cand.name}
                      </Link>
                      <p className="text-[11px] font-normal text-slate-400">
                        {cand.appliedRole} • {cand.department}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {cand.assignedAssessmentTitle}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 dark:text-white text-sm">
                        {res.overallScore}%
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-emerald-600">
                        {res.overallPercentile}th
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {res.integrityScore}/100
                        </span>
                        <Badge variant="success" className="text-[9px]">
                          Low Risk
                        </Badge>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {formatDate(res.completionDate)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link href={`/reports/${cand.id}`}>
                        <Button size="sm" className="h-8 gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                          <FileSpreadsheet className="h-3.5 w-3.5" />
                          <span>Full Report</span>
                          <ChevronRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

