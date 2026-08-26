const fs = require('fs');
const content = `import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, SkipBack, SkipForward, Volume2, Heart, ListMusic, Shuffle, Repeat, ExternalLink, Loader2, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext.tsx';
import { NOSTALGIA_TRACKS, NOSTALGIA_PLAYLISTS } from '../data/musicData.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import { useTrackVisual } from '../hooks/useTrackVisual.ts';

export const NostalgiaRadioModal: React.FC<{ isOpen: boolean; onClose: () => void; onOpenMemory: (slug: string) => void; }> = ({ isOpen, onClose, onOpenMemory }) => {
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
    toggleMute,
    isMuted,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    currentPlaylist,
    queue,
    playTrack
  } = useMusic();

  const [activeTab, setActiveTab] = useState<'queue' | 'playlists'>('queue');
  const { visualUrl } = useTrackVisual(currentTrack);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return \`\${mins}:\${secs < 10 ? '0' : ''}\${secs}\`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 lg:p-12"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-[#0E0E0D]/90 backdrop-blur-2xl" onClick={onClose} />
          
          <div className="relative w-full h-full max-w-[1400px] bg-[#121211] md:rounded-[32px] overflow-hidden border border-[#2a2a27] shadow-2xl flex flex-col md:flex-row">
            {/* Close Button */}
            <button 
              onClick={() => { audioSynthesizer.playClick('switch'); onClose(); }}
              className="absolute top-6 right-6 z-20 w-10 h-10 bg-[#1A1A17] rounded-full flex items-center justify-center hover:bg-[#252522] text-[#f7f1e5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Pane: Artwork & Controls */}
            <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#1c1c1a] to-[#121211]">
              <div className="film-grain-overlay opacity-30" />
              
              {/* Artwork */}
              <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl border border-[#2a2a27] mb-8 lg:mb-12 z-10 group">
                {visualUrl ? (
                  <img src={visualUrl} alt={currentTrack?.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-[#1A1A17] flex items-center justify-center"><Music className="w-24 h-24 text-[#2a2a27]" /></div>
                )}
                {isPlaying && (
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center mix-blend-overlay">
                    <div className="w-full h-full opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, transparent 20%, #000 120%)' }} />
                  </div>
                )}
              </div>

              {/* Track Info */}
              <div className="w-full max-w-md text-center mb-8 z-10">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#f7f1e5] mb-2 font-serif">{currentTrack?.title || 'No Track Selected'}</h2>
                <p className="text-[#a89582] text-lg">{currentTrack?.artist || 'Unknown Artist'}</p>
                {currentPlaylist && <p className="text-xs text-[#6b5847] uppercase tracking-widest mt-4">Playing from: {currentPlaylist.title}</p>}
              </div>

              {/* Progress & Controls */}
              <div className="w-full max-w-md z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-mono text-[#8a7663] w-10 text-right">{formatTime(currentTimeSeconds)}</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={playbackProgress}
                    onChange={(e) => seekTo(Number(e.target.value))}
                    className="flex-1 h-1.5 bg-[#2a2a27] accent-[#f59e0b] rounded-full cursor-pointer appearance-none outline-none"
                    style={{ background: \`linear-gradient(to right, #f59e0b \${playbackProgress}%, #2a2a27 \${playbackProgress}%)\` }}
                  />
                  <span className="text-xs font-mono text-[#8a7663] w-10">{formatTime(durationSeconds)}</span>
                </div>

                <div className="flex items-center justify-center gap-8">
                  <button onClick={toggleShuffle} className={\`text-[#8a7663] hover:text-[#f7f1e5] transition-colors \${isShuffle ? 'text-[#f59e0b]' : ''}\`}>
                    <Shuffle className="w-5 h-5" />
                  </button>
                  <button onClick={previousTrack} className="text-[#f7f1e5] hover:text-[#f59e0b] transition-colors active:scale-95">
                    <SkipBack className="w-8 h-8 fill-current" />
                  </button>
                  <button 
                    onClick={togglePlayPause} 
                    disabled={isLoading || isUnavailable || !currentTrack}
                    className="w-16 h-16 rounded-full bg-[#f7f1e5] text-[#0E0E0D] flex items-center justify-center hover:bg-[#f59e0b] transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                  </button>
                  <button onClick={nextTrack} className="text-[#f7f1e5] hover:text-[#f59e0b] transition-colors active:scale-95">
                    <SkipForward className="w-8 h-8 fill-current" />
                  </button>
                  <button onClick={toggleRepeat} className={\`text-[#8a7663] hover:text-[#f7f1e5] transition-colors \${repeatMode !== 'OFF' ? 'text-[#f59e0b]' : ''}\`}>
                    <Repeat className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Pane: Context (Queue/Playlists) */}
            <div className="w-full md:w-1/2 bg-[#161614] p-8 md:p-12 flex flex-col h-full border-l border-[#2a2a27]">
              
              <div className="flex gap-8 mb-8 border-b border-[#2a2a27]">
                <button 
                  onClick={() => setActiveTab('queue')}
                  className={\`pb-4 text-sm font-bold tracking-wider uppercase transition-colors relative \${activeTab === 'queue' ? 'text-[#f7f1e5]' : 'text-[#6b5847] hover:text-[#a89582]'}\`}
                >
                  Up Next
                  {activeTab === 'queue' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b]" />}
                </button>
                <button 
                  onClick={() => setActiveTab('playlists')}
                  className={\`pb-4 text-sm font-bold tracking-wider uppercase transition-colors relative \${activeTab === 'playlists' ? 'text-[#f7f1e5]' : 'text-[#6b5847] hover:text-[#a89582]'}\`}
                >
                  Playlists
                  {activeTab === 'playlists' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f59e0b]" />}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-hide pr-4 space-y-2">
                {activeTab === 'queue' && (
                  <>
                    {queue.length === 0 && <div className="text-[#6b5847] text-sm italic mt-8">Queue is empty.</div>}
                    {queue.map((track, idx) => (
                      <div 
                        key={\`\${track.id}-\${idx}\`}
                        className={\`flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A1A17] transition-colors cursor-pointer group \${currentTrack?.id === track.id ? 'bg-[#1A1A17] border border-[#2a2a27]' : 'border border-transparent'}\`}
                        onClick={() => playTrack(track, currentPlaylist || undefined)}
                      >
                        <div className="w-10 h-10 rounded overflow-hidden bg-[#2a2a27] shrink-0 relative">
                           {/* Simplified artwork placeholder */}
                           <div className="absolute inset-0 bg-[#2a2a27] flex items-center justify-center"><Music className="w-4 h-4 text-[#4a4a44]" /></div>
                           {currentTrack?.id === track.id && isPlaying && (
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                               <div className="w-2 h-2 rounded-full bg-[#f59e0b] animate-pulse" />
                             </div>
                           )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h5 className={\`text-sm font-bold truncate \${currentTrack?.id === track.id ? 'text-[#f59e0b]' : 'text-[#f7f1e5] group-hover:text-[#f59e0b]'}\`}>{track.title}</h5>
                          <p className="text-xs text-[#a89582] truncate">{track.artist}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {activeTab === 'playlists' && (
                  <>
                    {NOSTALGIA_PLAYLISTS.map((pl) => (
                      <div 
                        key={pl.id}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-[#1A1A17] transition-colors cursor-pointer group border border-transparent hover:border-[#2a2a27]"
                        onClick={() => {
                          const firstTrack = NOSTALGIA_TRACKS.find(t => t.id === pl.trackIds[0]);
                          if (firstTrack) playTrack(firstTrack, pl);
                        }}
                      >
                         <div className="w-16 h-16 rounded overflow-hidden shrink-0 relative">
                           <img src={pl.coverImage} alt={pl.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                         </div>
                         <div className="min-w-0 flex-1">
                            <h5 className="text-base font-bold text-[#f7f1e5] group-hover:text-[#f59e0b] transition-colors truncate">{pl.title}</h5>
                            <p className="text-xs text-[#8a7663]">{pl.trackIds.length} songs · {pl.era}</p>
                         </div>
                         <div className="w-8 h-8 rounded-full bg-[#252522] group-hover:bg-[#f59e0b] flex items-center justify-center transition-colors shadow-md">
                            <Play className="w-3.5 h-3.5 fill-[#f7f1e5] group-hover:fill-[#0E0E0D] text-[#f7f1e5] group-hover:text-[#0E0E0D] ml-0.5" />
                         </div>
                      </div>
                    ))}
                  </>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
`
fs.writeFileSync('src/components/NostalgiaRadioModal.tsx', content);
