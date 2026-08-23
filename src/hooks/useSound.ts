import { useCallback } from 'react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

export type SoundEffectType = 'mechanical' | 'switch' | 'soft' | 'retro' | 'beep' | 'chime' | 'error' | 'success';

/**
 * Hook for playing low-latency procedural Web Audio tactile effects
 */
export function useSound() {
  const playClick = useCallback((type: SoundEffectType = 'mechanical') => {
    try {
      if (type === 'beep') {
        audioSynthesizer.playChirp();
      } else if (type === 'chime' || type === 'success') {
        audioSynthesizer.playSuccessChime();
      } else if (type === 'error') {
        audioSynthesizer.playErrorBuzzer();
      } else if (type === 'switch') {
        audioSynthesizer.playClick('switch');
      } else if (type === 'soft') {
        audioSynthesizer.playClick('soft');
      } else {
        audioSynthesizer.playClick('heavy');
      }
    } catch {
      // Gracefully handle browser autoplay policies
    }
  }, []);

  const playTapeClunk = useCallback(() => {
    try {
      audioSynthesizer.playTapeClunk();
    } catch {
      // Ignored
    }
  }, []);

  const playChirp = useCallback(() => {
    try {
      audioSynthesizer.playChirp();
    } catch {
      // Ignored
    }
  }, []);

  const playModemTone = useCallback(() => {
    try {
      audioSynthesizer.playModemBurst();
    } catch {
      // Ignored
    }
  }, []);

  const playCRTWhine = useCallback(() => {
    try {
      audioSynthesizer.playCRTStatic();
    } catch {
      // Ignored
    }
  }, []);

  return {
    playClick,
    playTapeClunk,
    playChirp,
    playModemTone,
    playCRTWhine
  };
}
