import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Sparkles, Volume2, FastForward, Play } from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

interface CinematicBootSequenceProps {
  onComplete: () => void;
  targetYear?: number;
  forceFullSequence?: boolean;
}

interface BootLine {
  id: string;
  text: string;
  delayMs: number;
  highlight?: boolean;
  status?: string;
}

export const CinematicBootSequence: React.FC<CinematicBootSequenceProps> = ({
  onComplete,
  targetYear = 2004,
  forceFullSequence = false
}) => {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [isExpanding, setIsExpanding] = useState<boolean>(false);
  const [hasPreviousVisit, setHasPreviousVisit] = useState<boolean>(false);
  const completedRef = useRef<boolean>(false);

  const BOOT_SCRIPT: BootLine[] = [
    { id: '1', text: 'INITIALIZING MEMORY ARCHIVE...', delayMs: 250, status: 'OK' },
    { id: '2', text: 'Searching analog archive & photo negatives...', delayMs: 650, status: 'OK' },
    { id: '3', text: 'Rewinding cassette tape with Natraj HB pencil...', delayMs: 1100, status: 'OK' },
    { id: '4', text: 'Tuning Onida 21" CRT television...', delayMs: 1550, status: 'OK' },
    { id: '5', text: 'Checking summer afternoon temperature... 43°C (Loo wind active)', delayMs: 2000, status: 'OK' },
    { id: '6', text: 'Loading dial-up modem handshake & Rasna jug...', delayMs: 2450, status: 'OK' },
    { id: '7', text: `MEMORY FOUND: >> ERA ${targetYear} <<`, delayMs: 2900, highlight: true }
  ];

  useEffect(() => {
    const seen = localStorage.getItem('nostalgia_has_seen_boot') === 'true';
    setHasPreviousVisit(seen && !forceFullSequence);

    // Initial audio cues
    try {
      audioSynthesizer.playBootPOSTBeep();
      setTimeout(() => {
        audioSynthesizer.playCRTTurnOn();
      }, 300);
    } catch {
      // Audio context might require initial interaction
    }

    const timeouts: NodeJS.Timeout[] = [];
    const speedMultiplier = seen && !forceFullSequence ? 0.45 : 1.0;

    BOOT_SCRIPT.forEach((item, index) => {
      const delay = item.delayMs * speedMultiplier;
      const t = setTimeout(() => {
        setLines(prev => [...prev, item.text]);
        setProgress(Math.round(((index + 1) / BOOT_SCRIPT.length) * 100));
        try {
          audioSynthesizer.playTypewriterTick();
        } catch {
          // ignore
        }
      }, delay);
      timeouts.push(t);
    });

    const totalDuration = (3200 * speedMultiplier);
    const finishTimeout = setTimeout(() => {
      handleFinalTransition();
    }, totalDuration);
    timeouts.push(finishTimeout);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      timeouts.forEach(t => clearTimeout(t));
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [targetYear, forceFullSequence]);

  const handleFinalTransition = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    localStorage.setItem('nostalgia_has_seen_boot', 'true');
    setIsDone(true);
    setIsExpanding(true);

    try {
      audioSynthesizer.playBootComputerComplete();
    } catch {
      // ignore
    }

    setTimeout(() => {
      onComplete();
    }, 700);
  };

  const skipIntro = () => {
    handleFinalTransition();
  };

  return (
    <div
      onClick={skipIntro}
      className={`fixed inset-0 z-50 bg-[#050403] text-[#e0cfba] select-none flex flex-col items-center justify-center p-6 cursor-pointer overflow-hidden transition-all duration-700 ${
        isExpanding ? 'scale-105 opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* CRT Scanlines and Ambient Static */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.6)_50%)] [background-size:100%_4px] pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-10" />

      {/* Subtle CRT Flicker Tube Effect */}
      <div className="absolute inset-0 bg-[#34d399]/[0.02] mix-blend-screen pointer-events-none animate-pulse" />

      {/* Terminal Content Screen */}
      <div className="relative z-20 max-w-2xl w-full font-mono text-xs sm:text-sm space-y-4">
        {/* BIOS & Memory Header */}
        <div className="flex items-center justify-between border-b border-[#2d2218] pb-3 text-[11px] text-[#8e7a68] font-pixel">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            <span>SUMMER_VACATION_OS V4.0</span>
          </div>
          <div>SUMMER 1990–2005 (C) MEMORY CORP</div>
        </div>

        {/* Dynamic Log Lines with Typewriter Appearance */}
        <div className="min-h-[220px] space-y-2.5 py-3">
          {lines.map((line, idx) => {
            const isLatest = idx === lines.length - 1;
            const isHighlight = line.includes('MEMORY FOUND');
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                className={`flex items-start gap-2.5 leading-relaxed ${
                  isHighlight
                    ? 'text-[#f59e0b] font-bold text-base sm:text-lg font-dotmatrix pt-2'
                    : 'text-[#d6c4a8]'
                }`}
              >
                <span className="text-[#a8824b] opacity-80 flex-shrink-0">&gt;</span>
                <span className="tracking-wide">{line}</span>
                {isLatest && !isDone && (
                  <span className="inline-block w-2 h-4 bg-[#f59e0b] animate-pulse ml-1" />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Loading Progress Bar & Indicator */}
        <div className="space-y-1.5 pt-4 border-t border-[#2d2218]">
          <div className="flex items-center justify-between text-[11px] font-pixel text-[#9e8874]">
            <span>LOADING NOSTALGIA CACHE</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-[#17110c] h-3.5 rounded border border-[#3e2b1d] p-0.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#d97706] to-[#f59e0b] transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip & Keyboard Instructions */}
        <div className="flex items-center justify-between pt-2 text-[10px] text-[#6b5847] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-[#1a120c] border border-[#38261b] rounded text-[#b39e88]">ESC</span>
            <span>or click anywhere to skip</span>
          </div>
          {hasPreviousVisit && (
            <span className="text-[#a8927b] italic font-handwriting text-xs">
              Fast boot active (return visitor)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
