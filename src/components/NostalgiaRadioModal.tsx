/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — FULL-SCREEN NOSTALGIA RADIO MODAL
   Cinematic music experience with verified provider playback, playlists, queue, & radio host.
   ========================================================================= */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { YouTubeProviderService } from '../music/youtube/YouTubeProvider.ts';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Radio,
  Disc,
  Heart,
  ListMusic,
  Sparkles,
  Shuffle,
  Repeat,
  ExternalLink,
  Search,
  Filter,
  History,
  Clock,
  Compass,
  Bookmark,
  Music,
  Settings,
  Terminal,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext.tsx';
import { NOSTALGIA_TRACKS, NOSTALGIA_PLAYLISTS, RADIO_HOST_QUOTES } from '../data/musicData.ts';
import { NostalgiaTrack, NostalgiaPlaylist } from '../music/types.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import { MUSIC_PROVIDERS_CONFIG } from '../music/config.ts';
import { useTrackVisual } from '../hooks/useTrackVisual.ts';

interface NostalgiaRadioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMemory?: (memorySlug: string) => void;
}

type ModalTab = 'now-playing' | 'playlists' | 'search-explore' | 'my-mix';

export const NostalgiaRadioModal: React.FC<NostalgiaRadioModalProps> = ({
  isOpen,
  onClose,
  onOpenMemory
}) => {
  const {
    currentTrack,
    playbackState,
    isPlaying,
    isLoading,
    isUnavailable,
    playbackProgress,
    currentTimeSeconds,
    durationSeconds,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    activePlaylist,
    queue,
    favoriteTrackIds,
    favoritePlaylistIds,
    listeningHistory,
    radioHostQuote,
    providerType,
    errorDetails,
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
    toggleFavoriteTrack,
    toggleFavoritePlaylist,
    removeFromQueue,
    triggerDiscoveryMode,
    setIsSetupModalOpen,
    setIsDebugPanelOpen,
    testYouTubePlayback,
    openSearchModal
  } = useMusic();

  const { visualUrl, status: visualStatus } = useTrackVisual(currentTrack);

  const [activeTab, setActiveTab] = useState<ModalTab>('now-playing');
  const [showQueue, setShowQueue] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEra, setSelectedEra] = useState<string>('ALL');
  const [selectedMood, setSelectedMood] = useState<string>('ALL');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('ALL');

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isFavTrack = favoriteTrackIds.includes(currentTrack.id);
  const providerConfig = MUSIC_PROVIDERS_CONFIG[providerType];

  // Filtered tracks for Search & Explore tab
  const filteredTracks = NOSTALGIA_TRACKS.filter((track) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesEra =
      selectedEra === 'ALL' ||
      (selectedEra === '1990s' && track.year >= 1990 && track.year <= 1999) ||
      (selectedEra === '2000-2004' && track.year >= 2000 && track.year <= 2004) ||
      (selectedEra === '2005-2009' && track.year >= 2005 && track.year <= 2009) ||
      (selectedEra === '2010+' && track.year >= 2010);

    const matchesMood = selectedMood === 'ALL' || track.mood.includes(selectedMood as any);
    const matchesLang = selectedLanguage === 'ALL' || track.language === selectedLanguage;

    return matchesSearch && matchesEra && matchesMood && matchesLang;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-black/85 backdrop-blur-lg overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-5xl bg-[#16100d] border-2 border-[#5c4231] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] text-[#e8ded1] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#231711] border-b border-[#473224] flex-shrink-0">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#f59e0b]" />
            <span className="font-pixel text-sm text-[#fcd34d] uppercase tracking-wider">
              THE NOSTALGIA RADIO — 103.4 FM
            </span>
            <button
              onClick={() => setIsSetupModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1 text-xs text-[#fcd34d] bg-[#362217] hover:bg-[#4d3222] px-2 py-0.5 rounded font-mono border border-[#6b4a35]"
            >
              <span>ENGINE: {providerConfig?.shortLabel}</span>
              <Settings className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDebugPanelOpen(true)}
              className="px-2 py-1 bg-[#1e2330] hover:bg-[#2c3346] border border-[#3f4a66] text-[#93c5fd] text-xs font-mono font-bold rounded flex items-center gap-1"
              title="Toggle Telemetry Debug Overlay (Shift+D)"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">DEBUG</span>
            </button>

            <button
              onClick={() => {
                audioSynthesizer.playClick('switch');
                triggerDiscoveryMode();
                setActiveTab('now-playing');
              }}
              className="px-3 py-1 bg-[#854d0e] hover:bg-[#a16207] border border-[#fef08a] text-[#fef08a] text-xs font-bold rounded flex items-center gap-1.5 transition-transform active:scale-95 shadow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Play Something I Remember</span>
            </button>

            <button
              onClick={() => {
                audioSynthesizer.playClick('switch');
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-[#3d291e] text-[#b8a28e] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center border-b border-[#3b281d] bg-[#1a120d] px-4 gap-2 overflow-x-auto flex-shrink-0 font-pixel text-xs">
          <button
            onClick={() => setActiveTab('now-playing')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'now-playing'
                ? 'border-[#f59e0b] text-[#fcd34d] font-bold'
                : 'border-transparent text-[#9a8573] hover:text-[#d4c1b0]'
            }`}
          >
            <Disc className="w-3.5 h-3.5" />
            <span>NOW PLAYING</span>
          </button>

          <button
            onClick={() => setActiveTab('playlists')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'playlists'
                ? 'border-[#f59e0b] text-[#fcd34d] font-bold'
                : 'border-transparent text-[#9a8573] hover:text-[#d4c1b0]'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>PLAYLISTS (10)</span>
          </button>

          <button
            onClick={() => setActiveTab('search-explore')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'search-explore'
                ? 'border-[#f59e0b] text-[#fcd34d] font-bold'
                : 'border-transparent text-[#9a8573] hover:text-[#d4c1b0]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>SEARCH & DISCOVER</span>
          </button>

          <button
            onClick={() => setActiveTab('my-mix')}
            className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'my-mix'
                ? 'border-[#f59e0b] text-[#fcd34d] font-bold'
                : 'border-transparent text-[#9a8573] hover:text-[#d4c1b0]'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>MY MIX & HISTORY</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: NOW PLAYING */}
          {activeTab === 'now-playing' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Artwork & Vinyl/Cassette Visualizer */}
              <div className="md:col-span-5 flex flex-col items-center space-y-4">
                <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border-4 border-[#5c402c] shadow-[0_12px_32px_rgba(0,0,0,0.8)] group bg-[#241710] flex items-center justify-center">
                  {visualUrl && visualStatus === 'loaded' ? (
                    <img
                      key={visualUrl}
                      src={visualUrl}
                      alt={currentTrack.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : visualStatus === 'loading' || isLoading ? (
                    <div className="w-full h-full bg-gradient-to-b from-[#1c1209] via-[#0f0a06] to-[#080503] flex flex-col items-center justify-center p-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/80 border border-amber-500/40 text-xs font-pixel text-amber-300 shadow animate-pulse">
                        <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        <span>TUNING SIGNAL...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1e130a] via-[#140c06] to-[#0a0603] flex items-center justify-center">
                      <Disc className="w-16 h-16 text-amber-500/20" />
                    </div>
                  )}

                  {/* Provider Overlay Badge */}
                  <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-pixel text-[#fcd34d] border border-[#523d2e] uppercase">
                    {providerConfig?.shortLabel}
                  </div>

                  {/* Vinyl spinning overlay */}
                  {isPlaying && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                      <div className="w-44 h-44 rounded-full border-4 border-[#f59e0b] bg-black/80 flex items-center justify-center animate-[spin_6s_linear_infinite] shadow-2xl">
                        <div className="w-16 h-16 rounded-full border-2 border-amber-300 bg-[#362115] flex items-center justify-center">
                          <Disc className="w-8 h-8 text-amber-400" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Radio Host Commentary Box */}
                {radioHostQuote && (
                  <div className="w-full bg-[#261a12] border border-[#4d3525] rounded-xl p-3.5 text-xs text-[#e0d3c3] space-y-1 font-serif shadow">
                    <div className="flex items-center justify-between text-[#f59e0b] font-pixel text-[10px]">
                      <span>🎙️ RJ SAMEER — 103.4 FM NOSTALGIA</span>
                      <span>{radioHostQuote.yearContext}</span>
                    </div>
                    <p className="italic text-[#f3e7d5]">"{radioHostQuote.quote}"</p>
                  </div>
                )}
              </div>

              {/* Right Column: Track Details, Story, Controls & Queue */}
              <div className="md:col-span-7 space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-xs bg-[#f59e0b] text-[#1c120c] font-bold px-2 py-0.5 rounded uppercase">
                      {currentTrack.year}
                    </span>
                    <span className="text-xs text-[#b8a08a] bg-[#291b12] px-2 py-0.5 rounded border border-[#422d20]">
                      {currentTrack.language}
                    </span>
                    {activePlaylist && (
                      <span className="text-xs text-[#fcd34d] bg-[#3d2719] px-2 py-0.5 rounded border border-[#6b472e]">
                        {activePlaylist.title}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#fff7ed]">{currentTrack.title}</h2>
                  <p className="text-sm text-[#baa592] font-serif">{currentTrack.artist} • {currentTrack.album}</p>
                </div>

                {/* Provider Fallback Notice if track cannot stream */}
                {isUnavailable && (
                  <div className="bg-red-950/80 border border-red-500/60 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center gap-1.5 text-red-400 font-bold text-xs uppercase font-pixel">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span>⚠ SIGNAL LOST</span>
                    </div>
                    <p className="text-xs text-red-200">
                      This song isn't available inside the embedded radio.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        onClick={async () => {
                          try {
                            const searchResults = await YouTubeProviderService.getInstance().search(`${currentTrack.title} ${currentTrack.artist}`);
                            if (searchResults.length > 0 && searchResults[0].youtubeVideoId) {
                              const alt = searchResults[0];
                              await playTrack({
                                ...currentTrack,
                                providerTrackId: alt.youtubeVideoId,
                                youtubeId: alt.youtubeVideoId
                              });
                            }
                          } catch (err) {
                            console.warn('Try another version failed:', err);
                          }
                        }}
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded uppercase tracking-wide transition-colors"
                      >
                        [ TRY ANOTHER VERSION ]
                      </button>
                      <a
                        href={currentTrack.externalUrl || `https://www.youtube.com/watch?v=${currentTrack.providerTrackId || currentTrack.youtubeId || ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white font-bold text-xs rounded uppercase tracking-wide transition-colors"
                      >
                        <span>[ OPEN ON YOUTUBE ]</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Track Story Note */}
                {currentTrack.storyNote && (
                  <div className="bg-[#21160e] border-l-4 border-[#f59e0b] p-3 rounded-r-xl text-xs text-[#d1c2b0] font-serif italic">
                    {currentTrack.storyNote}
                  </div>
                )}

                {/* Progress Slider */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={playbackProgress}
                    onChange={(e) => seekTo(Number(e.target.value))}
                    className="w-full h-2 bg-[#332318] accent-[#f59e0b] rounded cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-[#9c8673] font-mono">
                    <span>{formatTime(currentTimeSeconds)}</span>
                    <span>{formatTime(durationSeconds)}</span>
                  </div>
                </div>

                {/* Main Transport Controls */}
                <div className="flex items-center justify-between gap-2 bg-[#21160f] border border-[#402d20] p-3 rounded-xl shadow">
                  <button
                    onClick={() => toggleShuffle()}
                    className={`p-2 rounded border text-xs transition-colors ${
                      isShuffle
                        ? 'bg-[#b45309] border-[#f59e0b] text-white'
                        : 'bg-[#2b1c13] border-[#402d20] text-[#a38e7b] hover:text-white'
                    }`}
                    title="Shuffle"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => previousTrack()}
                    className="p-2 bg-[#332217] hover:bg-[#473022] border border-[#543b2a] text-[#f5e9dc] rounded-lg active:scale-95 transition-transform"
                    title="Previous"
                  >
                    <SkipBack className="w-5 h-5 fill-current" />
                  </button>

                  <button
                    onClick={() => togglePlayPause()}
                    disabled={isLoading || isUnavailable}
                    className="w-12 h-12 rounded-full bg-[#f59e0b] hover:bg-[#d97706] text-[#1c120c] font-bold shadow-lg flex items-center justify-center active:scale-95 transition-transform disabled:opacity-50"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-[#1c120c]" />
                    ) : isPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={() => nextTrack()}
                    className="p-2 bg-[#332217] hover:bg-[#473022] border border-[#543b2a] text-[#f5e9dc] rounded-lg active:scale-95 transition-transform"
                    title="Next"
                  >
                    <SkipForward className="w-5 h-5 fill-current" />
                  </button>

                  <button
                    onClick={() => toggleRepeat()}
                    className={`p-2 rounded border text-xs transition-colors ${
                      repeatMode !== 'OFF'
                        ? 'bg-[#b45309] border-[#f59e0b] text-white'
                        : 'bg-[#2b1c13] border-[#402d20] text-[#a38e7b] hover:text-white'
                    }`}
                    title={`Repeat: ${repeatMode}`}
                  >
                    <Repeat className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => toggleFavoriteTrack(currentTrack.id)}
                    className={`p-2 rounded border text-xs transition-colors ${
                      isFavTrack
                        ? 'bg-[#be123c] border-[#f43f5e] text-white'
                        : 'bg-[#2b1c13] border-[#402d20] text-[#a38e7b] hover:text-rose-400'
                    }`}
                    title="Favorite"
                  >
                    <Heart className={`w-4 h-4 ${isFavTrack ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Related Memories Link */}
                {currentTrack.memoryIds && currentTrack.memoryIds.length > 0 && onOpenMemory && (
                  <div className="bg-[#1d130c] border border-[#3d2a1d] p-3 rounded-xl space-y-2">
                    <span className="font-pixel text-[10px] text-[#fcd34d] uppercase block">
                      CHAPTER MEMORIES LINKED TO THIS SONG:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {currentTrack.memoryIds.map((memSlug) => (
                        <button
                          key={memSlug}
                          onClick={() => {
                            audioSynthesizer.playClick('switch');
                            if (onOpenMemory) onOpenMemory(memSlug);
                          }}
                          className="px-2.5 py-1 bg-[#2e1d14] hover:bg-[#422b1d] border border-[#4f3627] hover:border-[#f59e0b] text-xs text-[#e8d2be] rounded transition-all flex items-center gap-1"
                        >
                          <span>📖 View Memory ({memSlug})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PLAYLISTS */}
          {activeTab === 'playlists' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {NOSTALGIA_PLAYLISTS.map((pl) => {
                const isFav = favoritePlaylistIds.includes(pl.id);
                const isCurrentActive = activePlaylist?.id === pl.id;

                return (
                  <div
                    key={pl.id}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col justify-between group ${
                      isCurrentActive
                        ? 'bg-[#2e1d14] border-[#f59e0b] shadow-lg'
                        : 'bg-[#18100b] hover:bg-[#241710] border-[#3d2a1c]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <img
                          src={pl.coverImage}
                          alt={pl.title}
                          className="w-20 h-20 rounded-lg object-cover border border-[#523b2a] flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-pixel text-[10px] bg-[#422b1b] text-[#fcd34d] px-1.5 py-0.5 rounded uppercase">
                              {pl.era}
                            </span>
                            <button
                              onClick={() => toggleFavoritePlaylist(pl.id)}
                              className="text-[#8a725f] hover:text-rose-400 p-1"
                            >
                              <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-current' : ''}`} />
                            </button>
                          </div>
                          <h3 className="font-bold text-sm text-[#fef3c7] font-serif truncate">{pl.title}</h3>
                          <p className="text-xs text-[#a8937d] font-serif line-clamp-2">{pl.description}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#312015] mt-3 flex items-center justify-between">
                      <span className="text-xs font-mono text-[#8a725f]">
                        {pl.trackIds.length} Tracks
                      </span>

                      <button
                        onClick={() => {
                          audioSynthesizer.playClick('switch');
                          const tracks = NOSTALGIA_TRACKS.filter((t) => pl.trackIds.includes(t.id));
                          if (tracks.length > 0) {
                            playTrack(tracks[0], pl);
                            setActiveTab('now-playing');
                          }
                        }}
                        className="px-3 py-1 bg-[#854d0e] hover:bg-[#a16207] text-[#fef08a] font-bold text-xs rounded font-pixel uppercase flex items-center gap-1 shadow active:scale-95 transition-transform"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play Mix</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: SEARCH & DISCOVER */}
          {activeTab === 'search-explore' && (
            <div className="space-y-4">
              {/* Dynamic YouTube Archive Banner */}
              <div className="p-3.5 bg-gradient-to-r from-[#451a03] via-[#29140a] to-[#1a100a] border border-[#f59e0b]/50 rounded-xl flex items-center justify-between gap-3 shadow-md">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#f59e0b]" />
                    <span className="font-pixel text-xs text-[#fef08a] uppercase font-bold">
                      SEARCH THE ENTIRE YOUTUBE ARCHIVE
                    </span>
                  </div>
                  <p className="text-[11px] text-[#c4b3a2] font-sans">
                    Search millions of live Bollywood, Punjabi, and 90s/2000s classics with real embeddable playback.
                  </p>
                </div>

                <button
                  onClick={() => {
                    audioSynthesizer.playClick('switch');
                    openSearchModal(searchQuery);
                  }}
                  className="px-3.5 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-black font-pixel text-xs rounded-lg uppercase font-bold flex items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform shadow"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>SEARCH ARCHIVE</span>
                </button>
              </div>

              {/* Search input & filters */}
              <div className="p-4 bg-[#1e140d] border border-[#3b271a] rounded-xl space-y-3">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 absolute left-3 text-[#8c7460]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        openSearchModal(searchQuery);
                      }
                    }}
                    placeholder="Search songs, artists, TV themes, or nostalgia tags..."
                    className="w-full bg-[#120b08] border border-[#473223] rounded-lg pl-9 pr-20 py-2 text-xs text-[#f5e9dc] placeholder-[#7d6754] focus:outline-none focus:border-[#f59e0b]"
                  />
                  <button
                    onClick={() => openSearchModal(searchQuery)}
                    className="absolute right-1.5 px-2.5 py-1 bg-[#854d0e] hover:bg-[#a16207] text-[#fef08a] font-pixel text-[10px] rounded uppercase"
                  >
                    SEARCH
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <select
                    value={selectedEra}
                    onChange={(e) => setSelectedEra(e.target.value)}
                    className="bg-[#120b08] border border-[#473223] text-[#d6c4b2] rounded p-1.5 focus:outline-none"
                  >
                    <option value="ALL">All Eras</option>
                    <option value="1990s">1990s Classic</option>
                    <option value="2000-2004">2000–2004</option>
                    <option value="2005-2009">2005–2009</option>
                  </select>

                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-[#120b08] border border-[#473223] text-[#d6c4b2] rounded p-1.5 focus:outline-none"
                  >
                    <option value="ALL">All Languages</option>
                    <option value="Hindi">Hindi</option>
                    <option value="English">English</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Tamil">Tamil</option>
                  </select>

                  <select
                    value={selectedMood}
                    onChange={(e) => setSelectedMood(e.target.value)}
                    className="bg-[#120b08] border border-[#473223] text-[#d6c4b2] rounded p-1.5 focus:outline-none"
                  >
                    <option value="ALL">All Moods</option>
                    <option value="nostalgic">Nostalgic</option>
                    <option value="carefree">Carefree</option>
                    <option value="morning">Morning</option>
                    <option value="energetic">Energetic</option>
                    <option value="peaceful">Peaceful</option>
                  </select>
                </div>
              </div>

              {/* Track list */}
              <div className="space-y-2">
                {filteredTracks.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 bg-[#18100b] hover:bg-[#261911] border border-[#362418] hover:border-[#f59e0b] rounded-xl transition-all flex items-center justify-between group cursor-pointer"
                    onClick={() => {
                      audioSynthesizer.playClick('switch');
                      playTrack(tr);
                      setActiveTab('now-playing');
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={tr.artwork} alt={tr.title} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-pixel text-[9px] bg-[#382316] text-[#fcd34d] px-1 rounded">
                            {tr.year}
                          </span>
                          <h4 className="font-bold text-xs text-[#fef3c7] truncate">{tr.title}</h4>
                        </div>
                        <p className="text-[11px] text-[#a18c78] truncate">{tr.artist}</p>
                      </div>
                    </div>

                    <button className="p-2 bg-[#854d0e] hover:bg-[#a16207] text-[#fef08a] rounded-lg shadow font-pixel text-xs uppercase flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" />
                      <span className="hidden sm:inline">Play</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MY MIX & HISTORY */}
          {activeTab === 'my-mix' && (
            <div className="space-y-6">
              {/* Favorited Tracks */}
              <div className="space-y-2">
                <h3 className="font-pixel text-xs text-[#fcd34d] uppercase flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 fill-current" />
                  <span>FAVORITE TRACKS ({favoriteTrackIds.length})</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {favoriteTrackIds.map((trId) => {
                    const tr = NOSTALGIA_TRACKS.find((t) => t.id === trId);
                    if (!tr) return null;

                    return (
                      <div
                        key={trId}
                        onClick={() => {
                          audioSynthesizer.playClick('switch');
                          playTrack(tr);
                          setActiveTab('now-playing');
                        }}
                        className="p-2.5 bg-[#1a110b] hover:bg-[#291b12] border border-[#3b271a] rounded-lg cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={tr.artwork} alt={tr.title} className="w-8 h-8 rounded object-cover" />
                          <div className="min-w-0">
                            <p className="font-bold text-xs text-[#fce8d5] truncate">{tr.title}</p>
                            <p className="text-[10px] text-[#9c8672] truncate">{tr.artist}</p>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavoriteTrack(trId);
                          }}
                          className="text-rose-500 p-1"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Listening History */}
              <div className="space-y-2">
                <h3 className="font-pixel text-xs text-[#fcd34d] uppercase flex items-center gap-1.5">
                  <History className="w-4 h-4 text-[#f59e0b]" />
                  <span>RECENTLY PLAYED HISTORY</span>
                </h3>

                <div className="space-y-1.5">
                  {listeningHistory.slice(0, 8).map((hist, idx) => {
                    const tr = NOSTALGIA_TRACKS.find((t) => t.id === hist.trackId);
                    if (!tr) return null;

                    return (
                      <div
                        key={idx}
                        className="p-2 bg-[#140c08] border border-[#2d1b10] rounded text-xs flex items-center justify-between text-[#c4b3a2]"
                      >
                        <span className="font-bold text-[#fef3c7] truncate max-w-[200px]">{tr.title}</span>
                        <span className="text-[10px] text-[#826e5d]">{new Date(hist.playedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-[#1a120c] border-t border-[#382619] text-xs font-mono text-[#a38e7b] flex items-center justify-between">
          <span>SUMMER VACATION.EXE • NOSTALGIA AUDIO ENGINE</span>
          <span className="text-[#fcd34d]">STEREO 103.4 FM</span>
        </div>
      </motion.div>
    </div>
  );
};
