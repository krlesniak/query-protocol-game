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
    score, playTime, totalQueryAttempts, failedQueries, 
    collectedEvidence, completedLevels, usedHints, resetGame,
    soundEnabled, toggleSound // Pobieramy stan dźwięku ze sklepu
  } = useGameStore();
  
  const [confirmWipe, setConfirmWipe] = useState(false);

  // Podpinamy globalne wyciszenie (soundEnabled) pod lokalne dźwięki
  useSound('hum2.mp3', { volume: soundEnabled ? 0.4 : 0, loop: true, autoPlay: true });
  const { play: playClick } = useSound('keyboard.mp3', { volume: soundEnabled ? 0.5 : 0 });
  const { play: playReveal } = useSound('bass_hit1.mp3', { volume: soundEnabled ? 0.4 : 0 });
  const { play: playHover } = useSound('beep2.mp3', { volume: soundEnabled ? 0.1 : 0 });

  useEffect(() => {
    playReveal();
  }, [playReveal]);

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

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#05090c] font-mono p-4 sm:p-8 overflow-y-auto flex flex-col items-center justify-center">
      <div className="pointer-events-none absolute inset-0 z-10 scanlines opacity-10"></div>
      
      {/* VOLUME TOGGLE */}
        <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[9999]">
          <button
            onClick={() => {
              playClick();
              if (toggleSound) toggleSound();
            }}
            className="p-2 sm:p-3 border border-[var(--border)] bg-[var(--surface-1)] text-[var(--text-secondary)] hover:text-[var(--accent-bright)] hover:border-[var(--accent)] hover:shadow-[0_0_15px_var(--accent)] transition-all duration-300 group"
          >
            {soundEnabled !== false ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
        </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-3xl border border-[#1f2933] bg-[#0d131a] p-6 sm:p-12 flex flex-col gap-6 sm:gap-10 shadow-2xl my-auto"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8fa393]/40 to-transparent"></div>

        <div className="border-b border-[#1f2933] pb-4 sm:pb-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col gap-1 sm:gap-2"
          >
            <div className="cursor-pointer text-[#b3e7b0] glow-text-neon uppercase hover:text-[#5a7759] transition-colors duration-500 text-xl sm:text-2xl mb-1 sm:mb-2 font-bold tracking-widest">{'>_'}</div>

            <h1 className="text-2xl sm:text-4xl font-bold tracking-[0.1em] sm:tracking-[0.2em] text-[#f8fafc] uppercase break-words">
              Query_Protocol
            </h1>
            <p className="tracking-[0.1em] sm:tracking-[0.2em] text-[#64748b] text-[10px] sm:text-sm uppercase mt-1">
              CASE #ORACLE-01 // INVESTIGATION ARCHIVED
            </p>
          </motion.div>
        </div>

        {/* STATISTICS  */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12"
        >
          <div className="flex flex-col gap-6 sm:gap-8">
            <motion.div variants={itemVariants}>
              <div className="text-[10px] sm:text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">FINAL RANK</div>
              <div className="text-xl sm:text-2xl font-bold tracking-wider text-[#b3e7b0] glow-text-neon uppercase">
                {getRank(score)}
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-[10px] sm:text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">TOTAL XP SECURED</div>
              <div className="text-xl sm:text-2xl font-light tracking-wider text-[#c4ecc2]">{score}</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-[10px] sm:text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">TIME IN SYSTEM</div>
              <div className="text-xl sm:text-2xl font-light tracking-wider text-[#c4ecc2]">{formatTime(playTime)}</div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-6 sm:gap-8 border-t border-[#1f2933] sm:border-t-0 sm:border-l sm:border-[#1f2933] pt-6 sm:pt-0 sm:pl-10">
            <motion.div variants={itemVariants}>
              <div className="text-[10px] sm:text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">LEVELS CLEARED</div>
              <div className="text-xl sm:text-2xl font-light tracking-wider text-[#c4ecc2]">{completedLevels.length} / {LEVELS.length}</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-[10px] sm:text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">EVIDENCE RECOVERED</div>
              <div className="text-xl sm:text-2xl font-light tracking-wider text-[#c4ecc2]">{collectedEvidence.length} FILES</div>
            </motion.div>
            <motion.div variants={itemVariants}>
            <div className="text-[10px] sm:text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">QUERIES / ERRORS</div>
            <div className="text-xl sm:text-2xl font-light tracking-wider text-[#c4ecc2]">
                {totalQueryAttempts} / <span className="text-red-300 font-normal">{failedQueries}</span>
            </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-[10px] sm:text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">HINTS USED</div>
              <div className="text-xl sm:text-2xl font-light tracking-wider text-[#c4ecc2]">{totalHints}</div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-2 sm:mt-6 flex flex-col justify-start"
        >
          {!confirmWipe ? (
            <button 
              onClick={() => {
                playClick();
                setConfirmWipe(true);
              }}
              onMouseEnter={() => playHover()}
              className="group relative flex items-center justify-between w-full px-4 sm:px-8 py-4 sm:py-5 border border-[var(--accent)] bg-[var(--accent-surface)] transition-all duration-300 font-mono text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase overflow-hidden"
            >
              <span className="relative z-10 font-bold text-[var(--accent-bright)] group-hover:text-black transition-colors duration-300">
                CLEAR SYSTEM LOGS & EXIT
              </span>
              <span className="relative z-10 text-[var(--accent-bright)] opacity-80 group-hover:text-black group-hover:opacity-100 group-hover:translate-x-1 transition-all font-bold">
                {'>'}
              </span>
              <div className="absolute inset-0 w-full h-full bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out z-0"></div>
            </button>
          ) : (
            <div className="flex flex-col gap-4 sm:gap-5 p-4 sm:p-6 border border-red-900/50 bg-red-950/10">
              <span className="text-red-400 font-mono text-[10px] sm:text-sm tracking-widest text-center uppercase">
                WARNING: THIS WILL WIPE ALL INVESTIGATION DATA. PROCEED?
              </span>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
                <button 
                  onClick={() => {
                    playClick();
                    resetGame();
                    onReturnToMenu();
                  }} 
                  className="flex-1 py-3 bg-red-900/40 text-red-200 hover:bg-red-900 transition-colors font-mono tracking-widest text-[10px] sm:text-sm font-bold"
                >
                  YES, PURGE
                </button>
                <button 
                  onClick={() => {
                    playClick();
                    setConfirmWipe(false);
                  }} 
                  className="flex-1 py-3 border border-[#3e4a59] text-[#64748b] hover:bg-[#1a232c] hover:text-white transition-colors font-mono tracking-widest text-[10px] sm:text-sm font-bold"
                >
                  CANCEL
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      <style>{`
        .scanlines {
          background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
          background-size: 100% 4px;
        }
        .glow-text-neon { text-shadow: 0 0 15px rgba(31, 255, 15, 0.6); }
      `}</style>
    </div>
  );
};