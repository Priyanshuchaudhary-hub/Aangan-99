import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sliders,
  Volume2,
  X,
  Sparkles,
  RefreshCw,
  Flame,
  CloudRain,
  Bell,
  Bird,
  Fan,
  Tv,
  Monitor,
  Radio,
  Bus,
  Train,
  Wind
} from 'lucide-react';
import { AMBIENT_LAYERS } from '../data/nostalgiaData.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

interface AmbientSoundMixerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AmbientSoundMixer: React.FC<AmbientSoundMixerProps> = ({ isOpen, onClose }) => {
  const [volumes, setVolumes] = useState<{ [key: string]: number }>({
    fan: 0.35,
    rain: 0.25,
    cooker: 0.2,
    koel: 0.2,
    gola: 0.15,
    crthum: 0,
    keyboard: 0,
    radiostatic: 0,
    bus: 0,
    train: 0,
    schoolbell: 0,
    traffic: 0
  });

  const [activePreset, setActivePreset] = useState<string>('monsoon');

  const handleVolumeChange = (layerId: string, val: number) => {
    setVolumes((prev) => ({ ...prev, [layerId]: val }));
    audioSynthesizer.setAmbientVolume(layerId, val);
  };

  const applyPreset = (presetKey: string) => {
    setActivePreset(presetKey);
    audioSynthesizer.playClick('switch');

    let newVolumes: { [key: string]: number } = {
      fan: 0,
      rain: 0,
      cooker: 0,
      koel: 0,
      gola: 0,
      crthum: 0,
      keyboard: 0,
      radiostatic: 0,
      bus: 0,
      train: 0,
      schoolbell: 0,
      traffic: 0
    };

    if (presetKey === 'monsoon') {
      newVolumes = { ...newVolumes, fan: 0.2, rain: 0.75, cooker: 0.2, koel: 0.2 };
    } else if (presetKey === 'afternoon') {
      newVolumes = { ...newVolumes, fan: 0.65, cooker: 0.25, gola: 0.45, traffic: 0.15 };
    } else if (presetKey === 'cybercafe') {
      newVolumes = { ...newVolumes, crthum: 0.55, keyboard: 0.65, fan: 0.3 };
    } else if (presetKey === 'bus') {
      newVolumes = { ...newVolumes, bus: 0.75, traffic: 0.35, radiostatic: 0.25 };
    } else if (presetKey === 'train') {
      newVolumes = { ...newVolumes, train: 0.8, traffic: 0.15, fan: 0.25 };
    } else if (presetKey === 'school') {
      newVolumes = { ...newVolumes, schoolbell: 0.6, traffic: 0.25, fan: 0.2 };
    }

    setVolumes(newVolumes);
    Object.entries(newVolumes).forEach(([k, v]) => {
      audioSynthesizer.setAmbientVolume(k, v);
    });
  };

  const renderLayerIcon = (id: string) => {
    switch (id) {
      case 'fan': return <Fan className="w-4 h-4 text-amber-400" />;
      case 'rain': return <CloudRain className="w-4 h-4 text-sky-400" />;
      case 'cooker': return <Flame className="w-4 h-4 text-orange-400" />;
      case 'koel': return <Bird className="w-4 h-4 text-emerald-400" />;
      case 'gola': return <Bell className="w-4 h-4 text-yellow-400" />;
      case 'crthum': return <Tv className="w-4 h-4 text-purple-400" />;
      case 'keyboard': return <Monitor className="w-4 h-4 text-blue-400" />;
      case 'radiostatic': return <Radio className="w-4 h-4 text-rose-400" />;
      case 'bus': return <Bus className="w-4 h-4 text-amber-500" />;
      case 'train': return <Train className="w-4 h-4 text-emerald-500" />;
      case 'schoolbell': return <Bell className="w-4 h-4 text-yellow-300" />;
      case 'traffic': default: return <Wind className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-[#1e1713] border-2 border-[#8c6d48] text-[#f5ebd8] space-y-4 shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#4d3a2c] pb-3">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-[#e5a93c]" />
              <div>
                <h3 className="text-lg font-bold font-serif-vintage text-[#f5ebd8]">
                  Soundboard of Forgotten Indian Sounds
                </h3>
                <p className="text-[11px] text-[#a89582] font-handwriting">
                  Procedural Web Audio Synthesizer (Ceiling fan, CRT hum, train tracks & school bell)
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                audioSynthesizer.playClick('soft');
                onClose();
              }}
              className="p-1 rounded bg-[#33241b] hover:bg-[#4a3627] text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-pixel text-[#ba9f83]">
              Atmosphere Presets:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => applyPreset('monsoon')}
                className={`p-2 rounded text-xs font-mono border text-left transition-all ${
                  activePreset === 'monsoon'
                    ? 'bg-[#0284c7]/20 border-[#38bdf8] text-[#38bdf8]'
                    : 'bg-[#150f0c] border-[#38261b] text-gray-400 hover:text-white'
                }`}
              >
                🌧️ Monsoon Veranda
              </button>

