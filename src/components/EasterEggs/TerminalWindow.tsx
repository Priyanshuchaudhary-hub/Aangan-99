import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minus, Square, Play, Sparkles } from 'lucide-react';
import { audioSynthesizer } from '../../utils/audioSynthesizer.ts';
import { useSound } from '../../hooks/useSound.ts';

interface TerminalWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onYearChange: (year: number) => void;
  onTriggerBSOD?: () => void;
  onTrigger404?: () => void;
}

interface CommandHistoryItem {
  command: string;
  output: string | React.ReactNode;
  isError?: boolean;
}

export const TerminalWindow: React.FC<TerminalWindowProps> = ({
  isOpen,
  onClose,
  onYearChange,
  onTriggerBSOD,
  onTrigger404
}) => {
  const [inputVal, setInputVal] = useState<string>('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'BOOT',
      output: (
        <div className="space-y-1 text-[#34d399]">
          <p>Aangan MS-DOS Version 7.10 [Circa 1999]</p>
          <p>(C) Copyright Aangan Systems Corp 1990-2005. All rights reserved.</p>
          <p className="text-yellow-300">Type "HELP" or "DIR" to view available 90s files and commands.</p>
        </div>
      )
    }
  ]);
  const [isMatrixMode, setIsMatrixMode] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playClick, playChirp } = useSound();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const rawCmd = inputVal.trim();
    if (!rawCmd) return;

    const lowerCmd = rawCmd.toLowerCase();
    playClick('mechanical');

    let outputNode: React.ReactNode = null;
    let isErr = false;

    if (lowerCmd === 'help' || lowerCmd === '?') {
      outputNode = (
        <div className="space-y-1 text-gray-200">
          <p className="text-yellow-300 font-bold">AVAILABLE COMMANDS:</p>
          <p><span className="text-emerald-400 font-bold">DIR</span> - List memory files on C:\ drive</p>
          <p><span className="text-emerald-400 font-bold">TYPE &lt;file&gt;</span> - Read content of a text file (e.g. TYPE SECRET.TXT)</p>
          <p><span className="text-emerald-400 font-bold">PLAY &lt;tune&gt;</span> - Play 90s melody (MALGUDI, SHAKTI, JUNGLEBOOK, DD, MILESUR)</p>
          <p><span className="text-emerald-400 font-bold">DATE &lt;year&gt;</span> - Shift universe timeline (1990 to 2005)</p>
          <p><span className="text-emerald-400 font-bold">MATRIX</span> - Toggle cyberpunk 90s CRT green code rain</p>
          <p><span className="text-emerald-400 font-bold">404</span> - Open the HTTP 404 Childhood Not Found portal</p>
          <p><span className="text-emerald-400 font-bold">CRASH</span> - Simulate Windows 98 Blue Screen of Death (BSOD)</p>
          <p><span className="text-emerald-400 font-bold">VER</span> - Show OS version information</p>
          <p><span className="text-emerald-400 font-bold">CLS / CLEAR</span> - Clear screen</p>
          <p><span className="text-emerald-400 font-bold">EXIT</span> - Close MS-DOS Prompt</p>
        </div>
      );
    } else if (lowerCmd === 'dir') {
      outputNode = (
        <div className="space-y-0.5 text-gray-300 font-mono text-xs">
          <p> Volume in drive C is AANGAN_HD</p>
          <p> Volume Serial Number is 1999-0822</p>
          <p> Directory of C:\AANGAN99</p>
          <p className="text-gray-500">-------------------------------------------</p>
          <div className="grid grid-cols-3 gap-2 py-1">
            <span className="text-yellow-300">SECRET   TXT</span>
            <span>1,999 bytes</span>
            <span>07-15-1999 4:30p</span>

            <span className="text-yellow-300">SACHIN99 BMP</span>
            <span>450,210 bytes</span>
            <span>04-24-1998 8:15p</span>

            <span className="text-yellow-300">RASNA    EXE</span>
            <span>32,768 bytes</span>
            <span>05-10-1997 1:00p</span>

            <span className="text-yellow-300">MALGUDI  MID</span>
            <span>14,200 bytes</span>
            <span>01-01-1994 9:00a</span>

            <span className="text-yellow-300">SHAKTI   BAT</span>
            <span>8,192 bytes</span>
            <span>09-13-1997 12:00p</span>

            <span className="text-yellow-300">KODAK    DAT</span>
            <span>128,000 bytes</span>
            <span>06-14-1997 6:45p</span>
          </div>
          <p className="text-gray-500">-------------------------------------------</p>
          <p> 6 File(s)    635,169 bytes</p>
          <p> 2 Dir(s)   4,294,967,296 bytes free</p>
        </div>
      );
    } else if (lowerCmd.startsWith('type secret.txt') || lowerCmd.startsWith('cat secret.txt') || lowerCmd === 'secret.txt') {
      playChirp();
      outputNode = (
        <div className="p-3 bg-[#1e293b] border border-cyan-500 rounded text-cyan-200 space-y-2">
          <p className="font-bold text-yellow-300 text-sm">📜 C:\AANGAN99\SECRET.TXT:</p>
          <p className="italic">
            "Dear Future Traveler, If you are reading this from a flat touch glass screen with 5G internet:
            Remember the summer afternoons when electricity went out for 3 hours, and everyone sat on the terrace counting passing airplanes.
            The world moved slower, but conversations lasted deeper. Keep the cassette rewound."
          </p>
          <p className="text-right text-xs text-yellow-400 font-bold">— Standard 7-B, July 1999</p>
        </div>
      );
    } else if (lowerCmd.startsWith('type') || lowerCmd.startsWith('cat')) {
      outputNode = (
        <p className="text-yellow-300">
          File contents loaded into memory cache. Try <span className="text-emerald-400 font-bold">TYPE SECRET.TXT</span>
        </p>
      );
    } else if (lowerCmd.startsWith('play')) {
      const tune = lowerCmd.replace('play', '').trim();
      if (tune.includes('malgudi')) {
        audioSynthesizer.playSynthMelody('malgudi');
        outputNode = <p className="text-emerald-400">🎶 Playing: Malgudi Days "Tanana Tanana Tana Nana..." (L. Vaidyanathan)</p>;
      } else if (tune.includes('shakti')) {
        audioSynthesizer.playSynthMelody('shaktimaan');
        outputNode = <p className="text-yellow-400">⚡ Playing: Shaktimaan Spinning Theme (Mukesh Khanna / Doordarshan)</p>;
      } else if (tune.includes('jungle') || tune.includes('mowgli')) {
        audioSynthesizer.playSynthMelody('junglebook');
        outputNode = <p className="text-emerald-400">🐾 Playing: Jungle Jungle Baat Chali Hai (Gulzar / Vishal Bhardwaj)</p>;
      } else if (tune.includes('dd') || tune.includes('doordarshan')) {
        audioSynthesizer.playSynthMelody('doordarshan');
        outputNode = <p className="text-cyan-400">📺 Playing: Doordarshan Rotating Peacock Chime (Ustad Ali Ahmed Hussain Khan)</p>;
      } else if (tune.includes('mile') || tune.includes('sur')) {
        audioSynthesizer.playSynthMelody('milesur');
        outputNode = <p className="text-amber-400">🇮🇳 Playing: Mile Sur Mera Tumhara (National Integration Anthem)</p>;
      } else {
        audioSynthesizer.playSynthMelody('malgudi');
        outputNode = (
          <p className="text-emerald-400">
            🎶 Tune recognized! Try: <span className="font-bold">PLAY MALGUDI</span>, <span className="font-bold">PLAY SHAKTI</span>, <span className="font-bold">PLAY JUNGLEBOOK</span>, or <span className="font-bold">PLAY DD</span>
          </p>
        );
      }
    } else if (lowerCmd.startsWith('date')) {
      const yearMatch = lowerCmd.match(/\d{4}/);
      if (yearMatch) {
        const parsedYear = parseInt(yearMatch[0]);
        if (parsedYear >= 1990 && parsedYear <= 2005) {
          onYearChange(parsedYear);
          audioSynthesizer.playTimeWarpWhoosh();
          outputNode = <p className="text-yellow-300">⏳ Universe timeline recalibrated to: {parsedYear} AD.</p>;
        } else {
          outputNode = <p className="text-rose-400">Year must be between 1990 and 2005.</p>;
          isErr = true;
        }
      } else {
        outputNode = <p className="text-gray-300">Current Time: August 22, 1999 16:30:00. To shift: DATE &lt;1990-2005&gt;</p>;
      }
    } else if (lowerCmd === 'matrix' || lowerCmd === 'hack') {
      setIsMatrixMode(!isMatrixMode);
      outputNode = <p className="text-emerald-400 font-bold">{!isMatrixMode ? 'MATRIX CODE RAIN: ACTIVATED' : 'MATRIX MODE: DEACTIVATED'}</p>;
    } else if (lowerCmd === '404') {
      onTrigger404?.();
      outputNode = <p className="text-cyan-300">Opening HTTP 404 Gateway...</p>;
    } else if (lowerCmd === 'crash' || lowerCmd === 'bsod') {
      onTriggerBSOD?.();
      outputNode = <p className="text-rose-500 font-bold">FATAL EXCEPTION 0E: Triggering Blue Screen...</p>;
    } else if (lowerCmd === 'ver') {
      outputNode = <p className="text-gray-200">Aangan MS-DOS Version 7.10 (Revision 1999.8)</p>;
    } else if (lowerCmd === 'cls' || lowerCmd === 'clear') {
      setHistory([]);
      setInputVal('');
      return;
    } else if (lowerCmd === 'exit' || lowerCmd === 'quit') {
      onClose();
      return;
    } else if (lowerCmd === 'sachin' || lowerCmd === '1998') {
      audioSynthesizer.playCheeringCrowd();
      outputNode = (
        <div className="p-2 bg-emerald-950 border border-emerald-500 rounded text-emerald-200">
          <p className="font-bold text-yellow-300">🏏 SACHIN TENDULKAR 143 vs AUSTRALIA (Sharjah 1998):</p>
          <p>"Tony Greig on commentary: Tendulkar dances down the track, what a six into the sandstorm!"</p>
        </div>
      );
    } else {
      isErr = true;
      outputNode = (
        <p className="text-rose-400">
          Bad command or file name: "{rawCmd}". Type <span className="text-yellow-300 font-bold">HELP</span> for available commands.
        </p>
      );
    }

    setHistory((prev) => [...prev, { command: rawCmd, output: outputNode, isError: isErr }]);
    setInputVal('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dos-terminal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl bg-black border-4 border-t-white border-l-white border-r-black border-b-black shadow-2xl rounded-xs overflow-hidden flex flex-col font-mono text-xs ${
          isMatrixMode ? 'text-[#00ff66]' : 'text-gray-200'
        }`}
        style={{ minHeight: '440px', maxHeight: '85vh' }}
      >
        {/* DOS Window Header */}
        <div className="bg-[#000080] text-white px-3 py-1.5 font-bold flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-yellow-300" />
            <span id="dos-terminal-title" className="font-pixel text-xs tracking-wider">
              MS-DOS Prompt - [C:\AANGAN99]
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              className="w-4 h-4 bg-[#c0c0c0] text-black font-bold flex items-center justify-center border border-t-white border-l-white border-r-black border-b-black hover:bg-rose-600 hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="flex-1 p-4 bg-black overflow-y-auto space-y-3 font-mono">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-yellow-400">
                <span className="text-gray-500">C:\AANGAN99&gt;</span>
                <span className="font-bold">{item.command}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}

          {/* Active Input Line */}
          <form onSubmit={handleRunCommand} className="flex items-center gap-2 pt-2">
            <span className="text-yellow-400 font-bold shrink-0">C:\AANGAN99&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-transparent text-white outline-none border-none font-mono text-xs focus:ring-0"
              placeholder="type 'help', 'dir', 'play malgudi'..."
              autoFocus
            />
            <span className="w-2 h-4 bg-white animate-pulse" />
          </form>

          <div ref={bottomRef} />
        </div>

        {/* Terminal Quick Shortcuts Bar */}
        <div className="bg-[#1e1b18] px-3 py-1.5 border-t border-[#3e342c] flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-yellow-500 font-bold">Quick:</span>
            <button onClick={() => { setInputVal('dir'); }} className="hover:text-white underline">DIR</button>
            <span>•</span>
            <button onClick={() => { setInputVal('type secret.txt'); }} className="hover:text-white underline">SECRET.TXT</button>
            <span>•</span>
            <button onClick={() => { setInputVal('play malgudi'); }} className="hover:text-white underline">PLAY MALGUDI</button>
            <span>•</span>
            <button onClick={() => { setInputVal('matrix'); }} className="hover:text-white underline">MATRIX</button>
          </div>
          <span className="font-pixel text-[9px] text-emerald-400">640K BASE MEMORY OK</span>
        </div>
      </div>
    </div>
  );
};
