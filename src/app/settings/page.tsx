"use client";

import React, { useState } from "react";
import { useRoleStore } from "@/store/roleStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Building,
  User,
  Sliders,
  Bell,
  Key,
  Webhook,
  CheckCircle2,
  Copy,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Globe,
} from "lucide-react";

export default function SettingsPage() {
  const { currentUser } = useRoleStore();
  const [activeTab, setActiveTab] = useState<"general" | "branding" | "assessments" | "integrations">("general");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [generalForm, setGeneralForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    title: "Head of People Operations",
    timeZone: "America/New_York (UTC-5)",
  });

  const [brandingForm, setBrandingForm] = useState({
    companyName: currentUser.tenantName || "Nexus Enterprise Global",
    customDomain: "assessments.nexuscorp.com",
    brandColor: "#2563eb",
    candidatePortalTitle: "Nexus Talent Assessment Gateway",
  });

  const [assessmentPref, setAssessmentPref] = useState({
    defaultDurationMinutes: 45,
    enforceFullscreen: true,
    allowScratchPaper: true,
    normativeGroup: "Senior Global Professionals (N=14.2k)",
  });

  const [apiKey, setApiKey] = useState("mga_live_9f82b710c384a6e19da77218");
  const [webhookUrl, setWebhookUrl] = useState("https://api.nexuscorp.com/webhooks/psychometric-events");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleGenerateKey = () => {
    const newKey = `mga_live_${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
    setApiKey(newKey);
    showToast("New API Key generated successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Platform Settings & Enterprise Configuration
            </h1>
            <Badge variant="purple" className="text-xs">
              Enterprise Suite
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage organization branding, default test battery preferences, candidate portal customization, and API webhooks.
          </p>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800">
        {[
          { id: "general", label: "Profile & Account", icon: User },
          { id: "branding", label: "Company & Branding", icon: Building },
          { id: "assessments", label: "Assessment Defaults", icon: Sliders },
          { id: "integrations", label: "API & Webhooks", icon: Key },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                isSelected
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General Profile */}
      {activeTab === "general" && (
        <Card className="p-6 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Personal Profile Settings</CardTitle>
            <CardDescription>
              Your administrator profile and notification preferences.
            </CardDescription>
          </CardHeader>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Full Name
                </label>
                <Input
                  value={generalForm.name}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, name: e.target.value })
                  }
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Email Address
                </label>
                <Input
                  value={generalForm.email}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, email: e.target.value })
                  }
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Job Title
                </label>
                <Input
                  value={generalForm.title}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, title: e.target.value })
                  }
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Timezone
                </label>
                <Input
                  value={generalForm.timeZone}
                  onChange={(e) =>
                    setGeneralForm({ ...generalForm, timeZone: e.target.value })
                  }
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => showToast("Profile settings saved!")}>
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 2: Company Branding */}
      {activeTab === "branding" && (
        <Card className="p-6 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Enterprise Branding & Custom Domain</CardTitle>
            <CardDescription>
              Customize candidate-facing portals with your organization's logo, colors, and URL.
            </CardDescription>
          </CardHeader>

          <div className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Company Display Name
              </label>
              <Input
                value={brandingForm.companyName}
                onChange={(e) =>
                  setBrandingForm({ ...brandingForm, companyName: e.target.value })
                }
                className="h-9 text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Custom Testing Domain (CNAME)
                </label>
                <Input
                  value={brandingForm.customDomain}
                  onChange={(e) =>
                    setBrandingForm({ ...brandingForm, customDomain: e.target.value })
                  }
                  className="h-9 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Primary Brand Hex Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={brandingForm.brandColor}
                    onChange={(e) =>
                      setBrandingForm({ ...brandingForm, brandColor: e.target.value })
                    }
                    className="h-9 w-12 rounded border p-1 cursor-pointer"
                  />
                  <Input
                    value={brandingForm.brandColor}
                    onChange={(e) =>
                      setBrandingForm({ ...brandingForm, brandColor: e.target.value })
                    }
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Candidate Welcome Portal Header Text
              </label>
              <Input
                value={brandingForm.candidatePortalTitle}
                onChange={(e) =>
                  setBrandingForm({
                    ...brandingForm,
                    candidatePortalTitle: e.target.value,
                  })
                }
                className="h-9 text-xs"
              />
            </div>

            {/* Live Domain Preview Pill */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-xs dark:bg-slate-800/60 dark:border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Candidate Portal Preview URL
              </span>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-mono font-medium">
                <Globe className="h-4 w-4 text-blue-600" />
                <span>https://{brandingForm.customDomain}/invite/tok_candidate_access</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => showToast("Branding configuration updated!")}>
                Save Branding Settings
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 3: Assessment Defaults */}
      {activeTab === "assessments" && (
        <Card className="p-6 space-y-4">
          <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>Assessment Engine Defaults</CardTitle>
            <CardDescription>
              Global defaults applied when new assessment batteries are created.
            </CardDescription>
          </CardHeader>

          <div className="space-y-4 pt-2 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Standard Normative Reference Population
              </label>
              <Input
                value={assessmentPref.normativeGroup}
                onChange={(e) =>
                  setAssessmentPref({
                    ...assessmentPref,
                    normativeGroup: e.target.value,
                  })
                }
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assessmentPref.enforceFullscreen}
                  onChange={(e) =>
                    setAssessmentPref({
                      ...assessmentPref,
                      enforceFullscreen: e.target.checked,
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Default to enforced distraction-free viewport
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={assessmentPref.allowScratchPaper}
                  onChange={(e) =>
                    setAssessmentPref({
                      ...assessmentPref,
                      allowScratchPaper: e.target.checked,
                    })
                  }
                  className="rounded text-blue-600"
                />
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Allow scratch paper & calculators for quantitative reasoning
                </span>
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={() => showToast("Assessment preferences saved!")}>
                Save Defaults
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 4: API & Webhooks */}
      {activeTab === "integrations" && (
        <Card className="p-6 space-y-5">
          <CardHeader className="p-0 pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle>API Key & Webhook Event Streaming</CardTitle>
            <CardDescription>
              Connect MindGauge to enterprise ATS systems (Greenhouse, Lever, Workday) via REST API and Webhooks.
            </CardDescription>
          </CardHeader>

          {/* API Key */}
          <div className="space-y-2 text-xs">
            <label className="font-bold text-slate-800 dark:text-slate-200 block">
              Active Organization API Key
            </label>
            <div className="flex items-center gap-2">
              <code className="h-9 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs text-slate-800 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200">
                {apiKey}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={handleGenerateKey}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Roll Key</span>
              </Button>
            </div>
            <p className="text-[11px] text-slate-400">
              Never share secret API keys in client-side code. This interface demonstrates future REST API key provisioning.
            </p>
          </div>

          {/* Webhook Endpoint */}
          <div className="space-y-2 text-xs">
            <label className="font-bold text-slate-800 dark:text-slate-200 block">
              Webhook Delivery Endpoint (HTTPS)
            </label>
            <Input
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="h-9 text-xs font-mono"
            />
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                assessment.completed
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                invitation.opened
              </span>
              <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                integrity.flagged
              </span>
            </div>
          </div>

          {/* ATS Connectors simulation */}
          <div className="border-t border-slate-100 pt-4 dark:border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Connected ATS Sync Connectors
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { name: "Greenhouse Recruiting", status: "Active Sync", date: "2m ago" },
                { name: "Lever Talent Suite", status: "Configured", date: "Yesterday" },
                { name: "Workday Human Capital", status: "Ready", date: "Manual" },
              ].map((ats) => (
                <div key={ats.name} className="rounded-xl border border-slate-200 p-3 text-xs dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                    {ats.name}
                  </span>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-emerald-600 font-semibold">{ats.status}</span>
                    <span className="text-slate-400">{ats.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => showToast("Webhook endpoints updated!")}>
              Save Integration Settings
            </Button>
          </div>
        </Card>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

