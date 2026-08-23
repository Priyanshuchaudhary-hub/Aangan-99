import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Radio,
  Disc,
  Sliders,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Sparkles,
  Music,
  Wind,
  CloudRain,
  Train,
  Bus,
  Tv,
  Monitor,
  Flame
} from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

export interface MemoryAudioTrack {
  id: string;
  currentMemory: string;
  hindiMemory: string;
  trackTitle: string;
  year: number;
  category: string;
  durationSeconds: number;
  synthMelodyKey: 'doordarshan' | 'milesur' | 'malgudi' | 'junglebook' | 'indipop' | 'shaktimaan' | 'powercut' | 'gully';
  soundscapePreset: 'summer-afternoon' | 'bus-journey' | 'rainy-evening' | 'computer-room' | 'train-journey' | 'dd-evening' | 'school-recess';
  vibe: string;
}

export const MEMORY_AUDIO_TRACKS: MemoryAudioTrack[] = [
  {
    id: 'tr-1',
    currentMemory: 'Sunday 9:00 AM Living Room CRT',
    hindiMemory: 'दूरदर्शन और रविवार की सुबह',
    trackTitle: 'Doordarshan National Motif',
    year: 1995,
    category: 'National Television (DD1)',
    durationSeconds: 105,
    synthMelodyKey: 'doordarshan',
    soundscapePreset: 'dd-evening',
    vibe: 'Peacock spiral broadcast, rotating antenna & Onida CRT tube hum'
  },
  {
    id: 'tr-2',
    currentMemory: 'Dusty Malgudi Summer Afternoon',
    hindiMemory: 'मालगुडी डेज़ और सुहानी दोपहर',
    trackTitle: 'Malgudi Days — Ta Na Na Theme',
    year: 1998,
    category: 'Sunday Morning Classics',
    durationSeconds: 140,
    synthMelodyKey: 'malgudi',
    soundscapePreset: 'summer-afternoon',
    vibe: 'Swami running barefoot past banyan tree, tanpura drones & ceiling fan'
  },
  {
    id: 'tr-3',
    currentMemory: 'Cabin 4 Cyber Cafe 56k Dial-Up',
    hindiMemory: 'साइबर कैफे और 56k मॉडम',
    trackTitle: 'VSNL Cyberspace & Yahoo BUZZ',
    year: 2004,
    category: 'Cyber Cafe & Tech',
    durationSeconds: 120,
    synthMelodyKey: 'indipop',
    soundscapePreset: 'computer-room',
    vibe: 'CRT high-pitch whine, mechanical keyboard clatter & V.90 modem handshake'
  },
  {
    id: 'tr-4',
    currentMemory: 'Asbestos Veranda Monsoon Shower',
    hindiMemory: 'बरसात और छत पर चाय',
    trackTitle: 'Rain On Tin Roof & Harmonica',
    year: 1999,
    category: 'Monsoon Terrace',
    durationSeconds: 170,
    synthMelodyKey: 'powercut',
    soundscapePreset: 'rainy-evening',
    vibe: 'Heavy petrichor drops, paper boat floating & mom frying hot pakodas'
  },
  {
    id: 'tr-5',
    currentMemory: 'State Roadways Bus Window Seat',
    hindiMemory: 'रोडवेज़ बस की खिड़की वाली सीट',
    trackTitle: 'Chaddi Pehen Ke Phool Khila Hai',
    year: 1996,
    category: 'Roadways Bus Journey',
    durationSeconds: 160,
    synthMelodyKey: 'junglebook',
    soundscapePreset: 'bus-journey',
    vibe: 'Tata 1210 diesel engine vibration, punched red tickets & roadside chai dhabas'
  },
  {
    id: 'tr-6',
    currentMemory: 'Indian Railways 2nd Class Sleeper',
    hindiMemory: 'रेलगाड़ी और खिड़की से आती हवा',
    trackTitle: 'Mile Sur Mera Tumhara (Train Echoes)',
    year: 1997,
    category: 'Indian Railways',
    durationSeconds: 190,
    synthMelodyKey: 'milesur',
    soundscapePreset: 'train-journey',
    vibe: 'Rhythmic track joint clacks (dhadak-dhadak), blue Rexine berth & WDM-2 loco horn'
  },
  {
    id: 'tr-7',
    currentMemory: 'Street Corner Gully Cricket (4 PM)',
    hindiMemory: 'गली क्रिकेट और एक टप्पा आउट',
    trackTitle: 'Gully Cricket Golden Evening',
    year: 1998,
    category: 'School Recess & Street',
    durationSeconds: 150,
    synthMelodyKey: 'gully',
    soundscapePreset: 'school-recess',
    vibe: 'Tennis ball thwack against wooden plank, brass school gong & laughter'
  },
  {
    id: 'tr-8',
    currentMemory: 'Indipop Cassette Tape Walkman',
    hindiMemory: 'कैसेट वॉकमेन और इंडीपॉप',
    trackTitle: 'Indipop Summer Wave ’99',
    year: 1999,
    category: 'Cassette Mix Tape',
    durationSeconds: 185,
    synthMelodyKey: 'indipop',
    soundscapePreset: 'summer-afternoon',
    vibe: 'Dual deck recorded cassette tape hiss, Lucky Ali chords & pencil rewinds'
  }
];

