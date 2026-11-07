import { IntegrityEvent } from "@/types";

export interface CandidateIntegritySummary {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  assessmentTitle: string;
  integrityScore: number; // 0-100
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  sessionDuration: string;
  eventsCount: number;
  events: IntegrityEvent[];
  lastActive: string;
}

export const MOCK_INTEGRITY_SUMMARIES: CandidateIntegritySummary[] = [
  {
    candidateId: "cand-001",
    candidateName: "Alex Rivera",
    candidateEmail: "alex.rivera.dev@gmail.com",
    assessmentTitle: "Senior Full-Stack Software Engineer Assessment",
    integrityScore: 98,
    riskLevel: "LOW",
    sessionDuration: "37m 14s",
    eventsCount: 1,
    lastActive: "2026-02-14T17:42:00Z",
    events: [
      {
        id: "evt-01",
        candidateId: "cand-001",
        sessionId: "sess-001",
        timestamp: "2026-02-14T17:18:22Z",
        eventType: "WINDOW_BLUR",
        severity: "LOW",
        details: "OS desktop notification received; window blur lasted 1.2 seconds.",
        questionIndex: 3,
      },
    ],
  },
  {
    candidateId: "cand-005",
    candidateName: "Tariq Mansoor",
    candidateEmail: "tariq.mansoor@innovate.co",
    assessmentTitle: "Senior Full-Stack Software Engineer Assessment",
    integrityScore: 68,
    riskLevel: "MEDIUM",
    sessionDuration: "24m 50s (Active)",
    eventsCount: 4,
    lastActive: "Just now",
    events: [
      {
        id: "evt-03",
        candidateId: "cand-005",
        sessionId: "sess-005",
        timestamp: "2026-02-16T13:48:10Z",
        eventType: "TAB_SWITCH",
        severity: "MEDIUM",
        details: "Browser tab switch to external window detected for 7.8 seconds during quantitative reasoning question.",
        questionIndex: 2,
      },
      {
        id: "evt-04",
        candidateId: "cand-005",
        sessionId: "sess-005",
        timestamp: "2026-02-16T13:52:30Z",
        eventType: "COPY_ATTEMPT",
        severity: "LOW",
        details: "Clipboard copy attempt blocked on question prompt text.",
        questionIndex: 2,
      },
      {
        id: "evt-05",
        candidateId: "cand-005",
        sessionId: "sess-005",
        timestamp: "2026-02-16T13:58:04Z",
        eventType: "FULLSCREEN_EXIT",
        severity: "MEDIUM",
        details: "Exited enforced testing layout for 4.2 seconds; returned after dialog prompt.",
        questionIndex: 4,
      },
      {
        id: "evt-06",
        candidateId: "cand-005",
        sessionId: "sess-005",
        timestamp: "2026-02-16T14:04:15Z",
        eventType: "LATENCY_ANOMALY",
        severity: "LOW",
        details: "Unusual response latency pattern: answered 4 complex syllogisms in under 3.1 seconds each.",
        questionIndex: 5,
      },
    ],
  },
  {
    candidateId: "cand-002",
    candidateName: "Jessica Chen, CFA",
    candidateEmail: "jessica.chen@alumni.columbia.edu",
    assessmentTitle: "Enterprise Financial Analyst Cognitive & Numerical Battery",
    integrityScore: 100,
    riskLevel: "LOW",
    sessionDuration: "30m 02s",
    eventsCount: 0,
    lastActive: "2026-02-13T11:20:00Z",
    events: [],
  },
  {
    candidateId: "cand-003",
    candidateName: "Devon Morales",
    candidateEmail: "devon.morales@techleads.io",
    assessmentTitle: "Product Management Behavioral & Leadership SJT",
    integrityScore: 95,
    riskLevel: "LOW",
    sessionDuration: "25m 11s",
    eventsCount: 1,
    lastActive: "2026-02-16T15:30:00Z",
    events: [
      {
        id: "evt-02",
        candidateId: "cand-003",
        sessionId: "sess-003",
        timestamp: "2026-02-16T15:12:00Z",
        eventType: "TAB_SWITCH",
        severity: "LOW",
        details: "Single tab switch detected for 2.4 seconds.",
        questionIndex: 2,
      },
    ],
  },
];

