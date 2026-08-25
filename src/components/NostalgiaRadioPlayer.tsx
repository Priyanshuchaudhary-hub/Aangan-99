/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — PERSISTENT NOSTALGIA RADIO PLAYER
   Physical Cassette Deck Floating Window (Desktop) & Sticky Bottom Bar (Mobile).
   Layer 17 Verified Real Provider Playback UI with Provider Fallbacks.
   Persistent YouTube Mount: Never unmounts iframe during minimize/restore.
   ========================================================================= */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { YouTubeProviderService } from '../music/youtube/YouTubeProvider.ts';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Radio,
  Disc,
  Heart,
  Maximize2,
  Minimize2,
  Sparkles,
  Shuffle,
  Repeat,
  ExternalLink,
  ChevronUp,
  Settings,
  Loader2,
  AlertTriangle,
  Search
} from 'lucide-react';
import { useMusic } from '../context/MusicContext.tsx';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import { MUSIC_PROVIDERS_CONFIG } from '../music/config.ts';
import { RetroCRTVisualizer } from './RetroCRTVisualizer.tsx';
import { useTrackVisual } from '../hooks/useTrackVisual.ts';

export const NostalgiaRadioPlayer: React.FC = () => {
  const {
    currentTrack,
    playbackState,
    isPlaying,
    isLoading,
    isUnavailable,
    playbackProgress,
    currentTimeSeconds,
    durationSeconds,
    isShuffle,
    repeatMode,
    favoriteTrackIds,
    providerType,
    isRadioOpen,
    isRadioMinimized,
    setIsRadioMinimized,
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    toggleFavoriteTrack,
    setIsFullPlayerOpen,
    setIsSetupModalOpen,
    openSearchModal,
    triggerDiscoveryMode,
    testYouTubePlayback
  } = useMusic();

  const { visualUrl, status: visualStatus } = useTrackVisual(currentTrack);

  const [tapeRotation, setTapeRotation] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Spinning tape animation frame
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setTapeRotation((prev) => (prev + 12) % 360);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isFav = favoriteTrackIds.includes(currentTrack.id);
  const providerConfig = MUSIC_PROVIDERS_CONFIG[providerType];

  if (!isRadioOpen) return null;

  // MOBILE STICKY BOTTOM PLAYER
  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#16110e]/95 backdrop-blur-md border-t border-[#4d3b2c] p-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] shadow-2xl flex items-center justify-between">
        <div
          onClick={() => {
            audioSynthesizer.playClick('switch');
            setIsFullPlayerOpen(true);
          }}
          className="flex items-center gap-2.5 flex-1 cursor-pointer overflow-hidden"
        >
          {/* Cassette artwork thumbnail */}
          <div className="relative w-10 h-10 rounded border border-[#634e3e] overflow-hidden flex-shrink-0 bg-[#281c15]">
            {visualUrl || currentTrack.artwork ? (
              <img
                src={visualUrl || currentTrack.artwork}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#1e130a] flex items-center justify-center">
                <Disc className="w-5 h-5 text-amber-500/40" />
              </div>
            )}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Disc className="w-5 h-5 text-amber-400 animate-spin" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-pixel text-[9px] text-[#f59e0b] bg-[#362419] px-1 rounded uppercase">
                {currentTrack.year}
              </span>
              <p className="text-xs font-bold text-[#fce8d5] truncate">{currentTrack.title}</p>
            </div>
            <p className="text-[11px] text-[#a89582] truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {isUnavailable ? (
            <a
              href={currentTrack.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white font-bold text-[10px] rounded flex items-center gap-1"
            >
              <span>OPEN</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <button
              onClick={() => togglePlayPause()}
              disabled={isLoading}
              className="w-9 h-9 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#1f140e] flex items-center justify-center shadow font-bold active:scale-95 disabled:opacity-75"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1f140e]" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          )}

          <button
            onClick={() => nextTrack()}
            className="p-2 text-[#d1c2b0] hover:text-white"
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              audioSynthesizer.playClick('switch');
              setIsFullPlayerOpen(true);
            }}
            className="p-1.5 text-[#f59e0b]"
            aria-label="Expand player"
          >
            <ChevronUp className="w-5 h-5 animate-bounce" />
          </button>
        </div>

        {/* Top Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#2d1f17]">
          <div
            className="h-full bg-[#f59e0b] transition-all duration-300"
            style={{ width: `${playbackProgress}%` }}
          />
        </div>
      </div>
    );
  }

  // DESKTOP FLOATING NOSTALGIA RADIO (CONTROLLER & UI - PERSISTENT MEDIA LAYER ARCHITECTURE)
  return (
    <div className="fixed bottom-4 right-4 z-40 select-none shadow-2xl transition-all">
      {/* 
        CRITICAL ARCHITECTURAL GUARANTEE:
        Radio UI is purely a visual controller.
        The YouTube player is hosted in PersistentMediaLayer at root level.
        Minimizing only toggles the visual widget presentation and never affects playback.
      */}

      {isRadioMinimized ? (
        /* ================= MINIMIZED TASKBAR / DOCK WIDGET ================= */
        <div
          onClick={() => {
            audioSynthesizer.playClick('switch');
            setIsRadioMinimized(false);
          }}
          className="flex items-center gap-3 px-3.5 py-2.5 bg-[#20150f] border-2 border-[#6d523f] hover:border-[#f59e0b] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.85)] text-[#f3e7d5] cursor-pointer transition-all group font-mono"
        >
          <div className="relative flex items-center justify-center shrink-0">
            <Radio className="w-4 h-4 text-[#f59e0b]" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </div>

          <div className="flex flex-col min-w-0 pr-1">
            <span className="font-pixel text-[9px] text-[#fcd34d] uppercase tracking-wider flex items-center gap-1">
              <span>🟡</span> NOSTALGIA RADIO
            </span>
            <span className="text-xs text-[#f5ebd8] font-bold max-w-[150px] truncate">
              {isPlaying ? '▶ ' : '❚❚ '}{currentTrack.title}
            </span>
          </div>

          {/* Quick controls on minimized dock */}
          <div
            className="flex items-center gap-1 shrink-0 border-l border-[#4a3628] pl-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => togglePlayPause()}
              disabled={isLoading || isUnavailable}
              className="p-1.5 rounded bg-[#362317] hover:bg-[#4f3422] text-amber-300 hover:text-white active:scale-95 transition-transform"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
            </button>

            <button
              onClick={() => nextTrack()}
              className="p-1.5 rounded bg-[#362317] hover:bg-[#4f3422] text-[#d1c2b0] hover:text-white active:scale-95 transition-transform"
              title="Next Track"
            >
              <SkipForward className="w-3.5 h-3.5 fill-current" />
            </button>

            <button
              onClick={() => {
                audioSynthesizer.playClick('switch');
                setIsRadioMinimized(false);
              }}
              className="p-1.5 rounded bg-[#f59e0b] hover:bg-[#d97706] text-[#1c140f] font-bold ml-0.5 active:scale-95 transition-transform"
              title="Restore Nostalgia Radio Window"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* ================= EXPANDED PHYSICAL CASSETTE DECK WINDOW ================= */
        <div className="w-80 bg-[#1c140f] border-2 border-[#5c4433] rounded-xl p-3 shadow-[0_12px_32px_rgba(0,0,0,0.85)] text-[#e8ded1] font-mono relative overflow-hidden">
          {/* Top Chrome Bezel & Header */}
          <div className="flex items-center justify-between border-b border-[#3d2b1f] pb-2 mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
              <span className="font-pixel text-[11px] text-[#fcd34d] tracking-wider uppercase flex items-center gap-1">
                <span>📼</span> THE NOSTALGIA RADIO
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => openSearchModal()}
                className="p-1 hover:bg-[#322319] text-[#fcd34d] hover:text-amber-200 rounded flex items-center gap-1 text-[10px]"
                title="Search Songs"
              >
                <Search className="w-3.5 h-3.5 text-[#f59e0b]" />
              </button>

              <button
                onClick={() => setIsSetupModalOpen(true)}
                className="p-1 hover:bg-[#322319] text-[#ba9f83] hover:text-amber-300 rounded flex items-center gap-1 text-[10px]"
                title="Choose Provider"
              >
                <span className="font-bold text-[#fcd34d] uppercase font-pixel">{providerConfig?.shortLabel}</span>
                <Settings className="w-3 h-3" />
              </button>

              <button
                onClick={() => {
                  audioSynthesizer.playClick('switch');
                  setIsFullPlayerOpen(true);
                }}
                className="p-1 hover:bg-[#322319] text-[#ba9f83] hover:text-amber-300 rounded"
                title="Expand to Full-Screen Radio"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => {
                  audioSynthesizer.playClick('switch');
                  setIsRadioMinimized(true);
                }}
                className="p-1 hover:bg-[#322319] text-[#ba9f83] hover:text-white rounded"
                title="Minimize (Keep Playing)"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Provider Fallback Notice */}
          {isUnavailable && (
            <div className="mb-2.5 bg-red-950/90 border border-red-500/60 p-2.5 rounded text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-400 font-bold text-[11px] uppercase">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>⚠ PLAYBACK ERROR</span>
              </div>
              <p className="text-[11px] text-red-200 leading-tight">
                Unable to play this video.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  onClick={() => {
                    audioSynthesizer.playClick('switch');
                    playTrack(currentTrack);
                  }}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] rounded uppercase tracking-wide transition-colors"
                >
                  [ TRY AGAIN ]
                </button>
                <button
                  onClick={() => {
                    audioSynthesizer.playClick('switch');
                    nextTrack();
                  }}
                  className="px-2.5 py-1 bg-amber-800 hover:bg-amber-700 text-white font-bold text-[10px] rounded uppercase tracking-wide transition-colors"
                >
                  [ NEXT SONG ]
                </button>
                <a
                  href={currentTrack.externalUrl || `https://www.youtube.com/watch?v=${currentTrack.videoId || currentTrack.providerTrackId || currentTrack.youtubeId || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-700 hover:bg-red-600 text-white font-bold text-[10px] rounded uppercase tracking-wide transition-colors"
                >
                  <span>[ OPEN ON YOUTUBE ]</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}

          {/* Cassette Deck Window with CRT Audio Display */}
          <div className="relative bg-[#110c09] border border-[#4d3829] rounded-lg p-2 mb-2.5 overflow-hidden">
            {/* Retro CRT Screen / Album Art Visualizer */}
            <RetroCRTVisualizer
              track={currentTrack}
              isPlaying={isPlaying}
              isLoading={isLoading}
              isUnavailable={isUnavailable}
              className="w-full h-36 mb-2"
            />

            <div className="flex items-center gap-3">
              {/* Physical Cassette Reels */}
              <div className="w-10 h-10 bg-[#2d1e15] border border-[#6b4f3a] rounded-md flex items-center justify-around px-1 relative overflow-hidden flex-shrink-0">
                <div
                  className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#f59e0b] bg-black flex items-center justify-center transition-transform"
                  style={{ transform: `rotate(${tapeRotation}deg)` }}
                >
                  <div className="w-1 h-1 rounded-full bg-[#fcd34d]" />
                </div>
                <div className="w-2.5 h-0.5 bg-[#4a3628]" />
                <div
                  className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-[#f59e0b] bg-black flex items-center justify-center transition-transform"
                  style={{ transform: `rotate(${tapeRotation}deg)` }}
                >
                  <div className="w-1 h-1 rounded-full bg-[#fcd34d]" />
                </div>
              </div>

              {/* Track Information */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-pixel text-[9px] text-[#fcd34d] bg-[#3d2719] px-1 rounded">
                    ERA {currentTrack.year}
                  </span>
                  <span className="text-[10px] text-[#8c7460]">{currentTrack.language}</span>
                </div>
                <h4 className="font-bold text-xs text-[#fff7ed] truncate">{currentTrack.title}</h4>
                <p className="text-[11px] text-[#a38d78] truncate">{currentTrack.artist}</p>
              </div>
            </div>

            {/* Real-time LED VU Meter Bars */}
            <div className="flex items-center gap-0.5 mt-2 pt-1 border-t border-[#261a12]">
              {[45, 70, 85, 60, 90, 50, 75, 65, 80, 55].map((val, i) => (
                <div key={i} className="flex-1 h-1.5 bg-[#231710] rounded-sm overflow-hidden">
                  <div
                    className={`h-full transition-all duration-150 ${
                      val > 80 ? 'bg-red-500' : val > 60 ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.min(100, val * (0.6 + Math.random() * 0.8))}%` : '20%'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Progress Slider & Timers */}
          <div className="mb-2.5">
            <input
              type="range"
              min="0"
              max="100"
              value={playbackProgress}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="w-full h-1.5 bg-[#2d1e15] accent-[#f59e0b] rounded cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-[#9a836d] mt-1 font-mono">
              <span>{formatTime(currentTimeSeconds)}</span>
              <span>{formatTime(durationSeconds)}</span>
            </div>
          </div>

          {/* Main Physical Transport Controls */}
          <div className="flex items-center justify-between gap-1 mb-2">
            <button
              onClick={() => toggleShuffle()}
              className={`p-1.5 rounded border text-xs transition-colors ${
                isShuffle
                  ? 'bg-[#b45309] border-[#f59e0b] text-white'
                  : 'bg-[#231812] border-[#3d2b1f] text-[#8c7460] hover:text-white'
              }`}
              title="Shuffle"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => previousTrack()}
              className="p-1.5 bg-[#2a1d16] hover:bg-[#3d2a1f] border border-[#4d3828] text-[#e8ded1] rounded active:scale-95 transition-transform"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => togglePlayPause()}
              disabled={isLoading || isUnavailable}
              className="px-4 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#1c120c] font-bold rounded shadow-md flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1c120c]" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => nextTrack()}
              className="p-1.5 bg-[#2a1d16] hover:bg-[#3d2a1f] border border-[#4d3828] text-[#e8ded1] rounded active:scale-95 transition-transform"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={() => toggleRepeat()}
              className={`p-1.5 rounded border text-xs transition-colors ${
                repeatMode !== 'OFF'
                  ? 'bg-[#b45309] border-[#f59e0b] text-white'
                  : 'bg-[#231812] border-[#3d2b1f] text-[#8c7460] hover:text-white'
              }`}
              title={`Repeat: ${repeatMode}`}
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => toggleFavoriteTrack(currentTrack.id)}
              className={`p-1.5 rounded border text-xs transition-colors ${
                isFav
                  ? 'bg-[#be123c] border-[#f43f5e] text-white'
                  : 'bg-[#231812] border-[#3d2b1f] text-[#8c7460] hover:text-rose-400'
              }`}
              title="Favorite"
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Discovery & Provider Footer Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#312217] text-[10px]">
            <button
              onClick={() => {
                audioSynthesizer.playClick('switch');
                triggerDiscoveryMode();
              }}
              className="flex items-center gap-1 text-[#fcd34d] hover:underline font-pixel uppercase"
            >
              <Sparkles className="w-3 h-3 text-[#f59e0b]" />
              <span>Discovery Mode</span>
            </button>

            <a
              href={currentTrack.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#a8937d] hover:text-white transition-colors"
              title="Listen on Official Provider"
            >
              <span>External</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
