import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';

export const useSound = (fileName: string, options?: { volume?: number; loop?: boolean; autoPlay?: boolean }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const soundEnabled = useGameStore(state => state.soundEnabled);

  useEffect(() => {
    audioRef.current = new Audio(`/assets/audio/${fileName}`);
    audioRef.current.volume = options?.volume ?? 0.5;
    audioRef.current.loop = options?.loop ?? false;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [fileName, options?.volume, options?.loop]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = !soundEnabled;
    }
  }, [soundEnabled]);

  // Autoplay
  useEffect(() => {
    if (options?.autoPlay && audioRef.current) {
      audioRef.current.play().catch(() => {});
    }
  }, [options?.autoPlay]);

  const play = useCallback(() => {
    if (audioRef.current && soundEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [soundEnabled]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
};