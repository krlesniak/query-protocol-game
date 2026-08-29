import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

interface FinalProtocolProps {
  onComplete: () => void;
}

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface GlitchBlock {
  top: string;
  left: string;
  width: string;
  height: string;
  animationDelay: string;
}

export const FinalProtocol = ({ onComplete }: FinalProtocolProps) => {
  const [phase, setPhase] = useState<number>(0);
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [executionLines, setExecutionLines] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);

  const [glitchBlocks] = useState<GlitchBlock[]>(() =>
    Array.from({ length: 18 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 18 + 8}vw`,
      height: `${Math.random() * 8 + 2}vh`,
      animationDelay: `${Math.random() * 2}s`,
    }))
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  /* --- AUDIO --- */
  useSound('hum2.mp3', { volume: 0.28, loop: true, autoPlay: true });
  useSound('heartbeat1.mp3', { volume: 0.18, loop: true, autoPlay: true });
  const { play: playBeep } = useSound('beep2.mp3', { volume: 0.14 });
  const { play: playGlitch } = useSound('glitch1.mp3', { volume: 0.05 });
  const { play: playLightGlitch } = useSound('glitch_light.mp3', { volume: 0.18 });
  const { play: playError } = useSound('error.mp3', { volume: 0.18 });
  const { play: playBass } = useSound('bass_hit.mp3', { volume: 0.28 });
  const { play: playKeyboard } = useSound('keyboard.mp3', { volume: 0.08 });
  const { play: playSuccess } = useSound('success.mp3', { volume: 0.2 });

  /* --- OUTRO SEQUENCE --- */
  useEffect(() => {
    isMounted.current = true;
    const runSequence = async () => {
      // Phase 0
      playLightGlitch();
      await delay(2800);
      if (!isMounted.current) return;
      playBass();
      setPhase(1);

      // Phase 1
      await delay(3000);
      if (!isMounted.current) return;
      setPhase(2);
      playGlitch();

      // Phase 2
      await delay(3000);
      if (!isMounted.current) return;
      setPhase(3);
      await delay(800);
      playBass();

      // Phase 3
      await delay(3000);
      if (!isMounted.current) return;
      setPhase(4);
      playBeep();

      // Phase 4
      await delay(4000);
      if (!isMounted.current) return;
      setPhase(5);
      playBeep();
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    runSequence();
    return () => { isMounted.current = false; };
  }, [playBass, playBeep, playGlitch, playLightGlitch]);

  /* --- COMMAND HANDLER --- */
  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase !== 5) return;
    const command = inputValue.trim().toUpperCase();

    // HINT
    if (command === 'HELP' || command === 'HINT') {
      playLightGlitch();
      setShowHint(true);
      setErrorMsg(null);
      setInputValue('');
      return;
    }

    // FINAL COMMAND
    if (command === 'EXECUTE MIRROR://NODE_07') {
      playSuccess();
      setPhase(6);
      setErrorMsg(null);
      setShowHint(false);

      const sequence = [
        'VERIFYING ACCESS CREDENTIALS...',
        'NODE_07 ............. CONNECTED',
        'PROJECT MIRROR ...... VERIFIED',
        'CONTROLLER .......... IDENTIFIED',
        'AUDIT TRAIL ......... RECOVERED',
        'EXECUTING MIRROR PROTOCOL...',
      ];

      for (let i = 0; i < sequence.length; i++) {
        await delay(1000);
        if (!isMounted.current) return;
        setExecutionLines((prev) => [...prev, sequence[i]]);
        if (i === sequence.length - 1) playBass(); else playBeep();
      }

      await delay(4500);
      if (isMounted.current) onCompleteRef.current();
    } else {
      playError();
      setErrorMsg('UNRECOGNIZED COMMAND OR MISSING PARAMETERS.');
      setInputValue('');
    }
  };

  return (
    <div className={`fixed inset-0 z-[999] overflow-hidden select-none font-mono text-[#b7b9ae] flex flex-col items-center justify-center transition-colors duration-1000 ${phase > 0 ? 'bg-[#050707] p-4 sm:p-8 pointer-events-auto' : 'bg-transparent pointer-events-none'}`}>
      
      {/* PHASE 0 */}
      {phase === 0 && (
        <div className="absolute inset-0 z-50 pointer-events-none">
          <div className="absolute inset-0 animate-nexus-black" />
          {glitchBlocks.map((block, i) => (
            <div key={i} className="absolute bg-[#050707]" style={{ top: block.top, left: block.left, width: block.width, height: block.height, opacity: 0, animation: `nexus-block-reveal 0.08s forwards ${block.animationDelay}` }} />
          ))}
          <div className="absolute inset-0 opacity-0 animate-nexus-signal" />
        </div>
      )}

      {/* SUBTLE CRT / SURVEILLANCE LAYER */}
      {phase > 0 && (
        <>
          <div className="pointer-events-none absolute inset-0 z-10 nexus-scanlines" />
          <div className="pointer-events-none absolute inset-0 z-10 nexus-vignette" />
          <div className="pointer-events-none absolute inset-0 z-10 nexus-noise" />
        </>
      )}

      {/* SMALL NEXUS HEADER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="absolute top-5 left-5 sm:top-8 sm:left-8 z-30 text-[8px] sm:text-[10px] tracking-[0.28em] text-[#8d9288]/60">
        NEXUS CORPORATION <span className="mx-2 text-[#555a54]">/</span> SECURITY OPERATIONS
      </motion.div>

      {/* TOP RIGHT STATUS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }} className="absolute top-5 right-5 sm:top-8 sm:right-8 z-30 text-[8px] sm:text-[10px] tracking-[0.2em] text-[#8d9288]/50 text-right">
        CASE: ORACLE-01<br />STATUS: <span className="text-[#9c8050]">RESTRICTED</span>
      </motion.div>

      <div className="relative z-20 w-full max-w-4xl min-h-[420px] flex flex-col justify-center">
        <AnimatePresence mode="wait">

          {/* PHASE 1: Query execution */}
          {phase === 1 && (
            <motion.div key="phase1" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 1.2 }} className="flex flex-col items-center justify-center gap-5 text-center">
              <div className="text-[10px] sm:text-xs tracking-[0.35em] text-[#777c73]">NEXUS SECURITY TERMINAL</div>
              <div className="text-xl sm:text-3xl tracking-[0.22em] text-[#c1c3ba] font-medium">QUERY EXECUTED</div>
              <div className="w-32 h-px bg-[#747a70]/40" />
              <div className="text-[9px] sm:text-[11px] tracking-[0.25em] text-[#72776e]">RESULT SET CLOSED</div>
            </motion.div>
          )}

          {/* PHASE 2: Connection lost */}
          {phase === 2 && (
            <motion.div key="phase2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="flex flex-col items-center justify-center text-center">
              <div className="border border-[#866d42]/50 bg-[#0a0a08] px-8 py-7 sm:px-16 sm:py-10 shadow-[0_10px_40px_rgba(0,0,0,0.45)]">
                <div className="text-[9px] sm:text-xs tracking-[0.3em] text-[#77786f] mb-5">NEXUS_OS</div>
                <div className="text-lg sm:text-2xl tracking-[0.18em] text-[#aa8a51] font-medium">CONNECTION LOST</div>
                <div className="mt-5 text-[8px] sm:text-[10px] tracking-[0.2em] text-[#62665f]">REMOTE SESSION INTERRUPTED</div>
              </div>
            </motion.div>
          )}

          {/* PHASE 3: Final protocol */}
          {phase === 3 && (
            <motion.div key="phase3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4 }} className="flex flex-col items-center justify-center text-center">
              <div className="text-[9px] sm:text-xs tracking-[0.35em] text-[#777c73] mb-5">SECURITY PROCEDURE</div>
              <div className="text-xl sm:text-3xl tracking-[0.2em] text-[#a8aaa1]">ACCESSING FINAL PROTOCOL</div>
              <div className="mt-7 flex items-center gap-3 text-[9px] sm:text-[10px] tracking-[0.25em] text-[#74796f]">
                <span className="w-1.5 h-1.5 bg-[#8d7750]" /> SECURE CHANNEL OPEN
              </div>
            </motion.div>
          )}

          {/* PHASE 4 & 5: ORACLE MESSAGE + COMMAND INPUT */}
          {phase >= 4 && phase <= 5 && (
            <motion.div key="oracle-message" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} className="flex flex-col gap-6 sm:gap-8 border border-[#676b63]/40 bg-[#070909]/95 p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.55)]">
              <div className="flex justify-between items-center border-b border-[#555a53]/30 pb-4">
                <div className="text-[9px] sm:text-xs tracking-[0.28em] text-[#858980]">RECOVERED TRANSMISSION</div>
                <div className="text-[8px] sm:text-[10px] tracking-[0.2em] text-[#716f66]">ORACLE_01</div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="text-[9px] sm:text-xs tracking-[0.25em] text-[#8d7850]">ORACLE'S LAST MESSAGE</div>
                <div className="text-base sm:text-2xl leading-[1.8] tracking-[0.08em] text-[#b7b9ae]">
                  "I didn't leave you the answer.<br />I left you the <span className="text-[#a18a5d] cursor-pointer transition-colors duration-300 hover:text-[#c0a66d]" onClick={() => { if (!showHint) { playLightGlitch(); setShowHint(true); } }}>pieces</span>."
                </div>
              </div>

              <AnimatePresence>
                {showHint && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="border-l border-[#7b6845]/50 pl-4 overflow-hidden">
                    <div className="py-2 text-[8px] sm:text-[10px] leading-relaxed tracking-[0.18em] text-[#777a72]">
                      [CORRUPTED MEMORY FRAGMENT RECOVERED]<br /><br />EXPECTED SYNTAX:<br />EXECUTE [PROJECT_NAME]://[LAST_KNOWN_NODE]
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {phase === 5 && (
                <form onSubmit={handleCommandSubmit} className="mt-2 sm:mt-4 flex flex-col gap-3">
                  <div className="text-[9px] sm:text-xs tracking-[0.25em] text-[#777b72]">ENTER EXECUTION COMMAND</div>
                  <div className="flex items-center gap-3 bg-[#030505] border border-[#676c62]/50 p-3 sm:p-4 transition-colors focus-within:border-[#8c7650]/70">
                    <span className="text-[#9b8050] text-sm sm:text-base shrink-0">{'>'}</span>
                    <input ref={inputRef} type="text" value={inputValue} onChange={(e) => { setInputValue(e.target.value); playKeyboard(); }} className="bg-transparent border-none outline-none w-full min-w-0 text-[#b8bab1] uppercase tracking-[0.12em] placeholder-[#686c64]/40" placeholder="_" autoComplete="off" spellCheck="false" />
                  </div>
                  {errorMsg && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[#956b59] text-[9px] sm:text-xs tracking-[0.18em] border-l border-[#956b59]/40 pl-3">
                      {errorMsg}
                    </motion.div>
                  )}
                </form>
              )}
            </motion.div>
          )}

          {/* PHASE 6: MIRROR EXECUTION */}
          {phase === 6 && (
            <motion.div key="phase6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className="w-full max-w-3xl mx-auto">
              <div className="border border-[#646960]/40 bg-[#070909] p-6 sm:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-center border-b border-[#555a52]/30 pb-4 mb-6">
                  <div className="text-[9px] sm:text-xs tracking-[0.3em] text-[#83877e]">MIRROR PROTOCOL</div>
                  <div className="text-[8px] sm:text-[10px] tracking-[0.2em] text-[#8c754d]">EXECUTION ACTIVE</div>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4 border-l border-[#687066]/30 pl-4 sm:pl-6">
                  {executionLines.map((line, index) => (
                    <motion.div key={`${line}-${index}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className={`tracking-[0.14em] break-words ${index === executionLines.length - 1 ? 'mt-3 text-sm sm:text-xl text-[#a98a55] font-medium' : 'text-[9px] sm:text-sm text-[#92958c]'}`}>
                      <span className="mr-3 text-[#565b53]">[{String(index + 1).padStart(2, '0')}]</span>{line}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-4 border-t border-[#555a52]/30 flex justify-between text-[7px] sm:text-[9px] tracking-[0.18em] text-[#5e625b]">
                  <span>NEXUS SECURITY OPERATIONS</span>
                  <span>NODE_07</span>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* BOTTOM CLASSIFICATION MARK */}
      {phase > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 sm:right-8 z-30 flex justify-between text-[7px] sm:text-[9px] tracking-[0.2em] text-[#595e57]/70">
          <span>INTERNAL SECURITY RECORD</span>
          <span>CLASSIFICATION: RESTRICTED</span>
        </motion.div>
      )}

      <style>{`
        .nexus-scanlines {
          background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, rgba(0,0,0,0.035) 1px, rgba(0,0,0,0.035) 4px);
          opacity: 0.32; mix-blend-mode: screen;
        }
        .nexus-vignette {
          background: radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.18) 75%, rgba(0,0,0,0.65) 100%);
        }
        .nexus-noise {
          opacity: 0.035; pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
        }
        @keyframes nexus-black {
          0% { background: transparent; }
          30% { background: #050707; }
          38% { background: transparent; }
          55% { background: #050707; }
          62% { background: transparent; }
          100% { background: #050707; }
        }
        .animate-nexus-black { animation: nexus-black 2.2s forwards; }
        @keyframes nexus-signal {
          0% { opacity: 0; }
          42% { opacity: 0; }
          45% { opacity: 0.04; }
          46% { opacity: 0; }
          72% { opacity: 0; }
          74% { opacity: 0.025; }
          75% { opacity: 0; }
          100% { opacity: 0; }
        }
        .animate-nexus-signal { animation: nexus-signal 2s forwards; background: rgba(135, 145, 128, 0.06); }
        @keyframes nexus-block-reveal {
          0% { opacity: 0; }
          100% { opacity: 0.025; }
        }
      `}</style>
    </div>
  );
};