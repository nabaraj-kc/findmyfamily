import { ALL_DISTRICTS } from '@/constants';

export type CaseStatus = 'missing' | 'safe' | 'injured' | 'deceased' | 'reunited' | 'resolved';

export interface MockCase {
  id: string | number;
  caseId: string;
  type?: 'missing' | 'found';
  status: CaseStatus;
  fullName: string;
  nickname?: string;
  age: number;
  gender: string;
  districtId: number;
  lastKnownLocation: string;
  dateStr: string;
  features?: string;
  clothing?: string;
  photoUrl?: string;
  reporterName?: string;
  reporterPhone?: string;
  relationship?: string;
  trustTier: 'official' | 'volunteer' | 'community';
}

export const mockCases: MockCase[] = [
  {
    id: '1',
    caseId: 'MP-2026-9482',
    type: 'missing',
    status: 'missing',
    fullName: 'Aarav Sharma',
    age: 8,
    gender: 'male',
    districtId: 1,
    lastKnownLocation: 'Near Syabrubesi suspension bridge during the initial flood wave.',
    dateStr: '2026-08-25',
    features: 'Has a small scar above the left eyebrow.',
    clothing: 'Red t-shirt, blue jeans, no shoes.',
    photoUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
    trustTier: 'official'
  },
  {
    id: '2',
    caseId: 'MP-2026-4821',
    type: 'missing',
    status: 'missing',
    fullName: 'Sita Tamang',
    age: 62,
    gender: 'female',
    districtId: 1,
    lastKnownLocation: 'Dhunche lower market area.',
    dateStr: '2026-08-26',
    features: 'Wears traditional gold earrings, speaks limited English.',
    clothing: 'Green kurta, dark shawl.',
    trustTier: 'volunteer'
  },
  {
    id: '3',
    caseId: 'FP-2026-1193',
    type: 'found',
    status: 'safe',
    fullName: 'Nima Lama',
    age: 35,
    gender: 'male',
    districtId: 2,
    lastKnownLocation: 'Trishuli hospital relief camp.',
    dateStr: '2026-08-26',
    features: 'Tattoo of a mandala on right forearm.',
    clothing: 'Grey jacket.',
    photoUrl: 'https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=400&q=80',
    trustTier: 'community'
  },
  {
    id: '4',
    caseId: 'FP-2026-8842',
    type: 'found',
    status: 'injured',
    fullName: 'Unknown Boy',
    age: 12,
    gender: 'male',
    districtId: 1,
    lastKnownLocation: 'Rescued near Bhote Koshi banks, currently at Rasuwa District Hospital.',
    dateStr: '2026-08-26',
    clothing: 'Yellow raincoat, torn blue pants.',
    trustTier: 'official'
  },
  {
    id: '5',
    caseId: 'MP-2026-5512',
    type: 'missing',
    status: 'missing',
    fullName: 'Bikash Thapa',
    age: 28,
    gender: 'male',
    districtId: 3,
    lastKnownLocation: 'Traveling from Dhading Besi towards Rasuwa.',
    dateStr: '2026-08-25',
    features: 'Carrying a large black trekking backpack.',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    trustTier: 'community'
  },
  {
    id: '6',
    caseId: 'FP-2026-0001',
    type: 'found',
    status: 'deceased',
    fullName: 'Unknown Woman',
    age: 45,
    gender: 'female',
    districtId: 1,
    lastKnownLocation: 'Recovered downstream near Kalikasthan.',
    dateStr: '2026-08-26',
    trustTier: 'official'
  },
  {
    id: '7',
    caseId: 'MP-2026-9999',
    type: 'missing',
    status: 'missing',
    fullName: 'Ramesh Magar',
    age: 22,
    gender: 'male',
    districtId: 4,
    lastKnownLocation: 'Gorkha Bazaar',
    dateStr: '2026-08-25',
    features: 'Scar on left cheek, wearing a distinctive red jacket.',
    clothing: 'red jacket',
    trustTier: 'community'
  },
  {
    id: '8',
    caseId: 'FP-2026-9998',
    type: 'found',
    status: 'injured',
    fullName: 'Unknown Male',
    age: 23,
    gender: 'male',
    districtId: 4,
    lastKnownLocation: 'Gorkha Hospital',
    dateStr: '2026-08-26',
    features: 'Unconscious, scar on left cheek.',
    clothing: 'torn red jacket',
    trustTier: 'official'
  }
];

export function getDistrictName(id: number, locale: 'en' | 'ne' = 'en'): string {
  const district = ALL_DISTRICTS.find(d => d.id === id);
  if (!district) return 'Unknown';
  return locale === 'en' ? district.nameEn : district.nameNe;
}

export function getPublicCases(): MockCase[] {
  return mockCases.filter(c => c.status !== 'deceased');
}

export function getCaseById(id: string): MockCase | undefined {
  return mockCases.find(c => c.caseId === id);
}
