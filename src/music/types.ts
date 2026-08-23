/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — LAYER 17 REAL MUSIC TYPES
   Strict Provider Abstraction & Real Playback State Machine
   ========================================================================= */

import { NostalgiaTrack as SharedTrack, NostalgiaPlaylist as SharedPlaylist, RadioHostMessage as SharedHostMessage } from '../types/music.ts';

export type PlaybackState =
  | 'IDLE'
  | 'LOADING'
  | 'READY'
  | 'PLAYING'
  | 'PAUSED'
  | 'BUFFERING'
  | 'ENDED'
  | 'ERROR'
  | 'UNAVAILABLE'
  | 'AUTH_REQUIRED';

export type ProviderType = 'youtube' | 'spotify' | 'licensed' | 'local-synth' | 'licensed-synth' | 'preview-url' | 'external';

export type NostalgiaTrack = SharedTrack;
export type NostalgiaPlaylist = SharedPlaylist;
export type RadioHostMessage = SharedHostMessage;

export interface ProviderState {
  state: PlaybackState;
  currentTrack: NostalgiaTrack | null;
  currentTimeSeconds: number;
  durationSeconds: number;
  volume: number;
  isMuted: boolean;
  error: string | null;
  providerType: ProviderType;
}

export type StateChangeCallback = (state: ProviderState) => void;

export interface IMusicProvider {
  type: ProviderType;
  name: string;
  description: string;

  initialize(containerElement?: HTMLElement): Promise<void>;
  search(query: string): Promise<NostalgiaTrack[]>;
  loadTrack(track: NostalgiaTrack): Promise<void>;
  loadPlaylist(playlist: NostalgiaPlaylist, tracks: NostalgiaTrack[]): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  next(): Promise<void>;
  previous(): Promise<void>;
  seek(seconds: number): void;
  setVolume(volume: number): void; // 0 to 1
  setMute(mute: boolean): void;
  getCurrentTrack(): NostalgiaTrack | null;
  getPlaybackState(): PlaybackState;
  getCurrentTime(): number;
  getDuration(): number;
  onStateChange(callback: StateChangeCallback): () => void;
  destroy(): void;
}
