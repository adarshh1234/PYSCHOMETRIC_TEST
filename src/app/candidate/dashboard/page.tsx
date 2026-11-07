"use client";

import React from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { useRoleStore } from "@/store/roleStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Clock,
  Award,
  ShieldCheck,
  FileSpreadsheet,
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function CandidateDashboardPage() {
  const { assessments, candidates, currentSession, initSession } = useAssessmentStore();
  const { currentUser } = useRoleStore();

  const assignedAssessment = assessments[0]!;

  const handleStart = () => {
    initSession(assignedAssessment.id, "cand-001");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="max-w-2xl space-y-3">
          <Badge className="bg-white/20 text-white hover:bg-white/30 border-transparent text-xs">
            Candidate Assessment Portal
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-sm text-blue-100 leading-relaxed">
            You have an active invitation for the <strong>{assignedAssessment.title}</strong> for the role of <strong>Senior Full-Stack Engineer</strong>.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link href="/candidate/take-assessment">
              <Button
                onClick={handleStart}
                className="gap-2 bg-white text-blue-900 hover:bg-blue-50 font-bold shadow-lg"
              >
                <Play className="h-4 w-4 fill-blue-900 text-blue-900" />
                <span>Launch Testing Experience</span>
              </Button>
            </Link>
            <Link href="/candidate/results">
              <Button variant="outline" className="text-white border-white/40 hover:bg-white/10 text-xs">
                View Permitted Results
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Assigned Assessment Status Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block">
                Assigned Battery
              </span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {assignedAssessment.title}
              </h2>
            </div>
            <Badge variant="warning">Ready to Start</Badge>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {assignedAssessment.description}
          </p>

          <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-3 text-center text-xs dark:bg-slate-800/60">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                Duration
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {assignedAssessment.durationMinutes} Minutes
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                Sections
              </span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {assignedAssessment.sections.length} Sections
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                Integrity Shield
              </span>
              <span className="font-bold text-emerald-600">
                Active
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Link href="/candidate/take-assessment">
              <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                <span>Start Assessment</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>

        {/* Quick Tips Card */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Assessment Preparation
            </h3>
          </div>

          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <span>Use a stable desktop or laptop computer with a modern browser.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <span>Calculators and scratch paper are permitted for quantitative sections.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
              <span>Ensure adequate uninterrupted time before starting the session.</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

