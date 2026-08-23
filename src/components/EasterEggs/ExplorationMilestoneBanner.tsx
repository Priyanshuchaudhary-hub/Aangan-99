import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Heart, Star } from 'lucide-react';
import { audioSynthesizer } from '../../utils/audioSynthesizer.ts';
import { useSound } from '../../hooks/useSound.ts';

interface ExplorationMilestoneBannerProps {
  interactionCount: number;
}

export const ExplorationMilestoneBanner: React.FC<ExplorationMilestoneBannerProps> = ({
  interactionCount
}) => {
  const [hasTriggered, setHasTriggered] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);
  const { playClick, playChirp } = useSound();

  useEffect(() => {
    // Trigger when user has interacted with 6 or more items/stations
    if (interactionCount >= 6 && !hasTriggered && !isDismissed) {
      setHasTriggered(true);
      audioSynthesizer.playSuccessChime();
    }
  }, [interactionCount, hasTriggered, isDismissed]);

  if (!hasTriggered || isDismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        className="fixed bottom-6 inset-x-4 max-w-xl mx-auto z-50 select-none"
      >
        <div
          className="p-5 rounded-2xl bg-gradient-to-r from-[#1f1510] via-[#2a1a12] to-[#1f1510] border-2 border-[#e5a93c] shadow-2xl text-center relative overflow-hidden backdrop-blur-md"
          style={{
            boxShadow: '0 20px 40px rgba(0,0,0,0.85), inset 0 0 25px rgba(229, 169, 60, 0.15)'
          }}
        >
          {/* Subtle Golden Glow Orbs */}
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-20 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

          <button
            onClick={() => {
              playClick('soft');
              setIsDismissed(true);
            }}
            className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col items-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#3d2719] border border-[#6b4728] text-[11px] font-pixel text-[#fcd34d]">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
              <span>UNLOCKED MILESTONE • NOSTALGIA ARCHIVE</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-serif-vintage tracking-wide text-[#fef3c7] drop-shadow">
              YOU REMEMBER MORE THAN YOU THINK.
            </h3>

            <p className="text-sm sm:text-base font-serif text-[#d6c4b2] italic">
              "तुम्हें जितना लगता है, उससे कहीं ज़्यादा याद है।"
            </p>

            <p className="text-xs text-[#a89480] max-w-md pt-1 font-serif leading-relaxed">
              Every afternoon power cut, every pencil shaving, and every melody from Doordarshan was never lost — it was only waiting for you to turn the dial.
            </p>

            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  playChirp();
                  setIsDismissed(true);
                }}
                className="px-4 py-1.5 rounded-lg bg-[#b45309] hover:bg-[#92400e] text-white font-pixel text-xs tracking-wider shadow transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5 text-rose-300 fill-current" />
                <span>Cherish This Memory</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
