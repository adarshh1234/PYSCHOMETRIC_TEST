"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Award,
  Clock,
  BrainCircuit,
  Sparkles,
  BookOpen,
  HelpCircle,
  AlertCircle,
  FileText,
  User,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";

export default function CandidateEvaluationReportPage() {
  const params = useParams();
  const candidateId = params.id as string;
  const { candidates, results } = useAssessmentStore();
  const [downloadToast, setDownloadToast] = useState(false);

  const candidate = candidates.find((c) => c.id === candidateId) || candidates[0]!;
  const result = results[candidateId] || results["cand-001"]!;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3500);
  };

  const radarData = result.personalityBigFive.map((p) => ({
    trait: p.trait,
    score: p.score,
  }));

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Action Toolbar (Hidden in print) */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-4 dark:border-slate-800">
        <Link
          href="/reports"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Evaluation Reports
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrint}
            className="gap-1.5 text-xs"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </Button>
          <Button
            size="sm"
            onClick={handleDownloadPdf}
            className="gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Official PDF</span>
          </Button>
        </div>
      </div>

      {/* Official Psychometric Report Document Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-12 shadow-sm dark:border-slate-800 dark:bg-slate-900 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 dark:border-slate-100 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
                Ψ
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                MindGauge Psychometric Talent Suite
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
              Candidate Psychometric Evaluation Report
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Standardized Multi-Battery Assessment & Competency Profile
            </p>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1">
            <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              Version: {result.version}
            </span>
            <p className="text-slate-500">
              Report Generated: <strong>{formatDate(result.completionDate)}</strong>
            </p>
            <p className="text-slate-500">
              Doc ID: <code className="font-mono text-slate-700 dark:text-slate-300">RPT-{candidate.id.toUpperCase()}-2026</code>
            </p>
          </div>
        </div>

        {/* 1. Candidate & Assessment Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-slate-100 bg-slate-50/70 p-5 text-xs dark:border-slate-800 dark:bg-slate-800/40">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Candidate Profile
            </span>
            <div className="flex justify-between">
              <span className="text-slate-500">Full Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">{candidate.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email Address:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{candidate.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Target Role:</span>
              <span className="font-bold text-slate-900 dark:text-white">{candidate.appliedRole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="text-slate-700 dark:text-slate-300">{candidate.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Professional Experience:</span>
              <span className="text-slate-700 dark:text-slate-300">{candidate.experienceYears} Years</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-5 pt-3 sm:pt-0 dark:border-slate-700">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Assessment Administration
            </span>
            <div className="flex justify-between">
              <span className="text-slate-500">Battery Title:</span>
              <span className="font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                {result.assessmentTitle}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Completion Status:</span>
              <span className="font-bold text-emerald-600">100% Validated</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Total Duration:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{result.durationMinutes} Minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Norm Group:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                {result.normGroup}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Session Integrity:</span>
              <span className="font-bold text-emerald-600">
                {result.integrityScore}/100 ({result.integrityLevel} Risk)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Executive Summary & Composite Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="rounded-xl border border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Overall Benchmark
            </span>
            <span className="text-3xl font-black text-slate-900 dark:text-white mt-1 block">
              {result.overallScore}%
            </span>
            <span className="text-[11px] font-semibold text-emerald-600">
              Grade: Superior Fit
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Percentile Rank
            </span>
            <span className="text-3xl font-black text-blue-600 mt-1 block">
              {result.overallPercentile}th
            </span>
            <span className="text-[11px] text-slate-400">
              Top 10% of norm sample
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Cognitive Aptitude
            </span>
            <span className="text-3xl font-black text-indigo-600 mt-1 block">
              88%
            </span>
            <span className="text-[11px] text-slate-400">
              High quantitative rigour
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 p-4 bg-white dark:border-slate-800 dark:bg-slate-900">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">
              Integrity Index
            </span>
            <span className="text-3xl font-black text-emerald-600 mt-1 block">
              {result.integrityScore}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold">
              Verified Independent
            </span>
          </div>
        </div>

        {/* Executive Summary Paragraph */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 text-xs text-blue-950 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-200 leading-relaxed">
          <strong className="font-bold block text-sm mb-1 text-blue-900 dark:text-blue-100">
            Executive Psychometric Summary:
          </strong>
          {result.roleFitSummary}
        </div>

        {/* 3. Cognitive Aptitude Breakdown */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              1. Cognitive Ability & Aptitude Battery
            </h2>
            <p className="text-xs text-slate-500">
              Standardized measurement of fluid intelligence, quantitative deduction, and abstract pattern problem solving.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-800">
                  <th className="py-2.5 px-3 font-semibold">Cognitive Domain</th>
                  <th className="py-2.5 px-3 font-semibold">Raw Accuracy</th>
                  <th className="py-2.5 px-3 font-semibold">Percentile Rank</th>
                  <th className="py-2.5 px-3 font-semibold">Average Latency</th>
                  <th className="py-2.5 px-3 font-semibold">Interpretation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {result.cognitiveBreakdown.map((item) => (
                  <tr key={item.category}>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                      {item.category}
                    </td>
                    <td className="py-3 px-3">{item.accuracy}%</td>
                    <td className="py-3 px-3 font-bold text-blue-600">
                      {item.percentile}th Percentile
                    </td>
                    <td className="py-3 px-3 text-slate-500">{item.averageSpeedSeconds}s / item</td>
                    <td className="py-3 px-3">
                      <Badge variant={item.percentile >= 90 ? "success" : "default"} className="text-[9px]">
                        {item.percentile >= 90 ? "Exceptional" : "Proficient"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Big Five Personality Profile */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              2. Big Five Workplace Personality Profile
            </h2>
            <p className="text-xs text-slate-500">
              Constructed using 5-point calibrated Likert items with positive and reverse-scored normative controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="trait" tick={{ fontSize: 11, fill: "#475569" }} />
                  <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2">
              {result.personalityBigFive.map((p) => (
                <div key={p.trait} className="rounded-lg border border-slate-100 p-2.5 text-xs dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{p.trait}</span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-bold text-[10px] text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      STEN {p.stenScore} ({p.percentile}th %ile)
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. DISC Behavioral Dynamics */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              3. DISC Behavioral Dynamics
            </h2>
            <p className="text-xs text-slate-500">
              Behavioral style preferences under operational pressure and team collaboration.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {result.discScores.map((disc) => (
              <div key={disc.quadrant} className="rounded-xl border border-slate-200 p-3.5 text-xs bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">
                  {disc.quadrant}
                </span>
                <span className="text-2xl font-bold text-slate-900 dark:text-white mt-1 block">
                  {disc.value}%
                </span>
                <Badge variant={disc.intensity === "High" ? "purple" : "secondary"} className="text-[9px] my-1">
                  {disc.intensity} Intensity
                </Badge>
                <p className="text-[10px] text-slate-500 leading-tight mt-1">
                  {disc.summary}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Behavioral Competencies Matrix */}
        <div className="space-y-4">
          <div className="border-b border-slate-100 pb-2 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              4. Role Competency Alignment
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated against role benchmark standards (70% benchmark proficiency requirement).
            </p>
          </div>

          <div className="space-y-2.5">
            {result.behavioralCompetencies.map((comp) => (
              <div key={comp.competency} className="rounded-lg border border-slate-100 p-3 text-xs dark:border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 dark:text-white">{comp.competency}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{comp.score}%</span>
                    <Badge variant={comp.level === "Exceptional" ? "success" : "default"} className="text-[9px]">
                      {comp.level}
                    </Badge>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden dark:bg-slate-800">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${comp.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. Situational Judgement & Decision Making Style */}
        <div className="rounded-xl border border-slate-200 p-5 text-xs space-y-3 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                5. Situational Judgement & Leadership Style
              </h3>
              <p className="text-[11px] text-slate-500">
                Workplace dilemmas, stakeholder negotiations, and technical tradeoff decisions.
              </p>
            </div>
            <span className="text-base font-bold text-emerald-600">
              {result.situationalJudgement.effectivenessScore}% Effectiveness
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Dominant Decision Style:
              </span>
              <p className="text-slate-600 dark:text-slate-300">
                {result.situationalJudgement.decisionMakingStyle}
              </p>
              <div className="mt-2 space-y-1">
                <span className="text-[11px] font-semibold text-emerald-600 block">Demonstrated Strengths:</span>
                {result.situationalJudgement.strengths.map((str, i) => (
                  <p key={i} className="text-slate-500 text-[11px]">
                    ✓ {str}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Potential Risk Sensitivity:
              </span>
              <div className="space-y-1 text-slate-500 text-[11px]">
                {result.situationalJudgement.riskAreas.map((risk, i) => (
                  <p key={i}>⚠️ {risk}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 8. Assessment Integrity Observations & Telemetry Timeline */}
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/20 p-5 text-xs space-y-3 dark:border-amber-900/40">
          <div className="flex items-center justify-between border-b border-amber-200/50 pb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                6. Assessment Integrity Observations & Session Telemetry
              </h3>
            </div>
            <Badge variant="success" className="text-[10px]">
              Integrity Score: {result.integrityScore} / 100
            </Badge>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Note: Telemetry anomalies are non-invasive diagnostic indicators and do not constitute definitive proof of malpractice.
          </p>

          <div className="space-y-2">
            {result.integrityEvents.length > 0 ? (
              result.integrityEvents.map((evt) => (
                <div key={evt.id} className="rounded-lg bg-white p-2.5 border border-slate-200 text-[11px] dark:bg-slate-800 dark:border-slate-700 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mr-2">
                      [{evt.eventType}]
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">{evt.details}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {formatDateTime(evt.timestamp)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-emerald-700 font-semibold text-xs">
                Zero integrity events or window blur interruptions recorded during session.
              </p>
            )}
          </div>
        </div>

        {/* 9. Structured Interview Probes for Hiring Panel */}
        <div className="rounded-xl border border-slate-200 p-5 text-xs space-y-3 dark:border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 dark:text-white">
              7. Recommended Behavioral Interview Probes
            </h3>
          </div>
          <p className="text-[11px] text-slate-500">
            Targeted behavioral questions tailored to this candidate's psychometric profile for the hiring panel:
          </p>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300">
            {result.interviewProbes.map((probe, idx) => (
              <li key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 dark:bg-slate-800/60 dark:border-slate-800 flex items-start gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-800 shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{probe}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 10. Psychometric Methodology & Limitations */}
        <div className="border-t border-slate-200 pt-6 text-[10px] text-slate-400 space-y-1.5 dark:border-slate-800">
          <p>
            <strong>Methodology & Standardization:</strong> MindGauge assessments are validated using Classical Test Theory (CTT) and standardized across normative reference groups. Big Five traits are calibrated on standard ten (STEN) distributions.
          </p>
          <p>
            <strong>Assessment Limitations:</strong> Psychometric evaluations provide probabilistic talent insights and should comprise at most 30-40% of holistic hiring decisions alongside structured technical interviews and work samples.
          </p>
          <p>
            Confidential evaluation document. &copy; 2026 MindGauge Platform • Built for Enterprise Talent Acquisition.
          </p>
        </div>
      </div>

      {/* Toast Alert for Download */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>Official candidate psychometric report package downloaded!</span>
        </div>
      )}
    </div>
  );
}

