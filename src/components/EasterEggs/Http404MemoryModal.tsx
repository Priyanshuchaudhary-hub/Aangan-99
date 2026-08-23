import React, { useState } from 'react';
import { Globe, X, RefreshCw, ArrowLeft, ArrowRight, Home as HomeIcon, Sparkles } from 'lucide-react';
import { useSound } from '../../hooks/useSound.ts';
import { audioSynthesizer } from '../../utils/audioSynthesizer.ts';

interface Http404MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onYearChange?: (year: number) => void;
}

export const Http404MemoryModal: React.FC<Http404MemoryModalProps> = ({
  isOpen,
  onClose,
  onYearChange
}) => {
  const [isCachedFound, setIsCachedFound] = useState<boolean>(false);
  const { playClick, playChirp } = useSound();

  if (!isOpen) return null;

  const handlePingGateway = () => {
    playChirp();
    audioSynthesizer.playNostalgicMelody('malgudi');
    setIsCachedFound(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="http-404-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-black border-b-black shadow-2xl rounded-xs overflow-hidden flex flex-col font-mono text-black text-xs"
      >
        {/* Netscape Title Bar */}
        <div className="bg-[#000080] text-white px-3 py-1.5 font-bold flex items-center justify-between select-none">
          <div className="flex items-center gap-2 truncate">
            <Globe className="w-4 h-4 text-cyan-300" />
            <span id="http-404-title" className="font-pixel text-xs tracking-wide">
              Microsoft Internet Explorer 4.0 - [HTTP 404 Not Found]
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-4 h-4 bg-[#c0c0c0] text-black font-bold flex items-center justify-center border border-t-white border-l-white border-r-black border-b-black hover:bg-rose-600 hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Browser Navigation Toolbar */}
        <div className="bg-[#c0c0c0] p-1.5 border-b border-[#808080] flex items-center gap-2 select-none">
          <div className="flex items-center gap-1">
            <button className="p-1 border border-t-white border-l-white border-r-black border-b-black bg-[#d4d0c8]">
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 border border-t-white border-l-white border-r-black border-b-black bg-[#d4d0c8]">
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button onClick={handlePingGateway} className="p-1 border border-t-white border-l-white border-r-black border-b-black bg-[#d4d0c8]">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button onClick={onClose} className="p-1 border border-t-white border-l-white border-r-black border-b-black bg-[#d4d0c8]">
              <HomeIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Address Bar */}
          <div className="flex-1 flex items-center bg-white px-2 py-0.5 border border-t-black border-l-black border-r-white border-b-white text-[11px]">
            <span className="text-gray-500 mr-1 select-none">Address:</span>
            <span className="text-blue-900 font-bold truncate">http://www.childhood.1999/innocence.html</span>
          </div>
        </div>

        {/* Web Page Body */}
        <div className="p-6 bg-white flex-1 overflow-y-auto space-y-4 font-sans text-gray-800">
          <div className="flex items-start gap-4">
            <div className="text-4xl select-none">🌐</div>
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-red-700 font-serif">
                HTTP 404: The Era You Are Looking For Cannot Be Found
              </h2>
              <p className="text-xs text-gray-500 font-mono">
                Error Code: ERR_TIME_MOVED_FORWARD_TOO_FAST
              </p>
            </div>
          </div>

          <div className="border-t border-b border-gray-300 py-3 space-y-2 text-xs leading-relaxed">
            <p>
              The requested resource <strong>/childhood/1999/unhurried_afternoons.html</strong> has expired on the global web server.
              However, the following local hardware caches were recovered:
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700 font-serif pl-2">
              <li>1x Rain-soaked newspaper boat floating in veranda water</li>
              <li>1x Chelpark Royal Blue ink stain on right thumb</li>
              <li>1x Sunday morning 9:00 AM Mowgli song echoing through open windows</li>
              <li>1x Cold steel plate of hot poha while watching Doordarshan</li>
            </ul>
          </div>

          {isCachedFound ? (
            <div className="p-3 bg-amber-50 border border-amber-300 rounded text-amber-900 text-xs space-y-1 font-serif">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                <span>Memory Cache Restored:</span>
              </div>
              <p>
                "You cannot buy another Sunday in 1999 with all the money in the world, but you can close your eyes and still hear the three cooker whistles."
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handlePingGateway}
                className="px-3 py-1.5 bg-[#d4d0c8] hover:bg-[#c0c0c0] font-bold text-xs border-2 border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black"
              >
                Ping 1999 Gateway & Search Local Heart Cache
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-[#d4d0c8] hover:bg-[#c0c0c0] text-xs border border-t-white border-l-white border-r-black border-b-black"
              >
                Return to Aangan
              </button>
            </div>
          )}
        </div>

        {/* Browser Status Bar */}
        <div className="bg-[#c0c0c0] px-3 py-1 border-t border-[#808080] flex items-center justify-between text-[11px] text-gray-700 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-600" />
            <span>Connection: 56.0 Kbps (VSNL Gateway)</span>
          </div>
          <span>Zone: Internet (Dial-Up)</span>
        </div>
      </div>
    </div>
  );
};
