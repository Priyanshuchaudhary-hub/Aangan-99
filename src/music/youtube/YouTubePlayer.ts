/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — PERSISTENT YOUTUBE IFRAME PLAYER ENGINE
   Official YouTube IFrame Player API integration & event synchronizer.
   ========================================================================= */

import { PlaybackState, VerifiedTrack, PlayerStatePayload, PlayerStateListener } from './youtubeTypes.ts';
import { YOUTUBE_CONFIG } from './youtubeConfig.ts';
import { YouTubeProviderService } from './YouTubeProvider.ts';
import { loadYouTubeIframeAPI } from './youtubeApiLoader.ts';

export function isValidVideoId(videoId?: string | null): boolean {
  if (typeof videoId !== 'string') return false;
  const trimmed = videoId.trim();
  return trimmed.length > 0 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed);
}

export class YouTubePlayer {
  private static instance: YouTubePlayer | null = null;

  private player: any = null;
  private containerElementId = 'yt-official-iframe-host';
  private targetDivId = 'yt-player-target';
  private isPlayerReady = false;
  private listeners: Set<PlayerStateListener> = new Set();

  private currentState: PlaybackState = 'idle';
  private currentTrack: VerifiedTrack | null = null;
  private currentVideoId: string = '';
  private currentTime = 0;
  private duration = 0;
  private volume = 100; // 0 to 100
  private isMuted = false;
  private lastError: string | null = null;
  private pollInterval: number | null = null;
  private pendingTrackToLoad: VerifiedTrack | null = null;
  private pendingVideoIdToLoad: string | null = null;
  private pendingPlayOnReady = false;
  private isAutoFallbackAttempted = false;

  private constructor() {
    // Singleton
  }

  public static getInstance(): YouTubePlayer {
    if (!YouTubePlayer.instance) {
      YouTubePlayer.instance = new YouTubePlayer();
    }
    return YouTubePlayer.instance;
  }

  /**
   * Initializes the official YouTube IFrame Player API script and mounts player instance.
   */
  public async initialize(customContainerId?: string | HTMLElement): Promise<void> {
    if (typeof customContainerId === 'string') {
      this.containerElementId = customContainerId;
    }

    if (this.isPlayerReady && this.player) {
      return;
    }

    if (this.player) {
      console.warn('ERROR: Duplicate YouTube player creation prevented.');
      return;
    }

    this.updateState('loading');

    try {
      await loadYouTubeIframeAPI();
      await this.mountPlayer(customContainerId);
    } catch (err: any) {
      console.warn('[YOUTUBE ENGINE] Script load warning:', err);
      this.updateState('error', 'Failed to load official YouTube IFrame player script.');
    }
  }

