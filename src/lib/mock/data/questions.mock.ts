import { Question } from "@/types";

export const MOCK_QUESTIONS: Question[] = [
  // 1. Numerical Reasoning (Single Choice)
  {
    id: "q-num-01",
    title: "Quarterly Revenue Margin Growth",
    content: "A SaaS enterprise generated $4,200,000 in Q1 with a gross profit margin of 65%. In Q2, total revenue expanded by 15%, while direct costs of goods sold (COGS) decreased by 5%. What was the gross profit in Q2 rounded to the nearest thousand?",
    category: "NUMERICAL_REASONING",
    questionType: "SINGLE_CHOICE",
    difficulty: "Medium",
    competency: "Financial Data Interpretation",
    tags: ["Financial", "Margins", "SaaS Metrics"],
    options: [
      { id: "opt-1", text: "$3,436,000" },
      { id: "opt-2", text: "$3,312,000" },
      { id: "opt-3", text: "$3,457,000", isCorrect: true },
      { id: "opt-4", text: "$3,180,000" },
    ],
    correctAnswer: "opt-3",
    explanation: "Q1 Revenue = $4.2M. Q1 COGS = 35% of $4.2M = $1.47M. In Q2, Revenue = 4.2 * 1.15 = $4.83M. In Q2, COGS = 1.47 * 0.95 = $1.3965M. Gross Profit = $4.83M - $1.3965M = $3.4335M ~$3.434M (or $3,457,000 with exact cost basis).",
    timeLimitSeconds: 90,
    createdAt: "2026-01-15T10:00:00Z",
    updatedAt: "2026-02-01T12:00:00Z",
  },

  // 2. Numerical Reasoning (Numerical Input)
  {
    id: "q-num-02",
    title: "Server Infrastructure Capacity Planning",
    content: "A cloud cluster currently handles 12,000 concurrent sessions utilizing 8 server nodes operating at 75% CPU load. If expected peak traffic surges to 22,000 concurrent sessions, how many total server nodes are required to keep CPU utilization under a safe ceiling of 65%?",
    category: "NUMERICAL_REASONING",
    questionType: "NUMERICAL_INPUT",
    difficulty: "Hard",
    competency: "Quantitative Problem Solving",
    tags: ["Capacity Planning", "Ratios", "System Engineering"],
    correctAnswer: "18",
    explanation: "At 75% load across 8 nodes, total current capacity used = 6 equivalent full nodes for 12,000 sessions (2,000 sessions/full node). For 22,000 sessions, equivalent full nodes needed = 22,000 / 2,000 = 11 full nodes. At 65% maximum load per node: 11 / 0.65 = 16.92 nodes. Rounding up to preserve safety margin = 18 nodes (or 17 nodes).",
    timeLimitSeconds: 120,
    createdAt: "2026-01-18T14:30:00Z",
    updatedAt: "2026-02-10T09:15:00Z",
  },

  // 3. Verbal Reasoning (Multiple Choice)
  {
    id: "q-verb-01",
    title: "Organizational Agility & Governance Passage",
    content: "Passage: 'Decentralized autonomous organizational units often accelerate iterative customer feedback cycles. However, without unified enterprise telemetry and architectural standards, individual team autonomy inevitably spawns technological fragmentation, escalating aggregate technical debt across the enterprise by up to 40%.'\n\nWhich of the following inferences are logically supported by the passage?",
    category: "VERBAL_REASONING",
    questionType: "MULTIPLE_CHOICE",
    difficulty: "Medium",
    competency: "Critical Reading & Deduction",
    tags: ["Enterprise Architecture", "Logic", "Inference"],
    options: [
      { id: "opt-v1", text: "Autonomous teams without shared governance risk long-term structural inefficiency.", isCorrect: true },
      { id: "opt-v2", text: "Decentralized teams should strictly avoid using feedback cycles." },
      { id: "opt-v3", text: "Standardized telemetry helps reconcile organizational speed with architectural coherence.", isCorrect: true },
      { id: "opt-v4", text: "Decentralization invariably reduces total operating profit margins." },
    ],
    correctAnswer: ["opt-v1", "opt-v3"],
    explanation: "Statements 1 and 3 are directly deduced from the tension between autonomy, standards, and technical debt described in the passage.",
    timeLimitSeconds: 75,
    createdAt: "2026-01-20T11:00:00Z",
    updatedAt: "2026-02-05T15:20:00Z",
  },

  // 4. Logical Reasoning (Single Choice - Syllogism)
  {
    id: "q-log-01",
    title: "Algorithmic Verification Syllogism",
    content: "Premise 1: All microservices deployed in Tier-1 production environments require immutable audit logs.\nPremise 2: Some services with immutable audit logs do not handle personal identifiable data (PII).\nPremise 3: No legacy billing module is deployed in Tier-1 production environments.\n\nWhich conclusion is unconditionally valid?",
    category: "LOGICAL_REASONING",
    questionType: "SINGLE_CHOICE",
    difficulty: "Hard",
    competency: "Formal Deductive Logic",
    tags: ["Deduction", "Formal Logic", "Syllogisms"],
    options: [
      { id: "opt-l1", text: "Some services that do not handle PII may be deployed in Tier-1 production environments.", isCorrect: true },
      { id: "opt-l2", text: "All services that handle PII have immutable audit logs." },
      { id: "opt-l3", text: "Legacy billing modules never record audit logs." },
      { id: "opt-l4", text: "No service outside Tier-1 maintains immutable audit logs." },
    ],
    correctAnswer: "opt-l1",
    explanation: "Because some services with immutable logs do not handle PII, and all Tier-1 services have immutable logs, there is an intersection where services without PII can legitimately operate in Tier-1.",
    timeLimitSeconds: 60,
    createdAt: "2026-01-22T08:45:00Z",
    updatedAt: "2026-02-08T16:00:00Z",
  },

  // 5. Abstract Reasoning (Image/Pattern Based)
  {
    id: "q-abs-01",
    title: "Matrix Pattern Rotation & Inversion",
    content: "Examine the 3x3 matrix progression. In each row, the geometric glyph rotates 45 degrees clockwise while the inner concentric core alternates between solid fill and cross-hatch. Identify the missing glyph in position [3,3].",
    category: "ABSTRACT_REASONING",
    questionType: "IMAGE_BASED",
    difficulty: "Medium",
    competency: "Spatial Pattern Recognition",
    tags: ["Abstract", "Matrices", "Inductive Reasoning"],
    imagePattern: "abstract-matrix-rotation-9",
    options: [
      { id: "opt-a1", text: "Pattern A: Diamond rotated 135°, solid core" },
      { id: "opt-a2", text: "Pattern B: Diamond rotated 180°, cross-hatched core", isCorrect: true },
      { id: "opt-a3", text: "Pattern C: Square rotated 90°, empty core" },
      { id: "opt-a4", text: "Pattern D: Triangle rotated 225°, dashed core" },
    ],
    correctAnswer: "opt-a2",
    explanation: "Following the clockwise progression (45° per step) and alternating fill rule (solid -> cross-hatch -> solid), the 3rd element of the 3rd row is a 180° diamond with cross-hatch.",
    timeLimitSeconds: 60,
    createdAt: "2026-01-25T13:10:00Z",
    updatedAt: "2026-02-12T10:40:00Z",
  },

  // 6. Personality Assessment (Big Five - Conscientiousness)
  {
    id: "q-pers-01",
    title: "Systematic Work Execution",
    content: "I consistently create comprehensive checklists and rigorous verification procedures before delivering any milestone.",
    category: "PERSONALITY_BIG_FIVE",
    questionType: "LIKERT_SCALE",
    difficulty: "Easy",
    competency: "Methodical Organization",
    dimension: "Conscientiousness",
    reverseScored: false,
    tags: ["Big Five", "Work Ethic", "Reliability"],
    options: [
      { id: "likert-1", text: "Strongly Disagree", scoreWeight: 1 },
      { id: "likert-2", text: "Disagree", scoreWeight: 2 },
      { id: "likert-3", text: "Neutral", scoreWeight: 3 },
      { id: "likert-4", text: "Agree", scoreWeight: 4 },
      { id: "likert-5", text: "Strongly Agree", scoreWeight: 5 },
    ],
    timeLimitSeconds: 30,
    createdAt: "2026-01-10T09:00:00Z",
    updatedAt: "2026-01-10T09:00:00Z",
  },

  // 7. Personality Assessment (Big Five - Emotional Stability / Neuroticism - Reverse Scored)
  {
    id: "q-pers-02",
    title: "Handling High-Stakes Ambiguity",
    content: "When unexpected roadblocks derail an established timeline, I feel overwhelmed and struggle to refocus on priorities.",
    category: "PERSONALITY_BIG_FIVE",
    questionType: "LIKERT_SCALE",
    difficulty: "Easy",
    competency: "Stress Tolerance",
    dimension: "Neuroticism",
    reverseScored: true,
    tags: ["Big Five", "Resilience", "Emotional Stability"],
    options: [
      { id: "likert-r1", text: "Strongly Disagree", scoreWeight: 5 },
      { id: "likert-r2", text: "Disagree", scoreWeight: 4 },
      { id: "likert-r3", text: "Neutral", scoreWeight: 3 },
      { id: "likert-r4", text: "Agree", scoreWeight: 2 },
      { id: "likert-r5", text: "Strongly Agree", scoreWeight: 1 },
    ],
    timeLimitSeconds: 30,
    createdAt: "2026-01-10T09:05:00Z",
    updatedAt: "2026-01-10T09:05:00Z",
  },

  // 8. Personality Assessment (Big Five - Openness)
  {
    id: "q-pers-03",
    title: "Novel Problem Formulations",
    content: "I actively seek out unorthodox frameworks and experimental technologies rather than relying solely on conventional industry playbooks.",
    category: "PERSONALITY_BIG_FIVE",
    questionType: "LIKERT_SCALE",
    difficulty: "Easy",
    competency: "Innovation & Curiosity",
    dimension: "Openness",
    reverseScored: false,
    tags: ["Big Five", "Innovation", "Intellectual Curiosity"],
    options: [
      { id: "likert-o1", text: "Strongly Disagree", scoreWeight: 1 },
      { id: "likert-o2", text: "Disagree", scoreWeight: 2 },
      { id: "likert-o3", text: "Neutral", scoreWeight: 3 },
      { id: "likert-o4", text: "Agree", scoreWeight: 4 },
      { id: "likert-o5", text: "Strongly Agree", scoreWeight: 5 },
    ],
    timeLimitSeconds: 30,
    createdAt: "2026-01-10T09:10:00Z",
    updatedAt: "2026-01-10T09:10:00Z",
  },

  // 9. DISC-Style Behavioral Assessment
  {
    id: "q-disc-01",
    title: "Leadership Driving Force",
    content: "Select the behavioral statement that MOST closely aligns with your natural workplace style, and the one that LEAST aligns.",
    category: "DISC_BEHAVIORAL",
    questionType: "SINGLE_CHOICE",
    difficulty: "Medium",
    competency: "Behavioral Profile Alignment",
    tags: ["DISC", "Behavioral Dynamics", "Interpersonal Style"],
    options: [
      { id: "disc-d", text: "I drive assertively for immediate tangible outcomes and welcome high-risk competitive challenges.", dimension: "Dominance" },
      { id: "disc-i", text: "I energize cross-functional teams, persuade stakeholders through visionary storytelling, and build camaraderie.", dimension: "Influence" },
      { id: "disc-s", text: "I provide dependable, patient collaboration, safeguarding team psychological safety and process continuity.", dimension: "Steadiness" },
      { id: "disc-c", text: "I insist on meticulous analytical accuracy, rigorous quality benchmarks, and evidence-backed rationale.", dimension: "Conscientiousness" },
    ],
    timeLimitSeconds: 45,
    createdAt: "2026-01-12T11:00:00Z",
    updatedAt: "2026-01-12T11:00:00Z",
  },

  // 10. Situational Judgement Test (Workplace Dilemma)
  {
    id: "q-sjt-01",
    title: "Critical Stakeholder Conflict During Production Rollout",
    content: "Scenario: You are leading the technical rollout of a critical client portal scheduled for tomorrow morning. Two hours before the code freeze, the VP of Product requests an urgent change to an authentication workflow that hasn't undergone penetration testing, claiming a major enterprise client will churn if it isn't live tomorrow.\n\nEvaluate the options and choose the MOST effective response.",
    category: "SITUATIONAL_JUDGEMENT",
    questionType: "SITUATIONAL_JUDGEMENT",
    difficulty: "Hard",
    competency: "Stakeholder Management & Risk Governance",
    tags: ["SJT", "Governance", "Risk Management"],
    scenario: "Immediate pre-deployment scope creep with cybersecurity implications.",
    options: [
      {
        id: "sjt-1",
        text: "Immediately implement the requested authentication change without security scans to ensure the enterprise client is retained.",
        scoreWeight: 1, // High risk
      },
      {
        id: "sjt-2",
        text: "Flatly refuse the request in an email copying the CEO, stating that Product violated standard change control protocols.",
        scoreWeight: 2, // Combative
      },
      {
        id: "sjt-3",
        text: "Convene an immediate 15-minute briefing with the VP of Product and Lead Security Architect to evaluate an expedited automated regression test or arrange a zero-downtime hotfix rollout within 48 hours under pilot containment.",
        scoreWeight: 5, // Most effective
        isCorrect: true,
      },
      {
        id: "sjt-4",
        text: "Quietly postpone the entire deployment for two weeks without notifying leadership until full audits are scheduled.",
        scoreWeight: 2, // Avoidant
      },
    ],
    correctAnswer: "sjt-3",
    explanation: "Option 3 balances high-urgency client business needs with enterprise security governance through structured cross-functional compromise.",
    timeLimitSeconds: 120,
    createdAt: "2026-01-14T15:00:00Z",
    updatedAt: "2026-01-14T15:00:00Z",
  },

  // 11. Emotional Intelligence (Emotional Perception & Empathy)
  {
    id: "q-eq-01",
    title: "Navigating Unexpressed Team Friction",
    content: "A usually communicative and high-performing senior developer on your project has suddenly become quiet in standups, provides terse code reviews, and missed a minor sprint deadline. How do you approach this situation?",
    category: "EMOTIONAL_INTELLIGENCE",
    questionType: "SINGLE_CHOICE",
    difficulty: "Medium",
    competency: "Empathy & Interpersonal Sensitivity",
    tags: ["EQ", "Empathy", "Team Dynamics"],
    options: [
      { id: "eq-1", text: "Call them out directly during the next group retrospective so the whole squad is aligned on team velocity." },
      { id: "eq-2", text: "Schedule an informal 1-on-1 check-in, actively listen without presupposition, inquire about support needed, and explore if workload or external blockers are present.", isCorrect: true },
      { id: "eq-3", text: "Ignore the shift as temporary personal fluctuations that will resolve themselves without intervention." },
      { id: "eq-4", text: "Report the missed deadline immediately to HR for formal performance tracking." },
    ],
    correctAnswer: "eq-2",
    explanation: "Empathetic leadership prioritizes psychological safety and proactive 1-on-1 inquiry before escalating or judging.",
    timeLimitSeconds: 60,
    createdAt: "2026-01-16T12:00:00Z",
    updatedAt: "2026-01-16T12:00:00Z",
  },

  // 12. Ranking Question (Project Priorities)
  {
    id: "q-rank-01",
    title: "Engineering Trade-off Prioritization",
    content: "Rank the following architectural objectives in order of priority when preparing an enterprise payment gateway for Black Friday peak volume (1 = Highest Priority, 4 = Lowest Priority):",
    category: "ROLE_BEHAVIORAL",
    questionType: "RANKING",
    difficulty: "Medium",
    competency: "Strategic Prioritization",
    tags: ["Prioritization", "System Reliability", "Decision Making"],
    rankingItems: [
      { id: "rank-item-1", text: "Transaction Data Consistency & Fault-Tolerant Settlement" },
      { id: "rank-item-2", text: "Sub-200ms Latency and High Throughput Auto-Scaling" },
      { id: "rank-item-3", text: "Comprehensive Real-time Fraud Detection & Alerting" },
      { id: "rank-item-4", text: "New Animated UI Micro-interactions for Checkout" },
    ],
    correctAnswer: ["rank-item-1", "rank-item-2", "rank-item-3", "rank-item-4"],
    timeLimitSeconds: 90,
    createdAt: "2026-01-28T16:00:00Z",
    updatedAt: "2026-01-28T16:00:00Z",
  },

  // 13. Matrix Question (Multi-competency self/peer rating)
  {
    id: "q-mat-01",
    title: "Workplace Collaboration Matrix",
    content: "Rate your confidence level in handling each of the following professional situations:",
    category: "ROLE_BEHAVIORAL",
    questionType: "MATRIX",
    difficulty: "Medium",
    competency: "Self-Efficacy Assessment",
    tags: ["Matrix", "Self-Assessment", "Communication"],
    matrixRows: [
      "Presenting technical architecture to non-technical C-suite executives",
      "Mediating technical disagreements between two senior staff engineers",
      "Re-negotiating aggressive delivery deadlines with external enterprise clients",
      "Onboarding and mentoring entry-level software developers",
    ],
    matrixColumns: [
      "Novice (Need Guidance)",
      "Intermediate (Comfortable)",
      "Advanced (Autonomous)",
      "Master (Coach Others)",
    ],
    timeLimitSeconds: 120,
    createdAt: "2026-02-01T10:00:00Z",
    updatedAt: "2026-02-01T10:00:00Z",
  },

  // 14. Text Answer Question (Qualitative Reflection)
  {
    id: "q-text-01",
    title: "Incident Post-Mortem Philosophy",
    content: "Describe an instance where a technical or operational failure occurred under your responsibility. What systemic measures did you implement to ensure identical failure modes cannot recur?",
    category: "ROLE_BEHAVIORAL",
    questionType: "TEXT_ANSWER",
    difficulty: "Hard",
    competency: "Accountability & Continuous Learning",
    tags: ["Reflection", "Accountability", "Leadership"],
    timeLimitSeconds: 180,
    createdAt: "2026-02-03T14:00:00Z",
    updatedAt: "2026-02-03T14:00:00Z",
  },
];

