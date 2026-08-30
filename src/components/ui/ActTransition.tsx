import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ActTransitionProps {
  levelCompleted: number;
  onComplete: () => void;
}

interface TransitionData {
  thoughts: string[];
  actTitle: string | null;
}

const TRANSITIONS: Record<number, TransitionData> = {
  0: { thoughts: [], actTitle: 'ACT I — THE DISAPPEARANCE' },
  5: { thoughts: ['EVIDENCE ANALYSIS COMPLETE.', 'ORACLE DID NOT DISAPPEAR.', 'SOMEONE USED HIS IDENTITY.'], actTitle: 'ACT II — SOMEONE IS LYING' },
  10: { thoughts: ['ANOMALY CONFIRMED.', 'THE ATTACK WAS NOT RANDOM.'], actTitle: 'ACT III — THE MIRROR' },
  15: { thoughts: ['PROJECT MIRROR', 'AUTHORIZED BY: ELIAS VOSS', 'ACCESS LEVEL: EXECUTIVE'], actTitle: "ACT IV — ORACLE'S LAST QUERY" },
  20: { thoughts: ['THE FALSE TRAIL WAS DELIBERATE.', 'YOU WERE NEVER INVESTIGATING A THEFT.', 'YOU WERE INVESTIGATING A COVER-UP.'], actTitle: 'ACT V — THE TRUTH' },
  25: { thoughts: ['THE ARCHITECT WAS NOT THE TARGET.', 'HE WAS THE SOURCE.'], actTitle: 'ACT VI — THE FINAL QUERY' },
  29: { thoughts: ['LAST TRACE RECOVERED.', "ORACLE'S FINAL QUERY IS WAITING."], actTitle: null },
};

