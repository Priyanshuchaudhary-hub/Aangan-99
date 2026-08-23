import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, X, RefreshCw, Pin, Stamp, Ticket, Film, Calendar, Flame } from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

interface EphemeraItem {
  id: string;
  type: 'railway-ticket' | 'bus-ticket' | 'calendar' | 'matchbox' | 'film-strip' | 'candy-wrapper';
  title: string;
  hindiTitle: string;
  year: string;
  rotation: string;
  defaultPosition: { top?: string; left?: string; right?: string; bottom?: string };
  description: string;
}

const EPHEMERA_ITEMS: EphemeraItem[] = [
  {
    id: 'rail-1',
    type: 'railway-ticket',
    title: 'Dot-Matrix Rail Reservation Slip',
    hindiTitle: 'भारतीय रेल आरक्षण पर्ची',
    year: '1998',
    rotation: '-rotate-2',
    defaultPosition: { top: '10px', left: '10px' },
    description: 'The green tractor-feed computerized Indian Railways reservation slip with tear-off holes and dot-matrix ink. Printed at New Delhi PRS counter with the iconic "शुभ यात्रा / HAPPY JOURNEY" stamp.'
  },
  {
    id: 'bus-1',
    type: 'bus-ticket',
    title: 'Punched State Roadways Bus Ticket',
    hindiTitle: 'डीटीसी / राज्य परिवहन बस टिकट',
    year: '1999',
    rotation: 'rotate-3',
    defaultPosition: { top: '30px', right: '15px' },
    description: 'A ₹3.50 red paper bus ticket with round holes punched by the conductor’s heavy metal puncher, tallying stops from ISBT to Connaught Place.'
  },
  {
    id: 'cal-1',
    type: 'calendar',
    title: '1999 Kalnirnay Calendar Leaf',
    hindiTitle: 'कालनिर्णय / पंचांग पृष्ठ',
    year: '1999',
    rotation: '-rotate-1',
    defaultPosition: { bottom: '20px', left: '20px' },
    description: 'Scanned vintage Indian monthly calendar featuring auspicious Rahukaal hours, Ekadashi dates, and mom’s pencil note: "Dhobi 16 clothes, Milkman paid ₹280".'
  },
  {
    id: 'match-1',
    type: 'matchbox',
    title: 'Cheetah Safety Matches Box',
    hindiTitle: 'चीता माचिस — 50 पैसे',
    year: '1996',
    rotation: 'rotate-6',
    defaultPosition: { bottom: '40px', right: '30px' },
    description: 'Cheetah Brand wooden matchbox manufactured in Sivakasi with retro litho graphics and a gritty phosphorus strike strip.'
  },
  {
    id: 'film-1',
    type: 'film-strip',
    title: 'Kodak Gold 100 35mm Negatives',
    hindiTitle: 'कोडैक गोल्ड ३५मिमी फिल्म स्ट्रिप',
    year: '1997',
    rotation: 'rotate-1',
    defaultPosition: { top: '60px', left: '45%' },
    description: '35mm negative film strip from summer vacations in Shimla with frame numbers and orange emulsion tone.'
  }
];

export interface PhysicalEphemeraProps {
  selectedYear?: number;
  onOpenTicket?: (mem: any) => void;
}

