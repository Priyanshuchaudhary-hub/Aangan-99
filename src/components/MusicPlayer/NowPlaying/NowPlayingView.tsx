/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — NOW PLAYING VIEW COMPONENT
   Displays active track details, memory connections, and "FIND A MEMORY" search.
   ========================================================================= */

import React, { useState } from 'react';
import { VerifiedTrack } from '../../../music/youtube/youtubeTypes.ts';
import { BookOpen, ExternalLink, Search, Sparkles, Radio } from 'lucide-react';
import { searchMemoriesAndTracks } from '../../../data/memories.ts';

interface NowPlayingViewProps {
  currentTrack: VerifiedTrack | null;
  onOpenMemory: (memoryId: string) => void;
  onSelectTrack: (track: VerifiedTrack) => void;
}

export const NowPlayingView: React.FC<NowPlayingViewProps> = ({
  currentTrack,
  onOpenMemory,
  onSelectTrack
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchResults = searchMemoriesAndTracks(searchQuery);

  return (
    <div className="space-y-6 font-mono text-amber-100">
      
      {/* Search Memory & Song ("FIND A MEMORY") */}
      <div className="bg-slate-950 p-4 border border-amber-900/60 rounded-xl space-y-3">
        <label className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
          <Search className="w-4 h-4 text-amber-500" />
          FIND A MEMORY OR SONG
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type 'rain', 'summer', 'school', 'cartoon'..."
            className="w-full bg-slate-900 border border-amber-800/80 rounded-lg px-3 py-2 text-xs text-amber-100 placeholder-amber-600 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Search Results Dropdown/Box */}
        {searchQuery.trim().length > 0 && (
          <div className="space-y-3 pt-2 border-t border-amber-900/40 max-h-48 overflow-y-auto">
            {searchResults.memories.length > 0 && (
              <div>
                <span className="text-[10px] text-amber-500 font-bold uppercase">MATCHING MEMORIES:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {searchResults.memories.map((mem) => (
                    <button
                      key={mem.id}
                      onClick={() => onOpenMemory(mem.id)}
                      className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 border border-amber-700/60 rounded text-[11px] text-amber-300 flex items-center gap-1"
                    >
                      <span>{mem.visualEmoji}</span>
                      <span>{mem.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {searchResults.tracks.length > 0 && (
              <div>
                <span className="text-[10px] text-amber-500 font-bold uppercase">MATCHING VERIFIED TRACKS:</span>
                <div className="space-y-1 mt-1">
                  {searchResults.tracks.map((tr) => (
                    <div
                      key={tr.id}
                      onClick={() => onSelectTrack(tr)}
                      className="p-1.5 bg-slate-900 hover:bg-amber-950 border border-amber-900/60 rounded text-xs cursor-pointer flex items-center justify-between"
                    >
                      <span className="font-semibold text-amber-200">{tr.title}</span>
                      <span className="text-[10px] text-amber-400">{tr.artist}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.memories.length === 0 && searchResults.tracks.length === 0 && (
              <p className="text-xs text-amber-500 italic">
                No local memories or verified tracks found for "{searchQuery}".
              </p>
            )}
          </div>
        )}
      </div>

      {/* Active Track Memory Connection Box */}
      {currentTrack ? (
        <div className="bg-slate-950/80 border-2 border-amber-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                NOW PLAYING METADATA
              </span>
            </div>
            <span className="px-2 py-0.5 bg-amber-950 border border-amber-600/80 text-amber-300 text-[10px] rounded font-bold">
              VERIFIED OFFICIAL
            </span>
          </div>

          <div>
            <h3 className="text-xl font-black text-amber-200">{currentTrack.title}</h3>
            <p className="text-xs text-amber-400 font-semibold">{currentTrack.artist} • {currentTrack.year}</p>
          </div>

          {currentTrack.storyNote && (
            <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-lg text-xs italic text-amber-300/90 leading-relaxed">
              "{currentTrack.storyNote}"
            </div>
          )}

          {/* Memory Attachment */}
          {currentTrack.memories && currentTrack.memories.length > 0 && (
            <div className="pt-2 border-t border-amber-900/50 space-y-2">
              <span className="text-[11px] text-amber-400/90 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                This song belongs to this memory:
              </span>
              <button
                onClick={() => onOpenMemory(currentTrack.memories[0])}
                className="w-full p-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <BookOpen className="w-4 h-4" />
                OPEN CONNECTED MEMORY CAPSULE
              </button>
            </div>
          )}

          {/* Official YouTube Link */}
          <div className="pt-1 flex items-center justify-between text-xs text-amber-500">
            <span>Official Video ID: <code className="text-amber-300 font-mono">{currentTrack.youtubeVideoId}</code></span>
            <a
              href={currentTrack.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 underline flex items-center gap-1 font-bold"
            >
              Open on YouTube <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center bg-slate-950 rounded-xl text-amber-500 text-xs">
          Select a song to view memory connections.
        </div>
      )}

    </div>
  );
};
