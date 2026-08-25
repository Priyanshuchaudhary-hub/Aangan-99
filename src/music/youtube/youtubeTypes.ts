/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — YOUTUBE INTEGRATION TYPES
   Official YouTube IFrame & Data API v3 type definitions.
   ========================================================================= */

export type PlaybackState =
  | "idle"
  | "loading"
  | "playing"
  | "paused"
  | "buffering"
  | "ended"
  | "error"
  | "unavailable";

export type RepeatMode = "OFF" | "REPEAT_TRACK" | "REPEAT_PLAYLIST";

export interface VerifiedTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  year: number;
  provider: "youtube";
  providerTrackId: string;
  youtubeVideoId: string;
  videoId?: string;
  externalUrl: string;
  thumbnailUrl: string;
  verified: boolean;
  embeddable: boolean;
  sourceType: "official" | "topic" | "community";
  playlists: string[];
  memories: string[];
  moods: string[];
  durationSeconds: number;
  duration: string;
  language?: string;
  storyNote?: string;
}

export interface PlaylistData {
  id: string;
  title: string;
  description: string;
  cover: string;
  tracks: string[]; // List of track IDs
  era?: string;
  mood?: string;
}

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  publishedAt: string;
  embeddable: boolean;
  score: number;
  isOfficial: boolean;
}

export interface PlayerStatePayload {
  state: PlaybackState;
  track: VerifiedTrack | null;
  currentTime: number;
  duration: number;
  volume: number; // 0 to 100
  isMuted: boolean;
  error: string | null;
  errorCode?: number;
  errorType?: string;
}

export type PlayerStateListener = (payload: PlayerStatePayload) => void;
