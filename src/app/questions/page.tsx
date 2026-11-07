"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Question, QuestionType, AssessmentCategory, DifficultyLevel } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/dialog";
import {
  HelpCircle,
  Plus,
  Search,
  Filter,
  Eye,
  Trash2,
  Edit,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Tag,
  Clock,
  Layers,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";

export default function QuestionBankPage() {
  const { questions, deleteQuestion, addQuestion, updateQuestion } = useAssessmentStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");

  // Modal State for Preview
  const [previewQuestion, setPreviewQuestion] = useState<Question | null>(null);

  // Modal State for Create / Edit
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "LOGICAL_REASONING" as AssessmentCategory,
    questionType: "SINGLE_CHOICE" as QuestionType,
    difficulty: "Medium" as DifficultyLevel,
    competency: "Analytical Reasoning",
    tags: "Logic, Deduction",
    explanation: "",
    timeLimitSeconds: 60,
  });

  // Filter Questions
  const filtered = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.content.toLowerCase().includes(search.toLowerCase()) ||
      q.competency.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "ALL" || q.category === selectedCategory;
    const matchesDifficulty =
      selectedDifficulty === "ALL" || q.difficulty === selectedDifficulty;
    const matchesType =
      selectedType === "ALL" || q.questionType === selectedType;
    return matchesSearch && matchesCategory && matchesDifficulty && matchesType;
  });

  const handleOpenCreate = () => {
    setEditingQuestion(null);
    setFormData({
      title: "",
      content: "",
      category: "LOGICAL_REASONING",
      questionType: "SINGLE_CHOICE",
      difficulty: "Medium",
      competency: "Analytical Reasoning",
      tags: "Logic, Analysis",
      explanation: "",
      timeLimitSeconds: 60,
    });
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setFormData({
      title: q.title,
      content: q.content,
      category: q.category,
      questionType: q.questionType,
      difficulty: q.difficulty,
      competency: q.competency,
      tags: q.tags.join(", "),
      explanation: q.explanation || "",
      timeLimitSeconds: q.timeLimitSeconds || 60,
    });
    setIsEditorOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);

    if (editingQuestion) {
      updateQuestion(editingQuestion.id, {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        questionType: formData.questionType,
        difficulty: formData.difficulty,
        competency: formData.competency,
        tags: tagsArray,
        explanation: formData.explanation,
        timeLimitSeconds: formData.timeLimitSeconds,
      });
    } else {
      addQuestion({
        title: formData.title || "New Question Item",
        content: formData.content || "Question prompt text...",
        category: formData.category,
        questionType: formData.questionType,
        difficulty: formData.difficulty,
        competency: formData.competency,
        tags: tagsArray,
        explanation: formData.explanation,
        timeLimitSeconds: formData.timeLimitSeconds,
        options: [
          { id: "opt-1", text: "Option A", isCorrect: true },
          { id: "opt-2", text: "Option B" },
          { id: "opt-3", text: "Option C" },
          { id: "opt-4", text: "Option D" },
        ],
        correctAnswer: "opt-1",
      });
    }
    setIsEditorOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Psychometric Question Bank
            </h1>
            <Badge variant="purple" className="text-xs">
              {questions.length} Items Available
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Enterprise repository of calibrated cognitive problems, Big Five Likert items, DISC behaviors, and Situational Judgement Tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/ai-generator">
            <Button variant="secondary" size="sm" className="gap-1.5 text-blue-600 dark:text-blue-400">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>AI Question Generator</span>
            </Button>
          </Link>
          <Button size="sm" onClick={handleOpenCreate} className="gap-1.5 shadow-sm">
            <Plus className="h-3.5 w-3.5" />
            <span>Create Question</span>
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions by title, prompt, competency..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="ALL">All Categories</option>
            <option value="NUMERICAL_REASONING">Numerical Reasoning</option>
            <option value="VERBAL_REASONING">Verbal Reasoning</option>
            <option value="LOGICAL_REASONING">Logical Reasoning</option>
            <option value="ABSTRACT_REASONING">Abstract Reasoning</option>
            <option value="PERSONALITY_BIG_FIVE">Big Five Personality</option>
            <option value="DISC_BEHAVIORAL">DISC Behavioral</option>
            <option value="SITUATIONAL_JUDGEMENT">Situational Judgement</option>
            <option value="EMOTIONAL_INTELLIGENCE">Emotional Intelligence</option>
            <option value="ROLE_BEHAVIORAL">Role Competencies</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="ALL">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Expert">Expert</option>
          </select>

          {/* Question Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="ALL">All Types</option>
            <option value="SINGLE_CHOICE">Single Choice</option>
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="LIKERT_SCALE">Likert Scale</option>
            <option value="NUMERICAL_INPUT">Numerical Input</option>
            <option value="TEXT_ANSWER">Text Answer</option>
            <option value="IMAGE_BASED">Pattern / Image</option>
            <option value="MATRIX">Matrix</option>
            <option value="RANKING">Ranking</option>
            <option value="SITUATIONAL_JUDGEMENT">Situational Judgement</option>
          </select>
        </div>
      </div>

      {/* Question Items Listing */}
      <div className="space-y-3">
        {filtered.map((q) => (
          <Card
            key={q.id}
            className="p-4 hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {q.category.replace(/_/g, " ")}
                </Badge>
                <Badge
                  variant={
                    q.difficulty === "Easy"
                      ? "success"
                      : q.difficulty === "Medium"
                      ? "warning"
                      : "destructive"
                  }
                  className="text-[10px]"
                >
                  {q.difficulty}
                </Badge>
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {q.questionType.replace(/_/g, " ")}
                </span>
                {q.dimension && (
                  <span className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                    Dim: {q.dimension}
                  </span>
                )}
                {q.reverseScored && (
                  <span className="rounded bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                    Reverse Scored
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {q.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line line-clamp-2">
                  {q.content}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                  <Tag className="h-3 w-3 text-slate-400" /> Competency: {q.competency}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {q.timeLimitSeconds || 60}s time limit
                </span>
                {q.tags?.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex gap-1">
                      {q.tags.map((t) => (
                        <span key={t} className="text-slate-500">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPreviewQuestion(q)}
                title="Preview Question in Testing Simulator"
                className="h-8 gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <Eye className="h-3.5 w-3.5" /> Preview
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenEdit(q)}
                className="h-8 w-8 p-0 text-slate-600"
              >
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteQuestion(q.id)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {previewQuestion && (
        <Modal
          isOpen={!!previewQuestion}
          onClose={() => setPreviewQuestion(null)}
          title={`Question Preview: ${previewQuestion.title}`}
          description={`Category: ${previewQuestion.category.replace(/_/g, " ")} • Difficulty: ${previewQuestion.difficulty}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block mb-1">
                Candidate Prompt
              </span>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-pre-line leading-relaxed">
                {previewQuestion.content}
              </p>
            </div>

            {/* Answer Options Simulation */}
            {previewQuestion.options && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Selectable Options:
                </span>
                {previewQuestion.options.map((opt, i) => (
                  <div
                    key={opt.id}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs ${
                      opt.isCorrect
                        ? "border-emerald-300 bg-emerald-50/60 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/20 dark:text-emerald-300"
                        : "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 font-bold text-[10px] dark:bg-slate-800">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt.text}</span>
                    </div>
                    {opt.isCorrect && (
                      <Badge variant="success" className="text-[9px]">
                        Correct Answer (Author Preview)
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Explanation Preview */}
            {previewQuestion.explanation && (
              <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-900 dark:bg-blue-950/30 dark:text-blue-300">
                <strong className="font-semibold block mb-0.5">Author Psychometric Rationale:</strong>
                {previewQuestion.explanation}
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button size="sm" onClick={() => setPreviewQuestion(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create / Edit Question Modal */}
      {isEditorOpen && (
        <Modal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          title={editingQuestion ? "Edit Psychometric Question" : "Create New Psychometric Item"}
          description="Define the item stimulus, competency tags, and scoring weights."
          size="lg"
        >
          <form onSubmit={handleSaveQuestion} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Item Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="e.g. Algorithmic Cache Capacity Estimation"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value as any })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="NUMERICAL_REASONING">Numerical Reasoning</option>
                  <option value="VERBAL_REASONING">Verbal Reasoning</option>
                  <option value="LOGICAL_REASONING">Logical Reasoning</option>
                  <option value="ABSTRACT_REASONING">Abstract Reasoning</option>
                  <option value="PERSONALITY_BIG_FIVE">Big Five Personality</option>
                  <option value="DISC_BEHAVIORAL">DISC Behavioral</option>
                  <option value="SITUATIONAL_JUDGEMENT">Situational Judgement</option>
                  <option value="EMOTIONAL_INTELLIGENCE">Emotional Intelligence</option>
                  <option value="ROLE_BEHAVIORAL">Role Competencies</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Question Type *
                </label>
                <select
                  value={formData.questionType}
                  onChange={(e) =>
                    setFormData({ ...formData, questionType: e.target.value as any })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="SINGLE_CHOICE">Single Choice</option>
                  <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                  <option value="LIKERT_SCALE">Likert Scale</option>
                  <option value="NUMERICAL_INPUT">Numerical Input</option>
                  <option value="TEXT_ANSWER">Text Answer</option>
                  <option value="IMAGE_BASED">Image / Pattern</option>
                  <option value="RANKING">Ranking</option>
                  <option value="SITUATIONAL_JUDGEMENT">Situational Judgement</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Difficulty Level
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({ ...formData, difficulty: e.target.value as any })
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
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Question Prompt & Stimulus Text *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={3}
                placeholder="Enter the scenario or math problem prompt here..."
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Competency Measured
                </label>
                <Input
                  value={formData.competency}
                  onChange={(e) => setFormData({ ...formData, competency: e.target.value })}
                  placeholder="e.g. Critical Deduction"
                  className="h-9 text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Tags (comma separated)
                </label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="e.g. Logic, Cloud, Architecture"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Scoring Explanation / Rationale
              </label>
              <Input
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                placeholder="Internal explanation of why the correct option is optimal..."
                className="h-9 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsEditorOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                {editingQuestion ? "Save Changes" : "Add to Question Bank"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

