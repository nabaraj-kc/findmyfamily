export type ModerationStatus = 'pending' | 'approved' | 'rejected';
export type PostType = 'general' | 'sighting' | 'need' | 'offer' | 'update';

export interface Comment {
  id: string;
  caseId: string;
  authorName: string;
  content: string;
  moderationStatus: ModerationStatus;
  createdAt: string;
}

export interface DistrictPost {
  id: string;
  districtId: number;
  authorName: string;
  content: string;
  postType: PostType;
  moderationStatus: ModerationStatus;
  createdAt: string;
}

export interface District {
  id: number;
  nameEn: string;
  nameNe: string;
  province: string;
  isAffected: boolean;
}
