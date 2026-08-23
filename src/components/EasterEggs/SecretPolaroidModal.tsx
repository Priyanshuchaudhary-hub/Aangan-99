import React from 'react';
import { X, Sparkles, Camera, Heart } from 'lucide-react';
import { useSound } from '../../hooks/useSound.ts';
import { NOSTALGIA_IMAGES } from '../../assets/imagePaths.ts';

interface SecretPolaroidModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecretPolaroidModal: React.FC<SecretPolaroidModalProps> = ({
  isOpen,
  onClose
}) => {
  const { playClick, playChirp } = useSound();

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="secret-polaroid-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={() => {
        playClick('soft');
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#faf5ec] text-[#2d1c13] rounded-xl p-6 shadow-2xl relative border-8 border-[#e7dac7] -rotate-1 font-serif select-none"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(180, 140, 100, 0.2)'
        }}
      >
        {/* Scotch Tape Decor on Top Corners */}
        <div className="scotch-tape w-24 h-6 -top-3 left-10 transform -rotate-6 z-10" />
        <div className="scotch-tape w-24 h-6 -top-3 right-10 transform rotate-6 z-10" />

        {/* Close Button */}
        <button
          onClick={() => {
            playClick('soft');
            onClose();
          }}
          className="absolute top-3 right-3 p-1 rounded-full bg-black/10 hover:bg-black/20 text-gray-700 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Photo Card Frame */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[#d8c5ad] pb-2 text-amber-900">
            <Camera className="w-5 h-5 text-[#b45309]" />
            <h3 id="secret-polaroid-title" className="font-bold text-lg font-serif-vintage tracking-wide">
              Kodak Gold 100 Secret Polaroid • June 1997
            </h3>
          </div>

          {/* Photograph Container */}
          <div className="relative rounded-md overflow-hidden border-4 border-white shadow-md bg-neutral-900 aspect-[4/3]">
            <img
              src={NOSTALGIA_IMAGES.room}
              alt="Secret family summer memory in the living room"
              className="w-full h-full object-cover filter sepia-[0.35] contrast-[1.1] brightness-[0.95]"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute bottom-2 right-3 px-2 py-0.5 bg-black/60 rounded text-[11px] font-mono text-amber-300 font-bold">
              ’97 6 14
            </div>
          </div>

          {/* Handwritten Story Note */}
          <div className="space-y-2 pt-1 font-handwriting text-base text-[#4a3424] leading-relaxed">
            <p>
              "Dadi was slicing raw mangoes on the kitchen veranda with a steel *sarota*. The cooler was humming its damp green khus aroma across the hallway, and everyone was waiting for the 4:00 PM tea with Britannia Marie biscuits."
            </p>
            <div className="flex items-center justify-between text-xs font-mono text-gray-500 pt-2 border-t border-[#e2d0ba]">
              <span>Found inside: Wooden study desk secret drawer</span>
              <span className="flex items-center gap-1 text-rose-700 font-bold">
                <Heart className="w-3.5 h-3.5 fill-current" /> Unforgettable
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playChirp();
              onClose();
            }}
            className="w-full py-2 bg-[#92400e] hover:bg-[#78350f] text-white font-pixel text-xs tracking-wider rounded-lg shadow uppercase transition-transform active:scale-95"
          >
            Tuck Photo Back Into Album
          </button>
        </div>
      </div>
    </div>
  );
};
