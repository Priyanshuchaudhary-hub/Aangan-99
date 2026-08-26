import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useMusic } from '../context/MusicContext.tsx';
import { NOSTALGIA_TRACKS, NOSTALGIA_PLAYLISTS } from '../data/musicData.ts';
import { MEMORY_EXPLORER_ITEMS, MemoryItem } from '../data/memoryExplorerData.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

import { NostalgiaRadioPlayer } from '../components/NostalgiaRadioPlayer.tsx';
import { NostalgiaRadioModal } from '../components/NostalgiaRadioModal.tsx';
import { SongSearchModal } from '../components/SongSearchModal.tsx';
import { MusicSourceSetupModal } from '../components/MusicSourceSetupModal.tsx';
import { DeveloperDebugPanel } from '../components/DeveloperDebugPanel.tsx';

import { 
  Home as HomeIcon, 
  Sparkles, 
  Music, 
  Compass, 
  ListMusic, 
  Search, 
  Settings, 
  ExternalLink, 
  Play, 
  Pause, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Clock, 
  ArrowLeft,
  Heart,
  Volume2,
  Globe,
  Instagram,
  Linkedin,
  Mail
} from 'lucide-react';
import { NostalgiaPlaylist, NostalgiaTrack } from '../music/types.ts';

type ViewMode = 'home' | 'memories' | 'music' | 'discover' | 'playlists' | 'playlist-detail' | 'memory-detail';

