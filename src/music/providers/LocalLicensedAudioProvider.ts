/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — LOCAL SYNTH AUDIO PROVIDER
   Procedural 90s Web Audio API soundchip synthesizer for real retro audio.
   ========================================================================= */

import { BaseProvider } from './BaseProvider.ts';
import { ProviderType, NostalgiaTrack, NostalgiaPlaylist } from '../types.ts';
import { audioSynthesizer } from '../../utils/audioSynthesizer.ts';

export class LocalLicensedAudioProvider extends BaseProvider {
  public type: ProviderType = 'local-synth';
  public name = 'Nostalgia Soundchip Synthesizer';
  public description = 'Authentic 90s Web Audio API soundchip synthesizer producing real procedural chiptunes.';

  private timer: number | null = null;

  public async initialize(): Promise<void> {
    this.setState('READY');
  }

  public async search(query: string): Promise<NostalgiaTrack[]> {
    return [];
  }

  public async loadTrack(track: NostalgiaTrack): Promise<void> {
    this.currentTrack = track;
    this.currentTimeSeconds = 0;
    this.durationSeconds = track.durationSeconds || 120;
    this.setState('READY');
  }

  public async loadPlaylist(playlist: NostalgiaPlaylist, tracks: NostalgiaTrack[]): Promise<void> {
    if (tracks.length > 0) {
      await this.loadTrack(tracks[0]);
    }
  }

  public async play(): Promise<void> {
    if (!this.currentTrack) {
      this.setState('ERROR', 'No synth track selected.');
      return;
    }

    this.setState('PLAYING');

    // Trigger real Web Audio API melody oscillator
    const melodyKey = this.currentTrack.synthMelodyKey || 'indipop';
    audioSynthesizer.playMelody(melodyKey);

    // Start timer for progress updates
    this.stopTimer();
    const duration = this.durationSeconds || 120;

    this.timer = window.setInterval(() => {
      this.currentTimeSeconds += 1;
      if (this.currentTimeSeconds >= duration) {
        this.currentTimeSeconds = 0;
        this.setState('ENDED');
        this.stopTimer();
      } else {
        this.updateProgress(this.currentTimeSeconds, duration);
      }
    }, 1000);
  }

  public async pause(): Promise<void> {
    audioSynthesizer.stopMelody();
    this.stopTimer();
    this.setState('PAUSED');
  }

  public async next(): Promise<void> {}

  public async previous(): Promise<void> {}

  public seek(seconds: number): void {
    this.currentTimeSeconds = Math.max(0, Math.min(this.durationSeconds, seconds));
    this.updateProgress(this.currentTimeSeconds);
  }

  public setVolume(volume: number): void {
    this.volume = volume;
    this.notifyStateChange();
  }

  public setMute(mute: boolean): void {
    this.isMuted = mute;
    if (mute) {
      audioSynthesizer.stopMelody();
    } else if (this.state === 'PLAYING' && this.currentTrack) {
      audioSynthesizer.playMelody(this.currentTrack.synthMelodyKey || 'indipop');
    }
    this.notifyStateChange();
  }

  private stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public destroy(): void {
    audioSynthesizer.stopMelody();
    this.stopTimer();
    this.setState('IDLE');
  }
}
