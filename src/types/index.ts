export type UserRole =
  | 'SUPER_ADMIN'
  | 'TENANT_ADMIN'
  | 'HR_MANAGER'
  | 'RECRUITER'
  | 'ASSESSMENT_AUTHOR'
  | 'ANALYST'
  | 'CANDIDATE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  tenantId?: string;
  tenantName?: string;
  department?: string;
}

export type AssessmentCategory =
  | 'COGNITIVE'
  | 'NUMERICAL_REASONING'
  | 'VERBAL_REASONING'
  | 'LOGICAL_REASONING'
  | 'ABSTRACT_REASONING'
  | 'SPATIAL_REASONING'
  | 'PERSONALITY_BIG_FIVE'
  | 'DISC_BEHAVIORAL'
  | 'EMOTIONAL_INTELLIGENCE'
  | 'SITUATIONAL_JUDGEMENT'
  | 'STRESS_COPING'
  | 'ROLE_BEHAVIORAL'
  | 'CUSTOM';

export type AssessmentStatus = 'Draft' | 'Published' | 'Archived' | 'Active';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard' | 'Expert';

export type QuestionType =
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'LIKERT_SCALE'
  | 'NUMERICAL_INPUT'
  | 'TEXT_ANSWER'
  | 'IMAGE_BASED'
  | 'MATRIX'
  | 'RANKING'
  | 'SITUATIONAL_JUDGEMENT';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  scoreWeight?: number; // For situational judgement or personality weights
  dimension?: string;   // For personality (e.g. 'Extraversion')
  imageUrl?: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  category: AssessmentCategory;
  questionType: QuestionType;
  difficulty: DifficultyLevel;
  competency: string;
  tags: string[];
  options?: QuestionOption[];
  correctAnswer?: string | string[]; // Author/admin only preview
  explanation?: string;
  reverseScored?: boolean; // For personality items
  dimension?: string;      // Big Five or DISC dimension
  matrixRows?: string[];   // For Matrix question type
  matrixColumns?: string[];
  rankingItems?: { id: string; text: string }[];
  scenario?: string;       // For Situational Judgement
  imagePattern?: string;   // SVG identifier or data for abstract/spatial
  timeLimitSeconds?: number;
  aiGenerated?: boolean;
  reviewStatus?: 'AI_GENERATED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  validationWarnings?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentSection {
  id: string;
  title: string;
  description: string;
  category: AssessmentCategory;
  durationMinutes: number;
  questionCount: number;
  instructions: string;
  questionIds: string[];
  isAdaptive?: boolean;
  randomizeQuestions?: boolean;
}

export interface AssessmentSettings {
  allowBacktracking: boolean;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showSectionTimer: boolean;
  autoSubmitOnExpiry: boolean;
  integrityMonitoring: {
    trackTabSwitches: boolean;
    trackFullscreen: boolean;
    trackCopyPaste: boolean;
    requireWebcam: boolean;
  };
  candidateInstructions: string;
  passThresholdPercent?: number;
}

export interface Assessment {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: AssessmentCategory;
  industry: string;
  targetRole: string;
  seniorityLevel: 'Entry' | 'Mid-Level' | 'Senior' | 'Lead' | 'Executive';
  durationMinutes: number;
  status: AssessmentStatus;
  sections: AssessmentSection[];
  settings: AssessmentSettings;
  assignedCandidatesCount: number;
  completedCandidatesCount: number;
  averageScore?: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type CandidateStatus =
  | 'INVITED'
  | 'OPENED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'EVALUATED'
  | 'EXPIRED';

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  appliedRole: string;
  department: string;
  experienceYears: number;
  location?: string;
  avatar?: string;
  assignedAssessmentId: string;
  assignedAssessmentTitle: string;
  status: CandidateStatus;
  overallScore?: number;
  percentileRank?: number;
  completedAt?: string;
  invitedAt: string;
  recruiterNotes?: string[];
}

export interface Invitation {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  assessmentId: string;
  assessmentTitle: string;
  token: string;
  status: 'PENDING' | 'SENT' | 'OPENED' | 'STARTED' | 'COMPLETED' | 'EXPIRED';
  sentAt: string;
  expiresAt: string;
  openedAt?: string;
  startedAt?: string;
  completedAt?: string;
  remindersSent: number;
}

export interface IntegrityEvent {
  id: string;
  candidateId: string;
  sessionId: string;
  timestamp: string;
  eventType:
    | 'TAB_SWITCH'
    | 'WINDOW_BLUR'
    | 'WINDOW_FOCUS'
    | 'FULLSCREEN_EXIT'
    | 'COPY_ATTEMPT'
    | 'PASTE_ATTEMPT'
    | 'LATENCY_ANOMALY'
    | 'SESSION_INTERRUPTION'
    | 'NETWORK_RECONNECT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  details: string;
  questionIndex?: number;
}

export interface CandidateResult {
  candidateId: string;
  assessmentId: string;
  assessmentTitle: string;
  completionDate: string;
  durationMinutes: number;
  overallScore: number; // 0-100
  overallPercentile: number; // 0-100
  integrityScore: number; // 0-100
  integrityLevel: 'LOW' | 'MEDIUM' | 'HIGH'; // low risk, medium risk, high risk
  integrityEvents: IntegrityEvent[];
  
  // Cognitive Breakdown
  cognitiveBreakdown: {
    category: string;
    score: number;
    percentile: number;
    accuracy: number;
    averageSpeedSeconds: number;
  }[];

  // Big Five Personality Dimensions
  personalityBigFive: {
    trait: 'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Neuroticism';
    score: number; // 0 - 100
    stenScore: number; // 1 - 10
    percentile: number;
    description: string;
  }[];

  // DISC Quadrants
  discScores: {
    quadrant: 'Dominance' | 'Influence' | 'Steadiness' | 'Conscientiousness';
    value: number;
    intensity: 'High' | 'Moderate' | 'Low';
    summary: string;
  }[];

  // Behavioral Competencies
  behavioralCompetencies: {
    competency: string;
    score: number;
    benchmarkScore: number;
    level: 'Developing' | 'Competent' | 'Strong' | 'Exceptional';
  }[];

  // Situational Judgement Performance
  situationalJudgement: {
    effectivenessScore: number;
    decisionMakingStyle: string;
    strengths: string[];
    riskAreas: string[];
  };

  // Qualitative Insights
  strengths: string[];
  growthAreas: string[];
  interviewProbes: string[];
  roleFitSummary: string;
  normGroup: string;
  version: string;
}

export interface AssessmentSessionState {
  sessionId: string;
  token: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  assessment: Assessment;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  answers: Record<string, any>; // questionId -> answer
  markedForReview: Record<string, boolean>;
  timeRemainingSeconds: number;
  startTime: string;
  isStarted: boolean;
  isSubmitted: boolean;
  consentGiven: boolean;
  deviceCheckPassed: boolean;
  practiceCompleted: boolean;
}