export const NostalgicAudioPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.75);
  const [progress, setProgress] = useState<number>(0);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [vuLevels, setVuLevels] = useState<number[]>([40, 60, 75, 50, 65, 80, 45, 70]);
  const [tapeRotation, setTapeRotation] = useState<number>(0);

  const currentTrack = MEMORY_AUDIO_TRACKS[currentTrackIndex];
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // VU Meter and tape reel animation loop when playing
  useEffect(() => {
    let animId: number;
    if (isPlaying && !isMuted) {
      const interval = setInterval(() => {
        setVuLevels([
          Math.floor(20 + Math.random() * 70),
          Math.floor(30 + Math.random() * 65),
          Math.floor(40 + Math.random() * 55),
          Math.floor(35 + Math.random() * 60),
          Math.floor(50 + Math.random() * 45),
          Math.floor(45 + Math.random() * 50),
          Math.floor(30 + Math.random() * 65),
          Math.floor(25 + Math.random() * 70)
        ]);
        setTapeRotation((prev) => (prev + 12) % 360);
      }, 100);

      return () => clearInterval(interval);
    } else {
      setVuLevels([0, 0, 0, 0, 0, 0, 0, 0]);
    }
  }, [isPlaying, isMuted]);

  // Track progress timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= currentTrack.durationSeconds) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentTrack.durationSeconds, currentTrackIndex]);

  const handlePlay = (trackIdx?: number) => {
    const idx = typeof trackIdx === 'number' ? trackIdx : currentTrackIndex;
    const track = MEMORY_AUDIO_TRACKS[idx];
    audioSynthesizer.playClick('heavy');
    setIsPlaying(true);
    if (isMuted) {
      setIsMuted(false);
      audioSynthesizer.setMasterMute(false);
    }
    audioSynthesizer.setMasterVolume(volume);
    audioSynthesizer.playNostalgicMelody(track.synthMelodyKey);
    audioSynthesizer.applySoundscapePreset(track.soundscapePreset);
  };

  const handlePause = () => {
    audioSynthesizer.playClick('soft');
    setIsPlaying(false);
    audioSynthesizer.stopCurrentMelody();
    audioSynthesizer.stopAllAmbient();
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const handleNextTrack = () => {
    audioSynthesizer.playClick('switch');
    let nextIdx: number;
    if (isRepeat) {
      nextIdx = currentTrackIndex;
    } else if (isShuffle) {
      nextIdx = Math.floor(Math.random() * MEMORY_AUDIO_TRACKS.length);
    } else {
      nextIdx = (currentTrackIndex + 1) % MEMORY_AUDIO_TRACKS.length;
    }
    setCurrentTrackIndex(nextIdx);
    setProgress(0);
    if (isPlaying) {
      handlePlay(nextIdx);
    }
  };

  const handlePrevTrack = () => {
    audioSynthesizer.playClick('switch');
    const prevIdx = (currentTrackIndex - 1 + MEMORY_AUDIO_TRACKS.length) % MEMORY_AUDIO_TRACKS.length;
    setCurrentTrackIndex(prevIdx);
    setProgress(0);
    if (isPlaying) {
      handlePlay(prevIdx);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    audioSynthesizer.setMasterVolume(newVol);
    if (newVol === 0) {
      setIsMuted(true);
      audioSynthesizer.setMasterMute(true);
    } else if (isMuted) {
      setIsMuted(false);
      audioSynthesizer.setMasterMute(false);
    }
  };

  const handleToggleMute = () => {
    audioSynthesizer.playClick('switch');
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioSynthesizer.setMasterMute(nextMuted);
  };

  const handleSelectPresetScene = (idx: number) => {
    setCurrentTrackIndex(idx);
    setProgress(0);
    handlePlay(idx);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-32px)]">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="mb-3 w-80 sm:w-96 rounded-2xl bg-gradient-to-b from-[#261c16] via-[#1a120e] to-[#120c09] border-2 border-[#7a573a] shadow-2xl p-4 text-[#f3e7d5] select-none"
            style={{
              boxShadow: '0 20px 40px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.15)'
            }}
          >
            {/* Retro Player Top Bezel */}
            <div className="flex items-center justify-between border-b border-[#473323] pb-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" />
                <span className="font-pixel text-xs text-[#e5a93c] tracking-wider uppercase flex items-center gap-1">
                  <span>📼</span> SUMMER VACATION RADIO
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono text-[#a89582] bg-[#140e0a] px-2 py-0.5 rounded border border-[#3d2a1c]">
                  WALKMAN WM-99
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 text-[#a89582] hover:text-white rounded hover:bg-[#3d2b1f] transition-colors"
                  title="Minimize Player"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Cassette Tape Window & Spools */}
            <div className="relative h-20 rounded-xl bg-[#0c0806] border border-[#422e20] p-2 flex items-center justify-between mb-3 overflow-hidden shadow-inner">
              {/* Left Tape Spool */}
              <div className="relative w-12 h-12 rounded-full border-2 border-[#5c402b] bg-[#1a120d] flex items-center justify-center shadow">
                <div
                  className="w-10 h-10 rounded-full border border-dashed border-[#8c6243] flex items-center justify-center"
                  style={{ transform: `rotate(${tapeRotation}deg)` }}
                >
                  <div className="w-3 h-3 rounded-full bg-[#2a1d15] border border-[#a8744f]" />
                </div>
              </div>

              {/* Center Tape Window Info */}
              <div className="flex-1 px-3 text-center">
                <div className="text-[9px] font-pixel text-[#ea580c] uppercase">
                  SIDE A • TDK C-90
                </div>
                <div className="w-full bg-[#221711] h-1.5 rounded-full my-1 overflow-hidden border border-[#38261b]">
                  <div
                    className="h-full bg-[#f59e0b] transition-all duration-300"
                    style={{ width: `${(progress / currentTrack.durationSeconds) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] font-mono text-[#a89582]">
                  {formatTime(progress)} / {formatTime(currentTrack.durationSeconds)}
                </div>
              </div>

              {/* Right Tape Spool */}
              <div className="relative w-12 h-12 rounded-full border-2 border-[#5c402b] bg-[#1a120d] flex items-center justify-center shadow">
                <div
                  className="w-10 h-10 rounded-full border border-dashed border-[#8c6243] flex items-center justify-center"
                  style={{ transform: `rotate(${tapeRotation}deg)` }}
                >
                  <div className="w-3 h-3 rounded-full bg-[#2a1d15] border border-[#a8744f]" />
                </div>
              </div>
            </div>

            {/* LCD Backlit Info Screen */}
            <div className="rounded-lg bg-[#0e1710] border border-[#1b3d22] p-2.5 mb-3 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between text-[10px] text-[#4ade80] font-pixel mb-1">
                <span>SCENE: {currentTrack.currentMemory}</span>
                <span className="bg-[#1b4324] px-1 rounded text-[9px] text-[#86efac]">
                  {currentTrack.year}
                </span>
              </div>
              <div className="font-bold text-[#22c55e] text-sm truncate tracking-wide">
                {currentTrack.trackTitle}
              </div>
              <div className="text-[11px] text-[#86efac]/80 truncate font-handwriting mt-0.5">
                {currentTrack.category} — {currentTrack.hindiMemory}
              </div>
              <div className="text-[10px] text-[#4ade80]/60 italic truncate mt-1">
                {currentTrack.vibe}
              </div>

              {/* Stereo VU Meter Bar */}
              <div className="mt-2 pt-2 border-t border-[#1b3d22] flex items-end gap-1 h-5 justify-between px-1">
                <span className="text-[8px] font-pixel text-[#4ade80]">VU</span>
                {vuLevels.map((lvl, idx) => (
                  <div key={idx} className="flex-1 bg-[#132b1a] h-full rounded-xs overflow-hidden flex flex-col justify-end">
                    <div
                      className={`w-full transition-all duration-75 ${
                        lvl > 65 ? 'bg-[#ef4444]' : lvl > 45 ? 'bg-[#eab308]' : 'bg-[#22c55e]'
                      }`}
                      style={{ height: `${lvl}%` }}
                    />
                  </div>
                ))}
                <span className="text-[8px] font-pixel text-[#4ade80]">CH-R</span>
              </div>
            </div>

            {/* Quick Memory Scene Selector Pills / Playlist */}
            <div className="mb-3">
              <div className="text-[10px] uppercase font-pixel text-[#ba9f83] mb-1.5 flex items-center justify-between">
                <span>PLAYLIST ({MEMORY_AUDIO_TRACKS.length} TRACKS):</span>
                <span className="text-[9px] text-[#d97706]">Procedural Web Audio</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-mono max-h-32 overflow-y-auto pr-0.5">
                {MEMORY_AUDIO_TRACKS.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectPresetScene(idx)}
                    className={`px-2 py-1 rounded text-left truncate transition-all border ${
                      currentTrackIndex === idx && isPlaying
                        ? 'bg-[#ea580c] text-white border-[#f97316] font-bold shadow'
                        : 'bg-[#150f0c] text-[#a89582] border-[#38261b] hover:bg-[#281c15] hover:text-[#f3e7d5]'
                    }`}
                  >
                    <span className="mr-1 text-[#f59e0b]">♫</span>
                    <span>{t.trackTitle.split(' ')[0]} ({t.year})</span>
                  </button>
                ))}
              </div>

              {/* Mode Toggle Controls: SHUFFLE & REPEAT */}
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#3b281d]">
                <button
                  onClick={() => {
                    audioSynthesizer.playClick('switch');
                    setIsShuffle(!isShuffle);
                  }}
                  className={`flex-1 py-1 px-2 rounded font-pixel text-[9px] tracking-wider uppercase border transition-all ${
                    isShuffle
                      ? 'bg-[#b45309] text-white border-[#f59e0b] shadow'
                      : 'bg-[#19110c] text-[#a89582] border-[#3b281c] hover:text-white'
                  }`}
                >
                  [ SHUFFLE {isShuffle ? 'ON' : 'OFF'} ]
                </button>

                <button
                  onClick={() => {
                    audioSynthesizer.playClick('switch');
                    setIsRepeat(!isRepeat);
                  }}
                  className={`flex-1 py-1 px-2 rounded font-pixel text-[9px] tracking-wider uppercase border transition-all ${
                    isRepeat
                      ? 'bg-[#b45309] text-white border-[#f59e0b] shadow'
                      : 'bg-[#19110c] text-[#a89582] border-[#3b281c] hover:text-white'
                  }`}
                >
                  [ REPEAT {isRepeat ? 'ON' : 'OFF'} ]
                </button>
              </div>
            </div>

            {/* Chunky Physical Playback Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-[#473323]">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevTrack}
                  className="p-2 rounded-lg bg-[#2b1f17] hover:bg-[#3d2b20] active:scale-95 border border-[#543b27] text-[#e0cfba] shadow"
                  title="Previous Memory"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={handleTogglePlay}
                  className={`px-4 py-2 rounded-lg font-pixel text-xs flex items-center gap-1.5 shadow transition-all border ${
                    isPlaying
                      ? 'bg-[#d97706] hover:bg-[#b45309] text-white border-[#f59e0b] shadow-[0_0_12px_#d97706]'
                      : 'bg-[#16a34a] hover:bg-[#15803d] text-white border-[#4ade80] shadow-[0_0_12px_#16a34a]'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>PAUSE</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      <span>PLAY TAPE</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNextTrack}
                  className="p-2 rounded-lg bg-[#2b1f17] hover:bg-[#3d2b20] active:scale-95 border border-[#543b27] text-[#e0cfba] shadow"
                  title="Next Memory"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Master Volume & Mute */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMute}
                  className={`p-2 rounded-lg border transition-colors ${
                    isMuted
                      ? 'bg-[#dc2626]/20 border-[#ef4444] text-[#ef4444]'
                      : 'bg-[#2b1f17] border-[#543b27] text-[#e0cfba] hover:bg-[#3d2b20]'
                  }`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 accent-[#ea580c] cursor-pointer h-1.5 rounded bg-[#170e09]"
                  title="Master Volume"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Docked Compact Player Bar */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-xl bg-[#1e1511]/95 backdrop-blur-md border-2 border-[#69482f] shadow-2xl text-[#f3e7d5] cursor-pointer select-none"
        onClick={() => {
          if (!isExpanded) setIsExpanded(true);
        }}
      >
        {/* Play/Pause Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleTogglePlay();
          }}
          className={`p-2 rounded-lg transition-all shadow border ${
            isPlaying
              ? 'bg-[#d97706] text-white border-[#f59e0b]'
              : 'bg-[#22c55e] text-white border-[#4ade80]'
          }`}
          title={isPlaying ? 'Pause Audio' : 'Play Nostalgic Audio'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Track / Memory summary info */}
        <div className="flex flex-col min-w-[140px] max-w-[180px] sm:max-w-[220px]">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-pixel text-[#ea580c] uppercase">
              {currentTrack.year} MEMORY
            </span>
            {isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
            )}
          </div>
          <span className="text-xs font-bold font-mono text-[#f5ebd8] truncate">
            {currentTrack.trackTitle}
          </span>
          <span className="text-[10px] text-[#a89582] truncate font-handwriting">
            {currentTrack.currentMemory}
          </span>
        </div>

        {/* Mini VU meter bars */}
        <div className="hidden sm:flex items-end gap-0.5 h-4 w-10 px-1 bg-[#120b08] rounded border border-[#3b281c]">
          {vuLevels.slice(0, 5).map((lvl, idx) => (
            <div key={idx} className="flex-1 bg-[#1a2d1d] h-full flex flex-col justify-end">
              <div
                className="w-full bg-[#22c55e] transition-all duration-75"
                style={{ height: `${lvl}%` }}
              />
            </div>
          ))}
        </div>

        {/* Quick Prev / Next */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handlePrevTrack}
            className="p-1 rounded text-[#a89582] hover:text-white hover:bg-[#3b291d]"
            title="Previous track"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNextTrack}
            className="p-1 rounded text-[#a89582] hover:text-white hover:bg-[#3b291d]"
            title="Next track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleToggleMute}
            className={`p-1 rounded ${
              isMuted ? 'text-[#ef4444]' : 'text-[#a89582] hover:text-white hover:bg-[#3b291d]'
            }`}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expand / Collapse toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="p-1.5 rounded-lg bg-[#2e1f16] hover:bg-[#422d20] border border-[#523824] text-[#e0cfba] ml-1"
          title={isExpanded ? 'Collapse Player' : 'Expand Walkman Player'}
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </motion.div>
    </div>
  );
};
