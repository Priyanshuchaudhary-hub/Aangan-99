/* =========================================================================
   AANGAN '99 / YOUTUBE PLAYBACK TEST SCREEN
   Phase 1 - Phase 11 Emergency Recovery Minimal Verification Screen.
   Uses the SINGLE official YouTubePlayer singleton — ZERO duplicate players.
   ========================================================================= */

import React, { useEffect, useState } from 'react';
import { YouTubePlayer } from '../music/youtube/YouTubePlayer.ts';
import { getPlayerStateString } from '../music/youtube/youtubePlayerTest.ts';
import { Play, Pause, RefreshCw, Disc, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useMusic } from '../context/MusicContext.tsx';

export const YouTubeTestPlayer: React.FC = () => {
  const { playTrack, currentTrack } = useMusic();
  const player = YouTubePlayer.getInstance();

  const [apiReady, setApiReady] = useState<boolean>(false);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [playerStateStr, setPlayerStateStr] = useState<string>('UNINIT');
  const [lastError, setLastError] = useState<string | null>(null);
  const [activeSongTitle, setActiveSongTitle] = useState<string>('Tum Hi Ho');

  // 3 Verified Songs for Emergency Recovery Phases
  const KNOWN_GOOD_SONGS = [
    {
      id: 'tum-hi-ho',
      title: 'Tum Hi Ho',
      artist: 'Arijit Singh',
      videoId: 'Umqb9KENgmk',
      phase: 'Phase 1 - 3 Baseline'
    },
    {
      id: 'khaabon-ke-parinday',
      title: 'Khaabon Ke Parinday',
      artist: 'Mohit Chauhan',
      videoId: 'cscdqZUdgCk',
      phase: 'Phase 4 - 5 Single Addition'
    },
    {
      id: 'aankhon-mein-teri',
      title: 'Aankhon Mein Teri',
      artist: 'KK',
      videoId: 'fP7i2j0-B7E',
      phase: 'Phase 6 Third Addition'
    }
  ];

  useEffect(() => {
    // Check if YT API is available
    if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
      setApiReady(true);
    }

    const unsubscribe = player.subscribe((payload) => {
      setApiReady(typeof window !== 'undefined' && Boolean(window.YT && window.YT.Player));
      setPlayerReady(true);
      setCurrentVideoId(player.getCurrentVideoId());
      setLastError(payload.error);

      if (typeof window !== 'undefined' && (window as any).YT?.PlayerState) {
        if (payload.state === 'playing') setPlayerStateStr('YT.PlayerState.PLAYING (1)');
        else if (payload.state === 'paused') setPlayerStateStr('YT.PlayerState.PAUSED (2)');
        else if (payload.state === 'buffering') setPlayerStateStr('YT.PlayerState.BUFFERING (3)');
        else if (payload.state === 'ended') setPlayerStateStr('YT.PlayerState.ENDED (0)');
        else if (payload.state === 'loading') setPlayerStateStr('LOADING');
        else if (payload.state === 'idle') setPlayerStateStr('YT.PlayerState.UNSTARTED (-1)');
        else setPlayerStateStr(payload.state.toUpperCase());
      } else {
        setPlayerStateStr(payload.state.toUpperCase());
      }
    });

    // Poll current state
    const interval = setInterval(() => {
      const vid = player.getCurrentVideoId();
      if (vid) setCurrentVideoId(vid);
      if (typeof window !== 'undefined' && window.YT && window.YT.Player) {
        setApiReady(true);
      }
    }, 500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [player]);

  const handleLoadTumHiHo = async () => {
    setActiveSongTitle('Tum Hi Ho');
    await player.loadVideo('Umqb9KENgmk', false);
  };

  const handlePlay = async () => {
    await player.playVideo();
  };

  const handlePause = async () => {
    player.pauseVideo();
  };

  const handlePlaySong = async (song: typeof KNOWN_GOOD_SONGS[0]) => {
    setActiveSongTitle(song.title);
    await player.loadVideo(song.videoId, true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 bg-[#0e111a] border-2 border-[#f59e0b] rounded-xl shadow-2xl text-slate-200 font-mono text-xs space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-[#2a3045] pb-2">
        <div className="flex items-center gap-2">
          <Disc className="w-4 h-4 text-[#f59e0b] animate-spin" />
          <h3 className="font-bold text-sm text-[#fcd34d] uppercase tracking-wider">
            YOUTUBE PLAYBACK TEST (KNOWN-GOOD BASELINE)
          </h3>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40">
          SINGLETON YT.PLAYER
        </span>
      </div>

      {/* Phase 2: Tum Hi Ho Baseline Controls */}
      <div className="p-3 bg-[#151928] rounded-lg border border-[#2d354d] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-amber-400 font-bold uppercase text-[11px]">
            PHASE 2 MINIMAL TEST: Track: Tum Hi Ho (Umqb9KENgmk)
          </span>
          <span className="text-[10px] text-slate-400">Baseline Track</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleLoadTumHiHo}
            className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded flex items-center justify-center gap-1.5 border border-slate-600 active:scale-95 transition-transform"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>[LOAD]</span>
          </button>

          <button
            onClick={handlePlay}
            className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded flex items-center justify-center gap-1.5 shadow active:scale-95 transition-transform"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>[PLAY]</span>
          </button>

          <button
            onClick={handlePause}
            className="flex-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded flex items-center justify-center gap-1.5 shadow active:scale-95 transition-transform"
          >
            <Pause className="w-3.5 h-3.5 fill-current" />
            <span>[PAUSE]</span>
          </button>
        </div>
      </div>

      {/* Phase 4, 5, 6: Switch Test Buttons */}
      <div className="p-3 bg-[#151928] rounded-lg border border-[#2d354d] space-y-2">
        <span className="text-amber-400 font-bold uppercase text-[11px] block">
          PHASES 4, 5 & 6 — SEQUENTIAL SONG VERIFICATION:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {KNOWN_GOOD_SONGS.map((song) => (
            <button
              key={song.id}
              onClick={() => handlePlaySong(song)}
              className={`p-2 rounded border text-left flex flex-col justify-between transition-all ${
                currentVideoId === song.videoId
                  ? 'bg-amber-600/30 border-amber-400 text-amber-200'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300'
              }`}
            >
              <div>
                <span className="text-[9px] text-amber-400 block font-bold uppercase">{song.phase}</span>
                <span className="font-bold text-xs text-white truncate block">{song.title}</span>
                <span className="text-[10px] text-slate-400 truncate block">{song.artist}</span>
              </div>
              <div className="mt-1 pt-1 border-t border-slate-700/60 flex items-center justify-between text-[9px]">
                <span className="text-cyan-300">{song.videoId}</span>
                <span className="text-amber-400 font-bold">PLAY ▶</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Debug Readout */}
      <div className="p-3 bg-[#0a0c13] rounded-lg border border-[#22283a] space-y-1.5 text-[11px]">
        <div className="text-[#f59e0b] font-bold uppercase tracking-wide border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>DEBUG TELEMETRY READOUT</span>
          <span className="text-[10px] text-slate-400">ACTIVE: {activeSongTitle}</span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
          <div className="flex justify-between border-b border-slate-900 pb-0.5">
            <span className="text-slate-400">API READY:</span>
            <span className={apiReady ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {apiReady ? 'YES (window.YT ready)' : 'NO (Loading...)'}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-900 pb-0.5">
            <span className="text-slate-400">PLAYER READY:</span>
            <span className={playerReady ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
              {playerReady ? 'YES' : 'NO'}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-900 pb-0.5">
            <span className="text-slate-400">VIDEO ID:</span>
            <span className="text-cyan-300 font-bold font-mono">{currentVideoId || 'NONE'}</span>
          </div>

          <div className="flex justify-between border-b border-slate-900 pb-0.5">
            <span className="text-slate-400">PLAYER STATE:</span>
            <span
              className={`font-bold ${
                playerStateStr.includes('PLAYING')
                  ? 'text-emerald-400 animate-pulse'
                  : playerStateStr.includes('PAUSED')
                  ? 'text-amber-400'
                  : playerStateStr.includes('BUFFERING')
                  ? 'text-cyan-400'
                  : 'text-slate-300'
              }`}
            >
              {playerStateStr}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[10px]">
          <span className="text-slate-400">ERROR:</span>
          <span className={lastError ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
            {lastError || 'NONE (0 errors)'}
          </span>
        </div>
      </div>
    </div>
  );
};
