import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Folder,
  Music,
  Tv,
  Camera,
  MapPin,
  BookOpen,
  Trash2,
  Monitor,
  X,
  Minus,
  Square,
  Sparkles,
  Volume2,
  VolumeX,
  Radio,
  RefreshCw,
  Clock,
  Compass,
  Layers,
  ChevronUp,
  Cpu,
  HardDrive,
  Wifi,
  Power,
  RotateCcw,
  Check,
  Maximize2,
  Minimize2,
  Smartphone,
  AppWindow,
  Terminal,
  FileText,
  Search,
  ExternalLink,
  Ticket,
  Mail,
  Disc,
  Play,
  Share2,
  Heart
} from 'lucide-react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';
import { VisualMode } from './VintageVisualKnobs.tsx';
import { TerminalWindow } from './EasterEggs/TerminalWindow.tsx';
import { BSODCrashScreen } from './EasterEggs/BSODCrashScreen.tsx';
import { Http404MemoryModal } from './EasterEggs/Http404MemoryModal.tsx';
import { WindowsErrorDialog } from './EasterEggs/WindowsErrorDialog.tsx';
import { SecretPolaroidModal } from './EasterEggs/SecretPolaroidModal.tsx';
import { FolderErrorBoundary } from './FolderErrorBoundary.tsx';
import { MemoryExplorer } from './MemoryExplorer.tsx';
import { CassetteDeck } from './CassetteDeck.tsx';
import { PhysicalEphemera } from './PhysicalEphemera.tsx';
import { CRTTelevision } from './CRTTelevision.tsx';
import { SummerVacationWorld } from './SummerVacationWorld.tsx';
import { SlamBook } from './SlamBook.tsx';
import { MemoryTelegramPostcard } from './MemoryTelegramPostcard.tsx';
import { MEMORY_EXPLORER_ITEMS, MemoryItem } from '../data/memoryExplorerData.ts';
import { useMusic } from '../context/MusicContext.tsx';

export type DesktopWindowId =
  | 'memories'
  | 'music'
  | 'photos'
  | 'videos'
  | 'map'
  | 'guestbook'
  | 'recycle'
  | 'mycomputer';

