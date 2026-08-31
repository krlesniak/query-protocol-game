import { useEffect, useRef, useCallback } from 'react';

let globalAudioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  if (!globalAudioContext) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) globalAudioContext = new AudioCtx();
  }
  return globalAudioContext;
};

export const useSound = (fileName: string, options?: { volume?: number; loop?: boolean; autoPlay?: boolean }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  
  const volume = options?.volume ?? 0.5;
  const loop = options?.loop ?? false;
  const autoPlay = options?.autoPlay ?? false;

  useEffect(() => {
    const audio = new Audio(`/assets/audio/${fileName}`);
    audio.loop = loop;
    audio.crossOrigin = "anonymous"; 
    audioRef.current = audio;

    let source: MediaElementAudioSourceNode | null = null;

    const ctx = getAudioContext();
    if (ctx) {
      try {
        source = ctx.createMediaElementSource(audio);
        const gainNode = ctx.createGain();
        
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        gainNodeRef.current = gainNode;
        gainNodeRef.current.gain.value = volume;
      } catch (e) {
        console.warn("Web Audio API nie wspierane dla tego pliku, fallback do domyślnego audio.", e);
        audio.volume = volume;
      }
    } else {
      audio.volume = volume;
    }

    if (autoPlay && volume > 0) {
      audio.play().catch(() => {
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
      
      if (source) source.disconnect();
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileName]); 

  useEffect(() => {
    if (!audioRef.current) return;

    if (gainNodeRef.current) {
      const ctx = getAudioContext();
      if (ctx) {
        gainNodeRef.current.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
      } else {
        gainNodeRef.current.gain.value = volume;
      }
    } else {
      // Fallback
      audioRef.current.volume = volume;
    }

    audioRef.current.muted = volume === 0;

    if (volume > 0 && loop && audioRef.current.paused) {
      audioRef.current.play().catch(() => {});
    } else if (volume === 0 && loop && !audioRef.current.paused) {
      audioRef.current.pause();
    }
  }, [volume, loop]);

  const play = useCallback(() => {
    if (audioRef.current && volume > 0) {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume();
      }
      
      audioRef.current.muted = false;
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