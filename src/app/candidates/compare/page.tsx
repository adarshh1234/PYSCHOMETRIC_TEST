"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  GitCompare,
  Plus,
  X,
  Award,
  ShieldCheck,
  CheckCircle2,
  BrainCircuit,
  Sliders,
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
  Legend,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";

const CANDIDATE_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

export default function CandidateComparisonPage() {
  const {
    candidates,
    results,
    comparedCandidateIds,
    toggleCandidateComparison,
    clearCandidateComparison,
  } = useAssessmentStore();

  const [availableSelectOpen, setAvailableSelectOpen] = useState(false);

  // Selected candidates
  const selectedCandidates = candidates.filter((c) =>
    comparedCandidateIds.includes(c.id)
  );

  // If no candidates are selected, default to cand-001 and cand-004
  const displayCandidates =
    selectedCandidates.length > 0
      ? selectedCandidates
      : [candidates[0]!, candidates[3]!].filter(Boolean);

  // Big Five Comparison Data
  const traits = ["Conscientiousness", "Openness", "Extraversion", "Agreeableness", "Neuroticism"] as const;
  const bigFiveComparisonData = traits.map((trait) => {
    const entry: any = { trait };
    displayCandidates.forEach((cand) => {
      const res = results[cand.id] || results["cand-001"];
      const match = res?.personalityBigFive.find((p) => p.trait === trait);
      entry[cand.name] = match?.score || 50;
    });
    return entry;
  });

  // Cognitive Aptitude Comparison Data
  const cognitiveCategories = ["Numerical Reasoning", "Logical Deduction", "Abstract Reasoning", "Verbal Inference"];
  const cognitiveComparisonData = cognitiveCategories.map((cat) => {
    const entry: any = { category: cat.split(" ")[0] };
    displayCandidates.forEach((cand) => {
      const res = results[cand.id] || results["cand-001"];
      const match = res?.cognitiveBreakdown.find((c) =>
        c.category.toLowerCase().includes(cat.toLowerCase().split(" ")[0]!)
      );
      entry[cand.name] = match?.score || 75;
    });
    return entry;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <Link
          href="/candidates"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Candidate Directory
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Candidate Head-to-Head Comparison
              </h1>
              <Badge variant="purple" className="text-xs">
                {displayCandidates.length} Selected
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Side-by-side psychometric evaluation across cognitive benchmarks, Big Five personality traits, and behavioral competency alignments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearCandidateComparison}
              className="text-xs text-slate-600"
            >
              Clear Matrix
            </Button>
          </div>
        </div>
      </div>

      {/* Candidate Selector Badges Row */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <span className="text-xs font-semibold text-slate-500">
          Comparing Candidates:
        </span>
        {displayCandidates.map((cand, idx) => (
          <div
            key={cand.id}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length] }}
            />
            <span className="font-bold">{cand.name}</span>
            <span className="text-slate-400">({cand.appliedRole})</span>
            <button
              onClick={() => toggleCandidateComparison(cand.id)}
              className="text-slate-400 hover:text-slate-700 ml-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {displayCandidates.length < 4 && (
          <div className="relative">
            <button
              onClick={() => setAvailableSelectOpen(!availableSelectOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300"
            >
              <Plus className="h-3.5 w-3.5" /> Add Candidate
            </button>

            {availableSelectOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setAvailableSelectOpen(false)}
                />
                <div className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 dark:border-slate-800 dark:bg-slate-900">
                  <div className="space-y-1">
                    {candidates
                      .filter((c) => !comparedCandidateIds.includes(c.id))
                      .map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            toggleCandidateComparison(c.id);
                            setAvailableSelectOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-lg hover:bg-slate-100 text-xs text-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <p className="font-bold">{c.name}</p>
                          <p className="text-[10px] text-slate-400">{c.appliedRole}</p>
                        </button>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Head-to-Head Candidate Profiles Grid */}
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${displayCandidates.length}, minmax(0, 1fr))`,
        }}
      >
        {displayCandidates.map((cand, idx) => {
          const res = results[cand.id] || results["cand-001"];
          const color = CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length];

          return (
            <Card key={cand.id} className="p-5 border-t-4" style={{ borderTopColor: color }}>
              <div className="flex items-center gap-3">
                {cand.avatar ? (
                  <img
                    src={cand.avatar}
                    alt={cand.name}
                    className="h-12 w-12 rounded-full object-cover ring-2"
                    style={{ borderColor: color }}
                  />
                ) : (
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {cand.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {cand.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">{cand.appliedRole}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    Overall Score
                  </span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {res?.overallScore || cand.overallScore || 85}%
                  </span>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 dark:bg-slate-800/60">
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">
                    Percentile
                  </span>
                  <span className="text-base font-bold text-emerald-600">
                    {res?.overallPercentile || cand.percentileRank || 88}th
                  </span>
                </div>
              </div>

              <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Integrity Index:</span>
                  <span className="font-semibold text-emerald-600">
                    {res?.integrityScore || 98}/100 ({res?.integrityLevel || "LOW"} Risk)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SJT Effectiveness:</span>
                  <span className="font-semibold">
                    {res?.situationalJudgement.effectivenessScore || 86}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Decision Style:</span>
                  <span className="font-semibold truncate max-w-[140px]">
                    {res?.situationalJudgement.decisionMakingStyle || "Consultative"}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Link href={`/reports/${cand.id}`}>
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View Comprehensive Report <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Visual Comparisons: Cognitive Aptitudes & Big Five Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cognitive Aptitude Grouped Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Cognitive Aptitude Comparison</CardTitle>
            <CardDescription>
              Direct benchmark scores across numerical, logical, and abstract aptitudes
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cognitiveComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#64748b" }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
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
                  {displayCandidates.map((cand, idx) => (
                    <Bar
                      key={cand.id}
                      dataKey={cand.name}
                      fill={CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length]}
                      radius={[3, 3, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Big Five Dimensions Grouped Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Big Five Personality Traits Comparison</CardTitle>
            <CardDescription>
              Workplace personality alignment across the 5 primary constructs
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bigFiveComparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="trait" tick={{ fontSize: 10, fill: "#64748b" }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
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
                  {displayCandidates.map((cand, idx) => (
                    <Bar
                      key={cand.id}
                      dataKey={cand.name}
                      fill={CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length]}
                      radius={[3, 3, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behavioral Competency Comparison Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Behavioral Competencies Matrix</CardTitle>
          <CardDescription>
            Side-by-side competency proficiency comparison against benchmark criteria
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                  <th className="py-3 px-4 font-semibold">Core Competency</th>
                  <th className="py-3 px-4 font-semibold">Benchmark Target</th>
                  {displayCandidates.map((cand) => (
                    <th key={cand.id} className="py-3 px-4 font-semibold">
                      {cand.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  "Architectural Decision Making",
                  "Stakeholder Management",
                  "Stress & Incident Resilience",
                  "Team Mentorship & Review",
                  "Continuous Learning Agility",
                ].map((comp) => (
                  <tr key={comp} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                      {comp}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      70% (Proficient)
                    </td>
                    {displayCandidates.map((cand) => {
                      const res = results[cand.id] || results["cand-001"];
                      const item = res?.behavioralCompetencies.find(
                        (b) => b.competency.toLowerCase() === comp.toLowerCase()
                      );
                      const score = item?.score || 85;

                      return (
                        <td key={cand.id} className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {score}%
                            </span>
                            <Badge
                              variant={score >= 88 ? "success" : "default"}
                              className="text-[9px]"
                            >
                              {score >= 88 ? "Exceptional" : "Strong"}
                            </Badge>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

