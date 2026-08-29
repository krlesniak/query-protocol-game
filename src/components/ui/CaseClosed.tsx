import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { LEVELS } from '../../game/levels';
import { useSound } from '../../hooks/useSound';

interface CaseClosedProps {
  onReturnToMenu: () => void;
}

export const CaseClosed = ({ onReturnToMenu }: CaseClosedProps) => {
  const {
    score,
    playTime,
    totalQueryAttempts,
    failedQueries,
    collectedEvidence,
    completedLevels,
    usedHints,
    resetGame,
    soundEnabled,
    toggleSound,
  } = useGameStore();

  const [confirmWipe, setConfirmWipe] = useState(false);

  /* --- AUDIO --- */
  useSound('hum2.mp3', { volume: soundEnabled ? 0.28 : 0, loop: true, autoPlay: true });
  const { play: playClick } = useSound('keyboard.mp3', { volume: soundEnabled ? 0.25 : 0 });
  const { play: playReveal } = useSound('bass_hit1.mp3', { volume: soundEnabled ? 0.28 : 0 });
  const { play: playHover } = useSound('beep2.mp3', { volume: soundEnabled ? 0.06 : 0 });

  useEffect(() => {
    playReveal();
  }, [playReveal]);

  /* --- HELPERS --- */
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
  };

  const getRank = (xp: number) => {
    if (xp >= 15000) return 'ORACLE';
    if (xp >= 10000) return 'NEXUS CLASSIFIED';
    if (xp >= 6000) return 'SENIOR ANALYST';
    if (xp >= 3000) return 'OPERATIVE';
    if (xp >= 1000) return 'INVESTIGATOR';
    return 'FIELD ANALYST';
  };

  const totalHints = Object.values(usedHints).flat().length;

  /* --- RESTART GAME --- */
  const handleRestart = () => {
    playClick();
    resetGame();
    onReturnToMenu();
  };

  /* --- ANIMATION VARIANTS --- */
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -8 },
    show: { opacity: 1, x: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  /* --- UI --- */
  return (
    <div className="fixed inset-0 z-[9999] bg-[#050707] text-[#b3b5ad] font-mono overflow-y-auto select-none">
      
      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none fixed inset-0 z-0 nexus-scanlines" />
      <div className="pointer-events-none fixed inset-0 z-0 nexus-vignette" />
      <div className="pointer-events-none fixed inset-0 z-0 nexus-noise" />

      <div className="relative z-20 min-h-screen w-full px-4 pt-20 pb-8 sm:px-8 sm:pt-24 sm:pb-12 flex flex-col items-center">
        
        {/* HEADER */}
        <div className="w-full max-w-4xl mb-6 sm:mb-8 flex items-start justify-between gap-4">
          <div className="text-[7px] sm:text-[9px] tracking-[0.25em] text-[#70756d]/70 uppercase leading-relaxed">
            NEXUS CORPORATION <span className="mx-2 text-[#444943]">/</span> SECURITY OPERATIONS
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden sm:block text-[8px] tracking-[0.2em] text-[#777a72]/60 text-right uppercase leading-relaxed">
              CASE: ORACLE-01<br />RECORD: FINAL
            </div>
            <button
              onClick={() => { playClick(); if (toggleSound) toggleSound(); }}
              className="p-2 sm:p-3 border border-[#50564f]/60 bg-[#080a0a] text-[#747970] hover:text-[#aaa991] hover:border-[#7d6b4b]/70 transition-all duration-300"
              aria-label="Toggle sound"
            >
              {soundEnabled !== false ? (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
              ) : (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
              )}
            </button>
          </div>
        </div>

        {/* MAIN PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative w-full max-w-4xl border border-[#303630] bg-[#090c0c] shadow-[0_25px_80px_rgba(0,0,0,0.55)] overflow-hidden"
        >
          {/* TOP DOCUMENT LINE */}
          <div className="absolute top-0 left-0 w-full h-px bg-[#7d6c4b]/50" />
          
          <div className="px-6 py-6 sm:px-10 sm:py-8 border-b border-[#303630]">
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }} className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-4 text-[8px] sm:text-[10px] tracking-[0.28em] text-[#6f756c] uppercase">
                <span>EXECUTIVE SECURITY ARCHIVE</span>
                <span className="text-[#806d4b]">RESTRICTED</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-1 h-10 sm:h-12 bg-[#7f6b48] opacity-70" />
                <div>
                  <h1 className="text-xl sm:text-3xl font-medium tracking-[0.12em] text-[#c4c5bc] uppercase">CASE CLOSED</h1>
                  <p className="mt-2 text-[9px] sm:text-[11px] tracking-[0.2em] text-[#747970] uppercase">QUERY_PROTOCOL // ORACLE-01</p>
                </div>
              </div>
              <div className="mt-2 text-[8px] sm:text-[10px] tracking-[0.18em] text-[#60655e] uppercase">
                INVESTIGATION RECORD SEALED — EVIDENCE RETAINED
              </div>
            </motion.div>
          </div>

          <div className="px-6 sm:px-10 py-3 border-b border-[#292e29] bg-[#070909] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-[8px] sm:text-[10px] tracking-[0.2em] text-[#73786f] uppercase">
              <span className="w-1.5 h-1.5 bg-[#71806d]" /> INVESTIGATION STATUS
            </div>
            <span className="text-[8px] sm:text-[10px] tracking-[0.2em] text-[#a08a60] uppercase">ARCHIVED</span>
          </div>

          {/* STATS GRID */}
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2">
            
            <div className="flex flex-col divide-y divide-[#292e29]">
              <motion.div variants={itemVariants} className="px-6 py-5 sm:px-10 sm:py-6">
                <div className="text-[8px] sm:text-[10px] text-[#656a63] tracking-[0.22em] mb-2 uppercase">FINAL CLASSIFICATION</div>
                <div className="text-lg sm:text-xl tracking-[0.12em] text-[#a8956d] uppercase">{getRank(score)}</div>
              </motion.div>
              <motion.div variants={itemVariants} className="px-6 py-5 sm:px-10 sm:py-6">
                <div className="text-[8px] sm:text-[10px] text-[#656a63] tracking-[0.22em] mb-2 uppercase">EVIDENCE VALUE</div>
                <div className="text-lg sm:text-xl tracking-[0.12em] text-[#b7b8b0]">{score}</div>
              </motion.div>
              <motion.div variants={itemVariants} className="px-6 py-5 sm:px-10 sm:py-6">
                <div className="text-[8px] sm:text-[10px] text-[#656a63] tracking-[0.22em] mb-2 uppercase">SESSION DURATION</div>
                <div className="text-lg sm:text-xl tracking-[0.12em] text-[#b7b8b0]">{formatTime(playTime)}</div>
              </motion.div>
            </div>

            <div className="flex flex-col divide-y divide-[#292e29] border-t sm:border-t-0 sm:border-l border-[#292e29]">
              <motion.div variants={itemVariants} className="px-6 py-5 sm:px-10 sm:py-6">
                <div className="text-[8px] sm:text-[10px] text-[#656a63] tracking-[0.22em] mb-2 uppercase">LEVELS CLEARED</div>
                <div className="text-lg sm:text-xl tracking-[0.12em] text-[#b7b8b0]">{completedLevels.length} <span className="text-[#555a53]"> / {LEVELS.length}</span></div>
              </motion.div>
              <motion.div variants={itemVariants} className="px-6 py-5 sm:px-10 sm:py-6">
                <div className="text-[8px] sm:text-[10px] text-[#656a63] tracking-[0.22em] mb-2 uppercase">EVIDENCE RECOVERED</div>
                <div className="text-lg sm:text-xl tracking-[0.12em] text-[#b7b8b0]">{collectedEvidence.length} <span className="ml-2 text-[9px] sm:text-[10px] text-[#646a62]">FILES</span></div>
              </motion.div>
              <motion.div variants={itemVariants} className="px-6 py-5 sm:px-10 sm:py-6">
                <div className="text-[8px] sm:text-[10px] text-[#656a63] tracking-[0.22em] mb-2 uppercase">QUERIES / FAILED</div>
                <div className="text-lg sm:text-xl tracking-[0.12em] text-[#b7b8b0]">{totalQueryAttempts} <span className="text-[#8b6557] ml-2">/ {failedQueries}</span></div>
              </motion.div>
              <motion.div variants={itemVariants} className="px-6 py-5 sm:px-10 sm:py-6">
                <div className="text-[8px] sm:text-[10px] text-[#656a63] tracking-[0.22em] mb-2 uppercase">ASSISTANCE REQUESTS</div>
                <div className="text-lg sm:text-xl tracking-[0.12em] text-[#b7b8b0]">{totalHints}</div>
              </motion.div>
            </div>
            
          </motion.div>

          {/* SECURITY NOTE */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.8 }} className="mx-6 sm:mx-10 mt-6 mb-6 sm:mt-8 sm:mb-8 border border-[#3b4039] bg-[#070909] px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex items-start gap-3">
              <span className="mt-1 w-1.5 h-1.5 shrink-0 bg-[#806d4b]" />
              <div>
                <div className="text-[8px] sm:text-[10px] tracking-[0.22em] text-[#8b8d84] uppercase">SECURITY NOTICE</div>
                <p className="mt-2 text-[9px] sm:text-[11px] leading-relaxed tracking-[0.08em] text-[#666b63]">INVESTIGATION RECORD SEALED. ALL RECOVERED EVIDENCE REMAINS SUBJECT TO NEXUS SECURITY RETENTION POLICY.</p>
              </div>
            </div>
          </motion.div>

          {/* ACTION BUTTONS */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35, duration: 0.8 }} className="px-6 pb-6 sm:px-10 sm:pb-8">
            {!confirmWipe ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleRestart}
                  onMouseEnter={() => playHover()}
                  className="group flex items-center justify-between w-full px-5 sm:px-7 py-4 sm:py-5 border border-[#555a52] bg-[#080a0a] hover:border-[#806d4b]/70 hover:bg-[#0c0e0d] transition-all duration-300 font-mono text-[9px] sm:text-[11px] tracking-[0.2em] uppercase"
                >
                  <span className="text-[#92958c] group-hover:text-[#b09a70] transition-colors duration-300">RESTART INVESTIGATION</span>
                  <span className="text-[#656a62] group-hover:text-[#a18b61] transition-colors duration-300">↻</span>
                </button>

                <button
                  onClick={() => { playClick(); setConfirmWipe(true); }}
                  onMouseEnter={() => playHover()}
                  className="group flex items-center justify-between w-full px-5 sm:px-7 py-4 sm:py-5 border border-[#76584f]/50 bg-[#0b0908] hover:border-[#8b6557]/70 hover:bg-[#120c0a] transition-all duration-300 font-mono text-[9px] sm:text-[11px] tracking-[0.2em] uppercase"
                >
                  <span className="text-[#806d64] group-hover:text-[#a47766] transition-colors duration-300">CLEAR RECORD & EXIT</span>
                  <span className="text-[#6d5a54] group-hover:text-[#916c5d] transition-colors duration-300">→</span>
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="border border-[#76584f]/60 bg-[#0b0908] p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1.5 h-1.5 bg-[#956957]" />
                  <span className="text-[#9a7061] font-mono text-[9px] sm:text-[11px] tracking-[0.18em] uppercase">SECURITY WARNING</span>
                </div>
                <p className="text-[9px] sm:text-[11px] tracking-[0.12em] leading-relaxed text-[#777a72] mb-5">
                  THIS ACTION WILL REMOVE LOCAL INVESTIGATION DATA FROM THE CURRENT SESSION. RECOVERED EVIDENCE WILL NO LONGER BE AVAILABLE.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => { playClick(); resetGame(); onReturnToMenu(); }}
                    className="flex-1 py-3 border border-[#76584f]/60 bg-[#180f0c] text-[#a47766] hover:bg-[#261611] hover:border-[#946b5b] transition-colors font-mono tracking-[0.18em] text-[9px] sm:text-[11px] uppercase"
                  >
                    CONFIRM PURGE
                  </button>
                  <button
                    onClick={() => { playClick(); setConfirmWipe(false); }}
                    className="flex-1 py-3 border border-[#414740] bg-[#080a0a] text-[#686d65] hover:bg-[#101310] hover:text-[#9a9d94] transition-colors font-mono tracking-[0.18em] text-[9px] sm:text-[11px] uppercase"
                  >
                    RETAIN RECORD
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="border-t border-[#292e29] px-6 sm:px-10 py-3 flex items-center justify-between text-[7px] sm:text-[8px] tracking-[0.18em] text-[#50554e] uppercase">
            <span>NEXUS SECURITY ARCHIVE</span>
            <span>LEVEL: RESTRICTED</span>
            <span className="hidden sm:block">RECORD SEALED</span>
          </div>

        </motion.div>
      </div>

      <style>{`
        .nexus-scanlines {
          background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, rgba(0,0,0,0.025) 1px, rgba(0,0,0,0.025) 4px);
          opacity: 0.28;
        }
        .nexus-vignette {
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.18) 70%, rgba(0,0,0,0.65) 100%);
        }
        .nexus-noise {
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};