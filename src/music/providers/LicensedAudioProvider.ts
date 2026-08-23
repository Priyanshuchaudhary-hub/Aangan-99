/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — LICENSED HTML5 AUDIO PROVIDER
   HTML5 Audio stream playback for licensed or public-domain MP3 files.
   ========================================================================= */

import { BaseProvider } from './BaseProvider.ts';
import { ProviderType, NostalgiaTrack, NostalgiaPlaylist } from '../types.ts';

export class LicensedAudioProvider extends BaseProvider {
  public type: ProviderType = 'licensed';
  public name = 'Licensed HTML5 Audio';
  public description = 'Standard HTML5 Audio element playing licensed MP3 audio streams.';

  private audio: HTMLAudioElement | null = null;

  public async initialize(): Promise<void> {
    if (!this.audio) {
      this.audio = new Audio();
      this.attachEventListeners();
    }
    this.setState('READY');
  }

  private attachEventListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('loadstart', () => this.setState('LOADING'));
    this.audio.addEventListener('playing', () => this.setState('PLAYING'));
    this.audio.addEventListener('pause', () => this.setState('PAUSED'));
    this.audio.addEventListener('waiting', () => this.setState('BUFFERING'));
    this.audio.addEventListener('ended', () => this.setState('ENDED'));
    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.updateProgress(this.audio.currentTime, this.audio.duration);
      }
    });
    this.audio.addEventListener('error', (e) => {
      console.warn('HTML5 Audio playback error:', e);
      this.setState('UNAVAILABLE', 'Audio file unavailable or link expired.');
    });
  }

  public async search(query: string): Promise<NostalgiaTrack[]> {
    return [];
  }

  public async loadTrack(track: NostalgiaTrack): Promise<void> {
    this.currentTrack = track;
    this.currentTimeSeconds = 0;
    this.durationSeconds = track.durationSeconds || 180;

    if (!this.audio) {
      await this.initialize();
    }

    const audioUrl = track.previewUrl || track.providerTrackId;

    if (!audioUrl || audioUrl.startsWith('synth:')) {
      this.setState('UNAVAILABLE', 'No valid HTML5 MP3 stream URL found for this track.');
      return;
    }

    this.setState('LOADING');
    this.audio!.src = audioUrl;
    this.audio!.load();
  }

  public async loadPlaylist(playlist: NostalgiaPlaylist, tracks: NostalgiaTrack[]): Promise<void> {
    if (tracks.length > 0) {
      await this.loadTrack(tracks[0]);
    }
  }

  public async play(): Promise<void> {
    if (!this.audio || !this.audio.src) {
      this.setState('ERROR', 'No track loaded in HTML5 player.');
      return;
    }

    try {
      await this.audio.play();
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        this.setState('AUTH_REQUIRED', 'Browser blocked autoplay. User interaction required.');
      } else {
        this.setState('ERROR', 'HTML5 Audio play failed.');
      }
    }
  }

  public async pause(): Promise<void> {
    if (this.audio) {
      this.audio.pause();
    }
  }

  public async next(): Promise<void> {}

  public async previous(): Promise<void> {}

  public seek(seconds: number): void {
    if (this.audio && !isNaN(seconds)) {
      this.audio.currentTime = seconds;
      this.updateProgress(seconds);
    }
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    this.notifyStateChange();
  }

  public setMute(mute: boolean): void {
    this.isMuted = mute;
    if (this.audio) {
      this.audio.muted = mute;
    }
    this.notifyStateChange();
  }

  public destroy(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    this.setState('IDLE');
  }
}
