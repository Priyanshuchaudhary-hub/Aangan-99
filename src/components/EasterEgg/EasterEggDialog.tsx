import React from 'react';
import { X, Sparkles, Key, Terminal, Award } from 'lucide-react';
import { useSound } from '../../hooks/useSound.ts';

interface EasterEggDialogProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedTitle?: string;
  unlockedDescription?: string;
}

export const EasterEggDialog: React.FC<EasterEggDialogProps> = ({
  isOpen,
  onClose,
  unlockedTitle = 'Secret 90s Cheatsheet Unlocked!',
  unlockedDescription = 'You discovered the sacred Konami Code of Doordarshan era: UP UP DOWN DOWN LEFT RIGHT LEFT RIGHT B A on the keyboard!'
}) => {
  const { playClick, playChirp } = useSound();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="easter-egg-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
      onClick={() => {
        playClick('soft');
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#1f1917] border-2 border-[#f59e0b] rounded-2xl p-6 shadow-2xl text-[#f5eedc] relative overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-[#fbbf24]">
            <Award className="w-6 h-6 animate-bounce" aria-hidden="true" />
            <h2 id="easter-egg-title" className="text-xl font-bold font-pixel tracking-wide text-[#fbbf24]">
              {unlockedTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              playClick('switch');
              onClose();
            }}
            aria-label="Close easter egg dialog"
            className="p-1 rounded-lg text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#fbbf24]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm text-[#d1c7b7] leading-relaxed mb-5 font-serif">
          {unlockedDescription}
        </p>

        <div className="bg-[#120e0d] p-3.5 rounded-xl border border-[#3e322d] font-mono text-xs text-[#10b981] space-y-1 mb-5">
          <div className="flex items-center gap-1.5 text-[#fbbf24]">
            <Terminal className="w-3.5 h-3.5" />
            <span>COMMODORE_AANGAN_DOS_LOG:</span>
          </div>
          <p className="pl-5 text-gray-300">• Shaktimaan Spin Boost: <span className="text-[#34d399]">ENABLED</span></p>
          <p className="pl-5 text-gray-300">• Rasna Mango Concentrate: <span className="text-[#34d399]">100% MAXIMUM</span></p>
          <p className="pl-5 text-gray-300">• Power Cut Inverter: <span className="text-[#34d399]">BYPASSED</span></p>
        </div>

        <button
          type="button"
          onClick={() => {
            playChirp();
            onClose();
          }}
          className="w-full py-2.5 px-4 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-sm tracking-wide shadow-md transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-white"
        >
          Collect 90s Nostalgia Badge
        </button>
      </div>
    </div>
  );
};
