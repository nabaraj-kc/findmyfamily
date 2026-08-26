export interface EmergencyHotline {
  nameKey: string;
  number: string;
  description?: string;
}

export const EMERGENCY_HOTLINES: EmergencyHotline[] = [
  { nameKey: 'emergency.police', number: '100' },
  { nameKey: 'emergency.ambulance', number: '102' },
  { nameKey: 'emergency.redCross', number: '1130' },
  { nameKey: 'emergency.disaster', number: '1234' },
  { nameKey: 'emergency.armedPolice', number: '1114' },
];
