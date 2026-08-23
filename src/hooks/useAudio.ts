import { useState, useCallback, useEffect } from 'react';
import { audioSynthesizer } from '../utils/audioSynthesizer.ts';

export function useAudio() {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTrackKey, setCurrentTrackKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      audioSynthesizer.setMuted(next);
      return next;
    });
  }, []);

  const playMelody = useCallback((melodyKey: 'doordarshan' | 'milesur' | 'malgudi' | 'junglebook' | 'indipop' | 'shaktimaan' | 'powercut' | 'gully') => {
    try {
      setCurrentTrackKey(melodyKey);
      setIsPlaying(true);
      audioSynthesizer.playSynthMelody(melodyKey);
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const stopAudio = useCallback(() => {
    setIsPlaying(false);
    audioSynthesizer.stopAllAmbience();
  }, []);

  useEffect(() => {
    return () => {
      audioSynthesizer.stopAllAmbience();
    };
  }, []);

  return {
    isMuted,
    isPlaying,
    currentTrackKey,
    toggleMute,
    playMelody,
    stopAudio
  };
}
