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
    <header className="sticky top-0 z-40 w-full border-b border-[#261912] bg-[#120f0e] shadow-md">
      <div className="px-4 py-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center w-6 h-6 rounded border border-[#b45309] bg-gradient-to-b from-[#3a2517] to-[#1d130c] shadow-inner">
            <span className="text-sm">🪔</span>
          </div>
          <h1 className="text-sm md:text-base font-bold tracking-tight text-[#f5eedc] font-sans">
            AANGAN ’99
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-[#8e7b69] hidden md:inline">FREQ: 104.8 MHz</span>
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
      </div>

        {/* Controls: Audio, CRT, Ambient Soundboard */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => openSearchModal()}
            className="p-1.5 bg-[#d97706] hover:bg-[#f59e0b] border border-[#fef08a] text-black rounded transition-transform active:scale-95"
            title="Search Any Song, Artist, or YouTube track"
          >
            <Search className="w-4 h-4 text-black" />
          </button>
          {onOpenAIMemory && (
            <button
              onClick={() => { audioSynthesizer.playClick("switch"); onOpenAIMemory(); }}
              className="p-1.5 bg-[#854d0e] hover:bg-[#a16207] border border-[#fef08a] text-[#fef08a] rounded transition-transform active:scale-95"
              title="Tell me something you remember (AI Memory Generator)"
            >
              <Sparkles className="w-4 h-4 text-[#fef08a] animate-pulse" />
            </button>
          )}
          <button
            onClick={() => { audioSynthesizer.playClick("switch"); onOpenAmbientMixer(); }}
            className="p-1.5 bg-[#281e18] hover:bg-[#382b22] border border-[#5c4431] text-[#e0cfba] rounded transition-transform active:scale-95"
            title="Ambient Sound Mixer (Ceiling Fan, Rain, Pressure Cooker)"
          >
            <Sliders className="w-4 h-4 text-[#e5a93c]" />
          </button>
          <button
            onClick={() => { audioSynthesizer.playClick("switch"); onToggleCrt(); }}
            className={`p-1.5 rounded border transition-all ${crtEnabled ? "bg-[#433020] border-[#b45309] text-[#fbbf24] shadow-[0_0_8px_rgba(245,158,11,0.3)]" : "bg-[#1f1713] border-[#443325] text-[#93806d] hover:text-[#e0cfba]"}`}
            title={crtEnabled ? "Disable CRT Scanlines" : "Enable CRT Scanlines"}
          >
            <Tv className="w-4 h-4" />
          </button>
          <button
            onClick={() => { audioSynthesizer.playClick("switch"); onToggleMute(); }}
            className={`p-1.5 rounded border transition-all ${!isMuted ? "bg-[#1e3321] border-[#22c55e]/60 text-[#4ade80]" : "bg-[#311c1c] border-[#ef4444]/60 text-[#f87171]"}`}
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

    </header>
  );
};
