/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — DYNAMIC YOUTUBE ARCHIVE SEARCH MODAL
   Layer 20: Search YouTube Data API v3, Smart Ranking, Nostalgia Mode,
   Queue, Mixes, and Memory Association.
   ========================================================================= */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Play,
  Plus,
  Heart,
  Sparkles,
  Radio,
  Youtube,
  Music,
  Filter,
  Loader2,
  Disc,
  Clock,
  ArrowRight,
  ExternalLink,
  ListMusic,
  Bookmark,
  Calendar,
  Layers,
  Check,
  AlertTriangle,
  FolderPlus,
  Compass,
  LayoutList,
  Grid
} from 'lucide-react';
import { useMusic } from '../context/MusicContext.tsx';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import {
  searchYouTubeMusic,
  YouTubeSearchResultTrack,
  YouTubeSearchMode,
  SearchState,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  getUserMixes,
  createNewMix,
  addTrackToMix,
  saveTrackToMemory,
  getMemorySearchSuggestions,
  convertSearchResultToNostalgiaTrack,
  VERIFIED_DISCOVERY_CATALOG,
  CustomUserMix
} from '../music/youtube/youtubeSearch.ts';

const PREDEFINED_CATEGORIES = [
  { id: '90s-pop', label: '90s Pop', query: '90s Pop Songs Hits', icon: '📻' },
  { id: 'bollywood-classics', label: 'Bollywood Classics', query: 'Classic Bollywood Golden Hits', icon: '🎬' },
  { id: 'cartoons', label: 'Cartoons', query: 'Nostalgic Cartoon Title Tracks Hindi', icon: '📺' },
  { id: 'indie', label: 'Indie', query: 'Indian Indie Underground Hits', icon: '🎸' },
  { id: '2000s-romance', label: '2000s Romance', query: '2000s Romantic Hits Bollywood', icon: '💖' },
  { id: 'punjabi-hits', label: 'Punjabi Hits', query: 'Nostalgic Punjabi Pop Hits', icon: '🥁' },
  { id: 'lofi-chill', label: 'Lofi & Chill', query: 'Nostalgic Indian Lofi Chill', icon: '☕' }
];

const QUICK_SEARCH_EXAMPLES = [
  'Tum Hi Ho',
  'Arijit Singh',
  'Aankhon Mein Teri',
  '2000s Bollywood',
  'Punjabi nostalgia',
  'English 2000s',
  'Rain songs',
  'Summer vacation songs',
  'Iktara',
  'Kabira',
  'Dil Chahta Hai'
];

const SEARCH_MODES: YouTubeSearchMode[] = [
  'ALL',
  'SONGS',
  'ARTISTS',
  'PLAYLISTS',
  'NOSTALGIA',
  'BOLLYWOOD',
  'PUNJABI',
  'ENGLISH',
  '2000s',
  '2010s'
];

interface SongSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  targetMemoryId?: string;
}

