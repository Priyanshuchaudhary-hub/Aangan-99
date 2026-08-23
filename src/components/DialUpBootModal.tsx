import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

interface DialUpBootModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DialUpBootModal: React.FC<DialUpBootModalProps> = ({ isOpen, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [statusLog, setStatusLog] = useState<string>('Ready to initiate 56k dial-up sequence...');
  const [progress, setProgress] = useState<number>(0);

  const startDialUp = async () => {
    setIsConnecting(true);
    setProgress(15);
    audioSynthesizer.playClick('switch');

    await audioSynthesizer.playDialUpSequence((step) => {
      setStatusLog(step);
      setProgress((prev) => Math.min(prev + 20, 95));
    });

    setProgress(100);
    setStatusLog('Connected! 56,000 bps established. Entering Aangan 99...');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleSkip = () => {
    audioSynthesizer.playClick('soft');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-lg overflow-hidden border-2 rounded-lg shadow-2xl bg-[#1e1917] border-[#8c6d48] text-[#e6dfd5]"
        >
          {/* Windows 98 Style Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-r from-[#2c2017] to-[#423023] border-b border-[#8c6d48]">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[#e5a93c] animate-pulse" />
              <span className="text-xs tracking-wider uppercase font-pixel text-[#e5a93c]">
                VSNL Dial-Up Networking 1.0 (India 1999)
              </span>
            </div>
            <button
              onClick={handleSkip}
              className="text-xs px-2 py-0.5 bg-[#3a2c22] hover:bg-[#574334] border border-[#71553c] text-[#d6c7b2] rounded"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-5 font-typewriter">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-3 border rounded border-[#664e37] bg-[#2a201b]">
                <span className="text-3xl">📟</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#f3e8d6] font-serif-vintage">
                  Connecting to Indian Cyberspace...
                </h3>
                <p className="text-xs text-[#b8a692] mt-1 leading-relaxed">
                  Please keep the landline telephone receiver on hook. Ensure nobody picks up the phone in the other room.
                </p>
              </div>
            </div>

            {/* Terminal Box */}
            <div className="p-3.5 bg-[#0f0c0b] border border-[#523d2b] rounded font-pixel text-sm text-[#4ade80] space-y-1.5 min-h-[90px] shadow-inner">
              <div className="flex items-center gap-2 text-xs text-[#a3907c]">
                <span className="inline-block w-2 h-2 rounded-full bg-[#4ade80] animate-ping" />
                <span>COM1: 56,000 BPS MODEM</span>
              </div>
              <p className="leading-tight text-xs md:text-sm text-[#86efac]">
                &gt; {statusLog}
              </p>
              {isConnecting && (
                <div className="w-full bg-[#27211d] h-2 rounded-full overflow-hidden mt-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#e5a93c] to-[#4ade80]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between pt-2 border-t border-[#443325]">
              <button
                onClick={handleSkip}
                className="text-xs text-[#a89683] hover:text-[#f3e8d6] underline underline-offset-4 text-center sm:text-left py-1"
              >
                Skip dial-up sound & enter directly
              </button>

              <button
                onClick={startDialUp}
                disabled={isConnecting}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#c2842e] hover:bg-[#db9635] active:bg-[#a76f23] text-[#120f0e] font-bold text-xs uppercase tracking-wider rounded border border-[#e5a93c] shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              >
                {isConnecting ? (
                  <>
                    <Volume2 className="w-4 h-4 animate-bounce" />
                    <span>Modem Handshake...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Dial 172222 (56k Sound)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
