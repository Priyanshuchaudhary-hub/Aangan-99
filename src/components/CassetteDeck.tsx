import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, Square, SkipBack, SkipForward, Disc, RefreshCw, Volume2, Sparkles, Pencil } from 'lucide-react';
import { CASSETTE_TRACKS } from '../data/nostalgiaData.ts';
import { CassetteTrack } from '../types.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

export interface CassetteDeckProps {
  selectedYear?: number;
}

export const CassetteDeck: React.FC<CassetteDeckProps> = ({ selectedYear = 1999 }) => {
  const [currentSide, setCurrentSide] = useState<'A' | 'B'>('A');
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [tapeCounter, setTapeCounter] = useState<number>(142);
  const [isPencilWinding, setIsPencilWinding] = useState<boolean>(false);
  const [isEjected, setIsEjected] = useState<boolean>(false);
  const [isSecretTapeUnlocked, setIsSecretTapeUnlocked] = useState<boolean>(false);
  const [screwClickCount, setScrewClickCount] = useState<number>(0);

  const SECRET_TRACKS: CassetteTrack[] = [
    {
      id: 'secret-track-1',
      title: 'Made In India (Alisha Chinai Club Mix)',
      hindiTitle: 'मेड इन इंडिया (रेडियो रीमिक्स)',
      artistOrSource: 'Biddu & Alisha Chinai (1995)',
      duration: '4:22',
      side: 'A',
      synthMelodyKey: 'malgudi',
      vibeDescription: 'MTV India Top 10 revolution playing on Philips sound machine with disco bass.',
      tag: 'IndiePop'
    },
    {
      id: 'secret-track-2',
      title: 'O Sanam (Mohabbat Ki Kasam)',
      hindiTitle: 'ओ सनम (सफ़रनामा)',
      artistOrSource: 'Lucky Ali - Sunoh (1996)',
      duration: '3:45',
      side: 'A',
      synthMelodyKey: 'junglebook',
      vibeDescription: 'Acoustic nylon string guitar echoing in Cairo desert sunset on Channel [V].',
      tag: 'Acoustic'
    },
    {
      id: 'secret-track-3',
      title: 'Dhoom Pichak Dhoom (College Rock)',
      hindiTitle: 'धूम पिचक धूम',
      artistOrSource: 'Euphoria - Dhoom (1998)',
      duration: '3:50',
      side: 'B',
      synthMelodyKey: 'shaktimaan',
      vibeDescription: 'Dr. Palash Sen and Hindrock drums shaking the Delhi University amphitheatre.',
      tag: 'HindRock'
    },
    {
      id: 'secret-track-4',
      title: 'Bally Sagoo Jhankar Dhol Beat',
      hindiTitle: 'बाली सागू झंकार रीमिक्स',
      artistOrSource: 'Bally Sagoo - Bollywood Flashback',
      duration: '4:10',
      side: 'B',
      synthMelodyKey: 'doordarshan',
      vibeDescription: 'Bass-boosted auto-rickshaw tape with extra echo and dholak loops.',
      tag: 'Remix'
    }
  ];

  const standardTracks = CASSETTE_TRACKS.filter((t) => t.side === currentSide);
  const secretTracks = SECRET_TRACKS.filter((t) => t.side === currentSide);
  const tracksForSide = isSecretTapeUnlocked ? secretTracks : standardTracks;
  const currentTrack: CassetteTrack = tracksForSide[currentTrackIndex] || tracksForSide[0];

  const handleScrewClick = () => {
    const nextCount = screwClickCount + 1;
    setScrewClickCount(nextCount);
    audioSynthesizer.playClick('switch');
    if (nextCount >= 3) {
      audioSynthesizer.playSuccessChime();
      setIsSecretTapeUnlocked(!isSecretTapeUnlocked);
      setScrewClickCount(0);
      setCurrentTrackIndex(0);
    }
  };

  // Tape counter increment during playback
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setTapeCounter((prev) => (prev >= 999 ? 0 : prev + 1));
      }, 1400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Handle Play
  const handlePlay = (trackOverride?: CassetteTrack, indexOverride?: number) => {
    const targetTrack = trackOverride || currentTrack;
    if (indexOverride !== undefined) {
      setCurrentTrackIndex(indexOverride);
    }
    setIsPlaying(true);
    setIsEjected(false);
    audioSynthesizer.playClick('heavy');
    audioSynthesizer.playNostalgicMelody(targetTrack.synthMelodyKey, () => {
      handleNext();
    });
  };

  // Handle Pause/Stop
  const handleStop = () => {
    setIsPlaying(false);
    audioSynthesizer.playClick('heavy');
    audioSynthesizer.stopCurrentMelody();
  };

  // Handle Next
  const handleNext = () => {
    audioSynthesizer.playClick('soft');
    const nextIdx = (currentTrackIndex + 1) % tracksForSide.length;
    setCurrentTrackIndex(nextIdx);
    if (isPlaying) {
      audioSynthesizer.playNostalgicMelody(tracksForSide[nextIdx].synthMelodyKey);
    }
  };

  // Handle Prev
  const handlePrev = () => {
    audioSynthesizer.playClick('soft');
    const prevIdx = (currentTrackIndex - 1 + tracksForSide.length) % tracksForSide.length;
    setCurrentTrackIndex(prevIdx);
    if (isPlaying) {
      audioSynthesizer.playNostalgicMelody(tracksForSide[prevIdx].synthMelodyKey);
    }
  };

  // Flip Side A / Side B
  const handleFlipSide = () => {
    audioSynthesizer.playClick('heavy');
    handleStop();
    const newSide = currentSide === 'A' ? 'B' : 'A';
    setCurrentSide(newSide);
    setCurrentTrackIndex(0);
  };

  // Natraj Pencil Rewind Easter Egg
  const handlePencilRewind = () => {
    setIsPencilWinding(true);
    audioSynthesizer.playPencilWind();
    setTapeCounter((prev) => Math.max(0, prev - 18));
    setTimeout(() => {
      audioSynthesizer.playPencilWind();
      setIsPencilWinding(false);
    }, 600);
  };

  return (
    <div id="cassette-deck" className="w-full p-4 md:p-8 rounded-2xl bg-[#1b1411] border-2 border-[#573f2c] shadow-2xl relative overflow-hidden">
      {/* Background Vintage Texture */}
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-9xl">
        📼
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#443021] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-pixel rounded bg-[#b45309]/30 text-[#f59e0b] border border-[#b45309]/60">
                STEREO CASSETTE PLAYER
              </span>
              <span className="text-xs text-[#a3907c] font-mono">BPL / SONY WALKMAN ’98</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#f5ebd8] font-serif-vintage mt-1">
              The Indian Cassette Mixtape
            </h2>
            <p className="text-xs text-[#b8a490] font-handwriting text-base">
              Recorded off All India Radio FM & Doordarshan Sunday broadcast
            </p>
          </div>

          {/* Tape Counter & Eject */}
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-[#0c0a09] border-2 border-[#423326] rounded flex items-center gap-2 shadow-inner">
              <span className="text-[10px] text-[#8e7a68] font-pixel uppercase">COUNTER</span>
              <span className="text-sm font-pixel text-[#4ade80] tracking-widest">
                {String(tapeCounter).padStart(3, '0')}
              </span>
            </div>

            <button
              onClick={() => {
                audioSynthesizer.playClick('heavy');
                setIsEjected(!isEjected);
                if (isPlaying) handleStop();
              }}
              className="px-3 py-1.5 bg-[#2a1d17] hover:bg-[#3d2c22] border border-[#5a422e] text-[#d6c4b0] text-xs font-pixel uppercase rounded transition-transform active:scale-95"
            >
              {isEjected ? 'Insert Tape' : 'Eject ⏏'}
            </button>
          </div>
        </div>

        {/* Cassette Graphic Container */}
        <div className="relative mx-auto max-w-xl">
          {/* Cassette Tape Body */}
          <motion.div
            drag="y"
            dragConstraints={{ top: isEjected ? -40 : 0, bottom: isEjected ? 0 : 30 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 20 && isEjected) {
                audioSynthesizer.playClick('heavy');
                setIsEjected(false);
              } else if (info.offset.y < -20 && !isEjected) {
                audioSynthesizer.playClick('heavy');
                setIsEjected(true);
                if (isPlaying) handleStop();
              }
            }}
            whileHover={{ rotate: 0.7, y: isEjected ? -32 : -3 }}
            whileTap={{ scale: 0.985 }}
            animate={{
              y: isEjected ? -30 : 0,
              opacity: isEjected ? 0.75 : 1,
              scale: isEjected ? 0.96 : 1,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-full rounded-2xl p-5 bg-gradient-to-b from-[#2d221c] via-[#211712] to-[#18110d] border-4 border-[#523d2b] shadow-[0_12px_30px_rgba(0,0,0,0.8)] relative cursor-grab active:cursor-grabbing select-none"
          >
            {/* Corner Screws with Hidden Easter Egg Interaction */}
            <button
              onClick={handleScrewClick}
              title="Click 3 times to unlock hidden tape"
              className="absolute top-2.5 left-2.5 w-4 h-4 rounded-full bg-[#120d0a] border border-[#6b513a] flex items-center justify-center text-[8px] text-[#856c55] hover:text-amber-400 hover:border-amber-400 transition-colors z-20 cursor-pointer"
            >
              ✕
            </button>
            <button
              onClick={handleScrewClick}
              title="Click 3 times to unlock hidden tape"
              className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#120d0a] border border-[#6b513a] flex items-center justify-center text-[8px] text-[#856c55] hover:text-amber-400 hover:border-amber-400 transition-colors z-20 cursor-pointer"
            >
              ✕
            </button>
            <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-[#120d0a] border border-[#6b513a] flex items-center justify-center text-[8px] text-[#856c55]">✕</div>
            <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-[#120d0a] border border-[#6b513a] flex items-center justify-center text-[8px] text-[#856c55]">✕</div>

            {/* Handwritten Tape Label */}
            <div className={`p-3 rounded-lg paper-texture border-2 shadow-md relative overflow-hidden ${
              isSecretTapeUnlocked ? 'bg-[#fef9c3] border-yellow-600 text-yellow-950' : 'border-[#b89f81] text-[#1c1815]'
            }`}>
              <div className="flex items-center justify-between border-b-2 border-red-800/30 pb-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-white font-bold font-mono rounded text-[11px] ${
                    isSecretTapeUnlocked ? 'bg-amber-700' : 'bg-red-800'
                  }`}>
                    SIDE {currentSide} {isSecretTapeUnlocked ? '★ SECRET' : ''}
                  </span>
                  <span className="font-handwriting font-bold text-base text-red-900 truncate">
                    {isSecretTapeUnlocked
                      ? 'Underground 90s Remixes & Indie Pop'
                      : currentSide === 'A'
                      ? 'Monsoon Memories ’98'
                      : 'Summer Vacation ’01'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-gray-700">
                  {isSecretTapeUnlocked ? 'TDK CHROME II' : 'TDK / MAXELL 60min'}
                </span>
              </div>

              {/* Middle Cassette Window with Spools */}
              <div className="my-3 py-2 px-4 rounded bg-[#100d0b] border-2 border-[#3d2f25] flex items-center justify-between relative shadow-inner">
                {/* Left Spool */}
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#1a1410] border-2 border-[#614935]">
                  <motion.div
                    animate={isPlaying || isPencilWinding ? { rotate: 360 } : { rotate: 0 }}
                    transition={
                      isPlaying || isPencilWinding
                        ? { repeat: Infinity, duration: isPencilWinding ? 0.4 : 1.8, ease: 'linear' }
                        : {}
                    }
                    className="w-10 h-10 rounded-full border-2 border-dashed border-[#d97706] flex items-center justify-center"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#e5a93c] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#100d0b]" />
                    </div>
                  </motion.div>
                </div>

                {/* Magnetic Tape Ribbon Window */}
                <div className="flex-1 mx-3 h-8 bg-[#1f1611] rounded border border-[#4a3627] flex items-center justify-center relative overflow-hidden px-2">
                  <div className="w-full h-2 bg-[#422212] rounded-sm relative">
                    <motion.div
                      className="h-full bg-[#78350f]"
                      animate={isPlaying ? { opacity: [0.7, 1, 0.7] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  </div>
                  {/* Tape counter window markings */}
                  <span className="absolute bottom-0 text-[8px] font-mono text-[#8a725e]">
                    ||| 0 • 50 • 100 |||
                  </span>
                </div>

                {/* Right Spool */}
                <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#1a1410] border-2 border-[#614935]">
                  <motion.div
                    animate={isPlaying || isPencilWinding ? { rotate: 360 } : { rotate: 0 }}
                    transition={
                      isPlaying || isPencilWinding
                        ? { repeat: Infinity, duration: isPencilWinding ? 0.4 : 1.8, ease: 'linear' }
                        : {}
                    }
                    className="w-10 h-10 rounded-full border-2 border-dashed border-[#d97706] flex items-center justify-center"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#e5a93c] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#100d0b]" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Current Track Name on Tape */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="truncate font-handwriting text-base font-bold text-[#1f2937]">
                  🎵 {currentTrack.title}
                </div>
                <div className="text-[11px] font-mono text-gray-600">
                  {currentTrack.duration}
                </div>
              </div>
            </div>

            {/* Bottom Trapezoid base of cassette */}
            <div className="mt-3 mx-auto w-3/4 h-5 bg-[#17100b] border-t border-[#473424] rounded-b flex items-center justify-around px-4">
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a0705] border border-[#523d2b]" />
              <div className="w-16 h-2 bg-[#2d180f] rounded" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a0705] border border-[#523d2b]" />
            </div>
          </motion.div>
        </div>

        {/* Transport Hardware Controls */}
        <div className="p-4 bg-[#120e0c] rounded-xl border border-[#3d2b1f] shadow-inner space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4">
            <button
              onClick={handlePrev}
              title="Previous Track"
              className="p-3 rounded-lg bg-[#271d16] hover:bg-[#3b2d23] active:bg-[#1f1610] text-[#d6c4b0] border border-[#543e2d] transition-transform active:scale-95 shadow"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {isPlaying ? (
              <button
                onClick={handleStop}
                title="Pause / Stop"
                className="px-6 py-3 rounded-lg bg-[#d97706] hover:bg-[#f59e0b] active:bg-[#b45309] text-[#120f0e] font-bold border border-[#fbbf24] transition-transform active:scale-95 shadow-lg flex items-center gap-2"
              >
                <Square className="w-5 h-5 fill-current" />
                <span className="font-pixel text-sm uppercase">STOP</span>
              </button>
            ) : (
              <button
                onClick={() => handlePlay()}
                title="Play Mixtape"
                className="px-6 py-3 rounded-lg bg-[#16a34a] hover:bg-[#22c55e] active:bg-[#15803d] text-[#ffffff] font-bold border border-[#4ade80] transition-transform active:scale-95 shadow-lg flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span className="font-pixel text-sm uppercase">PLAY TAPE</span>
              </button>
            )}

            <button
              onClick={handleNext}
              title="Next Track"
              className="p-3 rounded-lg bg-[#271d16] hover:bg-[#3b2d23] active:bg-[#1f1610] text-[#d6c4b0] border border-[#543e2d] transition-transform active:scale-95 shadow"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-[#3d2b1f] hidden sm:block" />

            {/* Flip Side Button */}
            <button
              onClick={handleFlipSide}
              className="px-4 py-2.5 rounded-lg bg-[#302117] hover:bg-[#453224] text-[#e0cfba] text-xs font-pixel uppercase tracking-wider border border-[#5e4530] flex items-center gap-2 transition-transform active:scale-95"
            >
              <RefreshCw className="w-4 h-4 text-[#e5a93c]" />
              <span>Flip to Side {currentSide === 'A' ? 'B' : 'A'}</span>
            </button>

            {/* Natraj Pencil Rewind Mechanic */}
            <button
              onClick={handlePencilRewind}
              disabled={isPencilWinding}
              className="px-4 py-2.5 rounded-lg bg-[#7f1d1d] hover:bg-[#991b1b] active:bg-[#5f1414] text-[#fef2f2] text-xs font-mono uppercase tracking-wider border border-[#ef4444]/60 flex items-center gap-2 transition-transform active:scale-95 shadow"
              title="Fix loose tape with Natraj HB pencil"
            >
              <Pencil className={`w-4 h-4 ${isPencilWinding ? 'animate-spin text-yellow-300' : ''}`} />
              <span>Natraj Pencil Rewind</span>
            </button>
          </div>

          {/* Current Track Story / Memory Card */}
          <div className="p-3.5 rounded-lg bg-[#1a1411] border border-[#4a3627] text-xs text-[#c9b8a3] space-y-1">
            <div className="flex items-center justify-between text-[#e5a93c] font-pixel text-sm uppercase">
              <span>{currentTrack.tag}</span>
              <span>{currentTrack.artistOrSource}</span>
            </div>
            <p className="font-serif-vintage italic text-[#e6ded3] text-sm leading-relaxed">
              "{currentTrack.vibeDescription}"
            </p>
          </div>
        </div>

        {/* Track Playlist for Current Side */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#9c8976] font-pixel uppercase">
            <span>Side {currentSide} Tracklist</span>
            <span>Synthesized 90s Chimes</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {tracksForSide.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              return (
                <button
                  key={track.id}
                  onClick={() => {
                    handlePlay(track, idx);
                  }}
                  className={`p-3 rounded-lg border text-left transition-all flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-[#3b2719] border-[#d97706] text-[#fbf3e4] shadow-md'
                      : 'bg-[#18120e] border-[#38281d] text-[#b8a591] hover:bg-[#251b14] hover:text-[#f3e8d6]'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="font-pixel text-xs text-[#d97706] w-4">
                      {idx + 1}.
                    </span>
                    <div className="truncate">
                      <p className="font-medium text-xs truncate">{track.title}</p>
                      <p className="text-[10px] text-[#8e7a68] truncate">{track.artistOrSource}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isCurrent && isPlaying ? (
                      <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
                    ) : (
                      <span className="text-[11px] font-mono text-[#8a7561]">{track.duration}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
