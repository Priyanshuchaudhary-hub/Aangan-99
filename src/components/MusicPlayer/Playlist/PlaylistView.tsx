/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — PLAYLIST VIEW COMPONENT
   Lists curated playlists and tracks for quick selection.
   ========================================================================= */

import React from 'react';
import { Play, Disc, Music, Sparkles } from 'lucide-react';
import { PlaylistData, VerifiedTrack } from '../../../music/youtube/youtubeTypes.ts';
import { CURATED_PLAYLISTS } from '../../../data/playlists.ts';
import { YOUTUBE_CURATED_TRACKS } from '../../../data/youtubeTracks.ts';

interface PlaylistViewProps {
  currentPlaylistId?: string;
  currentTrackId?: string;
  onSelectPlaylist: (playlist: PlaylistData) => void;
  onSelectTrack: (track: VerifiedTrack) => void;
}

export const PlaylistView: React.FC<PlaylistViewProps> = ({
  currentPlaylistId,
  currentTrackId,
  onSelectPlaylist,
  onSelectTrack
}) => {
  return (
    <div className="space-y-6 font-mono text-amber-100">
      <div>
        <h3 className="text-sm font-bold tracking-widest text-amber-400 uppercase flex items-center gap-2 mb-3">
          <Disc className="w-4 h-4" />
          CURATED NOSTALGIA PLAYLISTS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {CURATED_PLAYLISTS.map((pl) => {
            const isSelected = pl.id === currentPlaylistId;
            return (
              <div
                key={pl.id}
                onClick={() => onSelectPlaylist(pl)}
                className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                  isSelected
                    ? 'bg-amber-950/80 border-amber-500 shadow-md'
                    : 'bg-slate-900/80 border-amber-900/50 hover:bg-amber-950/40 hover:border-amber-700'
                }`}
              >
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-amber-800/60 shrink-0">
                  <img src={pl.cover} alt={pl.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-4 h-4 text-amber-300 fill-current" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-amber-200 truncate">{pl.title}</h4>
                  <p className="text-[10px] text-amber-400/80 line-clamp-1">{pl.description}</p>
                  <span className="inline-block text-[9px] text-amber-500 font-bold mt-0.5">
                    {pl.tracks.length} TRACKS • {pl.era}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verified Tracks Catalog */}
      <div>
        <h3 className="text-sm font-bold tracking-widest text-amber-400 uppercase flex items-center gap-2 mb-3">
          <Music className="w-4 h-4" />
          VERIFIED 90s/2000s CATALOG
        </h3>

        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {YOUTUBE_CURATED_TRACKS.map((tr) => {
            const isPlaying = tr.id === currentTrackId;
            return (
              <div
                key={tr.id}
                onClick={() => onSelectTrack(tr)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition ${
                  isPlaying
                    ? 'bg-amber-600 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-900/60 border-amber-950 text-amber-200 hover:bg-amber-950/60 hover:border-amber-800'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="text-[10px] opacity-70 w-8">{tr.year}</span>
                  <div className="truncate">
                    <div className="truncate font-semibold">{tr.title}</div>
                    <div className={`text-[10px] truncate ${isPlaying ? 'text-slate-900/80' : 'text-amber-400/80'}`}>
                      {tr.artist}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {tr.verified && (
                    <span className="px-1.5 py-0.5 bg-amber-950/80 border border-amber-500/60 text-amber-300 text-[9px] rounded font-mono">
                      VERIFIED
                    </span>
                  )}
                  <span>{tr.duration}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
