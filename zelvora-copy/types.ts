export interface NavItem {
  label: string;
  path: string;
  children?: NavItem[];
}

export enum PlanType {
  FREE = 'Free',
  PRO = 'Pro',
  PLACEMENT = 'Placement Prep'
}

export interface InterviewSession {
  id: string;
  date: string;
  role: string;
  score: number;
  status: 'Completed' | 'In Progress' | 'Scheduled';
}

export interface SkillMetric {
  subject: string;
  A: number; // Candidate Score
  fullMark: number;
}
