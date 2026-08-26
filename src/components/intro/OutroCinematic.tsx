import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

interface OutroCinematicProps {
  onComplete: () => void;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const systems = [
  "SECURITY NODE 01 ........ OFFLINE",
  "SECURITY NODE 02 ........ OFFLINE",
  "SERVER CORE ............. OFFLINE",
  "EXECUTIVE NETWORK ....... OFFLINE"
];

const buildingFloors = [
  { level: 7, windows: 6 },
  { level: 6, windows: 6 },
  { level: 5, windows: 6 },
  { level: 4, windows: 6 },
  { level: 3, windows: 6 },
  { level: 2, windows: 6 },
  { level: 1, windows: 6 }
];

export const OutroCinematic = ({ onComplete }: OutroCinematicProps) => {
  const [phase, setPhase] = useState(0);
  const [offlineLines, setOfflineLines] = useState<number>(0);
  const [activeFloor, setActiveFloor] = useState<number>(7);
  
  const isMounted = useRef(true);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useSound('hum2.mp3', { volume: 0.4, loop: true, autoPlay: true });

  const { play: playBeep } = useSound('beep2.mp3', { volume: 0.2 });
  const { play: playShutdown } = useSound('shutdown2.mp3', { volume: 0.4 }); 
  const { play: playFinalTruth } = useSound('final_truth.mp3', { volume: 0.35 }); 

  useEffect(() => {
    isMounted.current = true;

    const runOutro = async () => {
      await delay(1000);
      if (!isMounted.current) return;
      
      setPhase(1);
      for (let i = 1; i <= systems.length; i++) {
        await delay(800);
        if (!isMounted.current) return;
        setOfflineLines(i);
        playBeep();
      }

      await delay(1500);
      if (!isMounted.current) return;

      setPhase(2);
      await delay(1400);
      playShutdown(); 
      
      for (let i = 7; i >= 0; i--) {
        await delay(500); 
        if (!isMounted.current) return;
        setActiveFloor(i);
      }

      await delay(1500);
      if (!isMounted.current) return;

      setPhase(3);
      playBeep();

      await delay(2500);
      if (!isMounted.current) return;

      setPhase(4);
      
      await delay(3000);
      if (!isMounted.current) return;

      setPhase(5);
      playFinalTruth(); 
      
      await delay(5000);
      if (!isMounted.current) return;

      setPhase(6);
      
      await delay(5000);
      if (isMounted.current) {
        onCompleteRef.current();
      }
    };

    runOutro();

    return () => {
      isMounted.current = false;
    };
  }, [playBeep, playShutdown, playFinalTruth]);

  return (
    <div className="fixed inset-0 z-[999] bg-[#020202] text-[#1fff0f] font-mono overflow-hidden select-none flex flex-col items-center justify-center">
      
      <AnimatePresence>
        {phase < 4 && (
          <motion.div 
            key="scanlines"
            exit={{ opacity: 0, transition: { duration: 2 } }}
            className="pointer-events-none absolute inset-0 z-10 scanlines opacity-20"
          />
        )}
      </AnimatePresence>

      <div className="relative z-20 w-full max-w-4xl h-auto min-h-[400px] sm:min-h-[500px]">
        <AnimatePresence>
          
          {/* PHASE 1 & 2: Turn Off Systems */}
          {(phase === 1 || phase === 2) && (
            <motion.div 
              key="systems"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(10px)', transition: { duration: 1.5 } }}
              className="absolute inset-0 flex flex-col sm:flex-row w-full justify-center sm:justify-between items-center px-4 sm:px-12 gap-8 sm:gap-0"
            >
              
              {/* Left side: Logs */}
              <div className="flex flex-col gap-3 sm:gap-4 w-full sm:flex-1 text-center sm:text-left">
                {systems.slice(0, offlineLines).map((line, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={index} 
                    className="text-xs sm:text-xl tracking-[0.1em] sm:tracking-widest text-red-500 glow-text-red font-bold"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>

              {/* Right side: Building Wireframe */}
              {phase === 2 && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center w-full sm:flex-1 mt-8 sm:mt-0"
                >
                  <div className="text-[10px] sm:text-sm tracking-widest opacity-50 mb-4 sm:mb-6 text-[#1fff0f]">NEXUS_HQ // POWER GRID STATUS:</div>
                  
                  <div className="flex flex-col items-center border-b-2 border-[#1fff0f]/40 px-4 sm:px-8">
                    {/* Wireframe */}
                    <div className="w-0.5 sm:w-1 h-6 sm:h-8 bg-[#1fff0f]/30"></div>
                    
                    {/* Floors */}
                    {buildingFloors.map((floor) => {
                      const isOnline = activeFloor >= floor.level;
                      return (
                          <div 
                          key={floor.level} 
                          className={`flex justify-center gap-1.5 sm:gap-3 border-x border-t border-[#1fff0f]/30 p-1.5 sm:p-2.5 w-24 sm:w-36 transition-colors duration-1000 ${!isOnline ? 'border-[#020202]' : 'bg-[#050f05]'}`}
                          >
                          {Array.from({ length: floor.windows }).map((_, i) => (
                              <div 
                              key={i} 
                              className={`w-2 sm:w-3.5 h-4 sm:h-6 transition-all duration-1000 ${
                                  isOnline 
                                  ? 'bg-[#1fff0f] shadow-[0_0_10px_rgba(31,255,15,0.8)]' 
                                  : 'bg-transparent border border-[#1fff0f]/10'
                              }`} 
                              />
                          ))}
                          </div>
                      );
                      })}
                  </div>
                </motion.div>
              )}

            </motion.div>
          )}

          {/* PHASE 3: Connection Termination */}
          {phase === 3 && (
            <motion.div 
              key="connection-terminated"
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)', transition: { duration: 1.5 } }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <div className="text-xl sm:text-3xl tracking-widest text-center text-red-500 font-bold glow-text-red border border-red-500/30 p-4 sm:p-8 bg-red-950/20 w-full max-w-lg">
                NEXUS_OS<br/><br/>
                CONNECTION TERMINATED
              </div>
            </motion.div>
          )}

          {/* PHASE 5 & 6: Final Message in Absolute Darkness */}
          {phase >= 5 && (
            <motion.div 
              key="oracle-message"
              className="absolute inset-0 flex flex-col items-center justify-center gap-8 sm:gap-12 text-center px-4"
            >
              {phase >= 5 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2 }}
                  className="text-2xl sm:text-4xl font-bold tracking-[0.15em] sm:tracking-[0.2em] text-[var(--accent-hacker)] glow-text-neon"
                >
                  YOU FOUND THE TRUTH.
                </motion.div>
              )}
              
              {phase >= 6 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 2 }}
                  className="text-sm sm:text-2xl tracking-[0.15em] sm:tracking-[0.3em] text-[#1fff0f]/80"
                >
                  NOW MAKE SURE THEY CAN'T ERASE IT.
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style>{`
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.15));
          background-size: 100% 4px;
        }
        .glow-text-red { text-shadow: 0 0 15px rgba(239, 68, 68, 0.6); }
        .glow-text-white { text-shadow: 0 0 25px rgba(255, 255, 255, 0.4); }
        .glow-text-neon { text-shadow: 0 0 15px var(--accent-hacker, #1fff0f); }
      `}</style>
    </div>
  );
};