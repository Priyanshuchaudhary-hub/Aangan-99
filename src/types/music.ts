/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — MUSIC & PLAYLIST SYSTEM TYPES
   ========================================================================= */

export type MusicProviderType = 'licensed-synth' | 'local-synth' | 'youtube' | 'spotify' | 'licensed' | 'preview-url' | 'external';

export type NostalgiaLanguage = 'Hindi' | 'English' | 'Punjabi' | 'Tamil' | 'Telugu' | 'Bengali' | 'Marathi';

export type NostalgiaMood =
  | 'morning'
  | 'energetic'
  | 'happy'
  | 'carefree'
  | 'sunny'
  | 'melancholic'
  | 'peaceful'
  | 'nostalgic'
  | 'dreamy'
  | 'romantic'
  | 'classic'
  | 'travel'
  | 'childhood'
  | 'late-night'
  | 'radio'
  | 'emotional'
  | 'rainy';

export interface NostalgiaTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  duration: string;
  durationSeconds: number;
  artwork: string;
  provider: MusicProviderType;
  providerTrackId: string;
  youtubeId?: string;
  spotifyUri?: string;
  previewUrl?: string;
  externalUrl: string;
  embedUrl?: string;
  playlistIds: string[];
  memoryIds: string[];
  tags: string[];
  mood: NostalgiaMood[];
  language: NostalgiaLanguage;
  synthMelodyKey?: 'doordarshan' | 'milesur' | 'malgudi' | 'junglebook' | 'indipop' | 'shaktimaan' | 'powercut' | 'gully';
  soundscapePreset?: string;
  storyNote?: string;
  verified?: boolean;
  embeddable?: boolean;
  playable?: boolean;
  loadResult?: 'PASS' | 'FAIL' | 'PENDING' | string;
  playbackResult?: 'PASS' | 'FAIL' | 'PENDING' | string;
  verificationMessage?: string;
}

export interface NostalgiaPlaylist {
  id: string;
  title: string;
  hindiTitle?: string;
  description: string;
  coverImage: string;
  era: string;
  mood: string;
  category: string;
  trackIds: string[];
  memoryIds?: string[];
  relatedMemoryIds?: string[];
  themeColor?: string;
}

export interface RadioHostMessage {
  id: string;
  hostName: string;
  quote: string;
  yearContext: string | number;
  suggestedTrackId?: string;
  suggestedMemoryId?: string;
}
