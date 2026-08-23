/* =========================================================================
   AANGAN '99 — CENTRAL DATA CONTRACTS & TYPESCRIPT INTERFACES
   Production TypeScript data models for memories, media, audio, and OS states.
   ========================================================================= */

export type MemoryCategory = 
  | 'childhood' 
  | 'popculture' 
  | 'technology' 
  | 'food' 
  | 'games' 
  | 'television' 
  | 'monsoon';

export interface Memory {
  id: string;
  title: string;
  hindiTitle?: string;
  year: number;
  category: MemoryCategory;
  description: string;
  image?: string;
  audio?: string;
  color: string;
  relatedMemories: string[];
  tags: string[];
  location?: string;
  sensoryNote?: string;
}

export interface PlaylistTrack {
  id: string;
  title: string;
  artistOrSource: string;
  year: number;
  duration: string;
  side: 'A' | 'B';
  genre: string;
  themeColor: string;
  vibeDescription: string;
  synthMelodyKey: 'doordarshan' | 'milesur' | 'malgudi' | 'junglebook' | 'indipop' | 'shaktimaan' | 'powercut' | 'gully';
}

export interface YearData {
  year: number;
  headline: string;
  hindiTagline: string;
  atmosphere: string;
  milestones: string[];
  pricePoints: { item: string; cost: string }[];
  colorTheme: string;
}

export interface CassetteTrack {
  id: string;
  title: string;
  hindiTitle?: string;
  artistOrSource: string;
  duration: string;
  side: 'A' | 'B';
  themeColor?: string;
  tag: string;
  vibeDescription: string;
  synthMelodyKey: 'doordarshan' | 'milesur' | 'malgudi' | 'junglebook' | 'indipop' | 'shaktimaan' | 'powercut' | 'gully';
}

export interface TrumpCard {
  id: string;
  name: string;
  category: 'cricket' | 'wwf';
  subtitle: string;
  image?: string;
  rank: number;
  stats: {
    battingOrPower: number;
    matchesOrWeight: number;
    centuriesOrTitles: number;
    staminaOrStrikeRate: number;
  };
  signatureMoveOrShot: string;
  flavorText: string;
}

export interface SlamBookEntry {
  id: string;
  name: string;
  nickname: string;
  year: string;
  city: string;
  favoriteCartoon: string;
  oneRupeeCandy: string;
  year2000DreamCareer: string;
  bestMemory: string;
  penColor: 'blue' | 'pink' | 'purple' | 'green' | 'gold';
  timestamp: number;
  doodleEmoji: string;
}

export interface MemoryTelegramData {
  sender: string;
  locationStamp: string;
  headline: string;
  postcardBody: string;
  psNote: string;
  ambientSoundscape: string;
}

export interface CRTChannel {
  id: number;
  name: string;
  showTitle: string;
  yearRange: string;
  quote: string;
  staticFrequency: number; // tuning dial position 0-100
  imageSnippet: string;
  broadcastAudioKey: 'doordarshan' | 'malgudi' | 'shaktimaan' | 'junglebook' | 'milesur' | 'indipop' | 'powercut' | 'gully';
  description: string;
}

export interface AmbientLayerConfig {
  id: string;
  name: string;
  hindiName: string;
  iconName: string;
  defaultVolume: number;
  description: string;
}
