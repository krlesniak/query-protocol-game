import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

interface FinalProtocolProps {
  onComplete: () => void;
}

interface GlitchBlock {
  top: string;
  left: string;
  width: string;
  height: string;
  animationDelay: string;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const FinalProtocol = ({ onComplete }: FinalProtocolProps) => {
  const [phase, setPhase] = useState<number>(0);
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [executionLines, setExecutionLines] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false); 
  
  const [glitchBlocks] = useState<GlitchBlock[]>(() => {
    return Array.from({ length: 60 }).map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 30 + 10}vw`,
      height: `${Math.random() * 20 + 5}vh`,
      animationDelay: `${Math.random() * 1.8}s`
    }));
  });
  
  const inputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(true);
  
  useSound('hum2.mp3', { volume: 0.4, loop: true, autoPlay: true }); 
  useSound('heartbeat1.mp3', { volume: 0.6, loop: true, autoPlay: true });

  const { play: playBeep } = useSound('beep2.mp3', { volume: 0.2 });
  const { play: playGlitch } = useSound('glitch1.mp3', { volume: 0.1 });
  const { play: playLightGlitch } = useSound('glitch_light.mp3', { volume: 0.6 });
  const { play: playError } = useSound('error.mp3', { volume: 0.3 }); 
  const { play: playBass } = useSound('bass_hit.mp3', { volume: 0.5 });
  const { play: playKeyboard } = useSound('keyboard.mp3', { volume: 0.15 });
  const {play : playSuccess} = useSound('success.mp3', {volume: 0.3});

  useEffect(() => {
    isMounted.current = true;

    const runSequence = async () => {
      playLightGlitch();
      await delay(2800); 
      playBass(); 
      
      if (!isMounted.current) return;
      setPhase(1); 
      
      await delay(2000);
      if (!isMounted.current) return;
      setPhase(2); 
      playGlitch();
      
      await delay(2000);
      if (!isMounted.current) return;
      setPhase(3); 
      playBass();
      
      await delay(3000);
      if (!isMounted.current) return;
      setPhase(4); 
      playBeep();
      
      await delay(3000);
      if (!isMounted.current) return;
      setPhase(5); 
      playBeep();
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    runSequence();

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleCommandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phase !== 5) return;

    const command = inputValue.trim().toUpperCase();

    if (command === 'HELP' || command === 'HINT') {
      playLightGlitch();
      setShowHint(true);
      setErrorMsg(null);
      setInputValue('');
      return;
    }

    if (command === 'EXECUTE MIRROR://NODE_07' || (command.includes('EXECUTE') && command.includes('MIRROR'))) {
      playSuccess();
      setPhase(6); 
      setErrorMsg(null);
      setShowHint(false);
      
      const sequence = [
        "VERIFYING...",
        "NODE_07 ............. CONNECTED",
        "PROJECT MIRROR ...... VERIFIED",
        "CONTROLLER .......... IDENTIFIED",
        "AUDIT TRAIL ......... RECOVERED",
        "EXECUTING MIRROR PROTOCOL..."
      ];

      for (let i = 0; i < sequence.length; i++) {
        await delay(1000);
        if (!isMounted.current) return;
        setExecutionLines(prev => [...prev, sequence[i]]);
        
        if (i === sequence.length - 1) {
          playBass(); 
        } else {
          playBeep();
        }
      }

      await delay(4500);
      if (isMounted.current) {
        onComplete();
      }

    } else {
      playError(); 
      setErrorMsg('UNRECOGNIZED COMMAND OR MISSING PARAMETERS.');
      setInputValue('');
    }
  };

  return (
    <div className={`fixed inset-0 z-[999] text-[#1fff0f] font-mono overflow-hidden select-none flex flex-col items-center justify-center transition-colors ${phase > 0 ? 'bg-[#020202] p-8 pointer-events-auto' : 'bg-transparent pointer-events-none'}`}>
      
      {phase === 0 && (
        <div className="absolute inset-0 z-50">
          <div className="absolute inset-0 animate-flicker-black"></div>
          {glitchBlocks.map((block, i) => (
            <div
              key={i}
              className="absolute bg-[#020202]"
              style={{
                top: block.top,
                left: block.left,
                width: block.width,
                height: block.height,
                opacity: 0,
                animation: `block-reveal 0.05s forwards ${block.animationDelay}`
              }}
            ></div>
          ))}
          <div className="absolute inset-0 opacity-0 animate-glitch-dark"></div>
        </div>
      )}

      {phase > 0 && (
        <div className="pointer-events-none absolute inset-0 z-10 scanlines opacity-30"></div>
      )}
      
      <div className={`relative z-20 w-full max-w-3xl flex flex-col gap-8 ${phase === 2 ? 'hacker-glitch' : ''}`}>
        
        {phase === 1 && (
          <div className="text-4xl font-extrabold tracking-widest text-center text-[#1fff0f] glow-text-neon">
            QUERY EXECUTED.
          </div>
        )}

        {phase === 2 && (
          <div className="text-3xl tracking-widest text-center text-red-500 glow-text-red font-bold">
            NEXUS_OS CONNECTION LOST.
          </div>
        )}

        {phase === 3 && (
          <div className="text-4xl font-extrabold tracking-widest text-center animate-pulse text-[#1fff0f]/60">
            ACCESSING FINAL PROTOCOL...
          </div>
        )}

        {phase >= 4 && phase <= 5 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex flex-col gap-6 border border-[#1fff0f]/30 p-10 bg-black/70 backdrop-blur-sm shadow-[0_0_40px_rgba(31,255,15,0.15)]"
          >
            <div className="text-base opacity-70 tracking-widest mb-2 text-[#1fff0f]">ORACLE'S LAST MESSAGE:</div>
            <div className="text-3xl leading-relaxed tracking-wider text-[#1fff0f] glow-text-neon">
              "I didn't leave you the answer.<br/>
              I left you the <span 
                className="cursor-pointer hover:text-[#1f651a] transition-colors duration-300 relative group glow-text-neon z-50"
                onClick={() => {
                  if (!showHint) {
                    playLightGlitch();
                    setShowHint(true);
                  }
                }}
              >
                pieces
              </span>."
            </div>

            <AnimatePresence>
              {showHint && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 text-[11px] opacity-40 tracking-[0.2em] text-[#1fff0f] border-l border-[#1fff0f]/30 pl-4 overflow-hidden"
                >
                  <div className="py-2">
                    [CORRUPTED MEMORY FRAGMENT RECOVERED]<br/>
                    EXPECTED SYNTAX: EXECUTE [PROJECT_NAME]://[LAST_KNOWN_NODE]
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {phase === 5 && (
              <form onSubmit={handleCommandSubmit} className="mt-10 flex flex-col gap-4">
                <div className="text-base opacity-70 tracking-widest text-[#1fff0f]">ENTER EXECUTION COMMAND:</div>
                <div className="flex items-center gap-4 text-2xl bg-[#050f05] border border-[#1fff0f]/60 p-5 focus-within:shadow-[0_0_20px_rgba(31,255,15,0.3)] focus-within:border-[#1fff0f] transition-all">
                  <span className="text-[#1fff0f] glow-text-neon">{'>'}</span>
                  <input 
                    ref={inputRef}
                    type="text" 
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                      playKeyboard();
                    }}
                    className="bg-transparent border-none outline-none w-full text-[#1fff0f] uppercase placeholder-[#1fff0f]/30 glow-text-neon"
                    placeholder="_"
                    autoComplete="off"
                    spellCheck="false"
                  />
                </div>
                {errorMsg && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-base tracking-widest font-bold glow-text-red">
                    {errorMsg}
                  </motion.div>
                )}
              </form>
            )}
          </motion.div>
        )}

        {phase === 6 && (
          <div className="flex flex-col gap-5 w-full pl-8 border-l-2 border-[#1fff0f]/40">
            {executionLines.map((line, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`tracking-widest ${index === executionLines.length - 1 ? 'text-3xl mt-6 font-bold text-[#1fff0f] glow-text-neon' : 'text-xl text-[#1fff0f]/90'}`}
              >
                {line}
              </motion.div>
            ))}
          </div>
        )}

