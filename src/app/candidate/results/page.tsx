"use client";

import React from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle2, ArrowLeft, BrainCircuit, Sparkles, BookOpen } from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
} from "recharts";

export default function CandidatePermittedResultsPage() {
  const { results } = useAssessmentStore();
  const result = results["cand-001"]!;

  const radarData = result.personalityBigFive.map((p) => ({
    trait: p.trait,
    score: p.score,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <Link
          href="/candidate/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Candidate Hub
        </Link>
        <div className="border-b border-slate-200/80 pb-5 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Candidate Feedback Profile
            </h1>
            <Badge variant="success">Completed</Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Developmental profile and strengths summary for {result.assessmentTitle}.
          </p>
        </div>
      </div>

      {/* Completion Confirmation Notice */}
      <Card className="p-6 bg-gradient-to-r from-emerald-50/50 to-white border-emerald-200 dark:bg-slate-900 dark:border-emerald-950">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Assessment Completed Successfully
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Your responses have been processed against standardized norm benchmarks. Below is an overview of your workplace behavioral profile and key cognitive strengths.
            </p>
          </div>
        </div>
      </Card>

      {/* Big Five Work Style Visualization */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Work Style & Personality Profile
            </h3>
          </div>
          <Badge variant="purple" className="text-[10px]">
            Developmental Feedback
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="trait" tick={{ fontSize: 11, fill: "#475569" }} />
                <Radar name="Score" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 text-xs">
            {result.personalityBigFive.map((p) => (
              <div key={p.trait} className="rounded-lg bg-slate-50 p-2.5 dark:bg-slate-800/60">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  {p.trait}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Qualitative Strengths and Developmental Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Identified Strengths
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {result.strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Developmental Opportunities
            </h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {result.growthAreas.map((area, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 font-bold">•</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

