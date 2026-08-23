/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — QUEUE VIEW COMPONENT
   Displays upcoming tracks, current playback queue, and end-of-tape replay.
   ========================================================================= */

import React from 'react';
import { ListMusic, Play, RotateCcw, Trash2, CassetteTape } from 'lucide-react';
import { VerifiedTrack } from '../../../music/youtube/youtubeTypes.ts';

interface QueueViewProps {
  queue: VerifiedTrack[];
  currentIndex: number;
  onSelectQueueIndex: (index: number) => void;
  onClearQueue?: () => void;
  onReplayQueue: () => void;
  isTapeEnded: boolean;
}

export const QueueView: React.FC<QueueViewProps> = ({
  queue,
  currentIndex,
  onSelectQueueIndex,
  onClearQueue,
  onReplayQueue,
  isTapeEnded
}) => {
  if (isTapeEnded) {
    return (
      <div className="p-8 text-center bg-slate-950 border-2 border-amber-600/80 rounded-xl space-y-4 font-mono text-amber-200">
        <CassetteTape className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
        <h3 className="text-lg font-bold text-amber-400 tracking-widest uppercase">
          THE TAPE HAS ENDED.
        </h3>
        <p className="text-xs text-amber-300/80 max-w-sm mx-auto">
          All tracks in the current nostalgia mix have finished playing. Rewind and play again!
        </p>
        <button
          onClick={onReplayQueue}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-2 mx-auto transition"
        >
          <RotateCcw className="w-4 h-4" />
          REPLAY TAPE
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono text-amber-100">
      <div className="flex items-center justify-between pb-2 border-b border-amber-900/60">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
          <ListMusic className="w-4 h-4" />
          <span>PLAYBACK QUEUE ({queue.length} TRACKS)</span>
        </div>

        {onClearQueue && (
          <button
            onClick={onClearQueue}
            className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            CLEAR QUEUE
          </button>
        )}
      </div>

      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
        {queue.length === 0 ? (
          <div className="p-6 text-center text-amber-500 text-xs italic">
            Queue is currently empty. Select a playlist or track to populate the queue.
          </div>
        ) : (
          queue.map((track, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <div
                key={`${track.id}-${idx}`}
                onClick={() => onSelectQueueIndex(idx)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition ${
                  isCurrent
                    ? 'bg-amber-600 text-slate-950 font-bold border-amber-300 shadow-sm'
                    : 'bg-slate-900/60 border-amber-950 text-amber-200 hover:bg-amber-950/60 hover:border-amber-800'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <span className="text-[10px] w-4 opacity-80">{idx + 1}.</span>
                  <div className="truncate">
                    <div className="truncate font-semibold">{track.title}</div>
                    <div className={`text-[10px] truncate ${isCurrent ? 'text-slate-900/80' : 'text-amber-400/80'}`}>
                      {track.artist}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isCurrent && <Play className="w-3.5 h-3.5 fill-current animate-pulse" />}
                  <span className="text-[11px] font-mono">{track.duration}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
