import React, { useState, useRef } from 'react';
import { useMusic } from '../context/MusicContext.tsx';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Search, 
  Maximize2, 
  Loader2, 
  Volume2, 
  VolumeX, 
  Shuffle, 
  Repeat, 
  Heart, 
  ListMusic 
} from 'lucide-react';
import { useTrackVisual } from '../hooks/useTrackVisual.ts';

export const NostalgiaRadioPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    isLoading,
    isUnavailable,
    playbackProgress,
    currentTimeSeconds,
    durationSeconds,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekTo,
    setIsFullPlayerOpen,
    openSearchModal,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    favoriteTrackIds,
    toggleFavoriteTrack
  } = useMusic();

  const { visualUrl } = useTrackVisual(currentTrack);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [isHoveringProgress, setIsHoveringProgress] = useState(false);

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(100, (clickX / width) * 100));
    seekTo(percentage);
  };

  const isFavorite = favoriteTrackIds.includes(currentTrack.id);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#121211]/95 backdrop-blur-2xl border-t border-[#2a2a27] text-[#f7f1e5] px-4 py-3 shadow-2xl transition-all duration-300">
      <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Artwork, Title, Artist, & Favorite */}
        <div className="flex items-center gap-3 w-[28%] min-w-[200px]">
          <div 
            onClick={() => { audioSynthesizer.playClick('switch'); setIsFullPlayerOpen(true); }}
            className="relative w-14 h-14 rounded-lg overflow-hidden bg-[#1A1A17] shrink-0 border border-[#2a2a27] cursor-pointer group shadow-md"
          >
            {visualUrl ? (
              <img src={visualUrl} alt={currentTrack.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-[#1A1A17] flex items-center justify-center text-xs text-[#6b5847]">No Art</div>
            )}
            {isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center backdrop-blur-[2px]">
                <div className="flex items-end gap-0.5 h-3">
                  <div className="w-1 bg-[#f59e0b] animate-pulse h-full rounded-full" />
                  <div className="w-1 bg-[#f59e0b] animate-pulse h-2/3 rounded-full delay-75" />
                  <div className="w-1 bg-[#f59e0b] animate-pulse h-4/5 rounded-full delay-150" />
                </div>
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h4 
              onClick={() => { audioSynthesizer.playClick('switch'); setIsFullPlayerOpen(true); }}
              className="text-sm font-bold text-[#f7f1e5] truncate cursor-pointer hover:underline hover:text-[#f59e0b] transition-colors"
            >
              {currentTrack.title}
            </h4>
            <p className="text-xs text-[#a89582] truncate mt-0.5">{currentTrack.artist}</p>
          </div>
          <button 
            onClick={() => toggleFavoriteTrack(currentTrack.id)}
            className={`p-1.5 transition-colors rounded-full hover:bg-[#252522] ${isFavorite ? 'text-[#f59e0b]' : 'text-[#8a7663] hover:text-[#f7f1e5]'}`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Center: Playback Controls & Interactive Hover Seek Bar */}
        <div className="flex flex-col items-center max-w-[600px] w-full px-4">
          <div className="flex items-center gap-6 mb-2">
            <button 
              onClick={toggleShuffle} 
              className={`transition-colors text-[#8a7663] hover:text-[#f7f1e5] ${isShuffle ? 'text-[#f59e0b]' : ''}`}
              title="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button 
              onClick={() => previousTrack()} 
              className="text-[#a89582] hover:text-[#f7f1e5] transition-colors active:scale-95 p-1"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            <button 
              onClick={() => togglePlayPause()} 
              disabled={isLoading || isUnavailable}
              className="w-10 h-10 rounded-full bg-[#f7f1e5] hover:bg-[#fff] text-[#0E0E0D] flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#0E0E0D]" />
              ) : isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
            <button 
              onClick={() => nextTrack()} 
              className="text-[#a89582] hover:text-[#f7f1e5] transition-colors active:scale-95 p-1"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>
            <button 
              onClick={toggleRepeat} 
              className={`transition-colors text-[#8a7663] hover:text-[#f7f1e5] ${repeatMode !== 'OFF' ? 'text-[#f59e0b]' : ''}`}
              title={`Repeat: ${repeatMode}`}
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar with Hoverable Seek */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] font-mono text-[#8a7663] w-9 text-right select-none">
              {formatTime(currentTimeSeconds)}
            </span>
            <div 
              ref={progressBarRef}
              onClick={handleProgressBarClick}
              onMouseEnter={() => setIsHoveringProgress(true)}
              onMouseLeave={() => setIsHoveringProgress(false)}
              className="flex-1 relative group cursor-pointer py-2"
              title="Click to seek"
            >
              <div className="w-full h-1 bg-[#2a2a27] rounded-full overflow-hidden group-hover:h-1.5 transition-all duration-200">
                <div 
                  className="h-full bg-[#f7f1e5] group-hover:bg-[#f59e0b] transition-all relative"
                  style={{ width: `${playbackProgress}%` }}
                >
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-[#f7f1e5] rounded-full shadow-md transition-opacity duration-200 ${isHoveringProgress ? 'opacity-150 scale-125' : 'opacity-0'}`} />
                </div>
              </div>
            </div>
            <span className="text-[11px] font-mono text-[#8a7663] w-9 select-none">
              {formatTime(durationSeconds)}
            </span>
          </div>
        </div>

        {/* Right: Volume, Search, Queue, Expand */}
        <div className="flex items-center justify-end gap-3 w-[28%] min-w-[200px]">
          <button 
            onClick={() => openSearchModal()} 
            className="p-2 text-[#8a7663] hover:text-[#f7f1e5] transition-colors rounded-lg hover:bg-[#1A1A17]"
            title="Search Songs"
          >
            <Search className="w-4 h-4" />
          </button>
          
          {/* Volume Control */}
          <div className="hidden lg:flex items-center gap-2 group/vol">
            <button 
              onClick={toggleMute} 
              className="p-2 text-[#8a7663] hover:text-[#f7f1e5] transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-[#f59e0b]" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-1 bg-[#2a2a27] accent-[#f59e0b] rounded-full cursor-pointer appearance-none outline-none"
            />
          </div>

          <button 
            onClick={() => { audioSynthesizer.playClick('switch'); setIsFullPlayerOpen(true); }} 
            className="p-2 text-[#8a7663] hover:text-[#f7f1e5] transition-colors rounded-lg hover:bg-[#1A1A17]"
            title="Expand Full Player"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