export interface WindowState {
  id: DesktopWindowId;
  title: string;
  hindiTitle: string;
  icon: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface RetroDesktopNavigationProps {
  selectedYear?: number;
  onYearChange?: (year: number) => void;
  visualMode?: VisualMode;
  onVisualModeChange?: (mode: VisualMode) => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  onOpenAmbientMixer?: () => void;
  onTriggerDialUp?: () => void;
  onReplayBoot?: () => void;
  onOpenMemoryModal?: (mem: MemoryItem | null) => void;
  onOpenTicket?: (mem: MemoryItem | null) => void;
  childrenMap?: Partial<Record<DesktopWindowId, React.ReactNode>>;
}

const DESKTOP_ICONS: {
  id: DesktopWindowId;
  label: string;
  hindi: string;
  iconEmoji: string;
  color: string;
  badge?: string;
  description: string;
}[] = [
  {
    id: 'memories',
    label: 'MEMORIES',
    hindi: 'स्मृतियाँ (18)',
    iconEmoji: '📁',
    color: '#f59e0b',
    badge: '18 Items',
    description: 'Central Memory Archive with Diary & Polaroid Viewers'
  },
  {
    id: 'music',
    label: 'MUSIC',
    hindi: 'कैसेट डेक',
    iconEmoji: '📁',
    color: '#10b981',
    badge: 'WM-99',
    description: 'Sony Walkman Cassette Deck & Ambient Synthesizer'
  },
  {
    id: 'photos',
    label: 'PHOTOS',
    hindi: 'फोटो व अवशेष',
    iconEmoji: '📁',
    color: '#ec4899',
    badge: 'Kodak 100',
    description: 'Railways Slips, Bus Tickets & Old Photo Prints'
  },
  {
    id: 'videos',
    label: 'VIDEOS',
    hindi: 'दूरदर्शन टीवी',
    iconEmoji: '📁',
    color: '#fbbf24',
    badge: 'DD Metro',
    description: 'Onida CRT Television & Vintage Indian Broadcasts'
  },
  {
    id: 'map',
    label: 'MAP',
    hindi: 'समर वर्ल्ड',
    iconEmoji: '📁',
    color: '#06b6d4',
    badge: '6 Nodes',
    description: 'Interactive Vacation World: Station to Haveli'
  },
  {
    id: 'guestbook',
    label: 'GUESTBOOK',
    hindi: 'स्लैम बुक',
    iconEmoji: '📁',
    color: '#8b5cf6',
    badge: 'Gel Pen',
    description: 'Golden Slam Book & 1999 Indian Postcard Oracle'
  },
  {
    id: 'recycle',
    label: 'RECYCLE BIN',
    hindi: 'कचरा डिब्बा',
    iconEmoji: '🗑',
    color: '#9ca3af',
    badge: '8 Relics',
    description: 'Lost 90s Gadgets & Forgotten Indian Artifacts'
  },
  {
    id: 'mycomputer',
    label: 'MY COMPUTER',
    hindi: 'मेरा कंप्यूटर',
    iconEmoji: '🖥',
    color: '#38bdf8',
    badge: 'Aangan OS',
    description: 'System Properties, Year Shift & CRT Knobs'
  }
];

const RECYCLED_RELICS = [
  { id: 'r1', name: 'Motorola Script Pager (1998)', year: 1998, desc: 'Blinks "07734" (HELLO upside down) on single-line LCD.', emoji: '📟' },
  { id: 'r2', name: 'Tangled TDK D-90 Cassette Tape', year: 1995, desc: 'Ribbon pulled out by car stereo. Rewound with Natraj 6B pencil.', emoji: '📼' },
  { id: 'r3', name: 'Scratch-off VSNL 25-Hour Internet Card', year: 2001, desc: 'Serial: 994-0129-883. Password scratched off with 50 paise coin.', emoji: '💳' },
  { id: 'r4', name: 'Rotary Dial STD Receipt Slip', year: 1996, desc: 'Blue carbon paper receipt: 3 units to Mumbai = ₹3.60.', emoji: '🧾' },
  { id: 'r5', name: 'Broken 99-in-1 Brick Game Battery Cap', year: 1997, desc: 'Held tightly together by yellow electrical insulating tape.', emoji: '🎮' },
  { id: 'r6', name: 'Unopened Mango Rasna Sachet (1997)', year: 1997, desc: '32-glass concentrate preserved inside glass jar. Smells like pure childhood.', emoji: '🍹' },
  { id: 'r7', name: 'Standard 8 Hindi Love Note ("Will U Be My Friend?")', year: 1998, desc: 'Folded into an origami triangle and passed under the wooden desk.', emoji: '💌' },
  { id: 'r8', name: 'Sachin Tendulkar 99 Batting Holographic Card', year: 1998, desc: 'Trump card with golden holographic border from Sharjah Desert Storm.', emoji: '🏏' }
];

export const RetroDesktopNavigation: React.FC<RetroDesktopNavigationProps> = ({
  selectedYear = 1999,
  onYearChange,
  visualMode = 'crt',
  onVisualModeChange,
  isMuted = false,
  onToggleMute,
  onOpenAmbientMixer,
  onTriggerDialUp,
  onReplayBoot,
  onOpenMemoryModal,
  onOpenTicket,
  childrenMap
}) => {
  const {
    currentTrack,
    isPlaying,
    isRadioMinimized,
    setIsRadioMinimized,
    setIsFullPlayerOpen
  } = useMusic();
  const containerRef = useRef<HTMLDivElement>(null);

  const [windows, setWindows] = useState<Record<DesktopWindowId, WindowState>>({
    memories: { id: 'memories', title: 'C:\\MEMORIES\\ARCHIVE_1999.EXE', hindiTitle: 'स्मृति मंजूषा', icon: '📁', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 100 },
    music: { id: 'music', title: 'C:\\AUDIO\\AANGAN_WALKMAN_WM99.EXE', hindiTitle: 'कैसेट और एंबियंट डेक', icon: '🎵', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 101 },
    photos: { id: 'photos', title: 'C:\\PHOTOS\\KODAK_EPHEMERA_1995.EXE', hindiTitle: 'तस्वीरें व भौतिक अवशेष', icon: '📷', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 102 },
    videos: { id: 'videos', title: 'C:\\BROADCAST\\DOORDARSHAN_ONIDA_CRT.EXE', hindiTitle: 'दूरदर्शन प्रसारण', icon: '📺', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 103 },
    map: { id: 'map', title: 'C:\\SUMMER_WORLD\\JOURNEY_MAP.EXE', hindiTitle: 'समर वैकेशन इंटरैक्टिव वर्ल्ड', icon: '🗺️', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 104 },
    guestbook: { id: 'guestbook', title: 'C:\\COMMUNITY\\SLAM_BOOK_&_POSTCARD.EXE', hindiTitle: 'गोल्डन स्लैम बुक व पोस्टकार्ड', icon: '📖', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 105 },
    recycle: { id: 'recycle', title: 'RECYCLE BIN - DELETED 90s RELICS', hindiTitle: 'कचरा डिब्बा (खोई हुई यादें)', icon: '🗑', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 106 },
    mycomputer: { id: 'mycomputer', title: 'SYSTEM PROPERTIES - AANGAN OS 99', hindiTitle: 'मेरा कंप्यूटर (सिस्टम सेटिंग्स)', icon: '🖥', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 107 }
  });

  const [topZIndex, setTopZIndex] = useState<number>(110);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState<boolean>(false);
  const [restoredRelics, setRestoredRelics] = useState<string[]>([]);
  const [selectedDesktopIcon, setSelectedDesktopIcon] = useState<DesktopWindowId | null>(null);
  const [systemTime, setSystemTime] = useState<string>('4:30 PM');
  const [guestbookSubTab, setGuestbookSubTab] = useState<'slambook' | 'postcard'>('slambook');

  // Memories folder local search / category filter
  const [memoryFilterCategory, setMemoryFilterCategory] = useState<string>('all');
  const [memorySearchTerm, setMemorySearchTerm] = useState<string>('');

  // Mobile active window
  const [activeMobileWindow, setActiveMobileWindow] = useState<DesktopWindowId | null>(null);

  // Easter Egg states
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isBSODOpen, setIsBSODOpen] = useState<boolean>(false);
  const [isHttp404Open, setIsHttp404Open] = useState<boolean>(false);
  const [isWindowsErrorOpen, setIsWindowsErrorOpen] = useState<boolean>(false);
  const [isSecretPolaroidOpen, setIsSecretPolaroidOpen] = useState<boolean>(false);
  const [iconClickHistory, setIconClickHistory] = useState<{ id: string; count: number; lastTime: number }>({ id: '', count: 0, lastTime: 0 });
  const [recycleBinEmptyPrompt, setRecycleBinEmptyPrompt] = useState<boolean>(false);

  const handleOpenMemory = (mem: MemoryItem | null) => {
    if (onOpenMemoryModal) onOpenMemoryModal(mem);
    else if (onOpenTicket) onOpenTicket(mem);
  };

