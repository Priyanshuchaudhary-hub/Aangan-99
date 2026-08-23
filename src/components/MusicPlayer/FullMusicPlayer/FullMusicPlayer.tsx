/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — FULL MUSIC PLAYER
   Official Nostalgia Radio modal featuring CRT YouTube Player & Cassette Controls.
   ========================================================================= */

import React, { useState } from 'react';
import { 
  X, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, 
  Volume2, VolumeX, ExternalLink, BookOpen, ListMusic, Tv, Radio, Sparkles, Disc
} from 'lucide-react';
import { VerifiedTrack, PlaybackState, RepeatMode } from '../../../music/youtube/youtubeTypes.ts';
import { useTrackVisual } from '../../../hooks/useTrackVisual.ts';

interface FullMusicPlayerProps {
  currentTrack: VerifiedTrack | null;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  currentPlaylistName?: string;
  errorMessage?: string | null;
  onClose: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (seconds: number) => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleShuffle: () => void;
  onToggleRepeat: () => void;
  onOpenQueue: () => void;
  onOpenMemory: (memoryId: string) => void;
}

export const FullMusicPlayer: React.FC<FullMusicPlayerProps> = ({
  currentTrack,
  playbackState,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  repeatMode,
  currentPlaylistName = 'SUMMER VACATION MIX',
  errorMessage,
  onClose,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onToggleShuffle,
  onToggleRepeat,
  onOpenQueue,
  onOpenMemory
}) => {
  const [showIframeCRT, setShowIframeCRT] = useState(true);
  const { visualUrl } = useTrackVisual(currentTrack as any);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isPlaying = playbackState === 'playing';
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 font-mono">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-600/80 rounded-2xl shadow-2xl overflow-hidden text-amber-100 flex flex-col max-h-[90vh]">
        
        {/* Header Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-amber-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-950 border border-amber-600/50 rounded-lg">
              <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-widest text-amber-400 uppercase">
                NOSTALGIA RADIO — OFFICIAL YOUTUBE PLAYER
              </h2>
              <p className="text-[11px] text-amber-500/80">
                Playing from: <span className="text-amber-200">{currentPlaylistName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenQueue}
              className="p-2 bg-amber-950/60 hover:bg-amber-900/80 border border-amber-700/60 rounded-lg text-amber-300 text-xs flex items-center gap-1.5 transition"
              title="Toggle Queue"
            >
              <ListMusic className="w-4 h-4" />
              <span className="hidden sm:inline">QUEUE</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-red-950/60 hover:bg-red-900/80 border border-red-700/60 rounded-lg text-red-300 transition"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* CRT Player Viewport */}
          <div className="relative bg-slate-950 border-4 border-slate-800 rounded-xl p-3 shadow-inner">
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                <Tv className="w-4 h-4" />
                <span>RETRO CRT SCREEN</span>
              </div>
              <button
                onClick={() => setShowIframeCRT(!showIframeCRT)}
                className="text-[10px] text-amber-500 hover:text-amber-300 underline"
              >
                {showIframeCRT ? 'Hide Video Screen' : 'Show Video Screen'}
              </button>
            </div>

            {/* Official Audio / CRT Display */}
            <div className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-amber-900/40 ${!showIframeCRT ? 'hidden' : ''}`}>
              <div className="w-full h-full flex flex-col items-center justify-center relative bg-gradient-to-b from-[#18110b] to-[#0d0906]">
                {(visualUrl || currentTrack?.thumbnailUrl) && (
                  <img
                    src={visualUrl || currentTrack?.thumbnailUrl}
                    alt={currentTrack?.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm scale-105"
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-2 p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shadow-lg">
                    <Disc className={`w-7 h-7 text-amber-400 ${playbackState === 'playing' ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 border border-amber-500/30 text-[10px] font-mono text-amber-300">
                    <span className={`w-2 h-2 rounded-full ${playbackState === 'playing' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                    <span>YOUTUBE HI-FI AUDIO ENGINE ACTIVE</span>
                  </div>
                </div>
              </div>

              {/* CRT Scanlines Overlay Effect */}
              <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none"></div>

              {/* Error overlay */}
              {playbackState === 'unavailable' || playbackState === 'error' ? (
                <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center z-20">
                  <p className="text-red-400 font-bold text-sm mb-2 uppercase">
                    {errorMessage || 'THE SIGNAL IS LOST.'}
                  </p>
                  <p className="text-amber-300/80 text-xs mb-4 max-w-md">
                    This track restricts embedded streaming on third-party sites or is unavailable. You can play it directly on YouTube!
                  </p>
                  {currentTrack && (
                    <a
                      href={currentTrack.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition"
                    >
                      <ExternalLink className="w-4 h-4" />
                      LISTEN ON YOUTUBE
                    </a>
                  )}
                </div>
              ) : null}
            </div>

            {/* Artwork Thumbnail fallback when CRT video hidden */}
            {!showIframeCRT && currentTrack && (
              <div className="relative w-full h-48 bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center border border-amber-900/40">
                <img 
                  src={currentTrack.thumbnailUrl} 
                  alt={currentTrack.title}
                  className="w-full h-full object-cover opacity-80" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
              </div>
            )}
          </div>

          {/* Track Meta Details */}
          {currentTrack ? (
            <div className="bg-slate-950/80 border border-amber-900/60 rounded-xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-amber-200">
                    {currentTrack.title}
                  </h3>
                  <p className="text-sm text-amber-400/90 font-medium">
                    Artist: {currentTrack.artist} • Year: <span className="text-amber-300 font-bold">{currentTrack.year}</span>
                  </p>
                </div>
                
                {/* External YouTube Link & Memory Connection */}
                <div className="flex items-center gap-2">
                  {currentTrack.memories && currentTrack.memories.length > 0 && (
                    <button
                      onClick={() => onOpenMemory(currentTrack.memories[0])}
                      className="px-3 py-1.5 bg-amber-950 hover:bg-amber-900 border border-amber-700/80 text-amber-300 rounded-lg text-xs flex items-center gap-1.5 transition"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      SHOW MEMORY
                    </button>
                  )}

                  <a
                    href={currentTrack.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-red-950/80 hover:bg-red-900 border border-red-700/80 text-red-300 rounded-lg text-xs flex items-center gap-1 transition"
                    title="Open on YouTube"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {currentTrack.storyNote && (
                <p className="text-xs italic text-amber-300/80 border-t border-amber-950 pt-2">
                  "{currentTrack.storyNote}"
                </p>
              )}
            </div>
          ) : (
            <div className="p-4 bg-slate-950/60 rounded-xl text-center text-amber-500 text-sm">
              No track currently selected.
            </div>
          )}

          {/* Scrubbing & Controls */}
          <div className="space-y-4">
            {/* Progress Slider */}
            <div className="space-y-1">
              <div 
                className="relative w-full h-3 bg-slate-950 rounded-full border border-amber-800/60 overflow-hidden cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  onSeek(pct * duration);
                }}
              >
                <div 
                  className="h-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-amber-400 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Playback Button Deck */}
            <div className="flex items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleShuffle}
                  className={`p-2.5 rounded-xl border transition ${
                    isShuffle 
                      ? 'bg-amber-600 text-slate-950 border-amber-400 font-bold' 
                      : 'bg-slate-950 text-amber-400 border-amber-900/60 hover:bg-amber-950'
                  }`}
                  title={`Shuffle: ${isShuffle ? 'ON' : 'OFF'}`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                <button
                  onClick={onToggleRepeat}
                  className={`p-2.5 rounded-xl border transition ${
                    repeatMode !== 'OFF' 
                      ? 'bg-amber-600 text-slate-950 border-amber-400 font-bold' 
                      : 'bg-slate-950 text-amber-400 border-amber-900/60 hover:bg-amber-950'
                  }`}
                  title={`Repeat: ${repeatMode}`}
                >
                  <Repeat className="w-4 h-4" />
                </button>
              </div>

              {/* Main Transport */}
              <div className="flex items-center gap-3">
                <button
                  onClick={onPrevious}
                  className="p-3 bg-slate-950 hover:bg-amber-950 text-amber-300 border border-amber-800/80 rounded-xl transition"
                >
                  <SkipBack className="w-5 h-5" />
                </button>

                <button
                  onClick={onPlayPause}
                  className="p-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold rounded-2xl shadow-lg border-2 border-amber-300 transition flex items-center justify-center transform active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-current" />
                  ) : (
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  )}
                </button>

                <button
                  onClick={onNext}
                  className="p-3 bg-slate-950 hover:bg-amber-950 text-amber-300 border border-amber-800/80 rounded-xl transition"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 bg-slate-950 p-2 border border-amber-900/60 rounded-xl">
                <button
                  onClick={onToggleMute}
                  className="text-amber-400 hover:text-amber-200"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => onVolumeChange(Number(e.target.value))}
                  className="w-20 h-1.5 accent-amber-500 bg-slate-900 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-2.5 border-t border-amber-900/60 flex items-center justify-between text-[11px] text-amber-500">
          <span>Powered by official YouTube IFrame API</span>
          <span className="flex items-center gap-1 text-amber-400">
            <Sparkles className="w-3 h-3 text-amber-400" />
            SUMMER VACATION.EXE
          </span>
        </div>

      </div>
    </div>
  );
};
