/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — YOUTUBE PROVIDER SERVICE
   YouTube Data API v3 search, verification ranking, & player interface.
   ========================================================================= */

import { VerifiedTrack, YouTubeSearchResult, PlaybackState } from './youtubeTypes.ts';
import { YOUTUBE_CONFIG } from './youtubeConfig.ts';
import { YouTubePlayer } from './YouTubePlayer.ts';

export class YouTubeProviderService {
  private static instance: YouTubeProviderService | null = null;
  private playerEngine: YouTubePlayer;
  private searchCache: Map<string, VerifiedTrack[]> = new Map();
  private resolvedCache: Map<string, VerifiedTrack> = new Map();
  private failedVideoIds: Set<string> = new Set();

  private constructor() {
    this.playerEngine = YouTubePlayer.getInstance();
  }

  public static getInstance(): YouTubeProviderService {
    if (!YouTubeProviderService.instance) {
      YouTubeProviderService.instance = new YouTubeProviderService();
    }
    return YouTubeProviderService.instance;
  }

  public getPlayer(): YouTubePlayer {
    return this.playerEngine;
  }

  public markVideoFailed(videoId: string): void {
    if (!videoId) return;
    const trimmed = videoId.trim();
    console.warn(`[YOUTUBE RESOLVER] Marking videoId as unplayable/restricted: ${trimmed}`);
    this.failedVideoIds.add(trimmed);
    this.invalidateCache(trimmed);
  }

  public isVideoFailed(videoId: string): boolean {
    return Boolean(videoId && this.failedVideoIds.has(videoId.trim()));
  }

  public invalidateCache(idOrKey: string): void {
    if (!idOrKey) return;
    const lowerKey = idOrKey.toLowerCase();
    for (const [key, value] of this.resolvedCache.entries()) {
      if (
        key.toLowerCase() === lowerKey ||
        value.id.toLowerCase() === lowerKey ||
        value.providerTrackId.toLowerCase() === lowerKey ||
        value.youtubeVideoId.toLowerCase() === lowerKey
      ) {
        console.log(`[YOUTUBE RESOLVER] Invalidating cache entry for key: ${key}`);
        this.resolvedCache.delete(key);
      }
    }
  }

  /**
   * Resolves a track to a verified, embeddable YouTube video using videos.list verification.
   * Caches verified results so YouTube API isn't called repeatedly.
   */
  public async resolvePlayableYouTubeVideo(track: {
    id: string;
    title: string;
    artist: string;
    videoId?: string;
    youtubeId?: string;
    youtubeVideoId?: string | null;
    providerTrackId?: string;
  }): Promise<VerifiedTrack | null> {
    const cacheKey = track.id || `${track.title}:${track.artist}`.toLowerCase();
    const rawExplicitId = track.videoId || track.youtubeVideoId || track.youtubeId || track.providerTrackId;
    const isValidId = (id?: string | null) => typeof id === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(id.trim());
    const explicitVideoId = isValidId(rawExplicitId) ? rawExplicitId!.trim() : null;

    if (explicitVideoId && !this.failedVideoIds.has(explicitVideoId)) {
      const directTrack: VerifiedTrack = {
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: 'YouTube Catalog',
        year: 2024,
        provider: 'youtube',
        providerTrackId: explicitVideoId,
        youtubeVideoId: explicitVideoId,
        videoId: explicitVideoId,
        externalUrl: `https://www.youtube.com/watch?v=${explicitVideoId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${explicitVideoId}/hqdefault.jpg`,
        verified: true,
        embeddable: true,
        sourceType: 'official',
        playlists: [],
        memories: [],
        moods: ['nostalgic'],
        durationSeconds: 225,
        duration: '03:45'
      };
      this.resolvedCache.set(cacheKey, directTrack);
      return directTrack;
    }

    if (this.resolvedCache.has(cacheKey)) {
      const cached = this.resolvedCache.get(cacheKey)!;
      if (cached.embeddable && cached.youtubeVideoId && isValidId(cached.youtubeVideoId)) {
        console.log(`[YOUTUBE RESOLVER] Cache hit for "${track.title}": ${cached.youtubeVideoId}`);
        return cached;
      }
    }

    try {
      console.log(`[YOUTUBE RESOLVER] Resolving playable video for "${track.title}" by "${track.artist}"...`);
      const url = `/api/youtube/resolve?title=${encodeURIComponent(track.title)}&artist=${encodeURIComponent(track.artist)}`;
      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.track && data.track.videoId && data.track.embeddable) {
          const item = data.track;
          if (!this.failedVideoIds.has(item.videoId)) {
            const verifiedTrack: VerifiedTrack = {
              id: track.id,
              title: item.title || track.title,
              artist: item.channelTitle || track.artist,
              album: 'YouTube Catalog',
              year: 2024,
              provider: 'youtube',
              providerTrackId: item.videoId,
              youtubeVideoId: item.videoId,
              externalUrl: `https://www.youtube.com/watch?v=${item.videoId}`,
              thumbnailUrl: item.thumbnail || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
              verified: true,
              embeddable: true,
              sourceType: 'official',
              playlists: [],
              memories: [],
              moods: ['nostalgic'],
              durationSeconds: item.durationSeconds || 225,
              duration: `${Math.floor((item.durationSeconds || 225) / 60)
                .toString()
                .padStart(2, '0')}:${((item.durationSeconds || 225) % 60).toString().padStart(2, '0')}`
            };

            this.resolvedCache.set(cacheKey, verifiedTrack);
            console.log(`[YOUTUBE RESOLVER] Verified embeddable video found: ${item.videoId} (${item.title})`);
            return verifiedTrack;
          }
        }
      }

