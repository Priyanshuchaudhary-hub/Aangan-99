import React from 'react';
import { motion } from 'motion/react';
import { Monitor, Layers, Compass, MapPin, Sparkles, Disc, Radio, Ticket, BookOpen, Music, Folder } from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

export type MainNavMode =
  | 'all'
  | 'desktop'
  | 'memories'
  | 'map'
  | 'world'
  | 'ephemera'
  | 'cassette'
  | 'tv'
  | 'monsoon'
  | 'telegram'
  | 'all-memories';

interface SummerVacationLauncherProps {
  currentMode: MainNavMode;
  onModeSelect: (mode: MainNavMode) => void;
  memoryCount?: number;
  ephemeraCount?: number;
  selectedYear?: number;
  onOpenTicket?: () => void;
}

export const SummerVacationLauncher: React.FC<SummerVacationLauncherProps> = ({
  currentMode,
  onModeSelect,
  memoryCount = 18,
  ephemeraCount = 7,
  selectedYear = 2004,
  onOpenTicket
}) => {
  const handleSelect = (mode: MainNavMode) => {
    audioSynthesizer.playClick('switch');
    onModeSelect(mode);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Retro Windows / DOS Box Styled Executable Launcher */}
      <div className="relative rounded-2xl bg-[#008080] border-4 border-[#dfdfdf] shadow-[0_12px_35px_rgba(0,0,0,0.7)] overflow-hidden font-mono select-none">
        {/* OS Window Titlebar */}
        <div className="bg-gradient-to-r from-[#000080] via-[#1084d0] to-[#000080] px-4 py-2 text-white font-bold text-xs flex items-center justify-between border-b-2 border-[#808080]">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-[#ffff00] animate-pulse" />
            <span className="font-pixel text-[13px] tracking-wider text-[#ffff00]">
              SUMMER VACATION.EXE (1999)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-gray-300 font-pixel hidden sm:inline">MS-DOS 6.22 / WIN98</span>
            <div className="flex gap-1 ml-2">
              <span className="w-4 h-4 bg-[#c0c0c0] text-black font-bold flex items-center justify-center border border-t-white border-l-white border-r-black border-b-black text-[10px]">
                _
              </span>
              <span className="w-4 h-4 bg-[#c0c0c0] text-black font-bold flex items-center justify-center border border-t-white border-l-white border-r-black border-b-black text-[10px]">
                □
              </span>
              <span className="w-4 h-4 bg-[#c0c0c0] text-black font-bold flex items-center justify-center border border-t-white border-l-white border-r-black border-b-black text-[10px]">
                ✕
              </span>
            </div>
          </div>
        </div>

        {/* Interior Desktop Canvas */}
        <div className="p-4 sm:p-6 bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] space-y-4">
          <div className="text-center space-y-1">
            <div className="text-xs font-pixel uppercase tracking-widest text-[#000080]">
              ┌─────────────────────────────┐
            </div>
            <div className="text-base sm:text-xl font-bold font-pixel tracking-wider text-[#000080] flex items-center justify-center gap-2">
              <span>│</span>
              <span className="text-[#800000]">SUMMER VACATION.EXE</span>
              <span>│</span>
            </div>
            <div className="text-xs font-pixel uppercase tracking-widest text-[#000080]">
              └─────────────────────────────┘
            </div>
            <p className="text-xs font-mono text-[#333] pt-1">
              Select an interface mode to explore the 90s Indian Childhood Universe:
            </p>
          </div>

          {/* Boarding Pass Status Ribbon */}
          <div
            onClick={() => {
              if (onOpenTicket) {
                audioSynthesizer.playSuccessChime();
                onOpenTicket();
              }
            }}
            className="p-3 bg-[#fdf8ee] rounded-lg border-2 border-[#8c6d53] text-[#1c140e] text-xs font-mono shadow-sm cursor-pointer hover:bg-[#fffdf8] transition-colors group relative overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#dac8ad] pb-1.5 mb-2">
              <div className="flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#800000]" />
                <span className="font-bold text-[#800000] font-pixel text-[11px]">BOARDING PASS RECORD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-gray-500 font-bold">STATUS:</span>
                <span className="px-2 py-0.5 rounded bg-emerald-800 text-white font-bold text-[10px]">
                  YOU WERE THERE.
                </span>
                <span className="text-[10px] text-amber-700 underline font-bold group-hover:text-amber-900 hidden sm:inline">
                  [View Full Pass]
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div>
                <span className="text-gray-500 text-[10px] block">PASSENGER:</span>
                <strong className="text-gray-900 font-serif">Someone who remembers this.</strong>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">DEPARTURE:</span>
                <strong className="text-red-900 font-mono">{selectedYear || 2004}</strong>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">DESTINATION:</span>
                <strong className="text-emerald-800 font-serif">Childhood</strong>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">SEAT:</span>
                <strong className="text-gray-900 font-serif">Window</strong>
              </div>
            </div>
          </div>

          {/* Core [DESKTOP] [MEMORIES] [MAP] Action Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {/* 1. [DESKTOP] */}
            <button
              onClick={() => handleSelect('desktop')}
              className={`p-3.5 rounded transition-all text-left flex flex-col justify-between border-2 active:translate-x-0.5 active:translate-y-0.5 ${
                currentMode === 'desktop'
                  ? 'bg-[#000080] text-white border-t-black border-l-black border-r-white border-b-white shadow-inner ring-2 ring-[#ffff00]'
                  : 'bg-[#d4d0c8] text-[#111] border-t-white border-l-white border-r-black border-b-black hover:bg-[#e0dcd4]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-pixel font-bold tracking-wider">
                  [DESKTOP]
                </span>
                <span className="text-xl">🗄️</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold font-mono">Physical Relics & Ephemera</p>
                <p className={`text-[11px] font-mono leading-tight ${currentMode === 'desktop' ? 'text-gray-200' : 'text-gray-600'}`}>
                  Tickets, cassette deck, CRT TV, slam book & paper boat puddle
                </p>
              </div>
            </button>

            {/* 2. [MEMORIES] */}
            <button
              onClick={() => handleSelect('memories')}
              className={`p-3.5 rounded transition-all text-left flex flex-col justify-between border-2 active:translate-x-0.5 active:translate-y-0.5 ${
                currentMode === 'memories'
                  ? 'bg-[#800000] text-white border-t-black border-l-black border-r-white border-b-white shadow-inner ring-2 ring-[#ffff00]'
                  : 'bg-[#d4d0c8] text-[#111] border-t-white border-l-white border-r-black border-b-black hover:bg-[#e0dcd4]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-pixel font-bold tracking-wider">
                  [MEMORIES]
                </span>
                <span className="text-xl">📖</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold font-mono">Memory Explorer Archive</p>
                <p className={`text-[11px] font-mono leading-tight ${currentMode === 'memories' ? 'text-gray-200' : 'text-gray-600'}`}>
                  {memoryCount} interactive diary & photo viewers with secret easter eggs
                </p>
              </div>
            </button>

            {/* 3. [MAP] */}
            <button
              onClick={() => handleSelect('map')}
              className={`p-3.5 rounded transition-all text-left flex flex-col justify-between border-2 active:translate-x-0.5 active:translate-y-0.5 ${
                currentMode === 'map'
                  ? 'bg-[#008000] text-white border-t-black border-l-black border-r-white border-b-white shadow-inner ring-2 ring-[#ffff00]'
                  : 'bg-[#d4d0c8] text-[#111] border-t-white border-l-white border-r-black border-b-black hover:bg-[#e0dcd4]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-pixel font-bold tracking-wider">
                  [MAP]
                </span>
                <span className="text-xl">🗺️</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold font-mono">Interactive Summer World</p>
                <p className={`text-[11px] font-mono leading-tight ${currentMode === 'map' ? 'text-gray-200' : 'text-gray-600'}`}>
                  Railway station to Nani's haveli, terrace rain & gully cricket
                </p>
              </div>
            </button>
          </div>

          {/* Quick Option to Show All Modules simultaneously */}
          <div className="pt-2 flex items-center justify-between border-t border-[#808080] text-[11px] font-mono">
            <div className="text-gray-700 flex items-center gap-1.5">
              <span>Current Workspace:</span>
              <span className="font-bold text-[#000080] uppercase">
                {currentMode === 'all' && '★ Complete Aangan Archive'}
                {currentMode === 'desktop' && '🗄️ Desktop Workspace (Physical Relics)'}
                {currentMode === 'memories' && '📖 Memory Explorer Archive'}
                {currentMode === 'map' && '🗺️ Summer Vacation World Map'}
              </span>
            </div>

            {currentMode !== 'all' && (
              <button
                onClick={() => handleSelect('all')}
                className="px-2.5 py-1 bg-[#e0dcd4] hover:bg-[#f0ece4] border border-t-white border-l-white border-r-black border-b-black text-[11px] font-bold text-gray-800"
              >
                [Show Full Archive]
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
