import { Person } from './person';

export type CaseType = 'missing' | 'found';
export type CaseStatus = 'active' | 'found_safe' | 'found_injured' | 'found_deceased' | 'reunited' | 'resolved' | 'archived';
export type TrustTier = 'official' | 'volunteer' | 'community';

export interface Case {
  id: string;
  caseId: string; // MP-2026-0842
  caseType: CaseType;
  status: CaseStatus;
  person: Person;
  reporterId: string;
  lastKnownLocation?: { lat: number; lng: number };
  lastKnownLocationName?: string;
  lastKnownDistrict?: string;
  lastSeenAt?: string;
  contextDescription?: string;
  trustTier: TrustTier;
  verifiedBy?: string;
  verifiedAt?: string;
  phoneVerified: boolean;
  isPublished: boolean;
  statusHistory: CaseStatusEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface CaseStatusEntry {
  id: string;
  oldStatus?: CaseStatus;
  newStatus: CaseStatus;
  changedByName?: string;
  source: 'system' | 'official' | 'volunteer' | 'reporter';
  note?: string;
  createdAt: string;
}

export interface CaseSummary {
  id: string;
  caseId: string;
  caseType: CaseType;
  status: CaseStatus;
  personName: string;
  personPhotoUrl?: string;
  ageDisplay: string;
  gender: string;
  lastKnownLocationName?: string;
  trustTier: TrustTier;
  createdAt: string;
}
