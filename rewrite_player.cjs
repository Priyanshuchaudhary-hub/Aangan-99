const fs = require('fs');

const content = `import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext.tsx';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import { Play, Pause, SkipForward, Search, ExternalLink, Loader2, Volume2, ListMusic, Maximize2, SkipBack } from 'lucide-react';
import { useTrackVisual } from '../hooks/useTrackVisual.ts';

export const NostalgiaRadioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    isUnavailable,
    playbackProgress,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setIsFullPlayerOpen,
    openSearchModal
  } = useMusic();

  const { visualUrl } = useTrackVisual(currentTrack);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-6 md:left-1/2 md:-translate-x-1/2 z-40 md:w-[600px] lg:w-[700px] px-2 md:px-0">
      <div className="bg-[#121211]/95 backdrop-blur-xl border border-[#2a2a27] md:rounded-2xl shadow-2xl p-3 flex items-center justify-between gap-4">
        
        {/* Left: Artwork & Info */}
        <div 
          onClick={() => { audioSynthesizer.playClick('switch'); setIsFullPlayerOpen(true); }}
          className="flex items-center gap-3 flex-1 cursor-pointer overflow-hidden group"
        >
          <div className="relative w-12 h-12 rounded-md overflow-hidden bg-[#1A1A17] shrink-0 border border-[#2a2a27]">
            {visualUrl ? (
              <img src={visualUrl} alt={currentTrack.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-[#1A1A17]" />
            )}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-bold text-[#f7f1e5] truncate group-hover:text-[#f59e0b] transition-colors">{currentTrack.title}</h4>
            <p className="text-xs text-[#a89582] truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Center: Controls & Progress */}
        <div className="flex flex-col items-center flex-1 max-w-[240px] hidden md:flex">
          <div className="flex items-center gap-4 mb-1.5">
            <button onClick={() => previousTrack()} className="text-[#a89582] hover:text-[#f7f1e5] transition-colors">
               <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button 
              onClick={() => togglePlayPause()} 
              disabled={isLoading || isUnavailable}
              className="w-8 h-8 rounded-full bg-[#f59e0b] hover:bg-[#fbbf24] text-[#0E0E0D] flex items-center justify-center transition-transform active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button onClick={() => nextTrack()} className="text-[#a89582] hover:text-[#f7f1e5] transition-colors">
               <SkipForward className="w-4 h-4 fill-current" />
            </button>
          </div>
          <div className="w-full h-1 bg-[#2a2a27] rounded-full overflow-hidden">
             <div className="h-full bg-[#f59e0b] transition-all duration-300" style={{ width: \`\${playbackProgress}%\` }} />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => openSearchModal()} className="p-2 text-[#a89582] hover:text-[#f7f1e5] transition-colors hidden sm:block">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 text-[#a89582] hover:text-[#f7f1e5] transition-colors hidden sm:block">
             <ListMusic className="w-4 h-4" />
          </button>
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => togglePlayPause()} disabled={isLoading || isUnavailable} className="p-2 text-[#f7f1e5]">
               {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-[#f59e0b]" /> : isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            </button>
          </div>
          <button 
             onClick={() => { audioSynthesizer.playClick('switch'); setIsFullPlayerOpen(true); }} 
             className="p-2 text-[#a89582] hover:text-[#f7f1e5] transition-colors"
          >
             <Maximize2 className="w-4 h-4" />
          </button>
        </div>
        
        {/* Mobile top progress bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#2a2a27] md:hidden">
           <div className="h-full bg-[#f59e0b] transition-all duration-300" style={{ width: \`\${playbackProgress}%\` }} />
        </div>
      </div>
    </div>
  );
};
`
fs.writeFileSync('src/components/NostalgiaRadioPlayer.tsx', content);
