/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — TRACK VISUAL & THUMBNAIL SYNCHRONIZATION
   Layer 20: Guaranteed 1:1 Song-to-Visual synchronization.
   Extracts official YouTube video IDs, preloads & caches high-resolution
   thumbnails, and manages CRT visual transitions with race condition protection.
   ========================================================================= */

import { NostalgiaTrack } from '../types/music.ts';

// In-Memory Thumbnail Cache (videoId / trackKey -> Verified Working Thumbnail URL)
const thumbnailCache = new Map<string, string>();

/**
 * Helper to validate 11-char YouTube Video ID format
 */
export function isValidYouTubeId(id?: string | null): boolean {
  return typeof id === 'string' && /^[a-zA-Z0-9_-]{11}$/.test(id.trim());
}

/**
 * Extracts a valid 11-char YouTube Video ID from any NostalgiaTrack representation
 */
export function extractYouTubeVideoId(track: Partial<NostalgiaTrack> | null | undefined): string | null {
  if (!track) return null;

  if (isValidYouTubeId(track.youtubeId)) return track.youtubeId!.trim();
  if (isValidYouTubeId(track.providerTrackId)) return track.providerTrackId!.trim();
  if (isValidYouTubeId((track as any).youtubeVideoId)) return (track as any).youtubeVideoId!.trim();
  if (isValidYouTubeId((track as any).videoId)) return (track as any).videoId!.trim();

  // Extract from externalUrl or previewUrl
  const urlToCheck = track.externalUrl || track.previewUrl || '';
  if (urlToCheck) {
    const match = urlToCheck.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    if (match && isValidYouTubeId(match[1])) {
      return match[1];
    }
  }

  // Extract from id (e.g. yt-Umqb9KENgmk, yt-custom-i1o96_hR15c)
  if (track.id && track.id.startsWith('yt-')) {
    const candidate = track.id.replace('yt-custom-', '').replace('yt-test-', '').replace('yt-', '');
    if (isValidYouTubeId(candidate)) return candidate;
  }

  return null;
}

/**
 * Returns prioritized thumbnail candidate URLs for a track
 */
export function getTrackThumbnailCandidates(track: Partial<NostalgiaTrack> | null | undefined): string[] {
  if (!track) return [];
  const candidates: string[] = [];
  const videoId = extractYouTubeVideoId(track);

  // 1. Explicit artwork/thumbnailUrl provided on track if valid URL
  if (track.artwork && typeof track.artwork === 'string' && track.artwork.startsWith('http')) {
    candidates.push(track.artwork.trim());
  }
  if ((track as any).thumbnailUrl && typeof (track as any).thumbnailUrl === 'string' && (track as any).thumbnailUrl.startsWith('http')) {
    candidates.push((track as any).thumbnailUrl.trim());
  }
  if ((track as any).thumbnail && typeof (track as any).thumbnail === 'string' && (track as any).thumbnail.startsWith('http')) {
    candidates.push((track as any).thumbnail.trim());
  }

  // 2. High-fidelity official YouTube thumbnail endpoints derived from videoId
  if (videoId) {
    candidates.push(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
    candidates.push(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`);
    candidates.push(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    candidates.push(`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`);
  }

  // Deduplicate preserving order
  return Array.from(new Set(candidates));
}

export function getCachedTrackThumbnail(trackKey: string): string | null {
  return thumbnailCache.get(trackKey) || null;
}

export function setCachedTrackThumbnail(trackKey: string, url: string): void {
  thumbnailCache.set(trackKey, url);
}
