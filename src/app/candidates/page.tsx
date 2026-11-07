"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Candidate, CandidateStatus } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import {
  Users2,
  Search,
  Filter,
  Plus,
  MailCheck,
  Award,
  GitCompare,
  FileSpreadsheet,
  ChevronRight,
  Send,
  MoreVertical,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export default function CandidatesPage() {
  const {
    candidates,
    assessments,
    addCandidate,
    toggleCandidateComparison,
    comparedCandidateIds,
  } = useAssessmentStore();

  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New candidate form
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    email: "",
    phone: "",
    appliedRole: "Senior Full-Stack Engineer",
    department: "Engineering",
    experienceYears: 5,
    assignedAssessmentId: assessments[0]?.id || "asm-eng-001",
  });

  const filtered = candidates.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.appliedRole.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === "ALL" || c.department === selectedDept;
    const matchesStatus = selectedStatus === "ALL" || c.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleCreateCandidate = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedAsm = assessments.find((a) => a.id === newCandidate.assignedAssessmentId) || assessments[0]!;

    addCandidate({
      name: newCandidate.name,
      email: newCandidate.email,
      phone: newCandidate.phone,
      appliedRole: newCandidate.appliedRole,
      department: newCandidate.department,
      experienceYears: Number(newCandidate.experienceYears),
      assignedAssessmentId: assignedAsm.id,
      assignedAssessmentTitle: assignedAsm.title,
      status: "INVITED",
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
    });

    setIsAddOpen(false);
    setNewCandidate({
      name: "",
      email: "",
      phone: "",
      appliedRole: "Senior Full-Stack Engineer",
      department: "Engineering",
      experienceYears: 5,
      assignedAssessmentId: assessments[0]?.id || "asm-eng-001",
    });
  };

  const getStatusBadge = (status: CandidateStatus) => {
    switch (status) {
      case "EVALUATED":
        return <Badge variant="success">Evaluated</Badge>;
      case "COMPLETED":
        return <Badge variant="default">Completed</Badge>;
      case "IN_PROGRESS":
        return <Badge variant="warning">Testing Live</Badge>;
      case "INVITED":
        return <Badge variant="secondary">Invited</Badge>;
      case "OPENED":
        return <Badge variant="purple">Link Opened</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Candidate Talent Pool
            </h1>
            <Badge variant="purple" className="text-xs">
              {candidates.length} Profiles
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Track candidates across cognitive testing, Big Five personality mapping, and comprehensive evaluation reports.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {comparedCandidateIds.length > 0 && (
            <Link href="/candidates/compare">
              <Button variant="secondary" size="sm" className="gap-1.5 text-blue-600 dark:text-blue-400">
                <GitCompare className="h-3.5 w-3.5 text-blue-600" />
                <span>Compare Selected ({comparedCandidateIds.length})</span>
              </Button>
            </Link>
          )}
          <Button size="sm" onClick={() => setIsAddOpen(true)} className="gap-1.5 shadow-sm">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Candidate</span>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates by name, email, or applied role..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Corporate Finance">Corporate Finance</option>
            <option value="Product Management">Product Management</option>
            <option value="Customer Operations">Customer Operations</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="ALL">All Statuses</option>
            <option value="EVALUATED">Evaluated</option>
            <option value="COMPLETED">Completed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="INVITED">Invited</option>
          </select>
        </div>
      </div>

      {/* Candidate Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                <th className="py-3 px-4 font-semibold w-10">Compare</th>
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">Applied Role & Dept</th>
                <th className="py-3 px-4 font-semibold">Assigned Battery</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Score</th>
                <th className="py-3 px-4 font-semibold">Percentile</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((cand) => {
                const isCompared = comparedCandidateIds.includes(cand.id);

                return (
                  <tr
                    key={cand.id}
                    className={`hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors ${
                      isCompared ? "bg-blue-50/40 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={isCompared}
                        onChange={() => toggleCandidateComparison(cand.id)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                        title="Add to Comparison Matrix"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        {cand.avatar ? (
                          <img
                            src={cand.avatar}
                            alt={cand.name}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-700">
                            {cand.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/candidates/${cand.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400 transition-colors"
                          >
                            {cand.name}
                          </Link>
                          <p className="text-[11px] text-slate-400">{cand.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {cand.appliedRole}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {cand.department} • {cand.experienceYears}y exp
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {cand.assignedAssessmentTitle}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(cand.status)}</td>
                    <td className="py-3 px-4">
                      {cand.overallScore !== undefined ? (
                        <span className="font-bold text-slate-900 dark:text-white">
                          {cand.overallScore}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {cand.percentileRank !== undefined ? (
                        <span className="font-semibold text-emerald-600">
                          {cand.percentileRank}th
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/candidates/${cand.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                            Profile
                          </Button>
                        </Link>
                        {cand.overallScore !== undefined && (
                          <Link href={`/reports/${cand.id}`}>
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs text-blue-600">
                              Report <ChevronRight className="h-3 w-3 ml-0.5" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Candidate Modal */}
      {isAddOpen && (
        <Modal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          title="Add New Candidate Profile"
          description="Register candidate and assign initial psychometric assessment battery."
          size="md"
        >
          <form onSubmit={handleCreateCandidate} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Full Name *
              </label>
              <Input
                value={newCandidate.name}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, name: e.target.value })
                }
                required
                placeholder="e.g. Maya Lin"
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={newCandidate.email}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, email: e.target.value })
                  }
                  required
                  placeholder="maya.lin@example.com"
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Phone (Optional)
                </label>
                <Input
                  value={newCandidate.phone}
                  onChange={(e) =>
                    setNewCandidate({ ...newCandidate, phone: e.target.value })
                  }
                  placeholder="+1 (555) 000-0000"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Applied Role *
                </label>
                <Input
                  value={newCandidate.appliedRole}
                  onChange={(e) =>
                    setNewCandidate({
                      ...newCandidate,
                      appliedRole: e.target.value,
                    })
                  }
                  required
                  placeholder="e.g. Lead Platform Engineer"
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Department
                </label>
                <select
                  value={newCandidate.department}
                  onChange={(e) =>
                    setNewCandidate({
                      ...newCandidate,
                      department: e.target.value,
                    })
                  }
                  className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Corporate Finance">Corporate Finance</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Customer Operations">Customer Operations</option>
                  <option value="Sales & Strategy">Sales & Strategy</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Assign Psychometric Battery *
              </label>
              <select
                value={newCandidate.assignedAssessmentId}
                onChange={(e) =>
                  setNewCandidate({
                    ...newCandidate,
                    assignedAssessmentId: e.target.value,
                  })
                }
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
              >
                {assessments.map((asm) => (
                  <option key={asm.id} value={asm.id}>
                    {asm.title} ({asm.durationMinutes}m)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm">
                Register Candidate
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

