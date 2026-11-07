"use client";

import React from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { FileSpreadsheet, ChevronRight, Award, UserCheck, ShieldCheck } from "lucide-react";

export default function ReportsIndexPage() {
  const { candidates, results } = useAssessmentStore();
  const completed = candidates.filter((c) => c.status === "COMPLETED" || c.status === "EVALUATED");

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Psychometric Evaluation Reports
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Official standardized candidate reports including cognitive percentiles, Big Five dimensions, DISC dynamics, and behavioral interview probes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {completed.map((cand) => {
          const res = results[cand.id] || results["cand-001"]!;

          return (
            <Card key={cand.id} className="p-5 flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all">
              <div>
                <div className="flex items-center justify-between">
                  <Badge variant="success">Standardized Norm v4.2</Badge>
                  <span className="text-xs font-bold text-emerald-600">
                    {res.overallScore}% Overall
                  </span>
                </div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                  {cand.name}
                </h2>
                <p className="text-xs text-slate-500">
                  {cand.appliedRole} • {cand.department}
                </p>
                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                  {res.roleFitSummary}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {formatDate(res.completionDate)}
                </span>
                <Link href={`/reports/${cand.id}`}>
                  <Button size="sm" className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700">
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    <span>View Report</span>
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