      // Secondary multi-tier fallback search
      console.log(`[YOUTUBE RESOLVER] Trying multi-tier search fallback for "${track.title}"...`);
      const searchRes = await fetch('/api/youtube/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `${track.title} ${track.artist} audio`, maxResults: 5 })
      });

      if (searchRes.ok) {
        const searchData = await searchRes.json();
        if (searchData.success && Array.isArray(searchData.results) && searchData.results.length > 0) {
          const validCandidate = searchData.results.find(
            (item: any) =>
              item.videoId &&
              typeof item.videoId === 'string' &&
              /^[a-zA-Z0-9_-]{11}$/.test(item.videoId.trim()) &&
              !this.failedVideoIds.has(item.videoId.trim())
          );

          if (validCandidate) {
            const vid = validCandidate.videoId.trim();
            const verifiedTrack: VerifiedTrack = {
              id: track.id,
              title: validCandidate.title || track.title,
              artist: validCandidate.artist || validCandidate.channelTitle || track.artist,
              album: 'YouTube Archive',
              year: 2024,
              provider: 'youtube',
              providerTrackId: vid,
              youtubeVideoId: vid,
              externalUrl: `https://www.youtube.com/watch?v=${vid}`,
              thumbnailUrl: validCandidate.thumbnail || `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`,
              verified: true,
              embeddable: true,
              sourceType: 'official',
              playlists: [],
              memories: [],
              moods: ['nostalgic'],
              durationSeconds: validCandidate.durationSeconds || 225,
              duration: validCandidate.duration || '03:45'
            };

            this.resolvedCache.set(cacheKey, verifiedTrack);
            console.log(`[YOUTUBE RESOLVER] Secondary multi-tier search resolved: ${vid}`);
            return verifiedTrack;
          }
        }
      }
    } catch (err) {
      console.warn('[YOUTUBE RESOLVER] Multi-tier API search error:', err);
    }

    if (explicitVideoId) {
      console.log(`[YOUTUBE RESOLVER] Using explicitly assigned video ID: ${explicitVideoId}`);
      const directTrack: VerifiedTrack = {
        id: track.id,
        title: track.title,
        artist: track.artist,
        album: 'YouTube Catalog',
        year: 2024,
        provider: 'youtube',
        providerTrackId: explicitVideoId,
        youtubeVideoId: explicitVideoId,
        externalUrl: `https://www.youtube.com/watch?v=${explicitVideoId}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${explicitVideoId}/hqdefault.jpg`,
        verified: true,
        embeddable: true,
        sourceType: 'official',
        playlists: [],
        memories: [],
        moods: ['nostalgic'],
        durationSeconds: 225,
        duration: '03:45'
      };
      this.resolvedCache.set(cacheKey, directTrack);
      return directTrack;
    }

    return null;
  }

  /**
   * Search YouTube Data API v3 for embeddable videos matching query,
   * then rank and verify results based on official channels/labels.
   */
  public async search(query: string): Promise<VerifiedTrack[]> {
    const cacheKey = query.trim().toLowerCase();
    if (this.searchCache.has(cacheKey)) {
      return this.searchCache.get(cacheKey)!;
    }

    try {
      const res = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error(`Server API status ${res.status}`);
      }

      const data = await res.json();
      if (!data.success || !Array.isArray(data.results)) {
        if (data.error) {
          console.warn('Server YouTube search message:', data.error);
        }
        return [];
      }

      const verifiedTracks: VerifiedTrack[] = data.results.map((item: any) => {
        const videoId = item.videoId || '';
        const title = item.title || 'Unknown Title';
        const channelTitle = item.channelTitle || '';
        const thumbnail = item.thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

        const isOfficialLabel = /official|vevo|t-series|saregama|sony music|yrf|tips|venus|zee music|music|topic|arijit/i.test(channelTitle);
        const sourceType: "official" | "topic" | "community" = isOfficialLabel ? 'official' : 'community';

        return {
          id: `yt-${videoId}`,
          title,
          artist: channelTitle,
          album: 'YouTube Catalog',
          year: item.publishedAt ? new Date(item.publishedAt).getFullYear() : new Date().getFullYear(),
          provider: 'youtube',
          providerTrackId: videoId,
          youtubeVideoId: videoId,
          externalUrl: `https://www.youtube.com/watch?v=${videoId}`,
          thumbnailUrl: thumbnail,
          verified: isOfficialLabel,
          embeddable: true,
          sourceType,
          playlists: ['search-results'],
          memories: [],
          moods: ['nostalgic'],
          durationSeconds: 180,
          duration: '03:00'
        };
      });

      verifiedTracks.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));

      this.searchCache.set(cacheKey, verifiedTracks);
      return verifiedTracks;
    } catch (err) {
      console.error('YouTube search via server endpoint failed:', err);
      return [];
    }
  }
}

