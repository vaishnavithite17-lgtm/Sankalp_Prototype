export type Role = 'CITIZEN' | 'AUTHORITY';

export type Status =
  | 'REPORTED'
  | 'AI_ANALYSED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CITIZEN_VERIFIED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: string | null;
}

export interface ImpactBreakdown {
  severity: number; // 1-5
  environmentalImpact: number; // 1-5
  peopleAffected: number; // 1-5
  urgency: number; // 1-5
  communitySupport: number; // count
  impactScore: number; // 0-100
  priority: Priority;
  aiExplanation: string;
  department: string;
}

export interface IssueItem {
  id: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  imageUrl?: string | null;
  status: Status;
  department: string;
  severity: number;
  environmentalImpact: number;
  peopleAffected: number;
  urgency: number;
  communitySupport: number;
  impactScore: number;
  priority: Priority;
  aiExplanation: string;
  clusterId?: string | null;
  createdById: string;
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  supports?: { id: string; userId: string }[];
  updates?: {
    id: string;
    status: Status;
    comment: string;
    proofImageUrl?: string | null;
    createdAt: string;
    updatedBy?: { id: string; name: string; role: Role };
  }[];
  cluster?: {
    id: string;
    title: string;
    reportCount: number;
    supporterCount: number;
    priority: Priority;
    impactScore: number;
  } | null;
}

export interface ClusterItem {
  id: string;
  title: string;
  category: string;
  latitude: number;
  longitude: number;
  status: Status;
  department: string;
  reportCount: number;
  supporterCount: number;
  priority: Priority;
  impactScore: number;
  createdAt: string;
  updatedAt: string;
  issues?: IssueItem[];
}
