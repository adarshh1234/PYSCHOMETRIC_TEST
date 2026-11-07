export interface AnalyticsKPIs {
  totalAssessments: number;
  activeAssessments: number;
  totalCandidates: number;
  completedAssessments: number;
  pendingAssessments: number;
  averageAssessmentScore: number;
  completionRatePercent: number;
  activeInvitations: number;
}

export const MOCK_ANALYTICS_KPIS: AnalyticsKPIs = {
  totalAssessments: 14,
  activeAssessments: 8,
  totalCandidates: 342,
  completedAssessments: 286,
  pendingAssessments: 56,
  averageAssessmentScore: 79.2,
  completionRatePercent: 83.6,
  activeInvitations: 38,
};

export const MOCK_COMPLETION_TRENDS = [
  { month: "Sep 2025", completed: 32, invited: 40, avgScore: 76.5 },
  { month: "Oct 2025", completed: 48, invited: 55, avgScore: 78.1 },
  { month: "Nov 2025", completed: 52, invited: 60, avgScore: 77.8 },
  { month: "Dec 2025", completed: 39, invited: 48, avgScore: 80.2 },
  { month: "Jan 2026", completed: 58, invited: 68, avgScore: 79.4 },
  { month: "Feb 2026", completed: 57, invited: 71, avgScore: 81.0 },
];

export const MOCK_SCORE_DISTRIBUTION = [
  { range: "0-49%", count: 12, label: "Developing (<50%)" },
  { range: "50-59%", count: 28, label: "Basic (50-59%)" },
  { range: "60-69%", count: 64, label: "Competent (60-69%)" },
  { range: "70-79%", count: 96, label: "Proficient (70-79%)" },
  { range: "80-89%", count: 62, label: "Advanced (80-89%)" },
  { range: "90-100%", count: 24, label: "Exceptional (90-100%)" },
];

export const MOCK_CATEGORY_DISTRIBUTION = [
  { category: "Cognitive & Numerical", testsCount: 142, avgScore: 78.6, fill: "#3b82f6" },
  { category: "Big Five Personality", testsCount: 98, avgScore: 82.3, fill: "#8b5cf6" },
  { category: "Situational Judgement", testsCount: 84, avgScore: 76.4, fill: "#10b981" },
  { category: "DISC Behavioral", testsCount: 72, avgScore: 80.1, fill: "#f59e0b" },
  { category: "Emotional Intelligence", testsCount: 65, avgScore: 79.8, fill: "#ec4899" },
  { category: "Abstract & Spatial", testsCount: 54, avgScore: 75.2, fill: "#06b6d4" },
];

export const MOCK_DEPARTMENT_METRICS = [
  { department: "Engineering", candidates: 124, completionRate: 88, avgScore: 82.4 },
  { department: "Product Management", candidates: 68, completionRate: 84, avgScore: 80.1 },
  { department: "Finance & Accounting", candidates: 54, completionRate: 91, avgScore: 84.8 },
  { department: "Sales & Client Success", candidates: 52, completionRate: 77, avgScore: 76.5 },
  { department: "Operations & HR", candidates: 44, completionRate: 82, avgScore: 78.9 },
];

export const MOCK_RECENT_ACTIVITIES = [
  {
    id: "act-1",
    type: "COMPLETED",
    title: "Alex Rivera completed Senior Full-Stack Assessment",
    timestamp: "25 minutes ago",
    score: "88% (92nd percentile)",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80",
    role: "Engineering",
  },
  {
    id: "act-2",
    type: "INVITATION",
    title: "Invitation sent to Elena Rostova for Customer Success Assessment",
    timestamp: "2 hours ago",
    score: "Pending link open",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    role: "Customer Operations",
  },
  {
    id: "act-3",
    type: "REPORT",
    title: "Comprehensive Psychometric Report generated for Jessica Chen",
    timestamp: "4 hours ago",
    score: "Top 2% Benchmark",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Corporate Finance",
  },
  {
    id: "act-4",
    type: "ASSESSMENT_UPDATE",
    title: "Dr. Arvind Ramesh published new version of Enterprise Financial Battery",
    timestamp: "Yesterday",
    score: "v4.2 released",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    role: "Psychometric R&D",
  },
  {
    id: "act-5",
    type: "AI_GENERATED",
    title: "10 new Situational Judgement Questions simulated by AI Generator",
    timestamp: "Yesterday",
    score: "Pending author review",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "System AI Engine",
  },
];

