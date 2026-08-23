import React from 'react';
import { Volume2, VolumeX, Sliders, Tv, Radio, Sparkles, Compass, Monitor, Search, ShieldCheck } from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import { useMusic } from '../context/MusicContext.tsx';

interface NavigationBannerProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  crtEnabled: boolean;
  onToggleCrt: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenAmbientMixer: () => void;
  onTriggerDialUp: () => void;
  onReplayBoot?: () => void;
  onOpenAIMemory?: () => void;
  onOpenVerifyModal?: () => void;
}

const NOSTALGIA_YEARS = [
  { year: 1992, label: '1992', subtitle: 'Gold Spot & Doordarshan Sunday' },
  { year: 1996, label: '1996', subtitle: 'Wills World Cup & Alisha Chinai' },
  { year: 1999, label: '1999', subtitle: 'Desert Storm & VSNL 56k' },
  { year: 2002, label: '2002', subtitle: 'Natraj Pencil & Cyber Cafes' },
  { year: 2005, label: '2005', subtitle: 'Sony Walkman & Slam Books' }
];

export const NavigationBanner: React.FC<NavigationBannerProps> = ({
  selectedYear,
  onYearChange,
  crtEnabled,
  onToggleCrt,
  isMuted,
  onToggleMute,
  onOpenAmbientMixer,
  onTriggerDialUp,
  onReplayBoot,
  onOpenAIMemory,
  onOpenVerifyModal
}) => {
  const { openSearchModal } = useMusic();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#4d3b2c] bg-[#1a1412]/95 backdrop-blur-md shadow-xl">
      {/* Top Ticker with era quote */}
      <div className="px-4 py-1.5 bg-[#2a1d15] border-b border-[#3d2c20] flex items-center justify-between text-xs text-[#c2ad94]">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex-shrink-0 px-1.5 py-0.5 rounded bg-[#b45309]/30 text-[#f59e0b] border border-[#b45309]/50 font-pixel uppercase tracking-widest text-[10px]">
            Broadcast Active
          </span>
          <p className="truncate font-typewriter text-[11px] text-[#e0cfba]">
            {selectedYear === 1992 && '📻 1992: Sunday 9 AM Doordarshan jungle theme playing; hot chai in steel tumblers.'}
            {selectedYear === 1996 && '🏏 1996: Wills World Cup frenzy; trading chewing gum stickers in school recess.'}
            {selectedYear === 1999 && '📼 1999: Rewinding cassette tape with Natraj HB pencil; waiting for VSNL 56k dial-up.'}
            {selectedYear === 2002 && '🕹️ 2002: Playing WWF Trump Cards on school bus; 1 rupee Phantom sweet cigarettes.'}
            {selectedYear === 2005 && '📖 2005: Passing around colorful gel-pen slam books on the last day of school.'}
          </p>
        </div>

        <div className="hidden md:flex items-center gap-3 text-[11px] font-pixel text-[#8e7b69]">
          <span>FREQ: 104.8 MHz</span>
          <span>•</span>
          <span>ALL INDIA NOSTALGIA</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded border-2 border-[#b45309] bg-gradient-to-b from-[#3a2517] to-[#1d130c] shadow-inner">
            <span className="text-xl">🪔</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#22c55e] border border-[#1a1412] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#f5eedc] font-serif-vintage">
                आँगन <span className="text-[#e5a93c] font-sans text-base">AANGAN ’99</span>
              </h1>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#3b2a1e] text-[#d4af37] border border-[#6b4e33] font-pixel uppercase">
                Artifact v1.0
              </span>
            </div>
            <p className="text-[11px] text-[#a89580] font-handwriting">
              The Indian Childhood Digital Time Machine
            </p>
          </div>
        </div>

        {/* Year Selector / Time Dial */}
        <div className="flex items-center gap-1.5 p-1 bg-[#120e0c] border border-[#443325] rounded-lg overflow-x-auto max-w-full">
          <div className="px-2 py-1 flex items-center gap-1 text-[10px] uppercase font-pixel text-[#9e8b78] border-r border-[#33261b]">
            <Compass className="w-3 h-3 text-[#e5a93c]" />
            <span>Era:</span>
          </div>
          {NOSTALGIA_YEARS.map(({ year, label }) => {
            const isSelected = selectedYear === year;
            return (
              <button
                key={year}
                onClick={() => {
                  audioSynthesizer.playClick('soft');
                  onYearChange(year);
                }}
                className={`px-2.5 py-1 text-xs rounded transition-all font-typewriter flex items-center gap-1 ${
                  isSelected
                    ? 'bg-[#c2842e] text-[#120f0e] font-bold shadow-md scale-105'
                    : 'text-[#bfab96] hover:bg-[#2c2018] hover:text-[#f3e8d6]'
                }`}
              >
                <span>’{label.slice(2)}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#120f0e]" />}
              </button>
            );
          })}
        </div>

        {/* Controls: Audio, CRT, Ambient Soundboard */}
        <div className="flex items-center gap-2">
          {/* Verify Playlist Tool Button */}
          {onOpenVerifyModal && (
            <button
              onClick={() => {
                audioSynthesizer.playClick('switch');
                onOpenVerifyModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a8a] hover:bg-[#2563eb] border border-[#60a5fa] text-[#93c5fd] font-bold text-xs rounded shadow-lg transition-transform active:scale-95 font-pixel uppercase text-[11px]"
              title="Verify Playlist Audit Tool"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#60a5fa]" />
              <span className="hidden sm:inline">VERIFY PLAYLIST ●</span>
            </button>
          )}

          {/* Song Search Quick Launcher Button */}
          <button
            onClick={() => openSearchModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#d97706] hover:bg-[#f59e0b] border border-[#fef08a] text-black font-bold text-xs rounded shadow-lg transition-transform active:scale-95 font-pixel uppercase text-[11px]"
            title="Search Any Song, Artist, or YouTube track"
          >
            <Search className="w-3.5 h-3.5 text-black" />
            <span>Search Songs</span>
          </button>

          {/* Retro OS Desktop Navigation Link */}
          <a
            href="#retro-desktop-nav-system"
            onClick={() => audioSynthesizer.playClick('switch')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#000080] hover:bg-[#1084d0] border border-[#ffff00] text-[#ffff00] text-xs rounded shadow transition-transform active:scale-95 font-pixel uppercase text-[11px]"
            title="Open Retro Windows 98 Desktop Navigation"
          >
            <Monitor className="w-3.5 h-3.5 text-[#ffff00] animate-pulse" />
            <span className="hidden sm:inline">Desktop OS</span>
          </a>

          {/* Memory Archive Link */}
          <a
            href="#memory-explorer"
            onClick={() => audioSynthesizer.playClick('switch')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#331f13] hover:bg-[#472c1c] border border-[#b45309] text-[#fcd34d] text-xs rounded shadow transition-transform active:scale-95 font-pixel uppercase text-[11px]"
            title="Open Central Memory Explorer"
          >
            <Compass className="w-3.5 h-3.5 text-[#fbbf24]" />
            <span className="hidden md:inline">Memories</span>
          </a>

          {/* AI Memory Generator Button */}
          {onOpenAIMemory && (
            <button
              onClick={() => {
                audioSynthesizer.playClick('switch');
                onOpenAIMemory();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#854d0e] hover:bg-[#a16207] border border-[#fef08a] text-[#fef08a] text-xs rounded shadow transition-transform active:scale-95 font-pixel uppercase text-[11px]"
              title="Tell me something you remember (AI Memory Generator)"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fef08a] animate-pulse" />
              <span className="hidden lg:inline">Tell A Memory</span>
            </button>
          )}

          {/* Ambient Soundboard */}
          <button
            onClick={() => {
              audioSynthesizer.playClick('switch');
              onOpenAmbientMixer();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#281e18] hover:bg-[#382b22] border border-[#5c4431] text-[#e0cfba] text-xs rounded shadow transition-transform active:scale-95 font-typewriter"
            title="Ambient Sound Mixer (Ceiling Fan, Rain, Pressure Cooker)"
          >
            <Sliders className="w-3.5 h-3.5 text-[#e5a93c]" />
            <span className="hidden sm:inline">Sounds of 90s</span>
          </button>

          {/* Replay Boot Sequence button */}
          {onReplayBoot && (
            <button
              onClick={() => {
                audioSynthesizer.playClick('switch');
                onReplayBoot();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#281e18] hover:bg-[#382b22] border border-[#5c4431] text-[#e0cfba] text-xs rounded shadow font-pixel uppercase text-[11px]"
              title="Replay Cinematic Boot Experience"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span className="hidden lg:inline">Boot.exe</span>
            </button>
          )}

          {/* 56k Dial-up button */}
          <button
            onClick={() => {
              audioSynthesizer.playClick('switch');
              onTriggerDialUp();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#281e18] hover:bg-[#382b22] border border-[#5c4431] text-[#e0cfba] text-xs rounded shadow font-pixel uppercase text-[11px]"
            title="Play 56k Dial-up Modem sound"
          >
            <Radio className="w-3.5 h-3.5 text-[#4ade80]" />
            <span className="hidden md:inline">56k Dial</span>
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={() => {
              audioSynthesizer.playClick('switch');
              onToggleCrt();
            }}
            className={`p-2 rounded border text-xs transition-all ${
              crtEnabled
                ? 'bg-[#433020] border-[#b45309] text-[#fbbf24] shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                : 'bg-[#1f1713] border-[#443325] text-[#93806d] hover:text-[#e0cfba]'
            }`}
            title={crtEnabled ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Master Audio Mute */}
          <button
            onClick={() => {
              audioSynthesizer.playClick('switch');
              onToggleMute();
            }}
            className={`p-2 rounded border text-xs transition-all ${
              !isMuted
                ? 'bg-[#1e3321] border-[#22c55e]/60 text-[#4ade80]'
                : 'bg-[#311c1c] border-[#ef4444]/60 text-[#f87171]'
            }`}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