  // Clock click year cycle
  const handleClockClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const YEARS = [1990, 1994, 1996, 1998, 1999, 2002, 2005];
    const currentIdx = YEARS.indexOf(selectedYear);
    const nextYear = YEARS[(currentIdx + 1) % YEARS.length];
    if (onYearChange) {
      onYearChange(nextYear);
    }
    audioSynthesizer.playTimeWarpWhoosh();
  };

  const handleIconClickTrack = (iconId: DesktopWindowId) => {
    const now = Date.now();
    if (iconClickHistory.id === iconId && now - iconClickHistory.lastTime < 1200) {
      const nextCount = iconClickHistory.count + 1;
      setIconClickHistory({ id: iconId, count: nextCount, lastTime: now });
      if (iconId === 'mycomputer' && nextCount >= 5) {
        setIsBSODOpen(true);
        setIconClickHistory({ id: '', count: 0, lastTime: 0 });
        return;
      }
      if (nextCount >= 4) {
        setIsWindowsErrorOpen(true);
        audioSynthesizer.playErrorBuzzer();
        setIconClickHistory({ id: '', count: 0, lastTime: 0 });
        return;
      }
    } else {
      setIconClickHistory({ id: iconId, count: 1, lastTime: now });
    }
  };

  // Digital clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hours = d.getHours();
      const minutes = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formatted = `${((hours + 11) % 12) + 1}:${minutes} ${ampm}`;
      setSystemTime(formatted);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const bringToFront = (id: DesktopWindowId) => {
    setTopZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((w) => ({
        ...w,
        [id]: { ...w[id], zIndex: nextZ, isMinimized: false }
      }));
      return nextZ;
    });
  };

  const handleOpenWindow = (id: DesktopWindowId) => {
    audioSynthesizer.playClick('heavy');
    setTopZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((w) => ({
        ...w,
        [id]: { ...w[id], isOpen: true, isMinimized: false, zIndex: nextZ }
      }));
      return nextZ;
    });
    setActiveMobileWindow(id);
    setIsStartMenuOpen(false);
  };

  const handleCloseWindow = (id: DesktopWindowId, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioSynthesizer.playClick('soft');
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], isOpen: false, isMinimized: false }
    }));
    if (activeMobileWindow === id) {
      setActiveMobileWindow(null);
    }
  };

  const handleMinimizeWindow = (id: DesktopWindowId, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioSynthesizer.playClick('switch');
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], isMinimized: true }
    }));
    if (activeMobileWindow === id) {
      setActiveMobileWindow(null);
    }
  };

  const handleMaximizeToggle = (id: DesktopWindowId, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    audioSynthesizer.playClick('switch');
    setWindows((w) => ({
      ...w,
      [id]: { ...w[id], isMaximized: !w[id].isMaximized }
    }));
  };

  const handleRestoreRelic = (relicId: string) => {
    audioSynthesizer.playClick('beep');
    setRestoredRelics((prev) => [...prev, relicId]);
  };

  const openWindowsList = (Object.values(windows) as WindowState[]).filter((w) => w.isOpen);

  // Filtered memories for the Memories Folder view
  const filteredMemories = MEMORY_EXPLORER_ITEMS.filter((item) => {
    const matchesCategory =
      memoryFilterCategory === 'all' ||
      item.category === memoryFilterCategory;
    const matchesSearch =
      !memorySearchTerm ||
      item.title.toLowerCase().includes(memorySearchTerm.toLowerCase()) ||
      item.hindiTitle.toLowerCase().includes(memorySearchTerm.toLowerCase()) ||
      item.emotionalDescription.toLowerCase().includes(memorySearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Render interior content for a specific window
  const renderWindowContent = (winId: DesktopWindowId) => {
    // If a custom override child was passed in childrenMap, use it safely
    if (childrenMap && childrenMap[winId]) {
      return childrenMap[winId];
    }

    switch (winId) {
      case 'memories':
        return (
          <div className="space-y-4 p-2 font-mono text-xs text-[#faecd8]">
            {/* Explorer Toolbar */}
            <div className="p-3 bg-[#241710] rounded-lg border border-[#4d3625] flex flex-wrap items-center justify-between gap-3 shadow-inner">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[#e5a93c] text-xs">C:\AANGAN99\MEMORIES&gt;</span>
                <span className="text-[11px] text-gray-400">({filteredMemories.length} files found)</span>
              </div>

              {/* Search & Filter */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-gray-400" />
                  <input
                    type="text"
                    value={memorySearchTerm}
                    onChange={(e) => setMemorySearchTerm(e.target.value)}
                    placeholder="Search memories..."
                    className="pl-7 pr-2 py-1 bg-[#160e0a] border border-[#523824] rounded text-xs text-white focus:outline-none focus:border-[#e5a93c] w-36 sm:w-48"
                  />
                  {memorySearchTerm && (
                    <button
                      onClick={() => setMemorySearchTerm('')}
                      className="absolute right-1.5 top-1.5 text-gray-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              {[
                { id: 'all', label: 'All Files (18)' },
                { id: 'vacation', label: '🏖️ Vacation & Rain' },
                { id: 'games', label: '🏏 Gully Cricket' },
                { id: 'screen', label: '📺 Doordarshan' },
                { id: 'tech', label: '💻 56k Modem' },
                { id: 'daily', label: '🕯️ Daily Life' },
                { id: 'travel', label: '🚂 Railways' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setMemoryFilterCategory(tab.id)}
                  className={`px-2.5 py-1 rounded text-xs whitespace-nowrap border transition-all ${
                    memoryFilterCategory === tab.id
                      ? 'bg-[#e5a93c] text-[#120f0e] font-bold border-[#fff]'
                      : 'bg-[#241710] text-gray-300 border-[#4d3625] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Grid of Memory Folder Icons / Cards */}
            {filteredMemories.length === 0 ? (
              <div className="p-8 text-center bg-[#241710] rounded-lg border border-[#4d3625] space-y-2">
                <p className="font-pixel text-[#e5a93c]">FOLDER EMPTY / NO MATCHING RECORDS</p>
                <p className="text-gray-400 text-xs">No memories found for current search criteria.</p>
                <button
                  onClick={() => {
                    setMemoryFilterCategory('all');
                    setMemorySearchTerm('');
                  }}
                  className="px-3 py-1 bg-[#4d3625] hover:bg-[#664730] text-white rounded text-xs font-mono"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredMemories.map((mem) => (
                  <div
                    key={mem.id}
                    onClick={() => handleOpenMemory(mem)}
                    className="p-3 bg-[#241710] hover:bg-[#332015] border border-[#4d3625] hover:border-[#e5a93c] rounded-lg cursor-pointer transition-all flex flex-col justify-between group shadow-sm"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{mem.visualEmoji}</span>
                          <div>
                            <h4 className="font-bold text-[#faecd8] group-hover:text-[#e5a93c] text-xs font-serif leading-tight">
                              {mem.title}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-mono">{mem.hindiTitle}</p>
                          </div>
                        </div>
                        <span className="px-1.5 py-0.5 rounded bg-[#160e0a] text-[9px] font-pixel text-[#e5a93c] border border-[#3d2719]">
                          {mem.year}
                        </span>
                      </div>

                      <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                        {mem.emotionalDescription}
                      </p>
                    </div>

                    <div className="pt-2 mt-2 border-t border-[#3b271b] flex items-center justify-between text-[10px] text-[#e5a93c]">
                      <span className="font-pixel uppercase tracking-wider">{mem.category}</span>
                      <span className="group-hover:underline flex items-center gap-1 font-bold">
                        Open File <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'music':
        return (
          <div className="p-2 space-y-4 font-mono text-xs">
            <div className="p-3 bg-[#241710] rounded-lg border border-[#4d3625] flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-[#faecd8] text-sm flex items-center gap-2">
                  <Disc className="w-4 h-4 text-[#10b981] animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Sony Walkman WM-99 Cassette Deck</span>
                </h4>
                <p className="text-gray-400 text-[11px]">
                  Magnetic tape simulator with real synthesized childhood raga chords.
                </p>
              </div>
              <button
                onClick={() => setIsFullPlayerOpen(true)}
                className="px-3 py-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-[#1c120c] font-bold text-xs rounded shadow flex items-center gap-1.5 font-pixel uppercase active:scale-95 transition-all"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Open Full Nostalgia Radio</span>
              </button>
            </div>
            <CassetteDeck />
          </div>
        );

      case 'photos':
        return (
          <div className="p-2 space-y-4">
            <div className="p-3 bg-[#241710] rounded-lg border border-[#4d3625] flex items-center justify-between gap-2 font-mono text-xs">
              <div>
                <h4 className="font-bold text-[#faecd8] text-sm">
                  Kodak Ephemera & Physical Relics Album
                </h4>
                <p className="text-gray-400 text-[11px]">
                  Click on railway tickets, bus slips, and postcards to inspect physical artifacts.
                </p>
              </div>
            </div>
            <PhysicalEphemera
              selectedYear={selectedYear}
              onOpenTicket={(mem) => handleOpenMemory(mem)}
            />
          </div>
        );

      case 'videos':
        return (
          <div className="p-2 space-y-4 font-mono text-xs">
            <div className="p-3 bg-[#241710] rounded-lg border border-[#4d3625] flex items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-[#faecd8] text-sm flex items-center gap-2">
                  <Tv className="w-4 h-4 text-[#fbbf24]" />
                  <span>Onida 21" Color CRT Television — Doordarshan Era</span>
                </h4>
                <p className="text-gray-400 text-[11px]">
                  Tune analog channels, adjust antenna angle, and experience vintage Indian broadcasts.
                </p>
              </div>
            </div>
            <CRTTelevision />
          </div>
        );

      case 'map':
        return (
          <div className="p-2 space-y-4">
            <div className="p-3 bg-[#241710] rounded-lg border border-[#4d3625] flex items-center justify-between gap-2 font-mono text-xs">
              <div>
                <h4 className="font-bold text-[#faecd8] text-sm flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#06b6d4]" />
                  <span>Summer Vacation Interactive World Map</span>
                </h4>
                <p className="text-gray-400 text-[11px]">
                  Journey from the railway platform to Nani's Haveli and the rainy rooftop.
                </p>
              </div>
            </div>
            <SummerVacationWorld
              selectedYear={selectedYear}
              onTriggerDialUp={() => {
                if (onTriggerDialUp) onTriggerDialUp();
              }}
              onOpenAmbientMixer={() => {
                if (onOpenAmbientMixer) onOpenAmbientMixer();
              }}
            />
          </div>
        );

      case 'guestbook':
        return (
          <div className="p-2 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#4d3625] pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setGuestbookSubTab('slambook')}
                  className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${
                    guestbookSubTab === 'slambook'
                      ? 'bg-[#8b5cf6] text-white border-white'
                      : 'bg-[#241710] text-gray-400 border-[#4d3625] hover:text-white'
                  }`}
                >
                  📖 Golden Slam Book (1999)
                </button>

                <button
                  onClick={() => setGuestbookSubTab('postcard')}
                  className={`px-3 py-1.5 rounded text-xs font-bold border transition-all ${
                    guestbookSubTab === 'postcard'
                      ? 'bg-[#e5a93c] text-black border-white'
                      : 'bg-[#241710] text-gray-400 border-[#4d3625] hover:text-white'
                  }`}
                >
                  💌 1999 Indian Postcard Oracle
                </button>
              </div>
            </div>

            {guestbookSubTab === 'slambook' ? (
              <SlamBook />
            ) : (
              <MemoryTelegramPostcard />
            )}
          </div>
        );

      case 'recycle':
        return (
          <div className="p-4 space-y-4 font-mono text-xs text-[#faecd8]">
            <div className="flex items-center justify-between border-b border-[#4d3625] pb-3">
              <div>
                <h3 className="text-base font-bold font-serif-vintage text-[#faecd8]">
                  Deleted 90s Relics & Forgotten Hardware
                </h3>
                <p className="text-gray-400 text-[11px]">
                  Items thrown into the dustbin of time. Click "Restore" to salvage them into your digital memory trunk.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    audioSynthesizer.playErrorBuzzer();
                    setRecycleBinEmptyPrompt(true);
                  }}
                  className="px-2.5 py-1 rounded bg-[#7f1d1d] hover:bg-[#991b1b] text-white text-[10px] font-pixel border border-white/40 shadow active:scale-95"
                >
                  Empty Bin 🗑
                </button>
                <Trash2 className="w-6 h-6 text-gray-500" />
              </div>
            </div>

            {recycleBinEmptyPrompt && (
              <div className="p-3 bg-[#450a0a] border border-[#ef4444] rounded text-red-200 text-xs flex items-center justify-between gap-2">
                <span>
                  ⚠️ <strong>Error 0x99</strong>: Childhood memories are write-protected and permanent. You cannot empty the 90s.
                </span>
                <button
                  onClick={() => setRecycleBinEmptyPrompt(false)}
                  className="px-2 py-0.5 bg-black/40 text-white rounded text-[10px] uppercase font-pixel hover:bg-black/60"
                >
                  Acknowledge
                </button>
              </div>
            )}

            <div className="space-y-2.5">
              {RECYCLED_RELICS.map((relic) => {
                const isRestored = restoredRelics.includes(relic.id);
                return (
                  <div
                    key={relic.id}
                    className="p-3 rounded-lg bg-[#241710] border border-[#4d3625] flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{relic.emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#faecd8] text-sm">{relic.name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-[#3d2719] text-[10px] text-[#e5a93c]">
                            {relic.year}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">{relic.desc}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRestoreRelic(relic.id)}
                      disabled={isRestored}
                      className={`px-3 py-1.5 rounded text-xs font-pixel uppercase whitespace-nowrap transition-all border ${
                        isRestored
                          ? 'bg-[#14532d] text-white border-[#22c55e]'
                          : 'bg-[#c2842e] hover:bg-[#d97706] text-black font-bold border-t-white border-l-white border-r-black border-b-black'
                      }`}
                    >
                      {isRestored ? '✓ Restored' : 'Restore Relic'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 'mycomputer':
        return (
          <div className="p-4 space-y-5 font-mono text-xs text-[#faecd8]">
            <div className="p-4 rounded-xl bg-[#241710] border border-[#4d3625] flex items-center gap-4">
              <div className="text-5xl">🖥️</div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold font-pixel text-[#ffff00]">
                  System: Aangan OS 1999 Edition
                </h3>
                <p className="text-gray-300">
                  Processor: GenuineIntel x86 Celeron @ 433 MHz
                </p>
                <p className="text-gray-300">
                  Memory: 64.0 MB SDRAM (PC100) • HDD: 4.3 GB Seagate Medalist
                </p>
                <p className="text-[#38bdf8]">
                  Network: VSNL 56k V.90 Dial-Up Modem [COM2 / 115200 bps]
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-[#19110d] rounded-lg border border-[#3b281b] space-y-2">
                <div className="flex items-center justify-between text-[#e5a93c] font-pixel text-xs">
                  <span>TIMESHIFT YEAR:</span>
                  <span className="font-bold">{selectedYear}</span>
                </div>
                <input
                  type="range"
                  min="1990"
                  max="2005"
                  value={selectedYear}
                  onChange={(e) => onYearChange && onYearChange(parseInt(e.target.value))}
                  className="w-full accent-[#e5a93c] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>1990</span>
                  <span>1995</span>
                  <span>2000</span>
                  <span>2005</span>
                </div>
              </div>

              <div className="p-3 bg-[#19110d] rounded-lg border border-[#3b281b] space-y-2">
                <div className="flex items-center justify-between text-[#38bdf8] font-pixel text-xs">
                  <span>DISPLAY CRT FILTER:</span>
                  <span className="uppercase">{visualMode}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[11px]">
                  {(['crt', 'vhs', 'newspaper', 'amber', 'raw'] as VisualMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onVisualModeChange && onVisualModeChange(mode)}
                      className={`py-1 px-2 rounded font-mono uppercase border ${
                        visualMode === mode
                          ? 'bg-[#008080] text-white border-white font-bold'
                          : 'bg-[#241710] text-gray-400 border-[#3d2719] hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#3b281b]">
              <button
                onClick={onTriggerDialUp}
                className="px-3 py-2 bg-[#000080] hover:bg-[#1084d0] text-white font-bold text-xs rounded border border-white flex items-center gap-1.5"
              >
                <Wifi className="w-3.5 h-3.5 text-[#ffff00]" />
                <span>56k Modem Handshake</span>
              </button>

              <button
                onClick={onOpenAmbientMixer}
                className="px-3 py-2 bg-[#2d1c13] hover:bg-[#3d281c] text-[#fcd34d] text-xs rounded border border-[#6b4728] flex items-center gap-1.5"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ceiling Fan Soundboard</span>
              </button>

              <button
                onClick={onReplayBoot}
                className="px-3 py-2 bg-[#991b1b] hover:bg-[#b91c1c] text-white text-xs rounded border border-white flex items-center gap-1.5 ml-auto"
              >
                <Power className="w-3.5 h-3.5" />
                <span>Reboot BIOS (Restart)</span>
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-8 text-center text-gray-400 font-mono text-xs">
            <p>Folder contents are currently unavailable.</p>
          </div>
        );
    }
  };

  return (
    <div id="retro-desktop-navigation" className="w-full relative select-none">
      {/* ========================================================================= */}
      {/* 1. DESKTOP WORKSPACE (TABLET / DESKTOP SCREENS - md and above)          */}
      {/* ========================================================================= */}
      <div
        ref={containerRef}
        className="hidden md:flex relative w-full min-h-[640px] lg:min-h-[740px] rounded-2xl bg-[#008080] border-4 border-[#3a3a3a] shadow-2xl p-4 lg:p-6 overflow-hidden flex-col justify-between"
        style={{
          boxShadow: 'inset 0 0 50px rgba(0,0,0,0.65), 0 20px 45px rgba(0,0,0,0.85)'
        }}
        onClick={() => {
          setSelectedDesktopIcon(null);
          if (isStartMenuOpen) setIsStartMenuOpen(false);
        }}
      >
        {/* Retro Wallpaper Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <div className="text-center font-pixel text-white">
            <p className="text-8xl font-bold tracking-widest">AANGAN 99</p>
            <p className="text-xl mt-2 font-mono">MS-DOS / WIN98 NOSTALGIA WORKSPACE</p>
          </div>
        </div>

        {/* Top OS Header Bar */}
        <div className="relative z-10 flex items-center justify-between bg-[#000080] text-white px-3 py-1.5 rounded-t text-xs font-mono border-b border-[#808080] shadow">
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-[#ffff00] animate-pulse" />
            <span className="font-pixel text-[#ffff00] text-xs tracking-wider">
              AANGAN DESKTOP OS [v4.10.1999]
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-300 font-pixel">ERA: {selectedYear}</span>
            <span className="px-2 py-0.5 rounded bg-[#1084d0] font-pixel text-white">64MB RAM OK</span>
          </div>
        </div>

        {/* DESKTOP ICONS GRID */}
        <div className="relative z-10 grid grid-cols-4 lg:grid-cols-8 gap-3 my-4">
          {DESKTOP_ICONS.map((icon) => {
            const isSelected = selectedDesktopIcon === icon.id;
            const isOpen = windows[icon.id]?.isOpen;
            return (
              <motion.button
                key={icon.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedDesktopIcon(icon.id);
                  handleIconClickTrack(icon.id);
                  handleOpenWindow(icon.id);
                }}
                className={`p-3 rounded-lg flex flex-col items-center justify-center text-center group transition-all border ${
                  isSelected
                    ? 'bg-[#000080]/80 border-[#ffff00] text-white ring-2 ring-[#ffff00]'
                    : 'bg-[#008080]/40 hover:bg-[#006060]/70 border-transparent hover:border-white/30 text-white'
                }`}
              >
                {/* Retro Folder / Icon */}
                <div className="relative mb-1.5">
                  <span className="text-4xl filter drop-shadow-md">{icon.iconEmoji}</span>
                  {isOpen && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#22c55e] border border-black rounded-full animate-ping" />
                  )}
                  {icon.badge && (
                    <span className="absolute -bottom-1 -right-2 px-1.5 py-0.5 rounded text-[9px] font-pixel bg-[#000080] text-[#ffff00] border border-white">
                      {icon.badge}
                    </span>
                  )}
                </div>

                <span className="font-pixel text-xs tracking-wider font-bold drop-shadow leading-tight block">
                  {icon.label}
                </span>
                <span className="text-[10px] font-mono text-gray-200 opacity-90 truncate max-w-full block">
                  {icon.hindi}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* ACTIVE DRAGGABLE RETRO WINDOWS STACK (DESKTOP) */}
        <div className="relative flex-1 w-full min-h-[420px] pointer-events-none">
          {(Object.values(windows) as WindowState[]).map((win) => {
            if (!win.isOpen || win.isMinimized) return null;

            return (
              <motion.div
                key={win.id}
                drag
                dragConstraints={containerRef}
                dragMomentum={false}
                initial={{ scale: 0.92, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0 }}
                style={{ zIndex: win.zIndex }}
                onClick={() => bringToFront(win.id)}
                className={`pointer-events-auto absolute bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-black border-b-black shadow-[8px_8px_25px_rgba(0,0,0,0.8)] text-black font-mono flex flex-col rounded-xs transition-all ${
                  win.isMaximized
                    ? 'inset-1 w-auto h-auto'
                    : 'inset-x-6 top-4 bottom-4 max-h-[92%]'
                }`}
              >
                {/* Titlebar (Draggable Header) */}
                <div
                  className="bg-gradient-to-r from-[#000080] via-[#1084d0] to-[#000080] text-white px-3 py-1.5 font-bold text-xs flex items-center justify-between select-none cursor-move shadow-inner"
                  onMouseDown={() => bringToFront(win.id)}
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="text-sm">{win.icon}</span>
                    <span className="font-pixel text-xs tracking-wider truncate">
                      {win.title}
                    </span>
                  </div>

                  {/* Window Control Buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleMinimizeWindow(win.id, e)}
                      className="w-5 h-5 bg-[#c0c0c0] text-black font-bold flex items-center justify-center border border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black hover:bg-[#d4d0c8]"
                      title="Minimize"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <button
                      onClick={(e) => handleMaximizeToggle(win.id, e)}
                      className="w-5 h-5 bg-[#c0c0c0] text-black font-bold flex items-center justify-center border border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black hover:bg-[#d4d0c8]"
                      title={win.isMaximized ? 'Restore' : 'Maximize'}
                    >
                      <Square className="w-2.5 h-2.5" />
                    </button>

                    <button
                      onClick={(e) => handleCloseWindow(win.id, e)}
                      className="w-5 h-5 bg-[#c0c0c0] text-black font-bold flex items-center justify-center border border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black hover:bg-[#e11d48] hover:text-white"
                      title="Close"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Classic Windows Menu Bar */}
                <div className="bg-[#c0c0c0] px-3 py-1 border-b border-[#808080] flex items-center gap-4 text-xs select-none">
                  <span className="hover:underline cursor-pointer">File</span>
                  <span className="hover:underline cursor-pointer">Edit</span>
                  <span className="hover:underline cursor-pointer">View</span>
                  <span className="hover:underline cursor-pointer">Help</span>
                  <span className="ml-auto text-[11px] text-gray-700">
                    {win.hindiTitle}
                  </span>
                </div>

                {/* Window Interior Content Area with Error Boundary */}
                <div className="flex-1 p-4 overflow-y-auto bg-[#1a120e] text-[#f5ebd8] border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white shadow-inner">
                  <FolderErrorBoundary
                    folderTitle={win.title}
                    onClose={() => handleCloseWindow(win.id)}
                  >
                    {renderWindowContent(win.id)}
                  </FolderErrorBoundary>
                </div>

                {/* Status Bar */}
                <div className="bg-[#c0c0c0] px-3 py-1 border-t border-[#808080] flex items-center justify-between text-[11px] text-gray-800 select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span>Status: Ready • 1 Item Open</span>
                  </div>
                  <span className="font-mono text-[10px]">AANGAN WIN98 SHELL</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* WINDOWS 98 TASKBAR */}
        <div className="relative z-30 mt-3 pt-1">
          <AnimatePresence>
            {isStartMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute bottom-12 left-0 w-72 bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-black border-b-black shadow-2xl font-mono text-black z-50 rounded-xs"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex">
                  <div className="w-8 bg-gradient-to-t from-[#000080] to-[#1084d0] flex flex-col justify-end items-center py-4 text-white font-pixel text-xs tracking-widest uppercase">
                    <span className="transform -rotate-90 origin-center whitespace-nowrap mb-6 font-bold text-[#ffff00]">
                      AANGAN 99
                    </span>
                  </div>

                  <div className="flex-1 p-1 space-y-0.5 text-xs">
                    {DESKTOP_ICONS.map((icon) => (
                      <button
                        key={icon.id}
                        onClick={() => handleOpenWindow(icon.id)}
                        className="w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-[#000080] hover:text-white rounded-xs transition-colors"
                      >
                        <span className="text-base">{icon.iconEmoji}</span>
                        <div className="flex-1 truncate">
                          <span className="font-bold block">{icon.label}</span>
                          <span className="text-[10px] opacity-75">{icon.hindi}</span>
                        </div>
                      </button>
                    ))}

                    <div className="border-t border-[#808080] my-1 pt-1" />

                    <button
                      onClick={() => {
                        setIsStartMenuOpen(false);
                        setIsTerminalOpen(true);
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-[#000080] hover:text-white"
                    >
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-emerald-300">MS-DOS Prompt (CMD)</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsStartMenuOpen(false);
                        setIsSecretPolaroidOpen(true);
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-[#000080] hover:text-white"
                    >
                      <Camera className="w-4 h-4 text-amber-300" />
                      <span>Kodak Secret Polaroid ’97...</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsStartMenuOpen(false);
                        setIsHttp404Open(true);
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-[#000080] hover:text-white"
                    >
                      <span>🌐</span>
                      <span>HTTP 404: Childhood Gateway...</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsStartMenuOpen(false);
                        if (onTriggerDialUp) onTriggerDialUp();
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-[#000080] hover:text-white"
                    >
                      <span>📞</span>
                      <span>Connect 56k Dial-Up...</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsStartMenuOpen(false);
                        if (onOpenAmbientMixer) onOpenAmbientMixer();
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-[#000080] hover:text-white"
                    >
                      <span>🎛️</span>
                      <span>Ceiling Fan Soundboard...</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsStartMenuOpen(false);
                        if (onReplayBoot) onReplayBoot();
                      }}
                      className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 hover:bg-[#991b1b] hover:text-white border-t border-[#808080]"
                    >
                      <span>⏻</span>
                      <span className="font-bold">Shut Down (Reboot)...</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full bg-[#c0c0c0] border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] p-1 flex items-center justify-between gap-2 text-xs font-mono shadow-md">
            <div className="flex items-center gap-2 flex-1 overflow-x-auto">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  audioSynthesizer.playClick('switch');
                  setIsStartMenuOpen(!isStartMenuOpen);
                }}
                className={`px-3 py-1 font-bold text-xs flex items-center gap-1.5 border-2 rounded-xs transition-all active:translate-x-0.5 active:translate-y-0.5 select-none ${
                  isStartMenuOpen
                    ? 'bg-[#d0d0d0] border-t-black border-l-black border-r-white border-b-white ring-1 ring-black'
                    : 'bg-[#c0c0c0] border-t-white border-l-white border-r-black border-b-black hover:bg-[#d8d4cc]'
                }`}
              >
                <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                  <span className="bg-red-500 w-1.5 h-1.5 rounded-xs" />
                  <span className="bg-green-500 w-1.5 h-1.5 rounded-xs" />
                  <span className="bg-blue-500 w-1.5 h-1.5 rounded-xs" />
                  <span className="bg-yellow-500 w-1.5 h-1.5 rounded-xs" />
                </div>
                <span className="font-pixel text-[11px] tracking-wide text-black">Start</span>
              </button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-full">
                {/* Nostalgia Radio Taskbar Item */}
                <button
                  onClick={() => {
                    audioSynthesizer.playClick('switch');
                    setIsRadioMinimized(!isRadioMinimized);
                  }}
                  className={`px-2 py-1 text-[11px] rounded-xs border flex items-center gap-1.5 truncate max-w-[170px] select-none ${
                    !isRadioMinimized
                      ? 'bg-[#dfdfdf] font-bold border-t-black border-l-black border-r-white border-b-white shadow-inner text-[#854d0e]'
                      : 'bg-[#c0c0c0] border-t-white border-l-white border-r-black border-b-black hover:bg-[#d4d0c8] text-black'
                  }`}
                  title={isRadioMinimized ? "Click to restore Nostalgia Radio" : "Click to minimize Nostalgia Radio"}
                >
                  <span className="text-xs">📻</span>
                  <span className="font-pixel text-[9px] text-[#b45309]">RADIO</span>
                  <span className="text-[10px] font-bold truncate">
                    {isPlaying ? '▶' : '❚❚'} {currentTrack.title}
                  </span>
                </button>

                {openWindowsList.map((win) => {
                  const isActive = !win.isMinimized && win.zIndex === topZIndex;
                  return (
                    <button
                      key={win.id}
                      onClick={() => {
                        if (win.isMinimized) {
                          bringToFront(win.id);
                        } else if (isActive) {
                          setWindows((w) => ({
                            ...w,
                            [win.id]: { ...w[win.id], isMinimized: true }
                          }));
                        } else {
                          bringToFront(win.id);
                        }
                      }}
                      className={`px-2.5 py-1 text-[11px] rounded-xs border flex items-center gap-1.5 truncate max-w-[140px] select-none ${
                        isActive
                          ? 'bg-[#dfdfdf] font-bold border-t-black border-l-black border-r-white border-b-white shadow-inner'
                          : 'bg-[#c0c0c0] border-t-white border-l-white border-r-black border-b-black hover:bg-[#d4d0c8]'
                      }`}
                    >
                      <span className="text-xs">{win.icon}</span>
                      <span className="truncate">{win.title.split('\\').pop() || win.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 border border-inset border-[#808080] px-2 py-0.5 bg-[#d4d0c8] shadow-inner text-[11px] shrink-0">
              <button
                onClick={onToggleMute}
                className="hover:opacity-75"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-700" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-800" />
                )}
              </button>

              <div className="flex items-center gap-0.5" title="VSNL Modem Tx/Rx">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              </div>

              {/* Taskbar Clock (Click repeatedly to cycle year) */}
              <button
                onClick={handleClockClick}
                className="flex items-center gap-1 font-mono font-bold text-gray-900 border-l border-[#808080] pl-1.5 hover:bg-black/10 px-1 rounded transition-colors cursor-pointer"
                title="Click repeatedly to time-travel across years!"
              >
                <Clock className="w-3 h-3 text-gray-700 animate-spin" style={{ animationDuration: '10s' }} />
                <span>{systemTime} ({selectedYear})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEDICATED TOUCH-FRIENDLY MOBILE INTERFACE MODEL (Mobile screens < md)  */}
      {/* ========================================================================= */}
      <div className="md:hidden space-y-4">
        {/* PalmOS / Pocket PC Nostalgia Touch Launcher */}
        <div className="rounded-2xl bg-[#008080] border-4 border-[#3a3a3a] shadow-xl p-3 text-white font-mono space-y-3">
          {/* Mobile OS Status Header */}
          <div className="bg-[#000080] px-3 py-2 rounded flex items-center justify-between border border-[#808080] text-xs">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#ffff00]" />
              <span className="font-pixel text-[#ffff00] text-[11px]">AANGAN POCKET OS ’99</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="bg-[#1084d0] px-1.5 py-0.5 rounded font-pixel">TOUCH MODE</span>
              <span className="text-[#ffff00] font-mono">{systemTime}</span>
            </div>
          </div>

          {/* Touch Tile App Grid (44px+ touch targets) */}
          <div className="grid grid-cols-2 gap-2.5">
            {DESKTOP_ICONS.map((icon) => {
              const isOpen = activeMobileWindow === icon.id;
              return (
                <button
                  key={icon.id}
                  onClick={() => handleOpenWindow(icon.id)}
                  className={`p-3 rounded-xl border-2 flex flex-col items-start justify-between min-h-[96px] text-left transition-transform active:scale-95 ${
                    isOpen
                      ? 'bg-[#000080] text-white border-[#ffff00] shadow-md'
                      : 'bg-[#c0c0c0] text-black border-t-white border-l-white border-r-black border-b-black active:border-t-black active:border-l-black'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-3xl">{icon.iconEmoji}</span>
                    {icon.badge && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-pixel bg-[#000080] text-[#ffff00] border border-black">
                        {icon.badge}
                      </span>
                    )}
                  </div>
                  <div className="w-full mt-2">
                    <span className="font-pixel text-[11px] font-bold block leading-tight truncate">
                      {icon.label}
                    </span>
                    <span className="text-[10px] opacity-80 block truncate">
                      {icon.hindi}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Bottom Quick Tools (Dial-up, Ambient, Mute, Reboot) */}
          <div className="pt-2 border-t border-white/20 grid grid-cols-3 gap-1.5 text-[11px] font-mono">
            <button
              onClick={onTriggerDialUp}
              className="p-2 rounded bg-[#000080] border border-white text-center text-white flex flex-col items-center gap-1 active:scale-95"
            >
              <Wifi className="w-3.5 h-3.5 text-[#ffff00]" />
              <span className="text-[10px] font-pixel">56k Dial-Up</span>
            </button>

            <button
              onClick={onOpenAmbientMixer}
              className="p-2 rounded bg-[#331f13] border border-[#d97706] text-center text-[#fcd34d] flex flex-col items-center gap-1 active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="text-[10px] font-pixel">Soundboard</span>
            </button>

            <button
              onClick={onToggleMute}
              className="p-2 rounded bg-[#241710] border border-gray-600 text-center text-gray-200 flex flex-col items-center gap-1 active:scale-95"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span className="text-[10px] font-pixel">{isMuted ? 'Unmute' : 'Muted'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Window Container with Error Boundary */}
        <AnimatePresence>
          {activeMobileWindow && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="w-full bg-[#c0c0c0] border-4 border-t-white border-l-white border-r-black border-b-black shadow-2xl rounded-xl flex flex-col overflow-hidden font-mono"
            >
              {/* Mobile Window Titlebar */}
              <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-3 py-2 font-bold text-xs flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <span>{windows[activeMobileWindow]?.icon}</span>
                  <span className="font-pixel text-xs truncate">
                    {windows[activeMobileWindow]?.title.split('\\').pop() || windows[activeMobileWindow]?.title}
                  </span>
                </div>

                <button
                  onClick={() => setActiveMobileWindow(null)}
                  className="px-3 py-1 bg-[#e11d48] text-white font-bold text-xs rounded border border-white active:scale-95"
                >
                  ✕ Close
                </button>
              </div>

              {/* Mobile Window Body */}
              <div className="p-3 overflow-y-auto bg-[#1a120e] text-[#f5ebd8] max-h-[70vh]">
                <FolderErrorBoundary
                  folderTitle={windows[activeMobileWindow]?.title}
                  onClose={() => setActiveMobileWindow(null)}
                >
                  {renderWindowContent(activeMobileWindow)}
                </FolderErrorBoundary>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* EASTER EGG OVERLAYS & MODALS */}
      <TerminalWindow
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onYearChange={onYearChange}
      />

      <BSODCrashScreen
        isOpen={isBSODOpen}
        onDismiss={() => setIsBSODOpen(false)}
      />

      <Http404MemoryModal
        isOpen={isHttp404Open}
        onClose={() => setIsHttp404Open(false)}
        onYearChange={onYearChange}
      />

      <WindowsErrorDialog
        isOpen={isWindowsErrorOpen}
        onClose={() => setIsWindowsErrorOpen(false)}
      />

      <SecretPolaroidModal
        isOpen={isSecretPolaroidOpen}
        onClose={() => setIsSecretPolaroidOpen(false)}
      />
    </div>
  );
};
