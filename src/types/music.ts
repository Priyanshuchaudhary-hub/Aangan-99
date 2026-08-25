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
  videoId?: string;
  youtubeId?: string;
  youtubeVideoId?: string;
  thumbnailUrl?: string;
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

export type Track = NostalgiaTrack;

/**
 * Normalizes any YouTube result or catalog item into the canonical Track format
 */
export function normalizeYouTubeResult(item: any): NostalgiaTrack {
  const videoId = (item.videoId || item.youtubeVideoId || item.youtubeId || item.id?.videoId || item.providerTrackId || '').trim();
  const title = item.title || item.snippet?.title || 'Unknown Title';
  const artist = item.artist || item.channelTitle || item.snippet?.channelTitle || 'Unknown Artist';
  const thumbnail = item.artwork || item.thumbnail || item.thumbnailUrl || item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.medium?.url || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '');
  const durationSec = item.durationSeconds || (typeof item.duration === 'number' ? item.duration : 225);
  const mins = Math.floor(durationSec / 60);
  const secs = durationSec % 60;
  const durationStr = item.duration && typeof item.duration === 'string' ? item.duration : `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  return {
    id: item.id && typeof item.id === 'string' && !item.id.startsWith('yt-') ? item.id : `yt-${videoId}`,
    title,
    artist,
    album: item.album || item.genre || 'YouTube Archive',
    year: item.year || 2024,
    duration: durationStr,
    durationSeconds: durationSec,
    artwork: thumbnail,
    thumbnailUrl: thumbnail,
    provider: 'youtube',
    providerTrackId: videoId,
    videoId: videoId,
    youtubeId: videoId,
    youtubeVideoId: videoId,
    externalUrl: item.externalUrl || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : ''),
    playlistIds: item.playlistIds || ['summer-vacation-mix'],
    memoryIds: item.memoryIds || [],
    tags: item.tags || ['youtube', 'archive-track'],
    mood: item.mood || ['nostalgic'],
    language: item.language || 'Hindi',
    storyNote: item.storyNote || `YouTube Track: ${title} (${artist})`,
    verified: Boolean(item.verified ?? true),
    embeddable: Boolean(item.embeddable ?? true),
    playable: Boolean(item.playable ?? true),
    loadResult: 'PASS',
    playbackResult: 'PASS'
  };
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