export const Home: React.FC = () => {
  const {
    isFullPlayerOpen,
    setIsFullPlayerOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isSetupModalOpen,
    setIsSetupModalOpen,
    currentTrack,
    isPlaying,
    togglePlayPause,
    playTrack,
    activePlaylist,
    queue,
    favoriteTrackIds,
    toggleFavoriteTrack
  } = useMusic();

  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [selectedPlaylist, setSelectedPlaylist] = useState<NostalgiaPlaylist | null>(null);
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Global Cmd/Ctrl + K shortcut to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        audioSynthesizer.playClick('switch');
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  const featuredMemory = MEMORY_EXPLORER_ITEMS[0];
  const memoryGridItems = MEMORY_EXPLORER_ITEMS;

  const handleNavClick = (view: ViewMode) => {
    audioSynthesizer.playClick('switch');
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0E0E0D] text-[#f7f1e5] font-sans flex flex-col md:flex-row selection:bg-[#f59e0b] selection:text-[#0E0E0D]">
      <DeveloperDebugPanel />

      {/* ========================================================== */}
      {/* 1. DESKTOP SIDEBAR NAVIGATION                              */}
      {/* ========================================================== */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#1f1f1c] bg-[#121211] p-6 sticky top-0 h-screen z-30 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2 cursor-pointer" onClick={() => handleNavClick('home')}>
          <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/30 flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-[#f59e0b]">99</span>
          </div>
          <div>
            <h1 className="font-mono text-xs font-bold tracking-widest text-[#f7f1e5]">SUMMER VACATION</h1>
            <p className="text-[10px] text-[#8a7663] font-mono">ARCHIVE & RADIO</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 flex-1">
          <button 
            onClick={() => handleNavClick('home')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === 'home' ? 'bg-[#1A1A17] text-[#f59e0b] border border-[#2a2a27]' : 'text-[#a89582] hover:text-[#f7f1e5] hover:bg-[#161614]'}`}
          >
            <HomeIcon className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button 
            onClick={() => handleNavClick('memories')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === 'memories' || currentView === 'memory-detail' ? 'bg-[#1A1A17] text-[#f59e0b] border border-[#2a2a27]' : 'text-[#a89582] hover:text-[#f7f1e5] hover:bg-[#161614]'}`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Memories</span>
          </button>
          <button 
            onClick={() => handleNavClick('music')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === 'music' ? 'bg-[#1A1A17] text-[#f59e0b] border border-[#2a2a27]' : 'text-[#a89582] hover:text-[#f7f1e5] hover:bg-[#161614]'}`}
          >
            <Music className="w-4 h-4" />
            <span>Music</span>
          </button>
          <button 
            onClick={() => handleNavClick('discover')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === 'discover' ? 'bg-[#1A1A17] text-[#f59e0b] border border-[#2a2a27]' : 'text-[#a89582] hover:text-[#f7f1e5] hover:bg-[#161614]'}`}
          >
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </button>
          <button 
            onClick={() => handleNavClick('playlists')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${currentView === 'playlists' || currentView === 'playlist-detail' ? 'bg-[#1A1A17] text-[#f59e0b] border border-[#2a2a27]' : 'text-[#a89582] hover:text-[#f7f1e5] hover:bg-[#161614]'}`}
          >
            <ListMusic className="w-4 h-4" />
            <span>Playlists</span>
          </button>
          <button 
            onClick={() => { audioSynthesizer.playClick('switch'); setIsSearchModalOpen(true); }}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#a89582] hover:text-[#f7f1e5] hover:bg-[#161614] transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-[#1f1f1c] space-y-3">
          <button 
            onClick={() => { audioSynthesizer.playClick('switch'); setIsSetupModalOpen(true); }}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono text-[#8a7663] hover:text-[#f7f1e5] hover:bg-[#161614] transition-colors"
          >
            <span>SETTINGS</span>
            <Settings className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-3 px-3.5 text-xs text-[#6b5847]">
            <a href="https://www.linkedin.com/in/priyanshu-bharangar?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#f7f1e5] transition-colors"><Linkedin className="w-3.5 h-3.5 text-[#0077b5]" /></a>
            <a href="https://www.instagram.com/chaudhary_priyanshuu?utm_source=qr&igsi=enptcGt4c3puY25k" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-[#f7f1e5] transition-colors"><Instagram className="w-3.5 h-3.5 text-[#e1306c]" /></a>
            <a href="mailto:priyanshuchaudhary07it@gmail.com" title="priyanshuchaudhary07it@gmail.com" className="flex items-center gap-1 hover:text-[#f7f1e5] transition-colors"><Mail className="w-3.5 h-3.5 text-[#f59e0b]" /></a>
          </div>
        </div>
      </aside>

      {/* ========================================================== */}
      {/* 2. MAIN APPLICATION CONTENT AREA                           */}
      {/* ========================================================== */}
      <div className="flex-1 flex flex-col min-h-screen pb-32">
        {/* Top Minimal Navigation Bar */}
        <header className={`sticky top-0 z-20 transition-all duration-300 px-6 py-4 flex items-center justify-between border-b ${isScrolled ? 'bg-[#0E0E0D]/90 backdrop-blur-md border-[#1f1f1c]' : 'bg-transparent border-transparent'}`}>
          <div className="flex items-center gap-4">
            {currentView === 'playlist-detail' || currentView === 'memory-detail' ? (
              <button 
                onClick={() => { audioSynthesizer.playClick('switch'); setCurrentView(currentView === 'playlist-detail' ? 'playlists' : 'memories'); }}
                className="flex items-center gap-2 text-xs font-mono text-[#8a7663] hover:text-[#f7f1e5] transition-colors bg-[#1A1A17] px-3 py-1.5 rounded-lg border border-[#2a2a27]"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> BACK
              </button>
            ) : (
              <span className="font-mono text-xs tracking-wider text-[#8a7663] uppercase">
                {currentView}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Search Trigger */}
            <button 
              onClick={() => { audioSynthesizer.playClick('switch'); setIsSearchModalOpen(true); }}
              className="hidden sm:flex items-center justify-between px-4 py-2 rounded-full bg-[#1A1A17] border border-[#2a2a27] text-xs text-[#8a7663] hover:border-[#4a4a44] transition-colors w-72 group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span className="group-hover:text-[#f7f1e5] transition-colors">Search songs, artists, memories...</span>
              </div>
              <span className="text-[10px] font-mono bg-[#2a2a27] text-[#a89582] px-1.5 py-0.5 rounded border border-[#3a3a37]">⌘K</span>
            </button>

            {/* Now Playing Status Pill */}
            {currentTrack && (
              <div 
                onClick={() => { audioSynthesizer.playClick('switch'); setIsFullPlayerOpen(true); }}
                className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#1A1A17] border border-[#2a2a27] cursor-pointer hover:border-[#f59e0b]/50 transition-all group"
              >
                <div className="w-6 h-6 rounded overflow-hidden bg-[#2a2a27] relative shrink-0">
                   <img src={currentTrack.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="hidden lg:block text-left max-w-[140px] truncate">
                   <p className="text-xs font-bold text-[#f7f1e5] truncate group-hover:text-[#f59e0b] transition-colors">{currentTrack.title}</p>
                   <p className="text-[10px] text-[#8a7663] truncate">{currentTrack.artist}</p>
                </div>
                <div className="flex items-center gap-0.5 h-3">
                  <div className={`w-0.5 bg-[#f59e0b] rounded-full ${isPlaying ? 'animate-pulse h-full' : 'h-1'}`} />
                  <div className={`w-0.5 bg-[#f59e0b] rounded-full ${isPlaying ? 'animate-pulse h-2/3' : 'h-1'}`} />
                  <div className={`w-0.5 bg-[#f59e0b] rounded-full ${isPlaying ? 'animate-pulse h-4/5' : 'h-1'}`} />
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ========================================================== */}
        {/* VIEW ROUTER                                                */}
        {/* ========================================================== */}
        <div className="flex-1 px-4 md:px-12 py-8 max-w-7xl mx-auto w-full">

          {/* -------------------------------------------------------- */}
          {/* VIEW: HOME                                               */}
          {/* -------------------------------------------------------- */}
          {currentView === 'home' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-20">
              {/* Editorial Hero */}
              <section className="relative rounded-3xl overflow-hidden bg-[#151513] border border-[#22221f] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                  <img src="https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&q=80&w=2000" alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#151513] via-[#151513]/80 to-transparent" />
                </div>
                
                <div className="relative z-10 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f59e0b]/10 border border-[#f59e0b]/20 text-[#f59e0b] text-xs font-mono mb-6">
                    <Sparkles className="w-3.5 h-3.5" /> AANGAN '99 / SUMMER VACATION
                  </div>
                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#f7f1e5] mb-6 font-serif leading-tight">
                    Some memories never learned how to leave.
                  </h1>
                  <p className="text-[#a89582] text-base md:text-lg mb-8 leading-relaxed font-sans">
                    Step inside an immersive digital archive of 90s/2000s summer nostalgia, curated soundtracks, and unforgettable stories.
                  </p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleNavClick('memories')}
                      className="px-7 py-3.5 rounded-full bg-[#f59e0b] text-[#0E0E0D] font-bold text-xs tracking-wider uppercase hover:bg-[#fbbf24] transition-all shadow-lg hover:scale-105 active:scale-95"
                    >
                      EXPLORE ARCHIVE
                    </button>
                    <button 
                      onClick={() => { audioSynthesizer.playClick('switch'); setIsFullPlayerOpen(true); }}
                      className="px-7 py-3.5 rounded-full bg-transparent border border-[#2a2a27] text-[#f7f1e5] font-bold text-xs tracking-wider uppercase hover:border-[#f7f1e5] transition-all"
                    >
                      OPEN RADIO
                    </button>
                  </div>
                </div>

                <div className="relative z-10 w-full md:w-[420px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-[#2a2a27]">
                  <img src={featuredMemory.visualImage} alt={featuredMemory.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                    <div>
                      <span className="font-mono text-xs text-[#f59e0b] uppercase">{featuredMemory.year} · {featuredMemory.title}</span>
                      <p className="text-xs text-[#c4bba8] line-clamp-1 mt-1">{featuredMemory.emotionalDescription}</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Featured Curated Playlists Rail */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold font-serif text-[#f7f1e5]">Curated Soundtracks</h3>
                    <p className="text-xs text-[#8a7663] font-mono mt-1">SOUNDTRACKS FOR EVERY ERA</p>
                  </div>
                  <button onClick={() => handleNavClick('playlists')} className="text-xs font-mono text-[#f59e0b] hover:underline">VIEW ALL</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {NOSTALGIA_PLAYLISTS.slice(0, 4).map((pl) => (
                    <div 
                      key={pl.id}
                      onClick={() => {
                        setSelectedPlaylist(pl);
                        setCurrentView('playlist-detail');
                        audioSynthesizer.playClick('switch');
                      }}
                      className="group p-4 rounded-2xl bg-[#141412] border border-[#1f1f1c] hover:border-[#3a3a34] transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-[#1A1A17]">
                        <img src={pl.coverImage} alt={pl.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-[#f59e0b] text-[#0E0E0D] flex items-center justify-center shadow-xl transform translate-y-2 group-hover:translate-y-0 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-bold text-base text-[#f7f1e5] mb-1 group-hover:text-[#f59e0b] transition-colors">{pl.title}</h4>
                        <p className="text-xs text-[#8a7663]">{pl.trackIds.length} songs · {pl.era}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Recent Memories Grid Preview */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold font-serif text-[#f7f1e5]">Featured Memories</h3>
                    <p className="text-xs text-[#8a7663] font-mono mt-1">STORIES FROM THE ARCHIVE</p>
                  </div>
                  <button onClick={() => handleNavClick('memories')} className="text-xs font-mono text-[#f59e0b] hover:underline">VIEW ALL</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {memoryGridItems.slice(0, 3).map((mem) => (
                    <div 
                      key={mem.id}
                      onClick={() => {
                        setSelectedMemory(mem);
                        setCurrentView('memory-detail');
                        audioSynthesizer.playClick('switch');
                      }}
                      className="group cursor-pointer rounded-2xl bg-[#141412] border border-[#1f1f1c] overflow-hidden hover:border-[#3a3a34] transition-all flex flex-col"
                    >
                      <div className="aspect-[16/10] overflow-hidden relative bg-[#1A1A17]">
                        <img src={mem.visualImage} alt={mem.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-[#f59e0b] border border-white/10 uppercase">
                          {mem.year}
                        </div>
                      </div>
                      <div className="p-6 flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="text-lg font-bold font-serif text-[#f7f1e5] mb-2 group-hover:text-[#f59e0b] transition-colors">{mem.title}</h4>
                          <p className="text-xs text-[#8a7663] line-clamp-2 leading-relaxed">{mem.emotionalDescription}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-6 text-xs font-mono text-[#f59e0b]">
                          <span>Read Memory</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: MEMORIES                                           */}
          {/* -------------------------------------------------------- */}
          {currentView === 'memories' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#f7f1e5] mb-3">The Memory Archive</h2>
                <p className="text-[#a89582] text-sm md:text-base max-w-2xl">
                  A curated collection of visual moments, cassette tapes, and summer afternoons that defined a generation.
                </p>
              </div>

              {/* Asymmetric Editorial Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memoryGridItems.map((mem, idx) => (
                  <div 
                    key={mem.id}
                    onClick={() => {
                      setSelectedMemory(mem);
                      setCurrentView('memory-detail');
                      audioSynthesizer.playClick('switch');
                    }}
                    className={`group cursor-pointer rounded-2xl bg-[#141412] border border-[#1f1f1c] overflow-hidden hover:border-[#3a3a34] transition-all flex flex-col ${idx === 0 ? 'md:col-span-2 lg:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'}`}
                  >
                    <div className="relative w-full h-full overflow-hidden flex-1 bg-[#1A1A17]">
                      <img src={mem.visualImage} alt={mem.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0D] via-transparent to-transparent opacity-80" />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-xs font-mono text-[#f59e0b] border border-white/10 uppercase">
                        {mem.year} · {mem.location || 'India'}
                      </div>
                      <div className="absolute bottom-6 left-6 right-6">
                        <h3 className="text-xl md:text-2xl font-bold font-serif text-[#f7f1e5] mb-2 group-hover:text-[#f59e0b] transition-colors">{mem.title}</h3>
                        <p className="text-xs md:text-sm text-[#a89582] line-clamp-2">{mem.emotionalDescription}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: MEMORY DETAIL                                      */}
          {/* -------------------------------------------------------- */}
          {currentView === 'memory-detail' && selectedMemory && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-4">
                <div className="flex items-center gap-3 font-mono text-xs text-[#f59e0b]">
                  <span>{selectedMemory.year}</span>
                  <span>·</span>
                  <span>SUMMER ARCHIVE</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold font-serif text-[#f7f1e5] leading-tight">{selectedMemory.title}</h1>
                <p className="text-[#a89582] text-lg font-serif italic">"{selectedMemory.emotionalDescription}"</p>
              </div>

              <div className="aspect-[16/9] rounded-3xl overflow-hidden border border-[#2a2a27] bg-[#141412] shadow-2xl">
                <img src={selectedMemory.visualImage} alt={selectedMemory.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-6 text-[#c4bba8] text-base md:text-lg leading-relaxed font-sans bg-[#121211] p-8 md:p-12 rounded-3xl border border-[#1f1f1c]">
                <h3 className="text-xl font-bold text-[#f7f1e5] font-serif">The Experience</h3>
                <p>{selectedMemory.extendedStory || selectedMemory.emotionalDescription}</p>
                
                <div className="pt-6 border-t border-[#1f1f1c] flex items-center justify-between text-xs font-mono text-[#8a7663]">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Summer Vacation
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> India
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: MUSIC                                              */}
          {/* -------------------------------------------------------- */}
          {currentView === 'music' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#f7f1e5] mb-3">Music Archive</h2>
                <p className="text-[#a89582] text-sm md:text-base max-w-2xl">
                  Search through verified streaming tracks, classic cassettes, and curated audio streams.
                </p>
              </div>

              {/* Playlists Rail */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold font-serif text-[#f7f1e5]">Curated Playlists</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {NOSTALGIA_PLAYLISTS.map((pl) => (
                    <div 
                      key={pl.id}
                      onClick={() => {
                        setSelectedPlaylist(pl);
                        setCurrentView('playlist-detail');
                        audioSynthesizer.playClick('switch');
                      }}
                      className="group p-4 rounded-2xl bg-[#141412] border border-[#1f1f1c] hover:border-[#3a3a34] transition-all cursor-pointer flex items-center gap-4"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-[#1A1A17]">
                        <img src={pl.coverImage} alt={pl.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-base text-[#f7f1e5] truncate group-hover:text-[#f59e0b] transition-colors">{pl.title}</h4>
                        <p className="text-xs text-[#8a7663] truncate mt-0.5">{pl.trackIds.length} songs · {pl.era}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modern Track Rows */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold font-serif text-[#f7f1e5]">All Archive Tracks</h3>
                <div className="bg-[#121211] rounded-2xl border border-[#1f1f1c] divide-y divide-[#181815] overflow-hidden">
                  {NOSTALGIA_TRACKS.map((track, idx) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const isFav = favoriteTrackIds.includes(track.id);
                    return (
                      <div 
                        key={track.id}
                        className={`flex items-center justify-between p-4 hover:bg-[#181815] transition-colors group cursor-pointer ${isCurrent ? 'bg-[#181815]' : ''}`}
                        onClick={() => playTrack(track)}
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="font-mono text-xs text-[#6b5847] w-6 text-right shrink-0">{idx + 1}</span>
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1A1A17] shrink-0 relative">
                            <img src={track.thumbnailUrl} alt={track.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Play className="w-4 h-4 fill-white text-white" />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#f59e0b]' : 'text-[#f7f1e5]'}`}>{track.title}</h4>
                            <p className="text-xs text-[#8a7663] truncate mt-0.5">{track.artist} · {track.year}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <button 
                            onClick={(e) => { e.stopPropagation(); toggleFavoriteTrack(track.id); }}
                            className={`p-2 rounded-full hover:bg-[#252522] transition-colors ${isFav ? 'text-[#f59e0b]' : 'text-[#6b5847] hover:text-[#f7f1e5]'}`}
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: DISCOVER                                           */}
          {/* -------------------------------------------------------- */}
          {currentView === 'discover' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#f7f1e5] mb-3">Discover Curated Moods</h2>
                <p className="text-[#a89582] text-sm md:text-base max-w-2xl">
                  Immersive editorial soundscapes designed for specific hours, weather, and nostalgic reflections.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "Songs that sound like 2007.", subtitle: "Early YouTube, crisp mornings, and dial-up tones.", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000", tag: "ERA MIX" },
                  { title: "Rain outside. Headphones on.", subtitle: "Monsoon afternoons on the balcony with old cassettes.", image: "https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&q=80&w=1000", tag: "ATMOSPHERE" },
                  { title: "For the ride home.", subtitle: "Golden hour bus rides, window breeze, and quiet thoughts.", image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&q=80&w=1000", tag: "TRAVEL" },
                  { title: "Late night FM.", subtitle: "Quiet rooms, ceiling fans spinning, and midnight broadcasts.", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1000", tag: "NIGHT" }
                ].map((item, idx) => (
                  <div key={idx} className="group cursor-pointer relative rounded-3xl overflow-hidden aspect-[16/10] bg-[#141412] border border-[#1f1f1c] flex items-end p-8">
                    <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0D] via-[#0E0E0D]/40 to-transparent" />
                    <div className="relative z-15">
                      <span className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[#f59e0b] border border-white/10 uppercase mb-3 inline-block">
                        {item.tag}
                      </span>
                      <h3 className="text-2xl font-bold font-serif text-[#f7f1e5] mb-2">{item.title}</h3>
                      <p className="text-xs md:text-sm text-[#c4bba8]">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: PLAYLISTS                                          */}
          {/* -------------------------------------------------------- */}
          {currentView === 'playlists' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#f7f1e5] mb-3">All Playlists</h2>
                <p className="text-[#a89582] text-sm md:text-base max-w-2xl">
                  Handcrafted thematic collections featuring timeless tracks from the archive.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {NOSTALGIA_PLAYLISTS.map((pl) => (
                  <div 
                    key={pl.id}
                    onClick={() => {
                      setSelectedPlaylist(pl);
                      setCurrentView('playlist-detail');
                      audioSynthesizer.playClick('switch');
                    }}
                    className="group cursor-pointer rounded-2xl bg-[#141412] border border-[#1f1f1c] p-6 hover:border-[#3a3a34] transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-6 bg-[#1A1A17] relative">
                      <img src={pl.coverImage} alt={pl.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#f59e0b] text-[#0E0E0D] flex items-center justify-center shadow-xl">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold font-serif text-[#f7f1e5] mb-2 group-hover:text-[#f59e0b] transition-colors">{pl.title}</h3>
                      <p className="text-xs text-[#8a7663] leading-relaxed mb-4">{pl.description}</p>
                      <span className="font-mono text-xs text-[#f59e0b]">{pl.trackIds.length} SONGS · {pl.era}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* -------------------------------------------------------- */}
          {/* VIEW: PLAYLIST DETAIL                                    */}
          {/* -------------------------------------------------------- */}
          {currentView === 'playlist-detail' && selectedPlaylist && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-12">
              {/* Playlist Header */}
              <div className="flex flex-col md:flex-row items-start md:items-end gap-8 bg-[#141412] border border-[#1f1f1c] p-8 md:p-12 rounded-3xl relative overflow-hidden">
                <div className="w-48 h-48 md:w-60 md:h-60 rounded-2xl overflow-hidden shadow-2xl shrink-0 bg-[#1A1A17]">
                  <img src={selectedPlaylist.coverImage} alt={selectedPlaylist.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <span className="font-mono text-xs text-[#f59e0b] uppercase tracking-widest mb-2 block">{selectedPlaylist.era} PLAYLIST</span>
                  <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#f7f1e5] mb-4">{selectedPlaylist.title}</h1>
                  <p className="text-[#a89582] text-sm md:text-base max-w-xl mb-6 leading-relaxed">{selectedPlaylist.description}</p>
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => {
                        const firstTrack = NOSTALGIA_TRACKS.find(t => t.id === selectedPlaylist.trackIds[0]);
                        if (firstTrack) playTrack(firstTrack, selectedPlaylist);
                      }}
                      className="px-8 py-3.5 rounded-full bg-[#f59e0b] text-[#0E0E0D] font-bold text-xs tracking-wider uppercase hover:bg-[#fbbf24] transition-all shadow-lg flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" /> PLAY ALL
                    </button>
                  </div>
                </div>
              </div>

              {/* Track List */}
              <div className="bg-[#121211] rounded-2xl border border-[#1f1f1c] divide-y divide-[#181815] overflow-hidden">
                {selectedPlaylist.trackIds.map((trackId, idx) => {
                  const track = NOSTALGIA_TRACKS.find(t => t.id === trackId);
                  if (!track) return null;
                  const isCurrent = currentTrack?.id === track.id;
                  const isFav = favoriteTrackIds.includes(track.id);

                  return (
                    <div 
                      key={track.id}
                      className={`flex items-center justify-between p-4 hover:bg-[#181815] transition-colors group cursor-pointer ${isCurrent ? 'bg-[#181815]' : ''}`}
                      onClick={() => playTrack(track, selectedPlaylist)}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="font-mono text-xs text-[#6b5847] w-6 text-right shrink-0">{idx + 1}</span>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#1A1A17] shrink-0 relative">
                          <img src={track.thumbnailUrl} alt={track.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-4 h-4 fill-white text-white" />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h4 className={`text-sm font-bold truncate ${isCurrent ? 'text-[#f59e0b]' : 'text-[#f7f1e5]'}`}>{track.title}</h4>
                          <p className="text-xs text-[#8a7663] truncate mt-0.5">{track.artist} · {track.year}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleFavoriteTrack(track.id); }}
                          className={`p-2 rounded-full hover:bg-[#252522] transition-colors ${isFav ? 'text-[#f59e0b]' : 'text-[#6b5847] hover:text-[#f7f1e5]'}`}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </div>

        {/* Footer */}
        <footer className="w-full bg-[#0E0E0D] border-t border-[#1f1f1c] py-12 px-6 md:px-12 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-mono text-xs tracking-widest text-[#8a7663] font-bold">SUMMER VACATION.EXE</span>
            <span className="text-[#8a7663] text-sm font-serif italic">Made from memories and timeless music.</span>
            <div className="flex items-center gap-6 text-xs font-mono text-[#8a7663]">
              <a href="https://www.linkedin.com/in/priyanshu-bharangar?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#f7f1e5] transition-colors"><Linkedin className="w-4 h-4 text-[#0077b5]" /><span>LinkedIn</span></a>
              <a href="https://www.instagram.com/chaudhary_priyanshuu?utm_source=qr&igsi=enptcGt4c3puY25k" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-[#f7f1e5] transition-colors"><Instagram className="w-4 h-4 text-[#e1306c]" /><span>Instagram</span></a>
              <a href="mailto:priyanshuchaudhary07it@gmail.com" title="priyanshuchaudhary07it@gmail.com" className="flex items-center gap-1.5 hover:text-[#f7f1e5] transition-colors"><Mail className="w-4 h-4 text-[#f59e0b]" /><span>Gmail</span></a>
              <span>© 2026</span>
            </div>
          </div>
        </footer>
      </div>

      {/* ========================================================== */}
      {/* 3. MOBILE BOTTOM NAVIGATION                                */}
      {/* ========================================================== */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-[#121211]/95 backdrop-blur-xl border-t border-[#1f1f1c] px-4 py-2 flex items-center justify-around">
        <button onClick={() => handleNavClick('home')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'home' ? 'text-[#f59e0b]' : 'text-[#8a7663]'}`}>
          <HomeIcon className="w-5 h-5" />
          <span className="text-[10px] font-mono">Home</span>
        </button>
        <button onClick={() => handleNavClick('memories')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'memories' ? 'text-[#f59e0b]' : 'text-[#8a7663]'}`}>
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-mono">Memories</span>
        </button>
        <button onClick={() => handleNavClick('music')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'music' ? 'text-[#f59e0b]' : 'text-[#8a7663]'}`}>
          <Music className="w-5 h-5" />
          <span className="text-[10px] font-mono">Music</span>
        </button>
        <button onClick={() => handleNavClick('playlists')} className={`flex flex-col items-center gap-1 p-2 ${currentView === 'playlists' ? 'text-[#f59e0b]' : 'text-[#8a7663]'}`}>
          <ListMusic className="w-5 h-5" />
          <span className="text-[10px] font-mono">Playlists</span>
        </button>
        <button onClick={() => { audioSynthesizer.playClick('switch'); setIsSearchModalOpen(true); }} className="flex flex-col items-center gap-1 p-2 text-[#8a7663]">
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-mono">Search</span>
        </button>
      </div>

      {/* ========================================================== */}
      {/* 4. MODALS & PERSISTENT MEDIA LAYER                         */}
      {/* ========================================================== */}
      <MusicSourceSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />
      <SongSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />

      <NostalgiaRadioPlayer />
      <NostalgiaRadioModal
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
        onOpenMemory={(memSlug) => {
          setIsFullPlayerOpen(false);
          setCurrentView('memories');
        }}
      />
    </div>
  );
};
