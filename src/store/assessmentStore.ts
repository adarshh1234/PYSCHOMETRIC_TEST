import { create } from "zustand";
import {
  Assessment,
  Question,
  Candidate,
  Invitation,
  CandidateResult,
  AssessmentSessionState,
} from "@/types";
import { MOCK_ASSESSMENTS } from "@/lib/mock/data/assessments.mock";
import { MOCK_QUESTIONS } from "@/lib/mock/data/questions.mock";
import { MOCK_CANDIDATES } from "@/lib/mock/data/candidates.mock";
import { MOCK_INVITATIONS } from "@/lib/mock/data/invitations.mock";
import { MOCK_RESULTS } from "@/lib/mock/data/results.mock";
import { generateId } from "@/lib/utils";

interface AssessmentState {
  assessments: Assessment[];
  questions: Question[];
  candidates: Candidate[];
  invitations: Invitation[];
  results: Record<string, CandidateResult>;
  aiGeneratedQuestions: Question[];
  comparedCandidateIds: string[];

  // Candidate Assessment Active Session
  currentSession: AssessmentSessionState | null;

  // Actions: Assessments
  addAssessment: (
    assessment: Omit<
      Assessment,
      "id" | "createdAt" | "updatedAt" | "assignedCandidatesCount" | "completedCandidatesCount"
    >
  ) => Assessment;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;

  // Actions: Questions
  addQuestion: (question: Omit<Question, "id" | "createdAt" | "updatedAt">) => Question;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;

  // Actions: Candidates & Invitations
  addCandidate: (candidate: Omit<Candidate, "id" | "invitedAt">) => Candidate;
  addCandidateNote: (candidateId: string, note: string) => void;
  createInvitation: (invitationData: {
    candidateId: string;
    candidateName: string;
    candidateEmail: string;
    assessmentId: string;
    assessmentTitle: string;
    expiresInDays?: number;
  }) => Invitation;
  resendInvitation: (invitationId: string) => void;
  cancelInvitation: (invitationId: string) => void;

  // Actions: Candidate Comparison
  toggleCandidateComparison: (candidateId: string) => void;
  clearCandidateComparison: () => void;

  // Actions: AI Generator
  setAiGeneratedQuestions: (questions: Question[]) => void;
  updateAiQuestionStatus: (id: string, status: Question["reviewStatus"]) => void;
  addAiQuestionToBank: (questionId: string) => void;

  // Actions: Active Candidate Test Session
  initSession: (assessmentId: string, candidateId: string) => void;
  setAnswer: (questionId: string, answer: any) => void;
  toggleMarkForReview: (questionId: string) => void;
  setSectionIndex: (index: number) => void;
  setQuestionIndex: (index: number) => void;
  decrementTimer: () => void;
  submitSession: () => void;
  setSessionConsent: (consent: boolean) => void;
  setDeviceCheckPassed: (passed: boolean) => void;
  setPracticeCompleted: (completed: boolean) => void;

  // Reset to Pristine Mock Data
  resetAllData: () => void;
}

