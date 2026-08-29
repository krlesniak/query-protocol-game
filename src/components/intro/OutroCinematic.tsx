import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '../../hooks/useSound';

interface OutroCinematicProps {
  onComplete: () => void;
}

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const systems = [
  'SECURITY NODE 01 ........ OFFLINE',
  'SECURITY NODE 02 ........ OFFLINE',
  'SERVER CORE ............. OFFLINE',
  'EXECUTIVE NETWORK ....... OFFLINE',
];

const buildingFloors = [
  { level: 7, windows: 6 },
  { level: 6, windows: 6 },
  { level: 5, windows: 6 },
  { level: 4, windows: 6 },
  { level: 3, windows: 6 },
  { level: 2, windows: 6 },
  { level: 1, windows: 6 },
];

export const OutroCinematic = ({ onComplete }: OutroCinematicProps) => {
  const [phase, setPhase] = useState(0);
  const [offlineLines, setOfflineLines] = useState(0);
  const [activeFloor, setActiveFloor] = useState(7);

  const isMounted = useRef(true);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Audio setup
  useSound('hum2.mp3', { volume: 0.28, loop: true, autoPlay: true });
  const { play: playBeep } = useSound('beep2.mp3', { volume: 0.16 });
  const { play: playShutdown } = useSound('shutdown2.mp3', { volume: 0.32 });
  const { play: playFinalTruth } = useSound('final_truth.mp3', { volume: 0.28 });

  useEffect(() => {
    isMounted.current = true;

    const runOutro = async () => {
      // PHASE 0: Quiet aftermath
      await delay(2000);
      if (!isMounted.current) return;

      // PHASE 1: Security infrastructure begins shutting down
      setPhase(1);
      for (let i = 1; i <= systems.length; i++) {
        await delay(1000);
        if (!isMounted.current) return;
        setOfflineLines(i);
        playBeep();
      }
      await delay(1500);
      if (!isMounted.current) return;

      // PHASE 2: NEXUS facility power grid shutting down floor by floor
      setPhase(2);
      await delay(1200);
      if (!isMounted.current) return;
      
      playShutdown();
      for (let i = 7; i >= 0; i--) {
        await delay(550);
        if (!isMounted.current) return;
        setActiveFloor(i);
      }
      await delay(1500);
      if (!isMounted.current) return;

      // PHASE 3: Network connection termination
      setPhase(3);
      playBeep();
      await delay(4500);
      if (!isMounted.current) return;

      // PHASE 4: Final system state
      setPhase(4);
      await delay(3200);
      if (!isMounted.current) return;

      // PHASE 5: Truth statement
      setPhase(5);
      await delay(1000);
      playFinalTruth();
      await delay(5000);
      if (!isMounted.current) return;

      // PHASE 6: Final message
      setPhase(6);
      await delay(5000);
      if (!isMounted.current) return;

      onCompleteRef.current();
    };

    runOutro();

    return () => {
      isMounted.current = false;
    };
  }, [playBeep, playShutdown, playFinalTruth]);

  return (
    <div className="fixed inset-0 z-[999] bg-[#030505] text-[#a6aca4] font-mono overflow-hidden select-none flex flex-col items-center justify-center">
      
      {/* Background Overlays */}
      <div className="pointer-events-none absolute inset-0 z-[5] opacity-[0.045] bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_2px,rgba(180,190,180,0.35)_3px)]" />
      <div className="pointer-events-none absolute inset-0 z-[6] opacity-[0.035] bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
      
      <AnimatePresence>
        {phase < 5 && (
          <motion.div
            key="scanlines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.16 }}
            exit={{ opacity: 0, transition: { duration: 2 } }}
            className="pointer-events-none absolute inset-0 z-10 scanlines"
          />
        )}
      </AnimatePresence>

      <div className="relative z-20 w-full max-w-5xl h-auto min-h-[420px] sm:min-h-[520px] px-4">
        <AnimatePresence mode="wait">
          
          {/* PHASE 1 & 2: Systems Offline & Building Shutdown */}
          {(phase === 1 || phase === 2) && (
            <motion.div
              key="systems"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(6px)', transition: { duration: 1.5 } }}
              className="absolute inset-0 flex flex-col sm:flex-row w-full justify-center sm:justify-between items-center px-2 sm:px-10 gap-10 sm:gap-12"
            >
              {/* Left Column: Systems */}
              <div className="flex flex-col gap-3 sm:gap-4 w-full sm:flex-1">
                <div className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#59615c] mb-2">
                  NEXUS SECURITY NETWORK
                </div>
                <div className="border-t border-[#333b37] pt-4">
                  {systems.slice(0, offlineLines).map((line, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                      className="text-[10px] sm:text-sm tracking-[0.08em] sm:tracking-[0.12em] text-[#7d857e] leading-relaxed"
                    >
                      <span className="text-[#6d735e] mr-2">//</span>
                      {line}
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence>
                  {offlineLines === systems.length && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 1 }}
                      className="mt-5 border-l border-[#766743] pl-3 text-[9px] sm:text-[10px] tracking-[0.14em] text-[#8d7b52]"
                    >
                      FACILITY CONTROL:<br />LOCAL SYSTEMS UNRESPONSIVE
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Column: Building Schematic (Phase 2) */}
              {phase === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col items-center w-full sm:flex-1"
                >
                  <div className="text-[9px] sm:text-[10px] tracking-[0.16em] text-[#59615c] mb-5">
                    NEXUS_HQ // POWER GRID
                  </div>
                  <div className="text-[8px] tracking-[0.12em] text-[#474f4a] mb-3">
                    CORE FACILITY
                  </div>

                  <div className="relative flex flex-col items-center border-b border-[#4a514d] px-5 sm:px-8 pb-3">
                    <div className="w-16 sm:w-24 h-px bg-[#59615c] mb-1" />
                    <div className="w-px h-5 bg-[#454c48] mb-1" />
                    {buildingFloors.map((floor) => {
                      const isOnline = activeFloor >= floor.level;
                      return (
                        <div
                          key={floor.level}
                          className={`flex items-center justify-center gap-1.5 sm:gap-2.5 border-x border-t px-2 sm:px-3 py-1.5 sm:py-2 w-28 sm:w-40 transition-all duration-700 ${isOnline ? 'border-[#3d4541] bg-[#080c0b]' : 'border-[#1a1e1c] bg-transparent'}`}
                        >
                          <span className={`absolute ml-[-145px] sm:ml-[-205px] text-[7px] sm:text-[8px] tracking-wider ${isOnline ? 'text-[#505953]' : 'text-[#252a27]'}`}>
                            L{floor.level}
                          </span>
                          {Array.from({ length: floor.windows }).map((_, i) => (
                            <div key={i} className={`w-2 sm:w-3 h-3 sm:h-4 transition-all duration-700 ${isOnline ? 'bg-[#596c58]' : 'bg-transparent border border-[#242a27]'}`} />
                          ))}
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 text-[8px] tracking-[0.14em] text-[#565d58]">
                    ACTIVE FLOORS: {activeFloor} / 7
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* PHASE 3: Connection Terminated */}
          {phase === 3 && (
            <motion.div
              key="connection-terminated"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(5px)', transition: { duration: 1.5 } }}
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-xl border border-[#444b47] bg-[#070a0a] px-6 sm:px-10 py-7 sm:py-9">
                <div className="flex items-center justify-between border-b border-[#2b312e] pb-3 mb-7">
                  <span className="text-[8px] sm:text-[9px] tracking-[0.18em] text-[#59615c]">NEXUS_OS</span>
                  <span className="text-[8px] sm:text-[9px] tracking-[0.18em] text-[#766746]">EXECUTIVE RESTRICTED</span>
                </div>
                <div className="text-center text-[15px] sm:text-2xl tracking-[0.16em] text-[#a1a59d]">
                  CONNECTION TERMINATED
                </div>
                <div className="text-center mt-5 text-[8px] sm:text-[9px] tracking-[0.18em] text-[#59615c]">
                  REMOTE SESSION CLOSED
                </div>
                <div className="mt-7 pt-4 border-t border-[#292f2c] text-center text-[7px] sm:text-[8px] tracking-[0.14em] text-[#474e4a]">
                  SECURITY AUDIT RECORD PRESERVED
                </div>
              </div>
            </motion.div>
          )}

          {/* PHASE 4: Offline Status */}
          {phase === 4 && (
            <motion.div
              key="final-system-state"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 1.5 } }}
              className="absolute inset-0 flex items-center justify-center px-4"
            >
              <div className="w-full max-w-lg text-center">
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }} className="text-[10px] sm:text-xs tracking-[0.2em] text-[#606862]">
                  FACILITY STATUS
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1.5 }} className="mt-5 text-xl sm:text-3xl tracking-[0.18em] text-[#858b84]">
                  OFFLINE
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1.2 }} className="mt-6 mx-auto w-24 h-px bg-[#665b43]" />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1.2 }} className="mt-5 text-[8px] sm:text-[9px] tracking-[0.16em] leading-relaxed text-[#555d58]">
                  ALL LOCAL SECURITY SYSTEMS<br />ARE NO LONGER RESPONDING
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* PHASE 5 & 6: Truth Messages */}
          {phase >= 5 && (
            <motion.div
              key="oracle-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center px-5"
            >
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} className="mb-8 text-[8px] sm:text-[9px] tracking-[0.22em] text-[#565e59]">
                NEXUS CORPORATION // INTERNAL ARCHIVE
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2 }} className="text-xl sm:text-3xl font-normal tracking-[0.12em] sm:tracking-[0.18em] text-[#b0b2aa]">
                YOU FOUND THE TRUTH.
              </motion.div>
              <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: '72px', opacity: 1 }} transition={{ delay: 1.2, duration: 1.2 }} className="mt-7 h-px bg-[#756847]" />
              
              {phase >= 6 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2 }} className="mt-8 text-[10px] sm:text-sm tracking-[0.14em] sm:tracking-[0.22em] text-[#777d76] max-w-2xl leading-loose">
                  NOW MAKE SURE THEY CAN'T ERASE IT.
                </motion.div>
              )}

              {phase >= 6 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1.5 }} className="absolute bottom-7 left-0 right-0 text-center text-[7px] sm:text-[8px] tracking-[0.18em] text-[#3f4742]">
                  CASE: ORACLE-01 <span className="mx-3">•</span> ARCHIVE INTEGRITY: UNKNOWN
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <style>{`
        .scanlines {
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.018) 0px,
            rgba(255,255,255,0.018) 1px,
            rgba(0,0,0,0.08) 2px,
            rgba(0,0,0,0.08) 4px
          );
        }

        @keyframes nexusFlicker {
          0%, 100% { opacity: 1; }
          48% { opacity: 0.985; }
          50% { opacity: 0.97; }
          52% { opacity: 0.99; }
        }

        .nexus-screen {
          animation: nexusFlicker 8s infinite;
        }
      `}</style>
    </div>
  );
};