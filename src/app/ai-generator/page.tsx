"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Question, AssessmentCategory, QuestionType, DifficultyLevel } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/dialog";
import { generateId } from "@/lib/utils";
import {
  Sparkles,
  BrainCircuit,
  CheckCircle2,
  XCircle,
  RotateCcw,
  PlusCircle,
  Eye,
  Sliders,
  AlertTriangle,
  HelpCircle,
  Tag,
  ArrowRight,
  ShieldCheck,
  Check,
} from "lucide-react";

export default function AiQuestionGeneratorPage() {
  const {
    aiGeneratedQuestions,
    setAiGeneratedQuestions,
    updateAiQuestionStatus,
    addAiQuestionToBank,
  } = useAssessmentStore();

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<Question | null>(null);
  const [addedIds, setAddedIds] = useState<string[]>([]);

  // Generator Configuration Form
  const [form, setForm] = useState({
    jobRole: "Senior Cloud Infrastructure Engineer",
    industry: "Cloud & Distributed Systems",
    seniorityLevel: "Senior",
    category: "SITUATIONAL_JUDGEMENT" as AssessmentCategory,
    competency: "Fault-Tolerant Incident Resolution",
    difficulty: "Hard" as DifficultyLevel,
    questionType: "SITUATIONAL_JUDGEMENT" as QuestionType,
    count: 3,
    language: "English (US)",
  });

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      // High-quality simulated psychometric questions tailored to the inputs
      const simulated: Question[] = [
        {
          id: generateId("ai-q"),
          title: `Post-Mortem Blameless Root Cause: ${form.competency}`,
          content: `Scenario: A multi-region storage cluster suffered an unintended failover during off-peak hours due to an undocumented race condition in the orchestration agent. While no customer data was lost, the failover breached a secondary SLA requirement with enterprise tier accounts. What is the MOST effective immediate engineering governance response?`,
          category: form.category,
          questionType: form.questionType,
          difficulty: form.difficulty,
          competency: form.competency,
          tags: ["AI Generated", form.industry, "Incident Governance"],
          scenario: "Cascading asynchronous failover during off-peak maintenance.",
          options: [
            {
              id: "opt-ai-1",
              text: "Sanction the on-call engineer who approved the orchestration agent pull request without waiting for the primary squad review.",
              scoreWeight: 1,
            },
            {
              id: "opt-ai-2",
              text: "Publish an interim post-mortem within 24 hours detailing the telemetry timeline, implement a canary regression test that specifically exercises the race condition, and convene an open incident retrospective to calibrate orchestration safeguards.",
              scoreWeight: 5,
              isCorrect: true,
            },
            {
              id: "opt-ai-3",
              text: "Manually patch the production cluster nodes immediately and suppress external client communication until the root cause is resolved.",
              scoreWeight: 2,
            },
            {
              id: "opt-ai-4",
              text: "Freeze all feature deployments across the engineering organization indefinitely until a third-party audit completes.",
              scoreWeight: 2,
            },
          ],
          correctAnswer: "opt-ai-2",
          explanation: `In complex distributed systems, blameless post-mortems and deterministic regression tests yield the highest long-term reliability while preserving team psychological safety and client transparency.`,
          validationWarnings: [
            "Construct Validity: Verified high discrimination coefficient (r = 0.46)",
            "Reading Ease Index: 64.2 (Standard Enterprise Professional)",
          ],
          aiGenerated: true,
          reviewStatus: "AI_GENERATED",
          timeLimitSeconds: 120,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: generateId("ai-q"),
          title: `Quantitative Trade-off: High Availability vs. Cost Optimization`,
          content: `A telemetry ingest service receives 4.8 million events per minute across three availability zones. Cross-AZ network egress costs currently represent 42% of the infrastructure budget. If single-AZ sharding reduces monthly spend by $85,000 but decreases availability SLA from 99.99% to 99.9%, which architectural decision is optimal?`,
          category: "NUMERICAL_REASONING",
          questionType: "SINGLE_CHOICE",
          difficulty: "Hard",
          competency: "System Economics & Trade-off Optimization",
          tags: ["AI Generated", "Architecture", "FinOps"],
          options: [
            {
              id: "opt-ai-5",
              text: "Immediately shard into a single availability zone without customer contract review to capture the $85,000 monthly cost savings.",
            },
            {
              id: "opt-ai-6",
              text: "Quantify the financial penalty of the 0.09% SLA downgrade against contracted client breach clauses before evaluating topology compression or zonal cache co-location.",
              isCorrect: true,
            },
            {
              id: "opt-ai-7",
              text: "Reject all cost optimization efforts because high availability must be maintained at any monetary expense.",
            },
            {
              id: "opt-ai-8",
              text: "Reduce telemetry sampling rates to 10% to unilaterally cut ingestion volume.",
            },
          ],
          correctAnswer: "opt-ai-6",
          explanation: `Sound systems architecture balances FinOps targets with contractual legal liability and availability commitments.`,
          validationWarnings: [
            "Psychometric Calibrated Difficulty: 78th Percentile",
          ],
          aiGenerated: true,
          reviewStatus: "AI_GENERATED",
          timeLimitSeconds: 90,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: generateId("ai-q"),
          title: `Interpersonal EQ: Cross-Functional Escalation Under Pressure`,
          content: `During an urgent security patch rollout, an enthusiastic junior software engineer flags that the chosen cipher suite may marginally increase CPU utilization on legacy edge devices. How do you respond to foster continuous psychological safety while hitting the security patch deadline?`,
          category: "EMOTIONAL_INTELLIGENCE",
          questionType: "SINGLE_CHOICE",
          difficulty: "Medium",
          competency: "Constructive Feedback & Mentorship",
          tags: ["AI Generated", "EQ", "Psychological Safety"],
          options: [
            {
              id: "opt-ai-9",
              text: "Praise their diligence in analyzing edge constraints, rapidly verify telemetry metrics together in a 5-minute sandbox test, and agree on whether the cipher trade-off meets emergency patch criteria.",
              isCorrect: true,
            },
            {
              id: "opt-ai-10",
              text: "Dismiss the observation immediately as unimportant given the emergency nature of the vulnerability.",
            },
            {
              id: "opt-ai-11",
              text: "Tell the engineer to independently rewrite the cipher suite within two hours.",
            },
            {
              id: "opt-ai-12",
              text: "Postpone the entire security release until next week to conduct extensive edge profiling.",
            },
          ],
          correctAnswer: "opt-ai-9",
          explanation: `Demonstrates empathetic mentorship and objective validation under high-urgency timelines.`,
          validationWarnings: [
            "Construct Balance: High empathy alignment with low defensiveness.",
          ],
          aiGenerated: true,
          reviewStatus: "AI_GENERATED",
          timeLimitSeconds: 60,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      setAiGeneratedQuestions(simulated);
      setIsGenerating(false);
    }, 1200);
  };

  const handleAddQuestionToBank = (qId: string) => {
    addAiQuestionToBank(qId);
    setAddedIds((prev) => [...prev, qId]);
  };

  return (
    <div className="space-y-6">
      {/* Simulation Disclosure Notice */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-blue-600 p-2 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                AI Question Synthesis Engine (Frontend Interactive Simulation)
              </h2>
              <Badge variant="purple" className="text-[10px]">
                Pre-Calibrated AI Sandbox
              </Badge>
            </div>
            <p className="mt-1 text-xs text-blue-800/80 dark:text-blue-300/80 leading-relaxed">
              This interface simulates role-aware psychometric question generation. In accordance with enterprise psychometric governance, all synthesized items undergo author review and validation checks before entry into live candidate batteries.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left (1 col), Results on Right (2 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <Card className="h-fit">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-base font-bold">
                Generation Parameters
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Configure target role and psychometric dimensions
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-4 space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Target Job Role
              </label>
              <Input
                value={form.jobRole}
                onChange={(e) => setForm({ ...form, jobRole: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Industry Domain
              </label>
              <Input
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Seniority Level
                </label>
                <select
                  value={form.seniorityLevel}
                  onChange={(e) =>
                    setForm({ ...form, seniorityLevel: e.target.value })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="Entry">Entry Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead / Architect</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={form.difficulty}
                  onChange={(e) =>
                    setForm({ ...form, difficulty: e.target.value as DifficultyLevel })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Assessment Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as AssessmentCategory })
                }
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
              >
                <option value="SITUATIONAL_JUDGEMENT">Situational Judgement Test (SJT)</option>
                <option value="LOGICAL_REASONING">Logical Reasoning</option>
                <option value="NUMERICAL_REASONING">Numerical Reasoning</option>
                <option value="PERSONALITY_BIG_FIVE">Big Five Work Style</option>
                <option value="DISC_BEHAVIORAL">DISC Behavioral Profiles</option>
                <option value="EMOTIONAL_INTELLIGENCE">Emotional Intelligence (EQ)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Target Competency / Dimension
              </label>
              <Input
                value={form.competency}
                onChange={(e) => setForm({ ...form, competency: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Question Type
                </label>
                <select
                  value={form.questionType}
                  onChange={(e) =>
                    setForm({ ...form, questionType: e.target.value as QuestionType })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="SITUATIONAL_JUDGEMENT">Situational Dilemma</option>
                  <option value="SINGLE_CHOICE">Single Choice</option>
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="LIKERT_SCALE">Likert 5-Point</option>
                  <option value="NUMERICAL_INPUT">Numerical Input</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Batch Count
                </label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={form.count}
                  onChange={(e) =>
                    setForm({ ...form, count: Number(e.target.value) })
                  }
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full gap-2 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-500/20"
            >
              <Sparkles className="h-4 w-4" />
              <span>{isGenerating ? "Synthesizing Items..." : "Generate Psychometric Items"}</span>
            </Button>
          </CardContent>
        </Card>

        {/* Results Column (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Synthesized Item Candidates
              </h2>
              <p className="text-xs text-slate-500">
                Review, approve, or import generated items into the active Question Bank.
              </p>
            </div>
            <Badge variant="default" className="text-xs">
              {aiGeneratedQuestions.length} Items Pending Review
            </Badge>
          </div>

          {isGenerating ? (
            <Card className="p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 animate-pulse dark:bg-blue-900/40">
                <Sparkles className="h-6 w-6 animate-spin" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                Synthesizing psychometric stimuli & calibration weights...
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Evaluating discrimination indices, Flesch-Kincaid complexity, and competency construct alignment.
              </p>
            </Card>
          ) : aiGeneratedQuestions.length === 0 ? (
            <Card className="p-12 text-center border-dashed">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                No generated questions yet
              </h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
                Configure your job role and target competency on the left, then click 'Generate Psychometric Items' to simulate AI item generation.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {aiGeneratedQuestions.map((q) => {
                const isAdded = addedIds.includes(q.id);

                return (
                  <Card key={q.id} className="p-5 space-y-3 hover:border-blue-300 transition-all">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            q.reviewStatus === "APPROVED"
                              ? "success"
                              : q.reviewStatus === "REJECTED"
                              ? "destructive"
                              : "warning"
                          }
                          className="text-[10px]"
                        >
                          Status: {q.reviewStatus?.replace(/_/g, " ")}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {q.category.replace(/_/g, " ")}
                        </Badge>
                        <Badge variant="purple" className="text-[10px]">
                          {q.difficulty}
                        </Badge>
                      </div>

                      <span className="text-[11px] font-semibold text-slate-400">
                        Competency: {q.competency}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        {q.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                        {q.content}
                      </p>
                    </div>

                    {/* Options list */}
                    {q.options && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-semibold text-slate-400 block">
                          Options & Weights:
                        </span>
                        {q.options.map((opt, i) => (
                          <div
                            key={opt.id}
                            className={`flex items-center justify-between p-2 rounded-lg text-xs ${
                              opt.isCorrect
                                ? "bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
                                : "bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="font-bold text-[10px] text-slate-400">
                                {String.fromCharCode(65 + i)}.
                              </span>
                              <span>{opt.text}</span>
                            </span>
                            {opt.isCorrect && (
                              <span className="text-[10px] font-bold text-emerald-700">
                                (Author Benchmark Key)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Psychometric validation notes */}
                    {q.validationWarnings && (
                      <div className="rounded-lg bg-amber-50/70 p-2 text-[11px] text-amber-900 dark:bg-amber-950/20 dark:text-amber-300 flex items-start gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                        <div>
                          {q.validationWarnings.map((w, idx) => (
                            <span key={idx} className="block">
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedPreview(q)}
                          className="h-8 text-xs text-blue-600"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> Full Preview
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateAiQuestionStatus(q.id, "APPROVED")}
                          className="h-8 text-xs text-emerald-600 hover:text-emerald-700"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateAiQuestionStatus(q.id, "REJECTED")}
                          className="h-8 text-xs text-rose-500 hover:text-rose-700"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
                        </Button>
                      </div>

                      <Button
                        size="sm"
                        onClick={() => handleAddQuestionToBank(q.id)}
                        disabled={isAdded}
                        className={`h-8 text-xs gap-1.5 transition-all ${
                          isAdded
                            ? "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Added to Question Bank
                          </>
                        ) : (
                          <>
                            <PlusCircle className="h-3.5 w-3.5" /> Add to Question Bank
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedPreview && (
        <Modal
          isOpen={!!selectedPreview}
          onClose={() => setSelectedPreview(null)}
          title={`Item Preview: ${selectedPreview.title}`}
          description={`Competency: ${selectedPreview.competency} • Category: ${selectedPreview.category.replace(/_/g, " ")}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">
                Candidate Prompt
              </span>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                {selectedPreview.content}
              </p>
            </div>

            {selectedPreview.explanation && (
              <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
                <strong className="font-semibold block mb-0.5">Author Psychometric Rationale:</strong>
                {selectedPreview.explanation}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button size="sm" onClick={() => setSelectedPreview(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

