import { useEffect, useRef, useCallback } from 'react';

export const useSound = (fileName: string, options?: { volume?: number; loop?: boolean; autoPlay?: boolean }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const volume = options?.volume ?? 0.5;
  const loop = options?.loop ?? false;
  const autoPlay = options?.autoPlay ?? false;

  useEffect(() => {
    const audio = new Audio(`/assets/audio/${fileName}`);
    audio.loop = loop;
    audio.volume = volume;
    audioRef.current = audio;

    if (autoPlay) {
      audio.play().catch(() => {});
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName]); 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      
      if (volume > 0 && loop && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [volume, loop]);

  const play = useCallback(() => {
    if (audioRef.current && volume > 0) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [volume]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { play, stop };
};