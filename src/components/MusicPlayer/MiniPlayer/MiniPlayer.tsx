/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — PERSISTENT MINI PLAYER
   Analog Cassette Walkman mini player bar for bottom-screen or floating display.
   ========================================================================= */

import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, CassetteTape, Radio } from 'lucide-react';
import { VerifiedTrack, PlaybackState } from '../../../music/youtube/youtubeTypes.ts';

interface MiniPlayerProps {
  currentTrack: VerifiedTrack | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onOpenFullPlayer: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  currentTrack,
  playbackState,
  currentTime,
  duration,
  volume,
  isMuted,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onOpenFullPlayer
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isPlaying = playbackState === 'playing';
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-3 right-3 z-50 max-w-md w-full bg-slate-900/95 text-amber-100 border-2 border-amber-600/60 rounded-xl shadow-2xl backdrop-blur-md p-3 font-mono border-t-amber-500/80">
      <div className="flex items-center justify-between gap-2 mb-2">
        <div 
          onClick={onOpenFullPlayer}
          className="flex items-center gap-2 cursor-pointer group hover:text-amber-300 transition-colors"
        >
          <div className="p-1.5 bg-amber-950/80 border border-amber-700/50 rounded-lg group-hover:border-amber-400">
            <CassetteTape className={`w-4 h-4 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} />
          </div>
          <div>
            <div className="text-[10px] tracking-widest text-amber-500 uppercase flex items-center gap-1 font-bold">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              NOSTALGIA RADIO MINI
            </div>
            <div className="text-xs font-bold truncate max-w-[200px] text-amber-100">
              {currentTrack ? currentTrack.title : 'No Track Loaded'}
            </div>
          </div>
        </div>

        <button
          onClick={onOpenFullPlayer}
          className="p-1.5 bg-amber-900/40 hover:bg-amber-800/60 border border-amber-700/60 rounded-lg text-amber-300 transition"
          title="Open Full Nostalgia Radio"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1 mb-2">
        <div className="relative w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-amber-900/50 cursor-pointer"
             onClick={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const clickX = e.clientX - rect.left;
               const newPct = clickX / rect.width;
               onSeek(newPct * duration);
             }}
        >
          <div 
            className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-amber-400/80 font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{currentTrack ? currentTrack.artist : 'Select Song'}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-1 border-t border-amber-900/40">
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevious}
            className="p-1.5 hover:bg-amber-900/40 rounded text-amber-300 transition"
            title="Previous Track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={onPlayPause}
            className="p-2 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded-lg font-bold shadow transition flex items-center justify-center"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={onNext}
            className="p-1.5 hover:bg-amber-900/40 rounded text-amber-300 transition"
            title="Next Track"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume */}
        <div className="relative flex items-center gap-2">
          {showVolumeSlider && (
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(Number(e.target.value))}
              className="w-16 h-1 accent-amber-500 bg-slate-950 rounded cursor-pointer"
            />
          )}
          <button
            onClick={() => setShowVolumeSlider(!showVolumeSlider)}
            onDoubleClick={onToggleMute}
            className="p-1.5 hover:bg-amber-900/40 rounded text-amber-400 transition"
            title="Volume / Double Click Mute"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
