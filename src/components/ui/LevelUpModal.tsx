import { motion } from 'framer-motion';
import { ShieldAlert, X, ChevronRight } from 'lucide-react';

interface LevelUpModalProps {
  rewardXP: number;
  onNext: () => void;
  onClose: () => void;
}

export const LevelUpModal = ({ rewardXP, onNext, onClose }: LevelUpModalProps) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
    className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-all"
  >
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} 
      className="relative w-full max-w-lg bg-[var(--surface-1)] border-2 border-[var(--accent-bright)] p-6 sm:p-10 flex flex-col items-center shadow-[0_0_80px_rgba(163,199,168,0.2)] text-center"
    >
      <button onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[var(--text-muted)] hover:text-[var(--accent-bright)] transition-colors">
        <X className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
      <ShieldAlert className="w-16 h-16 sm:w-20 sm:h-20 text-[var(--accent-bright)] mb-4 sm:mb-6 animate-pulse" />
      <h2 className="text-2xl sm:text-4xl font-mono text-[var(--text-main)] mb-2 tracking-[0.15em] sm:tracking-[0.3em]">LEVEL COMPLETED</h2>
      <p className="text-[var(--accent-bright)] font-mono tracking-widest text-sm sm:text-lg">SECURITY CLEARANCE UPDATED</p>
      <p className="text-[var(--text-muted)] font-mono mt-4 mb-6 sm:mt-6 sm:mb-8 text-sm sm:text-base">+ {rewardXP} XP </p>

      <button onClick={onNext} className="w-full sm:w-auto justify-center px-4 sm:px-8 py-3 sm:py-4 bg-[var(--accent-surface)] border border-[var(--accent-bright)] text-[var(--accent-bright)] font-mono tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg-base)] transition-colors flex items-center gap-2 sm:gap-3 group text-xs sm:text-sm">
        INITIATE NEXT PROTOCOL 
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>
  </motion.div>
);