              <button
                onClick={() => applyPreset('afternoon')}
                className={`p-2 rounded text-xs font-mono border text-left transition-all ${
                  activePreset === 'afternoon'
                    ? 'bg-[#ca8a04]/20 border-[#facc15] text-[#fde047]'
                    : 'bg-[#150f0c] border-[#38261b] text-gray-400 hover:text-white'
                }`}
              >
                💤 Summer Afternoon
              </button>

              <button
                onClick={() => applyPreset('cybercafe')}
                className={`p-2 rounded text-xs font-mono border text-left transition-all ${
                  activePreset === 'cybercafe'
                    ? 'bg-[#8b5cf6]/20 border-[#a78bfa] text-[#a78bfa]'
                    : 'bg-[#150f0c] border-[#38261b] text-gray-400 hover:text-white'
                }`}
              >
                💻 Cyber Cafe 56k
              </button>

              <button
                onClick={() => applyPreset('bus')}
                className={`p-2 rounded text-xs font-mono border text-left transition-all ${
                  activePreset === 'bus'
                    ? 'bg-[#ea580c]/20 border-[#fb923c] text-[#fb923c]'
                    : 'bg-[#150f0c] border-[#38261b] text-gray-400 hover:text-white'
                }`}
              >
                🚌 State Roadways Bus
              </button>

              <button
                onClick={() => applyPreset('train')}
                className={`p-2 rounded text-xs font-mono border text-left transition-all ${
                  activePreset === 'train'
                    ? 'bg-[#16a34a]/20 border-[#4ade80] text-[#4ade80]'
                    : 'bg-[#150f0c] border-[#38261b] text-gray-400 hover:text-white'
                }`}
              >
                🚂 Sleeper Express
              </button>

              <button
                onClick={() => applyPreset('school')}
                className={`p-2 rounded text-xs font-mono border text-left transition-all ${
                  activePreset === 'school'
                    ? 'bg-[#eab308]/20 border-[#fde047] text-[#fde047]'
                    : 'bg-[#150f0c] border-[#38261b] text-gray-400 hover:text-white'
                }`}
              >
                🔔 School Recess Bell
              </button>
            </div>
          </div>

          {/* Individual Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#3b281c]">
            {AMBIENT_LAYERS.map((layer) => {
              const currentVol = volumes[layer.id] || 0;
              return (
                <div
                  key={layer.id}
                  className="p-2.5 bg-[#140e0b] rounded-lg border border-[#3b281b] space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      {renderLayerIcon(layer.id)}
                      <span className="font-bold text-[#f5ebd8] font-serif-vintage truncate text-[11px]">
                        {layer.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#a3907c]">
                      {Math.round(currentVol * 100)}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={currentVol}
                    onChange={(e) => handleVolumeChange(layer.id, parseFloat(e.target.value))}
                    className="w-full accent-[#e5a93c] cursor-pointer h-1.5 rounded bg-[#2a1d15]"
                  />
                  <div className="text-[9px] text-[#786553] truncate italic">
                    {layer.description}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                audioSynthesizer.stopAllAmbient();
                const resetVols = Object.keys(volumes).reduce((acc, k) => ({ ...acc, [k]: 0 }), {});
                setVolumes(resetVols);
                setActivePreset('none');
              }}
              className="px-3 py-2 bg-[#2d1c14] hover:bg-[#3d271c] text-[#d1beaa] font-mono text-xs rounded-lg border border-[#523724]"
            >
              Mute All
            </button>
            <button
              onClick={() => {
                audioSynthesizer.playClick('soft');
                onClose();
              }}
              className="flex-1 py-2 bg-[#c2842e] hover:bg-[#db9635] text-[#120f0e] font-bold font-pixel text-xs uppercase rounded-lg border border-[#e5a93c] shadow"
            >
              Apply Sound Mix & Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
