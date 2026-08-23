import React, { useState } from 'react';
import { X, Copy, Check, Ticket, Train, Sparkles, Heart, Share2, Send } from 'lucide-react';
import { useSound } from '../../hooks/useSound.ts';
import { MEMORY_EXPLORER_ITEMS, MemoryItem } from '../../data/memoryExplorerData.ts';

interface ShareTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedYear?: number;
  memoryItem?: MemoryItem | null;
  onSelectMemory?: (item: MemoryItem) => void;
}

export const ShareTicketModal: React.FC<ShareTicketModalProps> = ({
  isOpen,
  onClose,
  selectedYear = 2004,
  memoryItem,
  onSelectMemory
}) => {
  const { playClick, playChirp } = useSound();
  const [copied, setCopied] = useState(false);
  const [sharedToast, setSharedToast] = useState(false);

  // Fallback to first memory item if none passed
  const activeMemory = memoryItem || MEMORY_EXPLORER_ITEMS[0];
  const memorySlug = activeMemory.id.replace(/^mem-/, '');
  const displayYear = activeMemory.year || selectedYear || 2004;

  if (!isOpen) return null;

  const shareableUrl = `${window.location.origin}/memory/${memorySlug}`;

  const formattedTicketText = `SUMMER VACATION.EXE
MEMORY TICKET

YEAR:
${displayYear}

DESTINATION:
Childhood

PASSENGER:
Someone who remembers

SEAT:
Window

MEMORY:
${activeMemory.title} (${activeMemory.hindiTitle})

STATUS:
"You were there."

---
Preserved at Aangan '99: ${shareableUrl}`;

  // Web Share API handler ("Send this memory")
  const handleSendMemory = async () => {
    playChirp();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `SUMMER VACATION.EXE — Memory Ticket: ${activeMemory.title}`,
          text: `SUMMER VACATION.EXE\n\nMEMORY TICKET\nYEAR: ${displayYear}\nDESTINATION: Childhood\nPASSENGER: Someone who remembers\nSEAT: Window\nMEMORY: ${activeMemory.title}\nSTATUS: "You were there."`,
          url: shareableUrl
        });
        setSharedToast(true);
        setTimeout(() => setSharedToast(false), 3000);
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        console.log('Share dismissed or unavailable, falling back to copy', err);
      }
    }

    // Fallback: Copy to clipboard
    handleCopyLink();
  };

  const handleCopyLink = () => {
    playChirp();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(formattedTicketText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2800);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ticket-pass-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={() => {
        playClick('soft');
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-[#18120e] border-2 border-[#b45309] rounded-2xl p-5 sm:p-6 shadow-2xl text-[#f3ede2] relative overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 mb-4 border-b border-[#3d2a1d] pb-3">
          <div className="flex items-center gap-2 text-[#fbbf24]">
            <Ticket className="w-5 h-5 text-[#f59e0b]" aria-hidden="true" />
            <h2 id="ticket-pass-title" className="text-base sm:text-lg font-bold font-serif-vintage tracking-tight">
              SUMMER VACATION.EXE • Memory Ticket
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              playClick('switch');
              onClose();
            }}
            aria-label="Close ticket modal"
            className="p-1 rounded-lg text-[#9ca3af] hover:text-white hover:bg-white/10 transition-colors focus-visible:ring-2 focus-visible:ring-[#f59e0b]"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Memory Selector if user wants to generate ticket for another memory */}
        {MEMORY_EXPLORER_ITEMS.length > 0 && (
          <div className="mb-4">
            <label className="block text-[10px] font-pixel uppercase text-[#a89582] mb-1">
              Select Memory Capsule (यादों की टिकट चुनीं):
            </label>
            <select
              value={activeMemory.id}
              onChange={(e) => {
                const target = MEMORY_EXPLORER_ITEMS.find((m) => m.id === e.target.value);
                if (target && onSelectMemory) {
                  playClick('soft');
                  onSelectMemory(target);
                }
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-[#251a13] border border-[#543b27] text-xs font-mono text-[#faecd8] focus:outline-none focus:border-[#f59e0b]"
            >
              {MEMORY_EXPLORER_ITEMS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.visualEmoji} {item.title} ({item.year}) — {item.hindiTitle}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* AUTHENTIC VINTAGE INDIAN BUS & RAILWAY THERMAL MEMORY TICKET CARD */}
        <div className="relative bg-[#f7f0df] text-[#241a13] rounded-xl p-5 border-2 border-[#8c6d53] shadow-2xl mb-5 font-mono text-xs overflow-hidden select-text">
          {/* Faded thermal texture overlay & watermark */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-transparent to-amber-900/10 pointer-events-none" />

          {/* Dot-matrix Tractor Feed Holes along left & right margins */}
          <div className="absolute left-1 top-0 bottom-0 w-2.5 flex flex-col justify-around py-2 opacity-30 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-black/50" />
            ))}
          </div>
          <div className="absolute right-1 top-0 bottom-0 w-2.5 flex flex-col justify-around py-2 opacity-30 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-black/50" />
            ))}
          </div>

          <div className="pl-3 pr-3 space-y-3.5 relative z-10">
            {/* Top Ticket Header Banner */}
            <div className="flex items-center justify-between border-b-2 border-dashed border-[#8c6d53] pb-2.5">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-[#800000] text-xs sm:text-sm tracking-wider font-pixel">
                  <Train className="w-4 h-4 text-[#800000]" />
                  <span>SUMMER VACATION.EXE</span>
                </div>
                <div className="text-[10px] text-[#6b4e33] font-mono tracking-widest font-semibold uppercase">
                  MEMORY TICKET • PNR: 99-DD1-{memorySlug.toUpperCase().slice(0, 10)}
                </div>
              </div>

              <span className="bg-[#800000] text-[#fff5ea] px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                CONFIRMED
              </span>
            </div>

            {/* Core Required Fields from Spec */}
            <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[12px] leading-snug">
              <div className="border-b border-[#dac8ad] pb-1">
                <span className="text-[#7c6351] block text-[10px] font-bold uppercase tracking-wider">
                  YEAR:
                </span>
                <strong className="text-sm font-bold text-[#800000] font-mono">
                  {displayYear}
                </strong>
              </div>

              <div className="border-b border-[#dac8ad] pb-1">
                <span className="text-[#7c6351] block text-[10px] font-bold uppercase tracking-wider">
                  DESTINATION:
                </span>
                <strong className="text-sm font-bold text-[#047857] font-serif">
                  Childhood
                </strong>
              </div>

              <div className="border-b border-[#dac8ad] pb-1">
                <span className="text-[#7c6351] block text-[10px] font-bold uppercase tracking-wider">
                  PASSENGER:
                </span>
                <strong className="text-sm font-bold text-[#1f1610] font-serif">
                  Someone who remembers
                </strong>
              </div>

              <div className="border-b border-[#dac8ad] pb-1">
                <span className="text-[#7c6351] block text-[10px] font-bold uppercase tracking-wider">
                  SEAT:
                </span>
                <strong className="text-sm font-bold text-[#1f1610] font-serif">
                  Window
                </strong>
              </div>
            </div>

            {/* Selected Memory Title Field */}
            <div className="p-2.5 bg-[#ebdcc0] rounded-lg border border-[#cbbb9c] space-y-1">
              <span className="text-[#7c6351] block text-[10px] font-bold uppercase tracking-wider">
                MEMORY:
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeMemory.visualEmoji}</span>
                <div>
                  <strong className="text-sm font-bold text-[#3b125f] font-serif-vintage block leading-tight">
                    {activeMemory.title}
                  </strong>
                  <span className="text-[11px] font-handwriting text-[#6b4e33]">
                    {activeMemory.hindiTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Status Highlight & Rubber Stamp */}
            <div className="p-2.5 bg-[#f0e3ca] rounded-lg border border-[#cbbb9c] flex items-center justify-between gap-2">
              <div>
                <span className="text-[#7c6351] block text-[10px] font-bold uppercase tracking-wider">
                  STATUS:
                </span>
                <strong className="text-sm font-bold text-[#b45309] font-serif flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  "You were there."
                </strong>
              </div>

              {/* Distressed Rubber Stamp Seal */}
              <div className="text-right">
                <span className="rubber-stamp text-[10px] sm:text-[11px] px-2 py-0.5 rotate-[-4deg] inline-block font-bold shadow-sm">
                  ★ NON-REFUNDABLE MEMORY ★
                </span>
              </div>
            </div>

            {/* Deep-link URL Display */}
            <div className="pt-1.5 border-t border-dashed border-[#8c6d53] flex items-center justify-between text-[10px] text-[#7c6351]">
              <span className="truncate max-w-[280px]">
                Link: <strong className="font-mono text-[#800000]">{shareableUrl}</strong>
              </span>
              <span className="flex items-center gap-1 text-rose-800 font-bold shrink-0">
                <Heart className="w-3 h-3 fill-current" /> Never Forgotten
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={handleSendMemory}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#d97706] hover:bg-[#b45309] text-white font-bold text-xs tracking-wide shadow-lg transition-transform active:scale-95 focus-visible:ring-2 focus-visible:ring-white"
          >
            <Send className="w-4 h-4 text-white" />
            <span>Send This Memory</span>
          </button>

          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#2e1f17] hover:bg-[#3d2a1f] text-[#f5ebd8] font-bold text-xs border border-[#523927] transition-all active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClick('soft');
              onClose();
            }}
            className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#221a15] hover:bg-[#332720] text-[#9ca3af] font-semibold text-xs border border-[#3d2c20] transition-colors"
          >
            Close
          </button>
        </div>

        {sharedToast && (
          <p className="text-center text-xs font-mono text-emerald-400 mt-2">
            ✓ Memory ticket shared successfully!
          </p>
        )}
      </div>
    </div>
  );
};

