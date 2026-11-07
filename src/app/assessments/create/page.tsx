"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import {
  AssessmentCategory,
  AssessmentSection,
  Question,
  DifficultyLevel,
} from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { generateId } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Plus,
  Trash2,
  Clock,
  Layers,
  Sparkles,
  ShieldAlert,
  FileCheck2,
  Sliders,
  HelpCircle,
  Eye,
} from "lucide-react";

export default function CreateAssessmentWizardPage() {
  const router = useRouter();
  const { questions, addAssessment } = useAssessmentStore();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    description: "",
    category: "COGNITIVE" as AssessmentCategory,
    industry: "Information Technology",
    targetRole: "",
    seniorityLevel: "Senior" as "Entry" | "Mid-Level" | "Senior" | "Lead" | "Executive",
    durationMinutes: 45,
    instructions: "Ensure a quiet environment. Pacing through each section is strongly encouraged.",
  });

  // Step 2: Sections
  const [sections, setSections] = useState<AssessmentSection[]>([
    {
      id: generateId("sec"),
      title: "Cognitive Deduction & Logic",
      description: "Assesses premise validity and deductive problem solving.",
      category: "LOGICAL_REASONING",
      durationMinutes: 15,
      questionCount: 4,
      instructions: "Evaluate the logical consistency of each premise.",
      questionIds: ["q-log-01", "q-abs-01"],
    },
    {
      id: generateId("sec"),
      title: "Workplace Behavioral & Big Five Style",
      description: "Evaluates workplace discipline, openness, and resilience.",
      category: "PERSONALITY_BIG_FIVE",
      durationMinutes: 10,
      questionCount: 3,
      instructions: "Select the option that best reflects your natural workplace tendencies.",
      questionIds: ["q-pers-01", "q-pers-02", "q-pers-03"],
    },
  ]);

  // Step 4: Settings
  const [settings, setSettings] = useState({
    allowBacktracking: true,
    shuffleQuestions: true,
    shuffleOptions: true,
    showSectionTimer: true,
    autoSubmitOnExpiry: true,
    passThresholdPercent: 70,
    integrityMonitoring: {
      trackTabSwitches: true,
      trackFullscreen: true,
      trackCopyPaste: true,
      requireWebcam: false,
    },
    candidateInstructions: "Calculators and scrap paper are permitted. Avoid navigating away from the test window.",
  });

  // Section Management helpers
  const handleAddSection = () => {
    const newSec: AssessmentSection = {
      id: generateId("sec"),
      title: "Situational Judgement & Tradeoffs",
      description: "Workplace dilemma resolution and decision making.",
      category: "SITUATIONAL_JUDGEMENT",
      durationMinutes: 12,
      questionCount: 3,
      instructions: "Evaluate the scenario and pick the most constructive decision.",
      questionIds: ["q-sjt-01"],
    };
    setSections([...sections, newSec]);
  };

  const handleRemoveSection = (id: string) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((s) => s.id !== id));
  };

  const handleToggleQuestionInSection = (sectionId: string, questionId: string) => {
    setSections(
      sections.map((s) => {
        if (s.id !== sectionId) return s;
        const exists = s.questionIds.includes(questionId);
        const updated = exists
          ? s.questionIds.filter((qid) => qid !== questionId)
          : [...s.questionIds, questionId];
        return {
          ...s,
          questionIds: updated,
          questionCount: updated.length,
        };
      })
    );
  };

  const handleSaveAssessment = (publishStatus: "Draft" | "Published" | "Active") => {
    setIsPublishing(true);

    const created = addAssessment({
      title: basicInfo.title || "Custom Enterprise Psychometric Assessment",
      slug: (basicInfo.title || "custom-assessment")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-"),
      description: basicInfo.description || "Holistic psychometric battery evaluating cognitive aptitude and behavioral dimensions.",
      category: basicInfo.category,
      industry: basicInfo.industry,
      targetRole: basicInfo.targetRole || "Senior Professional",
      seniorityLevel: basicInfo.seniorityLevel,
      durationMinutes: sections.reduce((acc, s) => acc + s.durationMinutes, 0) || basicInfo.durationMinutes,
      status: publishStatus,
      sections,
      settings,
      tags: [basicInfo.industry, basicInfo.seniorityLevel, basicInfo.category],
    });

    setTimeout(() => {
      setIsPublishing(false);
      router.push(`/assessments/${created.id}`);
    }, 600);
  };

  const steps = [
    { num: 1, label: "Basic Information" },
    { num: 2, label: "Configure Sections" },
    { num: 3, label: "Question Bank Pool" },
    { num: 4, label: "Integrity & Rules" },
    { num: 5, label: "Review & Publish" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href="/assessments"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Assessments
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Create New Assessment
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Multi-step builder to configure cognitive sections, scoring norms, and test integrity.
            </p>
          </div>
          <Badge variant="purple" className="text-xs">
            Step {currentStep} of 5
          </Badge>
        </div>
      </div>

      {/* Stepper Wizard Progress */}
      <div className="grid grid-cols-5 gap-2 border-b border-slate-200 pb-4 dark:border-slate-800">
        {steps.map((s) => {
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;

          return (
            <div
              key={s.num}
              onClick={() => setCurrentStep(s.num)}
              className="cursor-pointer group flex flex-col items-center text-center"
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/50"
                    : isDone
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 dark:bg-slate-800"
                }`}
              >
                {isDone ? <CheckCircle2 className="h-4 w-4" /> : s.num}
              </div>
              <span
                className={`mt-1.5 text-[11px] font-medium hidden sm:block ${
                  isCurrent
                    ? "text-blue-600 font-bold"
                    : "text-slate-500 group-hover:text-slate-800"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card className="p-6 space-y-4">
          <CardHeader className="p-0 pb-4 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Step 1: Basic Assessment Information</CardTitle>
            <CardDescription>
              Define the target role, industry context, and candidate instructions.
            </CardDescription>
          </CardHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Assessment Title *
              </label>
              <Input
                value={basicInfo.title}
                onChange={(e) =>
                  setBasicInfo({ ...basicInfo, title: e.target.value })
                }
                placeholder="e.g. Lead Distributed Systems Engineer Psychometric Evaluation"
                className="h-10 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Assessment Category *
                </label>
                <select
                  value={basicInfo.category}
                  onChange={(e) =>
                    setBasicInfo({
                      ...basicInfo,
                      category: e.target.value as AssessmentCategory,
                    })
                  }
                  className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="COGNITIVE">Cognitive Aptitude Comprehensive</option>
                  <option value="NUMERICAL_REASONING">Numerical Reasoning</option>
                  <option value="LOGICAL_REASONING">Logical Reasoning</option>
                  <option value="PERSONALITY_BIG_FIVE">Big Five Personality Assessment</option>
                  <option value="DISC_BEHAVIORAL">DISC Behavioral Profile</option>
                  <option value="SITUATIONAL_JUDGEMENT">Situational Judgement Test (SJT)</option>
                  <option value="EMOTIONAL_INTELLIGENCE">Emotional Intelligence (EQ)</option>
                  <option value="ROLE_BEHAVIORAL">Role-Specific Competencies</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Industry / Sector *
                </label>
                <Input
                  value={basicInfo.industry}
                  onChange={(e) =>
                    setBasicInfo({ ...basicInfo, industry: e.target.value })
                  }
                  placeholder="e.g. Fintech, Healthcare, Cloud SaaS"
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Target Job Role *
                </label>
                <Input
                  value={basicInfo.targetRole}
                  onChange={(e) =>
                    setBasicInfo({ ...basicInfo, targetRole: e.target.value })
                  }
                  placeholder="e.g. Solutions Architect"
                  className="h-10 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Seniority Level
                </label>
                <select
                  value={basicInfo.seniorityLevel}
                  onChange={(e) =>
                    setBasicInfo({
                      ...basicInfo,
                      seniorityLevel: e.target.value as any,
                    })
                  }
                  className="w-full h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  <option value="Entry">Entry Level / Graduate</option>
                  <option value="Mid-Level">Mid-Level Professional</option>
                  <option value="Senior">Senior Professional</option>
                  <option value="Lead">Lead / Staff Specialist</option>
                  <option value="Executive">Executive / Director</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Estimated Duration (Minutes)
                </label>
                <Input
                  type="number"
                  value={basicInfo.durationMinutes}
                  onChange={(e) =>
                    setBasicInfo({
                      ...basicInfo,
                      durationMinutes: Number(e.target.value),
                    })
                  }
                  className="h-10 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Assessment Description & Objectives
              </label>
              <textarea
                value={basicInfo.description}
                onChange={(e) =>
                  setBasicInfo({ ...basicInfo, description: e.target.value })
                }
                placeholder="Explain the competencies and traits measured by this assessment..."
                rows={3}
                className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Configure Sections */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Step 2: Configure Assessment Sections
              </h2>
              <p className="text-xs text-slate-500">
                Organize tests into timed sections with dedicated instructions.
              </p>
            </div>
            <Button size="sm" onClick={handleAddSection} className="gap-1.5 text-xs">
              <Plus className="h-3.5 w-3.5" /> Add Section
            </Button>
          </div>

          <div className="space-y-3">
            {sections.map((sec, index) => (
              <Card key={sec.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-800">
                      {index + 1}
                    </span>
                    <Input
                      value={sec.title}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[index]!.title = e.target.value;
                        setSections(updated);
                      }}
                      className="h-8 font-semibold text-xs max-w-sm"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSection(sec.id)}
                    className="h-7 text-red-500 hover:text-red-700"
                    disabled={sections.length <= 1}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Section Category
                    </label>
                    <select
                      value={sec.category}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[index]!.category = e.target.value as AssessmentCategory;
                        setSections(updated);
                      }}
                      className="w-full h-8 rounded border border-slate-200 bg-white px-2 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
                    >
                      <option value="LOGICAL_REASONING">Logical Reasoning</option>
                      <option value="NUMERICAL_REASONING">Numerical Reasoning</option>
                      <option value="VERBAL_REASONING">Verbal Reasoning</option>
                      <option value="ABSTRACT_REASONING">Abstract Reasoning</option>
                      <option value="PERSONALITY_BIG_FIVE">Big Five Personality</option>
                      <option value="DISC_BEHAVIORAL">DISC Behavioral</option>
                      <option value="SITUATIONAL_JUDGEMENT">Situational Judgement</option>
                      <option value="EMOTIONAL_INTELLIGENCE">Emotional Intelligence</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Duration (Minutes)
                    </label>
                    <Input
                      type="number"
                      value={sec.durationMinutes}
                      onChange={(e) => {
                        const updated = [...sections];
                        updated[index]!.durationMinutes = Number(e.target.value);
                        setSections(updated);
                      }}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                      Questions in Section
                    </label>
                    <div className="flex items-center h-8 px-3 rounded border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800">
                      {sec.questionIds.length} Assigned
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-500 block mb-1">
                    Section Instructions for Candidate
                  </label>
                  <Input
                    value={sec.instructions}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[index]!.instructions = e.target.value;
                      setSections(updated);
                    }}
                    placeholder="Instructions displayed before starting this section..."
                    className="h-8 text-xs"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Question Configuration */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Step 3: Assign Questions from Bank
            </h2>
            <p className="text-xs text-slate-500">
              Select questions from the centralized question bank to populate each section.
            </p>
          </div>

          <div className="space-y-4">
            {sections.map((sec, secIdx) => (
              <Card key={sec.id} className="p-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 dark:border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {secIdx + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                      {sec.title} ({sec.questionIds.length} Selected)
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {sec.category.replace(/_/g, " ")}
                  </Badge>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {questions.map((q) => {
                    const isSelected = sec.questionIds.includes(q.id);
                    return (
                      <div
                        key={q.id}
                        onClick={() => handleToggleQuestionInSection(sec.id, q.id)}
                        className={`flex items-start justify-between p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50/60 dark:bg-blue-900/30"
                            : "border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-start gap-2.5">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {q.title}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {q.content}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            q.difficulty === "Easy"
                              ? "success"
                              : q.difficulty === "Medium"
                              ? "warning"
                              : "destructive"
                          }
                          className="text-[9px]"
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Settings & Rules */}
      {currentStep === 4 && (
        <Card className="p-6 space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Step 4: Assessment Rules & Integrity Telemetry</CardTitle>
            <CardDescription>
              Configure candidate experience rules, anti-cheating protections, and pass thresholds.
            </CardDescription>
          </CardHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4 space-y-3 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Navigation & Execution Controls
              </span>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowBacktracking}
                  onChange={(e) =>
                    setSettings({ ...settings, allowBacktracking: e.target.checked })
                  }
                  className="rounded text-blue-600"
                />
                Allow candidate to backtrack between questions
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.shuffleQuestions}
                  onChange={(e) =>
                    setSettings({ ...settings, shuffleQuestions: e.target.checked })
                  }
                  className="rounded text-blue-600"
                />
                Shuffle question presentation sequence
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoSubmitOnExpiry}
                  onChange={(e) =>
                    setSettings({ ...settings, autoSubmitOnExpiry: e.target.checked })
                  }
                  className="rounded text-blue-600"
                />
                Auto-submit session immediately upon time expiry
              </label>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-3 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Integrity & Telemetry Monitoring
              </span>
              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.integrityMonitoring.trackTabSwitches}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      integrityMonitoring: {
                        ...settings.integrityMonitoring,
                        trackTabSwitches: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-blue-600"
                />
                Track browser tab switches and window blur events
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.integrityMonitoring.trackFullscreen}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      integrityMonitoring: {
                        ...settings.integrityMonitoring,
                        trackFullscreen: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-blue-600"
                />
                Enforce fullscreen distraction-free testing layout
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.integrityMonitoring.trackCopyPaste}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      integrityMonitoring: {
                        ...settings.integrityMonitoring,
                        trackCopyPaste: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-blue-600"
                />
                Block clipboard copy/paste actions on question content
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Minimum Benchmark Passing Threshold (%)
            </label>
            <Input
              type="number"
              value={settings.passThresholdPercent}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  passThresholdPercent: Number(e.target.value),
                })
              }
              className="h-10 text-xs max-w-xs"
            />
          </div>
        </Card>
      )}

      {/* Step 5: Review & Publish */}
      {currentStep === 5 && (
        <Card className="p-6 space-y-6">
          <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Step 5: Review Assessment Summary</CardTitle>
            <CardDescription>
              Verify the battery structure before publishing to your talent pipeline.
            </CardDescription>
          </CardHeader>

          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Assessment Name:</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {basicInfo.title || "Custom Enterprise Assessment"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Target Role & Level:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {basicInfo.targetRole || "Senior Professional"} ({basicInfo.seniorityLevel})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Sections Included:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {sections.length} Sections ({sections.reduce((a, s) => a + s.questionIds.length, 0)} total questions)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Duration:</span>
                <span className="font-bold text-blue-600">
                  {sections.reduce((a, s) => a + s.durationMinutes, 0)} Minutes
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                Sections Breakdown:
              </span>
              {sections.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 text-xs dark:border-slate-800"
                >
                  <span className="font-medium">
                    {idx + 1}. {s.title}
                  </span>
                  <span className="text-slate-500">
                    {s.durationMinutes} mins • {s.questionIds.length} questions
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Stepper Footer Controls */}
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className="gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Previous
        </Button>

        <div className="flex items-center gap-2">
          {currentStep === 5 ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveAssessment("Draft")}
                disabled={isPublishing}
              >
                Save as Draft
              </Button>
              <Button
                size="sm"
                onClick={() => handleSaveAssessment("Published")}
                disabled={isPublishing}
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isPublishing ? "Publishing..." : "Publish Assessment"}</span>
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              className="gap-1.5"
            >
              <span>Next Step</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

