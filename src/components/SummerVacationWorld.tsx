import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Monitor,
  Folder,
  FileCode,
  Sparkles,
  Search,
  Volume2,
  Tv,
  Phone,
  Music,
  CloudRain,
  BookOpen,
  Coffee,
  X,
  ExternalLink,
  ChevronRight,
  Compass,
  ArrowRight,
  Disc,
  Play,
  RotateCw,
  Sliders,
  Flame,
  Clock
} from 'lucide-react';
import { SUMMER_WORLD_ITEMS, WorldInteractiveObject, WorldItemCategory } from '../data/summerWorldData.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

interface SummerVacationWorldProps {
  onTriggerDialUp?: () => void;
  onOpenAmbientMixer?: () => void;
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
  onCollectRelic?: () => void;
  onOpenTicket?: (mem: any) => void;
}

export const SummerVacationWorld: React.FC<SummerVacationWorldProps> = ({
  onTriggerDialUp,
  onOpenAmbientMixer,
  selectedYear = 1999,
  onSelectYear,
  onCollectRelic,
  onOpenTicket
}) => {
  const [activeCategory, setActiveCategory] = useState<WorldItemCategory | 'all'>('all');
  const [activeEra, setActiveEra] = useState<number | 'all'>('all');
  const [selectedObject, setSelectedObject] = useState<WorldInteractiveObject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDesktopMinimized, setIsDesktopMinimized] = useState(false);
  const [discoveredCount, setDiscoveredCount] = useState<string[]>([
    'obj-dialup',
    'obj-doordarshan',
    'obj-cassette-pencil',
    'obj-nokia-3310'
  ]);

  const categories: { id: WorldItemCategory | 'all'; label: string; hindi: string; icon: string }[] = [
    { id: 'all', label: 'All Artifacts', hindi: 'सभी यादें', icon: '✨' },
    { id: 'desktop', label: '2000s Desktop & Phones', hindi: 'कंप्यूटर, नोकिया व मॉडेम', icon: '💾' },
    { id: 'school', label: 'School & Notebooks', hindi: 'स्कूल और होमवर्क', icon: '📝' },
    { id: 'summer', label: 'Summer Afternoons', hindi: 'दोपहर और रसना', icon: '🍹' },
    { id: 'tv-cartoons', label: 'TV & Doordarshan', hindi: 'दूरदर्शन और टीवी', icon: '📺' },
    { id: 'music-tapes', label: 'Cassettes & Radio', hindi: 'कैसेट और आवाज़ें', icon: '📼' },
    { id: 'cricket-games', label: 'Cricket & Games', hindi: 'गली क्रिकेट और खेल', icon: '🏏' },
    { id: 'travel-trips', label: 'Train & Bus Journeys', hindi: 'रेल यात्रा और नानी घर', icon: '🚂' },
    { id: 'shops-snacks', label: 'Kirana & 1₹ Candies', hindi: 'किराना और टॉफी', icon: '🍬' },
    { id: 'telephone', label: 'Rotary Telephones', hindi: 'लैंडलाइन फोन', icon: '☎️' },
    { id: 'evening-terrace', label: 'Terrace & Power Cuts', hindi: 'छत, तारे और बिजली गुल', icon: '🌙' }
  ];

  const eras: { year: number | 'all'; label: string; badge: string }[] = [
    { year: 'all', label: 'All Decades', badge: '1990–2005' },
    { year: 1995, label: '1995 DD Era', badge: 'Peacock DD1' },
    { year: 1998, label: '1998 Sharjah', badge: 'Desert Storm' },
    { year: 1999, label: '1999 Dial-up', badge: 'VSNL 56k' },
    { year: 2004, label: '2004 Cyber Cafe', badge: 'Nokia & Tazos' },
    { year: 2005, label: '2005 Farewell', badge: 'Slam Book' }
  ];

  const filteredItems = SUMMER_WORLD_ITEMS.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesEra = activeEra === 'all' || item.year === activeEra;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.hindiName.includes(searchQuery) ||
      item.previewSnippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationPrompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesEra && matchesSearch;
  });

  const handleObjectClick = (obj: WorldInteractiveObject) => {
    audioSynthesizer.playClick('switch');
    if (!discoveredCount.includes(obj.id)) {
      setDiscoveredCount(prev => [...prev, obj.id]);
    }

    // Execute direct interactive behaviors
    if (obj.interactiveType === 'audio') {
      if (obj.audioEffect === 'dialup') {
        onTriggerDialUp();
      } else if (obj.audioEffect === 'pencil') {
        audioSynthesizer.playPencilWind();
      } else if (obj.audioEffect === 'bell') {
        audioSynthesizer.playPhoneDialTone(Math.floor(Math.random() * 9) + 1);
      } else if (obj.audioKey) {
        audioSynthesizer.playNostalgicMelody(obj.audioKey);
      } else {
        audioSynthesizer.playClick('heavy');
      }
    } else if (obj.interactiveType === 'jump' && obj.targetAnchor) {
      const el = document.querySelector(obj.targetAnchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }

    setSelectedObject(obj);
  };

  const handleModalAction = (obj: WorldInteractiveObject) => {
    if (obj.interactiveType === 'audio') {
      if (obj.audioEffect === 'dialup') {
        onTriggerDialUp();
      } else if (obj.audioEffect === 'pencil') {
        audioSynthesizer.playPencilWind();
      } else if (obj.audioEffect === 'bell') {
        audioSynthesizer.playPhoneDialTone(5);
      } else if (obj.audioKey) {
        audioSynthesizer.playNostalgicMelody(obj.audioKey);
      }
    } else if (obj.targetAnchor) {
      setSelectedObject(null);
      const el = document.querySelector(obj.targetAnchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="summer-vacation-world" className="relative w-full py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* World Header Envelope Banner */}
        <div className="relative p-6 md:p-8 rounded-2xl bg-[#1c1512] border-2 border-[#543d2c] shadow-[0_12px_32px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Scotch tape decor */}
          <div className="scotch-tape -top-3 left-12 w-28 rotate-[-3deg]" />
          <div className="scotch-tape -top-3 right-16 w-24 rotate-[4deg]" />

          {/* Background grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#3a291f_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded bg-[#b45309] text-[#fff] text-[11px] font-pixel uppercase tracking-widest flex items-center gap-1.5 shadow">
                  <Monitor className="w-3.5 h-3.5" />
                  SUMMER VACATION.EXE
                </span>
                <span className="rubber-stamp text-[10px] py-0.5 px-2 border-[#15803d] text-[#15803d]">
                  INTERCONNECTED WORLD ’99
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif-vintage tracking-tight text-[#f5eedc]">
                "Loading memories from a time when summer lasted forever."
              </h2>

              <p className="text-sm md:text-base text-[#c4b19d] font-handwriting leading-relaxed">
                Step inside an interconnected digital simulation of an Indian childhood (1990–2005). 
                Every object here is physical and discoverable—click cassettes, dial rotary phones, open secret slam books, and boot dial-up modems.
              </p>
            </div>

            {/* Discovery Stats Counter */}
            <div className="flex-shrink-0 bg-[#120e0c] p-4 rounded-xl border border-[#443224] shadow-inner text-center space-y-1">
              <div className="text-[10px] font-pixel uppercase text-[#9e8b78]">
                World Discovery Gauge
              </div>
              <div className="text-2xl font-bold font-dotmatrix text-[#f59e0b]">
                {discoveredCount.length} / {SUMMER_WORLD_ITEMS.length} OBJECTS
              </div>
              <div className="w-48 bg-[#241a14] h-2 rounded-full overflow-hidden border border-[#3d2b1e]">
                <div
                  className="bg-gradient-to-r from-[#d97706] to-[#22c55e] h-full transition-all duration-500"
                  style={{ width: `${(discoveredCount.length / SUMMER_WORLD_ITEMS.length) * 100}%` }}
                />
              </div>
              <div className="text-[10px] text-[#8e7a68] font-mono">
                Click any object to discover & interact
              </div>
            </div>
          </div>

          {/* Search and Category Filter Toolbar */}
          <div className="mt-6 pt-5 border-t border-[#3d2c20] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#8e7a68]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search memories (e.g. Rasna, Shaktimaan, Train, Homework, Cricket)..."
                className="w-full pl-9 pr-4 py-2 bg-[#120e0c] border border-[#4a3627] rounded-lg text-xs font-typewriter text-[#f3e8d6] placeholder-[#6e5847] focus:outline-none focus:border-[#d97706] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#8e7a68] hover:text-[#e0cfba]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Ambient Mixer Shortcut */}
            <button
              onClick={() => {
                audioSynthesizer.playClick('switch');
                onOpenAmbientMixer();
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#2a1d15] hover:bg-[#3d2b1e] border border-[#6b4e33] text-xs font-typewriter text-[#e5a93c] transition-all shadow"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Open 90s Soundboard (पंखा, बारिश, सीटी)</span>
            </button>
          </div>

          {/* Era / Year Filter Toolbar */}
          <div className="mt-4 pt-3 border-t border-[#2e1f16] flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-pixel uppercase text-[#e5a93c] mr-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>TIMELINE ERA:</span>
            </span>
            {eras.map(era => {
              const isSelected = activeEra === era.year;
              return (
                <button
                  key={String(era.year)}
                  onClick={() => {
                    audioSynthesizer.playClick('switch');
                    setActiveEra(era.year);
                    if (era.year !== 'all' && onSelectYear) {
                      onSelectYear(era.year);
                    }
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#ea580c] text-white border-[#c2410c] font-bold shadow scale-105'
                      : 'bg-[#1a120e] text-[#a89582] border-[#38261b] hover:bg-[#2c1d15] hover:text-[#f3e8d6]'
                  }`}
                >
                  <span>{era.label}</span>
                  <span className="text-[9px] opacity-75 font-pixel">({era.badge})</span>
                </button>
              );
            })}
          </div>

          {/* Categories Pill Scroller */}
          <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map(cat => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    audioSynthesizer.playClick('soft');
                    setActiveCategory(cat.id);
                  }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-typewriter transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#c2842e] text-[#120f0e] border-[#b45309] font-bold shadow-md scale-105'
                      : 'bg-[#15100e] text-[#b8a692] border-[#36271e] hover:bg-[#261c16] hover:text-[#f3e8d6]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Windows 98 / Indian Childhood Interactive Desktop Canvas */}
        <div className="relative rounded-2xl bg-[#140e0b] border-2 border-[#473325] p-6 shadow-2xl overflow-hidden">
          {/* Desktop Top Window Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-gradient-to-r from-[#1c3d5a] to-[#2563eb] text-white rounded-t-lg font-pixel text-xs mb-6 shadow">
            <div className="flex items-center gap-2">
              <Folder className="w-3.5 h-3.5 text-[#fbbf24]" />
              <span>C:\SUMMER_VACATION_1999\MY_CHILDHOOD_WORLD</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <span className="px-1.5 py-0.5 bg-[#1e293b] rounded cursor-pointer">_</span>
              <span className="px-1.5 py-0.5 bg-[#1e293b] rounded cursor-pointer">□</span>
              <span className="px-1.5 py-0.5 bg-[#dc2626] rounded cursor-pointer">✕</span>
            </div>
          </div>

          {/* Interactive Objects Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredItems.map((obj, idx) => {
              const isDiscovered = discoveredCount.includes(obj.id);
              return (
                <motion.div
                  key={obj.id}
                  whileHover={{ scale: 1.04, y: -4, rotate: 0 }}
                  whileTap={{ scale: 0.97 }}
                  onMouseEnter={() => {
                    if (obj.category === 'school' || obj.type === 'ticket' || obj.type === 'notebook') {
                      audioSynthesizer.playPaperRustle();
                    } else if (obj.category === 'shops-snacks' || obj.type === 'tape') {
                      audioSynthesizer.playStickerPeel();
                    } else {
                      audioSynthesizer.playClick('soft');
                    }
                  }}
                  onClick={() => handleObjectClick(obj)}
                  className={`group relative cursor-pointer p-4 rounded-xl border transition-all select-none overflow-hidden ${
                    isDiscovered
                      ? 'bg-[#1e1612] border-[#4f3a2b] hover:border-[#d97706] shadow-lg'
                      : 'bg-[#18110e] border-[#38281d] hover:border-[#785437] opacity-90'
                  }`}
                  style={{
                    transform: `rotate(${((idx % 5) - 2) * 0.8}deg)`
                  }}
                >
                  {/* Subtle Scotch tape corner */}
                  {idx % 3 === 0 && (
                    <div className="scotch-tape -top-2 left-4 w-12 rotate-[-5deg]" />
                  )}

                  {/* Top Badge & Year */}
                  <div className="flex items-center justify-between text-[10px] font-pixel text-[#8e7a68] mb-2">
                    <span className="px-1.5 py-0.5 rounded bg-[#120e0c] border border-[#332318] text-[#e5a93c]">
                      {obj.visualBadge || obj.category.toUpperCase()}
                    </span>
                    <span className="font-dotmatrix">’{String(obj.year).slice(2)}</span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-3 my-2">
                    <div className="w-12 h-12 rounded-lg bg-[#291c15] border border-[#523927] group-hover:border-[#d97706] flex items-center justify-center text-2xl shadow-inner flex-shrink-0 transition-colors">
                      {obj.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#f3e8d6] group-hover:text-[#f59e0b] font-serif-vintage transition-colors line-clamp-1">
                        {obj.name}
                      </h3>
                      <div className="text-[11px] font-handwriting text-[#d48b3b] line-clamp-1">
                        {obj.hindiName}
                      </div>
                    </div>
                  </div>

                  {/* Location Prompt */}
                  <div className="text-[10px] font-typewriter text-[#8a7664] flex items-center gap-1 my-1.5 truncate">
                    <span>📍</span>
                    <span className="truncate">{obj.locationPrompt}</span>
                  </div>

                  {/* Preview Snippet */}
                  <p className="text-xs text-[#b8a692] font-mono leading-relaxed line-clamp-2 mt-1">
                    {obj.previewSnippet}
                  </p>

                  {/* Discover Action Button */}
                  <div className="mt-3 pt-2 border-t border-[#38261b] flex items-center justify-between text-[11px] font-typewriter">
                    <span className="text-[#f59e0b] font-bold group-hover:underline flex items-center gap-1">
                      <span>{obj.interactiveActionLabel}</span>
                      <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </span>
                    {isDiscovered && (
                      <span className="text-[9px] px-1 rounded bg-[#14532d]/40 text-[#4ade80] font-pixel uppercase">
                        ✓ Explored
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Object Detail Modal / Unfold Experience */}
      <AnimatePresence>
        {selectedObject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-2xl w-full bg-[#f6eee0] text-[#1c1511] p-6 md:p-8 rounded-2xl shadow-2xl border-4 border-[#8c6d48] overflow-hidden paper-texture"
            >
              {/* Scotch tape on top corners */}
              <div className="scotch-tape -top-3 left-10 w-24 rotate-[-4deg]" />
              <div className="scotch-tape -top-3 right-10 w-24 rotate-[5deg]" />

              {/* Chai stain watermark */}
              <div className="chai-stain w-32 h-32 bottom-4 right-6 opacity-25" />

              {/* Close Button */}
              <button
                onClick={() => {
                  audioSynthesizer.playClick('switch');
                  setSelectedObject(null);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#e6d5bd] hover:bg-[#cbb494] text-[#2e1d13] transition-colors shadow"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-[#e3d2ba] border-2 border-[#a88d6c] flex items-center justify-center text-3xl shadow-inner">
                  {selectedObject.icon}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rubber-stamp text-[10px] py-0.5 px-2 border-[#8c2d2d] text-[#8c2d2d]">
                      ERA {selectedObject.year}
                    </span>
                    <span className="text-xs font-pixel uppercase text-[#735841]">
                      {selectedObject.locationPrompt}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-serif-vintage text-[#221711] mt-1">
                    {selectedObject.name}
                  </h3>
                  <div className="text-base font-handwriting text-[#8c2d2d]">
                    {selectedObject.hindiName}
                  </div>
                </div>
              </div>

              {/* Ruled Paper Story Section */}
              <div className="p-5 rounded-xl bg-[#fffcf5] border border-[#d6c4a8] shadow-inner text-sm md:text-base text-[#382b20] leading-relaxed font-typewriter notebook-ruled-paper my-4 pl-14 relative">
                {selectedObject.fullStory}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#d1bf9f]">
                <div className="text-xs font-handwriting text-[#705640]">
                  ✦ Indian Childhood Memory Capsule
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleModalAction(selectedObject)}
                    className="px-4 py-2 bg-[#8c2d2d] hover:bg-[#702222] text-white text-xs md:text-sm font-bold font-typewriter rounded-lg shadow transition-transform active:scale-95 flex items-center gap-1.5"
                  >
                    <span>{selectedObject.interactiveActionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      audioSynthesizer.playClick('switch');
                      setSelectedObject(null);
                    }}
                    className="px-3 py-2 bg-[#dfceb6] hover:bg-[#cfbb9d] text-[#332216] text-xs font-typewriter rounded-lg transition-colors"
                  >
                    Keep in Drawer (वापस रखें)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
