import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { LEVELS } from '../../game/levels';
import { useSound } from '../../hooks/useSound';

interface CaseClosedProps {
  onReturnToMenu: () => void;
}

export const CaseClosed = ({ onReturnToMenu }: CaseClosedProps) => {
  const { score, playTime, queryAttempts, failedQueries, collectedEvidence, completedLevels, usedHints } = useGameStore();

  useSound('hum2.mp3', { volume: 0.4, loop: true, autoPlay: true });
  const { play: playClick } = useSound('keyboard.mp3', { volume: 0.5 });
  const { play: playReveal } = useSound('bass_hit1.mp3', { volume: 0.4 });
  const { play: playHover } = useSound('beep2.mp3', { volume: 0.1 });

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
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#05090c] font-mono p-8 overflow-y-auto flex flex-col items-center justify-center">
      <div className="pointer-events-none absolute inset-0 z-10 scanlines opacity-10"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-20 w-full max-w-3xl border border-[#1f2933] bg-[#0d131a] p-12 flex flex-col gap-10 shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#8fa393]/40 to-transparent"></div>

        <div className="border-b border-[#1f2933] pb-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-col gap-2"
          >
            <div className="cursor-pointer text-[#b3e7b0] glow-text-neon uppercase hover:text-[#5a7759] transition-colors duration-500 text-2xl mb-2 font-bold tracking-widest">{'>_'}</div>

            <h1 className="text-4xl font-bold tracking-[0.2em] text-[#f8fafc] uppercase">
              Query_Protocol
            </h1>
            <p className="tracking-[0.2em] text-[#64748b] text-sm uppercase mt-1">
              CASE #ORACLE-01 // INVESTIGATION ARCHIVED
            </p>
          </motion.div>
        </div>

        {/* STATISTICS */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-12"
        >
          <div className="flex flex-col gap-8">
            <motion.div variants={itemVariants}>
              <div className="text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">FINAL RANK</div>
              <div className=" text-2xl font-bold tracking-wider text-[#b3e7b0] glow-text-neon uppercase">
                {getRank(score)}
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">TOTAL XP SECURED</div>
              <div className="text-2xl font-light tracking-wider text-[#c4ecc2]">{score}</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">TIME IN SYSTEM</div>
              <div className="text-2xl font-light tracking-wider text-[#c4ecc2]">{formatTime(playTime)}</div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-8 border-l border-[#1f2933] pl-10">
            <motion.div variants={itemVariants}>
              <div className="text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">LEVELS CLEARED</div>
              <div className="text-2xl font-light tracking-wider text-[#c4ecc2]">{completedLevels.length} / {LEVELS.length}</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">EVIDENCE RECOVERED</div>
              <div className="text-2xl font-light tracking-wider text-[#c4ecc2]">{collectedEvidence.length} FILES</div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">QUERIES / ERRORS</div>
              <div className="text-2xl font-light tracking-wider text-[#c4ecc2]">
                {queryAttempts} / <span className="text-red-300 font-normal">{failedQueries}</span>
              </div>
            </motion.div>
            <motion.div variants={itemVariants}>
              <div className="text-xs text-[#64748b] tracking-[0.2em] mb-1 uppercase">HINTS USED</div>
              <div className="text-2xl font-light tracking-wider text-[#c4ecc2]">{totalHints}</div>
            </motion.div>
          </div>
        </motion.div>

        {/* END BTN */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-6 flex justify-start"
        >
          <button 
            onClick={() => {
              playClick();
              onReturnToMenu();
            }}
            onMouseEnter={() => playHover()}
            className="group relative flex items-center justify-between w-full px-8 py-5 border border-[var(--accent)] bg-[var(--accent-surface)] transition-all duration-300 font-mono text-sm tracking-[0.3em] uppercase overflow-hidden"
          >
            <span className="relative z-10 font-bold text-[var(--accent-bright)] group-hover:text-black transition-colors duration-300">
              CLEAR SYSTEM LOGS & EXIT
            </span>
            <span className="relative z-10 text-[var(--accent-bright)] opacity-80 group-hover:text-black group-hover:opacity-100 group-hover:translate-x-1 transition-all font-bold">
              {'>'}
            </span>
            <div className="absolute inset-0 w-full h-full bg-[var(--accent)] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out z-0"></div>
          </button>
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