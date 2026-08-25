import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { CinematicBootSequence } from './components/CinematicBootSequence.tsx';
import { VisualMode } from './components/VintageVisualKnobs.tsx';
import { Home } from './pages/Home.tsx';
import { audioSynthesizer } from './utils/audioSynthesizer.ts';
import { MusicProvider } from './context/MusicContext.tsx';
import { PersistentMediaLayer } from './components/PersistentMediaLayer.tsx';
import { MusicDebugPanel } from './components/MusicDebugPanel.tsx';

export default function App() {
  const [selectedYear, setSelectedYear] = useState<number>(1999);
  const [visualMode, setVisualMode] = useState<VisualMode>('crt');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isBooting, setIsBooting] = useState<boolean>(true);
  const [forceFullBoot, setForceFullBoot] = useState<boolean>(false);

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioSynthesizer.setMasterMute(nextMute);
  };

  const handleTriggerReboot = () => {
    setForceFullBoot(true);
    setIsBooting(true);
  };

  const getVisualFilterClass = () => {
    switch (visualMode) {
      case 'crt':
        return 'crt-overlay';
      case 'vhs':
        return 'vhs-mode crt-overlay';
      case 'newspaper':
        return 'newspaper-mode';
      case 'amber':
        return 'amber-mono-mode crt-overlay';
      case 'raw':
      default:
        return '';
    }
  };

  return (
    <MusicProvider>
      <PersistentMediaLayer />
      <MusicDebugPanel />
      <AnimatePresence>
        {isBooting && (
          <CinematicBootSequence
            targetYear={selectedYear}
            forceFullSequence={forceFullBoot}
            onComplete={() => {
              setIsBooting(false);
              setForceFullBoot(false);
            }}
          />
        )}
      </AnimatePresence>

      <div className={`min-h-screen bg-[#120f0e] text-[#e6dfd5] relative selection:bg-[#e5a93c] selection:text-[#120f0e] ${getVisualFilterClass()}`}>
        <Home
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          visualMode={visualMode}
          onVisualModeChange={setVisualMode}
          isMuted={isMuted}
          onToggleMute={handleToggleMute}
          onReplayBoot={handleTriggerReboot}
        />
      </div>
    </MusicProvider>
  );
}
