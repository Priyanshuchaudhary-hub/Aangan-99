import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudRain, Zap, Plus, RefreshCw, Compass } from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

interface Boat {
  id: string;
  name: string;
  paperType: 'dainik' | 'toi' | 'comic' | 'notebook';
  x: number;
  y: number;
  rotation: number;
  driftSpeed: number;
  scale: number;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export const MonsoonPuddle: React.FC = () => {
  const [boats, setBoats] = useState<Boat[]>([
    { id: 'b1', name: 'Dainik Jagran Boat', paperType: 'dainik', x: 25, y: 35, rotation: 5, driftSpeed: 0.2, scale: 1 },
    { id: 'b2', name: 'Comic Strip Boat', paperType: 'comic', x: 60, y: 55, rotation: -8, driftSpeed: 0.15, scale: 0.9 },
  ]);

  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isThunderFlashing, setIsThunderFlashing] = useState<boolean>(false);
  const puddleRef = useRef<HTMLDivElement>(null);

  // Boat drifting animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBoats((prevBoats) =>
        prevBoats.map((b) => {
          let newX = b.x + b.driftSpeed;
          let newY = b.y + Math.sin(Date.now() / 800 + b.x) * 0.15;
          let newRot = b.rotation + Math.sin(Date.now() / 1200) * 0.4;

          if (newX > 85) newX = 10;
          return { ...b, x: newX, y: newY, rotation: newRot };
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handlePuddleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!puddleRef.current) return;
    const rect = puddleRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    audioSynthesizer.playClick('soft');

    const newRipple: Ripple = { id: Date.now() + Math.random(), x: clickX, y: clickY };
    setRipples((prev) => [...prev.slice(-8), newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1200);
  };

  const handleAddBoat = (paperType: Boat['paperType']) => {
    audioSynthesizer.playPaperRustle();
    const newBoat: Boat = {
      id: `boat-${Date.now()}`,
      name: paperType === 'comic' ? 'Chacha Chaudhary Comic Boat' : 'Origami Newspaper Boat',
      paperType,
      x: 15 + Math.random() * 20,
      y: 20 + Math.random() * 50,
      rotation: (Math.random() - 0.5) * 20,
      driftSpeed: 0.15 + Math.random() * 0.15,
      scale: 0.85 + Math.random() * 0.3,
    };
    setBoats((prev) => [...prev, newBoat]);
  };

  const handleTriggerThunder = () => {
    setIsThunderFlashing(true);
    audioSynthesizer.playClick('heavy');
    setTimeout(() => {
      setIsThunderFlashing(false);
    }, 300);
  };

  return (
    <div id="monsoon-puddle" className="w-full p-4 md:p-8 rounded-2xl bg-[#14181a] border-2 border-[#2b444b] shadow-2xl relative overflow-hidden">
      {/* Thunder Lightning Flash Overlay */}
      {isThunderFlashing && (
        <div className="absolute inset-0 bg-white/40 pointer-events-none z-30 transition-opacity" />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#25393f] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-pixel rounded bg-[#0284c7]/30 text-[#38bdf8] border border-[#0284c7]/60">
                MONSOON VERANDA ’99
              </span>
              <span className="text-xs text-[#a3907c] font-mono">कागज़ की कश्ती (KAGAZ KI KASHTI)</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#f5ebd8] font-serif-vintage mt-1">
              The Paper Boat Monsoon Puddle
            </h2>
            <p className="text-xs text-[#b8a490] font-handwriting text-base">
              "Woh kagaz ki kashti, woh baarish ka paani..." — Tap anywhere in the water to create ripples
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerThunder}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#0c4a6e] hover:bg-[#0369a1] text-white text-xs font-pixel uppercase rounded border border-[#38bdf8] transition-transform active:scale-95 shadow"
            >
              <Zap className="w-3.5 h-3.5 text-yellow-300 fill-current" />
              <span>Thunder Flash</span>
            </button>
          </div>
        </div>

        {/* Origami Launch Toolbar */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-[#0d1417] rounded-xl border border-[#23353b]">
          <span className="text-xs font-mono text-[#94a3b8] px-2 uppercase">Fold & Launch:</span>
          <button
            onClick={() => handleAddBoat('dainik')}
            className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] text-[#f1f5f9] text-xs font-mono rounded border border-[#475569] flex items-center gap-1.5"
          >
            <span>📰 Hindi Dainik Jagran</span>
          </button>
          <button
            onClick={() => handleAddBoat('comic')}
            className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] text-[#f1f5f9] text-xs font-mono rounded border border-[#475569] flex items-center gap-1.5"
          >
            <span>🎨 Chacha Chaudhary Comic</span>
          </button>
          <button
            onClick={() => handleAddBoat('notebook')}
            className="px-3 py-1.5 bg-[#1e293b] hover:bg-[#334155] text-[#f1f5f9] text-xs font-mono rounded border border-[#475569] flex items-center gap-1.5"
          >
            <span>📓 Ruled Notebook Page</span>
          </button>
          <button
            onClick={() => setBoats([])}
            className="ml-auto px-3 py-1.5 text-xs text-gray-400 hover:text-gray-200 underline"
          >
            Clear Boats
          </button>
        </div>

        {/* Interactive Rain Puddle Pool */}
        <div
          ref={puddleRef}
          onClick={handlePuddleClick}
          className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl bg-gradient-to-b from-[#16272e] via-[#101e24] to-[#0a1418] border-4 border-[#233c45] shadow-[inset_0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden cursor-crosshair select-none"
        >
          {/* Water Surface Shimmer & Rain Lines */}
          <div className="absolute inset-0 bg-radial from-[#22d3ee]/5 via-transparent to-black/60 pointer-events-none" />

          {/* Fallen Red Oxide Terrace Tiles Background Texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          {/* Expanding Water Ripple Rings */}
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{ scale: 3.5, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute w-12 h-12 rounded-full border-2 border-[#38bdf8]/60 pointer-events-none -ml-6 -mt-6"
              style={{ left: `${r.x}%`, top: `${r.y}%` }}
            />
          ))}

          {/* Floating Origami Boats */}
          {boats.map((b) => (
            <motion.div
              key={b.id}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                transform: `rotate(${b.rotation}deg) scale(${b.scale})`,
              }}
              className="absolute -ml-8 -mt-6 transition-all duration-300 pointer-events-none"
            >
              {/* Paper Boat SVG Graphic */}
              <div className="relative flex flex-col items-center">
                {/* Boat Silhouette */}
                <div className={`p-2 rounded-t shadow-md border text-center ${
                  b.paperType === 'comic'
                    ? 'bg-yellow-100 text-yellow-950 border-orange-400 font-pixel text-[10px]'
                    : b.paperType === 'notebook'
                    ? 'bg-blue-50 text-blue-950 border-blue-300 font-mono text-[9px]'
                    : 'bg-[#f4efe6] text-gray-900 border-gray-400 font-serif text-[9px]'
                }`}>
                  <div className="text-xl">⛵</div>
                  <span className="truncate max-w-[80px] block leading-none opacity-80">
                    {b.paperType === 'comic' ? 'COMIC' : b.paperType === 'notebook' ? 'NOTE' : 'NEWS'}
                  </span>
                </div>
                {/* Water shadow */}
                <div className="w-12 h-2 rounded-full bg-black/40 blur-xs mt-0.5" />
              </div>
            </motion.div>
          ))}

          {/* Wet Leaves on Edge */}
          <div className="absolute top-4 left-6 text-2xl opacity-60 pointer-events-none">🍃</div>
          <div className="absolute bottom-4 right-8 text-2xl opacity-60 pointer-events-none">🍂</div>
          <div className="absolute bottom-6 left-12 text-xl opacity-60 pointer-events-none">🌿</div>

          {/* Floating Instructions */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 backdrop-blur-xs rounded-full border border-white/10 text-[11px] font-mono text-[#94a3b8] pointer-events-none">
            💧 Tap to stir ripples • Launch boats above
          </div>
        </div>
      </div>
    </div>
  );
};
