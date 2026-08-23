import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Folder,
  Music,
  Map,
  BookOpen,
  Tv,
  Ticket,
  Sliders,
  Volume2,
  VolumeX,
  X,
  Clock,
  Sparkles,
  Wifi,
  Compass,
  Search
} from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import { useMusic } from '../context/MusicContext.tsx';

interface MobilePocketDockProps {
  currentMode: string;
  onModeSelect: (mode: any) => void;
  selectedYear: number;
  onYearChange: (year: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenTicket: () => void;
  onTriggerDialUp: () => void;
  onOpenAmbientMixer: () => void;
}

export const MobilePocketDock: React.FC<MobilePocketDockProps> = ({
  currentMode,
  onModeSelect,
  selectedYear,
  onYearChange,
  isMuted,
  onToggleMute,
  onOpenTicket,
  onTriggerDialUp,
  onOpenAmbientMixer
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { openSearchModal } = useMusic();

  const triggerHaptic = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch (err) {
        // Ignore unsupported vibrate
      }
    }
  };

  const navItems = [
    {
      id: 'memories',
      label: 'Memories',
      hindi: 'स्मृतियाँ',
      icon: Folder,
      anchor: '#memory-explorer'
    },
    {
      id: 'music',
      label: 'Walkman',
      hindi: 'ऑडियो',
      icon: Music,
      anchor: '#cassette-deck'
    },
    {
      id: 'map',
      label: 'Map',
      hindi: 'मैप',
      icon: Map,
      anchor: '#summer-world'
    },
    {
      id: 'slam',
      label: 'SlamBook',
      hindi: 'स्लैम',
      icon: BookOpen,
      anchor: '#slam-book'
    },
    {
      id: 'tv',
      label: 'DD TV',
      hindi: 'टीवी',
      icon: Tv,
      anchor: '#crt-television'
    }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    triggerHaptic();
    audioSynthesizer.playClick('switch');
    
    // Switch navigation mode if available
    if (item.id === 'memories') onModeSelect('memories');
    else if (item.id === 'map') onModeSelect('map');
    else onModeSelect('all');

    // Smooth scroll to anchor
    setTimeout(() => {
      const target = document.querySelector(item.anchor);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  const YEARS = [1990, 1994, 1996, 1998, 1999, 2002, 2004, 2005];

  return (
    <>
      {/* MOBILE POCKET CONTROLS DRAWER (Touch Bottom Sheet) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end"
            onClick={() => setIsDrawerOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full bg-[#18120e] border-t-2 border-[#b45309] rounded-t-2xl p-5 shadow-2xl text-[#f3ede2] font-mono space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Drawer Handle Header */}
              <div className="flex items-center justify-between border-b border-[#3d2a1d] pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-[#b45309] rounded-full mx-auto absolute top-2 left-1/2 -translate-x-1/2" />
                  <Sliders className="w-5 h-5 text-[#f59e0b]" />
                  <h3 className="font-bold text-sm font-serif-vintage text-[#fcd34d]">
                    Pocket Nostalgia Controls ’99
                  </h3>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-10 h-10 rounded-full bg-[#2a1d15] flex items-center justify-center text-gray-300 active:scale-95 border border-[#4d3625]"
                  aria-label="Close Controls"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Year Time-Warp Selector */}
              <div className="p-3 bg-[#241710] rounded-xl border border-[#4d3625] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#a89078] font-pixel uppercase">Time-Warp Era Year:</span>
                  <strong className="text-base text-[#f59e0b] font-mono">{selectedYear}</strong>
                </div>

                <div className="grid grid-cols-4 gap-1.5">
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      onClick={() => {
                        triggerHaptic();
                        onYearChange(y);
                        audioSynthesizer.playTimeWarpWhoosh();
                      }}
                      className={`min-h-[44px] rounded-lg font-mono text-xs font-bold border transition-all active:scale-95 ${
                        selectedYear === y
                          ? 'bg-[#b45309] text-white border-[#f59e0b] shadow-md'
                          : 'bg-[#18110c] text-gray-400 border-[#3d2719]'
                      }`}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenTicket();
                  }}
                  className="min-h-[48px] p-3 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold flex items-center justify-center gap-2 active:scale-95 shadow border border-amber-500/30"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Memory Ticket</span>
                </button>

                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onTriggerDialUp();
                  }}
                  className="min-h-[48px] p-3 rounded-xl bg-[#000080] hover:bg-[#1084d0] text-white font-bold flex items-center justify-center gap-2 active:scale-95 shadow border border-blue-400/30"
                >
                  <Wifi className="w-4 h-4 text-[#ffff00]" />
                  <span>56k Dial-Up</span>
                </button>

                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onOpenAmbientMixer();
                  }}
                  className="min-h-[48px] p-3 rounded-xl bg-[#2e1d13] text-[#fcd34d] font-bold flex items-center justify-center gap-2 active:scale-95 border border-[#5d3f28]"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Ceiling Fan Sound</span>
                </button>

                <button
                  onClick={() => {
                    triggerHaptic();
                    onToggleMute();
                  }}
                  className="min-h-[48px] p-3 rounded-xl bg-[#221711] text-gray-200 font-bold flex items-center justify-center gap-2 active:scale-95 border border-[#3d2a1f]"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-4 h-4 text-rose-400" />
                      <span>Unmute Sound</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      <span>Mute Sound</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Note */}
              <p className="text-[10px] text-center text-[#8a7663] pt-1">
                Aangan ’99 Pocket Nostalgia Deck • Tap any module to jump directly.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FIXED PERSISTENT MOBILE BOTTOM NAVIGATION DOCK (44px+ touch targets) */}
      <nav
        aria-label="Mobile Pocket Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#160f0b]/95 backdrop-blur-lg border-t-2 border-[#8c6d53] px-2 py-1.5 shadow-[0_-10px_25px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {navItems.map((item) => {
            const IconComp = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 py-1 rounded-xl text-gray-300 active:scale-95 transition-all hover:text-[#f59e0b] focus:outline-none"
              >
                <IconComp className="w-5 h-5 mb-0.5 text-[#f59e0b]" />
                <span className="text-[10px] font-mono leading-none tracking-tight font-semibold">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Search Button */}
          <button
            onClick={() => {
              triggerHaptic();
              audioSynthesizer.playClick('switch');
              openSearchModal();
            }}
            className="flex flex-col items-center justify-center min-w-[52px] min-h-[48px] px-1 py-1 rounded-xl bg-[#854d0e]/30 border border-[#f59e0b]/50 text-[#fef08a] active:scale-95 transition-all"
            title="Search Songs"
          >
            <Search className="w-5 h-5 mb-0.5 text-[#fef08a]" />
            <span className="text-[10px] font-mono font-bold leading-none">Search</span>
          </button>

          {/* Ticket Pass Button */}
          <button
            onClick={() => {
              triggerHaptic();
              audioSynthesizer.playClick('heavy');
              onOpenTicket();
            }}
            className="flex flex-col items-center justify-center min-w-[56px] min-h-[48px] px-1 py-1 rounded-xl bg-[#d97706]/20 border border-[#f59e0b]/40 text-[#fcd34d] active:scale-95 transition-all"
            title="Generate Memory Ticket Pass"
          >
            <Ticket className="w-5 h-5 mb-0.5 text-amber-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold leading-none">Ticket</span>
          </button>

          {/* Pocket Controls Opener */}
          <button
            onClick={() => {
              triggerHaptic();
              audioSynthesizer.playClick('switch');
              setIsDrawerOpen(true);
            }}
            className="flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-1 py-1 rounded-xl bg-[#2a1d15] border border-[#523d2e] text-[#e5a93c] active:scale-95 transition-all"
            title="Pocket Controls"
          >
            <Sliders className="w-5 h-5 mb-0.5" />
            <span className="text-[9px] font-mono leading-none font-bold">Era ’{selectedYear.toString().slice(-2)}</span>
          </button>
        </div>
      </nav>
    </>
  );
};