      </div>

      <style>{`
        @keyframes flicker-black {
          0% { background: transparent; }
          20% { background: #020202; }
          25% { background: transparent; }
          40% { background: #020202; }
          45% { background: transparent; }
          90% { background: transparent; }
          100% { background: #020202; }
        }
        @keyframes block-reveal {
          to { opacity: 1; }
        }
        @keyframes glitch-dark {
          0% { opacity: 0; background: transparent; }
          30% { opacity: 1; background: rgba(31, 255, 15, 0.05); backdrop-filter: hue-rotate(90deg) contrast(150%); }
          35% { opacity: 0; background: transparent; }
          70% { opacity: 1; background: rgba(239, 68, 68, 0.05); backdrop-filter: contrast(200%); }
          75% { opacity: 0; }
        }
        .animate-flicker-black { animation: flicker-black 1.8s forwards; }
        .animate-glitch-dark { animation: glitch-dark 1.5s forwards; }

        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.15));
          background-size: 100% 4px;
        }
        
        .glow-text-red { text-shadow: 0 0 15px rgba(239, 68, 68, 0.6); }
        .glow-text-neon { text-shadow: 0 0 12px rgba(31, 255, 15, 0.6); }
        
        .hacker-glitch {
          animation: hard-glitch 0.2s linear infinite;
        }
        @keyframes hard-glitch {
          0% { transform: translate(0) skewX(0deg); filter: none; }
          20% { transform: translate(-10px, 5px) skewX(-15deg); filter: drop-shadow(-5px 0 rgba(239,68,68,0.5)) drop-shadow(5px 0 rgba(31,255,15,0.3)); }
          40% { transform: translate(10px, -5px) skewX(10deg); filter: hue-rotate(90deg); }
          60% { transform: translate(-5px, 2px) skewX(-5deg); filter: drop-shadow(5px 0 rgba(31,255,15,0.5)); }
          80% { transform: translate(5px, -2px) skewX(-5deg); filter: none; }
          100% { transform: translate(0) skewX(0deg); filter: none; }
        }
      `}</style>
    </div>
  );
};