/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — BASE MUSIC PROVIDER
   Abstract class handling event callbacks and state transitions.
   ========================================================================= */

import {
  IMusicProvider,
  ProviderType,
  PlaybackState,
  NostalgiaTrack,
  NostalgiaPlaylist,
  ProviderState,
  StateChangeCallback
} from '../types.ts';

export abstract class BaseProvider implements IMusicProvider {
  public abstract type: ProviderType;
  public abstract name: string;
  public abstract description: string;

  protected state: PlaybackState = 'IDLE';
  protected currentTrack: NostalgiaTrack | null = null;
  protected currentTimeSeconds: number = 0;
  protected durationSeconds: number = 0;
  protected volume: number = 0.8;
  protected isMuted: boolean = false;
  protected error: string | null = null;

  private listeners: Set<StateChangeCallback> = new Set();

  public abstract initialize(containerElement?: HTMLElement): Promise<void>;
  public abstract search(query: string): Promise<NostalgiaTrack[]>;
  public abstract loadTrack(track: NostalgiaTrack): Promise<void>;
  public abstract loadPlaylist(playlist: NostalgiaPlaylist, tracks: NostalgiaTrack[]): Promise<void>;
  public abstract play(): Promise<void>;
  public abstract pause(): Promise<void>;
  public abstract next(): Promise<void>;
  public abstract previous(): Promise<void>;
  public abstract seek(seconds: number): void;
  public abstract setVolume(volume: number): void;
  public abstract setMute(mute: boolean): void;
  public abstract destroy(): void;

  public getCurrentTrack(): NostalgiaTrack | null {
    return this.currentTrack;
  }

  public getPlaybackState(): PlaybackState {
    return this.state;
  }

  public getCurrentTime(): number {
    return this.currentTimeSeconds;
  }

  public getDuration(): number {
    return this.durationSeconds || (this.currentTrack?.durationSeconds || 180);
  }

  public onStateChange(callback: StateChangeCallback): () => void {
    this.listeners.add(callback);
    // Send current state immediately upon subscription
    callback(this.getProviderState());
    return () => {
      this.listeners.delete(callback);
    };
  }

  protected setState(newState: PlaybackState, errorMessage?: string) {
    this.state = newState;
    if (errorMessage) {
      this.error = errorMessage;
    } else if (newState !== 'ERROR' && newState !== 'UNAVAILABLE') {
      this.error = null;
    }
    this.notifyStateChange();
  }

  protected updateProgress(currentTime: number, duration?: number) {
    this.currentTimeSeconds = currentTime;
    if (duration && duration > 0) {
      this.durationSeconds = duration;
    }
    this.notifyStateChange();
  }

  protected getProviderState(): ProviderState {
    return {
      state: this.state,
      currentTrack: this.currentTrack,
      currentTimeSeconds: this.currentTimeSeconds,
      durationSeconds: this.getDuration(),
      volume: this.volume,
      isMuted: this.isMuted,
      error: this.error,
      providerType: this.type
    };
  }

  protected notifyStateChange() {
    const currentState = this.getProviderState();
    this.listeners.forEach((cb) => {
      try {
        cb(currentState);
      } catch (err) {
        console.error('Error in music state listener:', err);
      }
    });
  }
}
