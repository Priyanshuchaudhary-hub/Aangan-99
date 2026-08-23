import React, { useState, useEffect } from 'react';
import { useMusic } from '../context/MusicContext.tsx';
import { NavigationBanner } from '../components/NavigationBanner.tsx';
import { VintageVisualKnobs, VisualMode } from '../components/VintageVisualKnobs.tsx';
import { SummerVacationWorld } from '../components/SummerVacationWorld.tsx';
import { PhysicalEphemera } from '../components/PhysicalEphemera.tsx';
import { DialUpBootModal } from '../components/DialUpBootModal.tsx';
import { CassetteDeck } from '../components/CassetteDeck.tsx';
import { CRTTelevision } from '../components/CRTTelevision.tsx';
import { MemoryTrunk } from '../components/MemoryTrunk.tsx';
import { MonsoonPuddle } from '../components/MonsoonPuddle.tsx';
import { SlamBook } from '../components/SlamBook.tsx';
import { MemoryTelegramPostcard } from '../components/MemoryTelegramPostcard.tsx';
import { AmbientSoundMixer } from '../components/AmbientSoundMixer.tsx';
import { NostalgicAudioPlayer } from '../components/NostalgicAudioPlayer.tsx';
import { MemoryExplorer } from '../components/MemoryExplorer.tsx';
import { SummerVacationLauncher, MainNavMode } from '../components/SummerVacationLauncher.tsx';
import { RetroDesktopNavigation } from '../components/RetroDesktopNavigation.tsx';
import { EasterEggDialog } from '../components/EasterEgg/EasterEggDialog.tsx';
import { ShareTicketModal } from '../components/ShareTicket/ShareTicketModal.tsx';
import { DiscoverableRelics } from '../components/EasterEggs/DiscoverableRelics.tsx';
import { ExplorationMilestoneBanner } from '../components/EasterEggs/ExplorationMilestoneBanner.tsx';
import { NOSTALGIA_IMAGES } from '../assets/imagePaths.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import { MEMORY_EXPLORER_ITEMS, MemoryItem, findMemoryBySlug } from '../data/memoryExplorerData.ts';
import { MobilePocketDock } from '../components/MobilePocketDock.tsx';
import { AIMemoryGeneratorModal } from '../components/AIMemoryGeneratorModal.tsx';
import { RetroCustomCursor } from '../components/RetroCustomCursor.tsx';
import { PointerParallaxLayer } from '../components/PointerParallaxLayer.tsx';
import { NostalgiaRadioPlayer } from '../components/NostalgiaRadioPlayer.tsx';
import { NostalgiaRadioModal } from '../components/NostalgiaRadioModal.tsx';
import { SongSearchModal } from '../components/SongSearchModal.tsx';
import { MusicSourceSetupModal } from '../components/MusicSourceSetupModal.tsx';
import { DeveloperDebugPanel } from '../components/DeveloperDebugPanel.tsx';
import { VerifyPlaylistModal } from '../components/VerifyPlaylistModal.tsx';
import { FooterSocialLinks } from '../components/FooterSocialLinks.tsx';
import {
  Sparkles,
  Radio,
  Music,
  Tv,
  Heart,
  BookOpen,
  CloudRain,
  Package,
  Mail,
  Ticket,
  Monitor,
  Compass,
  Award,
  Share2
} from 'lucide-react';

interface HomeProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  visualMode: VisualMode;
  onVisualModeChange: (mode: VisualMode) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onReplayBoot: () => void;
}

