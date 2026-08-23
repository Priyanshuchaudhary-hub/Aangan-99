import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useSound } from '../../hooks/useSound.ts';
import { audioSynthesizer } from '../../utils/audioSynthesizer.ts';

interface WindowsErrorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appName?: string;
  errorMessage?: string;
}

export const WindowsErrorDialog: React.FC<WindowsErrorDialogProps> = ({
  isOpen,
  onClose,
  appName = 'EXPLORER.EXE',
  errorMessage = 'This program has performed an illegal nostalgic operation and will be preserved forever.'
}) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const { playClick, playChirp } = useSound();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="win-error-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-black border-b-black shadow-2xl rounded-xs overflow-hidden font-mono text-black text-xs"
      >
        {/* Title Bar */}
        <div className="bg-[#000080] text-white px-3 py-1 font-bold flex items-center justify-between select-none">
          <span id="win-error-title" className="truncate">
            {appName}
          </span>
          <button
            onClick={onClose}
            className="w-4 h-4 bg-[#c0c0c0] text-black font-bold flex items-center justify-center border border-t-white border-l-white border-r-black border-b-black hover:bg-rose-600 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Dialog Content */}
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-red-600 border-2 border-white flex items-center justify-center shrink-0 shadow">
              <span className="text-white font-bold text-xl">✕</span>
            </div>
            <div className="space-y-1.5 leading-relaxed">
              <p className="font-bold">{errorMessage}</p>
              <p className="text-gray-700 text-[11px]">
                If the problem persists, try blowing into the video game cartridge, adjusting the rooftop aluminum antenna, or rewinding your cassette with a Natraj 621 pencil.
              </p>
            </div>
          </div>

          {showDetails && (
            <div className="p-2 bg-white border border-t-black border-l-black border-r-white border-b-white text-[10px] space-y-1 font-mono text-gray-800">
              <p className="text-red-700 font-bold">{appName} caused an invalid page fault in module KERNEL32.DLL at 0177:bff7b999.</p>
              <p>Registers: EAX=19990822 CS=0177 EIP=bff7b999 EFLGS=00010246</p>
              <p>Stack dump: 00401999 8165d214 00000000 ffffee10 bff7b901</p>
              <p className="text-emerald-700 font-bold">Memory intact: 100% Childhood innocence preserved.</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#808080]">
            <button
              onClick={() => {
                playClick('switch');
                setShowDetails(!showDetails);
              }}
              className="px-3 py-1 bg-[#c0c0c0] hover:bg-[#d4d0c8] border border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black"
            >
              {showDetails ? 'Hide Details' : 'Details >>'}
            </button>
            <button
              onClick={() => {
                playClick('soft');
                onClose();
              }}
              className="px-4 py-1 bg-[#c0c0c0] hover:bg-[#d4d0c8] font-bold border-2 border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
