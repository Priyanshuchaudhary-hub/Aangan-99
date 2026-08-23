/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — USE TRACK VISUAL HOOK
   React hook providing real-time YouTube visual synchronization with image
   preloading, caching, race condition rejection, and fallback lifecycle.
   ========================================================================= */

import { useState, useEffect, useRef } from 'react';
import { NostalgiaTrack } from '../types/music.ts';
import {
  extractYouTubeVideoId,
  getTrackThumbnailCandidates,
  getCachedTrackThumbnail,
  setCachedTrackThumbnail
} from '../utils/trackVisual.ts';

export type VisualStatus = 'loading' | 'loaded' | 'error';

export interface UseTrackVisualResult {
  visualUrl: string | null;
  status: VisualStatus;
  videoId: string | null;
  isLoading: boolean;
}

export function useTrackVisual(track: NostalgiaTrack | null | undefined): UseTrackVisualResult {
  const videoId = extractYouTubeVideoId(track);
  const trackKey = videoId || track?.id || (track ? `${track.title}:${track.artist}` : 'no-track');

  // Check cache synchronously for initial state
  const cachedUrl = trackKey !== 'no-track' ? getCachedTrackThumbnail(trackKey) : null;

  const [visualUrl, setVisualUrl] = useState<string | null>(cachedUrl);
  const [status, setStatus] = useState<VisualStatus>(cachedUrl ? 'loaded' : 'loading');

  const activeTokenRef = useRef<number>(0);

  useEffect(() => {
    if (!track) {
      setVisualUrl(null);
      setStatus('error');
      return;
    }

    const currentKey = videoId || track.id || `${track.title}:${track.artist}`;

    // 1. If already cached, apply immediately
    const cached = getCachedTrackThumbnail(currentKey);
    if (cached) {
      setVisualUrl(cached);
      setStatus('loaded');
      return;
    }

    // 2. Clear stale visual and enter LOADING state for clean CRT transition
    setVisualUrl(null);
    setStatus('loading');

    const currentToken = ++activeTokenRef.current;
    const candidates = getTrackThumbnailCandidates(track);

    if (candidates.length === 0) {
      setStatus('error');
      return;
    }

    let isResolved = false;

    // Helper to sequentially probe candidates until one successfully loads
    const probeCandidates = async (index: number) => {
      if (index >= candidates.length) {
        if (!isResolved && activeTokenRef.current === currentToken) {
          setStatus('error');
        }
        return;
      }

      const candidateUrl = candidates[index];
      const img = new Image();

      img.onload = () => {
        // YouTube sometimes returns a 120x90 blank/gray placeholder for missing maxresdefault
        // If image is too small and more candidates exist, try the next candidate
        if (img.naturalWidth <= 120 && index < candidates.length - 1 && candidateUrl.includes('maxresdefault')) {
          probeCandidates(index + 1);
          return;
        }

        if (activeTokenRef.current === currentToken) {
          isResolved = true;
          setCachedTrackThumbnail(currentKey, candidateUrl);
          if (videoId) {
            setCachedTrackThumbnail(videoId, candidateUrl);
          }
          setVisualUrl(candidateUrl);
          setStatus('loaded');
        }
      };

      img.onerror = () => {
        if (activeTokenRef.current === currentToken) {
          probeCandidates(index + 1);
        }
      };

      img.src = candidateUrl;
    };

    probeCandidates(0);

    return () => {
      // Invalidate on track change
      activeTokenRef.current++;
    };
  }, [track?.id, track?.youtubeId, track?.providerTrackId, track?.artwork, videoId]);

  return {
    visualUrl,
    status,
    videoId,
    isLoading: status === 'loading'
  };
}
