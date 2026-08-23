/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — RETRO CRT VISUALIZER
   Layer 20: Verified Song-Specific YouTube Visual & CRT Audio Display.
   Guarantees 1:1 Song-to-Visual synchronization with scanline overlay,
   spinning vinyl hub, and LED audio meters.
   ========================================================================= */

import React from 'react';
import { Disc, Radio, Loader2 } from 'lucide-react';
import { NostalgiaTrack } from '../types/music.ts';
import { useTrackVisual } from '../hooks/useTrackVisual.ts';

interface RetroCRTVisualizerProps {
  track: NostalgiaTrack | null | undefined;
  isPlaying: boolean;
  isLoading?: boolean;
  isUnavailable?: boolean;
  className?: string;
  showBadges?: boolean;
}

export const RetroCRTVisualizer: React.FC<RetroCRTVisualizerProps> = ({
  track,
  isPlaying,
  isLoading = false,
  isUnavailable = false,
  className = 'w-full h-36',
  showBadges = true
}) => {
  const { visualUrl, status, videoId } = useTrackVisual(track);

  const isTuning = isLoading || status === 'loading';

  return (
    <div
      className={`relative bg-black rounded border border-[#3d2b1f] overflow-hidden flex items-center justify-center select-none shadow-inner ${className}`}
    >
      {/* 1. BACKGROUND: SONG-SPECIFIC YOUTUBE VISUAL / CRT LOADING */}
      {visualUrl && status === 'loaded' ? (
        <img
          key={visualUrl}
          src={visualUrl}
          alt={track?.title || 'Track visual'}
          className="absolute inset-0 w-full h-full object-cover opacity-45 blur-[0.5px] scale-105 transition-opacity duration-500 ease-out"
        />
      ) : isTuning ? (
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1209] via-[#0f0a06] to-[#080503] flex flex-col items-center justify-center">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-black/80 border border-amber-500/40 text-[9px] font-pixel text-amber-300 shadow animate-pulse">
            <Loader2 className="w-3 h-3 animate-spin text-amber-400" />
            <span>TUNING SIGNAL...</span>
          </div>
        </div>
      ) : (
        /* Fallback warm nostalgic CRT gradient when no image is available */
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e130a] via-[#140c06] to-[#0a0603]" />
      )}

      {/* Subtle CRT Ambient Glow & Vignette */}
      <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80 pointer-events-none" />

      {/* 2. OVERLAY: CRT SCANLINES & TV FRAME */}
      <div className="absolute inset-0 bg-scanlines opacity-20 pointer-events-none" />

      {/* 3. FOREGROUND: CENTRAL VINYL / CASSETTE HUB & EQUALIZER */}
      <div className="relative z-10 flex flex-col items-center gap-1.5 p-2 text-center">
        <div className="w-11 h-11 rounded-full bg-[#1c120c]/90 border border-amber-500/50 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.8)] backdrop-blur-sm">
          <Disc
            className={`w-6 h-6 text-amber-400 transition-transform ${
              isPlaying ? 'animate-[spin_4s_linear_infinite]' : 'opacity-80'
            }`}
          />
        </div>

        {/* Dynamic 5-Band Retro LED VU Equalizer */}
        <div className="flex items-center gap-1 h-3.5 px-2 py-0.5 rounded bg-black/80 border border-[#4a3628] shadow">
          <span
            className={`w-1 rounded-xs bg-amber-400 transition-all duration-150 ${
              isPlaying ? 'h-2.5 animate-pulse' : 'h-1 opacity-30'
            }`}
          />
          <span
            className={`w-1 rounded-xs bg-amber-300 transition-all duration-150 ${
              isPlaying ? 'h-3 animate-pulse delay-75' : 'h-1.5 opacity-30'
            }`}
          />
          <span
            className={`w-1 rounded-xs bg-amber-400 transition-all duration-150 ${
              isPlaying ? 'h-2 animate-pulse delay-150' : 'h-1 opacity-30'
            }`}
          />
          <span
            className={`w-1 rounded-xs bg-amber-500 transition-all duration-150 ${
              isPlaying ? 'h-3.5 animate-pulse delay-100' : 'h-2 opacity-30'
            }`}
          />
          <span
            className={`w-1 rounded-xs bg-amber-400 transition-all duration-150 ${
              isPlaying ? 'h-2.5 animate-pulse delay-200' : 'h-1 opacity-30'
            }`}
          />
        </div>
      </div>

      {/* 4. RETRO CRT STATUS BADGES */}
      {showBadges && (
        <>
          <div className="absolute top-1.5 left-1.5 bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-pixel text-[#fcd34d] border border-[#523d2e] uppercase flex items-center gap-1 pointer-events-none shadow">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
              }`}
            />
            <span>RETRO CRT • HI-FI STEREO</span>
          </div>

          <div className="absolute top-1.5 right-1.5 bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-pixel border border-[#523d2e] uppercase flex items-center gap-1 pointer-events-none shadow">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isTuning
                  ? 'bg-amber-400 animate-pulse'
                  : isUnavailable
                  ? 'bg-rose-500'
                  : 'bg-emerald-400'
              }`}
            />
            <span
              className={
                isTuning
                  ? 'text-amber-300'
                  : isUnavailable
                  ? 'text-rose-300'
                  : 'text-emerald-300'
              }
            >
              {isTuning ? 'TUNING' : isUnavailable ? 'SIGNAL LOST' : 'VERIFIED'}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
