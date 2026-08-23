/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — MEMORY SYSTEM DATA
   Binds childhood memory capsules to verified YouTube tracks and vice versa.
   ========================================================================= */

import { MEMORY_EXPLORER_ITEMS, MemoryItem } from './memoryExplorerData.ts';
import { YOUTUBE_CURATED_TRACKS } from './youtubeTracks.ts';
import { VerifiedTrack } from '../music/youtube/youtubeTypes.ts';

export const MEMORIES = MEMORY_EXPLORER_ITEMS;

/**
 * Find verified tracks associated with a specific memory ID
 */
export function getTracksForMemory(memoryId: string): VerifiedTrack[] {
  return YOUTUBE_CURATED_TRACKS.filter((track) =>
    track.memories.includes(memoryId)
  );
}

/**
 * Find memories associated with a specific track ID
 */
export function getMemoriesForTrack(trackId: string): MemoryItem[] {
  const track = YOUTUBE_CURATED_TRACKS.find((t) => t.id === trackId);
  if (!track || !track.memories) return [];

  return MEMORIES.filter((mem) => track.memories.includes(mem.id));
}

/**
 * Discovery search for "FIND A MEMORY":
 * Searches verified catalog first, returns matching memories & tracks.
 */
export function searchMemoriesAndTracks(query: string): {
  memories: MemoryItem[];
  tracks: VerifiedTrack[];
} {
  const q = query.trim().toLowerCase();
  if (!q) {
    return { memories: [], tracks: [] };
  }

  const matchedMemories = MEMORIES.filter(
    (mem) =>
      mem.title.toLowerCase().includes(q) ||
      mem.hindiTitle.toLowerCase().includes(q) ||
      mem.emotionalDescription.toLowerCase().includes(q) ||
      mem.tags.some((t) => t.toLowerCase().includes(q))
  );

  const matchedTracks = YOUTUBE_CURATED_TRACKS.filter(
    (tr) =>
      tr.title.toLowerCase().includes(q) ||
      tr.artist.toLowerCase().includes(q) ||
      tr.storyNote?.toLowerCase().includes(q) ||
      tr.moods.some((m) => m.toLowerCase().includes(q))
  );

  return { memories: matchedMemories, tracks: matchedTracks };
}
