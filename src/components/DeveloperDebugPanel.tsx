/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — DEVELOPER DEBUG PANEL
   Layer 17 verified provider state & audio telemetry monitor.
   Toggle via Shift+D or the [DEBUG] toolbar badge.
   ========================================================================= */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, X, Disc, Volume2, ShieldAlert, Cpu, ListMusic, RefreshCw, Radio, ShieldCheck } from 'lucide-react';
import { useMusic } from '../context/MusicContext.tsx';
import { MUSIC_PROVIDERS_CONFIG } from '../music/config.ts';
import { YouTubeTestPlayer } from './YouTubeTestPlayer.tsx';
import { VerifyPlaylistModal } from './VerifyPlaylistModal.tsx';

export const DeveloperDebugPanel: React.FC = () => {
  const [showIsolatedTest, setShowIsolatedTest] = useState<boolean>(false);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const {
    playbackState,
    currentTrack,
    providerType,
    currentTimeSeconds,
    durationSeconds,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    queue,
    errorDetails,
    isDebugPanelOpen,
    setIsDebugPanelOpen,
    switchProvider
  } = useMusic();

  if (!isDebugPanelOpen) return null;

  const providerInfo = MUSIC_PROVIDERS_CONFIG[providerType];

  return (
    <div className="fixed top-4 left-4 z-50 select-none max-w-[95vw]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-80 md:w-[480px] bg-[#0c0d12]/95 border-2 border-[#f59e0b] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.9)] text-[#e2e8f0] font-mono text-xs overflow-hidden backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#1a1c24] border-b border-[#2d3242]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#f59e0b]" />
              <span className="font-bold text-[#fcd34d] tracking-wider uppercase">
                MUSIC ENGINE DEBUGGER & ISOLATED TEST
              </span>
            </div>
            <button
              onClick={() => setIsDebugPanelOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Toggle Controls */}
          <div className="p-2 bg-[#141722] border-b border-[#232838] flex flex-col gap-2">
            <button
              onClick={() => setShowVerifyModal(true)}
              className="w-full py-1.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-[11px] uppercase tracking-wide flex items-center justify-center gap-2 shadow"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>VERIFY PLAYLIST ● (AUDIT ALL YOUTUBE IDS)</span>
            </button>
            <button
              onClick={() => setShowIsolatedTest(!showIsolatedTest)}
              className={`w-full py-1 px-3 rounded font-bold text-[10px] uppercase tracking-wide flex items-center justify-center gap-2 ${
                showIsolatedTest
                  ? 'bg-amber-500 text-black shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{showIsolatedTest ? 'HIDE ISOLATED YOUTUBE TEST BED' : 'OPEN ISOLATED YOUTUBE TEST BED'}</span>
            </button>
          </div>

          <VerifyPlaylistModal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} />

          {/* Isolated Test View */}
          {showIsolatedTest && (
            <div className="p-2 max-h-[75vh] overflow-y-auto">
              <YouTubeTestPlayer />
            </div>
          )}

          {/* Telemetry Body */}
          {!showIsolatedTest && (
            <div className="p-3.5 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* Active Provider & State */}
              <div className="grid grid-cols-2 gap-2 bg-[#141722] p-2.5 rounded border border-[#232838]">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">PROVIDER</span>
                  <span className="font-bold text-[#f59e0b]">{providerInfo?.shortLabel || providerType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">STATE</span>
                  <span
                    className={`font-bold px-1.5 py-0.5 rounded text-[11px] inline-block ${
                      playbackState === 'PLAYING'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        : playbackState === 'PAUSED'
                        ? 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        : playbackState === 'LOADING' || playbackState === 'BUFFERING'
                        ? 'bg-blue-950 text-blue-400 border border-blue-500/40 animate-pulse'
                        : playbackState === 'UNAVAILABLE' || playbackState === 'ERROR'
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {playbackState}
                  </span>
                </div>
              </div>

              {/* Current Track & Provider Track ID */}
              <div className="bg-[#141722] p-2.5 rounded border border-[#232838] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase">CURRENT TRACK</span>
                  <span className="text-[10px] text-amber-300 font-bold">{currentTrack?.year || '1999'}</span>
                </div>
                <p className="font-bold text-white truncate">{currentTrack?.title || 'No Track Loaded'}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentTrack?.artist || 'Unknown Artist'}</p>
                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80">
                  <span>ID: {currentTrack?.id || 'N/A'}</span>
                  <span className="text-amber-400 font-bold">
                    PROVIDER ID: {currentTrack?.providerTrackId || currentTrack?.youtubeId || 'N/A'}
                  </span>
                </div>
              </div>

              {/* Progress & Duration */}
              <div className="bg-[#141722] p-2.5 rounded border border-[#232838] space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">PROGRESS:</span>
                  <span className="text-emerald-400 font-bold">
                    {Math.floor(currentTimeSeconds)}s / {Math.floor(durationSeconds)}s
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${durationSeconds > 0 ? (currentTimeSeconds / durationSeconds) * 100 : 0}%`
                    }}
                  />
                </div>
              </div>

              {/* Telemetry Details */}
              <div className="space-y-1 text-[11px] text-slate-300 bg-[#141722] p-2.5 rounded border border-[#232838]">
                <div className="flex justify-between">
                  <span className="text-slate-400">VOLUME:</span>
                  <span>{isMuted ? 'MUTED' : `${Math.round(volume * 100)}%`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">QUEUE LENGTH:</span>
                  <span>{queue.length} Tracks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SHUFFLE / REPEAT:</span>
                  <span>
                    {isShuffle ? 'ON' : 'OFF'} / {repeatMode}
                  </span>
                </div>
              </div>

              {/* Error & Warning Console */}
              {errorDetails && (
                <div className="bg-rose-950/80 border border-rose-500/50 p-2.5 rounded text-[11px] text-rose-200 space-y-0.5">
                  <div className="flex items-center gap-1 font-bold text-rose-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>PROVIDER TELEMETRY NOTICE</span>
                  </div>
                  <p>{errorDetails}</p>
                </div>
              )}

              {/* Quick Provider Switcher */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-slate-400 uppercase">SWITCH PROVIDER AT RUNTIME:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['youtube', 'spotify', 'licensed', 'local-synth'] as const).map((pType) => (
                    <button
                      key={pType}
                      onClick={() => switchProvider(pType)}
                      className={`py-1 px-2 rounded text-[11px] transition-colors text-left flex items-center justify-between ${
                        providerType === pType
                          ? 'bg-[#f59e0b] text-[#111] font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <span className="capitalize">{pType}</span>
                      {providerType === pType && <span className="text-[9px]">ACTIVE</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Footer status line */}
          <div className="px-3 py-1.5 bg-[#12141c] border-t border-[#232838] text-[10px] text-slate-400 flex justify-between items-center">
            <span>Press Shift+D to toggle debug overlay</span>
            <span
              className={`font-bold uppercase ${
                playbackState === 'PLAYING'
                  ? 'text-emerald-400'
                  : playbackState === 'LOADING' || playbackState === 'BUFFERING'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {playbackState === 'LOADING' || playbackState === 'BUFFERING'
                ? 'VERIFYING...'
                : playbackState === 'UNAVAILABLE' || playbackState === 'ERROR'
                ? 'UNAVAILABLE ●'
                : 'VERIFIED ●'}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
