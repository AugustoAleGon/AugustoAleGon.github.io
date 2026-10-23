export type ProjectId = 'seen' | 'luxury' | 'steadymd' | 'puramente';
export interface Project {
  id: ProjectId;
  name: string;
  monogram: string;
  period: string;
  stack: string[];
  ios: string;
  android?: string;
  website: string;
}

export const projects: Project[] = [
  {
    id: 'seen',
    name: 'Seen',
    monogram: 'S',
    period: 'Freelance',
    stack: ['React Native', 'Expo', 'Cloudflare', 'Supabase'],
    ios: 'https://apps.apple.com/us/app/seen-womens-sports-scores/id6776036448',
    website: 'https://theseen.app/',
  },
  {
    id: 'luxury',
    name: 'Luxury Presence',
    monogram: 'LP',
    period: '2022 — present',
    stack: ['React Native', 'GraphQL', 'Postgres', 'XState'],
    ios: 'https://apps.apple.com/us/app/luxury-presence/id6464844781',
    android: 'https://play.google.com/store/apps/details?id=com.luxurypresence.presencecopilot',
    website: 'https://www.luxurypresence.com/',
  },
  {
    id: 'steadymd',
    name: 'SteadyMD',
    monogram: 's',
    period: '2018 — 2022',
    stack: ['React Native', 'Node.js', 'WebSockets', 'Realm'],
    ios: 'https://apps.apple.com/us/app/lemonaid-primary-care-complete/id1141119462',
    android: 'https://play.google.com/store/apps/details?id=com.steadymd.chat',
    website: 'https://www.steadymd.com/',
  },
  {
    id: 'puramente',
    name: 'Pura Mente',
    monogram: 'p',
    period: '2020 — 2022',
    stack: ['React Native', 'Firebase', 'HealthKit', 'React'],
    ios: 'https://apps.apple.com/us/app/pura-mente-sleep-meditation/id1448598865',
    android: 'https://play.google.com/store/apps/details?id=app.puramente.app',
    website: 'https://www.puramente.app/',
  },
];
