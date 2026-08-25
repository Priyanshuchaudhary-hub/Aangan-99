/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — DEVELOPER DEBUG PANEL
   Layer 21 Verified Provider State, Real-Time ID Matching & Automated Test Suite.
   Toggle via Shift+D or the [DEBUG] toolbar badge.
   ========================================================================= */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  X,
  Disc,
  Volume2,
  ShieldAlert,
  Cpu,
  ListMusic,
  RefreshCw,
  Radio,
  ShieldCheck,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Search
} from 'lucide-react';
import { useMusic } from '../context/MusicContext.tsx';
import { MUSIC_PROVIDERS_CONFIG } from '../music/config.ts';
import { YouTubePlayer } from '../music/youtube/YouTubePlayer.ts';
import { NOSTALGIA_TRACKS } from '../data/musicData.ts';
import { YouTubeTestPlayer } from './YouTubeTestPlayer.tsx';
import { VerifyPlaylistModal } from './VerifyPlaylistModal.tsx';
import { runMusicEngineTests, TestResultItem, TestSuiteSummary } from '../music/tests/musicEngineTests.ts';
import {
  convertSearchResultToNostalgiaTrack,
  VERIFIED_DISCOVERY_CATALOG,
  getLatestSearchDebugInfo,
  subscribeSearchDebugInfo,
  SearchDebugInfo
} from '../music/youtube/youtubeSearch.ts';

