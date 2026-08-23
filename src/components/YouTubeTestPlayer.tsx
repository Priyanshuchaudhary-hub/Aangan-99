/* =========================================================================
   AANGAN '99 / ISOLATED YOUTUBE TEST PLAYER & DIAGNOSTIC PANEL
   Phase 1 - Phase 16 Isolation Test Component
   ========================================================================= */

import React, { useEffect, useRef, useState } from 'react';
import { loadYouTubeIframeAPI } from '../music/youtube/youtubeApiLoader.ts';
import {
  YOUTUBE_TEST_CONFIG,
  YouTubeDiagnosticState,
  getBrowserInfo,
  getPlayerStateString
} from '../music/youtube/youtubePlayerTest.ts';
import { Play as PlayIcon, Pause as PauseIcon, AlertTriangle, RefreshCw as SpinIcon } from 'lucide-react';

export const YouTubeTestPlayer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);

  const [diagnostics, setDiagnostics] = useState<YouTubeDiagnosticState>({
    apiReady: false,
    playerReady: false,
    videoLoaded: false,
    playRequestSent: false,
    playerState: 'UNINIT',
    errorCode: null,
    errorMessage: null,
    iframeCreated: false,
    iframeBlocked: false,
    cspIssue: false,
    networkIssue: false,
    origin: typeof window !== 'undefined' ? window.location.origin : '',
    isHttps: typeof window !== 'undefined' ? window.location.protocol === 'https:' : false,
    browser: getBrowserInfo()
  });

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [selectedVideoId, setSelectedVideoId] = useState<string>(YOUTUBE_TEST_CONFIG.TEST_VIDEO_ID);

  // Initialize API and Player without race conditions
  useEffect(() => {
    let isMounted = true;

    async function init() {
      try {
        console.log('[YOUTUBE TEST] Step 1: Loading IFrame API...');
        await loadYouTubeIframeAPI();

        if (!isMounted) return;

        setDiagnostics((prev) => ({ ...prev, apiReady: true }));
        console.log('[YOUTUBE TEST] Step 2: IFrame API Loaded successfully.');

        // Verify DOM Container exists
        const container = containerRef.current;
        if (!container) {
          console.error('[YOUTUBE TEST] Container DOM element not mounted yet.');
          return;
        }

        // Clean up previous instance if any
        if (playerRef.current && typeof playerRef.current.destroy === 'function') {
          playerRef.current.destroy();
          playerRef.current = null;
        }

        // Create target div inside container
        container.innerHTML = '<div id="isolated-yt-player-target"></div>';

        console.log('[YOUTUBE TEST] Step 3: Instantiating YT.Player with origin:', window.location.origin);

        playerRef.current = new window.YT.Player('isolated-yt-player-target', {
          height: '100%',
          width: '100%',
          videoId: selectedVideoId,
          host: 'https://www.youtube.com',
          playerVars: {
            origin: window.location.origin,
            playsinline: 1,
            rel: 0,
            enablejsapi: 1,
            autoplay: 0,
            controls: 1
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              console.log('[YOUTUBE TEST] Step 4: onReady event fired.');

              const iframe = event.target?.getIframe ? event.target.getIframe() : null;
              const iframeCreated = Boolean(iframe);

              setDiagnostics((prev) => ({
                ...prev,
                playerReady: true,
                videoLoaded: true,
                iframeCreated,
                playerState: 'CUED / READY'
              }));
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              const stateCode = event.data;
              const stateStr = getPlayerStateString(stateCode);
              console.log('[YOUTUBE TEST] Event onStateChange:', stateCode, stateStr);

              setDiagnostics((prev) => ({
                ...prev,
                playerState: stateStr
              }));

              if (window.YT && window.YT.PlayerState) {
                if (stateCode === window.YT.PlayerState.PLAYING) {
                  setIsPlaying(true);
                  setIsBuffering(false);
                  console.log('[YOUTUBE TEST] VERIFIED REAL PLAYING STATE ACHIEVED! (State = 1)');
                } else if (stateCode === window.YT.PlayerState.PAUSED) {
                  setIsPlaying(false);
                  setIsBuffering(false);
                } else if (stateCode === window.YT.PlayerState.ENDED) {
                  setIsPlaying(false);
                  setIsBuffering(false);
                } else if (stateCode === window.YT.PlayerState.BUFFERING) {
                  setIsBuffering(true);
                }
              }
            },
            onError: (event: any) => {
              if (!isMounted) return;
              const code = event.data;
              console.error('[YOUTUBE TEST] Event onError code:', code);

              let errorText = `YouTube Error Code ${code}`;
              let isEmbedBlocked = false;

              if (code === 101 || code === 150) {
                errorText = 'Code 101/150: Embedding restricted by copyright owner.';
                isEmbedBlocked = true;
              } else if (code === 2 || code === 100) {
                errorText = 'Code 2/100: Video not found or invalid ID.';
              } else if (code === 5) {
                errorText = 'Code 5: HTML5 player error.';
              }

              setDiagnostics((prev) => ({
                ...prev,
                errorCode: code,
                errorMessage: errorText,
                iframeBlocked: isEmbedBlocked,
                playerState: `ERROR (${code})`
              }));

              setIsPlaying(false);
              setIsBuffering(false);
            }
          }
        });
      } catch (err: any) {
        if (!isMounted) return;
        console.error('[YOUTUBE TEST] Exception creating YT.Player:', err);
        setDiagnostics((prev) => ({
          ...prev,
          errorMessage: err?.message || 'Failed to initialize player',
          playerState: 'INIT_FAILED'
        }));
      }
    }

    init();

    return () => {
      isMounted = false;
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        console.log('[YOUTUBE TEST] Cleaning up player instance on unmount.');
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [selectedVideoId]);

  const handleTestPlay = () => {
    setDiagnostics((prev) => ({ ...prev, playRequestSent: true }));
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      console.log('[YOUTUBE TEST] User clicked TEST PLAY -> calling player.playVideo()');
      playerRef.current.playVideo();
    } else {
      console.warn('[YOUTUBE TEST] Cannot play, player instance not ready.');
    }
  };

  const handleTestPause = () => {
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      console.log('[YOUTUBE TEST] User clicked PAUSE -> calling player.pauseVideo()');
      playerRef.current.pauseVideo();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-[#12141c] border-2 border-amber-500/80 rounded-xl shadow-2xl text-slate-100 font-sans my-6 space-y-4">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-amber-500/30 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : isBuffering ? 'bg-amber-400 animate-pulse' : 'bg-rose-500'}`} />
          <h2 className="text-lg font-bold font-mono uppercase tracking-wider text-amber-400">
            YOUTUBE PLAYER ISOLATED TEST BED (PHASE 1 - 16)
          </h2>
        </div>
        <div className="text-xs font-mono px-2 py-1 bg-amber-950/60 border border-amber-500/40 rounded text-amber-300">
          STATUS: {isPlaying ? '🟢 REAL PLAYING (STATE = 1)' : isBuffering ? '🟡 BUFFERING (STATE = 3)' : '🔴 STOPPED / IDLE'}
        </div>
      </div>

      {/* Main Grid: Player on Left, Diagnostics on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column: Official Embedded Player Frame */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 uppercase flex items-center justify-between">
            <span>OFFICIAL YOUTUBE IFRAME CANVAS</span>
            <span className="text-amber-300 font-bold">CONTAINER ID: #isolated-yt-player-target</span>
          </div>

          <div className="relative w-full aspect-video bg-black rounded-lg border-2 border-amber-600/60 overflow-hidden shadow-inner flex items-center justify-center">
            <div ref={containerRef} className="w-full h-full" />
          </div>

          {/* User Test Action Controls */}
          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={handleTestPlay}
              disabled={!diagnostics.playerReady}
              className={`flex-1 py-2 px-3 font-bold font-mono text-xs uppercase rounded shadow-lg transition-all flex items-center justify-center gap-2 ${
                diagnostics.playerReady
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <PlayIcon className="w-4 h-4 fill-current" />
              <span>[ TEST YOUTUBE PLAYBACK ]</span>
            </button>

            {isPlaying && (
              <button
                onClick={handleTestPause}
                className="py-2 px-4 bg-amber-600 hover:bg-amber-500 text-white font-bold font-mono text-xs uppercase rounded shadow flex items-center justify-center gap-1.5"
              >
                <PauseIcon className="w-4 h-4 fill-current" />
                <span>PAUSE</span>
              </button>
            )}
          </div>

          {/* Test Video Selector */}
          <div className="p-2.5 bg-[#181b28] border border-slate-700 rounded text-xs space-y-1.5 font-mono">
            <div className="text-slate-400 uppercase text-[10px]">SELECT ISOLATED TEST VIDEO ID:</div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedVideoId(YOUTUBE_TEST_CONFIG.TEST_VIDEO_ID)}
                className={`flex-1 py-1 px-2 rounded text-[11px] font-bold border ${
                  selectedVideoId === YOUTUBE_TEST_CONFIG.TEST_VIDEO_ID
                    ? 'bg-amber-600 text-white border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Barsaat (ebZj_nrmH-c)
              </button>
              <button
                onClick={() => setSelectedVideoId(YOUTUBE_TEST_CONFIG.FALLBACK_TEST_VIDEO_ID)}
                className={`flex-1 py-1 px-2 rounded text-[11px] font-bold border ${
                  selectedVideoId === YOUTUBE_TEST_CONFIG.FALLBACK_TEST_VIDEO_ID
                    ? 'bg-amber-600 text-white border-amber-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                Tum Hi Ho (Umqb9KENgmk)
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic & Error Panel */}
        <div className="space-y-2 text-xs font-mono bg-[#0d0f17] p-3 rounded-lg border border-slate-800">
          <div className="text-amber-400 font-bold uppercase tracking-wide border-b border-slate-800 pb-1.5 flex justify-between items-center">
            <span>YOUTUBE PLAYBACK DIAGNOSTIC</span>
            <span className="text-[10px] text-slate-400">{diagnostics.origin}</span>
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
            <div className="text-slate-400">API READY:</div>
            <div className={`font-bold ${diagnostics.apiReady ? 'text-emerald-400' : 'text-amber-400'}`}>
              {diagnostics.apiReady ? 'YES ✔' : 'NO ⌛'}
            </div>

            <div className="text-slate-400">PLAYER READY:</div>
            <div className={`font-bold ${diagnostics.playerReady ? 'text-emerald-400' : 'text-amber-400'}`}>
              {diagnostics.playerReady ? 'YES ✔' : 'NO ⌛'}
            </div>

            <div className="text-slate-400">VIDEO ID:</div>
            <div className="text-cyan-300 font-bold truncate">{selectedVideoId}</div>

            <div className="text-slate-400">VIDEO LOADED:</div>
            <div className={`font-bold ${diagnostics.videoLoaded ? 'text-emerald-400' : 'text-slate-500'}`}>
              {diagnostics.videoLoaded ? 'YES ✔' : 'NO'}
            </div>

            <div className="text-slate-400">PLAY REQUEST SENT:</div>
            <div className={`font-bold ${diagnostics.playRequestSent ? 'text-emerald-400' : 'text-slate-500'}`}>
              {diagnostics.playRequestSent ? 'YES ✔' : 'NO'}
            </div>

            <div className="text-slate-400">STATE RECEIVED:</div>
            <div
              className={`font-bold ${
                diagnostics.playerState.includes('PLAYING')
                  ? 'text-emerald-400'
                  : diagnostics.playerState.includes('BUFFERING')
                  ? 'text-amber-300'
                  : diagnostics.playerState.includes('ERROR')
                  ? 'text-rose-400'
                  : 'text-slate-300'
              }`}
            >
              {diagnostics.playerState}
            </div>

            <div className="text-slate-400">ERROR CODE:</div>
            <div className={`font-bold ${diagnostics.errorCode ? 'text-rose-400' : 'text-slate-400'}`}>
              {diagnostics.errorCode ? `${diagnostics.errorCode}` : 'NONE'}
            </div>

            <div className="text-slate-400">IFRAME CREATED:</div>
            <div className={`font-bold ${diagnostics.iframeCreated ? 'text-emerald-400' : 'text-slate-500'}`}>
              {diagnostics.iframeCreated ? 'YES ✔' : 'NO'}
            </div>

            <div className="text-slate-400">IFRAME BLOCKED:</div>
            <div className={`font-bold ${diagnostics.iframeBlocked ? 'text-rose-400' : 'text-emerald-400'}`}>
              {diagnostics.iframeBlocked ? 'YES ⚠' : 'NO'}
            </div>

            <div className="text-slate-400">HTTPS PROTOCOL:</div>
            <div className={`font-bold ${diagnostics.isHttps ? 'text-emerald-400' : 'text-amber-400'}`}>
              {diagnostics.isHttps ? 'YES (HTTPS)' : 'NO (HTTP)'}
            </div>
          </div>

          {diagnostics.errorMessage && (
            <div className="mt-2 p-2 bg-rose-950/80 border border-rose-600/60 rounded text-[10px] text-rose-200 space-y-1">
              <div className="font-bold uppercase text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>DIAGNOSTIC ERROR DETECTED</span>
              </div>
              <p>{diagnostics.errorMessage}</p>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 truncate">
            BROWSER: {diagnostics.browser.substring(0, 60)}...
          </div>
        </div>
      </div>
    </div>
  );
};
