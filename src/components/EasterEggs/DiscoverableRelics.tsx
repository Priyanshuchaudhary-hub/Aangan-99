import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Check, Heart, Trophy } from 'lucide-react';
import { audioSynthesizer } from '../../utils/audioSynthesizer.ts';
import { useSound } from '../../hooks/useSound.ts';

interface DiscoverableRelicsProps {
  onCollect?: (relicName: string) => void;
}

interface RelicItem {
  id: string;
  name: string;
  hindiName: string;
  emoji: string;
  top: string;
  left: string;
  description: string;
  collectedSound: 'coin' | 'nature' | 'sweet';
}

const RELIC_ITEMS: RelicItem[] = [
  {
    id: 'coin-50p',
    name: 'Shiny 50-Paisa Steel Coin (1998)',
    hindiName: 'पचास पैसे का सिक्का',
    emoji: '🪙',
    top: '28%',
    left: '88%',
    description: 'Dropped behind the study desk cushion. Enough to buy two Kismi bars or one Poppins roll.',
    collectedSound: 'coin'
  },
  {
    id: 'jugnu-firefly',
    name: 'Summer Monsoon Firefly (Jugnu)',
    hindiName: 'चमकता हुआ जुगनू',
    emoji: '✨',
    top: '65%',
    left: '6%',
    description: 'Captured gently inside a perforated glass Horlicks bottle for five magical minutes.',
    collectedSound: 'nature'
  },
  {
    id: 'sweet-mango',
    name: 'Fallen Green Dussehri Mango',
    hindiName: 'टपका हुआ कच्चा आम',
    emoji: '🥭',
    top: '82%',
    left: '92%',
    description: 'Found under the neighborhood tree after afternoon gusty winds. Eaten with salt and red chilli powder.',
    collectedSound: 'sweet'
  }
];

export const DiscoverableRelics: React.FC<DiscoverableRelicsProps> = ({
  onCollect
}) => {
  const [collectedIds, setCollectedIds] = useState<string[]>([]);
  const [activePopup, setActivePopup] = useState<RelicItem | null>(null);
  const { playClick, playChirp } = useSound();

  const handleCollect = (relic: RelicItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (collectedIds.includes(relic.id)) return;

    if (relic.collectedSound === 'coin') {
      audioSynthesizer.playClick('switch');
      audioSynthesizer.playChirp();
    } else if (relic.collectedSound === 'nature') {
      audioSynthesizer.playSynthMelody('junglebook');
    } else {
      audioSynthesizer.playSuccessChime();
    }

    setCollectedIds((prev) => [...prev, relic.id]);
    setActivePopup(relic);
    onCollect?.(relic.name);
  };

  return (
    <>
      {/* Floating Clickable Relics on Page Canvas */}
      {RELIC_ITEMS.map((relic) => {
        const isFound = collectedIds.includes(relic.id);
        if (isFound) return null;

        return (
          <motion.button
            key={relic.id}
            onClick={(e) => handleCollect(relic, e)}
            whileHover={{ scale: 1.35, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0.7, y: 0 }}
            animate={{
              opacity: [0.6, 1, 0.6],
              y: [-4, 4, -4],
              transition: { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
            }}
            style={{ top: relic.top, left: relic.left }}
            className="fixed z-40 p-2.5 rounded-full bg-black/40 hover:bg-amber-500/30 border border-amber-400/40 backdrop-blur-xs shadow-lg cursor-pointer group"
            title={`You noticed something shimmering: ${relic.name}`}
          >
            <span className="text-xl filter drop-shadow-md group-hover:animate-spin block">
              {relic.emoji}
            </span>
            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-black/90 text-amber-300 text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-amber-500/50">
              Collect Relic
            </span>
          </motion.button>
        );
      })}

      {/* Popover Card when item is found */}
      <AnimatePresence>
        {activePopup && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
            onClick={() => {
              playClick('soft');
              setActivePopup(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-[#1e1510] border-2 border-[#e5a93c] rounded-2xl p-5 text-[#fbf4e8] font-mono shadow-2xl relative space-y-4"
            >
              <div className="flex items-center gap-3 border-b border-[#4d3625] pb-3">
                <span className="text-4xl">{activePopup.emoji}</span>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#e5a93c] font-pixel">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                    <span>FOUND IN YOUR POCKET!</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#f5ebd8]">{activePopup.name}</h4>
                  <p className="text-[11px] text-gray-400 font-serif">{activePopup.hindiName}</p>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed font-serif">
                {activePopup.description}
              </p>

              <div className="bg-[#120c08] p-2.5 rounded-lg border border-[#3b2719] flex items-center justify-between text-xs text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <span>Treasures Collected:</span>
                </span>
                <span className="font-pixel font-bold text-sm text-yellow-400">
                  {collectedIds.length} / {RELIC_ITEMS.length}
                </span>
              </div>

              <button
                onClick={() => {
                  playChirp();
                  setActivePopup(null);
                }}
                className="w-full py-2 bg-[#d97706] hover:bg-[#b45309] text-white font-pixel text-xs rounded-lg shadow uppercase transition-transform active:scale-95"
              >
                Pocket This Memory
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
