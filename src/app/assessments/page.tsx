"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { useRoleStore } from "@/store/roleStore";
import { Assessment, AssessmentStatus, AssessmentCategory } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import {
  FileCheck2,
  Plus,
  Search,
  Filter,
  Layers,
  Clock,
  Users2,
  Sparkles,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Copy,
  Eye,
  SlidersHorizontal,
  FolderKanban,
} from "lucide-react";

export default function AssessmentListPage() {
  const { assessments, deleteAssessment, addAssessment } = useAssessmentStore();
  const { currentUser } = useRoleStore();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);

  // Filter assessments
  const filtered = assessments.filter((asm) => {
    const matchesSearch =
      asm.title.toLowerCase().includes(search.toLowerCase()) ||
      asm.targetRole.toLowerCase().includes(search.toLowerCase()) ||
      asm.industry.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || asm.status === selectedStatus;
    const matchesCategory =
      selectedCategory === "ALL" || asm.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDuplicate = (asm: Assessment) => {
    addAssessment({
      ...asm,
      title: `${asm.title} (Copy)`,
      slug: `${asm.slug}-copy`,
      status: "Draft",
    });
    setActionMenuOpen(null);
  };

  const getStatusBadgeVariant = (status: AssessmentStatus) => {
    switch (status) {
      case "Active":
        return "success";
      case "Published":
        return "default";
      case "Draft":
        return "warning";
      case "Archived":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Assessment Management
            </h1>
            <Badge variant="default" className="text-xs">
              {filtered.length} Batteries
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Configure multi-section psychometric batteries, cognitive aptitude benchmarks, and behavioral assessments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/assessments/library">
            <Button variant="outline" size="sm" className="gap-1.5">
              <FolderKanban className="h-3.5 w-3.5 text-slate-500" />
              <span>Assessment Library</span>
            </Button>
          </Link>
          <Link href="/assessments/create">
            <Button size="sm" className="gap-1.5 shadow-sm">
              <Plus className="h-3.5 w-3.5" />
              <span>Create Assessment</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by assessment title, target role, or industry..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="ALL">All Categories</option>
            <option value="COGNITIVE">Cognitive Aptitude</option>
            <option value="NUMERICAL_REASONING">Numerical Reasoning</option>
            <option value="PERSONALITY_BIG_FIVE">Big Five Personality</option>
            <option value="SITUATIONAL_JUDGEMENT">Situational Judgement</option>
            <option value="DISC_BEHAVIORAL">DISC Behavioral</option>
            <option value="ROLE_BEHAVIORAL">Role Specific</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg border border-slate-200 p-0.5 dark:border-slate-800">
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`rounded p-1.5 transition-colors ${
                viewMode === "list"
                  ? "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-white"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Assessment Listing Content */}
      {filtered.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            <FileCheck2 className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
            No assessments found
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Try adjusting your search query or status filter.
          </p>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((asm) => {
            const totalQuestions = asm.sections.reduce(
              (acc, sec) => acc + (sec.questionIds?.length || sec.questionCount),
              0
            );

            return (
              <Card
                key={asm.id}
                className="group relative flex flex-col justify-between hover:border-blue-300 hover:shadow-md transition-all"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={getStatusBadgeVariant(asm.status)}>
                      {asm.status}
                    </Badge>
                    <span className="text-[11px] font-medium text-slate-400">
                      {asm.seniorityLevel}
                    </span>
                  </div>
                  <CardTitle className="mt-2 text-base font-bold group-hover:text-blue-600 transition-colors line-clamp-1">
                    <Link href={`/assessments/${asm.id}`}>{asm.title}</Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-xs">
                    {asm.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4">
                  {/* Assessment Metadata Pills */}
                  <div className="grid grid-cols-3 gap-2 rounded-lg bg-slate-50 p-2 text-center text-xs dark:bg-slate-800/60">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Duration
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {asm.durationMinutes}m
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Sections
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {asm.sections.length}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                        Questions
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {totalQuestions}
                      </span>
                    </div>
                  </div>

                  {/* Sections list preview */}
                  <div className="mt-3 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Sections Included:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {asm.sections.slice(0, 3).map((sec) => (
                        <span
                          key={sec.id}
                          className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {sec.title.split("&")[0]}
                        </span>
                      ))}
                      {asm.sections.length > 3 && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                          +{asm.sections.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>

                <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Users2 className="h-3.5 w-3.5" />
                    <span>
                      <strong className="text-slate-700 dark:text-slate-200">
                        {asm.completedCandidatesCount}
                      </strong>{" "}
                      / {asm.assignedCandidatesCount} Candidates
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDuplicate(asm)}
                      title="Duplicate Assessment"
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Link href={`/assessments/${asm.id}`}>
                      <Button variant="outline" size="sm" className="h-8 px-2.5 text-xs">
                        View <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* List View */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                  <th className="py-3 px-4 font-semibold">Assessment Title</th>
                  <th className="py-3 px-4 font-semibold">Target Role</th>
                  <th className="py-3 px-4 font-semibold">Sections</th>
                  <th className="py-3 px-4 font-semibold">Duration</th>
                  <th className="py-3 px-4 font-semibold">Candidates</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((asm) => (
                  <tr
                    key={asm.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      <Link
                        href={`/assessments/${asm.id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {asm.title}
                      </Link>
                      <p className="text-[11px] font-normal text-slate-400">
                        {asm.industry}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {asm.targetRole}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {asm.sections.length} sections
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {asm.durationMinutes} mins
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {asm.completedCandidatesCount}
                      </span>{" "}
                      / {asm.assignedCandidatesCount}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={getStatusBadgeVariant(asm.status)}>
                        {asm.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/assessments/${asm.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Eye className="h-3.5 w-3.5 mr-1" /> View
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteAssessment(asm.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