const DEFAULT_TRANSITION: TransitionData = { thoughts: [], actTitle: null };

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const ActTransition = ({ levelCompleted, onComplete }: ActTransitionProps) => {
  const transitionData = useMemo(() => TRANSITIONS[levelCompleted] ?? DEFAULT_TRANSITION, [levelCompleted]);
  
  const [displayedThoughts, setDisplayedThoughts] = useState<string[]>([]);
  const [activeTypingIndex, setActiveTypingIndex] = useState<number>(-1);
  const [fadeThoughts, setFadeThoughts] = useState(false);
  const [showActTitle, setShowActTitle] = useState(false);

  const isMounted = useRef(true);
  const onCompleteRef = useRef(onComplete);
  
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const heartbeatRef = useRef<HTMLAudioElement | null>(null);
  const keyboardAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((fileName: string, volume = 0.3) => {
    try {
      const audio = new Audio(`/assets/audio/${fileName}`);
      audio.volume = volume;
      audio.play().catch(() => {});
      audio.addEventListener('ended', () => { audio.remove(); });
    } catch { /* ignore errors */ }
  }, []);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    isMounted.current = true;

    const typingAudio = new Audio('/assets/audio/keyboard.mp3');
    typingAudio.volume = 0.15;
    keyboardAudioRef.current = typingAudio;

    const bgm = new Audio('/assets/audio/hum2.mp3');
    bgm.volume = 0.28;
    bgm.loop = true;
    bgmRef.current = bgm;

    const heartbeat = new Audio('/assets/audio/heartbeat1.mp3');
    heartbeat.volume = 0.15;
    heartbeat.loop = true;
    heartbeatRef.current = heartbeat;

    bgm.play().catch(() => {});
    heartbeat.play().catch(() => {});

    return () => {
      isMounted.current = false;
      if (bgmRef.current) { bgmRef.current.pause(); bgmRef.current = null; }
      if (heartbeatRef.current) { heartbeatRef.current.pause(); heartbeatRef.current = null; }
      if (keyboardAudioRef.current) { keyboardAudioRef.current.pause(); keyboardAudioRef.current = null; }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const runSequence = async () => {
      await delay(800); // Początkowa cisza
      if (cancelled || !isMounted.current) return;

      if (transitionData.thoughts.length > 0) {
        playSound('bass_hit.mp3', 0.2);
        await delay(1200);

        for (let i = 0; i < transitionData.thoughts.length; i++) {
          if (cancelled || !isMounted.current) return;
          
          const currentLine = transitionData.thoughts[i];
          setDisplayedThoughts((prev) => [...prev, '']);
          setActiveTypingIndex(i);

          // Efekt powolnego pisania litera po literze
          for (let j = 0; j <= currentLine.length; j++) {
            if (cancelled || !isMounted.current) return;
            
            setDisplayedThoughts((prev) => {
              const newThoughts = [...prev];
              newThoughts[i] = currentLine.substring(0, j);
              return newThoughts;
            });

            if (currentLine.charAt(j - 1) !== ' ' && j > 0) {
              if (keyboardAudioRef.current && j % 2 === 0) {
                keyboardAudioRef.current.currentTime = 0;
                keyboardAudioRef.current.play().catch(() => {});
              }
            }
            await delay(45); 
          }

          setActiveTypingIndex(-1);
          playSound('beep2.mp3', 0.1);
          
          await delay(i === transitionData.thoughts.length - 1 ? 1800 : 1200);
        }

        setFadeThoughts(true);
        await delay(1500); 
      }

      if (cancelled || !isMounted.current) return;

      if (transitionData.actTitle) {
        setShowActTitle(true);
        playSound('bass_hit1.mp3', 0.4); 
        await delay(4500);
      } else if (transitionData.thoughts.length > 0) {
        await delay(1000);
      }

      if (cancelled || !isMounted.current) return;
      onCompleteRef.current();
    };

    runSequence();

    return () => { cancelled = true; };
  }, [transitionData, playSound]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-[#030505] px-5 py-8 text-[#b3b5ad] font-mono select-none"
    >
      <div className="pointer-events-none absolute inset-0 z-0 nexus-scanlines" />
      <div className="pointer-events-none absolute inset-0 z-0 nexus-vignette" />
      <div className="pointer-events-none absolute inset-0 z-0 nexus-noise" />

      <div className="pointer-events-none absolute inset-4 sm:inset-8 md:inset-12 border border-[#303630]/25" />
      <div className="pointer-events-none absolute top-4 left-4 sm:top-8 sm:left-8 md:top-12 md:left-12 text-[7px] sm:text-[9px] tracking-[0.2em] text-[#50554e]/50 uppercase">NEXUS CORPORATION</div>
      <div className="pointer-events-none absolute top-4 right-4 sm:top-8 sm:right-8 md:top-12 md:right-12 text-[7px] sm:text-[9px] tracking-[0.2em] text-[#50554e]/50 uppercase">SECURE ARCHIVE</div>
      <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-8 sm:left-8 md:bottom-12 md:left-12 text-[7px] sm:text-[9px] tracking-[0.2em] text-[#50554e]/40 uppercase">QUERY_PROTOCOL</div>
      <div className="pointer-events-none absolute bottom-4 right-4 sm:bottom-8 sm:right-8 md:bottom-12 md:right-12 text-[7px] sm:text-[9px] tracking-[0.2em] text-[#50554e]/40 uppercase">INTERNAL USE ONLY</div>
      
      <div className="pointer-events-none absolute top-4 left-4 sm:top-8 sm:left-8 w-5 h-5 border-l border-t border-[#596057]/40" />
      <div className="pointer-events-none absolute top-4 right-4 sm:top-8 sm:right-8 w-5 h-5 border-r border-t border-[#596057]/40" />
      <div className="pointer-events-none absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-5 h-5 border-l border-b border-[#596057]/40" />
      <div className="pointer-events-none absolute bottom-4 right-4 sm:bottom-8 sm:right-8 w-5 h-5 border-r border-b border-[#596057]/40" />

      <div className="relative z-20 w-full max-w-5xl flex items-center justify-center">
        
        <AnimatePresence>
          {!fadeThoughts && displayedThoughts.length > 0 && (
            <motion.div 
              exit={{ opacity: 0, filter: "blur(4px)", transition: { duration: 1.2 } }} 
              className="absolute w-full max-w-3xl text-center flex flex-col items-center"
            >
              <div className="mb-10 sm:mb-14 flex items-center justify-center gap-4">
                <span className="h-px w-12 sm:w-20 bg-[#4b514b]/60" />
                <span className="text-[8px] sm:text-[10px] tracking-[0.3em] text-[#71756f] uppercase">RECOVERED INTELLIGENCE</span>
                <span className="h-px w-12 sm:w-20 bg-[#4b514b]/60" />
              </div>

              <div className="flex flex-col items-center gap-6 sm:gap-8">
                {displayedThoughts.map((text, index) => (
                  <div 
                    key={index}
                    className={`max-w-full px-4 text-center uppercase leading-relaxed break-words ${
                      index === transitionData.thoughts.length - 1 
                        ? 'text-[#c6c7c0] text-lg sm:text-2xl md:text-3xl font-medium tracking-[0.15em] sm:tracking-[0.2em] drop-shadow-[0_0_15px_rgba(200,200,200,0.1)]' 
                        : 'text-[#8a8e86] text-xs sm:text-base md:text-lg tracking-[0.12em] sm:tracking-[0.18em]'
                    }`}
                  >
                    {text}
                    {activeTypingIndex === index && (
                      <span className="inline-block w-2 h-4 sm:w-3 sm:h-5 ml-2 align-middle bg-[#8a8e86] animate-pulse" />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showActTitle && transitionData.actTitle && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} 
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 1.8, ease: "easeOut" }} 
              className="absolute w-full flex flex-col items-center text-center"
            >
              <div className="mb-8 sm:mb-12 flex items-center gap-4">
                <span className="h-px w-10 sm:w-16 bg-[#7a6a4d]/70" />
                <span className="text-[8px] sm:text-[11px] tracking-[0.35em] text-[#9c8965] uppercase font-bold drop-shadow-[0_0_10px_rgba(156,137,101,0.3)]">
                  NEXUS ARCHIVE // CLASSIFIED
                </span>
                <span className="h-px w-10 sm:w-16 bg-[#7a6a4d]/70" />
              </div>

              <h1 className="max-w-5xl px-4 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] leading-relaxed text-[#d4d5cf] drop-shadow-[0_0_20px_rgba(255,255,255,0.15)] break-words">
                {transitionData.actTitle}
              </h1>

              <motion.div initial={{ width: 0 }} animate={{ width: '180px' }} transition={{ delay: 0.8, duration: 1.5, ease: 'easeOut' }} className="mt-8 sm:mt-12 h-px bg-[#85724e]" />
              
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="mt-6 sm:mt-8 text-[8px] sm:text-[10px] tracking-[0.3em] text-[#626860] uppercase">
                INVESTIGATION RECORD // NEXT PHASE
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <style>{`
        .nexus-scanlines {
          background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 4px);
          opacity: 0.35;
        }
        .nexus-vignette {
          background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.3) 65%, rgba(0,0,0,0.85) 100%);
        }
        .nexus-noise {
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
          pointer-events: none;
        }
      `}</style>
    </motion.div>
  );
};