export const useAssessmentStore = create<AssessmentState>((set, get) => ({
  assessments: MOCK_ASSESSMENTS,
  questions: MOCK_QUESTIONS,
  candidates: MOCK_CANDIDATES,
  invitations: MOCK_INVITATIONS,
  results: MOCK_RESULTS,
  aiGeneratedQuestions: [],
  comparedCandidateIds: ["cand-001", "cand-004"], // pre-selected for instant comparison showcase
  currentSession: null,

  // Assessments
  addAssessment: (data) => {
    const newAsm: Assessment = {
      ...data,
      id: generateId("asm"),
      assignedCandidatesCount: 0,
      completedCandidatesCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ assessments: [newAsm, ...state.assessments] }));
    return newAsm;
  },

  updateAssessment: (id, updates) => {
    set((state) => ({
      assessments: state.assessments.map((a) =>
        a.id === id ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
      ),
    }));
  },

  deleteAssessment: (id) => {
    set((state) => ({
      assessments: state.assessments.filter((a) => a.id !== id),
    }));
  },

  // Questions
  addQuestion: (data) => {
    const newQ: Question = {
      ...data,
      id: generateId("q"),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ questions: [newQ, ...state.questions] }));
    return newQ;
  },

  updateQuestion: (id, updates) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, ...updates, updatedAt: new Date().toISOString() } : q
      ),
    }));
  },

  deleteQuestion: (id) => {
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    }));
  },

  // Candidates & Invitations
  addCandidate: (data) => {
    const newCand: Candidate = {
      ...data,
      id: generateId("cand"),
      invitedAt: new Date().toISOString(),
      recruiterNotes: [],
    };
    set((state) => ({ candidates: [newCand, ...state.candidates] }));
    return newCand;
  },

  addCandidateNote: (candidateId, note) => {
    set((state) => ({
      candidates: state.candidates.map((c) =>
        c.id === candidateId
          ? { ...c, recruiterNotes: [...(c.recruiterNotes || []), note] }
          : c
      ),
    }));
  },

  createInvitation: ({
    candidateId,
    candidateName,
    candidateEmail,
    assessmentId,
    assessmentTitle,
    expiresInDays = 7,
  }) => {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + expiresInDays);

    const newInv: Invitation = {
      id: generateId("inv"),
      candidateId,
      candidateName,
      candidateEmail,
      assessmentId,
      assessmentTitle,
      token: `tok_${Math.random().toString(36).substring(2, 10)}`,
      status: "SENT",
      sentAt: new Date().toISOString(),
      expiresAt: expiry.toISOString(),
      remindersSent: 0,
    };

    set((state) => ({
      invitations: [newInv, ...state.invitations],
      candidates: state.candidates.map((c) =>
        c.id === candidateId ? { ...c, status: "INVITED" } : c
      ),
    }));

    return newInv;
  },

  resendInvitation: (invitationId) => {
    set((state) => ({
      invitations: state.invitations.map((inv) =>
        inv.id === invitationId
          ? {
              ...inv,
              status: "SENT",
              sentAt: new Date().toISOString(),
              remindersSent: inv.remindersSent + 1,
            }
          : inv
      ),
    }));
  },

  cancelInvitation: (invitationId) => {
    set((state) => ({
      invitations: state.invitations.filter((inv) => inv.id !== invitationId),
    }));
  },

  // Comparison
  toggleCandidateComparison: (candidateId) => {
    set((state) => {
      const exists = state.comparedCandidateIds.includes(candidateId);
      if (exists) {
        return {
          comparedCandidateIds: state.comparedCandidateIds.filter((id) => id !== candidateId),
        };
      }
      if (state.comparedCandidateIds.length >= 4) {
        return state; // maximum 4 candidates for comparison readability
      }
      return {
        comparedCandidateIds: [...state.comparedCandidateIds, candidateId],
      };
    });
  },

  clearCandidateComparison: () => {
    set({ comparedCandidateIds: [] });
  },

  // AI Questions
  setAiGeneratedQuestions: (questions) => {
    set({ aiGeneratedQuestions: questions });
  },

  updateAiQuestionStatus: (id, status) => {
    set((state) => ({
      aiGeneratedQuestions: state.aiGeneratedQuestions.map((q) =>
        q.id === id ? { ...q, reviewStatus: status } : q
      ),
    }));
  },

  addAiQuestionToBank: (questionId) => {
    const q = get().aiGeneratedQuestions.find((item) => item.id === questionId);
    if (!q) return;
    const cleanQ: Question = {
      ...q,
      id: generateId("q"),
      reviewStatus: "PUBLISHED",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({
      questions: [cleanQ, ...state.questions],
      aiGeneratedQuestions: state.aiGeneratedQuestions.map((item) =>
        item.id === questionId ? { ...item, reviewStatus: "PUBLISHED" } : item
      ),
    }));
  },

  // Testing Engine Session
  initSession: (assessmentId, candidateId) => {
    const asm = get().assessments.find((a) => a.id === assessmentId) || get().assessments[0]!;
    const cand = get().candidates.find((c) => c.id === candidateId) || get().candidates[0]!;

    set({
      currentSession: {
        sessionId: generateId("sess"),
        token: `tok_live_${candidateId}`,
        candidateId: cand.id,
        candidateName: cand.name,
        candidateEmail: cand.email,
        assessment: asm,
        currentSectionIndex: 0,
        currentQuestionIndex: 0,
        answers: {},
        markedForReview: {},
        timeRemainingSeconds: asm.durationMinutes * 60,
        startTime: new Date().toISOString(),
        isStarted: false,
        isSubmitted: false,
        consentGiven: false,
        deviceCheckPassed: false,
        practiceCompleted: false,
      },
    });
  },

  setAnswer: (questionId, answer) => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          answers: {
            ...state.currentSession.answers,
            [questionId]: answer,
          },
        },
      };
    });
  },

  toggleMarkForReview: (questionId) => {
    set((state) => {
      if (!state.currentSession) return state;
      const current = !!state.currentSession.markedForReview[questionId];
      return {
        currentSession: {
          ...state.currentSession,
          markedForReview: {
            ...state.currentSession.markedForReview,
            [questionId]: !current,
          },
        },
      };
    });
  },

  setSectionIndex: (index) => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          currentSectionIndex: index,
          currentQuestionIndex: 0,
        },
      };
    });
  },

  setQuestionIndex: (index) => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          currentQuestionIndex: index,
        },
      };
    });
  },

  decrementTimer: () => {
    set((state) => {
      if (!state.currentSession || state.currentSession.timeRemainingSeconds <= 0) {
        return state;
      }
      return {
        currentSession: {
          ...state.currentSession,
          timeRemainingSeconds: state.currentSession.timeRemainingSeconds - 1,
        },
      };
    });
  },

  submitSession: () => {
    set((state) => {
      if (!state.currentSession) return state;
      const candId = state.currentSession.candidateId;
      return {
        currentSession: {
          ...state.currentSession,
          isSubmitted: true,
        },
        candidates: state.candidates.map((c) =>
          c.id === candId
            ? {
                ...c,
                status: "COMPLETED",
                overallScore: 86,
                percentileRank: 89,
                completedAt: new Date().toISOString(),
              }
            : c
        ),
      };
    });
  },

  setSessionConsent: (consent) => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          consentGiven: consent,
        },
      };
    });
  },

  setDeviceCheckPassed: (passed) => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          deviceCheckPassed: passed,
        },
      };
    });
  },

  setPracticeCompleted: (completed) => {
    set((state) => {
      if (!state.currentSession) return state;
      return {
        currentSession: {
          ...state.currentSession,
          practiceCompleted: completed,
          isStarted: completed,
        },
      };
    });
  },

  resetAllData: () => {
    set({
      assessments: MOCK_ASSESSMENTS,
      questions: MOCK_QUESTIONS,
      candidates: MOCK_CANDIDATES,
      invitations: MOCK_INVITATIONS,
      results: MOCK_RESULTS,
      aiGeneratedQuestions: [],
      comparedCandidateIds: ["cand-001", "cand-004"],
      currentSession: null,
    });
  },
}));

