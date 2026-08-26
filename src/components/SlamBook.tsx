import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { BookOpen, PenTool, Sparkles, Heart, ChevronLeft, ChevronRight, PlusCircle, Check } from 'lucide-react';
import { collection, onSnapshot, addDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase.ts';
import { SLAM_BOOK_INITIAL_ENTRIES } from '../data/nostalgiaData.ts';
import { SlamBookEntry } from '../types.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

const GEL_PENS = [
  { key: 'blue', label: 'Glitter Blue', cssColor: '#1d4ed8', borderClass: 'border-blue-500', textClass: 'text-blue-900' },
  { key: 'pink', label: 'Neon Pink', cssColor: '#db2777', borderClass: 'border-pink-500', textClass: 'text-pink-900' },
  { key: 'purple', label: 'Glitter Purple', cssColor: '#7e22ce', borderClass: 'border-purple-500', textClass: 'text-purple-900' },
  { key: 'green', label: 'Emerald Green', cssColor: '#047857', borderClass: 'border-emerald-500', textClass: 'text-emerald-900' },
  { key: 'gold', label: 'Golden Sparkle', cssColor: '#b45309', borderClass: 'border-amber-500', textClass: 'text-amber-900' },
];

const DOODLE_EMOJIS = ['🏏', '📼', '✨', '⛵', '🍬', '🚀', '🧸', '🎮', '❤️'];

export const SlamBook: React.FC = () => {
  const [entries, setEntries] = useState<SlamBookEntry[]>(SLAM_BOOK_INITIAL_ENTRIES);

  useEffect(() => {
    try {
      const q = query(collection(db, 'slambook_entries'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const fetchedDocs: SlamBookEntry[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || 'Anonymous',
              nickname: data.nickname || 'Guddu',
              year: data.year || '1999',
              city: data.city || 'Doordarshan Colony',
              favoriteCartoon: data.favoriteCartoon || 'SWAT Kats',
              oneRupeeCandy: data.oneRupeeCandy || 'Phantom Sweet Cigarettes',
              year2000DreamCareer: data.year2000DreamCareer || 'Astronaut',
              bestMemory: data.bestMemory || '',
              penColor: data.penColor || 'blue',
              timestamp: data.timestamp || Date.now(),
              doodleEmoji: data.doodleEmoji || '✨',
            };
          });
          setEntries([...fetchedDocs, ...SLAM_BOOK_INITIAL_ENTRIES]);
        }
      }, (err) => {
        console.warn('[FIRESTORE SLAMBOOK LISTEN WARN]', err);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('[FIRESTORE INITIALIZATION EXCEPTION]', e);
    }
  }, []);

  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [isSigningModalOpen, setIsSigningModalOpen] = useState<boolean>(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formNickname, setFormNickname] = useState('');
  const [formYear, setFormYear] = useState('1999');
  const [formCity, setFormCity] = useState('');
  const [formCartoon, setFormCartoon] = useState('');
  const [formCandy, setFormCandy] = useState('');
  const [formDreamCareer, setFormDreamCareer] = useState('');
  const [formMemory, setFormMemory] = useState('');
  const [formPenColor, setFormPenColor] = useState<'blue' | 'pink' | 'purple' | 'green' | 'gold'>('blue');
  const [formDoodle, setFormDoodle] = useState('✨');

  useEffect(() => {
    try {
      localStorage.setItem('aangan99_slambook', JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
  }, [entries]);

  const currentEntry = entries[activePageIndex] || entries[0];

  const handleNextPage = () => {
    audioSynthesizer.playPaperRustle();
    setActivePageIndex((prev) => (prev + 1) % entries.length);
  };

  const handlePrevPage = () => {
    audioSynthesizer.playPaperRustle();
    setActivePageIndex((prev) => (prev - 1 + entries.length) % entries.length);
  };

  const handleSubmitSlamEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formMemory.trim()) return;

    audioSynthesizer.playClick('switch');

    const entryData = {
      name: formName.trim(),
      nickname: formNickname.trim() || 'Guddu',
      year: formYear,
      city: formCity.trim() || 'Doordarshan Colony',
      favoriteCartoon: formCartoon.trim() || 'SWAT Kats / Jungle Book',
      oneRupeeCandy: formCandy.trim() || 'Phantom Sweet Cigarettes',
      year2000DreamCareer: formDreamCareer.trim() || 'Astronaut / Pilot',
      bestMemory: formMemory.trim(),
      penColor: formPenColor,
      timestamp: Date.now(),
      doodleEmoji: formDoodle,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'slambook_entries'), entryData);
    } catch (err) {
      console.error('[FIRESTORE ADD SLAMBOOK ENTRY ERROR]', err);
    }

    const newEntry: SlamBookEntry = {
      id: `slam-${Date.now()}`,
      ...entryData,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setActivePageIndex(0);
    setIsSigningModalOpen(false);

    // Reset Form
    setFormName('');
    setFormNickname('');
    setFormCity('');
    setFormCartoon('');
    setFormCandy('');
    setFormDreamCareer('');
    setFormMemory('');

    confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
  };

  const penConfig = GEL_PENS.find((p) => p.key === currentEntry.penColor) || GEL_PENS[0];

  return (
    <div id="slam-book" className="w-full p-4 md:p-8 rounded-2xl bg-[#1a1411] border-2 border-[#543c2b] shadow-2xl relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3b281b] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-pixel rounded bg-[#db2777]/30 text-[#f472b6] border border-[#db2777]/60">
                CLASSROOM SLAM BOOK ’99
              </span>
              <span className="text-xs text-[#a3907c] font-mono">GLITTER GEL PENS & STICKERS</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#f5ebd8] font-serif-vintage mt-1">
              The Golden Memories Slam Book
            </h2>
            <p className="text-xs text-[#b8a490] font-handwriting text-base">
              "Never forget our friendship, even when we turn 25!" — Written on the last day of class 10th
            </p>
          </div>

          <button
            onClick={() => {
              audioSynthesizer.playClick('switch');
              setIsSigningModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#db2777] hover:bg-[#ec4899] active:bg-[#be185d] text-white font-bold text-xs uppercase font-pixel tracking-wider rounded-lg border-2 border-pink-950 shadow-lg transition-transform active:scale-95"
          >
            <PenTool className="w-4 h-4" />
            <span>Sign the Slam Book</span>
          </button>
        </div>

        {/* Slam Book Diary Layout */}
        <div className="relative mx-auto max-w-2xl">
          {/* Spiral binding rings graphic */}
          <div className="absolute -top-3 left-8 right-8 flex justify-between z-20 pointer-events-none">
            {[...Array(14)].map((_, i) => (
              <div key={i} className="w-2.5 h-6 rounded-full bg-gradient-to-b from-[#8f7560] to-[#2c2017] border border-[#523d2b] shadow" />
            ))}
          </div>

          {/* Diary Page with controlled tilt and scotch tape */}
          <div className="p-6 md:p-8 rounded-2xl paper-texture border-4 border-[#8c6d48] shadow-2xl text-[#1a1411] space-y-6 relative overflow-hidden -rotate-1">
            {/* Corner Scotch Tape strips */}
            <div className="scotch-tape -top-2 left-6 w-20 rotate-[-5deg]" />
            <div className="scotch-tape -top-2 right-6 w-20 rotate-[6deg]" />

            {/* Top Page Header */}
            <div className="flex items-center justify-between border-b-2 border-dashed border-gray-400/80 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentEntry.doodleEmoji}</span>
                <div>
                  <h3 className={`text-2xl font-bold font-handwriting ${penConfig.textClass}`}>
                    {currentEntry.name}
                  </h3>
                  <p className="text-xs font-mono text-gray-600">
                    Nickname: <span className="font-bold">"{currentEntry.nickname}"</span> • {currentEntry.city} ({currentEntry.year})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevPage}
                  className="p-2 rounded hover:bg-black/10 text-gray-700 transition-colors"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-mono text-gray-600">
                  {activePageIndex + 1} / {entries.length}
                </span>
                <button
                  onClick={handleNextPage}
                  className="p-2 rounded hover:bg-black/10 text-gray-700 transition-colors"
                  title="Next Page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-white/70 rounded-lg border border-gray-300/80 shadow-xs space-y-1">
                <span className="text-[10px] text-gray-500 uppercase">1. Favourite 90s Cartoon:</span>
                <p className={`text-base font-handwriting font-bold ${penConfig.textClass}`}>
                  {currentEntry.favoriteCartoon}
                </p>
              </div>

              <div className="p-3 bg-white/70 rounded-lg border border-gray-300/80 shadow-xs space-y-1">
                <span className="text-[10px] text-gray-500 uppercase">2. 1-Rupee Candy Obsession:</span>
                <p className={`text-base font-handwriting font-bold ${penConfig.textClass}`}>
                  {currentEntry.oneRupeeCandy}
                </p>
              </div>

              <div className="p-3 bg-white/70 rounded-lg border border-gray-300/80 shadow-xs space-y-1 sm:col-span-2">
                <span className="text-[10px] text-gray-500 uppercase">3. Dream Career in Year 2000:</span>
                <p className={`text-base font-handwriting font-bold ${penConfig.textClass}`}>
                  {currentEntry.year2000DreamCareer}
                </p>
              </div>

              <div className="p-4 bg-white/80 rounded-lg border-2 border-dashed border-gray-300/90 shadow-sm space-y-1 sm:col-span-2">
                <span className="text-[10px] text-gray-500 uppercase">4. A Golden Childhood Memory:</span>
                <p className={`text-lg font-handwriting leading-relaxed ${penConfig.textClass}`}>
                  "{currentEntry.bestMemory}"
                </p>
              </div>
            </div>

            {/* Bottom Polaroid Sticker Quote */}
            <div className="flex items-center justify-between text-[11px] font-handwriting text-gray-600 border-t border-gray-300 pt-3">
              <span>Friends Forever (F.F) ❤️</span>
              <span>Signed with: {penConfig.label}</span>
            </div>
          </div>
        </div>

        {/* SIGNING MODAL */}
        <AnimatePresence>
          {isSigningModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="w-full max-w-lg p-6 rounded-2xl paper-texture border-4 border-[#8c6d48] text-[#1c1815] space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between border-b-2 border-pink-900/30 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✒️</span>
                    <h3 className="text-xl font-bold font-serif-vintage text-pink-950">
                      Sign the 1999 Slam Book
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsSigningModalOpen(false)}
                    className="text-sm px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded font-mono"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmitSlamEntry} className="space-y-3 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="e.g. Priyanshu / Monu"
                        className="w-full p-2 rounded border border-gray-400 bg-white text-gray-900 font-handwriting text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Nickname (उपनाम)</label>
                      <input
                        type="text"
                        value={formNickname}
                        onChange={(e) => setFormNickname(e.target.value)}
                        placeholder="e.g. Guddu / Chhotu"
                        className="w-full p-2 rounded border border-gray-400 bg-white text-gray-900 font-handwriting text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Era Year</label>
                      <select
                        value={formYear}
                        onChange={(e) => setFormYear(e.target.value)}
                        className="w-full p-2 rounded border border-gray-400 bg-white text-gray-900 font-mono"
                      >
                        <option value="1995">1995</option>
                        <option value="1998">1998</option>
                        <option value="1999">1999</option>
                        <option value="2001">2001</option>
                        <option value="2004">2004</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Your Hometown / City</label>
                      <input
                        type="text"
                        value={formCity}
                        onChange={(e) => setFormCity(e.target.value)}
                        placeholder="e.g. Kanpur, Pune, Patna"
                        className="w-full p-2 rounded border border-gray-400 bg-white text-gray-900 font-handwriting text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Favourite 90s Cartoon</label>
                      <input
                        type="text"
                        value={formCartoon}
                        onChange={(e) => setFormCartoon(e.target.value)}
                        placeholder="e.g. SWAT Kats, TaleSpin"
                        className="w-full p-2 rounded border border-gray-400 bg-white text-gray-900 font-handwriting text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">1-Rupee Candy Memory</label>
                      <input
                        type="text"
                        value={formCandy}
                        onChange={(e) => setFormCandy(e.target.value)}
                        placeholder="e.g. Kismi Bar, Mango Mood"
                        className="w-full p-2 rounded border border-gray-400 bg-white text-gray-900 font-handwriting text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Dream Career in Year 2000</label>
                    <input
                      type="text"
                      value={formDreamCareer}
                      onChange={(e) => setFormDreamCareer(e.target.value)}
                      placeholder="e.g. Video game developer, Pilot, Cricket Captain"
                      className="w-full p-2 rounded border border-gray-400 bg-white text-gray-900 font-handwriting text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-bold mb-1">A Heartfelt Childhood Memory *</label>
                    <textarea
                      required
                      rows={3}
                      value={formMemory}
                      onChange={(e) => setFormMemory(e.target.value)}
                      placeholder="e.g. Sitting on the terrace under the starry night sky during a summer power cut..."
                      className="w-full p-2 rounded border border-gray-400 bg-white text-gray-900 font-handwriting text-base"
                    />
                  </div>

                  {/* Gel Pen Color Selection */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Choose Glitter Gel Pen Color</label>
                    <div className="flex items-center gap-2">
                      {GEL_PENS.map((pen) => (
                        <button
                          key={pen.key}
                          type="button"
                          onClick={() => setFormPenColor(pen.key as any)}
                          className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform ${
                            formPenColor === pen.key ? 'scale-110 border-black ring-2 ring-pink-400' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: pen.cssColor }}
                        >
                          {formPenColor === pen.key && <Check className="w-4 h-4 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Doodle Sticker */}
                  <div>
                    <label className="block text-gray-700 font-bold mb-1">Pick your Slam Book Stamp</label>
                    <div className="flex items-center gap-2">
                      {DOODLE_EMOJIS.map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setFormDoodle(emoji)}
                          className={`p-1.5 rounded text-lg border transition-transform ${
                            formDoodle === emoji ? 'bg-pink-100 border-pink-500 scale-110' : 'border-gray-300'
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#db2777] hover:bg-[#ec4899] text-white font-bold font-pixel text-sm uppercase tracking-wider rounded-lg border-2 border-pink-950 shadow-lg mt-2 transition-transform active:scale-95"
                  >
                    Stamp & Write into Slam Book!
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