export const SongSearchModal: React.FC<SongSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  targetMemoryId
}) => {
  const {
    currentTrack,
    playTrack,
    addToQueue,
    favoriteTrackIds,
    toggleFavoriteTrack,
    setIsFullPlayerOpen
  } = useMusic();

  const [query, setQuery] = useState<string>(initialQuery);
  const [selectedMode, setSelectedMode] = useState<YouTubeSearchMode>('ALL');
  const [isNostalgiaMode, setIsNostalgiaMode] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'search' | 'discover' | 'my-mixes'>('search');

  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchState, setSearchState] = useState<SearchState>('IDLE');
  const [results, setResults] = useState<YouTubeSearchResultTrack[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Modals for adding to custom mix / saving to memory
  const [selectedTrackForMix, setSelectedTrackForMix] = useState<YouTubeSearchResultTrack | null>(null);
  const [selectedTrackForMemory, setSelectedTrackForMemory] = useState<YouTubeSearchResultTrack | null>(null);
  const [userMixes, setUserMixes] = useState<CustomUserMix[]>([]);
  const [newMixName, setNewMixName] = useState<string>('');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Sync initial query and focus
  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches());
      setUserMixes(getUserMixes());
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 2800);
  };

  // Perform search
  const executeSearch = async (searchTerm: string, modeOverride?: YouTubeSearchMode) => {
    const q = searchTerm.trim();
    if (!q) {
      setSearchState('IDLE');
      setResults([]);
      setErrorMessage(null);
      return;
    }

    setSearchState('SEARCHING');
    setErrorMessage(null);

    const mode = modeOverride || selectedMode;

    try {
      const response = await searchYouTubeMusic(q, {
        mode,
        nostalgiaMode: isNostalgiaMode,
        maxResults: 20
      });

      setSearchState(response.state);
      setResults(response.results);
      if (response.error) {
        setErrorMessage(response.error);
      }
      setRecentSearches(getRecentSearches());
    } catch (err: any) {
      console.warn('[SEARCH MODAL] Search error:', err);
      setSearchState('NETWORK_ERROR');
      setErrorMessage('The radio archive is temporarily offline.');
      setResults([]);
    }
  };

  // Debounced auto-search when query changes (or enter triggered)
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setSearchState('IDLE');
      setErrorMessage(null);
      return;
    }

    const timer = setTimeout(() => {
      executeSearch(query, selectedMode);
    }, 450);

    return () => clearTimeout(timer);
  }, [query, selectedMode, isNostalgiaMode]);

  if (!isOpen) return null;

  const handlePlayResult = async (track: YouTubeSearchResultTrack) => {
    audioSynthesizer.playClick('switch');
    const nostalgiaTrack = convertSearchResultToNostalgiaTrack(track);
    await playTrack(nostalgiaTrack);
    showToast(`▶ Now Playing: "${track.title.slice(0, 24)}..."`);
    setIsFullPlayerOpen(true);
    onClose();
  };

  const handleAddToQueue = (track: YouTubeSearchResultTrack) => {
    audioSynthesizer.playClick('soft');
    const nostalgiaTrack = convertSearchResultToNostalgiaTrack(track);
    addToQueue(nostalgiaTrack);
    showToast(`+ Added to Queue: "${track.title.slice(0, 24)}..."`);
  };

  const handleSaveToMemory = (track: YouTubeSearchResultTrack, memoryId: string) => {
    saveTrackToMemory(track, memoryId);
    audioSynthesizer.playClick('soft');
    setSelectedTrackForMemory(null);
    showToast(`💾 Saved to Memory: "${memoryId.replace('-', ' ').toUpperCase()}"`);
  };

  const handleAddTrackToMix = (mixId: string, track: YouTubeSearchResultTrack) => {
    addTrackToMix(mixId, track);
    setUserMixes(getUserMixes());
    setSelectedTrackForMix(null);
    audioSynthesizer.playClick('soft');
    showToast(`📼 Saved to Mix!`);
  };

  const handleCreateNewMix = () => {
    if (!newMixName.trim()) return;
    const newMix = createNewMix(newMixName.trim());
    if (selectedTrackForMix) {
      addTrackToMix(newMix.id, selectedTrackForMix);
    }
    setUserMixes(getUserMixes());
    setNewMixName('');
    setSelectedTrackForMix(null);
    audioSynthesizer.playClick('soft');
    showToast(`✨ Created Mix: "${newMix.name}"`);
  };

  const memorySuggestions = targetMemoryId ? getMemorySearchSuggestions(targetMemoryId) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-5xl bg-gradient-to-b from-[#24170e] via-[#1a100a] to-[#120a06] border-2 border-[#5c402c] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Toast Notification */}
        {feedbackToast && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-[#f59e0b] text-black font-pixel text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 border border-yellow-300 animate-bounce">
            <Check className="w-3.5 h-3.5" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="p-4 md:p-5 border-b border-[#3b271a] bg-[#2a1a10]/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#b45309]/25 border border-[#f59e0b]/50 flex items-center justify-center text-[#fcd34d] shadow-inner">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold text-[#fef3c7] font-serif-vintage tracking-wide">
                  SEARCH THE ARCHIVE
                </h2>
                <span className="text-[10px] font-pixel bg-[#f59e0b] text-black px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                  YOUTUBE API v3
                </span>
                {isNostalgiaMode && (
                  <span className="text-[10px] font-mono bg-[#854d0e] text-[#fef08a] px-2 py-0.5 rounded-full border border-yellow-600/60 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> NOSTALGIA MODE
                  </span>
                )}
              </div>
              <p className="text-xs text-[#a8937d] font-handwriting">
                Discover real songs, artists, and soundtrack memories available on YouTube
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNostalgiaMode((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all flex items-center gap-1.5 ${
                isNostalgiaMode
                  ? 'bg-[#451a03] text-[#fcd34d] border-[#f59e0b]'
                  : 'bg-[#180e08] text-[#8c7460] border-[#382315]'
              }`}
              title="Toggle Nostalgia Filter (Prioritize 1990–2019 music)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Nostalgia Bias:</span>
              <span className="font-bold">{isNostalgiaMode ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => {
                audioSynthesizer.playClick('soft');
                onClose();
              }}
              className="p-2 text-[#9a8573] hover:text-[#fef3c7] hover:bg-[#3d2719] rounded-lg transition-colors"
              title="Close Search (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar Input Container */}
        <div className="p-4 bg-[#180e08] border-b border-[#332014] space-y-3">
          {/* Target Memory Suggestion Banner */}
          {targetMemoryId && memorySuggestions.length > 0 && (
            <div className="p-2.5 bg-[#2d1b10] border border-[#b45309]/40 rounded-xl flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-[#fef08a] font-mono">
                <Bookmark className="w-4 h-4 text-[#f59e0b]" />
                <span>FIND SONGS FOR THIS MEMORY:</span>
                <span className="font-bold text-amber-400 uppercase">
                  {targetMemoryId.replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto text-[11px] no-scrollbar">
                {memorySuggestions.slice(0, 3).map((sug) => (
                  <button
                    key={sug}
                    onClick={() => {
                      setQuery(sug);
                      executeSearch(sug);
                    }}
                    className="px-2 py-0.5 bg-[#120a06] hover:bg-[#451a03] text-[#fcd34d] rounded border border-[#523826] flex-shrink-0"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pre-defined Discovery Category Buttons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#8c7460] uppercase">
              <span className="flex items-center gap-1 font-pixel text-[10px] text-[#f59e0b] tracking-wider">
                <Compass className="w-3 h-3 text-amber-400" /> DISCOVER CATEGORIES
              </span>
              <span className="text-[10px] text-[#7d6451] hidden sm:inline">Click to load pre-set archive search</span>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {PREDEFINED_CATEGORIES.map((cat) => {
                const isSelected = query.toLowerCase() === cat.query.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      audioSynthesizer.playClick('soft');
                      setActiveTab('search');
                      setQuery(cat.query);
                      executeSearch(cat.query);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 flex-shrink-0 border shadow-sm ${
                      isSelected
                        ? 'bg-[#854d0e] text-[#fef08a] border-[#f59e0b] ring-1 ring-[#f59e0b]/50'
                        : 'bg-[#24170f] text-[#d6c4b2] border-[#422c1d] hover:border-[#f59e0b] hover:text-[#fef3c7] hover:bg-[#332014]'
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-3.5 text-[#f59e0b] pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  executeSearch(query);
                }
              }}
              placeholder="Search songs, artists, memories... (e.g. Tum Hi Ho, Arijit Singh, Aankhon Mein Teri, 2000s Bollywood)"
              className="w-full bg-[#0f0805] border-2 border-[#523826] focus:border-[#f59e0b] rounded-xl pl-11 pr-24 py-3 text-sm text-[#fef08a] placeholder-[#7d6451] outline-none shadow-inner transition-all font-mono"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-20 text-[#8c7460] hover:text-[#fef3c7] p-1 rounded"
                title="Clear input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => executeSearch(query)}
              className="absolute right-2 px-3 py-1.5 bg-[#854d0e] hover:bg-[#a16207] text-[#fef08a] font-pixel text-xs rounded-lg uppercase transition-all shadow"
            >
              SEARCH
            </button>
          </div>

          {/* Quick Search Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[10px] font-pixel text-[#8c7460] uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-1">
              <Sparkles className="w-3 h-3 text-[#f59e0b]" /> Quick Searches:
            </span>
            {QUICK_SEARCH_EXAMPLES.map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  audioSynthesizer.playClick('soft');
                  setQuery(chip);
                  executeSearch(chip);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all flex-shrink-0 border ${
                  query.toLowerCase() === chip.toLowerCase()
                    ? 'bg-[#854d0e] text-[#fef08a] border-[#f59e0b]'
                    : 'bg-[#24170f] text-[#c2ad94] border-[#3d281a] hover:border-[#f59e0b] hover:text-[#fef3c7]'
                }`}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Search Modes & Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 font-mono text-xs no-scrollbar">
            <span className="text-[10px] font-pixel text-[#8c7460] uppercase flex items-center gap-1 mr-1 flex-shrink-0">
              <Filter className="w-3 h-3 text-amber-500" /> Mode:
            </span>
            {SEARCH_MODES.map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  audioSynthesizer.playClick('soft');
                  setSelectedMode(mode);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase transition-all flex-shrink-0 border ${
                  selectedMode === mode
                    ? 'bg-[#f59e0b] text-black font-bold border-yellow-300'
                    : 'bg-[#180e08] text-[#a8937d] border-[#382315] hover:border-[#f59e0b]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher: SEARCH RESULTS | DISCOVER SECTIONS | MY MIXES */}
        <div className="flex border-b border-[#332014] bg-[#1a100a] text-xs font-mono px-4">
          <button
            onClick={() => setActiveTab('search')}
            className={`py-2.5 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'search'
                ? 'border-[#f59e0b] text-[#fcd34d] bg-[#291a10]/50'
                : 'border-transparent text-[#8c7460] hover:text-[#d6c4b2]'
            }`}
          >
            <Search className="w-4 h-4 text-[#f59e0b]" />
            <span>
              {searchState === 'SEARCHING'
                ? 'SCANNING ARCHIVE...'
                : `RESULTS (${results.length})`}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('discover')}
            className={`py-2.5 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'discover'
                ? 'border-[#f59e0b] text-[#fcd34d] bg-[#291a10]/50'
                : 'border-transparent text-[#8c7460] hover:text-[#d6c4b2]'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>DISCOVER CATALOGS</span>
          </button>

          <button
            onClick={() => setActiveTab('my-mixes')}
            className={`py-2.5 px-4 font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'my-mixes'
                ? 'border-[#f59e0b] text-[#fcd34d] bg-[#291a10]/50'
                : 'border-transparent text-[#8c7460] hover:text-[#d6c4b2]'
            }`}
          >
            <ListMusic className="w-4 h-4 text-emerald-400" />
            <span>MY MIXES ({userMixes.length})</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SEARCH RESULTS */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              {/* Status Banner */}
              {searchState === 'SEARCHING' && (
                <div className="p-8 text-center bg-[#180e08] rounded-2xl border border-[#3b271a] flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#f59e0b] animate-spin" />
                  <p className="text-sm font-mono text-[#fef3c7] font-bold">Scanning the archive...</p>
                  <p className="text-xs text-[#8c7460] font-mono">
                    Querying YouTube Data API v3 & validating embeddable stream channels...
                  </p>
                </div>
              )}

              {searchState === 'QUOTA_EXCEEDED' && (
                <div className="p-4 bg-amber-950/60 border border-amber-600/70 rounded-xl text-xs text-amber-200 font-mono flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold uppercase tracking-wider block">
                      THE ARCHIVE HAS REACHED ITS DAILY LIMIT.
                    </span>
                    <span>
                      Serving verified nostalgic catalog backup with real YouTube embeddable playback.
                    </span>
                  </div>
                </div>
              )}

              {searchState === 'NETWORK_ERROR' && (
                <div className="p-4 bg-red-950/60 border border-red-700/60 rounded-xl text-xs text-red-300 font-mono flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold uppercase block">The radio archive is temporarily offline.</span>
                    <span>Serving cached verified tracks.</span>
                  </div>
                </div>
              )}

              {searchState === 'NO_RESULTS' && (
                <div className="p-8 text-center bg-[#180e08] rounded-2xl border border-[#3b271a] space-y-2">
                  <Disc className="w-8 h-8 text-[#7d6451] mx-auto opacity-50" />
                  <p className="text-sm font-mono text-[#fef3c7] font-bold">Nothing found in the archive.</p>
                  <p className="text-xs text-[#8c7460] font-mono">
                    Try searching for "Tum Hi Ho", "Aankhon Mein Teri", or "2000s Bollywood".
                  </p>
                </div>
              )}

              {searchState === 'IDLE' && (
                <div className="space-y-4">
                  <div className="p-6 text-center bg-[#180e08] rounded-2xl border border-[#332014] space-y-3">
                    <Radio className="w-8 h-8 text-[#f59e0b] mx-auto animate-pulse" />
                    <h3 className="text-sm font-bold text-[#fef3c7] font-mono uppercase">
                      THE ENTIRE INTERNET'S NOSTALGIA RADIO
                    </h3>
                    <p className="text-xs text-[#a8937d] font-serif-vintage max-w-lg mx-auto">
                      Search any Indian, Bollywood, Punjabi, or global 90s/2000s song to discover verified embeddable YouTube streams and play them directly inside the radio player.
                    </p>
                  </div>

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-[#8c7460]">
                        <span className="flex items-center gap-1 uppercase font-pixel text-[10px]">
                          <Clock className="w-3 h-3 text-[#f59e0b]" /> Recent Searches
                        </span>
                        <button
                          onClick={() => {
                            clearRecentSearches();
                            setRecentSearches([]);
                          }}
                          className="hover:text-red-400 text-[10px]"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {recentSearches.map((rec) => (
                          <button
                            key={rec}
                            onClick={() => {
                              setQuery(rec);
                              executeSearch(rec);
                            }}
                            className="px-2.5 py-1 bg-[#180e08] hover:bg-[#2e1d12] text-[#c2ad94] hover:text-[#fef3c7] rounded-lg border border-[#382315] text-xs font-mono flex items-center gap-1.5 transition-colors"
                          >
                            <Search className="w-3 h-3 text-[#8c7460]" />
                            <span>{rec}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* RESULTS AREA */}
              {results.length > 0 && (
                <div className="space-y-3">
                  {/* Results Header with View Mode Toggle */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#312015] font-mono text-xs text-[#8c7460]">
                    <div className="flex items-center gap-2">
                      <span className="font-pixel text-[10px] uppercase text-[#f59e0b] flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> ARCHIVE RESULTS ({results.length})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#120a06] p-1 rounded-xl border border-[#382315]">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all min-h-[36px] touch-manipulation cursor-pointer ${
                          viewMode === 'list'
                            ? 'bg-[#3d2518] text-[#fcd34d] font-bold border border-[#523826] shadow-sm'
                            : 'text-[#8c7460] hover:text-[#d6c4b2]'
                        }`}
                        title="Touch-friendly List View"
                      >
                        <LayoutList className="w-3.5 h-3.5" />
                        <span className="text-[11px] uppercase font-mono">List</span>
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all min-h-[36px] touch-manipulation cursor-pointer ${
                          viewMode === 'grid'
                            ? 'bg-[#3d2518] text-[#fcd34d] font-bold border border-[#523826] shadow-sm'
                            : 'text-[#8c7460] hover:text-[#d6c4b2]'
                        }`}
                        title="Grid View"
                      >
                        <Grid className="w-3.5 h-3.5" />
                        <span className="text-[11px] uppercase font-mono hidden sm:inline">Grid</span>
                      </button>
                    </div>
                  </div>

                  {/* Results Container */}
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-3' : 'space-y-3'}>
                    {results.map((track) => {
                      const isCurrent = currentTrack.youtubeId === track.videoId;
                      const isFav = favoriteTrackIds.includes(`yt-${track.videoId}`);

                      // Format duration as MM:SS cleanly
                      const formattedDuration = (() => {
                        if (track.duration && /^\d+:\d+$/.test(track.duration.trim())) {
                          const parts = track.duration.trim().split(':');
                          if (parts.length === 2) {
                            return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
                          }
                          return track.duration.trim();
                        }
                        if (track.durationSeconds && track.durationSeconds > 0) {
                          const m = Math.floor(track.durationSeconds / 60);
                          const s = Math.floor(track.durationSeconds % 60);
                          return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                        }
                        return track.duration || '--:--';
                      })();

                      return (
                        <div
                          key={track.videoId}
                          className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 group ${
                            isCurrent
                              ? 'bg-[#2e1d12] border-[#f59e0b] shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                              : 'bg-[#180f0a] hover:bg-[#26170e] border-[#362316] hover:border-[#f59e0b]'
                          }`}
                        >
                          {/* Top: Thumbnail & Info */}
                          <div className="flex items-start gap-3">
                            {/* Clickable Thumbnail */}
                            <div
                              onClick={() => handlePlayResult(track)}
                              className="relative w-24 h-16 sm:w-28 sm:h-18 rounded-lg overflow-hidden border border-[#503624] flex-shrink-0 bg-black shadow-inner cursor-pointer group/thumb touch-manipulation"
                              title="Play song"
                            >
                              <img
                                src={track.thumbnail}
                                alt={track.title}
                                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform"
                              />
                              <div className="absolute top-1 left-1 bg-black/85 text-[8px] font-pixel text-red-400 px-1 py-0.5 rounded border border-red-900/50 flex items-center gap-0.5">
                                <Youtube className="w-2.5 h-2.5" />
                                <span className="hidden sm:inline">YOUTUBE</span>
                              </div>
                              <div className="absolute bottom-1 right-1 bg-black/90 text-[9px] font-mono text-[#fcd34d] px-1.5 py-0.5 rounded border border-yellow-800/60 flex items-center gap-0.5 font-bold">
                                <Clock className="w-2.5 h-2.5 text-amber-400" />
                                <span>{formattedDuration}</span>
                              </div>
                              <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover/thumb:opacity-100'}`}>
                                {isCurrent ? (
                                  <Disc className="w-7 h-7 text-[#fcd34d] animate-spin" />
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-[#f59e0b] text-black flex items-center justify-center shadow-lg">
                                    <Play className="w-4 h-4 fill-current translate-x-0.5" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Info */}
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-start justify-between gap-1.5">
                                <h4
                                  onClick={() => handlePlayResult(track)}
                                  className="font-bold text-sm text-[#fef3c7] leading-tight cursor-pointer hover:text-amber-300 transition-colors line-clamp-2"
                                  dangerouslySetInnerHTML={{ __html: track.title }}
                                />
                              </div>

                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#a8937d]">
                                <p className="font-sans font-medium text-[#d4c3b3] truncate max-w-[220px]">
                                  {track.artist || track.channelTitle}
                                </p>
                                {track.year && (
                                  <span className="font-pixel text-[9px] bg-[#3a2517] text-[#fcd34d] px-1.5 py-0.5 rounded uppercase flex-shrink-0 border border-[#523826]">
                                    {track.year}
                                  </span>
                                )}
                              </div>

                              {track.channelTitle && track.channelTitle !== track.artist && (
                                <div className="text-[10px] text-[#8c7460] font-mono truncate">
                                  <span>Channel: </span>
                                  <span className="text-[#e2d5c8] font-medium">{track.channelTitle}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Bar: Larger Touch Targets (Min 44px Height) */}
                          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 pt-2.5 border-t border-[#29180e]">
                            {/* Primary Touch Buttons: PLAY & QUEUE */}
                            <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                              <button
                                onClick={() => handlePlayResult(track)}
                                className="min-h-[44px] px-4 py-2.5 bg-gradient-to-r from-[#854d0e] via-[#a16207] to-[#854d0e] hover:from-[#a16207] hover:to-[#ca8a04] active:scale-95 text-[#fef08a] border border-[#d97706]/50 rounded-xl shadow-md font-pixel text-xs tracking-wider uppercase flex items-center justify-center gap-2 flex-1 sm:flex-initial touch-manipulation cursor-pointer font-bold"
                                title="Play song immediately"
                              >
                                <Play className="w-4 h-4 fill-current" />
                                <span>PLAY</span>
                              </button>

                              <button
                                onClick={() => handleAddToQueue(track)}
                                className="min-h-[44px] min-w-[44px] px-3.5 py-2.5 bg-[#2d1b11] hover:bg-[#3d2518] text-[#fcd34d] border border-[#503624] hover:border-[#f59e0b] rounded-xl font-mono text-xs font-semibold flex items-center justify-center gap-1.5 flex-1 sm:flex-initial active:scale-95 transition-all touch-manipulation cursor-pointer shadow-sm"
                                title="Add song to queue"
                              >
                                <Plus className="w-4 h-4 text-amber-400" />
                                <span className="font-pixel text-[11px] uppercase">QUEUE</span>
                              </button>
                            </div>

                            {/* Secondary Action Icons: Minimum 44px Touch Boundaries */}
                            <div className="flex items-center gap-1 justify-end w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-[#23140b]">
                              <button
                                onClick={() => toggleFavoriteTrack(`yt-${track.videoId}`)}
                                className="min-h-[44px] min-w-[44px] p-2.5 text-[#8a725f] hover:text-rose-400 transition-colors rounded-xl hover:bg-[#2d1b11] border border-[#332014] hover:border-[#503624] flex items-center justify-center active:scale-95 touch-manipulation"
                                title="Favorite"
                              >
                                <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-current' : ''}`} />
                              </button>

                              <button
                                onClick={() => setSelectedTrackForMix(track)}
                                className="min-h-[44px] px-2.5 py-2.5 text-[#8a725f] hover:text-emerald-300 transition-colors rounded-xl hover:bg-[#2d1b11] border border-[#332014] hover:border-[#503624] flex items-center justify-center gap-1 font-mono text-[11px] active:scale-95 touch-manipulation"
                                title="Save to My Mixes"
                              >
                                <FolderPlus className="w-4 h-4 text-emerald-400" />
                                <span className="hidden sm:inline font-pixel text-[10px]">+ MIX</span>
                              </button>

                              <button
                                onClick={() => setSelectedTrackForMemory(track)}
                                className="min-h-[44px] px-2.5 py-2.5 text-[#8a725f] hover:text-amber-300 transition-colors rounded-xl hover:bg-[#2d1b11] border border-[#332014] hover:border-[#503624] flex items-center justify-center gap-1 font-mono text-[11px] active:scale-95 touch-manipulation"
                                title="Assign memory"
                              >
                                <Bookmark className="w-4 h-4 text-amber-400" />
                                <span className="hidden sm:inline font-pixel text-[10px]">MEMORY</span>
                              </button>

                              <a
                                href={track.externalUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="min-h-[44px] min-w-[44px] p-2.5 text-[#735e4e] hover:text-red-400 transition-colors rounded-xl hover:bg-[#2d1b11] border border-[#332014] hover:border-[#503624] flex items-center justify-center active:scale-95 touch-manipulation"
                                title="Open on YouTube"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DISCOVER SECTIONS */}
          {activeTab === 'discover' && (
            <div className="space-y-6">
              <div className="p-4 bg-[#180e08] rounded-xl border border-[#332014] flex items-center justify-between">
                <div>
                  <h3 className="font-pixel text-xs text-[#fcd34d] uppercase flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <span>CURATED NOSTALGIC ARCHIVE SECTIONS</span>
                  </h3>
                  <p className="text-xs text-[#8c7460] font-sans">
                    Hand-verified real YouTube video IDs tested for web embeddability
                  </p>
                </div>
              </div>

              {Object.entries(VERIFIED_DISCOVERY_CATALOG).map(([sectionName, catalogTracks]) => (
                <div key={sectionName} className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#312015] pb-1.5">
                    <h4 className="font-pixel text-xs text-[#f59e0b] uppercase flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{sectionName}</span>
                    </h4>
                    <span className="text-[10px] font-mono text-[#8c7460]">
                      {catalogTracks.length} verified songs
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {catalogTracks.map((tr) => (
                      <div
                        key={tr.videoId}
                        className="p-2.5 bg-[#180f0a] hover:bg-[#26170e] border border-[#362316] hover:border-[#f59e0b] rounded-xl transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <img
                            src={tr.thumbnail}
                            alt={tr.title}
                            className="w-12 h-10 object-cover rounded border border-[#503624] flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-xs text-[#fef3c7] truncate group-hover:text-amber-300">
                              {tr.title}
                            </h5>
                            <p className="text-[11px] text-[#8c7460] truncate">{tr.artist}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pl-1">
                          <button
                            onClick={() => handleAddToQueue(tr)}
                            className="min-h-[40px] min-w-[40px] p-2 text-[#8c7460] hover:text-amber-300 rounded-lg hover:bg-[#2d1b11] border border-transparent hover:border-[#503624] flex items-center justify-center touch-manipulation"
                            title="Add to queue"
                          >
                            <Plus className="w-4 h-4 text-amber-400" />
                          </button>
                          <button
                            onClick={() => handlePlayResult(tr)}
                            className="min-h-[40px] px-3 bg-[#854d0e] hover:bg-[#a16207] text-[#fef08a] rounded-lg shadow font-pixel text-xs flex items-center justify-center gap-1 touch-manipulation cursor-pointer"
                            title="Play"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span className="hidden xs:inline">PLAY</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MY MIXES & CUSTOM PLAYLISTS */}
          {activeTab === 'my-mixes' && (
            <div className="space-y-6">
              {/* Create Mix Form */}
              <div className="p-4 bg-[#180e08] rounded-xl border border-[#332014] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="w-full sm:w-auto">
                  <h3 className="font-pixel text-xs text-[#fcd34d] uppercase flex items-center gap-2">
                    <ListMusic className="w-4 h-4 text-emerald-400" />
                    <span>CREATE CUSTOM CASSETTE MIX</span>
                  </h3>
                  <p className="text-xs text-[#8c7460]">
                    Save YouTube songs into personalized cassette playlists
                  </p>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="text"
                    value={newMixName}
                    onChange={(e) => setNewMixName(e.target.value)}
                    placeholder="E.g., MY 2000s MIX, MY ROAD TRIP..."
                    className="bg-[#120a06] border border-[#523826] text-xs text-[#fef08a] px-3 py-2 rounded-lg font-mono outline-none focus:border-amber-400 w-full sm:w-60"
                  />
                  <button
                    onClick={handleCreateNewMix}
                    className="px-3 py-2 bg-[#065f46] hover:bg-[#047857] text-white font-pixel text-xs rounded-lg uppercase flex items-center gap-1 flex-shrink-0 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ MIX</span>
                  </button>
                </div>
              </div>

              {/* Mixes List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userMixes.map((mix) => (
                  <div
                    key={mix.id}
                    className="p-4 bg-[#180f0a] border border-[#362316] rounded-xl space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-[#2a1a10] pb-2">
                      <div>
                        <h4 className="font-pixel text-xs text-[#fef3c7] tracking-wider">
                          📼 {mix.name}
                        </h4>
                        <p className="text-[11px] text-[#8c7460]">{mix.description}</p>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                        {mix.tracks.length} Tracks
                      </span>
                    </div>

                    {mix.tracks.length === 0 ? (
                      <p className="text-xs text-[#6e5645] italic py-2 text-center">
                        No songs in this mix yet. Search above and click [+ MIX] to add!
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {mix.tracks.map((t) => (
                          <div
                            key={t.videoId}
                            className="p-2 bg-[#120a06] rounded-lg border border-[#2d1b11] flex items-center justify-between text-xs"
                          >
                            <div className="min-w-0 flex-1 pr-2">
                              <p className="font-bold text-[#fef3c7] truncate">{t.title}</p>
                              <p className="text-[10px] text-[#8c7460] truncate">{t.artist}</p>
                            </div>
                            <button
                              onClick={() => handlePlayResult(t)}
                              className="p-1 text-amber-400 hover:text-amber-200"
                              title="Play"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {mix.tracks.length > 0 && (
                      <button
                        onClick={() => {
                          const converted = mix.tracks.map(convertSearchResultToNostalgiaTrack);
                          audioSynthesizer.playClick('switch');
                          playTrack(converted[0]);
                          setIsFullPlayerOpen(true);
                          onClose();
                        }}
                        className="w-full py-2 bg-[#854d0e] hover:bg-[#a16207] text-[#fef08a] font-pixel text-xs uppercase rounded-lg shadow flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>PLAY ENTIRE MIX</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal: Save to Mix Picker */}
        <AnimatePresence>
          {selectedTrackForMix && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#24170e] border-2 border-[#f59e0b] rounded-2xl p-5 shadow-2xl space-y-4 font-mono text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#3b271a] pb-2">
                  <h3 className="font-pixel text-xs text-[#fcd34d] uppercase flex items-center gap-2">
                    <FolderPlus className="w-4 h-4" />
                    <span>Save to Custom Mix</span>
                  </h3>
                  <button
                    onClick={() => setSelectedTrackForMix(null)}
                    className="text-[#8c7460] hover:text-[#fef3c7]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-2.5 bg-[#180e08] rounded-lg border border-[#3b271a] flex items-center gap-2.5">
                  <img
                    src={selectedTrackForMix.thumbnail}
                    alt={selectedTrackForMix.title}
                    className="w-12 h-9 object-cover rounded border border-[#503624]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#fef3c7] truncate">{selectedTrackForMix.title}</p>
                    <p className="text-[10px] text-[#8c7460] truncate">{selectedTrackForMix.artist}</p>
                  </div>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  <span className="text-[10px] text-[#8c7460] uppercase block">Select Target Mix:</span>
                  {userMixes.map((mix) => (
                    <button
                      key={mix.id}
                      onClick={() => handleAddTrackToMix(mix.id, selectedTrackForMix)}
                      className="w-full p-2.5 bg-[#180e08] hover:bg-[#3d2719] text-[#fef3c7] rounded-lg border border-[#382315] hover:border-[#f59e0b] flex items-center justify-between transition-colors text-left"
                    >
                      <span className="font-bold">📼 {mix.name}</span>
                      <span className="text-[10px] text-[#8c7460]">{mix.tracks.length} songs</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal: Save to Memory Picker */}
        <AnimatePresence>
          {selectedTrackForMemory && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md bg-[#24170e] border-2 border-[#f59e0b] rounded-2xl p-5 shadow-2xl space-y-4 font-mono text-xs"
              >
                <div className="flex items-center justify-between border-b border-[#3b271a] pb-2">
                  <h3 className="font-pixel text-xs text-[#fcd34d] uppercase flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    <span>Assign Song to Memory</span>
                  </h3>
                  <button
                    onClick={() => setSelectedTrackForMemory(null)}
                    className="text-[#8c7460] hover:text-[#fef3c7]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-2.5 bg-[#180e08] rounded-lg border border-[#3b271a] flex items-center gap-2.5">
                  <img
                    src={selectedTrackForMemory.thumbnail}
                    alt={selectedTrackForMemory.title}
                    className="w-12 h-9 object-cover rounded border border-[#503624]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-[#fef3c7] truncate">{selectedTrackForMemory.title}</p>
                    <p className="text-[10px] text-[#8c7460] truncate">{selectedTrackForMemory.artist}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#8c7460] uppercase block">Select Memory:</span>
                  {[
                    { id: 'summer-vacation', title: 'Summer Vacation — Mangoes & Nani House' },
                    { id: 'rainy-window', title: 'Rainy Window — Monsoon Chai & Petrichor' },
                    { id: 'terrace-9pm', title: 'Terrace 9PM — Stargazing & Cool Breeze' },
                    { id: 'first-love', title: 'First Love — Handwritten Cassette Tapes' },
                    { id: 'school-farewell', title: 'School Farewell — Autograph Uniforms' }
                  ].map((mem) => (
                    <button
                      key={mem.id}
                      onClick={() => handleSaveToMemory(selectedTrackForMemory, mem.id)}
                      className="w-full p-2.5 bg-[#180e08] hover:bg-[#3d2719] text-[#fef3c7] rounded-lg border border-[#382315] hover:border-[#f59e0b] flex items-center justify-between transition-colors text-left"
                    >
                      <span>{mem.title}</span>
                      <Check className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="p-3.5 px-5 bg-[#120a06] border-t border-[#29170c] flex items-center justify-between text-[11px] text-[#8c7460] font-mono">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>Nostalgia Radio Live Archive Engine • Real YouTube Stream Resolution</span>
          </div>

          <button
            onClick={onClose}
            className="text-[#f59e0b] hover:underline font-bold flex items-center gap-1"
          >
            <span>Return to Player</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};
