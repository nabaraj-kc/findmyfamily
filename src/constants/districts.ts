import { District } from '@/types/community';

export const AFFECTED_DISTRICTS: District[] = [
  { id: 1, nameEn: 'Rasuwa', nameNe: 'रसुवा', province: 'Bagmati', isAffected: true },
  { id: 2, nameEn: 'Nuwakot', nameNe: 'नुवाकोट', province: 'Bagmati', isAffected: true },
  { id: 3, nameEn: 'Dhading', nameNe: 'धादिङ', province: 'Bagmati', isAffected: true },
  { id: 4, nameEn: 'Gorkha', nameNe: 'गोरखा', province: 'Gandaki', isAffected: true },
  { id: 5, nameEn: 'Chitwan', nameNe: 'चितवन', province: 'Bagmati', isAffected: true },
  // Adding a few more prominent ones for demo purposes. In reality, all 77 would be here.
  { id: 6, nameEn: 'Kathmandu', nameNe: 'काठमाडौं', province: 'Bagmati', isAffected: false },
  { id: 7, nameEn: 'Lalitpur', nameNe: 'ललितपुर', province: 'Bagmati', isAffected: false },
  { id: 8, nameEn: 'Bhaktapur', nameNe: 'भक्तपुर', province: 'Bagmati', isAffected: false },
  { id: 9, nameEn: 'Pokhara', nameNe: 'पोखरा', province: 'Gandaki', isAffected: false },
];

export const ALL_DISTRICTS = AFFECTED_DISTRICTS;
