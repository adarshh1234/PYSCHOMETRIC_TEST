"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAssessmentStore } from "@/store/assessmentStore";
import { Invitation } from "@/types";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/dialog";
import { formatDate, formatDateTime } from "@/lib/utils";
import {
  MailCheck,
  Send,
  Plus,
  Search,
  Filter,
  RotateCcw,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  AlertCircle,
} from "lucide-react";

export default function InvitationsPage() {
  const {
    invitations,
    candidates,
    assessments,
    createInvitation,
    resendInvitation,
    cancelInvitation,
  } = useAssessmentStore();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [previewInvite, setPreviewInvite] = useState<Invitation | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Invitation form state
  const [inviteForm, setInviteForm] = useState({
    candidateId: candidates[0]?.id || "",
    assessmentId: assessments[0]?.id || "",
    expiresInDays: 7,
    customNote: "Please complete this assessment in a quiet, distraction-free environment.",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filtered = invitations.filter((inv) => {
    const matchesSearch =
      inv.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      inv.candidateEmail.toLowerCase().includes(search.toLowerCase()) ||
      inv.assessmentTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      selectedStatus === "ALL" || inv.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSendInvitation = (e: React.FormEvent) => {
    e.preventDefault();
    const cand = candidates.find((c) => c.id === inviteForm.candidateId) || candidates[0]!;
    const asm = assessments.find((a) => a.id === inviteForm.assessmentId) || assessments[0]!;

    createInvitation({
      candidateId: cand.id,
      candidateName: cand.name,
      candidateEmail: cand.email,
      assessmentId: asm.id,
      assessmentTitle: asm.title,
      expiresInDays: Number(inviteForm.expiresInDays),
    });

    setIsInviteModalOpen(false);
    showToast(`Invitation sent to ${cand.name} (${cand.email})!`);
  };

  const handleResend = (id: string, name: string) => {
    resendInvitation(id);
    showToast(`Reminder invitation re-sent to ${name}!`);
  };

  const handleCancel = (id: string) => {
    cancelInvitation(id);
    showToast(`Invitation revoked.`);
  };

  const getStatusBadge = (status: Invitation["status"]) => {
    switch (status) {
      case "COMPLETED":
        return <Badge variant="success">Completed</Badge>;
      case "STARTED":
        return <Badge variant="warning">In Progress</Badge>;
      case "OPENED":
        return <Badge variant="purple">Opened</Badge>;
      case "SENT":
        return <Badge variant="default">Sent</Badge>;
      case "PENDING":
        return <Badge variant="secondary">Pending</Badge>;
      case "EXPIRED":
        return <Badge variant="destructive">Expired</Badge>;
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
              Candidate Invitation Control
            </h1>
            <Badge variant="purple" className="text-xs">
              {invitations.length} Total Invitations
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Dispatch secure, tokenized psychometric assessment links to candidates and monitor delivery telemetry.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsInviteModalOpen(true)}
          className="gap-1.5 shadow-sm"
        >
          <Send className="h-3.5 w-3.5" />
          <span>Send Invitation</span>
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by candidate name, email, or battery title..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="ALL">All Delivery Statuses</option>
            <option value="SENT">Sent</option>
            <option value="OPENED">Opened</option>
            <option value="STARTED">Started</option>
            <option value="COMPLETED">Completed</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40">
                <th className="py-3 px-4 font-semibold">Candidate</th>
                <th className="py-3 px-4 font-semibold">Assessment Battery</th>
                <th className="py-3 px-4 font-semibold">Sent Timestamp</th>
                <th className="py-3 px-4 font-semibold">Expiration</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      {inv.candidateName}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {inv.candidateEmail}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300 max-w-xs truncate">
                    {inv.assessmentTitle}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {formatDate(inv.sentAt)}
                    {inv.remindersSent > 0 && (
                      <span className="block text-[10px] text-blue-600 font-semibold">
                        {inv.remindersSent} reminder{inv.remindersSent > 1 ? "s" : ""}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {formatDate(inv.expiresAt)}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(inv.status)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewInvite(inv)}
                        title="Preview Candidate Invitation Email"
                        className="h-8 px-2 text-xs text-blue-600"
                      >
                        <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                      </Button>
                      {inv.status !== "COMPLETED" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResend(inv.id, inv.candidateName)}
                          title="Resend invitation link"
                          className="h-8 w-8 p-0 text-slate-600"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancel(inv.id)}
                        title="Revoke invitation"
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

      {/* Create Invitation Modal */}
      {isInviteModalOpen && (
        <Modal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          title="Dispatch Candidate Assessment Invitation"
          description="Send an invitation containing a secure single-use candidate access token."
          size="md"
        >
          <form onSubmit={handleSendInvitation} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Select Candidate *
              </label>
              <select
                value={inviteForm.candidateId}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, candidateId: e.target.value })
                }
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
              >
                {candidates.map((cand) => (
                  <option key={cand.id} value={cand.id}>
                    {cand.name} — {cand.email} ({cand.appliedRole})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Select Assessment Battery *
              </label>
              <select
                value={inviteForm.assessmentId}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, assessmentId: e.target.value })
                }
                className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium dark:border-slate-800 dark:bg-slate-900"
              >
                {assessments.map((asm) => (
                  <option key={asm.id} value={asm.id}>
                    {asm.title} ({asm.durationMinutes} mins)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Invitation Expiry Window (Days)
              </label>
              <Input
                type="number"
                min={1}
                max={30}
                value={inviteForm.expiresInDays}
                onChange={(e) =>
                  setInviteForm({
                    ...inviteForm,
                    expiresInDays: Number(e.target.value),
                  })
                }
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Personalized Recruiter Note for Candidate
              </label>
              <textarea
                value={inviteForm.customNote}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, customNote: e.target.value })
                }
                rows={3}
                className="w-full rounded-lg border border-slate-200 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsInviteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
                <Send className="h-3.5 w-3.5" /> Send Invitation
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Preview Email Invitation Modal */}
      {previewInvite && (
        <Modal
          isOpen={!!previewInvite}
          onClose={() => setPreviewInvite(null)}
          title="Simulated Candidate Invitation Email"
          description={`To: ${previewInvite.candidateEmail}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5 text-xs space-y-3 dark:border-slate-800 dark:bg-slate-800/40">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 dark:border-slate-700">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Subject: Psychometric Assessment Invitation: {previewInvite.assessmentTitle}
                </span>
                <Badge variant="purple" className="text-[10px]">
                  Email Template
                </Badge>
              </div>

              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Dear <strong>{previewInvite.candidateName}</strong>,
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                As part of your application process with Nexus Enterprise Global, you have been invited to complete the <strong>{previewInvite.assessmentTitle}</strong>.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                This evaluation measures cognitive problem-solving, workplace behavioral styles, and situational judgement. Please ensure you are in a quiet, distraction-free environment.
              </p>

              <div className="rounded-lg bg-blue-100/60 p-3 text-center my-3 dark:bg-blue-900/30">
                <span className="text-[11px] font-semibold text-blue-900 dark:text-blue-200 block mb-1">
                  Your Secure Access Token:
                </span>
                <code className="rounded bg-white px-3 py-1 font-mono font-bold text-blue-700 text-xs shadow-sm dark:bg-slate-900 dark:text-blue-300">
                  {previewInvite.token}
                </code>
              </div>

              <p className="text-[11px] text-slate-500">
                Link expires on: <strong>{formatDateTime(previewInvite.expiresAt)}</strong>.
              </p>
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link href="/candidate/take-assessment">
                <Button size="sm" className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-xs">
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Launch Live Candidate Test Flow</span>
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={() => setPreviewInvite(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

