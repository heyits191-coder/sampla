import React from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export type UserRole = 'NORMAL_USER' | 'POWER_CANDIDATE' | 'INTERNAL_ADMIN' | 'FOUNDER_ADMIN';

export type UserPlan = 'Free' | 'Pro' | 'Placement Prep';

export interface NavItem {
  label: string;
  href: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  highlight?: boolean;
  cta: string;
}

export interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface InterviewReportData {
  verdict: 'Strongly Recommended' | 'Recommended' | 'Borderline' | 'Not Recommended';
  summary: string;
  scores: { label: string; value: number; comment: string }[];
  strengths: string[];
  weaknesses: string[];
  behavioral: {
    eyeContact: string;
    tone: string;
    energy: string;
  };
  integrity?: {
    score: number; // 0-100
    flags: string[]; // e.g., "Focus Lost", "Camera Disabled", "Scripted Answers"
    status: 'Clean' | 'Compromised' | 'Terminated';
  };
  simulationOutcome: string;
  meta: {
    date: string;
    role: string;
    type: string;
    duration: string;
  };
}

export type TokenStatus = 'UNUSED' | 'ACTIVE' | 'USED' | 'EXPIRED';

export interface FriendToken {
  token: string;           // The 6-char alphanumeric code
  creatorId: string;       // ID of the candidate who created it
  interviewId: string;     // Context ID
  createdAt: number;       // Timestamp
  expiresAt: number;       // Timestamp (30 mins after creation)
  status: TokenStatus;     // Lifecycle state
}

// --- ADMIN TYPES ---

export interface AdminPaymentRecord {
  id: string;
  userId: string;
  userEmail: string;
  plan: UserPlan;
  amount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  method: 'UPI' | 'CARD' | 'NET_BANKING';
  date: string;
  razorpayPaymentId?: string; // For auditing
  razorpayOrderId?: string;
}

export interface AdminUserRecord {
  id: string;
  email: string;
  plan: UserPlan;
  totalInterviews: number;
  lastActive: string;
  role: UserRole;
  status: 'ACTIVE' | 'BLOCKED';
}

export interface AdminAbuseFlag {
  id: string;
  interviewId: string;
  candidateName: string;
  violationType: 'EYE_CONTACT' | 'CAMERA_OFF' | 'TAB_SWITCH' | 'FRIEND_INTEGRITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  actionTaken: string;
  timestamp: string;
}

export interface AdminInterviewSummary {
  id: string;
  candidateName: string;
  role: string;
  mode: 'AI' | 'FRIEND';
  verdict: string;
  score: number;
  terminatedEarly: boolean;
  date: string;
  flags: number;
}

// --- WEBHOOK TYPES ---

export interface RazorpayWebhookPayload {
  entity: string;
  account_id: string;
  event: string;
  contains: string[];
  payload: {
    payment: {
      entity: {
        id: string;
        entity: string;
        amount: number;
        currency: string;
        status: string;
        order_id: string;
        method: string;
        email: string;
        contact: string;
        notes: {
          plan_type: string;
          app_source: string;
        };
        created_at: number;
      };
    };
  };
  created_at: number;
}