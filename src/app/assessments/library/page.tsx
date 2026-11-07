"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  FolderKanban,
  Search,
  Copy,
  Sparkles,
  Clock,
  Layers,
  CheckCircle2,
  BrainCircuit,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface Template {
  id: string;
  title: string;
  category: string;
  targetRole: string;
  durationMinutes: number;
  sectionsCount: number;
  description: string;
  normSample: string;
  tags: string[];
}

const TEMPLATES: Template[] = [
  {
    id: "tpl-1",
    title: "Global Cognitive Ability Battery (GCA-40)",
    category: "Cognitive",
    targetRole: "All Strategic & Professional Roles",
    durationMinutes: 40,
    sectionsCount: 4,
    description: "Standardized evaluation of numerical deduction, verbal inference, and abstract inductive reasoning for high-complexity positions.",
    normSample: "Global Professionals (N=24,000)",
    tags: ["Cognitive", "Numerical", "Verbal", "Abstract"],
  },
  {
    id: "tpl-2",
    title: "Big Five Work Personality Inventory (B5-Work)",
    category: "Personality",
    targetRole: "Team Leads & Mid-Senior Professionals",
    durationMinutes: 20,
    sectionsCount: 5,
    description: "Measures Openness, Conscientiousness, Extraversion, Agreeableness, and Emotional Stability within enterprise workplace contexts.",
    normSample: "Corporate Norm Group (N=18,500)",
    tags: ["Big Five", "Work Ethic", "Team Dynamics"],
  },
  {
    id: "tpl-3",
    title: "Executive Leadership & Situational Dilemma Battery",
    category: "Situational Judgement",
    targetRole: "Directors, VPs, Product Leaders",
    durationMinutes: 35,
    sectionsCount: 3,
    description: "Complex workplace governance, stakeholder mediation, crisis communication, and capital allocation decision scenarios.",
    normSample: "Executive Leaders (N=6,200)",
    tags: ["Leadership", "SJT", "Governance"],
  },
  {
    id: "tpl-4",
    title: "DISC Behavioral Dynamics & Influence Profile",
    category: "Behavioral",
    targetRole: "Client-Facing, Sales & Product Managers",
    durationMinutes: 18,
    sectionsCount: 2,
    description: "Determines dominant behavioral drivers across Dominance, Influence, Steadiness, and Conscientiousness quadrants.",
    normSample: "Commercial & Sales Cohorts (N=11,000)",
    tags: ["DISC", "Communication", "Influence"],
  },
  {
    id: "tpl-5",
    title: "Financial Quantitative Analysis & Risk Reasoning",
    category: "Numerical Reasoning",
    targetRole: "Financial Analysts, Controllers, FP&A",
    durationMinutes: 45,
    sectionsCount: 3,
    description: "Evaluates margin calculations, financial disclosure deduction, sensitivity analysis, and cash flow projections.",
    normSample: "Finance & Investment Sector (N=8,400)",
    tags: ["Finance", "Quantitative", "Risk"],
  },
  {
    id: "tpl-6",
    title: "Emotional Intelligence & Conflict De-escalation (EQ-Enterprise)",
    category: "Emotional Intelligence",
    targetRole: "People Managers & Customer Success",
    durationMinutes: 25,
    sectionsCount: 3,
    description: "Measures self-awareness, emotional regulation under pressure, empathy, and constructive conflict de-escalation.",
    normSample: "Management Norm (N=9,300)",
    tags: ["EQ", "Empathy", "Conflict Resolution"],
  },
];

export default function AssessmentLibraryPage() {
  const { addAssessment } = useAssessmentStore();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("ALL");
  const [clonedId, setClonedId] = useState<string | null>(null);

  const filtered = TEMPLATES.filter((tpl) => {
    const matchesSearch =
      tpl.title.toLowerCase().includes(search.toLowerCase()) ||
      tpl.targetRole.toLowerCase().includes(search.toLowerCase()) ||
      tpl.description.toLowerCase().includes(search.toLowerCase());
    const matchesTag =
      selectedTag === "ALL" || tpl.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleCloneTemplate = (tpl: Template) => {
    addAssessment({
      title: `${tpl.title}`,
      slug: tpl.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      description: tpl.description,
      category: tpl.category.toUpperCase().replace(/\s+/g, "_") as any,
      industry: "Cross-Industry",
      targetRole: tpl.targetRole,
      seniorityLevel: "Senior",
      durationMinutes: tpl.durationMinutes,
      status: "Published",
      sections: [
        {
          id: `sec-${Date.now()}-1`,
          title: "Primary Psychometric Section",
          description: tpl.description,
          category: "COGNITIVE",
          durationMinutes: tpl.durationMinutes,
          questionCount: 8,
          instructions: "Read all items attentively and answer conscientiously.",
          questionIds: ["q-num-01", "q-log-01", "q-pers-01", "q-sjt-01"],
        },
      ],
      settings: {
        allowBacktracking: true,
        shuffleQuestions: true,
        shuffleOptions: true,
        showSectionTimer: true,
        autoSubmitOnExpiry: true,
        passThresholdPercent: 70,
        candidateInstructions: "Calculators and paper allowed. Maintain focus within this window.",
        integrityMonitoring: {
          trackTabSwitches: true,
          trackFullscreen: true,
          trackCopyPaste: true,
          requireWebcam: false,
        },
      },
      tags: tpl.tags,
    });

    setClonedId(tpl.id);
    setTimeout(() => setClonedId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/assessments"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Assessment List
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Standardized Assessment Library
              </h1>
              <Badge variant="purple" className="text-xs">
                Pre-calibrated Norms
              </Badge>
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Ready-to-deploy psychometric templates with verified construct validity and normative datasets.
            </p>
          </div>

          <Link href="/assessments/create">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Author Custom Battery</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates by title, target role, or dimension..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {["ALL", "Cognitive", "Big Five", "SJT", "DISC", "EQ", "Finance"].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedTag === tag
                  ? "bg-blue-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((tpl) => {
          const isCloned = clonedId === tpl.id;

          return (
            <Card
              key={tpl.id}
              className="flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant="default" className="text-[10px]">
                    {tpl.category}
                  </Badge>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {tpl.normSample}
                  </span>
                </div>
                <CardTitle className="text-base font-bold mt-2">
                  {tpl.title}
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed line-clamp-3">
                  {tpl.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pb-4">
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5 text-xs dark:bg-slate-800/60">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Target Role
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 truncate block">
                      {tpl.targetRole}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                      Duration
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {tpl.durationMinutes} mins ({tpl.sectionsCount} sections)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {tpl.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </CardContent>

              <div className="border-t border-slate-100 p-4 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Calibrated & Validated
                </span>

                <Button
                  size="sm"
                  onClick={() => handleCloneTemplate(tpl)}
                  className={`gap-1.5 text-xs transition-all ${
                    isCloned
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  <Copy className="h-3.5 w-3.5" />
                  <span>{isCloned ? "Cloned to Active!" : "Use Template"}</span>
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

