import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Mail, Sparkles, Compass, MessageSquare, RefreshCw, Stamp } from 'lucide-react';
import { MemoryTelegramData } from '../types.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

const CITIES = [
  'Kanpur (कानपुर)',
  'Kolkata (कोलकाता)',
  'Pune (पुणे)',
  'Shimla (शिमला)',
  'Lucknow (लखनऊ)',
  'Jaipur (जयपुर)',
  'Patna (पटना)',
  'Varanasi (वाराणसी)',
  'Delhi 110001',
  'Mumbai 400001',
  'Bengaluru 560001'
];

const MEMORY_THEMES = [
  { key: 'monsoon', label: 'Monsoon Rain & Hot Pakodas' },
  { key: 'powercut', label: 'Summer Afternoon Power Cut' },
  { key: 'gullycricket', label: 'Gully Cricket & Sharma ji Ball Loss' },
  { key: 'sundaytv', label: 'Sunday Morning Doordarshan Marathon' },
  { key: 'schoolrecess', label: 'School Recess & 1-Rupee Phantom Candy' },
];

export const MemoryTelegramPostcard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>('1998');
  const [selectedCity, setSelectedCity] = useState<string>('Kanpur (कानपुर)');
  const [selectedTheme, setSelectedTheme] = useState<string>('monsoon');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [postcardData, setPostcardData] = useState<MemoryTelegramData>({
    sender: 'Guddu',
    locationStamp: 'Kanpur GPO — July 1998',
    headline: 'Rain drops drumming on the tin veranda',
    postcardBody:
      'The electricity just went out during Captain Vyom. Ma fried hot onion bhajiyas and poured steaming ginger chai into steel glasses while we folded paper boats from the Dainik Jagran newspaper.',
    psNote: "P.S. Keep your Natraj pencil ready; the audio cassette tape ribbon got tangled again!",
    ambientSoundscape: 'Monsoon Rain + Ceiling Fan Hum'
  });

  // Memory Oracle State
  const [oracleQuestion, setOracleQuestion] = useState<string>('');
  const [oracleAnswer, setOracleAnswer] = useState<string | null>(null);
  const [isOracleLoading, setIsOracleLoading] = useState<boolean>(false);

  const handleGeneratePostcard = async () => {
    setIsLoading(true);
    audioSynthesizer.playClick('switch');

    try {
      const res = await fetch('/api/memory/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: selectedYear,
          city: selectedCity,
          memoryType: selectedTheme,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setPostcardData(json.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskOracle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oracleQuestion.trim()) return;

    setIsOracleLoading(true);
    audioSynthesizer.playClick('switch');

    try {
      const res = await fetch('/api/memory/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: oracleQuestion.trim() }),
      });
      const json = await res.json();
      if (json.success && json.answer) {
        setOracleAnswer(json.answer);
      }
    } catch (e) {
      console.error(e);
      setOracleAnswer('Remember when afternoon meant watching the dust motes dance in the sunlight through the wooden window? That feeling never faded.');
    } finally {
      setIsOracleLoading(false);
    }
  };

  return (
    <div id="memory-telegram" className="w-full p-4 md:p-8 rounded-2xl bg-[#17120f] border-2 border-[#543c2b] shadow-2xl relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3b281b] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-pixel rounded bg-[#0284c7]/30 text-[#38bdf8] border border-[#0284c7]/60">
                INDIAN POSTAL SERVICE ’99
              </span>
              <span className="text-xs text-[#a3907c] font-mono">50 PAISE MEGHDOOT POSTCARD</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#f5ebd8] font-serif-vintage mt-1">
              डाकघर (Postcard from the Past)
            </h2>
            <p className="text-xs text-[#b8a490] font-handwriting text-base">
              Send a time-capsule telegram to any Indian town between 1990 and 2005
            </p>
          </div>
        </div>

        {/* Generator Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-[#110d0b] rounded-xl border border-[#3b281b]">
          <div>
            <label className="block text-xs font-mono text-[#a3907c] mb-1 uppercase">
              1. Era Year:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full p-2 rounded bg-[#1e1510] border border-[#523825] text-[#f5ebd8] text-xs font-mono"
            >
              <option value="1992">1992 (Gold Spot & DD1)</option>
              <option value="1995">1995 (Jungle Book & Shaktimaan)</option>
              <option value="1998">1998 (Desert Storm Sharjah)</option>
              <option value="2001">2001 (Indipop & Natraj Pencils)</option>
              <option value="2004">2004 (Cyber Cafes & Slam Books)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#a3907c] mb-1 uppercase">
              2. Indian City:
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full p-2 rounded bg-[#1e1510] border border-[#523825] text-[#f5ebd8] text-xs font-mono"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-[#a3907c] mb-1 uppercase">
              3. Memory Theme:
            </label>
            <select
              value={selectedTheme}
              onChange={(e) => setSelectedTheme(e.target.value)}
              className="w-full p-2 rounded bg-[#1e1510] border border-[#523825] text-[#f5ebd8] text-xs font-mono"
            >
              {MEMORY_THEMES.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              onClick={handleGeneratePostcard}
              disabled={isLoading}
              className="w-full py-3 bg-[#c2842e] hover:bg-[#db9635] active:bg-[#9a651c] text-[#120f0e] font-bold text-xs uppercase font-pixel tracking-wider rounded-lg border-2 border-[#e5a93c] shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Mail className="w-4 h-4" />
              <span>{isLoading ? 'Writing Postcard via Telegram...' : 'Request Postcard from That Year'}</span>
            </button>
          </div>
        </div>

        {/* Vintage Postcard Display with tactile tilt & scotch tape */}
        <motion.div
          key={postcardData.headline}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 rounded-2xl paper-texture border-4 border-[#8c6d48] text-[#1a1411] space-y-6 shadow-2xl relative rotate-1"
        >
          {/* Tape */}
          <div className="scotch-tape -top-2.5 left-10 w-24 rotate-[-3deg]" />
          <div className="scotch-tape -top-2.5 right-12 w-20 rotate-[4deg]" />

          {/* Chai stain on corner */}
          <div className="chai-stain w-24 h-24 bottom-4 right-6 opacity-30" />

          {/* Postcard Top Section */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b-2 border-red-900/30 pb-4">
            <div>
              <div className="flex items-center gap-2 text-red-900 font-pixel text-xs uppercase tracking-widest">
                <span>भारतीय डाक तार विभाग</span>
                <span>•</span>
                <span>INDIAN POST & TELEGRAPH</span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold font-serif-vintage text-red-950 mt-1">
                "{postcardData.headline}"
              </h3>
              <p className="text-xs font-mono text-gray-700">{postcardData.locationStamp}</p>
            </div>

            {/* Vintage Postmark Stamp */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-20 rounded p-1.5 bg-[#ebdccb] border-2 border-dashed border-red-800 text-center flex flex-col justify-between shadow-xs">
                <span className="text-[9px] font-mono font-bold text-red-900 uppercase">INDIA</span>
                <span className="text-2xl">🪔</span>
                <span className="text-[9px] font-mono text-gray-700">50 PAISE</span>
              </div>

              {/* Round Postal Cancellation Stamp Seal */}
              <div className="rubber-stamp text-[8px] py-1 px-2 border-[#8c2d2d] text-[#8c2d2d] -rotate-12">
                <div className="text-center">
                  <div>G.P.O {selectedYear}</div>
                  <div className="text-[7px]">DELIVERED</div>
                </div>
              </div>
            </div>
          </div>

          {/* Postcard Letter Content */}
          <div className="space-y-4">
            <p className="text-lg md:text-xl font-handwriting leading-relaxed text-[#261d17]">
              {postcardData.postcardBody}
            </p>

            <div className="p-3 bg-red-50/70 rounded-lg border border-red-200 text-xs font-handwriting text-red-950">
              {postcardData.psNote}
            </div>
          </div>

          {/* Sender & Sensory Audio Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-dashed border-gray-300 pt-3 text-xs font-mono text-gray-600">
            <div>
              Sender: <strong className="font-handwriting text-base text-gray-900">{postcardData.sender}</strong>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700">
              <span>🔊 Ambient:</span>
              <span className="font-bold font-handwriting text-sm text-red-900">
                {postcardData.ambientSoundscape}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 90s MEMORY ORACLE */}
        <div className="p-6 rounded-2xl bg-[#110d0b] border border-[#3b281b] space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#e5a93c]" />
            <h3 className="text-lg font-bold font-serif-vintage text-[#f5ebd8]">
              Ask the 90s Memory Oracle (यादों का आईना)
            </h3>
          </div>
          <p className="text-xs text-[#a3907c] font-typewriter">
            Ask any question about childhood in India (e.g. "What happened to the water cooler?", "Why did we blow air on video game cartridges?")
          </p>

          <form onSubmit={handleAskOracle} className="flex gap-2">
            <input
              type="text"
              value={oracleQuestion}
              onChange={(e) => setOracleQuestion(e.target.value)}
              placeholder="e.g. Why did Sunday mornings feel so long and magical?"
              className="flex-1 p-3 rounded-lg bg-[#1e1510] border border-[#523825] text-[#f5ebd8] text-xs font-typewriter focus:outline-none focus:border-[#e5a93c]"
            />
            <button
              type="submit"
              disabled={isOracleLoading}
              className="px-5 py-3 bg-[#b45309] hover:bg-[#d97706] text-white font-pixel text-xs uppercase font-bold rounded-lg border border-[#f59e0b] transition-transform active:scale-95 disabled:opacity-50"
            >
              {isOracleLoading ? 'Consulting 1999...' : 'Ask Oracle'}
            </button>
          </form>

          {oracleAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-[#1e1510] border border-[#523825] text-xs font-handwriting text-base text-[#fef08a] leading-relaxed"
            >
              "{oracleAnswer}"
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