export const PhysicalEphemera: React.FC<PhysicalEphemeraProps> = ({
  selectedYear = 1999,
  onOpenTicket
}) => {
  const [selectedItem, setSelectedItem] = useState<EphemeraItem | null>(null);
  const [pinnedItems, setPinnedItems] = useState<string[]>(['rail-1', 'bus-1']);
  const [filterMode, setFilterMode] = useState<'all' | 'tickets' | 'prints'>('all');

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioSynthesizer.playClick('switch');
    setPinnedItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleInspect = (item: EphemeraItem) => {
    audioSynthesizer.playClick('soft');
    setSelectedItem(item);
  };

  return (
    <section id="ephemera-desk" className="relative w-full my-8">
      {/* Asymmetrical Paper Header with scotch tape */}
      <div className="relative mx-auto max-w-5xl px-4 mb-4">
        <div className="relative inline-block bg-[#f4ece0] text-[#1c1511] px-6 py-3 rounded shadow-md border border-[#d4c6b2] -rotate-1">
          {/* Tape strip top left */}
          <div className="scotch-tape -top-3 left-4 w-20 rotate-[-6deg]" />
          {/* Tape strip top right */}
          <div className="scotch-tape -top-3 right-4 w-20 rotate-[5deg]" />

          <div className="flex items-center gap-3">
            <span className="text-2xl">🎟️</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold font-serif-vintage tracking-tight">
                  दस्तावेज़ और टिकट <span className="text-sm font-typewriter text-[#8a3814] font-normal">— Ephemera Desk ’99</span>
                </h2>
                <span className="rubber-stamp text-[10px] py-0.5 px-2 border-[#8c2d2d] text-[#8c2d2d]">
                  ARCHIVE CO.
                </span>
              </div>
              <p className="text-xs text-[#5a483a] font-handwriting">
                Real tactile Indian paper remnants: dot-matrix train slips, punched bus tickets, matchboxes & calendars
              </p>
            </div>
          </div>
        </div>

        {/* Filter buttons */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-typewriter">
          <span className="text-[#9e8b78] text-[11px] uppercase tracking-wider font-pixel">Artifacts:</span>
          {(['all', 'tickets', 'prints'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => {
                audioSynthesizer.playClick('soft');
                setFilterMode(mode);
              }}
              className={`px-3 py-1 rounded border transition-all text-xs ${
                filterMode === mode
                  ? 'bg-[#c2842e] text-[#120f0e] border-[#b45309] font-bold shadow'
                  : 'bg-[#221a16] text-[#b8a692] border-[#3d2e24] hover:bg-[#33261e]'
              }`}
            >
              {mode === 'all' && 'All Ephemera (सभी वस्तुएँ)'}
              {mode === 'tickets' && 'Tickets & Slips (टिकट)'}
              {mode === 'prints' && 'Prints & Matchboxes (प्रिंट्स)'}
            </button>
          ))}
        </div>
      </div>

      {/* Desk Board Grid with controlled imperfection */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative min-h-[380px] p-6 md:p-8 rounded-xl bg-[#1d1613] border-2 border-[#423226] shadow-[inset_0_4px_24px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Chai stain watermark */}
          <div className="chai-stain w-32 h-32 top-8 right-12 opacity-60" />
          <div className="chai-stain w-24 h-24 bottom-10 left-16 opacity-40" />

          {/* Background wood texture pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#2d211a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-50" />

          {/* Ephemera Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {/* 1. Indian Railways Computerized Ticket */}
            {(filterMode === 'all' || filterMode === 'tickets') && (
              <motion.div
                drag
                dragConstraints={{ left: -30, right: 30, top: -25, bottom: 25 }}
                dragElastic={0.15}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
                whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
                whileDrag={{ scale: 1.06, zIndex: 40, cursor: 'grabbing' }}
                onMouseEnter={() => audioSynthesizer.playPaperRustle()}
                onClick={() => handleInspect(EPHEMERA_ITEMS[0])}
                className="relative cursor-grab active:cursor-grabbing bg-[#f1f5e8] text-[#1a2e1c] p-4 rounded shadow-lg border border-[#c3d4b6] -rotate-1 transition-shadow"
                style={{
                  boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 0 20px rgba(160, 190, 140, 0.2)'
                }}
              >
                {/* Tape */}
                <div className="scotch-tape -top-2 left-6 w-16 rotate-[-4deg]" />

                {/* Perforated tractor holes on left edge */}
                <div className="absolute left-1 top-0 bottom-0 w-3 railway-tractor-holes opacity-70" />

                <div className="pl-3 select-none">
                  <div className="flex items-center justify-between border-b border-[#a4be98] pb-1.5 mb-2 text-[10px] font-dotmatrix">
                    <span className="font-bold text-[#14421b]">भारतीय रेल / INDIAN RAILWAYS</span>
                    <span className="text-[#8c2d2d] font-bold">PNR: 241-8921890</span>
                  </div>

                  <div className="font-dotmatrix text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[11px] font-bold">12004 SHATABDI EXP</span>
                      <span className="text-[#2b5934] font-bold">CNF S4-23 (MB)</span>
                    </div>
                    <div className="text-[10px] text-[#3e5e44] flex justify-between">
                      <span>NDLS ➔ LKO</span>
                      <span>DATE: 14-OCT-1998</span>
                    </div>
                    <div className="text-[10px] flex justify-between pt-1 border-t border-dashed border-[#a4be98]">
                      <span>ADULT: 01 (M/28)</span>
                      <span className="font-bold text-[#164e23]">FARE: ₹ 340.00</span>
                    </div>
                  </div>

                  {/* Stamp with click sound */}
                  <div className="mt-3 flex items-center justify-between">
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        audioSynthesizer.playClick('switch');
                      }}
                      className="rubber-stamp text-[9px] py-0.5 px-1.5 border-[#15803d] text-[#15803d] -rotate-3 hover:scale-105 transition-transform"
                    >
                      शुभ यात्रा / CNF
                    </span>
                    <span className="text-[9px] font-typewriter text-[#6b856b]">PRS COUNTER 04</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. Punched DTC / State Roadways Red Bus Ticket */}
            {(filterMode === 'all' || filterMode === 'tickets') && (
              <motion.div
                drag
                dragConstraints={{ left: -30, right: 30, top: -25, bottom: 25 }}
                dragElastic={0.15}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
                whileHover={{ scale: 1.04, rotate: 1, y: -4 }}
                whileDrag={{ scale: 1.07, zIndex: 40, cursor: 'grabbing' }}
                onMouseEnter={() => audioSynthesizer.playPaperRustle()}
                onClick={() => handleInspect(EPHEMERA_ITEMS[1])}
                className="relative cursor-grab active:cursor-grabbing bg-[#fcf2eb] text-[#421d1d] p-3 rounded shadow-lg border border-[#e5baba] rotate-2 transition-shadow select-none"
                style={{
                  backgroundImage: 'radial-gradient(#eed0d0 1px, transparent 1px)',
                  backgroundSize: '8px 8px'
                }}
              >
                {/* Tape */}
                <div className="scotch-tape -top-2 right-6 w-14 rotate-[6deg]" />

                <div className="flex items-center justify-between border-b border-[#e5a0a0] pb-1 text-[11px] font-typewriter">
                  <span className="font-bold text-[#8c2d2d]">दिल्ली परिवहन निगम (DTC)</span>
                  <span className="text-[10px] text-[#a85050]">ORD. FARE</span>
                </div>

                <div className="my-2 p-2 bg-[#fae2db] rounded border border-dashed border-[#e09191] text-center">
                  <div className="text-xl font-bold font-poster-title text-[#8c2d2d] tracking-wider">
                    ₹ 3.50
                  </div>
                  <div className="text-[9px] font-typewriter text-[#703030]">
                    STAGE 04 • ROUTE 502 (MEHRAULI)
                  </div>
                </div>

                {/* Real Punch Holes Graphics with clickable clicker */}
                <div className="flex justify-around items-center py-1">
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      audioSynthesizer.playClick('heavy');
                    }}
                    className="w-4 h-4 rounded-full bg-[#1d1613] shadow-inner border border-[#d68585] flex items-center justify-center text-[8px] text-[#4ade80] hover:scale-125 transition-transform"
                    title="Conductor Hole Punch"
                  >
                    ✓
                  </div>
                  <span className="text-[10px] font-dotmatrix text-[#a85050]">SR NO. 884912</span>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      audioSynthesizer.playClick('heavy');
                    }}
                    className="w-4 h-4 rounded-full bg-[#1d1613] shadow-inner border border-[#d68585] hover:scale-125 transition-transform"
                    title="Conductor Hole Punch"
                  />
                </div>

                <div className="text-[9px] font-handwriting text-[#612828] text-right mt-1">
                  ~ कंडक्टर पेंसिल मार्क
                </div>
              </motion.div>
            )}

            {/* 3. 1999 Kalnirnay Calendar Leaf */}
            {(filterMode === 'all' || filterMode === 'prints') && (
              <motion.div
                drag
                dragConstraints={{ left: -30, right: 30, top: -25, bottom: 25 }}
                dragElastic={0.15}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
                whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
                whileDrag={{ scale: 1.06, zIndex: 40, cursor: 'grabbing' }}
                onMouseEnter={() => audioSynthesizer.playPaperRustle()}
                onClick={() => handleInspect(EPHEMERA_ITEMS[2])}
                className="relative cursor-grab active:cursor-grabbing bg-[#fffbf2] text-[#241a15] p-3.5 rounded shadow-lg border border-[#ded0bc] -rotate-2 transition-shadow select-none"
              >
                {/* Tape top */}
                <div className="scotch-tape -top-2 left-1/3 w-16 rotate-[-1deg]" />

                <div className="flex items-center justify-between border-b border-[#c8b69f] pb-1 text-xs">
                  <span className="font-bold text-[#8c2d2d] font-serif-vintage">कालनिर्णय पंचांग ’९९</span>
                  <span className="text-[10px] font-typewriter text-[#7a6452]">कार्तिक मास</span>
                </div>

                <div className="grid grid-cols-3 gap-2 my-2.5 text-center">
                  <div className="bg-[#f5ecdd] p-1 rounded border border-[#e0d3bf]">
                    <span className="text-[9px] block text-[#8a5026]">तिथि</span>
                    <span className="text-xs font-bold text-[#2e1d13]">एकादशी</span>
                  </div>
                  <div className="bg-[#f5ecdd] p-1 rounded border border-[#e0d3bf]">
                    <span className="text-[9px] block text-[#8a5026]">राहुकाल</span>
                    <span className="text-xs font-bold text-[#8c2d2d]">1:30 - 3:00</span>
                  </div>
                  <div className="bg-[#f5ecdd] p-1 rounded border border-[#e0d3bf]">
                    <span className="text-[9px] block text-[#8a5026]">सूर्योदय</span>
                    <span className="text-xs font-bold text-[#2e1d13]">06:14 AM</span>
                  </div>
                </div>

                <div className="bg-[#fff6e0] p-1.5 rounded border border-dashed border-[#d8be96] font-handwriting text-xs text-[#2b4c7e]">
                  📝 <span className="underline decoration-[#93c5fd]">धोबी को दिए १६ कपड़े, दूधवाले के ₹२८० बाकी।</span>
                </div>
              </motion.div>
            )}

            {/* 4. Cheetah Safety Matches Box */}
            {(filterMode === 'all' || filterMode === 'prints') && (
              <motion.div
                drag
                dragConstraints={{ left: -30, right: 30, top: -25, bottom: 25 }}
                dragElastic={0.15}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
                whileHover={{ scale: 1.04, rotate: 4, y: -4 }}
                whileDrag={{ scale: 1.08, zIndex: 40, cursor: 'grabbing' }}
                onMouseEnter={() => audioSynthesizer.playClick('soft')}
                onClick={() => handleInspect(EPHEMERA_ITEMS[3])}
                className="relative cursor-grab active:cursor-grabbing bg-[#e05328] text-white p-3 rounded shadow-lg border-2 border-[#b83812] rotate-3 transition-shadow select-none"
                style={{
                  boxShadow: '0 6px 14px rgba(0,0,0,0.5), inset 0 0 15px rgba(0,0,0,0.3)'
                }}
              >
                {/* Phosphorus Strike Strip on top - interactive strike sound */}
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    audioSynthesizer.playStickerPeel();
                  }}
                  className="w-full h-3 bg-[#4a1d12] rounded-sm mb-2 border border-[#331109] opacity-90 hover:brightness-125 transition-all" 
                  title="Click to strike matchstick"
                  style={{ backgroundImage: 'radial-gradient(#6e2c1d 1px, transparent 1px)', backgroundSize: '3px 3px' }} 
                />

                <div className="flex items-center justify-between">
                  <div className="text-2xl">🐆</div>
                  <div className="text-right">
                    <div className="text-sm font-black font-poster-title tracking-wider text-[#ffeeaa]">
                      CHEETAH MATCHES
                    </div>
                    <div className="text-[9px] font-typewriter text-[#ffd5c4]">
                      SIVAKASI • 50 PAISE ONLY
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-1 border-t border-[#f78260] flex items-center justify-between text-[8px] font-pixel uppercase tracking-widest text-[#ffeeaa]">
                  <span>40 SAFETY STICKS</span>
                  <span>DAMP PROOF</span>
                </div>
              </motion.div>
            )}

            {/* 5. Kodak Gold 100 35mm Negatives */}
            {(filterMode === 'all' || filterMode === 'prints') && (
              <motion.div
                drag
                dragConstraints={{ left: -30, right: 30, top: -25, bottom: 25 }}
                dragElastic={0.15}
                dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
                whileHover={{ scale: 1.03, rotate: 0, y: -4 }}
                whileDrag={{ scale: 1.07, zIndex: 40, cursor: 'grabbing' }}
                onMouseEnter={() => audioSynthesizer.playStickerPeel()}
                onClick={() => handleInspect(EPHEMERA_ITEMS[4])}
                className="relative cursor-grab active:cursor-grabbing bg-[#241710] text-[#fbbf24] p-3 rounded shadow-lg border border-[#6b452d] -rotate-1 transition-shadow select-none"
              >
                {/* Top Sprocket holes */}
                <div className="flex justify-between items-center px-1 mb-1.5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2.5 h-3 bg-[#0a0705] rounded-sm border border-[#4a2e1d]" />
                  ))}
                </div>

                {/* Film Frame Content */}
                <div className="bg-[#522915] p-2 rounded border border-[#8a4a25] flex items-center gap-3">
                  <div className="w-12 h-10 bg-[#30160a] rounded flex items-center justify-center text-xs text-[#f59e0b] font-pixel border border-[#a35e32]">
                    [ 14A ]
                  </div>
                  <div>
                    <div className="text-[11px] font-mono font-bold text-[#fef3c7]">
                      KODAK GOLD 100
                    </div>
                    <div className="text-[9px] font-handwriting text-[#fdba74]">
                      Summer Vacation Shimla ’97
                    </div>
                  </div>
                </div>

                {/* Bottom Sprocket holes */}
                <div className="flex justify-between items-center px-1 mt-1.5">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-2.5 h-3 bg-[#0a0705] rounded-sm border border-[#4a2e1d]" />
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Detail Inspection Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-lg w-full bg-[#f8f3e8] text-[#1c1511] p-6 rounded-xl shadow-2xl border-2 border-[#cbb99f]"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  audioSynthesizer.playClick('switch');
                  setSelectedItem(null);
                }}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-[#e3d3bd] text-[#4a3525] hover:bg-[#cbb99f] transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Tape Decor */}
              <div className="scotch-tape -top-3 left-10 w-24 rotate-[-3deg]" />

              <div className="flex items-center gap-2 mb-3">
                <Stamp className="w-5 h-5 text-[#8c2d2d]" />
                <h3 className="text-xl font-bold font-serif-vintage text-[#221711]">
                  {selectedItem.title}
                </h3>
              </div>

              <div className="text-xs font-handwriting text-[#8c2d2d] mb-4 text-base">
                {selectedItem.hindiTitle} • Era {selectedItem.year}
              </div>

              <div className="p-4 bg-[#ede2cf] rounded-lg border border-[#d6c4a8] text-sm text-[#4a3728] leading-relaxed font-typewriter">
                {selectedItem.description}
              </div>

              <div className="mt-5 flex items-center justify-between text-xs text-[#7d6652] font-typewriter">
                <span>Handcrafted Tactile Memory Remnant</span>
                <button
                  onClick={() => {
                    audioSynthesizer.playClick('soft');
                    setSelectedItem(null);
                  }}
                  className="px-4 py-1.5 bg-[#8c2d2d] text-white rounded font-bold hover:bg-[#702222] transition-colors"
                >
                  Close Artifact (बंद करें)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
