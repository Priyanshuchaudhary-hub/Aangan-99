import React, { useState, useEffect } from 'react';
import { Sparkles, X, Heart, Save, Share2, Check, RefreshCw, Feather, BookOpen, Volume2, Camera } from 'lucide-react';
import { useSound } from '../hooks/useSound.ts';

interface GeneratedCardData {
  poeticTitle: string;
  yearEraEstimate: string;
  emotionalDescription: string;
  sensoryDetails: string[];
  suggestedVisualMood: string;
  suggestedAmbientSound: string;
  relatedMemories: string[];
  userRawMemory: string;
  createdAt?: string;
}

interface AIMemoryGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EXAMPLE_MEMORIES = [
  "I used to play cricket outside until my mother called me home.",
  "Eating chilled mangoes sitting on the rooftop with cousins during summer vacations.",
  "Floating newspaper boats in monsoon puddles outside our house.",
  "Rewinding tangled cassette tape ribbons using a hexagonal Natraj pencil."
];

export const AIMemoryGeneratorModal: React.FC<AIMemoryGeneratorModalProps> = ({
  isOpen,
  onClose
}) => {
  const { playClick, playChirp } = useSound();
  const [memoryInput, setMemoryInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCard, setGeneratedCard] = useState<GeneratedCardData | null>(null);
  const [savedCards, setSavedCards] = useState<GeneratedCardData[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'saved'>('create');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load saved AI memories from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('aangan_ai_saved_memories');
      if (stored) {
        setSavedCards(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load saved memories:', err);
    }
  }, []);

  if (!isOpen) return null;

  const handleGenerate = async (textToSubmit?: string) => {
    const input = (textToSubmit || memoryInput).trim();
    if (!input) {
      setErrorMsg('Please share a short memory snippet first.');
      return;
    }

    playChirp();
    setErrorMsg(null);
    setIsLoading(true);
    setIsSaved(false);

    try {
      const response = await fetch('/api/memory/generate-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryInput: input })
      });

      const resData = await response.json();
      if (resData.success && resData.data) {
        setGeneratedCard(resData.data);
      } else {
        throw new Error('Failed to generate memory card');
      }
    } catch (err) {
      console.error('AI memory generation error:', err);
      // Fallback preview
      setGeneratedCard({
        poeticTitle: input.toUpperCase().slice(0, 32),
        yearEraEstimate: 'Circa 1999 — Childhood Summer',
        emotionalDescription: `${input}.\n\nEvery evening had the same rule: time stood still until the streetlights turned on.`,
        sensoryDetails: ['Dust on knees', 'Faroff whistle of Ma calling', 'Smell of evening petrichor'],
        suggestedVisualMood: 'Golden hour sunset fading over red brick rooftops',
        suggestedAmbientSound: 'Distant tennis ball bounce + Evening bird chirps',
        relatedMemories: ['Rasna in stainless steel cups', 'Power cut during Shaktimaan'],
        userRawMemory: input
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveLocally = () => {
    if (!generatedCard) return;
    playClick('switch');

    const cardWithTimestamp = {
      ...generatedCard,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    const updated = [cardWithTimestamp, ...savedCards.filter((c) => c.poeticTitle !== generatedCard.poeticTitle)];
    setSavedCards(updated);
    setIsSaved(true);

    try {
      localStorage.setItem('aangan_ai_saved_memories', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  };

  const handleShare = async (card: GeneratedCardData) => {
    playChirp();
    const formattedText = `SUMMER VACATION.EXE — MEMORY IMPRESSION\n\nTITLE: ${card.poeticTitle}\nERA: ${card.yearEraEstimate}\n\n"${card.emotionalDescription}"\n\nYOUR MEMORY: "${card.userRawMemory}"\n\nPreserved at Aangan '99: ${window.location.origin}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Aangan '99 Memory: ${card.poeticTitle}`,
          text: formattedText,
          url: window.location.origin
        });
        return;
      } catch (e) {
        // Fallback to copy
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-memory-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={() => {
        playClick('soft');
        onClose();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#17110c] border-2 border-[#b45309] rounded-2xl p-5 sm:p-6 shadow-2xl text-[#f3ede2] relative overflow-hidden my-auto max-h-[92vh] flex flex-col font-mono"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[#3d2a1d] pb-3 shrink-0">
          <div className="flex items-center gap-2 text-[#f59e0b]">
            <Sparkles className="w-5 h-5 text-[#f59e0b] animate-spin" />
            <h2 id="ai-memory-modal-title" className="text-base sm:text-lg font-bold font-serif-vintage tracking-tight">
              Tell Me Something You Remember (यादों का जादू)
            </h2>
          </div>

          <button
            type="button"
            onClick={() => {
              playClick('soft');
              onClose();
            }}
            className="p-1.5 rounded-lg bg-[#261b14] hover:bg-[#3d2a1f] text-gray-400 hover:text-white transition-colors"
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 my-3 shrink-0">
          <button
            onClick={() => {
              playClick('soft');
              setActiveTab('create');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'create'
                ? 'bg-[#b45309] text-white shadow'
                : 'bg-[#221711] text-gray-400 hover:text-white border border-[#3d2719]'
            }`}
          >
            <Feather className="w-3.5 h-3.5" />
            <span>Create Memory</span>
          </button>

          <button
            onClick={() => {
              playClick('soft');
              setActiveTab('saved');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'saved'
                ? 'bg-[#b45309] text-white shadow'
                : 'bg-[#221711] text-gray-400 hover:text-white border border-[#3d2719]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Saved Memory Box ({savedCards.length})</span>
          </button>
        </div>

        {/* TAB 1: CREATE MEMORY */}
        {activeTab === 'create' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Input Form */}
            {!generatedCard ? (
              <div className="space-y-3">
                <p className="text-xs text-[#a89078] leading-relaxed">
                  Enter a short memory snippet from your childhood. The AI Nostalgia Engine will transform it into an evocative vintage photograph card with sensory details, without inventing personal facts.
                </p>

                <div>
                  <label className="block text-[11px] font-bold text-[#f59e0b] uppercase tracking-wider mb-1">
                    Your Memory Snippet (अपनी एक याद बताएं):
                  </label>
                  <textarea
                    value={memoryInput}
                    onChange={(e) => setMemoryInput(e.target.value)}
                    placeholder='e.g., "I used to play cricket outside until my mother called me home."'
                    rows={3}
                    className="w-full p-3 rounded-xl bg-[#241710] border border-[#523927] text-sm text-[#faecd8] placeholder-gray-500 focus:outline-none focus:border-[#f59e0b] font-mono leading-relaxed"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs text-rose-400 font-semibold">{errorMsg}</p>
                )}

                {/* Example Prompts */}
                <div className="space-y-1.5">
                  <span className="text-[10px] text-[#8a725f] uppercase tracking-wider block font-bold">
                    Need inspiration? Tap an example:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {EXAMPLE_MEMORIES.map((ex, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          playClick('soft');
                          setMemoryInput(ex);
                        }}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-[#20150e] border border-[#3b281b] text-[#d4bd9b] hover:border-[#f59e0b] hover:text-[#fcd34d] text-left transition-colors"
                      >
                        "{ex.slice(0, 38)}..."
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-[#d97706] hover:bg-[#b45309] disabled:opacity-50 text-white font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all mt-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Transmuting Memory through Time...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Transform into Nostalgic Card</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* GENERATED VINTAGE POLAROID CARD DISPLAY */
              <div className="space-y-4">
                <div className="relative bg-[#f8f2e4] text-[#221711] rounded-2xl p-5 border-2 border-[#8c6d53] shadow-2xl space-y-3 font-serif-vintage select-text overflow-hidden">
                  {/* Polaroid Film Grain & Tape Accent */}
                  <div className="scotch-tape w-24 top-2 right-4 rotate-6 opacity-75" />
                  <div className="absolute top-0 right-0 bg-[#800000] text-amber-100 text-[9px] font-mono font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                    NOSTALGIC IMPRESSION ’99
                  </div>

                  {/* Header Titles */}
                  <div className="border-b border-[#d4be9c] pb-2">
                    <span className="text-[10px] font-mono font-bold text-[#8c531d] uppercase tracking-widest block">
                      {generatedCard.yearEraEstimate || 'Circa 1999'}
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-[#3d1100] tracking-tight leading-tight uppercase font-pixel">
                      "{generatedCard.poeticTitle}"
                    </h3>
                  </div>

                  {/* Factual Distinction Banner */}
                  <div className="p-2.5 bg-[#ebdcc0] rounded-lg border border-[#c9b38f] text-xs font-mono space-y-1">
                    <div className="flex items-start gap-1.5 text-[11px] text-[#5e412b]">
                      <strong className="text-[#800000] shrink-0">Your Original Memory:</strong>
                      <span className="italic">"{generatedCard.userRawMemory}"</span>
                    </div>
                  </div>

                  {/* Poetic Expansion */}
                  <div className="p-3 bg-[#f3e9d4] rounded-xl border border-[#dbc7a6] space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#735031] tracking-wider block">
                      ✨ Memory Atmosphere:
                    </span>
                    <p className="text-sm sm:text-base font-serif leading-relaxed text-[#2a1b12] whitespace-pre-line font-medium italic">
                      "{generatedCard.emotionalDescription}"
                    </p>
                  </div>

                  {/* Sensory Details */}
                  {generatedCard.sensoryDetails && generatedCard.sensoryDetails.length > 0 && (
                    <div className="space-y-1 font-mono text-xs">
                      <span className="text-[10px] font-bold text-[#6b4e33] uppercase tracking-wider block">
                        Tactile Sensory Echoes:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {generatedCard.sensoryDetails.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-[#e3d3b5] text-[#3d2616] px-2 py-0.5 rounded border border-[#c2b091] font-semibold"
                          >
                            • {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual & Audio Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono border-t border-[#d4be9c] pt-2">
                    {generatedCard.suggestedVisualMood && (
                      <div className="flex items-center gap-1.5 text-[#5e412b]">
                        <Camera className="w-3.5 h-3.5 text-[#b45309] shrink-0" />
                        <span className="truncate"><strong>Mood:</strong> {generatedCard.suggestedVisualMood}</span>
                      </div>
                    )}

                    {generatedCard.suggestedAmbientSound && (
                      <div className="flex items-center gap-1.5 text-[#5e412b]">
                        <Volume2 className="w-3.5 h-3.5 text-[#b45309] shrink-0" />
                        <span className="truncate"><strong>Audio:</strong> {generatedCard.suggestedAmbientSound}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveLocally}
                    className={`flex-1 min-h-[44px] w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow active:scale-95 transition-all ${
                      isSaved
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#d97706] hover:bg-[#b45309] text-white'
                    }`}
                  >
                    {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    <span>{isSaved ? 'Saved to Memory Box!' : 'Save to Memory Box'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShare(generatedCard)}
                    className="min-h-[44px] w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#2b1e16] hover:bg-[#3d2b20] text-[#f5ebd8] font-bold text-xs border border-[#523c2d] flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Share Impression'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClick('soft');
                      setGeneratedCard(null);
                      setMemoryInput('');
                    }}
                    className="min-h-[44px] w-full sm:w-auto py-2.5 px-4 rounded-xl bg-[#20150e] text-gray-300 hover:text-white font-bold text-xs border border-[#382619]"
                  >
                    Create New
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED MEMORY BOX */}
        {activeTab === 'saved' && (
          <div className="space-y-3 overflow-y-auto pr-1">
            {savedCards.length === 0 ? (
              <div className="text-center py-8 space-y-2 text-[#a89078]">
                <BookOpen className="w-8 h-8 mx-auto text-[#785942]" />
                <p className="text-sm">Your local Memory Box is currently empty.</p>
                <p className="text-xs text-[#8a705a]">
                  Share a memory in the "Create Memory" tab to generate and save your nostalgic impressions locally!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {savedCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#201610] rounded-xl border border-[#4a3526] text-[#f3ede2] space-y-2 relative"
                  >
                    <div className="flex items-center justify-between border-b border-[#3d2a1e] pb-1.5">
                      <strong className="text-sm font-bold text-[#f59e0b] font-pixel">
                        "{card.poeticTitle}"
                      </strong>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {card.createdAt || card.yearEraEstimate}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 italic font-serif leading-relaxed line-clamp-3">
                      "{card.emotionalDescription}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-[10px] text-[#a88a70]">
                        Raw: "{card.userRawMemory.slice(0, 30)}..."
                      </span>

                      <button
                        onClick={() => handleShare(card)}
                        className="p-1.5 rounded bg-[#2d1e16] hover:bg-[#3d2b20] text-[#fcd34d] flex items-center gap-1 font-bold"
                      >
                        <Share2 className="w-3 h-3" /> Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