  private mountPlayer(customContainer?: string | HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      if (this.player) {
        console.warn('ERROR: Duplicate YouTube player creation prevented.');
        resolve();
        return;
      }

      console.log('[YOUTUBE ENGINE] Mount player requested with container:', customContainer);

      let hostEl: HTMLElement | null = null;

      if (customContainer instanceof HTMLElement) {
        hostEl = customContainer;
      } else if (typeof customContainer === 'string') {
        hostEl = document.getElementById(customContainer);
      } else {
        hostEl = document.getElementById(this.containerElementId);
      }

      if (!hostEl) {
        hostEl = document.getElementById('yt-official-iframe-host');
      }

      if (!hostEl) {
        // Fallback create container
        hostEl = document.createElement('div');
        hostEl.id = this.containerElementId;
        document.body.appendChild(hostEl);
      }

      // Ensure target element inside host
      hostEl.innerHTML = `<div id="${this.targetDivId}"></div>`;

      // Clean up previous instance if any
      if (this.player && typeof this.player.destroy === 'function') {
        try {
          this.player.destroy();
        } catch (e) {
          // ignore
        }
        this.player = null;
      }

      try {
        const originUrl = typeof window !== 'undefined' ? window.location.origin : '';
        const rawInitialId = this.pendingTrackToLoad?.youtubeVideoId || this.currentTrack?.youtubeVideoId;
        const isValidId = typeof rawInitialId === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(rawInitialId);
        const initialVideoId = isValidId ? rawInitialId : 'Umqb9KENgmk';

        this.player = new window.YT.Player(this.targetDivId, {
          height: '100%',
          width: '100%',
          videoId: initialVideoId,
          host: 'https://www.youtube.com',
          playerVars: {
            ...YOUTUBE_CONFIG.DEFAULT_PLAYER_VARS,
            origin: originUrl,
            playsinline: 1,
            enablejsapi: 1,
            rel: 0,
            autoplay: 0
          },
          events: {
            onReady: (event: any) => {
              this.isPlayerReady = true;
              console.log('[YOUTUBE ENGINE] Official YT.Player ready.');

              if (this.player && typeof this.player.getIframe === 'function') {
                const iframe = this.player.getIframe();
                if (iframe) {
                  iframe.setAttribute('allow', 'autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                  iframe.setAttribute('allowfullscreen', 'true');
                  iframe.setAttribute('title', 'Nostalgia Radio Embedded YouTube Player');
                }
              }

              this.updateState('idle');

              if (this.player && typeof this.player.setVolume === 'function') {
                this.player.setVolume(this.volume);
              }

              if (this.pendingTrackToLoad) {
                const track = this.pendingTrackToLoad;
                const shouldPlay = this.pendingPlayOnReady;
                this.pendingTrackToLoad = null;
                this.pendingPlayOnReady = false;
                this.loadTrack(track, shouldPlay);
              } else if (this.pendingPlayOnReady) {
                this.pendingPlayOnReady = false;
                this.playVideo();
              }

              resolve();
            },
            onStateChange: (event: any) => this.handleStateChange(event),
            onError: (event: any) => this.handleError(event)
          }
        });
      } catch (err) {
        console.error('[YOUTUBE ENGINE] Error constructing YT.Player:', err);
        this.updateState('error', 'Failed to construct YouTube Player instance.');
        resolve();
      }
    });
  }

  private handleStateChange(event: any) {
    const code = event.data;

    switch (code) {
      case window.YT.PlayerState.PLAYING: // 1
        console.log('[YOUTUBE ENGINE] State: PLAYING (1)');
        this.updateState('playing');
        this.startProgressPolling();
        break;

      case window.YT.PlayerState.PAUSED: // 2
        console.log('[YOUTUBE ENGINE] State: PAUSED (2)');
        this.updateState('paused');
        this.stopProgressPolling();
        break;

      case window.YT.PlayerState.BUFFERING: // 3
        console.log('[YOUTUBE ENGINE] State: BUFFERING (3)');
        this.updateState('buffering');
        break;

      case window.YT.PlayerState.ENDED: // 0
        console.log('[YOUTUBE ENGINE] State: ENDED (0)');
        this.updateState('ended');
        this.stopProgressPolling();
        break;

      case window.YT.PlayerState.CUED: // 5
        console.log('[YOUTUBE ENGINE] State: CUED (5)');
        this.updateState('paused');
        break;

      case window.YT.PlayerState.UNSTARTED: // -1
        console.log('[YOUTUBE ENGINE] State: UNSTARTED (-1)');
        this.updateState('idle');
        break;

      default:
        break;
    }
  }

  private async handleError(event: any) {
    this.stopProgressPolling();
    const code = event.data;
    const videoId = this.currentVideoId || this.currentTrack?.youtubeVideoId || 'unknown';

    console.warn('[YOUTUBE ENGINE onError]', {
      videoId,
      errorCode: code,
      title: this.currentTrack?.title,
      artist: this.currentTrack?.artist
    });

    let mappedErrorType = 'UNKNOWN_ERROR';
    let userFriendlyMessage = 'Unable to play this video.';

    if (code === 101 || code === 150) {
      mappedErrorType = 'VIDEO_NOT_EMBEDDABLE';
      userFriendlyMessage = 'EMBEDDING RESTRICTED: Copyright owner restricts in-site streaming for this specific video.';
    } else if (code === 2 || code === 100) {
      mappedErrorType = 'VIDEO_UNAVAILABLE';
      userFriendlyMessage = 'VIDEO NOT FOUND: The requested video does not exist or was removed.';
    } else if (code === 5) {
      mappedErrorType = 'PLAYER_ERROR';
      userFriendlyMessage = 'HTML5 PLAYER ERROR: The requested content cannot be played in HTML5 player.';
    }

    // Invalidate cache for this video
    const provider = YouTubeProviderService.getInstance();
    if (this.currentTrack?.id) {
      provider.invalidateCache(this.currentTrack.id);
    }
    if (videoId && videoId !== 'unknown') {
      provider.invalidateCache(videoId);
    }

    // Do NOT replace with Tum Hi Ho! Display clear error so user can retry or click next.
    this.updateState('unavailable', userFriendlyMessage, code, mappedErrorType);
  }

  private startProgressPolling() {
    this.stopProgressPolling();
    this.pollInterval = window.setInterval(() => {
      if (this.player && typeof this.player.getCurrentTime === 'function') {
        this.currentTime = this.player.getCurrentTime() || 0;
        this.duration = this.player.getDuration() || 0;
        this.notifyListeners();
      }
    }, 500);
  }

  private stopProgressPolling() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  /**
   * Load video by raw YouTube video ID directly
   */
  public async loadVideo(videoId: string, autoPlay = true): Promise<void> {
    if (!isValidVideoId(videoId)) {
      console.error('[RADIO] Cannot play track: missing or invalid YouTube videoId:', videoId);
      this.updateState('unavailable', 'This track has no playable YouTube video.');
      return;
    }

    const videoTrack: VerifiedTrack = {
      id: `yt-${videoId}`,
      title: this.currentTrack?.title || 'YouTube Audio',
      artist: this.currentTrack?.artist || 'YouTube Music',
      album: 'YouTube Archive',
      year: 2024,
      provider: 'youtube',
      providerTrackId: videoId,
      youtubeVideoId: videoId,
      videoId: videoId,
      externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      verified: true,
      embeddable: true,
      sourceType: 'official',
      playlists: [],
      memories: [],
      moods: ['nostalgic'],
      durationSeconds: 240,
      duration: '04:00'
    };

    await this.loadTrack(videoTrack, autoPlay);
  }

  /**
   * Load video by YouTube video ID (alias)
   */
  public async loadVideoById(videoId: string): Promise<void> {
    await this.loadVideo(videoId, true);
  }

  /**
   * Triggers the embedded YouTube player to load a verified test video ID
   */
  public async testYouTubePlayback(videoId: string = 'Umqb9KENgmk'): Promise<void> {
    const testTrack: VerifiedTrack = {
      id: `yt-test-${videoId}`,
      title: 'Tum Hi Ho (Official Video)',
      artist: 'Arijit Singh & Mithoon',
      album: 'Verified Test Track',
      year: 2013,
      provider: 'youtube',
      providerTrackId: videoId,
      youtubeVideoId: videoId,
      videoId: videoId,
      externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      verified: true,
      embeddable: true,
      sourceType: 'official',
      playlists: [],
      memories: [],
      moods: ['nostalgic'],
      durationSeconds: 262,
      duration: '04:22'
    };

    console.log('[YOUTUBE ENGINE] "Test YouTube Playback" triggered for videoId:', videoId);
    await this.loadTrack(testTrack, true);
  }

  /**
   * Load track by YouTube video ID
   */
  public async loadTrack(track: VerifiedTrack, autoPlay = true): Promise<void> {
    const rawVideoId = track.videoId || track.youtubeVideoId || track.providerTrackId;

    if (!isValidVideoId(rawVideoId)) {
      console.error('[RADIO] Cannot play track: missing or invalid YouTube videoId:', track);
      this.updateState('unavailable', 'This track has no playable YouTube video.');
      return;
    }

    const videoId = rawVideoId.trim();

    this.currentVideoId = videoId;
    this.currentTrack = {
      ...track,
      videoId,
      youtubeVideoId: videoId,
      providerTrackId: videoId
    };
    this.currentTime = 0;
    this.duration = track.durationSeconds || 180;
    this.lastError = null;
    this.isAutoFallbackAttempted = false;

    // Required developer verification logs
    console.log('[RADIO] Selected track:', track.title);
    console.log('[RADIO] Selected videoId:', videoId);
    console.log('[RADIO] Loading video:', videoId);
    console.log('[RADIO] Current player video:', this.currentVideoId);

    if (!this.isPlayerReady || !this.player || typeof this.player.loadVideoById !== 'function') {
      this.pendingTrackToLoad = this.currentTrack;
      this.pendingVideoIdToLoad = videoId;
      this.pendingPlayOnReady = autoPlay;
      this.initialize();
      return;
    }

    this.updateState('loading');

    try {
      if (autoPlay) {
        this.player.loadVideoById(videoId);
      } else {
        this.player.cueVideoById(videoId);
        this.updateState('paused');
      }
    } catch (err: any) {
      console.error('[YOUTUBE ENGINE] Error loading video ID:', err);
      this.updateState('error', 'Failed to load video ID in YouTube Player.');
    }
  }

  /**
   * Play official video
   */
  public async playVideo(): Promise<void> {
    if (!this.isPlayerReady || !this.player || typeof this.player.playVideo !== 'function') {
      this.pendingPlayOnReady = true;
      this.initialize();
      return;
    }

    try {
      if (this.currentVideoId && isValidVideoId(this.currentVideoId)) {
        const state = typeof this.player.getPlayerState === 'function' ? this.player.getPlayerState() : -1;
        // If unstarted (-1), cued (5), or ended (0), ensure loadVideoById is invoked for currentVideoId
        if (state === -1 || state === 5 || state === 0) {
          this.player.loadVideoById(this.currentVideoId);
        } else {
          this.player.playVideo();
        }
      } else {
        this.player.playVideo();
      }
    } catch (err: any) {
      console.warn('[YOUTUBE ENGINE] playVideo call error or restricted:', err);
      this.updateState('paused');
    }
  }

  /**
   * Play (alias for standard player interface)
   */
  public async play(): Promise<void> {
    await this.playVideo();
  }

  /**
   * Pause official video
   */
  public pauseVideo(): void {
    if (this.player && typeof this.player.pauseVideo === 'function') {
      this.player.pauseVideo();
    }
  }

  /**
   * Pause (alias for standard player interface)
   */
  public pause(): void {
    this.pauseVideo();
  }

  /**
   * Seek to seconds
   */
  public seekTo(seconds: number): void {
    if (this.player && typeof this.player.seekTo === 'function') {
      this.player.seekTo(seconds, true);
      this.currentTime = seconds;
      this.notifyListeners();
    }
  }

  public getCurrentVideoId(): string {
    return this.currentVideoId;
  }

  public getCurrentTrack(): VerifiedTrack | null {
    return this.currentTrack;
  }

  /**
   * Set volume (0 to 100)
   */
  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(100, vol));
    if (this.player && typeof this.player.setVolume === 'function') {
      this.player.setVolume(this.volume);
    }
    this.notifyListeners();
  }

  /**
   * Mute
   */
  public mute(): void {
    this.isMuted = true;
    if (this.player && typeof this.player.mute === 'function') {
      this.player.mute();
    }
    this.notifyListeners();
  }

  /**
   * Unmute
   */
  public unMute(): void {
    this.isMuted = false;
    if (this.player && typeof this.player.unMute === 'function') {
      this.player.unMute();
    }
    this.notifyListeners();
  }

  public getCurrentTime(): number {
    return this.currentTime;
  }

  public getDuration(): number {
    return this.duration;
  }

  public getPlayerState(): PlaybackState {
    return this.currentState;
  }

  public subscribe(listener: PlayerStateListener): () => void {
    this.listeners.add(listener);
    listener(this.getPayload());

    return () => {
      this.listeners.delete(listener);
    };
  }

  private updateState(newState: PlaybackState, errorMsg?: string, errorCode?: number, errorType?: string) {
    this.currentState = newState;
    if (errorMsg) this.lastError = errorMsg;
    this.notifyListeners(errorCode, errorType);
  }

  private getPayload(errorCode?: number, errorType?: string): PlayerStatePayload {
    return {
      state: this.currentState,
      track: this.currentTrack,
      currentTime: this.currentTime,
      duration: this.duration,
      volume: this.volume,
      isMuted: this.isMuted,
      error: this.lastError,
      errorCode,
      errorType
    };
  }

  private notifyListeners(errorCode?: number, errorType?: string) {
    const payload = this.getPayload(errorCode, errorType);
    this.listeners.forEach((listener) => listener(payload));
  }

  public destroy(): void {
    this.stopProgressPolling();
    if (this.player && typeof this.player.destroy === 'function') {
      try {
        this.player.destroy();
      } catch (e) {
        // ignore
      }
    }
    this.player = null;
    this.isPlayerReady = false;
    this.currentState = 'idle';
  }
}
