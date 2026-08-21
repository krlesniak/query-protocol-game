import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface ActTransitionProps {
  levelCompleted: number;
  onComplete: () => void;
}

const TRANSITIONS: Record<number, { thoughts: string[], actTitle: string | null }> = {
  0: { 
    thoughts: [], 
    actTitle: "ACT I — THE DISAPPEARANCE" 
  }, // TEN WPIS OBSŁUGUJE START GRY (PRZED LEVEL 1)
  5: { 
    thoughts: ["EVIDENCE ANALYSIS COMPLETE.", "ORACLE DID NOT DISAPPEAR.", "SOMEONE USED HIS IDENTITY."], 
    actTitle: "ACT II — SOMEONE IS LYING" 
  },
  10: { 
    thoughts: ["ANOMALY CONFIRMED.", "THE ATTACK WAS NOT RANDOM."], 
    actTitle: "ACT III — THE MIRROR" 
  },
  15: { 
    thoughts: ["PROJECT MIRROR", "AUTHORIZED BY: ELIAS VOSS", "ACCESS LEVEL: EXECUTIVE"], 
    actTitle: "ACT IV — ORACLE'S LAST QUERY" 
  },
  20: { 
    thoughts: ["THE FALSE TRAIL WAS DELIBERATE.", "YOU WERE NEVER INVESTIGATING A THEFT.", "YOU WERE INVESTIGATING A COVER-UP."], 
    actTitle: "ACT V — THE TRUTH" 
  },
  25: { 
    thoughts: ["THE ARCHITECT WAS NOT THE TARGET.", "HE WAS THE SOURCE."], 
    actTitle: "ACT VI — THE FINAL QUERY" 
  },
  29: { 
    thoughts: ["LAST TRACE RECOVERED.", "ORACLE'S FINAL QUERY IS WAITING."], 
    actTitle: null 
  }
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const ActTransition = ({ levelCompleted, onComplete }: ActTransitionProps) => {
  const transitionData = useMemo(() => TRANSITIONS[levelCompleted] || { thoughts: [], actTitle: null }, [levelCompleted]);
  
  const [phase, setPhase] = useState<'THOUGHTS' | 'ACT_TITLE'>(transitionData.thoughts.length > 0 ? 'THOUGHTS' : 'ACT_TITLE');
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [displayText, setDisplayText] = useState<string>('');
  const [showActTitle, setShowActTitle] = useState(transitionData.thoughts.length === 0);
  
  const isMounted = useRef(true);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const bgmRef2 = useRef<HTMLAudioElement | null>(null);
  const typingAudioRef = useRef<HTMLAudioElement | null>(null);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const playSound = useCallback((fileName: string, volume: number = 0.4) => {
    try {
      const audio = new Audio(`/assets/audio/${fileName}`);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    
    typingAudioRef.current = new Audio('/assets/audio/keyboard.mp3');
    typingAudioRef.current.volume = 0.15;

    bgmRef.current = new Audio('/assets/audio/hum2.mp3');
    bgmRef.current.volume = 0.4; 
    bgmRef.current.loop = true;
    bgmRef.current.play().catch(() => {});

    bgmRef2.current = new Audio('/assets/audio/heartbeat1.mp3');
    bgmRef2.current.volume = 0.3;
    bgmRef2.current.loop = true;
    bgmRef2.current.play().catch(() => {});

    return () => { 
      isMounted.current = false; 
      if (bgmRef.current) { bgmRef.current.pause(); bgmRef.current.currentTime = 0; }
      if (bgmRef2.current) { bgmRef2.current.pause(); bgmRef2.current.currentTime = 0; }
    };
  }, []);

  useEffect(() => {
    let isCancelled = false;

    const runSequence = async () => {
      await delay(50);
      if (isCancelled || !isMounted.current) return;

      // THOUGHTS PHASE
      if (transitionData.thoughts.length > 0) {
        playSound('bass_hit.mp3', 0.5);
        await delay(950);
        if (isCancelled || !isMounted.current) return;

        for (let i = 0; i < transitionData.thoughts.length; i++) {
          if (!isMounted.current || isCancelled) return;
          
          setVisibleLines(i);
          const currentLine = transitionData.thoughts[i];
          
          for (let j = 0; j <= currentLine.length; j++) {
            if (!isMounted.current || isCancelled) return;
            setDisplayText(currentLine.substring(0, j));
            
            if (typingAudioRef.current && currentLine.charAt(j - 1) !== ' ') {
              typingAudioRef.current.currentTime = 0;
              typingAudioRef.current.play().catch(() => {});
            }
            await delay(40);
          }

          if (!isMounted.current || isCancelled) return;
          playSound('beep2.mp3', 0.2);
          await delay(1200);
        }
        
        await delay(1000);
      }

      if (!isMounted.current || isCancelled) return;

      setPhase('ACT_TITLE');
      
      if (transitionData.actTitle) {
        await delay(600);
        if (!isMounted.current || isCancelled) return;

        playSound('bass_hit1.mp3', 0.3);
    
        setShowActTitle(true);
        await delay(3500);
      } else {
        playSound('bass_hit.mp3', 0.3);
        await delay(500);
      }

      if (!isMounted.current || isCancelled) return;
      onCompleteRef.current();
    };

    runSequence();

    return () => {
      isCancelled = true;
    };
  }, [transitionData, playSound]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#05080a] text-[var(--accent-bright)] font-mono p-8 select-none"
    >
      <div className="pointer-events-none absolute inset-0 z-10 scanlines opacity-30"></div>
      
      {phase === 'THOUGHTS' && transitionData.thoughts.length > 0 && (
        <div className="relative z-20 flex flex-col items-center justify-center gap-6 text-center max-w-3xl">
          {transitionData.thoughts.map((text, index) => (
            <div 
              key={index} 
              className={`text-xl md:text-3xl tracking-widest leading-relaxed ${index === transitionData.thoughts.length - 1 && index === visibleLines ? 'font-bold' : 'opacity-70'}`}
            >
              {index < visibleLines && text}
              {index === visibleLines && (
                <>
                  {displayText}
                  <span className="animate-pulse">_</span>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {phase === 'ACT_TITLE' && showActTitle && transitionData.actTitle && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 0.8 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="relative z-20 flex items-center justify-center text-center"
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl tracking-[0.3em] font-bold text-[var(--accent-bright)] glow-text uppercase">
            {transitionData.actTitle}
          </h1>
        </motion.div>
      )}

      <style>{`
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2));
          background-size: 100% 4px;
        }
        .glow-text {
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.4), 0 0 40px rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </motion.div>
  );
};