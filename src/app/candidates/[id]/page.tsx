"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Award,
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  Send,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  MessageSquare,
  Clock,
  Sparkles,
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

export default function CandidateDetailPage() {
  const params = useParams();
  const candidateId = params.id as string;
  const { candidates, results, addCandidateNote } = useAssessmentStore();
  const [newNoteText, setNewNoteText] = useState("");

  const candidate = candidates.find((c) => c.id === candidateId) || candidates[0];
  const result = results[candidateId] || results["cand-001"];

  if (!candidate) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Candidate not found.</p>
        <Link href="/candidates">
          <Button variant="outline" size="sm" className="mt-4">
            Back to Candidates
          </Button>
        </Link>
      </div>
    );
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addCandidateNote(candidate.id, newNoteText.trim());
    setNewNoteText("");
  };

  // Format radar data for Big Five
  const radarData = result?.personalityBigFive.map((p) => ({
    trait: p.trait,
    score: p.score,
    fullMark: 100,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        href="/candidates"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Candidate Directory
      </Link>

      {/* Hero Header Card */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {candidate.avatar ? (
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-md"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-xl font-bold text-white shadow-md">
                {candidate.name.charAt(0)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {candidate.name}
                </h1>
                <Badge
                  variant={
                    candidate.status === "EVALUATED" || candidate.status === "COMPLETED"
                      ? "success"
                      : "secondary"
                  }
                >
                  {candidate.status}
                </Badge>
              </div>

              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                {candidate.appliedRole} • {candidate.department}
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" /> {candidate.email}
                </span>
                {candidate.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {candidate.phone}
                  </span>
                )}
                {candidate.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {candidate.location}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" /> {candidate.experienceYears} Years Experience
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href={`/reports/${candidate.id}`}>
              <Button size="sm" className="gap-1.5 shadow-sm">
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>View Full Psychometric Report</span>
              </Button>
            </Link>
            <Link href="/invitations">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Send className="h-3.5 w-3.5" />
                <span>Re-Invite Battery</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* High-Level Psychometric Score Badges */}
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">
              Overall Benchmark Score
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {result.overallScore}%
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                {result.overallPercentile}th Percentile
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Standardized vs. {result.normGroup}
            </p>
          </Card>

          <Card className="p-4">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">
              Integrity Telemetry Index
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-emerald-600">
                {result.integrityScore} / 100
              </span>
              <Badge variant="success" className="text-[9px]">
                Low Risk
              </Badge>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              {result.integrityEvents.length} Minor window event logged
            </p>
          </Card>

          <Card className="p-4">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">
              Cognitive Deduction Lead
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-blue-600">
                {result.cognitiveBreakdown[0]?.score || 88}%
              </span>
              <span className="text-xs text-slate-500">
                Avg speed: {result.cognitiveBreakdown[0]?.averageSpeedSeconds || 42}s
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Top 10% in deductive reasoning
            </p>
          </Card>

          <Card className="p-4">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block">
              Testing Duration
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {result.durationMinutes}m
              </span>
              <span className="text-xs text-slate-400">
                Paced conscientiously
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              Completed on {formatDate(result.completionDate)}
            </p>
          </Card>
        </div>
      )}

      {/* Main Charts & Breakdown */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Big Five Personality Radar */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Big Five Personality Dimensions</CardTitle>
                  <CardDescription>
                    Normed STEN score and percentile representation
                  </CardDescription>
                </div>
                <Badge variant="purple" className="text-[10px]">
                  Norm Group N=14.2k
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="trait" tick={{ fontSize: 11, fill: "#475569" }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.4}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        color: "#fff",
                        borderRadius: "8px",
                        fontSize: "12px",
                        border: "none",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 mt-2">
                {result.personalityBigFive.map((p) => (
                  <div key={p.trait} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {p.trait}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">{p.score}%</span>
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        STEN {p.stenScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Cognitive Breakdown Bar Chart */}
          <Card>
            <CardHeader className="pb-2">
              <div>
                <CardTitle>Cognitive Ability Breakdown</CardTitle>
                <CardDescription>
                  Percentile ranks across numerical, logical, and abstract aptitudes
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={result.cognitiveBreakdown}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#64748b" }} />
                    <YAxis dataKey="category" type="category" tick={{ fontSize: 11, fill: "#475569" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        color: "#fff",
                        borderRadius: "8px",
                        fontSize: "12px",
                        border: "none",
                      }}
                    />
                    <Bar dataKey="percentile" name="Percentile" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/60 space-y-1">
                <span className="font-bold text-slate-800 dark:text-slate-200 block">
                  Psychometric Assessment Summary:
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {result.roleFitSummary}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recruiter Notes Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Recruiter & Interview Panel Observations
            </h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            {candidate.recruiterNotes?.length || 0} Notes Logged
          </Badge>
        </div>

        <div className="space-y-2">
          {candidate.recruiterNotes?.map((note, index) => (
            <div
              key={index}
              className="rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
            >
              {note}
            </div>
          ))}
        </div>

        {/* Add Note Form */}
        <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
          <Input
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Add a new candidate note or interview debrief observation..."
            className="text-xs h-9"
          />
          <Button type="submit" size="sm" className="gap-1 shrink-0">
            <Plus className="h-3.5 w-3.5" /> Add Note
          </Button>
        </form>
      </Card>
    </div>
  );
}

