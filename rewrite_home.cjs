const fs = require('fs');

const content = `import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useMusic } from '../context/MusicContext.tsx';
import { NOSTALGIA_TRACKS, NOSTALGIA_PLAYLISTS } from '../data/musicData.ts';
import { MEMORY_EXPLORER_ITEMS, MemoryItem } from '../data/memoryExplorerData.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

import { NostalgiaRadioPlayer } from '../components/NostalgiaRadioPlayer.tsx';
import { NostalgiaRadioModal } from '../components/NostalgiaRadioModal.tsx';
import { SongSearchModal } from '../components/SongSearchModal.tsx';
import { MusicSourceSetupModal } from '../components/MusicSourceSetupModal.tsx';
import { DeveloperDebugPanel } from '../components/DeveloperDebugPanel.tsx';
import { VerifyPlaylistModal } from '../components/VerifyPlaylistModal.tsx';

import { Search, Play, Pause, ChevronRight, MapPin, Calendar, Clock, Music } from 'lucide-react';

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
    playTrack
  } = useMusic();

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const featuredMemory = MEMORY_EXPLORER_ITEMS[0];
  const memoryGridItems = MEMORY_EXPLORER_ITEMS.slice(1, 7);

  return (
    <div className="min-h-screen bg-[#0E0E0D] text-[#f7f1e5] font-sans overflow-x-hidden selection:bg-[#f59e0b] selection:text-[#0E0E0D]">
      {/* Developer Debug Telemetry Panel */}
      <DeveloperDebugPanel />

      {/* Modern Navbar */}
      <nav className={\`fixed top-0 left-0 right-0 z-40 transition-all duration-300 \${isScrolled ? 'bg-[#0E0E0D]/80 backdrop-blur-md border-b border-[#1A1A17]' : 'bg-transparent'}\`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm tracking-wider text-[#f59e0b] font-bold">SUMMER VACATION.EXE</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#c4bba8]">
            <a href="#memories" className="hover:text-[#f7f1e5] transition-colors">Memories</a>
            <a href="#music" className="hover:text-[#f7f1e5] transition-colors">Music</a>
            <a href="#discover" className="hover:text-[#f7f1e5] transition-colors">Discover</a>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => { audioSynthesizer.playClick('switch'); setIsSearchModalOpen(true); }}
              className="p-2 text-[#c4bba8] hover:text-[#f7f1e5] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
               onClick={() => { audioSynthesizer.playClick('switch'); setIsSetupModalOpen(true); }}
               className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-[#1A1A17] border border-[#2a2a27] text-[#f59e0b] hover:bg-[#252522] transition-colors"
            >
              <span className="text-xs font-mono font-bold">⚙</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="pb-32">
        {/* HERO SECTION */}
        <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
          <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0 z-0">
             <img 
               src="https://images.unsplash.com/photo-1516961642265-531546e84af2?auto=format&fit=crop&q=80&w=2000" 
               alt="Nostalgic Scene" 
               className="w-full h-full object-cover opacity-30"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0D] via-[#0E0E0D]/60 to-transparent" />
          </motion.div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[#f7f1e5] mb-6"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              SUMMER VACATION.EXE
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-[#c4bba8] mb-12 max-w-2xl mx-auto font-serif italic"
            >
              "Some memories never learned how to leave."
            </motion.p>
            <motion.div 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1 }}
               className="flex flex-col sm:flex-row items-center gap-4"
            >
               <a href="#memories" className="px-8 py-3.5 rounded-full bg-[#f59e0b] text-[#0E0E0D] font-bold text-sm tracking-wide hover:bg-[#fbbf24] transition-all hover:scale-105 active:scale-95">
                 ENTER THE ARCHIVE
               </a>
               <button 
                 onClick={() => { audioSynthesizer.playClick('switch'); setIsFullPlayerOpen(true); }}
                 className="px-8 py-3.5 rounded-full bg-transparent border border-[#c4bba8]/30 text-[#f7f1e5] font-bold text-sm tracking-wide hover:border-[#f7f1e5] transition-all"
               >
                 PLAY SOMETHING
               </button>
            </motion.div>
          </div>
        </section>

        {/* FEATURED MEMORY */}
        <section id="memories" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
          {featuredMemory && (
            <div className="group relative rounded-3xl overflow-hidden bg-[#1A1A17] border border-[#2a2a27] aspect-[4/3] md:aspect-[21/9] flex flex-col md:flex-row">
               <div className="w-full md:w-3/5 h-64 md:h-full relative overflow-hidden">
                 <img src={featuredMemory.visualImage} alt={featuredMemory.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80" />
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1A1A17] hidden md:block" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A17] to-transparent md:hidden" />
               </div>
               <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-center relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-xs font-bold text-[#f59e0b] tracking-wider uppercase">MEMORY 001</span>
                    <span className="w-8 h-[1px] bg-[#2a2a27]"></span>
                    <span className="font-mono text-[10px] text-[#c4bba8]">{featuredMemory.year}</span>
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold mb-4 font-serif text-[#f7f1e5] leading-tight">{featuredMemory.title}</h2>
                 <p className="text-[#a89582] mb-8 line-clamp-3 text-sm md:text-base leading-relaxed">{featuredMemory.emotionalDescription}</p>
                 <div className="flex items-center gap-4 text-xs font-mono text-[#8a7663] mb-8">
                   <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Summer</div>
                   <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> India</div>
                 </div>
                 <button className="flex items-center gap-2 text-sm font-bold text-[#f7f1e5] hover:text-[#f59e0b] transition-colors w-max group/btn">
                   EXPLORE MEMORY <ChevronRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                 </button>
               </div>
            </div>
          )}
        </section>

        {/* MEMORY COLLECTION GRID */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-bold font-serif text-[#f7f1e5]">The Archive</h3>
            <span className="font-mono text-xs text-[#8a7663]">6 MEMORIES</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {memoryGridItems.map((mem, idx) => (
              <div key={mem.id} className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#1A1A17] mb-4">
                  <img src={mem.visualImage} alt={mem.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 group-hover:brightness-110 opacity-70 group-hover:opacity-100" />
                  <div className="absolute top-4 left-4">
                     <span className="font-mono text-[10px] px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[#f59e0b] border border-white/10 uppercase">{mem.year}</span>
                  </div>
                  <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                     <ChevronRight className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-bold font-serif text-[#f7f1e5] mb-1 group-hover:text-[#f59e0b] transition-colors">{mem.title}</h4>
                  <p className="text-sm text-[#8a7663] line-clamp-1">{mem.emotionalDescription}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CURATED PLAYLISTS */}
        <section id="music" className="py-24 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="flex items-center justify-between mb-12">
            <h3 className="text-2xl font-bold font-serif text-[#f7f1e5]">Curated Playlists</h3>
            <span className="font-mono text-xs text-[#8a7663]">SWIPE TO EXPLORE</span>
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {NOSTALGIA_PLAYLISTS.map((pl) => (
              <div 
                key={pl.id} 
                className="snap-start shrink-0 w-[280px] md:w-[320px] group cursor-pointer"
                onClick={() => { audioSynthesizer.playClick('switch'); playTrack(NOSTALGIA_TRACKS.find(t => t.id === pl.trackIds[0]) || NOSTALGIA_TRACKS[0], pl); }}
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#1A1A17] mb-4 border border-[#2a2a27] group-hover:border-[#4a4a44] transition-colors">
                  <img src={pl.coverImage} alt={pl.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                  <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#f59e0b] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0 shadow-lg">
                    <Play className="w-5 h-5 fill-[#0E0E0D] text-[#0E0E0D] ml-1" />
                  </div>
                </div>
                <h4 className="text-lg font-bold font-sans text-[#f7f1e5] mb-1">{pl.title}</h4>
                <p className="text-sm text-[#8a7663]">{pl.trackIds.length} songs · {pl.era}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DISCOVER SECTION */}
        <section id="discover" className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="mb-12">
            <h3 className="text-2xl font-bold font-serif text-[#f7f1e5] mb-2">Discover Something</h3>
            <p className="text-[#8a7663] text-sm">Find exactly what you are looking for.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
             <div className="p-8 rounded-2xl bg-[#1A1A17] border border-[#2a2a27] hover:bg-[#20201c] transition-colors cursor-pointer group flex flex-col justify-between aspect-square">
                <Music className="w-8 h-8 text-[#8a7663] group-hover:text-[#f59e0b] transition-colors mb-4" />
                <div>
                   <h4 className="font-bold text-lg text-[#f7f1e5] mb-2 leading-tight">Songs that sound like 2007.</h4>
                   <p className="text-xs text-[#8a7663] font-mono uppercase">Explore Era</p>
                </div>
             </div>
             <div className="p-8 rounded-2xl bg-gradient-to-br from-[#1A1A17] to-[#151513] border border-[#2a2a27] hover:border-[#f59e0b]/50 transition-colors cursor-pointer group flex flex-col justify-between aspect-square">
                <Clock className="w-8 h-8 text-[#8a7663] group-hover:text-[#f59e0b] transition-colors mb-4" />
                <div>
                   <h4 className="font-bold text-lg text-[#f7f1e5] mb-2 leading-tight">Rain outside. Headphones on.</h4>
                   <p className="text-xs text-[#8a7663] font-mono uppercase">Late Night Mix</p>
                </div>
             </div>
             <div className="p-8 rounded-2xl bg-[#1A1A17] border border-[#2a2a27] hover:bg-[#20201c] transition-colors cursor-pointer group flex flex-col justify-between aspect-square">
                <MapPin className="w-8 h-8 text-[#8a7663] group-hover:text-[#f59e0b] transition-colors mb-4" />
                <div>
                   <h4 className="font-bold text-lg text-[#f7f1e5] mb-2 leading-tight">For the ride home.</h4>
                   <p className="text-xs text-[#8a7663] font-mono uppercase">Travel Mix</p>
                </div>
             </div>
             <div className="p-8 rounded-2xl bg-[#1A1A17] border border-[#2a2a27] hover:bg-[#20201c] transition-colors cursor-pointer group flex flex-col justify-between aspect-square">
                <Calendar className="w-8 h-8 text-[#8a7663] group-hover:text-[#f59e0b] transition-colors mb-4" />
                <div>
                   <h4 className="font-bold text-lg text-[#f7f1e5] mb-2 leading-tight">Sunday afternoon.</h4>
                   <p className="text-xs text-[#8a7663] font-mono uppercase">Relaxing Vibes</p>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full bg-[#0E0E0D] border-t border-[#1A1A17] py-12 px-4 md:px-8">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="font-mono text-sm tracking-wider text-[#8a7663] font-bold">SUMMER VACATION.EXE</span>
            <span className="text-[#8a7663] text-sm font-serif italic">Made from memories.</span>
            <div className="flex flex-col items-center md:items-end gap-2">
               <div className="flex items-center gap-4 text-sm font-mono text-[#6b5847]">
                 <a href="https://www.linkedin.com/in/priyanshubharangar" target="_blank" rel="noopener noreferrer" className="hover:text-[#f7f1e5] transition-colors">LinkedIn</a>
                 <a href="https://www.instagram.com/priyanshubharangar" target="_blank" rel="noopener noreferrer" className="hover:text-[#f7f1e5] transition-colors">Instagram</a>
               </div>
               <span className="text-xs text-[#4a4a44]">© 2026</span>
            </div>
         </div>
      </footer>

      {/* Modals & Dialogs */}
      <MusicSourceSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
      />
      <SongSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
      />
      <VerifyPlaylistModal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
      />

      {/* Layer 16 & 17 — Persistent Radio Deck & Full-Screen Nostalgia Radio Modal */}
      <NostalgiaRadioPlayer />
      <NostalgiaRadioModal
        isOpen={isFullPlayerOpen}
        onClose={() => setIsFullPlayerOpen(false)}
        onOpenMemory={(memSlug) => {
          setIsFullPlayerOpen(false);
          // Handle memory opening logic
        }}
      />
    </div>
  );
};
`
fs.writeFileSync('src/pages/Home.tsx', content);
