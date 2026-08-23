/* =========================================================================
   AANGAN '99 / SUMMER VACATION.EXE — MUSIC SOURCE SETUP MODAL
   Allows choosing music provider (YouTube, Spotify, Licensed, Retro Synth).
   ========================================================================= */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, X, Youtube, Music, Disc, Sparkles, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { useMusic } from '../context/MusicContext.tsx';
import { ProviderType } from '../music/types.ts';
import { MUSIC_PROVIDERS_CONFIG } from '../music/config.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

interface MusicSourceSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MusicSourceSetupModal: React.FC<MusicSourceSetupModalProps> = ({ isOpen, onClose }) => {
  const { providerType, switchProvider, startRadioUserGesture, isAutoplayAllowed } = useMusic();

  if (!isOpen) return null;

  const handleSelectProvider = async (type: ProviderType) => {
    audioSynthesizer.playClick('switch');
    await switchProvider(type);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-2xl bg-[#1a120c] border-2 border-[#614735] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.9)] text-[#e8ded1] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Window Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#261911] border-b border-[#4d3626]">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#f59e0b]" />
            <span className="font-pixel text-sm text-[#fcd34d] uppercase tracking-wider">
              NOSTALGIA RADIO — MUSIC SOURCE SETUP
            </span>
          </div>

          <button
            onClick={() => {
              audioSynthesizer.playClick('switch');
              onClose();
            }}
            className="p-1 rounded hover:bg-[#3d291e] text-[#b8a28e] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 space-y-5 overflow-y-auto flex-1">
          <div className="space-y-1">
            <h3 className="text-lg font-bold font-serif text-[#fff7ed]">Choose Where Your Music Comes From</h3>
            <p className="text-xs text-[#b09b88] font-serif leading-relaxed">
              SUMMER VACATION.EXE features real provider integration. Select your preferred playback engine below:
            </p>
          </div>

          {/* Autoplay Banner if user gesture needed */}
          {!isAutoplayAllowed && (
            <div className="bg-[#854d0e]/30 border border-[#f59e0b] p-3 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-[#fcd34d] flex items-center gap-1 font-pixel uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>AUTOPLAY REQUIREMENT</span>
                </span>
                <p className="text-[#e2d5c5]">Click to start audio playback and enable background nostalgia tunes.</p>
              </div>

              <button
                onClick={() => startRadioUserGesture()}
                className="px-3 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#1c120c] font-bold text-xs rounded shadow transition-all active:scale-95 whitespace-nowrap"
              >
                START THE RADIO
              </button>
            </div>
          )}

          {/* Provider Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {(['youtube', 'spotify', 'licensed', 'local-synth'] as const).map((pType) => {
              const cfg = MUSIC_PROVIDERS_CONFIG[pType];
              const isSelected = providerType === pType;

              return (
                <div
                  key={pType}
                  onClick={() => handleSelectProvider(pType)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-[#332014] border-[#f59e0b] shadow-lg'
                      : 'bg-[#120b08] hover:bg-[#21150d] border-[#382619]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {pType === 'youtube' && <Youtube className="w-5 h-5 text-red-500" />}
                        {pType === 'spotify' && <Music className="w-5 h-5 text-emerald-500" />}
                        {pType === 'licensed' && <Disc className="w-5 h-5 text-amber-400" />}
                        {pType === 'local-synth' && <Radio className="w-5 h-5 text-amber-500" />}
                        <span className="font-bold text-sm text-[#f5e9da]">{cfg.shortLabel}</span>
                      </div>

                      {isSelected && (
                        <span className="p-1 rounded-full bg-[#f59e0b] text-[#1a110a]">
                          <Check className="w-3.5 h-3.5 font-bold" />
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#a8937d] font-serif leading-relaxed">{cfg.description}</p>
                  </div>

                  <div className="pt-3 border-t border-[#291b12] mt-3 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#fcd34d]">{cfg.badgeText}</span>
                    <span className={isSelected ? 'text-amber-400 font-bold' : 'text-[#7e6b5a]'}>
                      {isSelected ? 'ACTIVE' : 'SELECT'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#120b08] border border-[#332216] rounded-xl text-xs text-[#a38d78] space-y-1">
            <div className="flex items-center gap-1.5 text-[#fcd34d] font-pixel text-[10px] uppercase">
              <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
              <span>COMPLIANCE & INTEGRITY ASSURANCE</span>
            </div>
            <p className="leading-relaxed">
              All audio playback utilizes official provider APIs (YouTube IFrame API, Spotify Embed, HTML5 native streaming, or Web Audio API synthesis). Non-embeddable tracks automatically show official provider links without simulating fake playing states.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#21160e] border-t border-[#3d2a1d] flex items-center justify-between text-xs font-mono text-[#a8937d]">
          <span>Shift+D for Debug Panel</span>
          <button
            onClick={() => {
              audioSynthesizer.playClick('switch');
              onClose();
            }}
            className="px-4 py-1.5 bg-[#854d0e] hover:bg-[#a16207] border border-[#fef08a] text-[#fef08a] font-bold rounded transition-all active:scale-95"
          >
            Apply & Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
