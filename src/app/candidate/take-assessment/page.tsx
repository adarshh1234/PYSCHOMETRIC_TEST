"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { useAssessmentStore } from "@/store/assessmentStore";
import { QuestionRenderer } from "@/features/testing/QuestionRenderer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/dialog";
import { formatDuration } from "@/lib/utils";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Flag,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Wifi,
  Laptop,
  Camera,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Award,
} from "lucide-react";

export default function CandidateTestingExperiencePage() {
  const router = useRouter();
  const {
    currentSession,
    initSession,
    setAnswer,
    toggleMarkForReview,
    setSectionIndex,
    setQuestionIndex,
    decrementTimer,
    submitSession,
    setSessionConsent,
    setDeviceCheckPassed,
    setPracticeCompleted,
    assessments,
    questions,
  } = useAssessmentStore();

  // Onboarding Step State: 'WELCOME' | 'INSTRUCTIONS' | 'CONSENT' | 'DEVICE_CHECK' | 'PRACTICE' | 'TESTING' | 'SUBMITTED'
  const [onboardingStep, setOnboardingStep] = useState<
    "WELCOME" | "INSTRUCTIONS" | "CONSENT" | "DEVICE_CHECK" | "PRACTICE" | "TESTING" | "SUBMITTED"
  >("WELCOME");

  // Device check simulation states
  const [browserChecked, setBrowserChecked] = useState(false);
  const [networkChecked, setNetworkChecked] = useState(false);
  const [cameraChecked, setCameraChecked] = useState(false);

  // Practice question state
  const [practiceAnswer, setPracticeAnswer] = useState<string | null>(null);

  // Submit confirmation modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Telemetry warning state simulation (if user blurs window during test)
  const [telemetryWarning, setTelemetryWarning] = useState<string | null>(null);

  // Initialize session if not present
  useEffect(() => {
    if (!currentSession) {
      initSession(assessments[0]?.id || "asm-eng-001", "cand-001");
    }
  }, [currentSession, initSession, assessments]);

  // Countdown timer hook during testing
  useEffect(() => {
    if (onboardingStep !== "TESTING" || !currentSession || currentSession.isSubmitted) return;

    const timer = setInterval(() => {
      decrementTimer();
      if (currentSession.timeRemainingSeconds <= 1) {
        clearInterval(timer);
        handleSubmitTest();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [onboardingStep, currentSession?.timeRemainingSeconds, currentSession?.isSubmitted]);

  // Simulated telemetry: listen for blur events during active test
  useEffect(() => {
    if (onboardingStep !== "TESTING") return;

    const handleBlur = () => {
      setTelemetryWarning("Focus alert: Leaving the active testing window has been logged in your session integrity telemetry.");
      setTimeout(() => setTelemetryWarning(null), 5000);
    };

    window.addEventListener("blur", handleBlur);
    return () => window.removeEventListener("blur", handleBlur);
  }, [onboardingStep]);

  if (!currentSession) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-xs text-slate-400">Initializing secure candidate testing session...</p>
        </div>
      </div>
    );
  }

  const assessment = currentSession.assessment;
  const currentSection = assessment.sections[currentSession.currentSectionIndex] || assessment.sections[0]!;

  // Questions in current section
  const sectionQuestions = questions.filter((q) =>
    currentSection.questionIds.includes(q.id)
  );

  const activeQuestion = sectionQuestions[currentSession.currentQuestionIndex] || sectionQuestions[0]!;

  // Count answered in section
  const totalQuestionsInSection = sectionQuestions.length;
  const answeredCount = sectionQuestions.filter((q) => currentSession.answers[q.id] !== undefined).length;
  const isCurrentFlagged = !!currentSession.markedForReview[activeQuestion?.id || ""];

  // Handle Practice Question
  const handleCompletePractice = () => {
    setPracticeCompleted(true);
    setOnboardingStep("TESTING");
  };

  // Submit assessment with confetti celebration
  const handleSubmitTest = () => {
    setIsSubmitModalOpen(false);
    submitSession();
    setOnboardingStep("SUBMITTED");
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  /* ------------------------------------------------------------- */
  /* ONBOARDING SCREEN 1: WELCOME & VERIFICATION                   */
  /* ------------------------------------------------------------- */
  if (onboardingStep === "WELCOME") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 text-slate-100">
        <Card className="w-full max-w-lg border-slate-800 bg-slate-900 text-slate-100 shadow-2xl p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 ring-4 ring-blue-500/10">
              <ShieldCheck className="h-8 w-8" />
            </div>

            <div>
              <Badge variant="purple" className="mb-2">
                Candidate Assessment Onboarding
              </Badge>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Welcome, {currentSession.candidateName}
              </h1>
              <p className="mt-1 text-xs text-slate-400">
                You have been invited to attempt the{" "}
                <strong className="text-slate-200">{assessment.title}</strong>.
              </p>
            </div>

            <div className="w-full rounded-xl bg-slate-800/60 p-4 text-left text-xs space-y-2 border border-slate-700/60">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Duration:</span>
                <span className="font-semibold text-white">{assessment.durationMinutes} Minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sections Included:</span>
                <span className="font-semibold text-white">{assessment.sections.length} Timed Sections</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Security Telemetry:</span>
                <span className="font-semibold text-emerald-400">Active Integrity Verification</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Access Token:</span>
                <code className="text-blue-400 font-mono font-bold">{currentSession.token}</code>
              </div>
            </div>

            <Button
              onClick={() => setOnboardingStep("INSTRUCTIONS")}
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <span>Continue to Instructions</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------- */
  /* ONBOARDING SCREEN 2: INSTRUCTIONS & PROTOCOL                  */
  /* ------------------------------------------------------------- */
  if (onboardingStep === "INSTRUCTIONS") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 text-slate-100">
        <Card className="w-full max-w-lg border-slate-800 bg-slate-900 text-slate-100 shadow-2xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">Assessment Guidelines & Code of Conduct</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Please review the testing rules carefully before beginning.
            </p>
          </div>

          <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-800">
              <Clock className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-white block font-semibold">Timed Sections</strong>
                Each section operates on an independent countdown timer. The test will automatically transition to the next section when time expires.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-800">
              <Maximize2 className="h-4 w-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-white block font-semibold">Distraction-Free Focus</strong>
                Avoid switching browser tabs, exiting the testing viewport, or using third-party browser extensions. Telemetry records significant focus changes.
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-800/60 border border-slate-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <strong className="text-white block font-semibold">Automatic Autosave</strong>
                Every answer you select is immediately persisted. You can flag questions for later review and return to them anytime before submitting.
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOnboardingStep("WELCOME")}
              className="text-slate-400 hover:text-white"
            >
              Back
            </Button>
            <Button
              size="sm"
              onClick={() => setOnboardingStep("CONSENT")}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700"
            >
              <span>Accept & Provide Consent</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------- */
  /* ONBOARDING SCREEN 3: CANDIDATE CONSENT                        */
  /* ------------------------------------------------------------- */
  if (onboardingStep === "CONSENT") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 text-slate-100">
        <Card className="w-full max-w-lg border-slate-800 bg-slate-900 text-slate-100 shadow-2xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">Data Privacy & Evaluation Consent</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Psychometric assessment transparency statement.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/50 p-4 text-xs text-slate-300 space-y-2 border border-slate-700/60 leading-relaxed max-h-52 overflow-y-auto">
            <p>
              I consent to participating in this psychometric talent evaluation. I understand that the results will be used exclusively for recruitment, competency benchmarking, and developmental profiling by the hiring organization.
            </p>
            <p>
              I confirm that I will complete this assessment independently, without unauthorized human assistance or prohibited automated generative aids.
            </p>
            <p>
              Session telemetry (such as response duration, focus loss, and window blur) will be collected for integrity validation.
            </p>
          </div>

          <label className="flex items-center gap-2.5 text-xs text-slate-200 cursor-pointer p-2 rounded-lg bg-slate-800/60">
            <input
              type="checkbox"
              checked={currentSession.consentGiven}
              onChange={(e) => setSessionConsent(e.target.checked)}
              className="h-4 w-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="font-semibold">
              I agree to the evaluation terms and confirm my personal declaration.
            </span>
          </label>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOnboardingStep("INSTRUCTIONS")}
              className="text-slate-400 hover:text-white"
            >
              Back
            </Button>
            <Button
              size="sm"
              disabled={!currentSession.consentGiven}
              onClick={() => setOnboardingStep("DEVICE_CHECK")}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <span>Proceed to Device Check</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------- */
  /* ONBOARDING SCREEN 4: DEVICE & BROWSER CHECK                   */
  /* ------------------------------------------------------------- */
  if (onboardingStep === "DEVICE_CHECK") {
    const allChecked = browserChecked && networkChecked;

    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 text-slate-100">
        <Card className="w-full max-w-lg border-slate-800 bg-slate-900 text-slate-100 shadow-2xl p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-white">System & Readiness Diagnostic</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verifying client display, network latency, and browser capabilities.
            </p>
          </div>

          <div className="space-y-3">
            {/* Check 1 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <Laptop className="h-4 w-4 text-blue-400" />
                <div>
                  <span className="font-bold text-white block">Modern Browser & Resolution</span>
                  <span className="text-[11px] text-slate-400">1920x1080 Viewport • Hardware Accelerated</span>
                </div>
              </div>
              <Button
                variant={browserChecked ? "ghost" : "outline"}
                size="sm"
                onClick={() => setBrowserChecked(true)}
                className={`h-7 text-xs ${browserChecked ? "text-emerald-400 font-bold" : ""}`}
              >
                {browserChecked ? "Verified ✓" : "Test Browser"}
              </Button>
            </div>

            {/* Check 2 */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <Wifi className="h-4 w-4 text-emerald-400" />
                <div>
                  <span className="font-bold text-white block">Network Latency</span>
                  <span className="text-[11px] text-slate-400">24ms Roundtrip • WebSocket Telemetry Ready</span>
                </div>
              </div>
              <Button
                variant={networkChecked ? "ghost" : "outline"}
                size="sm"
                onClick={() => setNetworkChecked(true)}
                className={`h-7 text-xs ${networkChecked ? "text-emerald-400 font-bold" : ""}`}
              >
                {networkChecked ? "Verified ✓" : "Ping Diagnostic"}
              </Button>
            </div>

            {/* Check 3 (Optional) */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <Camera className="h-4 w-4 text-purple-400" />
                <div>
                  <span className="font-bold text-white block">Webcam (Optional Simulation)</span>
                  <span className="text-[11px] text-slate-400">Not required for this cognitive session</span>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Optional</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOnboardingStep("CONSENT")}
              className="text-slate-400 hover:text-white"
            >
              Back
            </Button>
            <Button
              size="sm"
              disabled={!allChecked}
              onClick={() => {
                setDeviceCheckPassed(true);
                setOnboardingStep("PRACTICE");
              }}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <span>Try Practice Item</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------- */
  /* ONBOARDING SCREEN 5: PRACTICE QUESTION                        */
  /* ------------------------------------------------------------- */
  if (onboardingStep === "PRACTICE") {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 text-slate-100">
        <Card className="w-full max-w-lg border-slate-800 bg-slate-900 text-slate-100 shadow-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <Badge variant="warning" className="text-[10px] mb-1">
                Warm-Up Item (Ungraded)
              </Badge>
              <h2 className="text-base font-bold text-white">Practice Item Simulation</h2>
            </div>
            <span className="text-xs text-slate-400 font-medium">Practice Question</span>
          </div>

          <div className="rounded-xl bg-slate-800/70 p-4 text-xs text-slate-200 leading-relaxed border border-slate-700/60">
            <strong>Sample Deductive Logic:</strong> If all high-reliability databases use distributed consensus logs, and Raft is a distributed consensus log protocol, which conclusion is unconditionally correct?
          </div>

          <div className="space-y-2">
            {[
              { id: "p1", text: "Raft is used by high-reliability distributed databases." },
              { id: "p2", text: "No system can fail if it runs Raft." },
              { id: "p3", text: "Distributed consensus logs cannot run in cloud environments." },
            ].map((opt) => (
              <label
                key={opt.id}
                onClick={() => setPracticeAnswer(opt.id)}
                className={`flex items-center justify-between p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                  practiceAnswer === opt.id
                    ? "border-blue-500 bg-blue-900/30 text-white"
                    : "border-slate-800 bg-slate-800/40 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span>{opt.text}</span>
                {practiceAnswer === opt.id && <CheckCircle2 className="h-4 w-4 text-blue-400" />}
              </label>
            ))}
          </div>

          {practiceAnswer && (
            <div className="rounded-lg bg-emerald-950/40 border border-emerald-800 p-3 text-xs text-emerald-300">
              <strong className="block font-semibold mb-0.5">Correct Warm-Up:</strong>
              You've familiarized yourself with the testing interface navigation. When you begin the actual assessment, the countdown timer will start.
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOnboardingStep("DEVICE_CHECK")}
              className="text-slate-400 hover:text-white"
            >
              Back
            </Button>
            <Button
              size="sm"
              onClick={handleCompletePractice}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              <span>Start Real Assessment</span>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------- */
  /* ONBOARDING SCREEN 6: SUBMITTED CONFIRMATION CELEBRATION      */
  /* ------------------------------------------------------------- */
  if (onboardingStep === "SUBMITTED" || currentSession.isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-slate-950 text-slate-100">
        <Card className="w-full max-w-md border-slate-800 bg-slate-900 text-slate-100 shadow-2xl p-8 text-center space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 ring-4 ring-emerald-500/10">
            <CheckCircle2 className="h-10 w-10" />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Assessment Successfully Submitted!
            </h1>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Thank you, <strong>{currentSession.candidateName}</strong>. Your psychometric responses and telemetry signals have been securely encrypted and submitted.
            </p>
          </div>

          <div className="rounded-xl bg-slate-800/60 p-4 text-xs text-slate-300 space-y-2 border border-slate-700/60 text-left">
            <div className="flex justify-between">
              <span className="text-slate-400">Battery Completed:</span>
              <span className="font-semibold text-white">{assessment.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Answered:</span>
              <span className="font-semibold text-emerald-400">100% Items Complete</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Integrity Confidence:</span>
              <span className="font-semibold text-emerald-400">High (Standard Focus)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link href="/candidate/results">
              <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                <Award className="h-4 w-4" />
                <span>View Candidate Feedback Report</span>
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full text-xs text-slate-400 hover:text-white">
                Return to Enterprise Workspace
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------- */
  /* TESTING INTERFACE: IMMERSIVE DISTRACTION-FREE LAYOUT          */
  /* ------------------------------------------------------------- */
  const currentAnswer = currentSession.answers[activeQuestion?.id || ""];

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Top Testing Header */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/95 px-4 backdrop-blur-md sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-md">
            Ψ
          </div>
          <div>
            <h1 className="text-xs font-bold text-white sm:text-sm truncate max-w-xs sm:max-w-md">
              {assessment.title}
            </h1>
            <p className="text-[11px] text-slate-400">
              Section {currentSession.currentSectionIndex + 1}: {currentSection.title}
            </p>
          </div>
        </div>

        {/* Center/Right: Timer & Actions */}
        <div className="flex items-center gap-4">
          {/* Countdown Timer with Warning Color */}
          <div
            className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-mono font-bold transition-colors ${
              currentSession.timeRemainingSeconds < 120
                ? "border-red-500 bg-red-950/40 text-red-400 animate-pulse"
                : "border-slate-700 bg-slate-800 text-slate-200"
            }`}
          >
            <Clock className="h-4 w-4 text-blue-400" />
            <span>{formatDuration(currentSession.timeRemainingSeconds)}</span>
          </div>

          <Button
            size="sm"
            onClick={() => setIsSubmitModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs h-9 px-4 shadow-sm"
          >
            Submit Assessment
          </Button>
        </div>
      </header>

      {/* Telemetry Warning Toast */}
      {telemetryWarning && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 rounded-lg border border-amber-600 bg-amber-950/90 px-4 py-2.5 text-xs text-amber-200 shadow-2xl animate-in fade-in slide-in-from-top-2">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{telemetryWarning}</span>
        </div>
      )}

      {/* Main Testing Body */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* Left/Center: Active Question Card (flex-1) */}
        <div className="flex-1 flex flex-col justify-between">
          <Card className="border-slate-800 bg-slate-900 text-slate-100 p-6 sm:p-8 shadow-xl flex-1 flex flex-col justify-between">
            <div>
              {/* Question Meta Bar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="text-xs">
                    Question {currentSession.currentQuestionIndex + 1} of {totalQuestionsInSection}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-slate-400 border-slate-700">
                    {activeQuestion?.questionType.replace(/_/g, " ")}
                  </Badge>
                </div>

                {/* Mark for review button */}
                <button
                  type="button"
                  onClick={() => toggleMarkForReview(activeQuestion.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    isCurrentFlagged
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800"
                  }`}
                >
                  <Flag className="h-3.5 w-3.5" />
                  <span>{isCurrentFlagged ? "Marked for Review" : "Mark for Review"}</span>
                </button>
              </div>

              {/* Question Prompt */}
              <div className="mb-6">
                <h2 className="text-sm sm:text-base font-bold text-white mb-2">
                  {activeQuestion?.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeQuestion?.content}
                </p>
              </div>

              {/* Dynamic Question Renderer */}
              {activeQuestion && (
                <QuestionRenderer
                  question={activeQuestion}
                  selectedAnswer={currentAnswer}
                  onAnswerChange={(ans) => setAnswer(activeQuestion.id, ans)}
                />
              )}
            </div>

            {/* Bottom Question Navigation Controls */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-6 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setQuestionIndex(Math.max(0, currentSession.currentQuestionIndex - 1))
                }
                disabled={currentSession.currentQuestionIndex === 0}
                className="gap-1.5 border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Previous
              </Button>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Autosaved securely</span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAnswer(activeQuestion.id, undefined)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear Answer
                </Button>

                {currentSession.currentQuestionIndex < totalQuestionsInSection - 1 ? (
                  <Button
                    size="sm"
                    onClick={() =>
                      setQuestionIndex(currentSession.currentQuestionIndex + 1)
                    }
                    className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Review & Submit</span>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Section Progress & Question Grid Navigator */}
        <div className="w-full lg:w-72 space-y-4">
          {/* Section Selector */}
          <Card className="border-slate-800 bg-slate-900 text-slate-100 p-4">
            <span className="text-[11px] font-semibold uppercase text-slate-400 block mb-2">
              Assessment Sections:
            </span>
            <div className="space-y-1.5">
              {assessment.sections.map((sec, sIdx) => {
                const isSelected = currentSession.currentSectionIndex === sIdx;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setSectionIndex(sIdx)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white font-bold"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <span className="truncate max-w-[160px]">{sec.title}</span>
                    <span className="text-[10px] opacity-80">{sec.durationMinutes}m</span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Question Grid Navigator */}
          <Card className="border-slate-800 bg-slate-900 text-slate-100 p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-[11px] font-semibold uppercase text-slate-400">
                Question Navigator
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {answeredCount} / {totalQuestionsInSection} Done
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {sectionQuestions.map((q, idx) => {
                const isAnswered = currentSession.answers[q.id] !== undefined;
                const isCurrent = currentSession.currentQuestionIndex === idx;
                const isFlagged = !!currentSession.markedForReview[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => setQuestionIndex(idx)}
                    className={`relative flex h-10 w-10 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? "ring-2 ring-blue-400 bg-blue-600 text-white"
                        : isAnswered
                        ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {idx + 1}
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 ring-2 ring-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-slate-800 space-y-1 text-[10px] text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-700" />
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span>Marked for Review</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Before Final Submission Modal */}
      {isSubmitModalOpen && (
        <Modal
          isOpen={isSubmitModalOpen}
          onClose={() => setIsSubmitModalOpen(false)}
          title="Confirm Assessment Final Submission"
          description="Are you sure you want to conclude and submit your evaluation?"
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="rounded-xl bg-slate-800/80 p-4 space-y-2 border border-slate-700 text-slate-200">
              <div className="flex justify-between">
                <span>Total Questions in Battery:</span>
                <span className="font-bold">{totalQuestionsInSection}</span>
              </div>
              <div className="flex justify-between">
                <span>Answered Questions:</span>
                <span className="font-bold text-emerald-400">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Unanswered Items:</span>
                <span className="font-bold text-amber-400">
                  {totalQuestionsInSection - answeredCount}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Time Remaining:</span>
                <span className="font-bold text-blue-400 font-mono">
                  {formatDuration(currentSession.timeRemainingSeconds)}
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed">
              Once submitted, you will not be able to modify your answers. Your performance metrics will be processed against normative standardization.
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSubmitModalOpen(false)}
                className="border-slate-700 text-slate-300"
              >
                Return to Test
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitTest}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                Confirm & Submit
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

