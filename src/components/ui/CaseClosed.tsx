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

  useSound('hum2.mp3', { volume: soundEnabled ? 0.2 : 0, loop: true, autoPlay: true });
  const { play: playClick } = useSound('keyboard.mp3', { volume: soundEnabled ? 0.2 : 0 });
  const { play: playReveal } = useSound('bass_hit1.mp3', { volume: soundEnabled ? 0.22 : 0 });
  const { play: playHover } = useSound('beep2.mp3', { volume: soundEnabled ? 0.04 : 0 });

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

  const handleRestart = () => {
    playClick();
    resetGame();
    onReturnToMenu();
  };

  const handleConfirmPurge = () => {
    playClick();
    resetGame();
    onReturnToMenu();
  };

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.045, delayChildren: 0.15 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 4 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  };

  return (
    <div className="fixed inset-0 z-[9999] h-[100dvh] w-full overflow-y-auto bg-[#030505] text-[#b3b5ad] font-mono select-none">
      
      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none fixed inset-0 z-0 nexus-grid" />
      <div className="pointer-events-none fixed inset-0 z-0 nexus-scanlines" />
      <div className="pointer-events-none fixed inset-0 z-0 nexus-noise" />
      <div className="pointer-events-none fixed inset-0 z-0 nexus-vignette" />

      {/* CORNER INFO (TOP LEFT) */}
      <div className="pointer-events-none fixed left-4 top-4 z-40 sm:left-8 sm:top-6">
        <div className="text-[10px] sm:text-xs tracking-[0.22em] text-[#555b54] uppercase">NEXUS CORPORATION</div>
        <div className="mt-1 text-[9px] sm:text-[10px] tracking-[0.18em] text-[#3f443f] uppercase">SECURITY OPERATIONS</div>
      </div>

      {/* CORNER INFO (TOP RIGHT) */}
      <div className="pointer-events-none fixed right-20 top-4 z-40 text-right sm:right-24 sm:top-6">
        <div className="text-[10px] sm:text-xs tracking-[0.2em] text-[#555a53] uppercase">CASE: ORACLE-01</div>
        <div className="mt-1 text-[9px] sm:text-[10px] tracking-[0.18em] text-[#414640] uppercase">RECORD: FINAL</div>
      </div>

      {/* SOUND TOGGLE */}
      <button
        onClick={() => { playClick(); toggleSound(); }}
        className="fixed right-4 top-4 z-[100] flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center border border-[#444a43] bg-[#080b0b]/90 text-[#737970] backdrop-blur-sm transition-all duration-300 hover:border-[#806d4b]/70 hover:bg-[#0c0f0e] hover:text-[#aaa18a] sm:right-8 sm:top-5"
        aria-label="Toggle sound"
      >
        {soundEnabled !== false ? <Volume2 className="h-5 w-5 opacity-70" /> : <VolumeX className="h-5 w-5 opacity-70" />}
      </button>

      <div className="pointer-events-none fixed bottom-6 left-6 z-10 hidden flex-col gap-2 text-[10px] tracking-[0.2em] text-[#383d38] uppercase lg:flex">
        <span>ARCHIVE NODE // 07</span>
        <span>SECURITY LEVEL // RESTRICTED</span>
        <span>SESSION STATE // CLOSED</span>
      </div>

      <div className="pointer-events-none fixed bottom-6 right-6 z-10 hidden flex-col gap-2 text-right text-[10px] tracking-[0.2em] text-[#383d38] uppercase lg:flex">
        <span>DATABASE // CORE</span>
        <span>RETENTION // ENABLED</span>
        <span>INTEGRITY // VERIFIED</span>
      </div>

      {/* MAIN VIEWPORT*/}
      <div className="relative z-20 flex min-h-full w-full items-center justify-center px-4 py-24 sm:px-8 sm:py-28">

        {/* CENTRAL DOCUMENT */}
        <motion.div
          initial={{ opacity: 0, scale: 0.985, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          className="relative flex w-full max-w-4xl flex-col border border-[#303630]/90 bg-[#090d0c]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-[4px]"
        >
          <div className="absolute left-0 top-0 h-px w-full bg-[#806d4b]/70" />

          <div className="shrink-0 border-b border-[#292e29] px-6 py-6 sm:px-10 sm:py-8">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="mb-2 text-[10px] sm:text-xs tracking-[0.24em] text-[#656a63] uppercase">EXECUTIVE SECURITY ARCHIVE</div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-1.5 shrink-0 bg-[#7f6b48]/70 sm:h-14" />
                  <div>
                    <h1 className="text-2xl sm:text-4xl font-medium tracking-[0.1em] text-[#c0c2b9] uppercase">CASE CLOSED</h1>
                    <div className="mt-1.5 text-[10px] sm:text-xs tracking-[0.18em] text-[#686d65] uppercase">QUERY_PROTOCOL // ORACLE-01</div>
                  </div>
                </div>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <div className="text-[10px] sm:text-xs tracking-[0.2em] text-[#806d4b] uppercase">RESTRICTED</div>
                <div className="mt-1 text-[9px] sm:text-[10px] tracking-[0.16em] text-[#4f554e] uppercase">RECORD SEALED</div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between border-b border-[#292e29] bg-[#070a09]/80 px-6 py-3 sm:px-10">
            <div className="flex items-center gap-3 text-[10px] sm:text-xs tracking-[0.17em] text-[#676d65] uppercase">
              <span className="h-2 w-2 bg-[#71806d]" /> INVESTIGATION STATUS
            </div>
            <div className="text-[10px] sm:text-xs tracking-[0.18em] text-[#9a875f] uppercase">ARCHIVED</div>
          </div>

          {/* STATS GRID */}
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid shrink-0 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-b border-[#292e29]">
            
            <motion.div variants={itemVariants} className="border-b border-[#292e29] px-6 py-4 lg:border-b-0 lg:border-r sm:px-8 sm:py-5">
              <div className="text-[10px] sm:text-xs tracking-[0.16em] text-[#5f655e] uppercase">CLASSIFICATION</div>
              <div className="mt-2 truncate text-sm sm:text-base lg:text-lg tracking-[0.08em] text-[#a8956d] uppercase font-bold">{getRank(score)}</div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b border-[#292e29] px-6 py-4 lg:border-b-0 lg:border-r sm:px-8 sm:py-5">
              <div className="text-[10px] sm:text-xs tracking-[0.16em] text-[#5f655e] uppercase">EVIDENCE VALUE</div>
              <div className="mt-2 text-lg sm:text-xl lg:text-2xl tracking-[0.08em] text-[#b7b8b0]">{score}</div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b border-[#292e29] px-6 py-4 sm:border-r sm:border-b-0 lg:border-r sm:px-8 sm:py-5">
              <div className="text-[10px] sm:text-xs tracking-[0.16em] text-[#5f655e] uppercase">SESSION</div>
              <div className="mt-2 text-lg sm:text-xl lg:text-2xl tracking-[0.05em] text-[#b7b8b0]">{formatTime(playTime)}</div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b border-[#292e29] px-6 py-4 sm:border-b-0 lg:border-r sm:px-8 sm:py-5">
              <div className="text-[10px] sm:text-xs tracking-[0.16em] text-[#5f655e] uppercase">LEVELS CLEARED</div>
              <div className="mt-2 text-lg sm:text-xl lg:text-2xl tracking-[0.08em] text-[#b7b8b0]">{completedLevels.length} <span className="text-[#555a53]">/ {LEVELS.length}</span></div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b sm:border-b-0 sm:border-r border-[#292e29] px-6 py-4 lg:border-t lg:border-r sm:px-8 sm:py-5">
              <div className="text-[10px] sm:text-xs tracking-[0.16em] text-[#5f655e] uppercase">EVIDENCE</div>
              <div className="mt-2 text-lg sm:text-xl lg:text-2xl tracking-[0.08em] text-[#b7b8b0]">{collectedEvidence.length} <span className="ml-2 text-[10px] sm:text-xs text-[#646a62]">FILES</span></div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b sm:border-b-0 border-[#292e29] px-6 py-4 lg:border-t lg:border-r sm:px-8 sm:py-5">
              <div className="text-[10px] sm:text-xs tracking-[0.16em] text-[#5f655e] uppercase">QUERIES / FAILED</div>
              <div className="mt-2 text-lg sm:text-xl lg:text-2xl tracking-[0.08em] text-[#b7b8b0]">{totalQueryAttempts} <span className="ml-2 text-[#8b6557]">/ {failedQueries}</span></div>
            </motion.div>

            <motion.div variants={itemVariants} className="border-b sm:border-b-0 sm:border-r border-[#292e29] px-6 py-4 lg:border-t lg:border-r sm:px-8 sm:py-5">
              <div className="text-[10px] sm:text-xs tracking-[0.16em] text-[#5f655e] uppercase">ASSISTANCE</div>
              <div className="mt-2 text-lg sm:text-xl lg:text-2xl tracking-[0.08em] text-[#b7b8b0]">{totalHints}</div>
            </motion.div>

            <motion.div variants={itemVariants} className="px-6 py-4 sm:px-8 sm:py-5 lg:border-t">
              <div className="text-[10px] sm:text-xs tracking-[0.16em] text-[#5f655e] uppercase">RECORD STATE</div>
              <div className="mt-2 text-sm sm:text-base lg:text-lg tracking-[0.08em] text-[#a08a60] uppercase font-bold">SEALED</div>
            </motion.div>

          </motion.div>

          {/* INVESTIGATION NOTE */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.6 }} className="mx-5 my-5 sm:mx-10 sm:my-8 shrink-0 border border-[#353a34] bg-[#070a09]/65 px-6 py-5 sm:px-8 sm:py-6">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 shrink-0 bg-[#806d4b]" />
              <span className="text-[10px] sm:text-xs tracking-[0.18em] text-[#8b8d84] uppercase font-bold">SECURITY NOTICE</span>
            </div>
            <p className="mt-3 text-xs sm:text-sm leading-relaxed tracking-[0.05em] text-[#656a63]">
              INVESTIGATION RECORD SEALED. RECOVERED EVIDENCE RETAINED UNDER NEXUS SECURITY POLICY. ALL UNAUTHORIZED ACCESS ATTEMPTS WILL BE LOGGED.
            </p>
          </motion.div>

          {/* ACTIONS */}
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.6 }} className="shrink-0 px-5 pb-5 sm:px-10 sm:pb-8">
            {!confirmWipe ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={handleRestart}
                  onMouseEnter={playHover}
                  className="group flex min-w-0 items-center justify-between border border-[#555a52] bg-[#080a0a]/75 px-5 py-4 sm:px-6 sm:py-5 transition-all duration-300 hover:border-[#806d4b]/70 hover:bg-[#0d100f]"
                >
                  <span className="truncate text-[10px] sm:text-xs font-bold tracking-[0.18em] text-[#92958c] uppercase transition-colors group-hover:text-[#b09a70]">
                    RESTART INVESTIGATION
                  </span>
                  <span className="ml-3 text-sm text-[#656a62] transition-colors group-hover:text-[#a18b61]">↻</span>
                </button>

                <button
                  onClick={() => { playClick(); setConfirmWipe(true); }}
                  onMouseEnter={playHover}
                  className="group flex min-w-0 items-center justify-between border border-[#76584f]/50 bg-[#0b0908]/70 px-5 py-4 sm:px-6 sm:py-5 transition-all duration-300 hover:border-[#8b6557]/70 hover:bg-[#120c0a]"
                >
                  <span className="truncate text-[10px] sm:text-xs font-bold tracking-[0.18em] text-[#806d64] uppercase transition-colors group-hover:text-[#a47766]">
                    CLEAR RECORD & EXIT
                  </span>
                  <span className="ml-3 text-sm text-[#6d5a54] transition-colors group-hover:text-[#916c5d]">→</span>
                </button>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="border border-[#76584f]/60 bg-[#0b0908]/85 p-5 sm:p-6">
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-2 w-2 bg-[#956957]" />
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.15em] text-[#9a7061] uppercase">SECURITY WARNING</span>
                </div>
                <p className="mb-5 text-xs sm:text-sm leading-relaxed tracking-[0.07em] text-[#777a72]">
                  THIS ACTION WILL REMOVE LOCAL INVESTIGATION DATA FROM THE CURRENT SESSION. ALL PROGRESS WILL BE LOST.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleConfirmPurge}
                    className="border border-[#76584f]/60 bg-[#180f0c] py-3.5 sm:py-4 text-[10px] sm:text-xs font-bold tracking-[0.12em] text-[#a47766] uppercase transition-colors hover:border-[#946b5b] hover:bg-[#261611]"
                  >
                    CONFIRM PURGE
                  </button>
                  <button
                    onClick={() => { playClick(); setConfirmWipe(false); }}
                    className="border border-[#414740] bg-[#080a0a] py-3.5 sm:py-4 text-[10px] sm:text-xs tracking-[0.12em] text-[#686d65] uppercase transition-colors hover:bg-[#101310] hover:text-[#9a9d94]"
                  >
                    RETAIN RECORD
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="flex shrink-0 items-center justify-between border-t border-[#292e29] px-6 py-3 sm:px-10 sm:py-4 text-[8px] sm:text-[10px] tracking-[0.18em] text-[#50554e] uppercase">
            <span>NEXUS SECURITY ARCHIVE</span>
            <span>LEVEL: RESTRICTED</span>
            <span className="hidden sm:block">RECORD SEALED</span>
          </div>

        </motion.div>
      </div>
      
      <style>{`
        .nexus-grid {
          background-image: linear-gradient(rgba(100,110,100,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(100,110,100,0.025) 1px, transparent 1px);
          background-size: 48px 48px; opacity: 0.35;
        }
        .nexus-scanlines {
          background: repeating-linear-gradient(to bottom, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, rgba(0,0,0,0.025) 1px, rgba(0,0,0,0.025) 4px);
          opacity: 0.22;
        }
        .nexus-vignette {
          background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.18) 65%, rgba(0,0,0,0.78) 100%);
        }
        .nexus-noise {
          opacity: 0.022;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E");
        }
        @media (max-height: 720px) { .nexus-grid { opacity: 0.2; } .nexus-scanlines { opacity: 0.16; } }
        @media (max-height: 620px) { .nexus-scanlines { opacity: 0.1; } }
      `}</style>
    </div>
  );
};