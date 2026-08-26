import { CaseSummary } from './case';

export type MatchStatus = 'pending' | 'reviewing' | 'confirmed' | 'rejected';

export interface Match {
  id: string;
  missingCase: CaseSummary;
  foundCase: CaseSummary;
  confidenceScore: number;
  nameSimilarity?: number;
  locationProximityKm?: number;
  ageMatch: boolean;
  genderMatch: boolean;
  photoSimilarity?: number;
  status: MatchStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}
