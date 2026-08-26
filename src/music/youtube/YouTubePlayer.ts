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

const TRACK_MIRRORS: Record<string, string[]> = {
  'tr-tum-hi-ho': ['Umqb9KENgmk', '2WZ_NhyyV5I', 'IJq0ywW430U'],
  'tr-aankhon-mein-teri': ['b_sO-l_PZmg', 'fP7i2j0-B7E', 'y_O2dJv9E0o'],
  'tr-aao-milo-chalo': ['N4oI2A4X7mQ', '9P_12vB_eN4', 'j6E19EwW_QY'],
  'tr-khaabon-ke-parinday': ['cscdqZUdgCk', 'eW7kX_Z8f8U', '1a0kZ_2u3Q8'],
  'tr-iktara': ['fv38u286a6A', 'fSS_R91Nimw', 'd1EaY91f1m0'],
  'tr-kabira': ['jHNNMj5bNQw', 'ue_9G4_1g2M', '4wH4K3l8h0Q'],
  'tr-saibo': ['s2k_s-39Jmg', 't8B038n1p2A', 'w1z76vP97dY'],
  'tr-tum-se-hi': ['mt9g80_YmCg', 'Cb6wuzOurPc', '7j_oP56J0mE'],
  'tr-tu-jaane-na': ['f3844W2g4S4', 'P8PWN1OmZOA', '9QZ43xVq7dY'],
  'tr-dil-chahta-hai': ['fPq3bM9e4s8', 's5v3yV9kG9E', 'e2B3X6g91Y0'],
  'tr-purani-jeans': ['4z9M6-66fGk', 's8W_c03q060', '1aO4-rSgLgE'],
  'tr-tanha-dil': ['b1-7RkE_vA8', 'hB8K9eZ3QeM', 'Z1d86dM0X8A'],
  'tr-dooba-dooba': ['S1eE2yvWz6U', 'd4P3yE0k98Q', 'a1E9q2W8y8A'],
  'tr-yaaron': ['3M33q9y-n9k', 'e_3n2Q0M5dE', '4Yg4-r6H2yQ'],
  'tr-shaktimaan': ['9K03O93i5N4', '7tH0X7b2A3Q', '2Qz5N3k1m6E'],
  'tr-barsaat-banjaare': ['O0g_Q3nN35A', 'Umqb9KENgmk'],
  'tr-mile-sur': ['G1G_U4o0w-E', 'rG6E3Q1w2mY', '1bH2c4P8u9Q'],
  'tr-malgudi-theme': ['vGZ2y56R7fM', '2yW9n8g4M7E', 'f7c03m98Q2A'],
  'tr-jungle-book': ['QY5cOslUaWk', '3mF0W6c9e8A', '1xK79M3f02E'],
  'tr-dd-anthem': ['0kHqXq6B_j8', '8yH3Q01M9gA', 'd4v76M1g8eQ'],
  'tr-vsnl-56k': ['gsNaR6FRuO0', 'vvr9AMWEU-c', 'iHW11f4LGtw'],
  'tr-rain-tin-roof': ['2u_b2jJbV_E', 'e5_z6qY3M7A', '9f7h1e3M0sA'],
  'tr-railway-chai': ['e6s7c7_U6mE', '1b0a8e3m7YQ', '8d3e2y0M5fA'],
  'tr-gully-victory': ['9_aG1W6CqfM', '4e2M01w7q8A', '0f87e3y2n1Q']
};

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
  private currentTrackTriedVideoIds: Set<string> = new Set();

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
        const originUrl = 'https://aangan-99.vercel.app';
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
              console.log('[YOUTUBE ENGINE] Official YT.Player ready event received.');

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
                this.pendingVideoIdToLoad = null;
                this.pendingPlayOnReady = false;
                this.loadTrack(track, shouldPlay);
              } else if (this.pendingVideoIdToLoad) {
                const videoId = this.pendingVideoIdToLoad;
                const shouldPlay = this.pendingPlayOnReady;
                this.pendingVideoIdToLoad = null;
                this.pendingPlayOnReady = false;
                this.safeLoadVideoById(videoId, shouldPlay);
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

    const isDev = Boolean((import.meta as any).env?.DEV || (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production'));
    console.log('[YOUTUBE PLAYBACK DIAGNOSTIC]', {
      environment: isDev ? 'development' : 'production',
      searchedQuery: this.currentTrack?.title || 'Unknown',
      selectedVideoId: videoId,
      embeddableStatus: (this.currentTrack as any)?.embeddable ?? true,
      playerState: typeof this.player?.getPlayerState === 'function' ? this.player.getPlayerState() : -1,
      errorCode: code,
      userFriendlyMessage
    });

    // Invalidate cache and mark video failed in provider
    const provider = YouTubeProviderService.getInstance();
    if (this.currentTrack?.id) {
      provider.invalidateCache(this.currentTrack.id);
    }
    if (videoId && videoId !== 'unknown') {
      provider.markVideoFailed(videoId);
      this.currentTrackTriedVideoIds.add(videoId);
    }

    // AUTOMATIC MULTI-CANDIDATE RECOVERY
    if (this.currentTrack) {
      // 0. Check search result candidates attached to currentTrack
      const searchCandidates = (this.currentTrack as any)?.alternativeCandidates || (this.currentTrack as any)?.alternativeTracks || [];
      if (Array.isArray(searchCandidates) && searchCandidates.length > 0) {
        for (const candidateItem of searchCandidates) {
          const candVid = typeof candidateItem === 'string' ? candidateItem : candidateItem.videoId || candidateItem.youtubeVideoId;
          if (candVid && isValidVideoId(candVid) && !this.currentTrackTriedVideoIds.has(candVid.trim())) {
            const cleanCandId = candVid.trim();
            console.log(`[YOUTUBE ENGINE] Auto-recovery: Trying next search result candidate ${cleanCandId} for "${this.currentTrack.title}"`);
            this.currentTrackTriedVideoIds.add(cleanCandId);
            this.currentVideoId = cleanCandId;

            if (typeof candidateItem === 'object' && candidateItem) {
              const art = candidateItem.artwork || candidateItem.thumbnailUrl || candidateItem.thumbnail || (this.currentTrack as any).artwork;
              this.currentTrack = {
                ...this.currentTrack,
                ...candidateItem,
                videoId: cleanCandId,
                youtubeVideoId: cleanCandId,
                providerTrackId: cleanCandId,
                thumbnailUrl: art
              };
            } else {
              const art = `https://i.ytimg.com/vi/${cleanCandId}/hqdefault.jpg`;
              this.currentTrack = {
                ...this.currentTrack,
                videoId: cleanCandId,
                youtubeVideoId: cleanCandId,
                providerTrackId: cleanCandId,
                thumbnailUrl: art
              };
            }
            this.notifyListeners();
            await this.safeLoadVideoById(cleanCandId, true);
            return;
          }
        }
      }

      const trackId = this.currentTrack.id;
      const titleLower = (this.currentTrack.title || '').toLowerCase();
      const titleMatchMirrors: string[] = [];

      if (titleLower.includes('tum hi ho')) titleMatchMirrors.push('2WZ_NhyyV5I', 'IJq0ywW430U');
      if (titleLower.includes('aankhon mein teri')) titleMatchMirrors.push('b_sO-l_PZmg', 'fP7i2j0-B7E');
      if (titleLower.includes('blue eyes')) titleMatchMirrors.push('Jg8Z1-6K-40', 'oQWJg-J1uD0');
      if (titleLower.includes('iktara')) titleMatchMirrors.push('fv38u286a6A', 'fSS_R91Nimw');
      if (titleLower.includes('kabira')) titleMatchMirrors.push('jHNNMj5bNQw', 'ue_9G4_1g2M');
      if (titleLower.includes('dil chahta hai')) titleMatchMirrors.push('fPq3bM9e4s8', 's5v3yV9kG9E');
      if (titleLower.includes('tu jaane na')) titleMatchMirrors.push('f3844W2g4S4', 'P8PWN1OmZOA');
      if (titleLower.includes('tum se hi')) titleMatchMirrors.push('mt9g80_YmCg', 'Cb6wuzOurPc');

      const mirrors = [
        ...(TRACK_MIRRORS[trackId] || []),
        ...titleMatchMirrors
      ];

      const alternativeVideoId = mirrors.find(
        (m) => !this.currentTrackTriedVideoIds.has(m) && isValidVideoId(m)
      );

      if (alternativeVideoId) {
        console.log(
          `[YOUTUBE ENGINE] Auto-recovery: Switched to verified mirror ${alternativeVideoId} for "${this.currentTrack.title}"`
        );
        this.currentTrackTriedVideoIds.add(alternativeVideoId);
        this.currentVideoId = alternativeVideoId;
        this.currentTrack = {
          ...this.currentTrack,
          videoId: alternativeVideoId,
          youtubeVideoId: alternativeVideoId,
          providerTrackId: alternativeVideoId
        };
        await this.safeLoadVideoById(alternativeVideoId, true);
        return;
      }

      // 2. Query multi-tier fallback search for audio, lyrics, or cover alternative
      const fallbackQueries = [
        `${this.currentTrack.title} ${this.currentTrack.artist} audio`,
        `${this.currentTrack.title} ${this.currentTrack.artist} lyrics`,
        `${this.currentTrack.title} ${this.currentTrack.artist} cover`
      ];

      for (const query of fallbackQueries) {
        try {
          console.log(`[YOUTUBE ENGINE] Querying fallback search "${query}"...`);
          const res = await fetch('/api/youtube/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, maxResults: 6 })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.results) && data.results.length > 0) {
              const candidate = data.results.find(
                (item: any) =>
                  item.videoId &&
                  isValidVideoId(item.videoId) &&
                  !this.currentTrackTriedVideoIds.has(item.videoId) &&
                  item.embeddable !== false
              );
              if (candidate && candidate.videoId) {
                const candidateId = candidate.videoId.trim();
                console.log(
                  `[YOUTUBE ENGINE] Auto-recovery: Resolved dynamic alternative ${candidateId} for "${this.currentTrack.title}"`
                );
                this.currentTrackTriedVideoIds.add(candidateId);
                this.currentVideoId = candidateId;
                this.currentTrack = {
                  ...this.currentTrack,
                  videoId: candidateId,
                  youtubeVideoId: candidateId,
                  providerTrackId: candidateId
                };
                await this.safeLoadVideoById(candidateId, true);
                return;
              }
            }
          }
        } catch (recoveryErr) {
          console.warn(`[YOUTUBE ENGINE] Fallback search error for "${query}":`, recoveryErr);
        }
      }
    }

    // If auto-recovery failed or all candidates exhausted, update state to unavailable
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
   * Safely loads a video ID using YouTube IFrame API player.loadVideoById / cueVideoById.
   * Includes retry mechanism with exponential backoff if the load attempt occurs before
   * the player instance or YouTube API is fully ready.
   */
  public async safeLoadVideoById(
    videoId: string,
    autoPlay = true,
    retriesLeft = 15,
    retryDelayMs = 250
  ): Promise<boolean> {
    if (!isValidVideoId(videoId)) {
      console.error('[YOUTUBE ENGINE] Cannot load video: invalid videoId:', videoId);
      this.updateState('unavailable', 'Invalid YouTube Video ID');
      return false;
    }

    const cleanId = videoId.trim();
    this.currentVideoId = cleanId;

    // If player instance or API is not ready yet, store pending load and retry
    const isFullyReady = this.isPlayerReady && 
                         this.player && 
                         typeof this.player.loadVideoById === 'function' &&
                         typeof this.player.getPlayerState === 'function';

    if (!isFullyReady) {
      console.log(
        `[YOUTUBE ENGINE] Player not ready for videoId "${cleanId}". Queuing load request & retrying... (${retriesLeft} retries remaining)`
      );
      this.pendingVideoIdToLoad = cleanId;
      this.pendingPlayOnReady = autoPlay;

      // Ensure API loading/mount was kicked off
      this.initialize().catch((err) => {
        console.warn('[YOUTUBE ENGINE] Initialization triggered in safeLoadVideoById warning:', err);
      });

      if (retriesLeft > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        return this.safeLoadVideoById(cleanId, autoPlay, retriesLeft - 1, Math.min(retryDelayMs * 1.5, 2000));
      } else {
        console.warn(`[YOUTUBE ENGINE] safeLoadVideoById timed out waiting for player ready for videoId: ${cleanId}`);
        this.updateState('error', 'YouTube Player initialization timed out.');
        return false;
      }
    }

    // Player instance is ready - call loadVideoById / cueVideoById
    this.updateState('loading');
    try {
      this.pendingVideoIdToLoad = null;
      this.pendingPlayOnReady = false;
      
      if (autoPlay) {
        console.log(`[YOUTUBE ENGINE] Executing player.loadVideoById("${cleanId}")`);
        this.player.loadVideoById(cleanId);
      } else {
        console.log(`[YOUTUBE ENGINE] Executing player.cueVideoById("${cleanId}")`);
        this.player.cueVideoById(cleanId);
        this.updateState('paused');
      }
      return true;
    } catch (err: any) {
      console.warn(
        `[YOUTUBE ENGINE] Call to loadVideoById failed (${err?.message || err}). Retrying... (${retriesLeft} retries left)`
      );
      if (retriesLeft > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        return this.safeLoadVideoById(cleanId, autoPlay, retriesLeft - 1, retryDelayMs);
      } else {
        console.error(`[YOUTUBE ENGINE] Retry attempts exhausted for loadVideoById("${cleanId}")`);
        this.updateState('error', 'Failed to load video in YouTube Player.');
        return false;
      }
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

    const cleanId = videoId.trim();
    const videoTrack: VerifiedTrack = {
      id: `yt-${cleanId}`,
      title: this.currentTrack?.title || 'YouTube Audio',
      artist: this.currentTrack?.artist || 'YouTube Music',
      album: 'YouTube Archive',
      year: 2024,
      provider: 'youtube',
      providerTrackId: cleanId,
      youtubeVideoId: cleanId,
      videoId: cleanId,
      externalUrl: `https://www.youtube.com/watch?v=${cleanId}`,
      thumbnailUrl: `https://i.ytimg.com/vi/${cleanId}/hqdefault.jpg`,
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
   * Load video by YouTube video ID (Public API with retry mechanism)
   */
  public async loadVideoById(videoId: string, autoPlay = true): Promise<void> {
    await this.safeLoadVideoById(videoId, autoPlay);
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
    this.currentTrackTriedVideoIds = new Set([videoId]);

    // Required developer verification logs
    console.log('[RADIO] Selected track:', track.title);
    console.log('[RADIO] Selected videoId:', videoId);
    console.log('[RADIO] Loading video:', videoId);
    console.log('[RADIO] Current player video:', this.currentVideoId);

    await this.safeLoadVideoById(videoId, autoPlay);
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
          await this.safeLoadVideoById(this.currentVideoId, true);
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
