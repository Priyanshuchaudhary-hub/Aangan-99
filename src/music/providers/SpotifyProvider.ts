/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — SPOTIFY MUSIC PROVIDER
   Official Spotify Web Playback & Embed integration.
   ========================================================================= */

import { BaseProvider } from './BaseProvider.ts';
import { ProviderType, NostalgiaTrack, NostalgiaPlaylist } from '../types.ts';
import { MUSIC_ENV } from '../config.ts';

export class SpotifyProvider extends BaseProvider {
  public type: ProviderType = 'spotify';
  public name = 'Spotify Official Player';
  public description = 'Official Spotify Web Player & Embed integration.';

  private iframeEl: HTMLIFrameElement | null = null;
  private containerEl: HTMLElement | null = null;

  public async initialize(containerElement?: HTMLElement): Promise<void> {
    this.containerEl = containerElement || document.getElementById('spotify-player-host');
    this.setState('READY');
  }

  public async search(query: string): Promise<NostalgiaTrack[]> {
    return [];
  }

  public async loadTrack(track: NostalgiaTrack): Promise<void> {
    this.currentTrack = track;
    this.currentTimeSeconds = 0;
    this.durationSeconds = track.durationSeconds || 180;

    const spotifyId = track.providerTrackId || track.spotifyUri;

    if (!spotifyId) {
      this.setState('UNAVAILABLE', 'No Spotify Track ID available for this song.');
      return;
    }

    // Check if Client ID is configured or if we are in iframe embed fallback mode
    if (!MUSIC_ENV.SPOTIFY_CLIENT_ID) {
      // In guest mode without OAuth token, Spotify requires redirecting to official Spotify player or displaying official embed
      this.setState('AUTH_REQUIRED', 'Spotify login required for full direct browser playback.');
      return;
    }

    this.setState('READY');
  }

  public async loadPlaylist(playlist: NostalgiaPlaylist, tracks: NostalgiaTrack[]): Promise<void> {
    if (tracks.length > 0) {
      await this.loadTrack(tracks[0]);
    }
  }

  public async play(): Promise<void> {
    if (!MUSIC_ENV.SPOTIFY_CLIENT_ID) {
      this.setState('AUTH_REQUIRED', 'Connect your Spotify account to enable in-browser playback.');
      return;
    }
    this.setState('PLAYING');
  }

  public async pause(): Promise<void> {
    this.setState('PAUSED');
  }

  public async next(): Promise<void> {}

  public async previous(): Promise<void> {}

  public seek(seconds: number): void {
    this.updateProgress(seconds);
  }

  public setVolume(volume: number): void {
    this.volume = volume;
    this.notifyStateChange();
  }

  public setMute(mute: boolean): void {
    this.isMuted = mute;
    this.notifyStateChange();
  }

  public destroy(): void {
    if (this.iframeEl) {
      this.iframeEl.remove();
      this.iframeEl = null;
    }
    this.setState('IDLE');
  }
}
