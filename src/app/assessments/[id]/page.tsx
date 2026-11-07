"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { useRoleStore } from "@/store/roleStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  FileCheck2,
  Clock,
  Layers,
  Users2,
  Send,
  Play,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Award,
  Sparkles,
} from "lucide-react";

export default function AssessmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;
  const { assessments, questions, candidates, initSession } = useAssessmentStore();
  const { currentUser, setRole } = useRoleStore();
  const [activeTab, setActiveTab] = useState<"sections" | "candidates" | "settings">("sections");

  const assessment = assessments.find((a) => a.id === assessmentId) || assessments[0];

  if (!assessment) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Assessment not found.</p>
        <Link href="/assessments">
          <Button variant="outline" size="sm" className="mt-4">
            Back to Assessments
          </Button>
        </Link>
      </div>
    );
  }

  // Get candidates assigned to this assessment
  const assignedCandidates = candidates.filter(
    (c) => c.assignedAssessmentId === assessment.id
  );

  const handleLaunchSimulation = () => {
    // Switch to Candidate role and launch testing engine
    setRole("CANDIDATE");
    initSession(assessment.id, "cand-001");
    router.push("/candidate/take-assessment");
  };

  return (
    <div className="space-y-6">
      {/* Back button and Header */}
      <div>
        <Link
          href="/assessments"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Assessment List
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {assessment.title}
              </h1>
              <Badge variant="success">{assessment.status}</Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {assessment.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/invitations">
              <Button size="sm" className="gap-1.5 shadow-sm">
                <Send className="h-3.5 w-3.5" />
                <span>Invite Candidates</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLaunchSimulation}
              className="gap-1.5 text-emerald-700 border-emerald-300 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-800"
              title="Experience live candidate testing engine for this assessment"
            >
              <Play className="h-3.5 w-3.5 text-emerald-600 fill-emerald-600" />
              <span>Simulate Candidate Test</span>
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Target Role & Level
          </span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
            {assessment.targetRole}
          </span>
          <span className="text-[11px] text-slate-400">
            {assessment.seniorityLevel} • {assessment.industry}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Total Duration
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {assessment.durationMinutes} Minutes
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {assessment.sections.length} timed sections
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Assigned Candidates
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Users2 className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {assessment.completedCandidatesCount} / {assessment.assignedCandidatesCount} Completed
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            {assessment.assignedCandidatesCount > 0
              ? `${Math.round((assessment.completedCandidatesCount / assessment.assignedCandidatesCount) * 100)}% completion rate`
              : "0 invited"}
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase block">
            Benchmark Score
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <Award className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {assessment.averageScore || 78.4}% Avg Score
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Pass Threshold: {assessment.settings.passThresholdPercent || 70}%
          </span>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab("sections")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "sections"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Assessment Sections & Questions ({assessment.sections.length})
        </button>
        <button
          onClick={() => setActiveTab("candidates")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "candidates"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Assigned Candidates ({assignedCandidates.length})
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
            activeTab === "settings"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Integrity & Assessment Rules
        </button>
      </div>

      {/* Tab 1: Sections & Questions */}
      {activeTab === "sections" && (
        <div className="space-y-4">
          {assessment.sections.map((section, idx) => {
            const sectionQuestions = questions.filter((q) =>
              section.questionIds.includes(q.id)
            );

            return (
              <Card key={section.id} className="overflow-hidden">
                <CardHeader className="bg-slate-50/70 border-b border-slate-100 dark:bg-slate-800/40 dark:border-slate-800 py-3 px-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white">
                        {idx + 1}
                      </span>
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-900 dark:text-white">
                          {section.title}
                        </CardTitle>
                        <CardDescription className="text-[11px]">
                          {section.category.replace(/_/g, " ")} • {section.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <Clock className="h-3.5 w-3.5 text-blue-600" /> {section.durationMinutes} mins
                      </span>
                      <span>•</span>
                      <span>{section.questionCount} Questions</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-3">
                  <div className="rounded-lg bg-blue-50/60 p-2.5 text-[11px] text-blue-900 dark:bg-blue-900/20 dark:text-blue-300">
                    <strong className="font-semibold">Candidate Instructions:</strong> {section.instructions}
                  </div>

                  <div className="space-y-2 mt-3">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Configured Questions in this Section:
                    </span>
                    {sectionQuestions.length > 0 ? (
                      sectionQuestions.map((q, qIdx) => (
                        <div
                          key={q.id}
                          className="flex items-start justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors dark:border-slate-800 dark:hover:bg-slate-800/50"
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xs font-bold text-slate-400 mt-0.5">
                              #{qIdx + 1}
                            </span>
                            <div>
                              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                                {q.title}
                              </p>
                              <p className="mt-0.5 text-[11px] text-slate-500 line-clamp-1">
                                {q.content}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                  {q.questionType.replace(/_/g, " ")}
                                </span>
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                  {q.competency}
                                </span>
                                <Badge
                                  variant={
                                    q.difficulty === "Easy"
                                      ? "success"
                                      : q.difficulty === "Medium"
                                      ? "warning"
                                      : "destructive"
                                  }
                                  className="text-[9px] py-0"
                                >
                                  {q.difficulty}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <span className="text-[11px] font-medium text-slate-400">
                            {q.timeLimitSeconds ? `${q.timeLimitSeconds}s` : "No limit"}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        Questions dynamically sampled from question pool.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Tab 2: Assigned Candidates */}
      {activeTab === "candidates" && (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                  <th className="py-3 px-4 font-semibold">Candidate Name</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Score</th>
                  <th className="py-3 px-4 font-semibold">Percentile</th>
                  <th className="py-3 px-4 font-semibold text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {assignedCandidates.length > 0 ? (
                  assignedCandidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                        <Link href={`/candidates/${cand.id}`} className="hover:text-blue-600">
                          {cand.name}
                        </Link>
                        <p className="text-[11px] font-normal text-slate-400">{cand.email}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {cand.department}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            cand.status === "EVALUATED" || cand.status === "COMPLETED"
                              ? "success"
                              : cand.status === "IN_PROGRESS"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {cand.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                        {cand.overallScore ? `${cand.overallScore}%` : "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {cand.percentileRank ? `${cand.percentileRank}th` : "—"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link href={`/reports/${cand.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-blue-600">
                            Full Report <ChevronRight className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                      No candidates currently assigned. Click 'Invite Candidates' above to assign candidates.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Tab 3: Settings & Integrity */}
      {activeTab === "settings" && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Assessment Configuration & Test Rules
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rules enforced during the candidate's testing session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4 space-y-3 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Navigation & Execution Settings
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Allow Question Backtracking</span>
                  <Badge variant={assessment.settings.allowBacktracking ? "success" : "secondary"}>
                    {assessment.settings.allowBacktracking ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Shuffle Question Order</span>
                  <Badge variant={assessment.settings.shuffleQuestions ? "success" : "secondary"}>
                    {assessment.settings.shuffleQuestions ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Shuffle Multiple Choice Options</span>
                  <Badge variant={assessment.settings.shuffleOptions ? "success" : "secondary"}>
                    {assessment.settings.shuffleOptions ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Auto-Submit upon Time Expiry</span>
                  <Badge variant={assessment.settings.autoSubmitOnExpiry ? "success" : "secondary"}>
                    {assessment.settings.autoSubmitOnExpiry ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-3 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Integrity & Telemetry Monitoring
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Track Browser Tab Switches</span>
                  <Badge variant={assessment.settings.integrityMonitoring.trackTabSwitches ? "success" : "secondary"}>
                    {assessment.settings.integrityMonitoring.trackTabSwitches ? "Active Monitoring" : "Off"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Require Fullscreen Testing Frame</span>
                  <Badge variant={assessment.settings.integrityMonitoring.trackFullscreen ? "success" : "secondary"}>
                    {assessment.settings.integrityMonitoring.trackFullscreen ? "Enforced" : "Optional"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Block Clipboard Copy/Paste</span>
                  <Badge variant={assessment.settings.integrityMonitoring.trackCopyPaste ? "success" : "secondary"}>
                    {assessment.settings.integrityMonitoring.trackCopyPaste ? "Blocked & Logged" : "Allowed"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Webcam Proctoring</span>
                  <Badge variant="secondary">
                    Not Required (Standard)
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

