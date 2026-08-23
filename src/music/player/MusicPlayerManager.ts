/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — MUSIC PLAYER MANAGER
   Central coordinator managing active provider, queue, shuffle, & repeat modes.
   ========================================================================= */

import {
  IMusicProvider,
  ProviderType,
  NostalgiaTrack,
  NostalgiaPlaylist,
  ProviderState,
  PlaybackState,
  StateChangeCallback
} from '../types.ts';
import { YouTubeProvider } from '../providers/YouTubeProvider.ts';
import { SpotifyProvider } from '../providers/SpotifyProvider.ts';
import { LicensedAudioProvider } from '../providers/LicensedAudioProvider.ts';
import { LocalLicensedAudioProvider } from '../providers/LocalLicensedAudioProvider.ts';
import { STORAGE_KEYS, MUSIC_ENV } from '../config.ts';

export type RepeatMode = 'OFF' | 'REPEAT_PLAYLIST' | 'REPEAT_TRACK';

export class MusicPlayerManager {
  private activeProvider: IMusicProvider | null = null;
  private providerMap: Map<ProviderType, IMusicProvider> = new Map();

  private queue: NostalgiaTrack[] = [];
  private originalQueue: NostalgiaTrack[] = [];
  private queueIndex: number = 0;

  private isShuffle: boolean = false;
  private repeatMode: RepeatMode = 'OFF';

  private listeners: Set<StateChangeCallback> = new Set();
  private unsubscribeCurrentProvider: (() => void) | null = null;

  constructor() {
    this.providerMap.set('youtube', new YouTubeProvider());
    this.providerMap.set('spotify', new SpotifyProvider());
    this.providerMap.set('licensed', new LicensedAudioProvider());
    this.providerMap.set('local-synth', new LocalLicensedAudioProvider());
  }

  public async initialize(defaultType?: ProviderType, containerElement?: HTMLElement): Promise<void> {
    const savedProvider = (localStorage.getItem(STORAGE_KEYS.ACTIVE_PROVIDER) as ProviderType) || defaultType || MUSIC_ENV.DEFAULT_PROVIDER;
    await this.switchProvider(savedProvider, containerElement);
  }

  public async switchProvider(type: ProviderType, containerElement?: HTMLElement): Promise<void> {
    if (this.unsubscribeCurrentProvider) {
      this.unsubscribeCurrentProvider();
      this.unsubscribeCurrentProvider = null;
    }

    const currentTrack = this.getCurrentTrack();

    if (this.activeProvider) {
      this.activeProvider.destroy();
    }

    const newProvider = this.providerMap.get(type) || this.providerMap.get('youtube')!;
    this.activeProvider = newProvider;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROVIDER, type);

    await this.activeProvider.initialize(containerElement);

    this.unsubscribeCurrentProvider = this.activeProvider.onStateChange((state) => {
      this.handleProviderStateChange(state);
    });