export const DeveloperDebugPanel: React.FC = () => {
  const [showIsolatedTest, setShowIsolatedTest] = useState<boolean>(false);
  const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'TELEMETRY' | 'TEST_SUITE'>('TELEMETRY');
  const [isRunningTests, setIsRunningTests] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [testSummary, setTestSummary] = useState<TestSuiteSummary | null>(null);
  const [searchDebug, setSearchDebug] = useState<SearchDebugInfo>(getLatestSearchDebugInfo());

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
    switchProvider,
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
    verifiedSongs,
    playVerifiedSong,
    playTumHiHo,
    playKhaabonKeParinday,
    playAankhonMeinTeri
  } = useMusic();

  const [playerVideoId, setPlayerVideoId] = useState<string>('');

  // Poll player video ID for real-time telemetry
  useEffect(() => {
    if (!isDebugPanelOpen) return;
    const interval = setInterval(() => {
      const vid = YouTubePlayer.getInstance().getCurrentVideoId();
      setPlayerVideoId(vid || '');
    }, 400);
    return () => clearInterval(interval);
  }, [isDebugPanelOpen]);

  // Subscribe to search telemetry
  useEffect(() => {
    return subscribeSearchDebugInfo((info) => {
      setSearchDebug(info);
    });
  }, []);

  if (!isDebugPanelOpen) return null;

  const providerInfo = MUSIC_PROVIDERS_CONFIG[providerType];

  const selectedVideoId =
    currentTrack?.videoId ||
    currentTrack?.youtubeVideoId ||
    currentTrack?.youtubeId ||
    currentTrack?.providerTrackId ||
    '';

  const isIdMatch =
    selectedVideoId && playerVideoId
      ? selectedVideoId.trim() === playerVideoId.trim()
      : playbackState === 'IDLE' || providerType !== 'youtube';

  const handleRunTests = async () => {
    setIsRunningTests(true);
    setTestSummary(null);
    try {
      const summary = await runMusicEngineTests((updated) => {
        setTestResults(updated);
      });
      setTestSummary(summary);
    } catch (e) {
      console.error('Error running test suite:', e);
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 select-none max-w-[95vw]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          className="w-80 md:w-[500px] bg-[#0c0d12]/95 border-2 border-[#f59e0b] rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.95)] text-[#e2e8f0] font-mono text-xs overflow-hidden backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#1a1c24] border-b border-[#2d3242]">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#f59e0b]" />
              <span className="font-bold text-[#fcd34d] tracking-wider uppercase">
                MUSIC ENGINE TELEMETRY & TEST HARNESS
              </span>
            </div>
            <button
              onClick={() => setIsDebugPanelOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-[#141722] border-b border-[#232838]">
            <button
              onClick={() => setActiveTab('TELEMETRY')}
              className={`flex-1 py-1.5 px-3 font-bold text-[11px] uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'TELEMETRY'
                  ? 'bg-[#1e2333] text-[#f59e0b] border-b-2 border-[#f59e0b]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>LIVE TELEMETRY</span>
            </button>
            <button
              onClick={() => setActiveTab('TEST_SUITE')}
              className={`flex-1 py-1.5 px-3 font-bold text-[11px] uppercase tracking-wide flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'TEST_SUITE'
                  ? 'bg-[#1e2333] text-[#f59e0b] border-b-2 border-[#f59e0b]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TEST HARNESS {testSummary ? (testSummary.allPassed ? '● [PASS]' : '● [FAIL]') : ''}</span>
            </button>
          </div>

          {/* Top Actions */}
          <div className="p-2 bg-[#10121a] border-b border-[#232838] flex gap-2">
            <button
              onClick={() => setShowVerifyModal(true)}
              className="flex-1 py-1 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold text-[10px] uppercase tracking-wide flex items-center justify-center gap-1.5 shadow"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>AUDIT ALL PLAYLIST IDS</span>
            </button>
            <button
              onClick={() => setShowIsolatedTest(!showIsolatedTest)}
              className={`flex-1 py-1 px-2.5 rounded font-bold text-[10px] uppercase tracking-wide flex items-center justify-center gap-1.5 ${
                showIsolatedTest
                  ? 'bg-amber-500 text-black shadow'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{showIsolatedTest ? 'HIDE TEST BED' : 'ISOLATED TEST BED'}</span>
            </button>
          </div>

          <VerifyPlaylistModal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} />

          {/* Isolated Test View */}
          {showIsolatedTest && (
            <div className="p-2 max-h-[70vh] overflow-y-auto">
              <YouTubeTestPlayer />
            </div>
          )}

          {/* Tab 1: Live Telemetry */}
          {!showIsolatedTest && activeTab === 'TELEMETRY' && (
            <div className="p-3.5 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* Real-time ID Matching Status Banner */}
              <div
                className={`p-2.5 rounded-lg border flex items-center justify-between font-bold ${
                  isIdMatch
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                    : 'bg-rose-950/90 border-rose-500/80 text-rose-300 animate-pulse'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isIdMatch ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                  <div>
                    <span className="text-[10px] block opacity-80 uppercase">ID SYNCHRONIZATION STATUS</span>
                    <span className="text-xs">{isIdMatch ? 'ID MATCH: PASS (100% IN-SYNC)' : 'ID MATCH: FAIL (DESYNCHRONIZED)'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] block text-slate-400">ENGINE STATE</span>
                  <span className="text-xs uppercase">{playbackState}</span>
                </div>
              </div>

              {/* ID Breakdown Grid */}
              <div className="grid grid-cols-2 gap-2 bg-[#141722] p-2.5 rounded border border-[#232838] text-[11px]">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">SELECTED TRACK VIDEO ID</span>
                  <span className="font-bold text-amber-400 font-mono break-all">{selectedVideoId || 'NONE'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">ACTIVE PLAYER VIDEO ID</span>
                  <span className="font-bold text-emerald-400 font-mono break-all">{playerVideoId || 'NONE'}</span>
                </div>
              </div>

              {/* SEARCH DEBUG TELEMETRY CARD */}
              <div className="bg-[#141722] p-2.5 rounded border border-[#232838] space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1">
                  <div className="flex items-center gap-1.5 text-[#f59e0b] font-bold">
                    <Search className="w-3.5 h-3.5" />
                    <span className="uppercase tracking-wider">SEARCH DEBUG</span>
                  </div>
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase">
                    {searchDebug.cached ? 'CACHED' : searchDebug.apiStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] pt-0.5">
                  <div>
                    <span className="text-slate-400 block">Query:</span>
                    <span className="text-amber-200 font-bold break-all">{searchDebug.query || '(none)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Results:</span>
                    <span className="text-white font-bold">{searchDebug.resultsCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">First Video ID:</span>
                    <span className="text-cyan-300 font-bold break-all">{searchDebug.firstVideoId || '(none)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">API Status:</span>
                    <span
                      className={`font-bold ${
                        searchDebug.apiStatus.includes('200')
                          ? 'text-emerald-400'
                          : searchDebug.apiStatus.includes('QUOTA')
                          ? 'text-amber-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {searchDebug.apiStatus}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Embeddable:</span>
                    <span className={`font-bold ${searchDebug.embeddable ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {searchDebug.embeddable ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">ID Match:</span>
                    <span className={`font-bold ${isIdMatch ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isIdMatch ? 'PASS ✔' : 'FAIL ✖'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Active Track Overview */}
              <div className="bg-[#141722] p-2.5 rounded border border-[#232838] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase">CURRENT TRACK</span>
                  <span className="text-[10px] text-amber-300 font-bold">{currentTrack?.year || '1999'}</span>
                </div>
                <p className="font-bold text-white truncate text-xs">{currentTrack?.title || 'No Track Loaded'}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentTrack?.artist || 'Unknown Artist'}</p>
              </div>

              {/* Playback Controls & Quick Tests */}
              <div className="bg-[#141722] p-2.5 rounded border border-[#232838] space-y-2">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">QUICK ENGINE CONTROLS</span>
                <div className="flex items-center justify-between gap-1">
                  <button
                    onClick={previousTrack}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 flex-1 flex items-center justify-center"
                    title="Previous Track"
                  >
                    <SkipBack className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="p-1.5 bg-[#f59e0b] hover:bg-amber-400 text-black font-bold rounded flex-1 flex items-center justify-center gap-1"
                  >
                    {playbackState === 'PLAYING' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{playbackState === 'PLAYING' ? 'PAUSE' : 'PLAY'}</span>
                  </button>
                  <button
                    onClick={nextTrack}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200 flex-1 flex items-center justify-center"
                    title="Next Track"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={toggleShuffle}
                    className={`p-1.5 rounded flex items-center justify-center ${
                      isShuffle ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                    }`}
                    title="Toggle Shuffle"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={toggleRepeat}
                    className={`p-1.5 rounded flex items-center justify-center text-[10px] font-bold ${
                      repeatMode !== 'OFF' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                    }`}
                    title="Toggle Repeat"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Direct Track Select Buttons */}
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="text-[10px] text-slate-400 block uppercase">VERIFIED BASELINE TRACK TRIGGERS:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={playTumHiHo}
                      className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] truncate text-left border border-amber-500/30"
                    >
                      ▶ Tum Hi Ho
                    </button>
                    <button
                      onClick={playKhaabonKeParinday}
                      className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] truncate text-left border border-amber-500/30"
                    >
                      ▶ Khaabon Ke Parinday
                    </button>
                    <button
                      onClick={playAankhonMeinTeri}
                      className="py-1 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[10px] truncate text-left border border-amber-500/30"
                    >
                      ▶ Aankhon Mein Teri
                    </button>
                  </div>
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

              {/* Error Notice */}
              {errorDetails && (
                <div className="bg-rose-950/80 border border-rose-500/50 p-2.5 rounded text-[11px] text-rose-200 space-y-0.5">
                  <div className="flex items-center gap-1 font-bold text-rose-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>ENGINE NOTICE</span>
                  </div>
                  <p>{errorDetails}</p>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: 11-Test Harness */}
          {!showIsolatedTest && activeTab === 'TEST_SUITE' && (
            <div className="p-3.5 space-y-3 max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs uppercase">AUTOMATED ACCEPTANCE TEST HARNESS</h4>
                  <p className="text-[10px] text-slate-400">Verifies 11 core dynamic playback & state retention tests.</p>
                </div>
                <button
                  onClick={handleRunTests}
                  disabled={isRunningTests}
                  className={`py-1.5 px-3 rounded font-bold text-xs uppercase tracking-wide flex items-center gap-1.5 shadow ${
                    isRunningTests
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : 'bg-[#f59e0b] hover:bg-amber-400 text-black'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRunningTests ? 'animate-spin' : ''}`} />
                  <span>{isRunningTests ? 'RUNNING...' : 'RUN ALL 11 TESTS'}</span>
                </button>
              </div>

              {/* Test Results Summary Header */}
              {testSummary && (
                <div
                  className={`p-2 rounded border font-bold text-xs flex items-center justify-between ${
                    testSummary.allPassed
                      ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                      : 'bg-rose-950/80 border-rose-500/50 text-rose-300'
                  }`}
                >
                  <span>
                    SUITE STATUS: {testSummary.passed}/{testSummary.total} PASSED
                  </span>
                  <span className="text-[10px] uppercase">
                    {testSummary.allPassed ? 'ALL TESTS PASSED ✔' : 'SOME TESTS FAILED ✖'}
                  </span>
                </div>
              )}

              {/* Test List */}
              <div className="space-y-1.5">
                {testResults.length === 0 ? (
                  <div className="p-4 text-center bg-[#141722] rounded border border-[#232838] text-slate-400 text-[11px]">
                    Click &ldquo;RUN ALL 11 TESTS&rdquo; to execute the automated playback verification harness.
                  </div>
                ) : (
                  testResults.map((t) => (
                    <div
                      key={t.id}
                      className={`p-2 rounded border text-[11px] ${
                        t.status === 'PASS'
                          ? 'bg-[#101918] border-emerald-500/30 text-slate-300'
                          : t.status === 'FAIL'
                          ? 'bg-[#1a1215] border-rose-500/40 text-rose-200'
                          : 'bg-[#141722] border-blue-500/40 text-blue-200 animate-pulse'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <div className="flex items-center gap-1.5">
                          {t.status === 'PASS' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : t.status === 'FAIL' ? (
                            <XCircle className="w-3.5 h-3.5 text-rose-400" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                          )}
                          <span className="text-white">{t.name}</span>
                        </div>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                            t.status === 'PASS'
                              ? 'bg-emerald-950 text-emerald-400'
                              : t.status === 'FAIL'
                              ? 'bg-rose-950 text-rose-400'
                              : 'bg-blue-950 text-blue-400'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">{t.message}</p>
                      {t.expectedVideoId && t.status !== 'RUNNING' && (
                        <div className="mt-1 flex items-center justify-between text-[9px] text-slate-500 border-t border-slate-800/60 pt-0.5">
                          <span>EXP ID: {t.expectedVideoId}</span>
                          <span>ACT ID: {t.actualVideoId || 'N/A'}</span>
                          <span>{t.durationMs}ms</span>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Footer status line */}
          <div className="px-3 py-1.5 bg-[#12141c] border-t border-[#232838] text-[10px] text-slate-400 flex justify-between items-center">
            <span>Press Shift+D to toggle debug overlay</span>
            <span
              className={`font-bold uppercase ${
                isIdMatch ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {isIdMatch ? 'ID MATCH: PASS ●' : 'ID MATCH: FAIL ●'}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

