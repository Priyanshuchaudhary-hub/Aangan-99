import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Flame, Gamepad2, Package, RefreshCw, Award, Heart, HelpCircle } from 'lucide-react';
import { TRUMP_CARDS } from '../data/nostalgiaData.ts';
import { TrumpCard } from '../types.ts';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

type TrunkTab = 'trumpcards' | 'flames' | 'brickgame' | 'artifacts';

export const MemoryTrunk: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TrunkTab>('trumpcards');

  // --- TRUMP CARDS STATE ---
  const [playerCardIndex, setPlayerCardIndex] = useState<number>(0);
  const [cpuCardIndex, setCpuCardIndex] = useState<number>(1);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);
  const [roundResult, setRoundResult] = useState<'win' | 'lose' | 'tie' | null>(null);
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [cpuScore, setCpuScore] = useState<number>(0);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const playerCard: TrumpCard = TRUMP_CARDS[playerCardIndex];
  const cpuCard: TrumpCard = TRUMP_CARDS[cpuCardIndex];

  const handleStatSelect = (statKey: keyof TrumpCard['stats'], statName: string) => {
    if (isRevealed) return;
    audioSynthesizer.playClick('switch');
    setSelectedStat(statName);
    setIsRevealed(true);

    const playerVal = playerCard.stats[statKey];
    const cpuVal = cpuCard.stats[statKey];

    setTimeout(() => {
      if (playerVal > cpuVal) {
        setRoundResult('win');
        setPlayerScore((prev) => prev + 1);
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
      } else if (playerVal < cpuVal) {
        setRoundResult('lose');
        setCpuScore((prev) => prev + 1);
      } else {
        setRoundResult('tie');
      }
    }, 400);
  };

  const handleNextRound = () => {
    audioSynthesizer.playClick('soft');
    setIsRevealed(false);
    setSelectedStat(null);
    setRoundResult(null);
    setPlayerCardIndex((prev) => (prev + 1) % TRUMP_CARDS.length);
    setCpuCardIndex((prev) => (prev + 2) % TRUMP_CARDS.length);
  };

  // --- FLAMES STATE ---
  const [name1, setName1] = useState<string>('Rahul');
  const [name2, setName2] = useState<string>('Anjali');
  const [flamesResult, setFlamesResult] = useState<{ letter: string; word: string; meaning: string } | null>(null);
  const [isCalculatingFlames, setIsCalculatingFlames] = useState<boolean>(false);

  const calculateFLAMES = () => {
    if (!name1.trim() || !name2.trim()) return;
    audioSynthesizer.playClick('switch');
    setIsCalculatingFlames(true);
    setFlamesResult(null);

    // FLAMES Algorithm
    const clean1 = name1.toLowerCase().replace(/\s+/g, '').split('');
    const clean2 = name2.toLowerCase().replace(/\s+/g, '').split('');

    const matched1 = [...clean1];
    const matched2 = [...clean2];

    for (let i = 0; i < matched1.length; i++) {
      const char = matched1[i];
      const foundIdx = matched2.indexOf(char);
      if (foundIdx !== -1) {
        matched1[i] = '*';
        matched2[foundIdx] = '*';
      }
    }

    const remainingCount =
      matched1.filter((c) => c !== '*').length + matched2.filter((c) => c !== '*').length;

    const flamesMap = [
      { letter: 'F', word: 'FRIENDSHIP (दोस्ती)', meaning: 'True gully cricket buddies who share their 1-rupee Mango Mood candies.' },
      { letter: 'L', word: 'LOVE (सच्चा प्यार)', meaning: 'Giving your favourite scented eraser and hiding love notes in textbook page 99.' },
      { letter: 'A', word: 'AFFECTION (आकर्षण)', meaning: 'Smiling across the classroom while pretending to copy notes from the blackboard.' },
      { letter: 'M', word: 'MARRIAGE (शादी)', meaning: 'Dreaming of a 90s Bollywood wedding with Govinda dance and Rasna reception!' },
      { letter: 'E', word: 'ENMITY (दुश्मनी / कट्टी)', meaning: 'Doing "Katti" with the pinky finger because they hit the ball over Sharma ji’s wall!' },
      { letter: 'S', word: 'SISTER / BROTHER (भाई-बहन)', meaning: 'Tying a sparkly rakhi and fighting over the last slice of Parle-G biscuit.' }
    ];

    setTimeout(() => {
      let finalIdx = 0;
      if (remainingCount > 0) {
        let flamesList = [0, 1, 2, 3, 4, 5];
        let currentPos = 0;
        while (flamesList.length > 1) {
          currentPos = (currentPos + remainingCount - 1) % flamesList.length;
          flamesList.splice(currentPos, 1);
        }
        finalIdx = flamesList[0];
      }
      setFlamesResult(flamesMap[finalIdx]);
      setIsCalculatingFlames(false);
      confetti({ particleCount: 40, spread: 70, origin: { y: 0.6 } });
    }, 600);
  };

  // --- BRICK GAME MINI CONSOLE ---
  const [brickScore, setBrickScore] = useState<number>(0);
  const [brickGrid, setBrickGrid] = useState<number[][]>(() =>
    Array(12).fill(0).map(() => Array(8).fill(0))
  );
  const [playerPos, setPlayerPos] = useState<number>(3);
  const [ballPos, setBallPos] = useState<{ x: number; y: number; dx: number; dy: number }>({
    x: 3,
    y: 2,
    dx: 1,
    dy: 1
  });
  const [isBrickGameOver, setIsBrickGameOver] = useState<boolean>(false);
  const [isBrickPlaying, setIsBrickPlaying] = useState<boolean>(false);

  const startBrickGame = () => {
    audioSynthesizer.playClick('beep');
    setBrickScore(0);
    setIsBrickGameOver(false);
    setIsBrickPlaying(true);
    setPlayerPos(3);
    setBallPos({ x: 3, y: 2, dx: 1, dy: 1 });
  };

  useEffect(() => {
    let timer: any = null;
    if (isBrickPlaying && !isBrickGameOver) {
      timer = setInterval(() => {
        setBallPos((prev) => {
          let nextX = prev.x + prev.dx;
          let nextY = prev.y + prev.dy;
          let nextDx = prev.dx;
          let nextDy = prev.dy;

          // Wall bounces
          if (nextX <= 0 || nextX >= 7) {
            nextDx = -nextDx;
            audioSynthesizer.playClick('beep');
          }
          if (nextY <= 0) {
            nextDy = -nextDy;
            audioSynthesizer.playClick('beep');
          }

          // Paddle bounce at bottom
          if (nextY >= 11) {
            if (nextX >= playerPos - 1 && nextX <= playerPos + 1) {
              nextDy = -1;
              setBrickScore((s) => s + 10);
              audioSynthesizer.playClick('beep');
            } else {
              setIsBrickGameOver(true);
              setIsBrickPlaying(false);
              return prev;
            }
          }

          return { x: nextX, y: nextY, dx: nextDx, dy: nextDy };
        });
      }, 250);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBrickPlaying, isBrickGameOver, playerPos]);

  // --- ARTIFACTS INTERACTION ---
  const [puffCount, setPuffCount] = useState<number>(0);
  const [pencilSharpenCount, setPencilSharpenCount] = useState<number>(0);
  const [chaiDipSecs, setChaiDipSecs] = useState<number>(0);
  const [isDipping, setIsDipping] = useState<boolean>(false);
  const [biscuitStatus, setBiscuitStatus] = useState<'crispy' | 'perfect' | 'soggy_broken'>('crispy');

  const handlePuffCigarette = () => {
    audioSynthesizer.playClick('soft');
    setPuffCount((p) => p + 1);
  };

  const handleSharpenPencil = () => {
    audioSynthesizer.playClick('switch');
    setPencilSharpenCount((s) => s + 1);
  };

  const handleChaiDipStart = () => {
    audioSynthesizer.playClick('soft');
    setIsDipping(true);
    setChaiDipSecs(0);
    setBiscuitStatus('crispy');
  };

  useEffect(() => {
    let interval: any = null;
    if (isDipping) {
      interval = setInterval(() => {
        setChaiDipSecs((prev) => {
          const next = prev + 1;
          if (next >= 4) {
            setBiscuitStatus('soggy_broken');
            setIsDipping(false);
          } else if (next >= 2) {
            setBiscuitStatus('perfect');
          }
          return next;
        });
      }, 800);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDipping]);

  const handleChaiDipRelease = () => {
    setIsDipping(false);
    audioSynthesizer.playClick('soft');
    if (chaiDipSecs >= 1 && chaiDipSecs <= 3) {
      setBiscuitStatus('perfect');
      confetti({ particleCount: 20, spread: 40 });
    }
  };

  return (
    <div id="memory-trunk" className="w-full p-4 md:p-8 rounded-2xl bg-[#1a1411] border-2 border-[#543c2b] shadow-2xl relative overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Section Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#3b281b] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-xs font-pixel rounded bg-[#ca8a04]/30 text-[#eab308] border border-[#ca8a04]/60">
                CHILDHOOD TOYBOX & ARTIFACTS
              </span>
              <span className="text-xs text-[#a3907c] font-mono">1992 – 2004 VINTAGE</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#f5ebd8] font-serif-vintage mt-1">
              यादों का संदूक (The Memory Trunk)
            </h2>
            <p className="text-xs text-[#b8a490] font-handwriting text-base">
              Open the wooden study table drawer filled with trump cards, pencil shavings, & games
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#120e0b] rounded-xl border border-[#3b281b]">
          <button
            onClick={() => {
              audioSynthesizer.playClick('soft');
              setActiveTab('trumpcards');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-pixel uppercase tracking-wider transition-all ${
              activeTab === 'trumpcards'
                ? 'bg-[#c2842e] text-[#120f0e] font-bold shadow-md'
                : 'text-[#a89582] hover:bg-[#221812] hover:text-[#f5ebd8]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>1999 Trump Cards</span>
          </button>

          <button
            onClick={() => {
              audioSynthesizer.playClick('soft');
              setActiveTab('flames');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-pixel uppercase tracking-wider transition-all ${
              activeTab === 'flames'
                ? 'bg-[#c2842e] text-[#120f0e] font-bold shadow-md'
                : 'text-[#a89582] hover:bg-[#221812] hover:text-[#f5ebd8]'
            }`}
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>F.L.A.M.E.S Notebook</span>
          </button>

          <button
            onClick={() => {
              audioSynthesizer.playClick('soft');
              setActiveTab('brickgame');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-pixel uppercase tracking-wider transition-all ${
              activeTab === 'brickgame'
                ? 'bg-[#c2842e] text-[#120f0e] font-bold shadow-md'
                : 'text-[#a89582] hover:bg-[#221812] hover:text-[#f5ebd8]'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>99-in-1 Brick LCD</span>
          </button>

          <button
            onClick={() => {
              audioSynthesizer.playClick('soft');
              setActiveTab('artifacts');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-pixel uppercase tracking-wider transition-all ${
              activeTab === 'artifacts'
                ? 'bg-[#c2842e] text-[#120f0e] font-bold shadow-md'
                : 'text-[#a89582] hover:bg-[#221812] hover:text-[#f5ebd8]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Candy & Stationery</span>
          </button>
        </div>

        {/* TAB 1: TRUMP CARDS CLASH */}
        {activeTab === 'trumpcards' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-3 py-2 bg-[#221812] rounded-lg border border-[#442f20] text-xs">
              <span className="font-pixel text-[#e5a93c] uppercase">
                Score — You: {playerScore} | Rival: {cpuScore}
              </span>
              <button
                onClick={handleNextRound}
                className="flex items-center gap-1.5 px-3 py-1 bg-[#3a271a] hover:bg-[#4f3624] text-[#f3e8d6] rounded border border-[#63452f] text-xs font-pixel uppercase transition-transform active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Draw Next Cards</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player Card */}
              <div className="p-4 rounded-xl paper-texture border-4 border-[#8c6d48] shadow-2xl text-[#1a1411] space-y-3 relative">
                <div className="flex items-center justify-between border-b-2 border-red-900/30 pb-2">
                  <div>
                    <span className="px-2 py-0.5 rounded bg-red-800 text-white font-pixel text-xs uppercase">
                      RANK #{playerCard.rank} • {playerCard.category.toUpperCase()}
                    </span>
                    <h3 className="text-xl font-bold font-serif-vintage text-red-950 mt-1">
                      {playerCard.name}
                    </h3>
                    <p className="text-xs font-handwriting text-gray-700">{playerCard.subtitle}</p>
                  </div>
                  <span className="text-3xl">
                    {playerCard.category === 'cricket' ? '🏏' : '⚡'}
                  </span>
                </div>

                {/* Stat Pick Buttons */}
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-red-900 font-mono">
                    👉 Choose your stat to clash:
                  </p>

                  <button
                    onClick={() =>
                      handleStatSelect(
                        'battingOrPower',
                        playerCard.category === 'cricket' ? 'Batting Skill' : 'Power Index'
                      )
                    }
                    className="w-full p-2 rounded bg-[#ebdccb] hover:bg-[#dfcbaf] border border-[#bfa486] flex items-center justify-between text-xs font-mono font-bold transition-all"
                  >
                    <span>{playerCard.category === 'cricket' ? 'Batting Rating' : 'Power Index'}</span>
                    <span className="text-base text-red-900">{playerCard.stats.battingOrPower}</span>
                  </button>

                  <button
                    onClick={() =>
                      handleStatSelect(
                        'matchesOrWeight',
                        playerCard.category === 'cricket' ? 'ODI Matches' : 'Weight (lbs)'
                      )
                    }
                    className="w-full p-2 rounded bg-[#ebdccb] hover:bg-[#dfcbaf] border border-[#bfa486] flex items-center justify-between text-xs font-mono font-bold transition-all"
                  >
                    <span>{playerCard.category === 'cricket' ? 'Matches Played' : 'Weight (lbs)'}</span>
                    <span className="text-base text-red-900">{playerCard.stats.matchesOrWeight}</span>
                  </button>

                  <button
                    onClick={() =>
                      handleStatSelect(
                        'centuriesOrTitles',
                        playerCard.category === 'cricket' ? '100s Scored' : 'Championship Titles'
                      )
                    }
                    className="w-full p-2 rounded bg-[#ebdccb] hover:bg-[#dfcbaf] border border-[#bfa486] flex items-center justify-between text-xs font-mono font-bold transition-all"
                  >
                    <span>{playerCard.category === 'cricket' ? 'Centuries (100s)' : 'Championship Titles'}</span>
                    <span className="text-base text-red-900">{playerCard.stats.centuriesOrTitles}</span>
                  </button>

                  <button
                    onClick={() =>
                      handleStatSelect(
                        'staminaOrStrikeRate',
                        playerCard.category === 'cricket' ? 'Strike Rate' : 'Stamina Rating'
                      )
                    }
                    className="w-full p-2 rounded bg-[#ebdccb] hover:bg-[#dfcbaf] border border-[#bfa486] flex items-center justify-between text-xs font-mono font-bold transition-all"
                  >
                    <span>{playerCard.category === 'cricket' ? 'Strike Rate' : 'Stamina'}</span>
                    <span className="text-base text-red-900">{playerCard.stats.staminaOrStrikeRate}</span>
                  </button>
                </div>

                <div className="p-2 bg-yellow-100/70 rounded border border-yellow-300/80 text-[11px] font-handwriting text-gray-800">
                  ⚡ <strong>Signature Move:</strong> {playerCard.signatureMoveOrShot}
                </div>
              </div>

              {/* CPU Rival Card */}
              <div
                className={`p-4 rounded-xl border-4 shadow-2xl text-[#1a1411] space-y-3 relative transition-all ${
                  isRevealed
                    ? 'paper-texture border-[#8c6d48]'
                    : 'bg-gradient-to-br from-[#2c2017] to-[#120d0a] border-[#5e432f] text-[#d6c4b0]'
                }`}
              >
                {isRevealed ? (
                  <>
                    <div className="flex items-center justify-between border-b-2 border-red-900/30 pb-2">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-blue-800 text-white font-pixel text-xs uppercase">
                          RIVAL CARD • RANK #{cpuCard.rank}
                        </span>
                        <h3 className="text-xl font-bold font-serif-vintage text-blue-950 mt-1">
                          {cpuCard.name}
                        </h3>
                        <p className="text-xs font-handwriting text-gray-700">{cpuCard.subtitle}</p>
                      </div>
                      <span className="text-3xl">
                        {cpuCard.category === 'cricket' ? '🏏' : '⚡'}
                      </span>
                    </div>

                    <div className="space-y-2 pt-1 font-mono text-xs">
                      <div className="p-2 rounded bg-[#ebdccb] flex items-center justify-between">
                        <span>{cpuCard.category === 'cricket' ? 'Batting Rating' : 'Power Index'}</span>
                        <span className="text-base font-bold text-blue-900">{cpuCard.stats.battingOrPower}</span>
                      </div>
                      <div className="p-2 rounded bg-[#ebdccb] flex items-center justify-between">
                        <span>{cpuCard.category === 'cricket' ? 'Matches Played' : 'Weight (lbs)'}</span>
                        <span className="text-base font-bold text-blue-900">{cpuCard.stats.matchesOrWeight}</span>
                      </div>
                      <div className="p-2 rounded bg-[#ebdccb] flex items-center justify-between">
                        <span>{cpuCard.category === 'cricket' ? 'Centuries (100s)' : 'Championship Titles'}</span>
                        <span className="text-base font-bold text-blue-900">{cpuCard.stats.centuriesOrTitles}</span>
                      </div>
                      <div className="p-2 rounded bg-[#ebdccb] flex items-center justify-between">
                        <span>{cpuCard.category === 'cricket' ? 'Strike Rate' : 'Stamina'}</span>
                        <span className="text-base font-bold text-blue-900">{cpuCard.stats.staminaOrStrikeRate}</span>
                      </div>
                    </div>

                    {roundResult && (
                      <div
                        className={`p-3 rounded-lg text-center font-pixel text-sm uppercase tracking-wider font-bold border ${
                          roundResult === 'win'
                            ? 'bg-green-100 border-green-500 text-green-900'
                            : roundResult === 'lose'
                            ? 'bg-red-100 border-red-500 text-red-900'
                            : 'bg-yellow-100 border-yellow-500 text-yellow-900'
                        }`}
                      >
                        {roundResult === 'win' && '🎉 YOU WON THIS TRUMP CLASH!'}
                        {roundResult === 'lose' && '😢 RIVAL WINS THE ROUND!'}
                        {roundResult === 'tie' && '🤝 IT’S A DEAD HEAT TIE!'}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-full min-h-[260px] flex flex-col items-center justify-center text-center space-y-3 p-6">
                    <div className="w-16 h-16 rounded-full bg-[#1e140e] border-2 border-[#8c6d48] flex items-center justify-center text-3xl shadow-inner">
                      🎴
                    </div>
                    <h4 className="font-serif-vintage text-base text-[#f5ebd8]">
                      Rival Card Hidden
                    </h4>
                    <p className="text-xs text-[#a3907c] font-handwriting">
                      Select any stat on your card to initiate the clash!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FLAMES CALCULATOR */}
        {activeTab === 'flames' && (
          <div className="p-6 rounded-2xl paper-texture border-4 border-[#8c6d48] text-[#1c1815] space-y-5 shadow-2xl">
            <div className="border-b-2 border-red-800/30 pb-3 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded bg-red-800 text-white font-pixel text-xs uppercase">
                  LAST BENCH NOTEBOOK FORMULA
                </span>
                <h3 className="text-2xl font-bold font-serif-vintage text-red-950 mt-1">
                  F.L.A.M.E.S Love & Friendship Calculator
                </h3>
              </div>
              <span className="text-3xl">📓</span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-gray-700 uppercase">
                  Name 1 (e.g. Rahul / Bunty):
                </label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  className="w-full p-2.5 rounded border-2 border-gray-400 bg-white text-gray-900 font-handwriting text-lg focus:outline-none focus:border-red-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-gray-700 uppercase">
                  Name 2 (e.g. Anjali / Pooja):
                </label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  className="w-full p-2.5 rounded border-2 border-gray-400 bg-white text-gray-900 font-handwriting text-lg focus:outline-none focus:border-red-700"
                />
              </div>
            </div>

            <button
              onClick={calculateFLAMES}
              disabled={isCalculatingFlames}
              className="w-full py-3 bg-[#b91c1c] hover:bg-[#dc2626] active:bg-[#991b1b] text-white font-bold font-pixel text-sm uppercase tracking-widest rounded-lg border-2 border-red-950 shadow-lg transition-transform active:scale-95"
            >
              {isCalculatingFlames ? 'Striking Out Letters with Pencil...' : 'Calculate FLAMES Match!'}
            </button>

            {/* Result display */}
            {flamesResult && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 rounded-xl bg-white border-2 border-red-800 shadow-md space-y-2 text-center"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 rounded-full text-red-800 font-mono font-bold text-xs uppercase">
                  Letter: {flamesResult.letter}
                </div>
                <h4 className="text-2xl font-bold font-serif-vintage text-red-900">
                  {flamesResult.word}
                </h4>
                <p className="text-sm font-handwriting text-gray-800 max-w-md mx-auto leading-relaxed">
                  "{flamesResult.meaning}"
                </p>
              </motion.div>
            )}
          </div>
        )}

        {/* TAB 3: 99-IN-1 BRICK GAME LCD */}
        {activeTab === 'brickgame' && (
          <div className="p-6 rounded-3xl bg-[#d4af37]/20 border-4 border-[#8c6d48] space-y-4 max-w-md mx-auto shadow-2xl">
            <div className="text-center space-y-1">
              <span className="text-[10px] font-pixel uppercase px-2 py-0.5 rounded bg-black/40 text-yellow-300">
                E-9999 HANDHELD LCD SYSTEM
              </span>
              <h3 className="text-xl font-bold font-pixel text-[#f5ebd8] uppercase tracking-widest">
                BRICK PADDLE 99-IN-1
              </h3>
            </div>

            {/* LCD Screen */}
            <div className="p-4 rounded-xl lcd-screen border-4 border-[#333d29] shadow-inner font-pixel">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-[#333d29]/40">
                <span>SCORE: {String(brickScore).padStart(4, '0')}</span>
                <span>HI: 0420</span>
              </div>

              {/* Pixel Grid Display */}
              <div className="my-3 grid grid-cols-8 gap-1 p-2 bg-[#8c9675] rounded border border-[#556342]">
                {[...Array(12)].map((_, row) =>
                  [...Array(8)].map((_, col) => {
                    const isBall = ballPos.x === col && ballPos.y === row;
                    const isPaddle = row === 11 && Math.abs(col - playerPos) <= 1;
                    const isLit = isBall || isPaddle;
                    return (
                      <div
                        key={`${row}-${col}`}
                        className={`aspect-square rounded-xs transition-colors ${
                          isLit ? 'bg-[#151c0d] shadow-sm' : 'bg-[#7e8766]/30'
                        }`}
                      />
                    );
                  })
                )}
              </div>

              {isBrickGameOver && (
                <div className="text-center py-1 text-xs font-bold text-red-900 animate-pulse">
                  GAME OVER! PRESS START TO RETRY
                </div>
              )}
            </div>

            {/* Hardware Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    audioSynthesizer.playClick('beep');
                    setPlayerPos((p) => Math.max(1, p - 1));
                  }}
                  className="w-14 h-14 rounded-full bg-[#2a1e17] hover:bg-[#3d2c22] border-2 border-[#8c6d48] text-white font-pixel text-xl flex items-center justify-center active:scale-95 shadow-lg"
                >
                  ◀
                </button>

                <button
                  onClick={startBrickGame}
                  className="px-5 py-3 rounded-full bg-[#16a34a] hover:bg-[#22c55e] border-2 border-green-700 text-white font-pixel text-xs uppercase font-bold active:scale-95 shadow-lg"
                >
                  {isBrickPlaying ? 'RESTART' : 'START GAME'}
                </button>

                <button
                  onClick={() => {
                    audioSynthesizer.playClick('beep');
                    setPlayerPos((p) => Math.min(6, p + 1));
                  }}
                  className="w-14 h-14 rounded-full bg-[#2a1e17] hover:bg-[#3d2c22] border-2 border-[#8c6d48] text-white font-pixel text-xl flex items-center justify-center active:scale-95 shadow-lg"
                >
                  ▶
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CANDY & STATIONERY ARTIFACTS */}
        {activeTab === 'artifacts' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Phantom Cigarettes */}
            <div className="p-4 rounded-xl bg-[#241812] border border-[#523825] space-y-3 text-center">
              <div className="text-4xl">🚬</div>
              <h4 className="font-bold font-serif-vintage text-[#f5ebd8] text-base">
                Phantom Sweet Cigarettes
              </h4>
              <p className="text-xs text-[#b8a490] font-handwriting">
                Holding it between two fingers in winter and pretending to exhale smoke in the cold air.
              </p>
              <button
                onClick={handlePuffCigarette}
                className="w-full py-2 bg-[#78350f] hover:bg-[#92400e] text-[#fef3c7] text-xs font-pixel uppercase rounded border border-[#d97706] transition-transform active:scale-95"
              >
                Puff Sugar Smoke ({puffCount} puffs)
              </button>
            </div>

            {/* Natraj Pencil Sharpener */}
            <div className="p-4 rounded-xl bg-[#241812] border border-[#523825] space-y-3 text-center">
              <div className="text-4xl">✏️</div>
              <h4 className="font-bold font-serif-vintage text-[#f5ebd8] text-base">
                Natraj Pencil & Flower Shaving
              </h4>
              <p className="text-xs text-[#b8a490] font-handwriting">
                Carefully sharpening the pencil in one continuous circle to get an unbroken wooden flower.
              </p>
              <button
                onClick={handleSharpenPencil}
                className="w-full py-2 bg-[#991b1b] hover:bg-[#b91c1c] text-[#fee2e2] text-xs font-pixel uppercase rounded border border-[#ef4444] transition-transform active:scale-95"
              >
                Sharpen Pencil ({pencilSharpenCount} flowers)
              </button>
            </div>

            {/* Parle-G Chai Dunk */}
            <div className="p-4 rounded-xl bg-[#241812] border border-[#523825] space-y-3 text-center sm:col-span-2 md:col-span-1">
              <div className="text-4xl">☕</div>
              <h4 className="font-bold font-serif-vintage text-[#f5ebd8] text-base">
                Parle-G Chai Dunk Reflex
              </h4>
              <p className="text-xs text-[#b8a490] font-handwriting">
                Hold button to dunk in hot ginger chai; release before 3 seconds or it sinks!
              </p>
              <div className="text-xs font-mono font-bold text-[#f59e0b]">
                Status: {biscuitStatus === 'crispy' && '🍪 Crispy'}
                {biscuitStatus === 'perfect' && '✨ Perfect Warm Dunk!'}
                {biscuitStatus === 'soggy_broken' && '💔 Sunk into Chai!'}
              </div>
              <button
                onMouseDown={handleChaiDipStart}
                onMouseUp={handleChaiDipRelease}
                onTouchStart={handleChaiDipStart}
                onTouchEnd={handleChaiDipRelease}
                className="w-full py-2 bg-[#b45309] hover:bg-[#d97706] text-[#fffbeb] text-xs font-pixel uppercase rounded border border-[#fbbf24] transition-transform active:scale-95"
              >
                {isDipping ? `Dunking (${chaiDipSecs}s)... Release!` : 'Press & Hold to Dunk'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