    if (currentTrack) {
      await this.activeProvider.loadTrack(currentTrack);
    }
  }

  private handleProviderStateChange(state: ProviderState) {
    // If track ended, handle auto advance
    if (state.state === 'ENDED') {
      this.handleTrackEnded();
    }
    this.notifyListeners(state);
  }

  private handleTrackEnded() {
    if (this.repeatMode === 'REPEAT_TRACK') {
      if (this.activeProvider) {
        this.activeProvider.seek(0);
        this.activeProvider.play();
      }
      return;
    }

    if (this.queue.length === 0) return;

    if (this.queueIndex < this.queue.length - 1) {
      this.next();
    } else if (this.repeatMode === 'REPEAT_PLAYLIST') {
      this.queueIndex = 0;
      this.playTrack(this.queue[0]);
    }
  }

  public getActiveProvider(): IMusicProvider | null {
    return this.activeProvider;
  }

  public getActiveProviderType(): ProviderType {
    return this.activeProvider?.type || 'youtube';
  }

  public setQueue(tracks: NostalgiaTrack[], initialIndex: number = 0) {
    this.originalQueue = [...tracks];
    this.queue = this.isShuffle ? this.shuffleArray([...tracks]) : [...tracks];
    this.queueIndex = Math.max(0, Math.min(this.queue.length - 1, initialIndex));
  }

  public getQueue(): NostalgiaTrack[] {
    return this.queue;
  }

  public getQueueIndex(): number {
    return this.queueIndex;
  }

  public async playTrack(track: NostalgiaTrack, playlist?: NostalgiaPlaylist): Promise<void> {
    if (!this.activeProvider) return;

    // Update queue index if track is in queue
    const idx = this.queue.findIndex((t) => t.id === track.id);
    if (idx >= 0) {
      this.queueIndex = idx;
    } else {
      this.queue = [track, ...this.queue];
      this.queueIndex = 0;
    }

    await this.activeProvider.loadTrack(track);
    await this.activeProvider.play();
  }

  public async togglePlayPause(): Promise<void> {
    if (!this.activeProvider) return;
    const curState = this.activeProvider.getPlaybackState();

    if (curState === 'PLAYING') {
      await this.activeProvider.pause();
    } else {
      await this.activeProvider.play();
    }
  }

  public async next(): Promise<void> {
    if (this.queue.length === 0) return;

    if (this.repeatMode === 'REPEAT_TRACK') {
      if (this.activeProvider) {
        this.activeProvider.seek(0);
        await this.activeProvider.play();
      }
      return;
    }

    if (this.queueIndex < this.queue.length - 1) {
      this.queueIndex += 1;
    } else if (this.repeatMode === 'REPEAT_PLAYLIST') {
      this.queueIndex = 0;
    } else {
      return;
    }

    const nextTrack = this.queue[this.queueIndex];
    if (nextTrack) {
      await this.playTrack(nextTrack);
    }
  }

  public async previous(): Promise<void> {
    if (this.queue.length === 0) return;

    if (this.queueIndex > 0) {
      this.queueIndex -= 1;
    } else {
      this.queueIndex = this.queue.length - 1;
    }

    const prevTrack = this.queue[this.queueIndex];
    if (prevTrack) {
      await this.playTrack(prevTrack);
    }
  }

  public toggleShuffle(): boolean {
    this.isShuffle = !this.isShuffle;
    const curTrack = this.getCurrentTrack();

    if (this.isShuffle) {
      this.queue = this.shuffleArray([...this.originalQueue]);
      if (curTrack) {
        const newIdx = this.queue.findIndex((t) => t.id === curTrack.id);
        if (newIdx >= 0) this.queueIndex = newIdx;
      }
    } else {
      this.queue = [...this.originalQueue];
      if (curTrack) {
        const newIdx = this.queue.findIndex((t) => t.id === curTrack.id);
        if (newIdx >= 0) this.queueIndex = newIdx;
      }
    }

    return this.isShuffle;
  }

  public toggleRepeat(): RepeatMode {
    if (this.repeatMode === 'OFF') {
      this.repeatMode = 'REPEAT_PLAYLIST';
    } else if (this.repeatMode === 'REPEAT_PLAYLIST') {
      this.repeatMode = 'REPEAT_TRACK';
    } else {
      this.repeatMode = 'OFF';
    }
    return this.repeatMode;
  }

  public getRepeatMode(): RepeatMode {
    return this.repeatMode;
  }

  public getIsShuffle(): boolean {
    return this.isShuffle;
  }

  public seek(seconds: number): void {
    if (this.activeProvider) {
      this.activeProvider.seek(seconds);
    }
  }

  public setVolume(volume: number): void {
    if (this.activeProvider) {
      this.activeProvider.setVolume(volume);
    }
  }

  public setMute(mute: boolean): void {
    if (this.activeProvider) {
      this.activeProvider.setMute(mute);
    }
  }

  public getCurrentTrack(): NostalgiaTrack | null {
    return this.activeProvider?.getCurrentTrack() || null;
  }

  public getPlaybackState(): PlaybackState {
    return this.activeProvider?.getPlaybackState() || 'IDLE';
  }

  public onStateChange(callback: StateChangeCallback): () => void {
    this.listeners.add(callback);
    if (this.activeProvider) {
      callback(this.activeProvider['getProviderState']());
    }
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notifyListeners(state: ProviderState) {
    this.listeners.forEach((cb) => {
      try {
        cb(state);
      } catch (e) {
        console.error('Error notifying MusicPlayerManager listener:', e);
      }
    });
  }

  private shuffleArray<T>(arr: T[]): T[] {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  public destroy(): void {
    if (this.activeProvider) {
      this.activeProvider.destroy();
      this.activeProvider = null;
    }
    this.listeners.clear();
  }
}

export const musicPlayerManager = new MusicPlayerManager();
