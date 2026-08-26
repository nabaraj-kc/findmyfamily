export interface Person {
  id: string;
  fullName: string;
  nickname?: string;
  ageKnown?: number;
  ageRangeMin?: number;
  ageRangeMax?: number;
  gender: 'male' | 'female' | 'other' | 'unknown';
  heightCm?: number;
  build?: string;
  distinguishingFeatures?: string;
  clothingLastWorn?: string;
  photoUrls: string[];
  createdAt: string;
  updatedAt: string;
}
