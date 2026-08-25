/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — MUSIC DEBUG PANEL (DEVELOPMENT ONLY)
   Consumes current state directly from MusicContext to verify:
   - Current Track Title
   - Current Video ID
   - Player Ready State
   - Playback State
   - Error Messages
   - ID Match: PASS/FAIL Indicator
   - Single Persistent Player Instance Verification
   Positioned in a fixed location in the bottom-right corner.
   ========================================================================= */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  X,
  Disc,
  Play,
  Pause,
  Layers,
  Cpu,
  Maximize2,
  Minimize2,
  Radio,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { useMusic } from '../context/MusicContext.tsx';
import { YouTubePlayer } from '../music/youtube/YouTubePlayer.ts';
import { NOSTALGIA_TRACKS } from '../data/musicData.ts';

export const MusicDebugPanel: React.FC = () => {
  // Check if we are in development mode
  const isDevMode =
    typeof process !== 'undefined'
      ? process.env.NODE_ENV !== 'production'
      : (import.meta as any).env?.DEV ?? true;

  // If not in development mode, do not render
  if (!isDevMode) {
    return null;
  }

  return <MusicDebugPanelContent />;
};

const MusicDebugPanelContent: React.FC = () => {
  // 1. Consume state directly from MusicContext
  const {
    currentTrack,
    playbackState,
    isPlaying,
    isLoading,
    isUnavailable,
    errorDetails,
    playTrack,
    togglePlayPause,
    verifiedSongs,
    playVerifiedSong
  } = useMusic();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeLoadedVideoId, setActiveLoadedVideoId] = useState<string>('');
  const [rawPlayerState, setRawPlayerState] = useState<string>('UNINIT');
  const [apiReady, setApiReady] = useState<boolean>(false);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [iframeCount, setIframeCount] = useState<number>(0);
  const [hostFound, setHostFound] = useState<boolean>(false);
  const [playerError, setPlayerError] = useState<string | null>(null);

  const player = YouTubePlayer.getInstance();

  // Hotkey listener: Shift+M toggles the panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && (e.key === 'M' || e.key === 'm')) {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Poll real-time engine telemetry
  useEffect(() => {
    const poll = () => {
      const isYtApi =
        typeof window !== 'undefined' &&
        Boolean((window as any).YT && (window as any).YT.Player);
      setApiReady(isYtApi);

      const vid = player.getCurrentVideoId();
      setActiveLoadedVideoId(vid || '');

      const state = player.getPlayerState();
      if (state === 'playing') setRawPlayerState('YT.PlayerState.PLAYING (1)');
      else if (state === 'paused') setRawPlayerState('YT.PlayerState.PAUSED (2)');
      else if (state === 'buffering') setRawPlayerState('YT.PlayerState.BUFFERING (3)');
      else if (state === 'ended') setRawPlayerState('YT.PlayerState.ENDED (0)');
      else if (state === 'loading') setRawPlayerState('LOADING (3)');
      else if (state === 'idle') setRawPlayerState('YT.PlayerState.UNSTARTED (-1)');
      else setRawPlayerState(state.toUpperCase());

      const hostEl = document.getElementById('yt-official-iframe-host');
      setHostFound(Boolean(hostEl));

      const iframes = document.querySelectorAll('iframe[src*="youtube.com"]');
      setIframeCount(iframes.length);
      setPlayerReady(Boolean(hostEl && (vid || isYtApi)));
    };

    poll();
    const interval = setInterval(poll, 300);

    const unsubscribe = player.subscribe((payload) => {
      setPlayerError(payload.error);
      poll();
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [player]);

  // Derive Expected Video ID from Current Track
  const expectedVideoId =
    currentTrack?.videoId ||
    currentTrack?.youtubeVideoId ||
    currentTrack?.youtubeId ||
    currentTrack?.providerTrackId ||
    '';

  // Compute ID Match: PASS / FAIL
  const isIdMatch =
    expectedVideoId && activeLoadedVideoId
      ? expectedVideoId.trim() === activeLoadedVideoId.trim()
      : playbackState === 'IDLE' || !expectedVideoId;

  const handlePlay = async () => {
    await player.playVideo();
  };

  const handlePause = () => {
    player.pauseVideo();
  };

  return (
    <aside
      id="music-debug-panel-container"
      aria-label="Music Debug Panel (Development Mode)"
      className="fixed bottom-3 right-3 z-50 select-none font-mono text-xs"
    >
      {/* 1. Collapsed Bottom-Right HUD Bar */}
      {!isOpen && (
        <div
          id="music-debug-collapsed-hud"
          className="flex items-center gap-2 bg-[#0c0f18]/95 border border-[#f59e0b] px-3 py-2 rounded-lg shadow-[0_8px_24px_rgba(0,0,0,0.85)] backdrop-blur-md text-slate-200"
        >
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#f59e0b] animate-pulse" />
            <span className="font-bold text-[11px] text-[#fcd34d]">MUSIC DEBUG</span>
          </div>

          <div className="h-3 w-px bg-slate-700 mx-0.5" />

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-slate-400">
              TRACK:{' '}
              <strong className="text-slate-200 max-w-[100px] truncate inline-block align-bottom">
                {currentTrack?.title || 'None'}
              </strong>
            </span>

            <span className="text-slate-400">
              VID:{' '}
              <strong className="text-cyan-300 font-mono">
                {activeLoadedVideoId || expectedVideoId || 'NONE'}
              </strong>
            </span>

            <span className="text-slate-400">
              STATE:{' '}
              <strong
                className={
                  playbackState === 'PLAYING'
                    ? 'text-emerald-400'
                    : playbackState === 'PAUSED'
                    ? 'text-amber-400'
                    : playbackState === 'BUFFERING'
                    ? 'text-cyan-400'
                    : 'text-slate-300'
                }
              >
                {playbackState}
              </strong>
            </span>

            <span className="text-slate-400">
              ID MATCH:{' '}
              <strong className={isIdMatch ? 'text-emerald-400' : 'text-rose-400'}>
                {isIdMatch ? 'PASS' : 'FAIL'}
              </strong>
            </span>
          </div>

          <button
            id="music-debug-hud-expand-btn"
            onClick={() => setIsOpen(true)}
            className="ml-1 px-1.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 rounded text-[10px] flex items-center gap-1 font-bold transition-colors border border-amber-500/30"
            title="Expand Debug Panel (Shift+M)"
          >
            <Maximize2 className="w-3 h-3" />
            <span>[EXPAND]</span>
          </button>
        </div>
      )}

      {/* 2. Expanded Bottom-Right Debug Panel Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="music-debug-expanded-panel"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            className="w-80 sm:w-[460px] bg-[#0c0e17]/95 border-2 border-[#f59e0b] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] text-[#e2e8f0] overflow-hidden backdrop-blur-md"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-[#151928] border-b border-[#2d354d]">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#f59e0b]" />
                <span className="font-bold text-[#fcd34d] tracking-wider uppercase text-xs">
                  MUSIC DEBUG PANEL (DEV MODE)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/30">
                  Shift+M
                </span>
                <button
                  id="music-debug-minimize-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Minimize Panel"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  id="music-debug-close-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors"
                  title="Close Panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-3.5 space-y-3">
              {/* PRIMARY TELEMETRY TABLE */}
              <div className="p-3 bg-[#121624] rounded-lg border border-[#232a3f] space-y-2 text-[11px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-amber-400 font-bold uppercase flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>PLAYBACK CONTEXT TELEMETRY</span>
                  </span>
                  <span
                    id="music-debug-id-match-badge"
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isIdMatch
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/50 animate-pulse'
                    }`}
                  >
                    ID MATCH: {isIdMatch ? 'PASS' : 'FAIL'}
                  </span>
                </div>

                <div className="space-y-1.5 pt-0.5">
                  {/* 1. Current Track Title */}
                  <div className="flex justify-between items-center border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Current Track Title:</span>
                    <span className="font-bold text-white max-w-[240px] truncate text-right">
                      {currentTrack ? `${currentTrack.title} — ${currentTrack.artist}` : 'None'}
                    </span>
                  </div>

                  {/* 2. Current Video ID */}
                  <div className="flex justify-between items-center border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Current Video ID:</span>
                    <span className="font-mono font-bold text-cyan-300 text-right">
                      {activeLoadedVideoId || expectedVideoId || 'NONE'}
                    </span>
                  </div>

                  {/* 3. Player Ready State */}
                  <div className="flex justify-between items-center border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Player Ready State:</span>
                    <span
                      className={`font-bold text-right ${
                        playerReady && apiReady ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {apiReady ? 'READY (window.YT + Singleton Host)' : 'INITIALIZING API...'}
                    </span>
                  </div>

                  {/* 4. Playback State */}
                  <div className="flex justify-between items-center border-b border-slate-800/80 pb-1">
                    <span className="text-slate-400">Playback State:</span>
                    <span
                      className={`font-bold text-right ${
                        playbackState === 'PLAYING'
                          ? 'text-emerald-400 animate-pulse'
                          : playbackState === 'PAUSED'
                          ? 'text-amber-400'
                          : playbackState === 'BUFFERING'
                          ? 'text-cyan-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {playbackState} ({rawPlayerState})
                    </span>
                  </div>

                  {/* 5. Error Messages */}
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-slate-400">Error Messages:</span>
                    <span
                      className={`font-bold text-right max-w-[240px] truncate ${
                        errorDetails || playerError ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {errorDetails || playerError || 'None (0 errors)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SINGLETON INSTANCE VERIFICATION */}
              <div className="p-2.5 bg-[#121624] rounded-lg border border-[#232a3f] space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between text-amber-400 font-bold uppercase">
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#f59e0b]" />
                    <span>SINGLETON INSTANCE CHECK</span>
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] ${
                      iframeCount <= 1 && hostFound
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                        : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}
                  >
                    {iframeCount <= 1 && hostFound ? '1 PERSISTENT INSTANCE (PASS)' : 'FAIL (DUPLICATE)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-400 pt-0.5">
                  <div>Host DOM: <span className="text-white font-mono">#yt-official-iframe-host</span></div>
                  <div>Active IFrames: <span className="text-white font-mono">{iframeCount}</span></div>
                </div>
              </div>

              {/* QUICK SWITCH & PLAYBACK CONTROLS */}
              <div className="p-2.5 bg-[#121624] rounded-lg border border-[#232a3f] space-y-1.5">
                <span className="text-[10px] font-bold text-amber-400 uppercase block">
                  VERIFIED SONGS (QUICK SWITCH):
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {verifiedSongs.map((song, idx) => {
                    const videoId = song.videoId || song.youtubeVideoId || song.providerTrackId;
                    const isCurrent = (activeLoadedVideoId || expectedVideoId) === videoId;
                    return (
                      <button
                        key={song.id}
                        onClick={() => playVerifiedSong(song)}
                        className={`p-1.5 rounded border text-left flex flex-col justify-between transition-all ${
                          isCurrent
                            ? 'bg-amber-600/30 border-amber-400 text-amber-200'
                            : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
                        }`}
                      >
                        <div>
                          <span className="text-[8px] text-amber-400 font-bold block">Song {idx + 1}</span>
                          <span className="font-bold text-[10px] text-white truncate block">{song.title}</span>
                        </div>
                        <div className="mt-1 pt-0.5 border-t border-slate-700/60 flex items-center justify-between text-[8px]">
                          <span className="text-cyan-300 font-mono">{videoId}</span>
                          <span className="text-amber-400 font-bold">PLAY ▶</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Transport Controls */}
              <div className="flex gap-2">
                <button
                  id="music-debug-play-btn"
                  onClick={handlePlay}
                  className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center justify-center gap-1.5 shadow active:scale-95 transition-transform text-xs"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY</span>
                </button>
                <button
                  id="music-debug-pause-btn"
                  onClick={handlePause}
                  className="flex-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded flex items-center justify-center gap-1.5 shadow active:scale-95 transition-transform text-xs"
                >
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>PAUSE</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
