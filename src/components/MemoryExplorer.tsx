import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Volume2,
  Tv,
  BookOpen,
  Camera,
  Disc,
  Folder,
  Compass,
  ArrowRight,
  Check,
  RotateCcw,
  Sparkle,
  Radio,
  ExternalLink,
  Layers
} from 'lucide-react';
import {
  MEMORY_EXPLORER_ITEMS,
  MemoryItem,
  MemoryViewerStyle,
  getMemorySlug
} from '../data/memoryExplorerData.ts';
import { NOSTALGIA_IMAGES } from '../assets/imagePaths.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import { Ticket, Music, Play } from 'lucide-react';
import { useMusic } from '../context/MusicContext.tsx';
import { NOSTALGIA_TRACKS } from '../data/musicData.ts';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Memories (सभी यादें)' },
  { id: 'vacation', label: '🏖️ Vacation & Monsoon' },
  { id: 'games', label: '🏏 Gully Games & Arcade' },
  { id: 'screen', label: '📺 Doordarshan & TV' },
  { id: 'tech', label: '💻 56k & Tech' },
  { id: 'daily', label: '🕯️ Daily Life & PCO' },
  { id: 'food', label: '🍧 Candies & Treats' },
  { id: 'travel', label: '🚂 Railways & Journeys' }
];

export interface MemoryExplorerProps {
  onOpenTicket?: (item: MemoryItem) => void;
}

