/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — LAYER 17 MUSIC CONFIGURATION
   Centralized provider settings, API keys, and capability metadata.
   ========================================================================= */

import { ProviderType } from './types.ts';

export interface ProviderInfo {
  id: ProviderType;
  name: string;
  shortLabel: string;
  description: string;
  iconName: string;
  badgeText: string;
  features: {
    directPlayback: boolean;
    seeking: boolean;
    fullAudio: boolean;
    requiresAuth: boolean;
  };
}

export const MUSIC_PROVIDERS_CONFIG: Record<string, ProviderInfo> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube Official IFrame Player',
    shortLabel: 'YouTube',
    description: 'Official YouTube embedded audio/video player with real stream playback.',
    iconName: 'Youtube',
    badgeText: 'Official Video / Audio Stream',
    features: {
      directPlayback: true,
      seeking: true,
      fullAudio: true,
      requiresAuth: false
    }
  },
  spotify: {
    id: 'spotify',
    name: 'Spotify Official Web Player & Embed',
    shortLabel: 'Spotify',
    description: 'Official Spotify track embeds and Web Playback SDK integration.',
    iconName: 'Music',
    badgeText: 'Spotify Connect',
    features: {
      directPlayback: true,
      seeking: true,
      fullAudio: false,
      requiresAuth: true
    }
  },
  licensed: {
    id: 'licensed',
    name: 'Licensed HTML5 Audio',
    shortLabel: 'Licensed MP3',
    description: 'Direct HTML5 Audio stream rendering for licensed/public-domain MP3s.',
    iconName: 'Disc',
    badgeText: 'HTML5 Native Audio',
    features: {
      directPlayback: true,
      seeking: true,
      fullAudio: true,
      requiresAuth: false
    }
  },
  'local-synth': {
    id: 'local-synth',
    name: 'Nostalgia Soundchip Synthesizer',
    shortLabel: 'Retro Synth',
    description: 'Authentic 90s Web Audio API soundchip synthesizer reproducing Doordarshan & Indipop melodies.',
    iconName: 'Radio',
    badgeText: 'Procedural Web Audio API',
    features: {
      directPlayback: true,
      seeking: true,
      fullAudio: true,
      requiresAuth: false
    }
  },
  'licensed-synth': {
    id: 'licensed-synth',
    name: 'Nostalgia Soundchip Synthesizer',
    shortLabel: 'Retro Synth',
    description: 'Authentic 90s Web Audio API soundchip synthesizer reproducing Doordarshan & Indipop melodies.',
    iconName: 'Radio',
    badgeText: 'Procedural Web Audio API',
    features: {
      directPlayback: true,
      seeking: true,
      fullAudio: true,
      requiresAuth: false
    }
  }
};

const metaEnv = (import.meta as any).env || {};

// Retrieve environment variables safely
export const MUSIC_ENV = {
  YOUTUBE_API_KEY: metaEnv.VITE_YOUTUBE_API_KEY || '',
  SPOTIFY_CLIENT_ID: metaEnv.VITE_SPOTIFY_CLIENT_ID || '',
  DEFAULT_PROVIDER: (metaEnv.VITE_MUSIC_PROVIDER as ProviderType) || 'youtube'
};

export const STORAGE_KEYS = {
  ACTIVE_PROVIDER: 'aangan99_music_provider_v1',
  VOLUME: 'aangan99_music_volume_v1',
  MUTED: 'aangan99_music_muted_v1',
  AUTOPLAY_DISMISSED: 'aangan99_music_autoplay_dismissed_v1'
};
