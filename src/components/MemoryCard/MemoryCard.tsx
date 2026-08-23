import React from 'react';
import { Memory } from '../../types.ts';
import { Sparkles, Compass, MapPin, Tag, Volume2 } from 'lucide-react';
import { useSound } from '../../hooks/useSound.ts';

interface MemoryCardProps {
  memory: Memory;
  onSelect?: (memory: Memory) => void;
  onPlayAudio?: (audioKey: string) => void;
  className?: string;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({
  memory,
  onSelect,
  onPlayAudio,
  className = ''
}) => {
  const { playClick } = useSound();

  const handleCardClick = () => {
    playClick('soft');
    onSelect?.(memory);
  };

  const handleAudioTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClick('mechanical');
    if (memory.audio && onPlayAudio) {
      onPlayAudio(memory.audio);
    }
  };

  return (
    <article
      id={`memory-card-${memory.id}`}
      tabIndex={0}
      role="button"
      aria-label={`Memory: ${memory.title}, Year ${memory.year}`}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={`group relative bg-[#fbf8f0] text-[#241a15] rounded-xl p-5 border border-[#d6c9b3] shadow-md hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-[#d97706] focus-visible:outline-none cursor-pointer overflow-hidden ${className}`}
    >
      {/* Tape decoration on corner */}
      <div 
        className="scotch-tape w-20 top-2 -right-3 rotate-12 opacity-80" 
        aria-hidden="true" 
      />

      {/* Header: Category Badge & Era Year */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm"
          style={{ backgroundColor: memory.color }}
        >
          {memory.category}
        </span>
        <span className="font-pixel text-lg font-bold text-[#78350f] bg-[#fef3c7] px-2 py-0.5 rounded border border-[#fde68a]">
          {memory.year}
        </span>
      </div>

      {/* Image Thumbnail (Lazy Loaded with alt text & aspect ratio) */}
      {memory.image && (
        <div className="relative mb-3.5 rounded-lg overflow-hidden border border-[#e2d5c0] bg-[#1a1412] aspect-[4/3]">
          <img
            src={memory.image}
            alt={memory.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
          
          {memory.hindiTitle && (
            <span className="absolute bottom-2 left-2 right-2 text-xs font-handwriting text-[#fef3c7] drop-shadow-md truncate">
              {memory.hindiTitle}
            </span>
          )}
        </div>
      )}

      {/* Title & Description */}
      <h3 className="text-base font-bold text-[#1f1612] leading-snug mb-1.5 font-serif group-hover:text-[#991b1b] transition-colors">
        {memory.title}
      </h3>

      <p className="text-xs text-[#57453b] leading-relaxed line-clamp-3 mb-3">
        {memory.description}
      </p>

      {/* Location / Sensory Note */}
      {memory.location && (
        <div className="flex items-start gap-1.5 text-[11px] text-[#785f52] mb-3 bg-[#f3ede0] p-2 rounded border border-[#e5dcce]">
          <MapPin className="w-3.5 h-3.5 text-[#b45309] shrink-0 mt-0.5" aria-hidden="true" />
          <span className="line-clamp-1 italic">{memory.location}</span>
        </div>
      )}

      {/* Footer: Tags & Audio trigger */}
      <div className="flex items-center justify-between pt-2 border-t border-[#ebdccb] mt-auto">
        <div className="flex items-center gap-1 flex-wrap">
          {memory.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] bg-[#ece2d0] text-[#6b5344] px-1.5 py-0.5 rounded font-mono"
            >
              #{tag}
            </span>
          ))}
        </div>

        {memory.audio && (
          <button
            type="button"
            onClick={handleAudioTrigger}
            aria-label={`Play sensory audio for ${memory.title}`}
            className="p-1.5 rounded-full bg-[#fde68a] hover:bg-[#fcd34d] text-[#78350f] transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-[#b45309]"
            title="Listen to sensory echo"
          >
            <Volume2 className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </article>
  );
};
