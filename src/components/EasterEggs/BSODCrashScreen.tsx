import React, { useEffect } from 'react';
import { audioSynthesizer } from '../../utils/audioSynthesizer.ts';

interface BSODCrashScreenProps {
  isOpen: boolean;
  onDismiss: () => void;
}

export const BSODCrashScreen: React.FC<BSODCrashScreenProps> = ({
  isOpen,
  onDismiss
}) => {
  useEffect(() => {
    if (!isOpen) return;

    // Play low static / CRT whine
    audioSynthesizer.playErrorBuzzer();

    const handleKeyDown = () => {
      handleReboot();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReboot = () => {
    audioSynthesizer.playCRTTurnOn();
    onDismiss();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={handleReboot}
      className="fixed inset-0 z-50 bg-[#0000aa] text-white font-mono p-6 sm:p-12 flex flex-col justify-center items-center cursor-pointer select-none overflow-hidden"
      style={{ fontFamily: '"Lucida Console", "Courier New", monospace' }}
    >
      <div className="max-w-2xl w-full space-y-6 text-sm sm:text-base leading-relaxed">
        {/* Title Box */}
        <div className="bg-[#aaaaaa] text-[#0000aa] px-4 py-1 text-center font-bold tracking-wider inline-block mx-auto w-full">
          AANGAN 99 OS / WINDOWS
        </div>

        <p>
          A fatal exception <span className="font-bold">0E</span> has occurred at{' '}
          <span className="font-bold text-yellow-300">0028:C0011E36</span> in VXD VMM(01) + 00010E36.
          The current nostalgia buffer was overwhelmed by too many summer memories.
        </p>

        <ul className="list-disc list-inside space-y-2 text-gray-200">
          <li>Press any key or click anywhere to degauss the CRT and reboot.</li>
          <li>Press <span className="text-yellow-300 font-bold">CTRL+ALT+DEL</span> again to restart your computer. You will lose any unsaved paper boats or homework drawings.</li>
          <li>Verify that your 56k dial-up cord is securely plugged into the BSNL wall socket.</li>
        </ul>

        <div className="pt-4 border-t border-white/30 space-y-1 text-xs text-gray-300">
          <p>Technical Information:</p>
          <p className="text-yellow-200">*** STOP: 0x0000001E (0xC0000005, 0xFDE38AF9, 0x00000001, 0x00000000)</p>
          <p className="text-yellow-200">*** AANGAN_MEMORY_OVERFLOW.SYS - Address FDE38AF9 base at FDE30000, DateStamp 389b0a12</p>
        </div>

        <div className="pt-6 text-center animate-pulse text-yellow-300 font-bold text-sm">
          [ Click anywhere or press Any Key to Degauss CRT & Resume ]
        </div>
      </div>
    </div>
  );
};