export const MemoryExplorer: React.FC<MemoryExplorerProps> = ({ onOpenTicket }) => {
  const { playTrack } = useMusic();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedViewerStyle, setSelectedViewerStyle] = useState<string>('all');
  const [activeMemory, setActiveMemory] = useState<MemoryItem | null>(null);

  const [isFlippedPhoto, setIsFlippedPhoto] = useState<boolean>(false);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('aangan99_favorites');
      return saved ? JSON.parse(saved) : ['mem-summer-vacation', 'mem-cricket-mom-calls'];
    } catch {
      return ['mem-summer-vacation', 'mem-cricket-mom-calls'];
    }
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  const [shareToast, setShareToast] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aangan99_favorites', JSON.stringify(favoriteIds));
    } catch (e) {
      console.warn(e);
    }
  }, [favoriteIds]);

  // Handle open memory
  const handleOpenMemory = (item: MemoryItem) => {
    audioSynthesizer.playClick('heavy');
    setActiveMemory(item);
    setIsFlippedPhoto(false);
    setIsAudioPlaying(false);

    if (item.melodyKey) {
      audioSynthesizer.playNostalgicMelody(item.melodyKey);
      setIsAudioPlaying(true);
    } else if (item.audioEffect) {
      audioSynthesizer.playClick('switch');
    }
  };

  const handleCloseMemory = () => {
    audioSynthesizer.playClick('soft');
    setActiveMemory(null);
    setIsFlippedPhoto(false);
    audioSynthesizer.stopCurrentMelody();
    setIsAudioPlaying(false);
  };

  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioSynthesizer.playClick('switch');
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNavigateRelated = (targetId: string) => {
    const target = MEMORY_EXPLORER_ITEMS.find((m) => m.id === targetId);
    if (target) {
      handleOpenMemory(target);
    }
  };

  const handleNextMemory = () => {
    if (!activeMemory) return;
    const currentIndex = MEMORY_EXPLORER_ITEMS.findIndex((m) => m.id === activeMemory.id);
    const nextIndex = (currentIndex + 1) % MEMORY_EXPLORER_ITEMS.length;
    handleOpenMemory(MEMORY_EXPLORER_ITEMS[nextIndex]);
  };

  const handlePrevMemory = () => {
    if (!activeMemory) return;
    const currentIndex = MEMORY_EXPLORER_ITEMS.findIndex((m) => m.id === activeMemory.id);
    const prevIndex = (currentIndex - 1 + MEMORY_EXPLORER_ITEMS.length) % MEMORY_EXPLORER_ITEMS.length;
    handleOpenMemory(MEMORY_EXPLORER_ITEMS[prevIndex]);
  };

  const handleRevealSecret = (memoryId: string) => {
    audioSynthesizer.playClick('beep');
    setRevealedSecrets((prev) => ({ ...prev, [memoryId]: true }));
  };

  const handleShareMemory = (item: MemoryItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioSynthesizer.playClick('switch');

    if (onOpenTicket) {
      onOpenTicket(item);
      return;
    }

    const slug = getMemorySlug(item);
    const shareableUrl = `${window.location.origin}/memory/${slug}`;
    const shareText = `SUMMER VACATION.EXE\n\nMEMORY TICKET\n\nYEAR: ${item.year}\nDESTINATION: Childhood\nPASSENGER: Someone who remembers\nSEAT: Window\nMEMORY: ${item.title}\nSTATUS: "You were there."\n\nLink: ${shareableUrl}`;

    if (navigator.share) {
      navigator.share({
        title: `SUMMER VACATION.EXE: ${item.title}`,
        text: shareText,
        url: shareableUrl
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setShareToast(`Copied "${item.title}" Memory Ticket link! 📋`);
      setTimeout(() => setShareToast(null), 3200);
    }
  };


  // Filter memories
  const filteredMemories = MEMORY_EXPLORER_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStyle = selectedViewerStyle === 'all' || item.viewerStyle === selectedViewerStyle;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hindiTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFavorites = !showOnlyFavorites || favoriteIds.includes(item.id);

    return matchesCategory && matchesStyle && matchesSearch && matchesFavorites;
  });

  return (
    <section id="memory-explorer" className="w-full relative py-6">
      {/* Section Header */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#241a14] via-[#1a120e] to-[#120d0a] border-2 border-[#634832] p-6 sm:p-8 shadow-2xl mb-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#f59e0b]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10 border-b border-[#422e20] pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#362316] border border-[#785333] text-xs font-pixel text-[#f59e0b] uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>LAYER 07: CENTRAL NOSTALGIA ARCHIVE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif-vintage text-[#faecd8] tracking-tight">
              स्मृति मंजूषा • The Memory Explorer
            </h2>
            <p className="text-sm sm:text-base text-[#bfa993] font-handwriting mt-1 max-w-2xl">
              Every memory is an interactive tactile object. Open handwritten diaries, glossy photo prints, Walkman tapes, Windows 98 folders, and CRT televisions.
            </p>
          </div>

          {/* Quick Stats / Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioSynthesizer.playClick('switch');
                setShowOnlyFavorites(!showOnlyFavorites);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-pixel uppercase tracking-wide flex items-center gap-2 transition-all border ${
                showOnlyFavorites
                  ? 'bg-[#e11d48] text-white border-[#f43f5e] shadow-[0_0_12px_rgba(225,29,72,0.4)]'
                  : 'bg-[#2a1d17] text-[#d6c2ae] border-[#523825] hover:bg-[#3d291e]'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
              <span>Saved Favorites ({favoriteIds.length})</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="pt-5 space-y-4 relative z-10">
          {/* Search Input and Style Filter */}
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a7562]" />
              <input
                type="text"
                placeholder="Search memories (e.g., 'Summer', 'Cricket', 'PCO', 'Nokia', 'Doordarshan')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#140e0b] border border-[#4d3625] text-sm text-[#f5ebd8] placeholder-[#7d6855] focus:outline-none focus:border-[#d97706] font-mono shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a7562] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Viewer Style Filter Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full w-full sm:w-auto p-1 bg-[#140e0b] rounded-xl border border-[#4d3625]">
              <span className="text-[10px] font-pixel uppercase text-[#8a7562] px-2">Format:</span>
              {[
                { id: 'all', label: 'All Formats' },
                { id: 'diary', label: '📖 Diary' },
                { id: 'photograph', label: '📷 Photo' },
                { id: 'television', label: '📺 CRT TV' },
                { id: 'computer-folder', label: '📁 Win98' }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => {
                    audioSynthesizer.playClick('soft');
                    setSelectedViewerStyle(style.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors whitespace-nowrap ${
                    selectedViewerStyle === style.id
                      ? 'bg-[#d97706] text-white font-bold'
                      : 'text-[#a89582] hover:bg-[#281b14] hover:text-white'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
            {CATEGORY_TABS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  audioSynthesizer.playClick('soft');
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-[#b45309] text-white border-[#f59e0b] font-bold shadow'
                    : 'bg-[#1b130f] text-[#a89582] border-[#38261b] hover:bg-[#2e1f17] hover:text-[#faecd8]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Memory Grid / Artifacts Gallery */}
      {filteredMemories.length === 0 ? (
        <div className="text-center py-16 px-4 bg-[#1a120e] rounded-2xl border border-[#3d2a1d] text-[#a89582] space-y-3">
          <p className="text-2xl">📻</p>
          <p className="font-serif-vintage text-lg text-[#faecd8]">No memories found for this search filter.</p>
          <p className="text-xs font-handwriting text-[#c4b09c]">Try resetting your search query or selecting a different category.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedViewerStyle('all');
              setSearchQuery('');
              setShowOnlyFavorites(false);
            }}
            className="px-4 py-2 bg-[#b45309] text-white rounded-lg text-xs font-pixel uppercase"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMemories.map((item, index) => {
            const isFav = favoriteIds.includes(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => handleOpenMemory(item)}
                className="group relative rounded-2xl bg-[#1c1410] border-2 border-[#543b27] hover:border-[#e5a93c] transition-all p-5 flex flex-col justify-between shadow-xl cursor-pointer overflow-hidden select-none"
                style={{
                  boxShadow: '0 10px 25px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.05)'
                }}
              >
                {/* Visual Accent Glow */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-10 pointer-events-none transition-opacity group-hover:opacity-25"
                  style={{ backgroundColor: item.accentColor }}
                />

                {/* Top Badge Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xl">{item.visualEmoji}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-pixel uppercase bg-[#2e1f17] text-[#e5a93c] border border-[#523927]">
                        {item.year}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono text-[#8a7562] bg-[#140e0b] px-2 py-0.5 rounded border border-[#3b281b]">
                        {item.viewerStyle === 'diary' && '📖 Diary'}
                        {item.viewerStyle === 'photograph' && '📷 Photo'}
                        {item.viewerStyle === 'cassette' && '📼 Cassette'}
                        {item.viewerStyle === 'computer-folder' && '📁 Folder'}
                        {item.viewerStyle === 'television' && '📺 CRT TV'}
                      </span>

                      <button
                        onClick={(e) => handleShareMemory(item, e)}
                        className="p-2.5 sm:p-1.5 rounded-lg border bg-[#1c130d] border-[#4a3424] text-[#e5a93c] hover:bg-[#3d2719] hover:border-[#f59e0b] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95"
                        title="Generate Memory Ticket"
                      >
                        <Ticket className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => handleToggleFavorite(item.id, e)}
                        className={`p-2.5 sm:p-1.5 rounded-lg border transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-95 ${
                          isFav
                            ? 'bg-[#e11d48]/20 border-[#f43f5e] text-[#f43f5e]'
                            : 'bg-[#150f0c] border-[#38261b] text-[#6b5847] hover:text-[#f43f5e]'
                        }`}
                        title={isFav ? 'Remove Favorite' : 'Save Favorite'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>

                    </div>
                  </div>

                  {/* Title & Hindi Translation */}
                  <h3 className="text-lg font-bold font-serif-vintage text-[#faecd8] group-hover:text-[#f59e0b] transition-colors leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs font-handwriting text-[#c4b09c] mb-2.5">
                    {item.hindiTitle}
                  </p>

                  {/* Short emotional description */}
                  <p className="text-xs text-[#a89582] font-mono line-clamp-3 leading-relaxed mb-4">
                    "{item.emotionalDescription}"
                  </p>
                </div>

                {/* Bottom Meta & Related Connections Count */}
                <div className="pt-3 border-t border-[#38261b] flex items-center justify-between text-xs text-[#8a7562] font-mono">
                  <span className="truncate max-w-[170px] text-[11px] text-[#ba9f83]">
                    📍 {item.location}
                  </span>
                  <div className="flex items-center gap-1 text-[#e5a93c] text-[11px] font-pixel">
                    <span>OPEN</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* IMMERSIVE PHYSICAL MEMORY OVERLAY VIEWER */}
      <AnimatePresence>
        {activeMemory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
            {/* Modal Backdrop click */}
            <div className="fixed inset-0" onClick={handleCloseMemory} />

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl z-10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* VIEWER STYLE 1: VINTAGE DIARY / SLAM NOTEBOOK */}
              {activeMemory.viewerStyle === 'diary' && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#f7eed9] text-[#2c1d11] border-8 border-[#4d321d] shadow-2xl relative overflow-hidden font-serif-vintage">
                  {/* Leather binder strip & stitch marks on left */}
                  <div className="absolute left-0 top-0 bottom-0 w-6 bg-[#382313] border-r-2 border-[#24150a] flex flex-col justify-around items-center py-4">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#1b1008] border border-[#6b4728]" />
                    ))}
                  </div>

                  {/* Red margin line */}
                  <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-red-400/40 pointer-events-none" />

                  {/* Header Bar */}
                  <div className="pl-14 flex items-start justify-between border-b-2 border-[#d6c4a8] pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono text-[#8a6b4f] mb-1">
                        <span className="bg-[#ebd9bd] px-2 py-0.5 rounded font-pixel uppercase">
                          ENTRY #{activeMemory.year}
                        </span>
                        <span>•</span>
                        <span>📍 {activeMemory.location}</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#3d2412] tracking-tight">
                        {activeMemory.title}
                      </h2>
                      <p className="text-sm font-handwriting text-[#7a583d]">
                        {activeMemory.hindiTitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFavorite(activeMemory.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          favoriteIds.includes(activeMemory.id)
                            ? 'bg-rose-100 border-rose-400 text-rose-600'
                            : 'bg-[#eee2ca] border-[#c9b596] text-[#7a583d]'
                        }`}
                        title="Save to favorites"
                      >
                        <Heart className={`w-4 h-4 ${favoriteIds.includes(activeMemory.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleShareMemory(activeMemory)}
                        className="p-2 rounded-xl bg-[#eee2ca] border border-[#c9b596] text-[#7a583d] hover:bg-[#e2d2b5]"
                        title="Share memory"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCloseMemory}
                        className="p-2 rounded-xl bg-[#d4553b] hover:bg-[#bf432a] text-white"
                        title="Close diary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Diary Ruled Paper Content */}
                  <div className="pl-14 space-y-4 font-mono text-sm leading-relaxed text-[#422e1b]">
                    {/* Visual Stamp Card if image exists */}
                    {activeMemory.visualImage && (
                      <div className="float-right ml-4 mb-2 p-2 rounded-xl bg-white border-2 border-[#c2aa8a] shadow-md -rotate-2 max-w-[200px]">
                        <img
                          src={activeMemory.visualImage}
                          alt={activeMemory.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-28 object-cover rounded-lg"
                        />
                        <p className="text-[10px] text-center font-handwriting text-gray-600 mt-1">
                          Fig 1. {activeMemory.year} Archive
                        </p>
                      </div>
                    )}

                    <p className="text-base font-handwriting text-[#24150b] leading-relaxed bg-[#f3e7ce]/60 p-3 rounded-lg border border-[#e4d3b6]">
                      "{activeMemory.emotionalDescription}"
                    </p>

                    <p className="text-xs sm:text-sm text-[#4a3420] font-serif-vintage leading-relaxed">
                      {activeMemory.extendedStory}
                    </p>

                    {/* Hidden Detail Scratch Card */}
                    <div className="mt-4 pt-4 border-t border-[#d8c7ad]">
                      <div className="p-3.5 rounded-xl bg-[#ede0c8] border-2 border-dashed border-[#a68662]">
                        <div className="flex items-center justify-between text-xs font-pixel text-[#6e4e32] mb-1">
                          <span>🔍 SECRET NOSTALGIC EASTER EGG</span>
                          {revealedSecrets[activeMemory.id] && (
                            <span className="text-emerald-700 font-bold">REVEALED ✓</span>
                          )}
                        </div>
                        {revealedSecrets[activeMemory.id] ? (
                          <div className="text-xs font-mono text-[#2c1d11] space-y-1">
                            <p className="font-bold text-[#b45309]">
                              🎁 {activeMemory.hiddenDetail.secretItemName}
                            </p>
                            <p className="italic">{activeMemory.hiddenDetail.revealedText}</p>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRevealSecret(activeMemory.id)}
                            className="w-full py-2 bg-[#c2842e] hover:bg-[#b07424] text-white rounded-lg text-xs font-pixel uppercase tracking-wider shadow active:scale-98"
                          >
                            {activeMemory.hiddenDetail.prompt}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Related Memory Trail Connections */}
                    <div className="mt-4 pt-3 border-t border-[#d8c7ad]">
                      <span className="text-[11px] font-pixel uppercase text-[#7a583d] block mb-2">
                        Interconnected Nostalgia Paths (संबंधित यादें):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {activeMemory.relatedMemoryIds.map((relId) => {
                          const relItem = MEMORY_EXPLORER_ITEMS.find((m) => m.id === relId);
                          if (!relItem) return null;
                          return (
                            <button
                              key={relId}
                              onClick={() => handleNavigateRelated(relId)}
                              className="px-3 py-1 rounded-lg bg-[#ebd9bd] hover:bg-[#dec8a5] text-xs font-mono text-[#382313] border border-[#c4ab89] flex items-center gap-1.5 transition-transform active:scale-95"
                            >
                              <span>{relItem.visualEmoji}</span>
                              <span className="font-bold">{relItem.title}</span>
                              <span className="text-[10px] text-[#8a6b4f]">({relItem.year})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* THIS MEMORY SOUNDS LIKE... Music Connections */}
                    <div className="mt-4 pt-3 border-t border-[#d8c7ad]">
                      <span className="text-[11px] font-pixel uppercase text-[#b45309] flex items-center gap-1 mb-2">
                        <Music className="w-3.5 h-3.5 text-[#d97706]" />
                        <span>THIS MEMORY SOUNDS LIKE...</span>
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {NOSTALGIA_TRACKS.filter((t) => t.memoryIds.includes(activeMemory.id)).slice(0, 2).map((tr) => (
                          <div
                            key={tr.id}
                            onClick={() => {
                              audioSynthesizer.playClick('switch');
                              playTrack(tr, undefined, activeMemory.id);
                            }}
                            className="p-2 bg-[#f2e7d3] hover:bg-[#eae0c6] border border-[#d6bf9d] hover:border-[#f59e0b] rounded-lg cursor-pointer transition-all flex items-center justify-between group text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img src={tr.artwork} alt="" className="w-8 h-8 rounded object-cover flex-shrink-0" />
                              <div className="min-w-0">
                                <p className="font-bold text-[#382313] font-serif truncate group-hover:text-amber-800">{tr.title}</p>
                                <p className="text-[10px] text-[#735840] font-mono truncate">{tr.artist}</p>
                              </div>
                            </div>
                            <Play className="w-4 h-4 text-[#d97706] flex-shrink-0 ml-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEWER STYLE 2: POLAROID PHOTOGRAPH & BACKPRINT */}
              {activeMemory.viewerStyle === 'photograph' && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#1c1511] text-[#f5eedc] border-4 border-[#785333] shadow-2xl relative font-mono">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-[#473323] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#e5a93c]" />
                      <span className="font-pixel text-xs text-[#e5a93c] uppercase">
                        KODAK GOLD 100 PRINT • {activeMemory.year}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsFlippedPhoto(!isFlippedPhoto)}
                        className="px-3 py-1 rounded-lg bg-[#2e1f17] hover:bg-[#3d2a1f] border border-[#5c402d] text-xs font-mono text-[#e5a93c] flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isFlippedPhoto ? 'Front Photo' : 'Flip to Back'}</span>
                      </button>
                      <button
                        onClick={() => handleToggleFavorite(activeMemory.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          favoriteIds.includes(activeMemory.id)
                            ? 'bg-[#e11d48]/20 border-[#f43f5e] text-[#f43f5e]'
                            : 'bg-[#2b1f18] border-[#4d3625] text-[#a89582]'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favoriteIds.includes(activeMemory.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleShareMemory(activeMemory)}
                        className="p-2 rounded-xl bg-[#2b1f18] border border-[#4d3625] text-[#a89582] hover:text-white"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCloseMemory}
                        className="p-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {!isFlippedPhoto ? (
                    /* Front Photo View */
                    <div className="space-y-4">
                      <div className="p-4 bg-[#f8f5ee] rounded-2xl text-[#1f150e] shadow-xl">
                        <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black mb-3">
                          <img
                            src={activeMemory.visualImage || NOSTALGIA_IMAGES.childhoodItems}
                            alt={activeMemory.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover filter contrast-105 saturate-110"
                          />
                          <div className="absolute bottom-2 right-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] font-mono text-[#f59e0b]">
                            '9{activeMemory.year.toString().slice(2)} 05 24
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold font-serif-vintage text-[#2d1b0f]">
                              {activeMemory.title}
                            </h3>
                            <p className="text-xs text-gray-600 font-handwriting">
                              {activeMemory.location} • {activeMemory.hindiTitle}
                            </p>
                          </div>
                          <span className="text-2xl">{activeMemory.visualEmoji}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#d4c2af] leading-relaxed bg-[#281c15] p-3.5 rounded-xl border border-[#4a3424]">
                        "{activeMemory.emotionalDescription}"
                      </p>

                      <p className="text-xs text-[#a89582] leading-relaxed">
                        {activeMemory.extendedStory}
                      </p>

                      {/* Hidden detail trigger */}
                      <div className="p-3 bg-[#140e0b] rounded-xl border border-[#3b281b]">
                        {revealedSecrets[activeMemory.id] ? (
                          <div className="text-xs text-[#4ade80] space-y-0.5">
                            <span className="font-pixel text-[10px] text-[#f59e0b]">EASTER EGG: </span>
                            <span className="font-bold">{activeMemory.hiddenDetail.secretItemName} — </span>
                            <span>{activeMemory.hiddenDetail.revealedText}</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRevealSecret(activeMemory.id)}
                            className="w-full text-xs text-[#e5a93c] hover:underline font-mono text-left"
                          >
                            👉 {activeMemory.hiddenDetail.prompt}
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Back Photo Print View (Yellowed backing paper with handwritten notes) */
                    <div className="p-6 rounded-2xl bg-[#ede3cf] text-[#2c1d11] font-handwriting space-y-4 shadow-inner">
                      <div className="border-b-2 border-dashed border-[#b8a383] pb-3 flex items-center justify-between">
                        <span className="text-lg font-bold">Kodak Royal Paper Print</span>
                        <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-[#b8a383]">
                          LAB NO. 4410-B
                        </span>
                      </div>

                      <div className="text-base sm:text-lg leading-relaxed text-[#3b2718]">
                        <p className="mb-2">📍 {activeMemory.location}</p>
                        <p className="italic">
                          "{activeMemory.extendedStory}"
                        </p>
                        <p className="mt-4 text-sm font-mono text-[#785b40]">
                          Tagged with: {activeMemory.tags.join(', ')}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Related Memory Trail Connections */}
                  <div className="mt-4 pt-3 border-t border-[#473323]">
                    <span className="text-[10px] font-pixel uppercase text-[#a89582] block mb-1.5">
                      Explore Connected Nostalgia Trail:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeMemory.relatedMemoryIds.map((relId) => {
                        const relItem = MEMORY_EXPLORER_ITEMS.find((m) => m.id === relId);
                        if (!relItem) return null;
                        return (
                          <button
                            key={relId}
                            onClick={() => handleNavigateRelated(relId)}
                            className="px-2.5 py-1 rounded-lg bg-[#2b1f18] hover:bg-[#3d2b20] text-xs font-mono text-[#f5ebd8] border border-[#523927] flex items-center gap-1.5 transition-transform active:scale-95"
                          >
                            <span>{relItem.visualEmoji}</span>
                            <span>{relItem.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* VIEWER STYLE 3: WINDOWS 98 FILE EXPLORER / CRT FOLDER */}
              {activeMemory.viewerStyle === 'computer-folder' && (
                <div className="p-4 sm:p-6 rounded-2xl bg-[#008080] border-4 border-[#c0c0c0] shadow-2xl font-mono text-black">
                  {/* Classic Windows 98 Titlebar */}
                  <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] px-3 py-1.5 text-white font-bold text-xs flex items-center justify-between mb-3 rounded-xs shadow">
                    <div className="flex items-center gap-2">
                      <Folder className="w-3.5 h-3.5 text-[#ffff00]" />
                      <span>C:\MEMORIES\{activeMemory.id.toUpperCase()}.EXE</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleCloseMemory}
                        className="px-1.5 py-0.5 bg-[#c0c0c0] text-black font-bold text-xs border border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Explorer Window Content */}
                  <div className="bg-[#c0c0c0] p-4 rounded border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] space-y-4">
                    {/* Top Menu Bar */}
                    <div className="flex items-center gap-3 text-xs border-b border-[#808080] pb-1.5">
                      <span className="hover:underline cursor-pointer">File</span>
                      <span className="hover:underline cursor-pointer">Edit</span>
                      <span className="hover:underline cursor-pointer">View</span>
                      <span className="hover:underline cursor-pointer">Favorites</span>
                      <span className="hover:underline cursor-pointer">Help</span>
                    </div>

                    {/* Main Dialog Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 border border-inset border-[#808080] shadow-inner text-xs">
                      {/* Left side File icon & bitmap */}
                      <div className="sm:col-span-1 text-center space-y-2 border-r border-[#e0e0e0] pr-2">
                        <div className="text-4xl">{activeMemory.visualEmoji}</div>
                        <p className="font-bold text-sm">{activeMemory.title}</p>
                        <p className="text-[10px] text-gray-500 font-mono">
                          Year: {activeMemory.year} | Size: 1.44 MB
                        </p>
                        <div className="p-2 bg-[#f0f0f0] border border-[#ccc] text-[10px] text-left">
                          <p>Attributes: [R] [A] [ARCHIVE]</p>
                          <p>Location: {activeMemory.location}</p>
                        </div>
                      </div>

                      {/* Right side Text Description */}
                      <div className="sm:col-span-2 space-y-3">
                        <div className="p-2 bg-[#ffffcc] border border-[#d4d47d] text-xs font-mono">
                          "{activeMemory.emotionalDescription}"
                        </div>
                        <p className="text-xs leading-relaxed text-gray-800">
                          {activeMemory.extendedStory}
                        </p>

                        {/* Secret Easter Egg */}
                        <div className="p-2 bg-[#e6f2ff] border border-[#99ccff]">
                          <div className="font-bold text-[10px] text-[#0066cc] mb-1">
                            REGISTRY KEY EASTER EGG:
                          </div>
                          {revealedSecrets[activeMemory.id] ? (
                            <p className="text-[11px] text-[#008000] font-bold">
                              {activeMemory.hiddenDetail.secretItemName}: {activeMemory.hiddenDetail.revealedText}
                            </p>
                          ) : (
                            <button
                              onClick={() => handleRevealSecret(activeMemory.id)}
                              className="px-2 py-1 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black text-xs font-bold hover:bg-[#d0d0d0]"
                            >
                              Run EasterEgg.bat
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleFavorite(activeMemory.id)}
                          className="px-3 py-1 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black text-xs font-bold active:border-t-black active:border-l-black flex items-center gap-1"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>{favoriteIds.includes(activeMemory.id) ? 'Saved' : 'Save To Desk'}</span>
                        </button>
                        <button
                          onClick={() => handleShareMemory(activeMemory)}
                          className="px-3 py-1 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black text-xs font-bold active:border-t-black active:border-l-black flex items-center gap-1"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Copy Link</span>
                        </button>
                      </div>

                      <button
                        onClick={handleCloseMemory}
                        className="px-4 py-1 bg-[#c0c0c0] border border-t-white border-l-white border-r-black border-b-black text-xs font-bold active:border-t-black active:border-l-black"
                      >
                        OK / Close
                      </button>
                    </div>

                    {/* Related Paths */}
                    <div className="pt-2 border-t border-[#808080]">
                      <span className="text-[10px] font-bold text-gray-700 block mb-1">
                        Hyperlink Shortcuts:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeMemory.relatedMemoryIds.map((relId) => {
                          const relItem = MEMORY_EXPLORER_ITEMS.find((m) => m.id === relId);
                          if (!relItem) return null;
                          return (
                            <button
                              key={relId}
                              onClick={() => handleNavigateRelated(relId)}
                              className="px-2 py-0.5 bg-white border border-[#808080] text-xs text-blue-700 hover:underline flex items-center gap-1"
                            >
                              <span>{relItem.visualEmoji}</span>
                              <span>{relItem.title}.lnk</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEWER STYLE 4: CRT TELEVISION CABINET */}
              {activeMemory.viewerStyle === 'television' && (
                <div className="p-6 sm:p-8 rounded-3xl bg-[#2e1d13] text-[#faecd8] border-8 border-[#1f130b] shadow-2xl font-mono">
                  {/* CRT Top Header */}
                  <div className="flex items-center justify-between border-b border-[#473323] pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Tv className="w-4 h-4 text-[#fbbf24]" />
                      <span className="font-pixel text-xs text-[#fbbf24] uppercase">
                        DOORDARSHAN BROADCAST • CHANNEL 04
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleFavorite(activeMemory.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          favoriteIds.includes(activeMemory.id)
                            ? 'bg-[#e11d48]/20 border-[#f43f5e] text-[#f43f5e]'
                            : 'bg-[#1b120c] border-[#473323] text-[#a89582]'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favoriteIds.includes(activeMemory.id) ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleShareMemory(activeMemory)}
                        className="p-2 rounded-xl bg-[#1b120c] border border-[#473323] text-[#a89582] hover:text-white"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCloseMemory}
                        className="p-2 rounded-xl bg-[#dc2626] hover:bg-[#b91c1c] text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Curved CRT Screen Frame */}
                  <div className="relative aspect-[16/9] w-full rounded-2xl bg-[#0a0d0a] border-4 border-[#120c08] shadow-inner overflow-hidden p-4 flex flex-col justify-between mb-4">
                    {/* Phosphor glow & scanlines */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between text-[#4ade80] font-pixel text-xs">
                      <span>DD NATIONAL 1995</span>
                      <span>STEREO MONO</span>
                    </div>

                    <div className="relative z-10 text-center space-y-2 py-4">
                      <span className="text-4xl">{activeMemory.visualEmoji}</span>
                      <h3 className="text-2xl sm:text-3xl font-bold font-serif-vintage text-[#22c55e] drop-shadow-[0_0_8px_#22c55e]">
                        {activeMemory.title}
                      </h3>
                      <p className="text-sm font-handwriting text-[#86efac]">
                        {activeMemory.hindiTitle}
                      </p>
                    </div>

                    <div className="relative z-10 text-xs font-mono text-[#86efac]/80 truncate">
                      📍 {activeMemory.location} • Airing Time: Sunday Prime
                    </div>
                  </div>

                  {/* Content & Story */}
                  <div className="space-y-3">
                    <p className="text-sm text-[#f5ebd8] leading-relaxed bg-[#1b120c] p-3.5 rounded-xl border border-[#473323]">
                      "{activeMemory.emotionalDescription}"
                    </p>

                    <p className="text-xs text-[#a89582] leading-relaxed">
                      {activeMemory.extendedStory}
                    </p>

                    {/* Hidden Secret */}
                    <div className="p-3 bg-[#140e0b] rounded-xl border border-[#3b281b]">
                      {revealedSecrets[activeMemory.id] ? (
                        <div className="text-xs text-[#fbbf24] space-y-0.5">
                          <span className="font-pixel text-[10px] text-[#22c55e]">BROADCAST EASTER EGG: </span>
                          <span className="font-bold">{activeMemory.hiddenDetail.secretItemName} — </span>
                          <span>{activeMemory.hiddenDetail.revealedText}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRevealSecret(activeMemory.id)}
                          className="w-full text-xs text-[#fbbf24] hover:underline font-mono text-left"
                        >
                          📺 {activeMemory.hiddenDetail.prompt}
                        </button>
                      )}
                    </div>

                    {/* Related Paths */}
                    <div className="pt-3 border-t border-[#473323]">
                      <span className="text-[10px] font-pixel uppercase text-[#a89582] block mb-1.5">
                        Related Television & Screen Memories:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {activeMemory.relatedMemoryIds.map((relId) => {
                          const relItem = MEMORY_EXPLORER_ITEMS.find((m) => m.id === relId);
                          if (!relItem) return null;
                          return (
                            <button
                              key={relId}
                              onClick={() => handleNavigateRelated(relId)}
                              className="px-2.5 py-1 rounded-lg bg-[#1b120c] hover:bg-[#2b1f18] text-xs font-mono text-[#f5ebd8] border border-[#473323] flex items-center gap-1.5 transition-transform active:scale-95"
                            >
                              <span>{relItem.visualEmoji}</span>
                              <span>{relItem.title}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Nav Bar (Prev / Next memory) */}
              <div className="p-3 bg-[#170f0b] border-t border-[#4a3424] flex items-center justify-between text-xs font-pixel uppercase text-[#d6c2ae] rounded-b-3xl">
                <button
                  onClick={handlePrevMemory}
                  className="px-3 py-1.5 rounded-lg bg-[#2e1f17] hover:bg-[#3d2a1f] border border-[#543b27] flex items-center gap-1.5"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>PREVIOUS MEMORY</span>
                </button>

                <span className="text-[10px] text-[#8a7562]">
                  {MEMORY_EXPLORER_ITEMS.findIndex((m) => m.id === activeMemory.id) + 1} / {MEMORY_EXPLORER_ITEMS.length}
                </span>

                <button
                  onClick={handleNextMemory}
                  className="px-3 py-1.5 rounded-lg bg-[#2e1f17] hover:bg-[#3d2a1f] border border-[#543b27] flex items-center gap-1.5"
                >
                  <span>NEXT MEMORY</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Share Toast Notification */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#241710] border-2 border-[#b45309] text-[#faecd8] text-xs font-mono shadow-2xl flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-[#22c55e]" />
            <span>{shareToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
