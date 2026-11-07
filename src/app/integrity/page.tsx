"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MOCK_INTEGRITY_SUMMARIES } from "@/lib/mock/data/integrity.mock";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/dialog";
import { formatDateTime } from "@/lib/utils";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Laptop,
  Copy,
  Maximize2,
  Zap,
  Info,
} from "lucide-react";
import { CandidateIntegritySummary } from "@/lib/mock/data/integrity.mock";

export default function IntegrityMonitoringPage() {
  const [search, setSearch] = useState("");
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [selectedSession, setSelectedSession] = useState<CandidateIntegritySummary | null>(null);

  const filtered = MOCK_INTEGRITY_SUMMARIES.filter((item) => {
    const matchesSearch =
      item.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      item.candidateEmail.toLowerCase().includes(search.toLowerCase()) ||
      item.assessmentTitle.toLowerCase().includes(search.toLowerCase());
    const matchesRisk =
      selectedRisk === "ALL" || item.riskLevel === selectedRisk;
    return matchesSearch && matchesRisk;
  });

  const getSeverityBadge = (sev: "LOW" | "MEDIUM" | "HIGH") => {
    switch (sev) {
      case "HIGH":
        return <Badge variant="destructive">High Severity</Badge>;
      case "MEDIUM":
        return <Badge variant="warning">Medium</Badge>;
      case "LOW":
      default:
        return <Badge variant="secondary">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer Notice */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-amber-500 p-2 text-white shrink-0 mt-0.5">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div className="text-xs">
            <h2 className="font-bold text-amber-900 dark:text-amber-200">
              Integrity Telemetry Diagnostic Dashboard (Demonstration Simulation)
            </h2>
            <p className="mt-1 text-amber-800/80 dark:text-amber-300/80 leading-relaxed">
              <strong>Psychometric Compliance Protocol:</strong> Telemetry indicators (e.g. window blur, tab switches, latency deviations) are non-invasive diagnostic signals. They do NOT constitute definitive proof of malpractice. All integrity data shown is simulated for platform evaluation purposes.
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Assessment Integrity Telemetry
            </h1>
            <Badge variant="purple" className="text-xs">
              Live Event Stream
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Real-time focus monitoring, session continuity telemetry, and environmental anomaly verification.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Mean Platform Integrity
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600">
              96.8%
            </span>
            <span className="text-xs font-semibold text-emerald-600">
              Optimal
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Across 286 candidate sessions
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Active Monitored Sessions
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-600">
              1 Active
            </span>
            <span className="text-xs font-semibold text-slate-500">Live stream</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Tariq Mansoor (Full-Stack Battery)
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Flagged Review Sessions
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-600">
              1 Session
            </span>
            <span className="text-xs text-slate-500">Medium Risk</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Tab switch & latency anomaly
          </span>
        </Card>

        <Card className="p-4">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            Proctoring Mode
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              Non-Invasive
            </span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">
            Zero AI biometric inference
          </span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search telemetry sessions by candidate or battery title..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <select
          value={selectedRisk}
          onChange={(e) => setSelectedRisk(e.target.value)}
          className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
        >
          <option value="ALL">All Risk Levels</option>
          <option value="LOW">Low Risk (&ge; 90)</option>
          <option value="MEDIUM">Medium Risk (60-89)</option>
          <option value="HIGH">High Risk (&lt; 60)</option>
        </select>
      </div>

      {/* Sessions Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">Assessment Battery</th>
                <th className="py-3 px-4 font-semibold">Integrity Score</th>
                <th className="py-3 px-4 font-semibold">Risk Classification</th>
                <th className="py-3 px-4 font-semibold">Session Duration</th>
                <th className="py-3 px-4 font-semibold">Events Recorded</th>
                <th className="py-3 px-4 font-semibold text-right">Telemetry Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((item) => (
                <tr key={item.candidateId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    <Link href={`/candidates/${item.candidateId}`} className="hover:text-blue-600">
                      {item.candidateName}
                    </Link>
                    <p className="text-[11px] font-normal text-slate-400">{item.candidateEmail}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {item.assessmentTitle}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-sm font-bold ${
                        item.integrityScore >= 90
                          ? "text-emerald-600"
                          : item.integrityScore >= 70
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {item.integrityScore} / 100
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        item.riskLevel === "LOW"
                          ? "success"
                          : item.riskLevel === "MEDIUM"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {item.riskLevel} Risk
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{item.sessionDuration}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {item.eventsCount} events
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedSession(item)}
                      className="h-8 gap-1.5 text-xs text-blue-600"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Inspect Telemetry</span>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Telemetry Detail Inspection Modal */}
      {selectedSession && (
        <Modal
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
          title={`Session Telemetry: ${selectedSession.candidateName}`}
          description={`Battery: ${selectedSession.assessmentTitle} • Score: ${selectedSession.integrityScore}/100`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 rounded-xl bg-slate-50 p-3 text-center text-xs dark:bg-slate-800/60">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Candidate
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedSession.candidateName}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Risk Level
                </span>
                <Badge
                  variant={selectedSession.riskLevel === "LOW" ? "success" : "warning"}
                  className="mt-0.5"
                >
                  {selectedSession.riskLevel} Risk
                </Badge>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  Duration
                </span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {selectedSession.sessionDuration}
                </span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Simulated Event Timeline:
              </span>
              {selectedSession.events.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {selectedSession.events.map((evt) => (
                    <div
                      key={evt.id}
                      className="rounded-lg border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            [{evt.eventType}]
                          </span>
                          {getSeverityBadge(evt.severity)}
                          {evt.questionIndex && (
                            <span className="text-slate-400">
                              (Question #{evt.questionIndex})
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">
                          {evt.details}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {formatDateTime(evt.timestamp)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-emerald-600 bg-emerald-50 rounded-xl dark:bg-emerald-950/20">
                  <CheckCircle2 className="h-6 w-6 mx-auto mb-1 text-emerald-500" />
                  Clean Session: Zero focus interruptions or clipboard events observed.
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button size="sm" onClick={() => setSelectedSession(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

