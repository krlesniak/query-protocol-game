import { useState, useEffect, useRef, useCallback } from 'react';

interface IntroCinematicProps {
  onComplete: () => void;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const TypewriterText = ({ 
  text, 
  typingSpeed = 40, 
  onComplete,
  className = "",
  silent = false,
  onTypeSound
}: { 
  text: string, 
  typingSpeed?: number, 
  onComplete?: () => void,
  className?: string,
  silent?: boolean,
  onTypeSound?: () => void
}) => {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      if (text.charAt(i) !== ' ' && !silent && onTypeSound) onTypeSound();
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, typingSpeed);
    return () => clearInterval(timer);
  }, [text, typingSpeed, onComplete, silent, onTypeSound]);

  return <span className={className}>{displayed}</span>;
};

export const IntroCinematic = ({ onComplete }: IntroCinematicProps) => {
  const [phase, setPhase] = useState(0);
  const [subPhase, setSubPhase] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const isMounted = useRef(true);
  const isSkipped = useRef(false);
  const done = useRef(false);

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const keyboardAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback((fileName: string, volume: number = 0.4) => {
    try {
      const audio = new Audio(`/assets/audio/${fileName}`);
      audio.volume = volume;
      audio.play().catch(() => {}); 
    } catch { /* ignore */ }
  }, []);

  const playKeyboardSound = useCallback(() => {
    try {
      if (keyboardAudioRef.current) {
        keyboardAudioRef.current.currentTime = 0;
        keyboardAudioRef.current.play().catch(() => {});
      }
    } catch { /* ignore */ }
  }, []);

  const finishIntro = useCallback(() => {
    if (done.current) return;
    done.current = true;
    isSkipped.current = true;
    if (bgmRef.current) {
      bgmRef.current.pause();
      bgmRef.current.currentTime = 0;
    }
    if (keyboardAudioRef.current) keyboardAudioRef.current.pause();
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') finishIntro();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [finishIntro]);

  useEffect(() => {
    const skipTimer = setTimeout(() => {
      if (isMounted.current) setShowSkip(true);
    }, 3000);
    return () => clearTimeout(skipTimer);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    isSkipped.current = false;
    done.current = false;

    keyboardAudioRef.current = new Audio('/assets/audio/keyboard.mp3');
    keyboardAudioRef.current.volume = 0.15;

    const wait = async (ms: number) => {
      if (!isMounted.current || isSkipped.current) return false;
      await delay(ms);
      return isMounted.current && !isSkipped.current;
    };

    const triggerGlitch = (durationMs: number) => {
      if (!isMounted.current || isSkipped.current) return;
      setIsGlitching(true);
      setTimeout(() => {
        if (isMounted.current) setIsGlitching(false);
      }, durationMs);
    };

    const runTimeline = async () => {
      try {
        bgmRef.current = new Audio('/assets/audio/hum3.mp3');
        bgmRef.current.volume = 0.4;
        bgmRef.current.loop = true;
        bgmRef.current.play().catch(() => {});
      } catch { /* ignore */ }

      if (!(await wait(1000))) return;

      // SCENE 1
      setPhase(1);
      setSubPhase(1); 
      if (!(await wait(1500))) return;
      setSubPhase(2); 
      if (!(await wait(2000))) return;
      setSubPhase(3); playSound('beep2.mp3'); if (!(await wait(500))) return; 
      setSubPhase(4); playSound('beep2.mp3'); if (!(await wait(500))) return; 
      setSubPhase(5); playSound('beep2.mp3'); if (!(await wait(500))) return; 
      setSubPhase(6); playSound('beep2.mp3'); if (!(await wait(500))) return; 
      setSubPhase(7); playSound('beep2.mp3'); if (!(await wait(1500))) return; 

      // SCENE 2
      setPhase(2);
      setSubPhase(1); 
      if (!(await wait(2500))) return;
      setSubPhase(2); 
      playSound('glitch1.mp3', 0.05);
      triggerGlitch(250);
      if (!(await wait(3000))) return;

      // SCENE 3
      setPhase(3);
      setSubPhase(1);
      playSound('static.mp3', 0.1);
      if (!(await wait(2000))) return;
      setSubPhase(2); 
      if (!(await wait(2500))) return;
      setSubPhase(3); 
      if (!(await wait(2500))) return;

      // SCENE 4
      setPhase(4);
      setSubPhase(1); 
      playSound('oracle_voice_1.mp3', 0.25);
      if (!(await wait(4800))) return;
      setSubPhase(2); 
      playSound('scene2.mp3', 0.25);
      if (!(await wait(3500))) return;
      setSubPhase(3); 
      playSound('oracle_voice_3.mp3', 0.25);
      if (!(await wait(1500))) return;
      
      triggerGlitch(300);
      playSound('bass_hit.mp3');
      if (!(await wait(2000))) return;

      // SCENE 5
      setPhase(5);
      setSubPhase(1);
      playSound('heartbeat1.mp3');
      if (!(await wait(6000))) return;

      // SCENE 6
      setPhase(6);
      setSubPhase(1);
      if (!(await wait(2500))) return;
      setSubPhase(2); 
      playSound('beep2.mp3');
      if (!(await wait(2500))) return;

      // SCENE 7
      setPhase(7);
      setSubPhase(1);
      playSound('beep2.mp3');
      if (!(await wait(1500))) return;
      setSubPhase(2);
      if (!(await wait(1500))) return;
      setSubPhase(3);
      if (!(await wait(1500))) return;
      playSound('bass_hit.mp3');
      if (!(await wait(100))) return;

      finishIntro();
    };

    runTimeline();

    return () => {
      isMounted.current = false;
      if (bgmRef.current) bgmRef.current.pause();
      if (keyboardAudioRef.current) keyboardAudioRef.current.pause();
    };
  }, [finishIntro, playSound]);

  const renderServerRoom = () => {
    return (
      <div className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-30 z-0">
        <div className="server-room-grid w-[150%] h-[150%]">
          {Array.from({ length: 150 }).map((_, i) => {
            const isNode07 = i === 77;
            const hasLight = !isNode07 && Math.random() > 0.3; 
            const shutdownDelay = Math.random() * 2.5; 

            return (
              <div key={i} className="h-12 sm:h-16 md:h-24 bg-[#020202] border border-[#0a0a0a] relative shadow-lg flex items-center justify-center">
                {isNode07 && (
                  <div className="relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 sm:w-3 sm:h-3 bg-[#1fff0f] rounded-full animate-ping z-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 sm:w-8 sm:h-8 bg-[#1fff0f]/30 rounded-full animate-pulse blur-md z-0" />
                  </div>
                )}
                {hasLight && (
                  <div 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-[#1fff0f]/40 rounded-full"
                    style={{ 
                      animation: `shutdown-light 0.1s forwards`,
                      animationDelay: `${shutdownDelay}s`
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const isUnstableScene = phase === 4;

  return (
    <div className="fixed inset-0 z-[999] bg-black text-[#1fff0f] font-mono overflow-hidden select-none flex flex-col items-center justify-center p-4 sm:p-8">
      
      <div className="pointer-events-none absolute inset-0 z-50 crt-overlay opacity-20 mix-blend-overlay"></div>
      <div className="pointer-events-none absolute inset-0 z-40 scanlines"></div>
      <div className="pointer-events-none absolute inset-0 z-30 vignette shadow-[inset_0_0_150px_rgba(0,0,0,0.95)]"></div>

      <div className={`relative z-10 w-full max-w-3xl text-left h-full flex flex-col justify-center transition-all ${isGlitching ? 'hacker-glitch' : ''} ${isUnstableScene ? 'unstable-system' : ''}`}>
        
        {phase === 1 && (
          <div className="text-xs sm:text-sm md:text-base tracking-widest text-[#1fff0f]/80 glow-text flex flex-col gap-1 break-words">
            {subPhase >= 1 && <TypewriterText text="NEXUS_OS v7.4.1" typingSpeed={30} onTypeSound={playKeyboardSound} />}
            <br/>
            {subPhase >= 2 && <TypewriterText text="INITIALIZING CORE SYSTEMS..." typingSpeed={40} onTypeSound={playKeyboardSound} />}
            <br/>
            {subPhase >= 3 && <TypewriterText text="MEMORY................ OK" typingSpeed={10} silent />}
            {subPhase >= 4 && <TypewriterText text="SECURITY KERNEL....... OK" typingSpeed={10} silent />}
            {subPhase >= 5 && <TypewriterText text="DATABASE.............. OK" typingSpeed={10} silent />}
            {subPhase >= 6 && <TypewriterText text="ACCESS CONTROL........ OK" typingSpeed={10} silent />}
            {subPhase >= 7 && <TypewriterText text="AUDIT SYSTEM.......... OK" typingSpeed={20} silent />}
            
            <div className="mt-2"><span className="animate-pulse">_</span></div>
          </div>
        )}

        {phase === 2 && (
          <div className="text-xs sm:text-sm md:text-lg tracking-widest text-[#1fff0f] glow-text flex flex-col gap-6">
            <div>
              {subPhase >= 1 && <TypewriterText text="LAST SYSTEM INTEGRITY CHECK" typingSpeed={40} onTypeSound={playKeyboardSound} />}
              <br/>
              {subPhase >= 1 && <span className="opacity-70"><TypewriterText text="47 HOURS AGO" typingSpeed={50} onTypeSound={playKeyboardSound} /></span>}
            </div>
            
            {subPhase >= 2 && (
              <div className="text-red-500 glow-text-red mt-4 border-l-2 border-red-500 pl-3 sm:pl-4">
                <p className="font-bold">WARNING:</p>
                <TypewriterText text="AUDIT SYSTEM HAS NOT RESPONDED." typingSpeed={40} silent />
              </div>
            )}
          </div>
        )}

        {phase === 3 && (
          <div className="text-xs sm:text-sm md:text-lg tracking-widest text-[#1fff0f] glow-text flex flex-col gap-4">
            {subPhase >= 1 && <TypewriterText text="> UNKNOWN TRANSMISSION DETECTED" typingSpeed={30} silent />}
            
            {subPhase >= 2 && (
              <div className="pl-3 sm:pl-4 mt-2 flex flex-col gap-2 opacity-80 border-l border-[#1fff0f]/30 break-words">
                <TypewriterText text="SOURCE: ORACLE_01" typingSpeed={20} onTypeSound={playKeyboardSound} />
                <TypewriterText text="ENCRYPTION: █████████████" typingSpeed={10} silent />
              </div>
            )}

            {subPhase >= 3 && (
              <div className="mt-6 animate-pulse opacity-70">
                <TypewriterText text="DECRYPTION..." typingSpeed={80} silent />
              </div>
            )}
          </div>
        )}

        {phase === 4 && (
          <div className="flex flex-col items-start justify-center w-full gap-6 sm:gap-8 pl-3 sm:pl-4 border-l-2 border-[#1fff0f]/30">
            {subPhase >= 1 && (
              <div className="text-base sm:text-xl md:text-3xl text-[#1fff0f]/70 font-normal tracking-[0.1em] sm:tracking-widest leading-relaxed">
                <TypewriterText text="IF YOU ARE READING THIS," typingSpeed={60} silent /><br/>
                <TypewriterText text="I DID NOT LEAVE NEXUS." typingSpeed={70} silent />
              </div>
            )}
            
            {subPhase >= 2 && (
              <div className="text-base sm:text-xl md:text-3xl text-[#1fff0f]/70 font-normal tracking-[0.1em] sm:tracking-widest leading-relaxed">
                <TypewriterText text="THE LOGS WILL TELL YOU" typingSpeed={60} silent /><br/>
                <TypewriterText text="THAT I DID." typingSpeed={70} silent />
              </div>
            )}
            
            {subPhase >= 3 && (
              <div className="text-base sm:text-xl md:text-3xl font-bold tracking-[0.1em] sm:tracking-widest leading-relaxed mt-2 sm:mt-4 text-[#1fff0f]">
                <TypewriterText text="THEY ARE LYING." typingSpeed={100} silent />
              </div>
            )}
          </div>
        )}

        {phase === 5 && (
          <>
            {renderServerRoom()}
            <div className="relative z-10 text-xs sm:text-sm md:text-lg tracking-widest text-[#1fff0f]/80 flex flex-col gap-4 sm:gap-8 bg-black/60 p-4 sm:p-8 border border-[#1fff0f]/20 backdrop-blur-sm">
              <div>
                <p className="opacity-50 mb-1 sm:mb-2 font-mono">{'>>'} LAST KNOWN LOCATION</p>
                <div className="text-lg sm:text-xl md:text-2xl text-[#1fff0f]">
                  <TypewriterText text="SERVER_ROOM_03" typingSpeed={40} onTypeSound={playKeyboardSound} />
                </div>
                <p className="mt-1 sm:mt-2 opacity-50 font-mono">TIMESTAMP: 23:47:00</p>
              </div>
              
              <div>
                <p className="opacity-50 mb-1 sm:mb-2 font-mono">{'>>'} RELATED NODE:</p>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1fff0f]">
                  <TypewriterText text="NODE_07" typingSpeed={80} onTypeSound={playKeyboardSound} />
                </div>
              </div>

              <div className="text-red-500/80 mt-2 sm:mt-4 text-[10px] sm:text-xs font-bold border border-red-500/30 p-2 inline-block w-max">
                <TypewriterText text="[TRANSMISSION TERMINATED]" typingSpeed={30} silent />
              </div>
            </div>
          </>
        )}

        {phase === 6 && (
          <div className="text-xs sm:text-sm md:text-lg tracking-[0.15em] sm:tracking-widest text-[#1fff0f]/80 flex flex-col gap-4 sm:gap-6 mt-8 sm:mt-12 border-l-2 border-[#1fff0f]/30 pl-4 sm:pl-6 break-words">
            <div>
              <TypewriterText text="NEXUS INTERNAL INVESTIGATION" typingSpeed={30} className="opacity-50 block" onTypeSound={playKeyboardSound} />
              <TypewriterText text="CASE #ORACLE-01" typingSpeed={30} className="opacity-50 block" onTypeSound={playKeyboardSound} />
            </div>
            
            <div className="mt-4 sm:mt-8">
              <TypewriterText text="AUTHORIZED INVESTIGATOR DETECTED." typingSpeed={40} className="text-[#1fff0f] block" onTypeSound={playKeyboardSound} />
            </div>

            {subPhase >= 2 && (
              <div className="mt-2 sm:mt-4 text-base sm:text-xl md:text-2xl">
                <span className="opacity-70">DATABASE ACCESS: </span>
                <span className="text-[#1fff0f] font-bold">GRANTED</span>
              </div>
            )}
          </div>
        )}

        {phase === 7 && (
          <div className="text-xs sm:text-sm md:text-lg tracking-[0.1em] sm:tracking-widest text-[#1fff0f] glow-text flex flex-col gap-2 sm:gap-3 font-mono break-words">
            {subPhase >= 1 && <TypewriterText text="> employees" typingSpeed={50} onTypeSound={playKeyboardSound} />}
            {subPhase >= 2 && <div className="opacity-70"><TypewriterText text="> 258 RECORDS" typingSpeed={30} silent /></div>}
            {subPhase >= 3 && <div className="opacity-70"><TypewriterText text="> FIRST QUERY REQUIRED" typingSpeed={40} silent /></div>}
            
            <p className="mt-2 sm:mt-4 text-[#1fff0f]">{'>'}<span className="animate-pulse">_</span></p>
          </div>
        )}

      </div>

      {showSkip && (
        <button 
          onClick={finishIntro}
          className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 text-[#1fff0f]/40 hover:text-[#1fff0f] font-mono text-[10px] sm:text-xs tracking-[0.2em] transition-colors z-[100] border border-[#1fff0f]/20 hover:border-[#1fff0f] px-3 py-1 bg-black/50"
        >
          [ENTER] SKIP
        </button>
      )}

      <style>{`
        .crt-overlay { background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); background-size: 100% 4px, 3px 100%; }
        .scanlines { background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.15)); background-size: 100% 4px; animation: scanline 10s linear infinite; }
        @keyframes scanline { 0% { background-position: 0 0; } 100% { background-position: 0 100%; } }
        .vignette { box-shadow: inset 0 0 120px rgba(0,0,0,0.95); }
        .glow-text { text-shadow: 0 0 8px rgba(31, 255, 15, 0.3); }
        .glow-text-white { text-shadow: 0 0 12px rgba(255, 255, 255, 0.5); }
        .glow-text-red { text-shadow: 0 0 12px rgba(255, 0, 0, 0.6); }
        .server-room-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); gap: 2px; animation: slow-zoom 8s forwards ease-in-out; }
        @media (min-width: 640px) { .server-room-grid { grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap: 4px; } }
        @keyframes slow-zoom { from { transform: scale(1) translateY(0); } to { transform: scale(1.3) translateY(5%); } }
        @keyframes shutdown-light { to { opacity: 0; visibility: hidden; } }
        .hacker-glitch { animation: hard-glitch 0.2s linear infinite; }
        @keyframes hard-glitch {
          0% { transform: translate(0) skewX(0deg); filter: none; }
          20% { transform: translate(-10px, 5px) skewX(-15deg); filter: drop-shadow(-5px 0 red) drop-shadow(5px 0 cyan); }
          40% { transform: translate(10px, -5px) skewX(10deg); filter: invert(20%) hue-rotate(90deg); }
          60% { transform: translate(-5px, 2px) skewX(-5deg); filter: drop-shadow(5px 0 magenta); }
          80% { transform: translate(5px, -2px) skewX(-5deg); filter: none; }
          100% { transform: translate(0) skewX(0deg); filter: none; }
        }
        .unstable-system { animation: unstable-shake 3s infinite; }
        @keyframes unstable-shake {
           0%, 100% { transform: translate(0); }
           10%, 30%, 50%, 70%, 90% { transform: translate(-1px, 0); }
           20%, 40%, 60%, 80% { transform: translate(1px, 0); }
           45% { transform: translate(-2px, 1px); }
           85% { transform: translate(2px, -1px); }
        }
      `}</style>
    </div>
  );
};