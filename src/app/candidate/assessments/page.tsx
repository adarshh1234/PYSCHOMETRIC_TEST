"use client";

import React from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Play, CheckCircle2, ChevronRight, Layers } from "lucide-react";

export default function CandidateAssessmentsListPage() {
  const { assessments, initSession } = useAssessmentStore();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          My Assigned Assessments
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          View your assigned recruitment psychometric batteries and testing invitations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.slice(0, 2).map((asm, idx) => (
          <Card key={asm.id} className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <Badge variant={idx === 0 ? "warning" : "success"}>
                  {idx === 0 ? "Pending Attempt" : "Previously Completed"}
                </Badge>
                <span className="text-xs text-slate-400">{asm.durationMinutes} mins</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mt-2">
                {asm.title}
              </h2>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {asm.description}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
              <span className="text-xs text-slate-500">
                {asm.sections.length} timed sections
              </span>
              <Link href="/candidate/take-assessment">
                <Button
                  size="sm"
                  onClick={() => initSession(asm.id, "cand-001")}
                  className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="h-3 w-3 fill-white" />
                  <span>Launch Battery</span>
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