export const Home: React.FC<HomeProps> = ({
  selectedYear,
  onYearChange,
  visualMode,
  onVisualModeChange,
  isMuted,
  onToggleMute,
  onReplayBoot
}) => {
  const { isLoading, isUnavailable } = useMusic();
  const [isDialUpModalOpen, setIsDialUpModalOpen] = useState<boolean>(false);
  const [isAmbientMixerOpen, setIsAmbientMixerOpen] = useState<boolean>(false);
  const [isEasterEggOpen, setIsEasterEggOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isAIMemoryModalOpen, setIsAIMemoryModalOpen] = useState<boolean>(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState<boolean>(false);
  const [selectedMemoryForTicket, setSelectedMemoryForTicket] = useState<MemoryItem | null>(null);

  const [interactionCount, setInteractionCount] = useState<number>(0);
  const [mainNavMode, setMainNavMode] = useState<MainNavMode>('desktop');

  const {
    isFullPlayerOpen,
    setIsFullPlayerOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isSetupModalOpen,
    setIsSetupModalOpen
  } = useMusic();

  const incrementInteraction = () => {
    setInteractionCount((prev) => prev + 1);
  };

  const handleOpenTicketForMemory = (mem: MemoryItem | null) => {
    setSelectedMemoryForTicket(mem);
    setIsShareModalOpen(true);
    incrementInteraction();
  };

  // Konami Code Detection
  useEffect(() => {
    const konamiCode = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'b',
      'a'
    ];
    let currentIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      const requiredKey = konamiCode[currentIndex];
      if (e.key.toLowerCase() === requiredKey.toLowerCase()) {
        currentIndex++;
        if (currentIndex === konamiCode.length) {
          setIsEasterEggOpen(true);
          currentIndex = 0;
        }
      } else {
        currentIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleCrt = () => {
    onVisualModeChange(visualMode === 'crt' ? 'raw' : 'crt');
  };

  return (
    <div className="relative min-h-screen bg-[#120f0e] text-[#e6dfd5]">
      {/* Layer 14: Custom Retro Desktop Cursor & Analog Film Grain */}
      <RetroCustomCursor />
      <div className="film-grain-overlay" aria-hidden="true" />

      {/* Developer Debug Telemetry Panel */}
      <DeveloperDebugPanel />

      {/* Top Banner Navigation */}
      <NavigationBanner
        selectedYear={selectedYear}
        onYearChange={onYearChange}
        crtEnabled={visualMode === 'crt' || visualMode === 'vhs' || visualMode === 'amber'}
        onToggleCrt={handleToggleCrt}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onOpenAmbientMixer={() => setIsAmbientMixerOpen(true)}
        onTriggerDialUp={() => setIsDialUpModalOpen(true)}
        onReplayBoot={onReplayBoot}
        onOpenAIMemory={() => setIsAIMemoryModalOpen(true)}
        onOpenVerifyModal={() => setIsVerifyModalOpen(true)}
      />

      {/* Vintage Visual Knobs & Analog Filter Mode Controls */}
      <VintageVisualKnobs
        currentMode={visualMode}
        onModeChange={onVisualModeChange}
      />

      {/* Hero Header Landmark */}
      <header className="relative px-4 py-8 md:py-14 border-b border-[#3b2b1e] bg-gradient-to-b from-[#1c1511] via-[#16100d] to-[#120f0e] overflow-hidden">
        {/* Subtle Background Art */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-luminosity">
          <img
            src={NOSTALGIA_IMAGES.room}
            alt="90s Indian Living Room with wooden shelf and Doordarshan TV"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Pointer Parallax Backdrop */}
        <PointerParallaxLayer intensity={12}>
          <div className="max-w-5xl mx-auto text-center space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#2e1d13] border border-[#6b4c35] rounded-full text-xs font-mono text-[#e5a93c] shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span className="font-pixel uppercase tracking-wider">
                {isLoading ? 'VERIFYING...' : isUnavailable ? 'UNAVAILABLE ●' : 'VERIFIED ●'}
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isLoading
                    ? 'bg-amber-400 animate-pulse'
                    : isUnavailable
                    ? 'bg-rose-500'
                    : 'bg-emerald-500'
                }`}
              />
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif-vintage tracking-tight text-[#fce8d5] drop-shadow-md">
              आँगन ’99 — <span className="text-[#e5a93c]">SUMMER VACATION.EXE</span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#c2b2a0] font-serif leading-relaxed">
              Step barefoot onto cool mosaic tiles. Turn the radio dial, listen to real 90s/2000s themes, feel the whir of the Usha ceiling fan, and open chapter memory capsules from an Indian childhood.
            </p>

            {/* Quick Action Button Pill Row */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setIsFullPlayerOpen(true)}
                className="px-4 py-2 bg-[#f59e0b] hover:bg-[#d97706] text-[#1c120c] font-bold text-xs rounded-xl shadow flex items-center gap-2 active:scale-95 transition-all font-pixel uppercase"
              >
                <Radio className="w-4 h-4" />
                <span>Open Nostalgia Radio</span>
              </button>

              <button
                onClick={() => handleOpenTicketForMemory(null)}
                className="px-4 py-2 bg-[#2d1f16] hover:bg-[#402d20] border border-[#5c402d] text-[#e8ded1] text-xs font-bold rounded-xl shadow flex items-center gap-2 active:scale-95 transition-all"
              >
                <Ticket className="w-4 h-4 text-[#e5a93c]" />
                <span>Generate Vacation Pass</span>
              </button>

              <button
                onClick={() => setIsAIMemoryModalOpen(true)}
                className="px-4 py-2 bg-[#2d1f16] hover:bg-[#402d20] border border-[#5c402d] text-[#e8ded1] text-xs font-bold rounded-xl shadow flex items-center gap-2 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Memory Synthesizer</span>
              </button>
            </div>
          </div>
        </PointerParallaxLayer>
      </header>

      {/* Primary OS & Interactive Launcher */}
      <SummerVacationLauncher
        currentMode={mainNavMode}
        onModeSelect={(mode) => {
          setMainNavMode(mode);
          incrementInteraction();
        }}
        selectedYear={selectedYear}
      />

      {/* Main Dynamic View Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* DESKTOP OS / FOLDER DIRECTORY VIEW */}
        {mainNavMode === 'desktop' && (
          <section className="space-y-8">
            <RetroDesktopNavigation
              selectedYear={selectedYear}
              onYearChange={onYearChange}
              visualMode={visualMode}
              onVisualModeChange={onVisualModeChange}
              isMuted={isMuted}
              onToggleMute={onToggleMute}
              onOpenAmbientMixer={() => setIsAmbientMixerOpen(true)}
              onTriggerDialUp={() => setIsDialUpModalOpen(true)}
              onReplayBoot={onReplayBoot}
              onOpenMemoryModal={(mem) => handleOpenTicketForMemory(mem)}
              onOpenTicket={(mem) => handleOpenTicketForMemory(mem)}
            />
            <MemoryExplorer
              onOpenTicket={(mem) => handleOpenTicketForMemory(mem)}
            />
          </section>
        )}

        {/* TIME CAPSULE WORLD VIEW */}
        {mainNavMode === 'world' && (
          <SummerVacationWorld
            selectedYear={selectedYear}
            onCollectRelic={incrementInteraction}
            onOpenTicket={(mem) => handleOpenTicketForMemory(mem)}
          />
        )}

        {/* PHYSICAL EPHEMERA GALLERY */}
        {mainNavMode === 'ephemera' && (
          <PhysicalEphemera
            selectedYear={selectedYear}
            onOpenTicket={(mem) => handleOpenTicketForMemory(mem)}
          />
        )}

        {/* CASSETTE TAPE DECK */}
        {mainNavMode === 'cassette' && (
          <section className="space-y-6">
            <CassetteDeck selectedYear={selectedYear} />
          </section>
        )}

        {/* DOORDARSHAN CRT TELEVISION */}
        {mainNavMode === 'tv' && (
          <section className="space-y-6">
            <CRTTelevision selectedYear={selectedYear} />
          </section>
        )}

        {/* MONSOON TERRACE PUDDLE & SLAM BOOK */}
        {mainNavMode === 'monsoon' && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MonsoonPuddle />
            <SlamBook />
          </section>
        )}

        {/* MEMORY TELEGRAM POSTCARD */}
        {mainNavMode === 'telegram' && (
          <section className="space-y-6">
            <MemoryTelegramPostcard />
          </section>
        )}

        {/* ALL MEMORIES EXPLORER */}
        {mainNavMode === 'all-memories' && (
          <section className="space-y-6">
            <MemoryExplorer
              onOpenTicket={(mem) => handleOpenTicketForMemory(mem)}
            />
          </section>
        )}
      </main>

      {/* Nostalgic Semantic Footer with Social Connect */}
      <footer className="w-full border-t border-[#38271c] bg-[#140e0b] py-10 px-4 text-center text-xs font-mono text-[#8a7663] space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-[#e5a93c] font-serif-vintage">
          <span>🪔</span>
          <span>आँगन (Aangan ’99)</span>
          <span>🪔</span>
        </div>
        <p className="max-w-md mx-auto text-[11px] font-handwriting text-base text-[#b8a490]">
          "Dedicated to every kid who counted three cooker whistles, blew into a video game cartridge, and saved the purple Poppins for last."
        </p>
        <div className="pt-2 text-[10px] text-[#6b5847] flex items-center justify-center gap-3">
          <span>TDK 60-MIN MAGNETIC TAPE</span>
          <span>•</span>
          <span>AIR FM STEREO 104.8 MHz</span>
          <span>•</span>
          <span>VSNL 56K DIAL-UP</span>
        </div>

        {/* CONNECT WITH ME — Social Links Section */}
        <FooterSocialLinks />

        {/* Official Copyright & Archive Notice */}
        <div className="pt-2 border-t border-[#261912] max-w-md mx-auto text-[11px] text-[#7a6755] space-y-1">
          <p className="font-pixel text-[10px] text-[#ba9f83]">
            © 1999–2026 • Aangan '99
          </p>
          <p className="text-[10px] text-[#63503f]">
            A Childhood Digital Time Machine
          </p>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <DialUpBootModal
        isOpen={isDialUpModalOpen}
        onClose={() => setIsDialUpModalOpen(false)}
      />

      <AmbientSoundMixer
        isOpen={isAmbientMixerOpen}
        onClose={() => setIsAmbientMixerOpen(false)}
      />

      <EasterEggDialog
        isOpen={isEasterEggOpen}
        onClose={() => setIsEasterEggOpen(false)}
      />

      <ShareTicketModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        selectedYear={selectedYear}
        memoryItem={selectedMemoryForTicket}
        onSelectMemory={(mem) => setSelectedMemoryForTicket(mem)}
      />

      <AIMemoryGeneratorModal
        isOpen={isAIMemoryModalOpen}
        onClose={() => setIsAIMemoryModalOpen(false)}
      />

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
          const matched = findMemoryBySlug(memSlug);
          if (matched) {
            handleOpenTicketForMemory(matched);
          }
        }}
      />

      {/* Layer 10 Easter Eggs: Discoverable Relics & Exploration Milestone */}
      <DiscoverableRelics onCollect={incrementInteraction} />
      <ExplorationMilestoneBanner interactionCount={interactionCount} />

      {/* Layer 12: Dedicated Touch-Friendly Mobile Pocket Dock */}
      <MobilePocketDock
        currentMode={mainNavMode}
        onModeSelect={(mode) => setMainNavMode(mode)}
        selectedYear={selectedYear}
        onYearChange={onYearChange}
        isMuted={isMuted}
        onToggleMute={onToggleMute}
        onOpenTicket={() => handleOpenTicketForMemory(null)}
        onTriggerDialUp={() => setIsDialUpModalOpen(true)}
        onOpenAmbientMixer={() => setIsAmbientMixerOpen(true)}
      />
    </div>
  );
};
