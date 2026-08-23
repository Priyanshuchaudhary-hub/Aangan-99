import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Tv, Volume2, Radio, Sparkles, SlidersHorizontal } from 'lucide-react';
import { CRT_CHANNELS } from '../data/nostalgiaData.ts';
import { CRTChannel } from '../types.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

export interface CRTTelevisionProps {
  selectedYear?: number;
}

export const CRTTelevision: React.FC<CRTTelevisionProps> = ({ selectedYear = 1999 }) => {
  const [currentChannelIndex, setCurrentChannelIndex] = useState<number>(0);
  const [antennaAngle, setAntennaAngle] = useState<number>(45);
  const [isOn, setIsOn] = useState<boolean>(true);
  const [staticLevel, setStaticLevel] = useState<number>(5); // 0-100%
  const [isFlickering, setIsFlickering] = useState<boolean>(false);

  const currentChannel: CRTChannel = CRT_CHANNELS[currentChannelIndex];

  const handleScreenClick = () => {
    if (!isOn) return;
    setIsFlickering(true);
    audioSynthesizer.playClick('switch');
    setTimeout(() => setIsFlickering(false), 220);
  };

  const handleChannelSwitch = (index: number) => {
    setCurrentChannelIndex(index);
    audioSynthesizer.playClick('switch');
    setIsFlickering(true);
    setTimeout(() => setIsFlickering(false), 180);
    if (isOn) {
      audioSynthesizer.playNostalgicMelody(CRT_CHANNELS[index].broadcastAudioKey);
    }
  };

  const handleTogglePower = () => {
    audioSynthesizer.playClick('heavy');
    if (!isOn) {
      audioSynthesizer.playCRTTurnOn();
      audioSynthesizer.playNostalgicMelody(currentChannel.broadcastAudioKey);
      setIsOn(true);
    } else {
      audioSynthesizer.stopCurrentMelody();
      setIsOn(false);
    }
  };

  const handleAntennaAdjust = (delta: number) => {
    setAntennaAngle((prev) => {
      const next = Math.max(-60, Math.min(60, prev + delta));
      // Adjust static based on antenna alignment
      const optimal = 15;
      const diff = Math.abs(next - optimal);
      setStaticLevel(Math.min(diff * 1.5, 40));
      return next;
    });
    audioSynthesizer.playClick('soft');
  };

  return (
    <div id="crt-tv" className="w-full p-4 md:p-8 rounded-2xl bg-[#17120f] border-2 border-[#543d2c] shadow-2xl relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3d2a1c] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-pixel rounded bg-[#ea580c]/30 text-[#fb923c] border border-[#ea580c]/60">
                DOORDARSHAN CRT BROADCAST
              </span>
              <span className="text-xs text-[#a3907c] font-mono">SOLAIRE / ONIDA 21" 1996</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#f5ebd8] font-serif-vintage mt-1">
              The Sunday Morning Television
            </h2>
            <p className="text-xs text-[#b8a490] font-handwriting text-base">
              Adjust the terrace antenna to clear the black & white static
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePower}
              className={`px-4 py-2 rounded-lg font-pixel text-xs uppercase tracking-wider border transition-all ${
                isOn
                  ? 'bg-[#15803d] border-[#4ade80] text-white shadow-[0_0_12px_rgba(74,222,128,0.4)]'
                  : 'bg-[#450a0a] border-[#f87171] text-[#fca5a5]'
              }`}
            >
              {isOn ? 'Power ON (220V)' : 'Power OFF'}
            </button>
          </div>
        </div>

        {/* CRT Cabinet Chassis */}
        <div className="relative mx-auto max-w-2xl p-6 md:p-8 rounded-3xl bg-gradient-to-b from-[#33241b] via-[#241812] to-[#170e0a] border-8 border-[#4a3424] shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          {/* Dual Telescopic Antenna */}
          <div className="relative -top-8 flex justify-center items-end gap-12 h-14">
            {/* Left Antenna Rod */}
            <motion.div
              animate={{ rotate: -antennaAngle }}
              className="w-1.5 h-16 bg-gradient-to-t from-[#8f7560] to-[#e2d5c3] origin-bottom rounded-t shadow cursor-pointer"
              title="Click or drag antenna to tune"
              onClick={() => handleAntennaAdjust(-10)}
            >
              <div className="w-2.5 h-2.5 -ml-0.5 rounded-full bg-[#f3e8d6] shadow" />
            </motion.div>

            {/* Center Antenna Base */}
            <div className="w-8 h-4 bg-[#1b120c] border border-[#523d2c] rounded-t-lg" />

            {/* Right Antenna Rod */}
            <motion.div
              animate={{ rotate: antennaAngle }}
              className="w-1.5 h-16 bg-gradient-to-t from-[#8f7560] to-[#e2d5c3] origin-bottom rounded-t shadow cursor-pointer"
              title="Click or drag antenna to tune"
              onClick={() => handleAntennaAdjust(10)}
            >
              <div className="w-2.5 h-2.5 -ml-0.5 rounded-full bg-[#f3e8d6] shadow" />
            </motion.div>
          </div>

          {/* Screen + Right Control Panel Layout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* CRT Curved Screen */}
            <div className="md:col-span-3">
              <div 
                onClick={handleScreenClick}
                className={`relative aspect-[4/3] w-full rounded-2xl bg-[#0a0c0e] border-4 border-[#1f1611] shadow-inner overflow-hidden flex items-center justify-center p-4 cursor-pointer transition-all ${
                  isFlickering ? 'brightness-150 contrast-150 scale-[0.995]' : ''
                }`}
                title="Click screen to tap glass / flicker CRT tube"
              >
                {/* Curved Phosphor Glass Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/40 pointer-events-none rounded-2xl z-20" />

                {/* CRT Horizontal Scanlines Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none z-10 opacity-35"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 1px, transparent 3px)'
                  }}
                />

                {isOn ? (
                  <div className="relative w-full h-full flex flex-col justify-between p-4 z-0 text-center select-none">
                    {/* Top Channel Badge */}
                    <div className="flex items-center justify-between text-xs text-[#86efac] font-pixel tracking-widest uppercase">
                      <span className="bg-black/60 px-2 py-0.5 rounded border border-green-500/30">
                        CH {currentChannel.id}: {currentChannel.name}
                      </span>
                      <span className="bg-black/60 px-2 py-0.5 rounded text-[#f59e0b]">
                        {currentChannel.yearRange}
                      </span>
                    </div>

                    {/* Channel Broadcast Art / Memory Presentation */}
                    <div className="my-auto space-y-3">
                      {currentChannelIndex === 0 && (
                        <div className="space-y-2">
                          <div className="w-20 h-20 mx-auto rounded-full border-4 border-[#e5a93c] flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(229,169,60,0.4)] animate-spin-slow">
                            🌀
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-[#fde047] font-serif-vintage tracking-wide">
                            MALGUDI DAYS
                          </h3>
                          <p className="font-handwriting text-base text-[#fef08a] italic">
                            Ta Na Na Na Na Na Re Na Na...
                          </p>
                        </div>
                      )}

                      {currentChannelIndex === 1 && (
                        <div className="space-y-2">
                          <div className="w-20 h-20 mx-auto rounded-xl bg-gradient-to-tr from-pink-600 to-indigo-600 flex items-center justify-center text-4xl shadow-lg">
                            📻
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-[#f472b6] font-serif-vintage">
                            SUPERHIT MUQABLA
                          </h3>
                          <p className="font-handwriting text-base text-[#fbcfe8]">
                            DD Metro Top 10 Countdown ’99
                          </p>
                        </div>
                      )}

                      {currentChannelIndex === 2 && (
                        <div className="space-y-2">
                          <div className="w-20 h-20 mx-auto rounded-xl bg-black border-2 border-white flex items-center justify-center text-3xl font-pixel text-white font-bold">
                            C|N
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-[#67e8f9] font-pixel text-2xl uppercase">
                            SWAT KATS & DEXTER
                          </h3>
                          <p className="font-handwriting text-base text-[#cffafe]">
                            3:30 PM School Recess Cartoon Block
                          </p>
                        </div>
                      )}

                      {currentChannelIndex === 3 && (
                        <div className="space-y-2">
                          <div className="w-20 h-20 mx-auto rounded-full bg-[#1e293b] border-2 border-[#38bdf8] flex items-center justify-center text-4xl">
                            🌾
                          </div>
                          <h3 className="text-xl md:text-2xl font-bold text-[#38bdf8] font-serif-vintage">
                            KRISHI DARSHAN
                          </h3>
                          <p className="font-handwriting text-base text-[#bae6fd]">
                            Namaskar, Aaj Ke Mukhya Samachar...
                          </p>
                        </div>
                      )}

                      <p className="text-xs text-[#cbd5e1] font-mono italic max-w-sm mx-auto bg-black/50 p-2 rounded border border-white/10">
                        {currentChannel.quote}
                      </p>
                    </div>

                    {/* Bottom Ticker */}
                    <div className="text-[11px] font-mono text-[#94a3b8] truncate">
                      {currentChannel.description}
                    </div>

                    {/* Static Interference Layer if untuned */}
                    {staticLevel > 8 && (
                      <div
                        className="absolute inset-0 bg-white/20 mix-blend-difference pointer-events-none"
                        style={{ opacity: staticLevel / 100 }}
                      />
                    )}
                  </div>
                ) : (
                  <div className="text-center space-y-1 text-[#475569] font-pixel">
                    <div className="w-2 h-2 mx-auto rounded-full bg-red-900" />
                    <p className="text-xs">STANDBY — TV POWERED DOWN</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Television Knobs & Speakers */}
            <div className="md:col-span-1 space-y-4 text-center">
              {/* Wooden Speaker Grille */}
              <div className="p-2 bg-[#120b08] rounded-lg border border-[#3d2719] space-y-1">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-1 bg-[#2b1910] rounded-full" />
                ))}
              </div>

              {/* Rotary Channel Selector Knob */}
              <div className="p-3 bg-[#1e130d] rounded-xl border border-[#442c1c] space-y-2">
                <span className="text-[10px] uppercase font-pixel text-[#ba9f83]">
                  CH SELECTOR
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {CRT_CHANNELS.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => handleChannelSwitch(idx)}
                      className={`p-2 rounded font-pixel text-xs uppercase border transition-all ${
                        currentChannelIndex === idx && isOn
                          ? 'bg-[#b45309] border-[#f59e0b] text-[#120f0e] font-bold shadow'
                          : 'bg-[#150d08] border-[#382315] text-[#a89078] hover:bg-[#2b1a10]'
                      }`}
                    >
                      CH {ch.id}
                    </button>
                  ))}
                </div>
              </div>

              {/* Antenna Tuning Fine Slider */}
              <div className="p-3 bg-[#1e130d] rounded-xl border border-[#442c1c] space-y-2 text-left">
                <div className="flex items-center justify-between text-[10px] uppercase font-pixel text-[#ba9f83]">
                  <span>Antenna Tune</span>
                  <span>{antennaAngle}°</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={antennaAngle}
                  onChange={(e) => handleAntennaAdjust(Number(e.target.value) - antennaAngle)}
                  className="w-full accent-[#d97706] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
