import React from 'react';
import { Tv, Video, Newspaper, Monitor, Sparkles } from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

export type VisualMode = 'crt' | 'vhs' | 'newspaper' | 'amber' | 'raw';

interface VintageVisualKnobsProps {
  currentMode: VisualMode;
  onModeChange: (mode: VisualMode) => void;
}

export const VintageVisualKnobs: React.FC<VintageVisualKnobsProps> = ({
  currentMode,
  onModeChange,
}) => {
  const modes = [
    {
      id: 'crt' as VisualMode,
      label: 'DD1 CRT TV',
      hindi: 'सी.आर.टी. टीवी',
      icon: Tv,
      badge: 'Scanlines'
    },
    {
      id: 'vhs' as VisualMode,
      label: 'VHS Tape ’96',
      hindi: 'वी.एच.एस. कैसेट',
      icon: Video,
      badge: 'Tracking'
    },
    {
      id: 'newspaper' as VisualMode,
      label: 'Halftone Print',
      hindi: 'अखबार प्रिंट',
      icon: Newspaper,
      badge: 'Ink Bleed'
    },
    {
      id: 'amber' as VisualMode,
      label: 'Cyber Cafe DOS',
      hindi: 'एम्बर मॉनिटर',
      icon: Monitor,
      badge: 'Phosphor'
    },
    {
      id: 'raw' as VisualMode,
      label: 'Natural Warm',
      hindi: 'प्राकृतिक',
      icon: Sparkles,
      badge: 'Clean'
    }
  ];

  return (
    <div className="w-full bg-[#181210] border-y border-[#3a2c22] py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#c2ad96]">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
          <span className="font-pixel uppercase tracking-wider text-[11px] text-[#e0cfba]">
            Visual Lens Filter (दृश्य प्रभाव):
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 font-typewriter">
          {modes.map(({ id, label, hindi, icon: Icon, badge }) => {
            const isSelected = currentMode === id;
            return (
              <button
                key={id}
                onClick={() => {
                  audioSynthesizer.playClick('switch');
                  onModeChange(id);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition-all text-xs border ${
                  isSelected
                    ? 'bg-[#c2842e] text-[#120f0e] border-[#b45309] font-bold shadow-md scale-105'
                    : 'bg-[#221a16] text-[#b8a692] border-[#382b21] hover:bg-[#2e231c] hover:text-[#f3e8d6]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded font-pixel uppercase ${
                  isSelected ? 'bg-[#120f0e] text-[#f59e0b]' : 'bg-[#120f0e]/50 text-[#8e7a68]'
                }`}>
                  {badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
