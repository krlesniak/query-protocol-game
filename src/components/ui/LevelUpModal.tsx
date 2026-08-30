import { motion } from 'framer-motion';
import { ShieldAlert, X, ChevronRight } from 'lucide-react';

interface LevelUpModalProps {
  rewardXP: number;
  onNext: () => void;
  onClose: () => void;
}

export const LevelUpModal = ({ rewardXP, onNext, onClose }: LevelUpModalProps) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
    className="absolute inset-0 z-[150] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm font-mono"
  >
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.98 }} transition={{ duration: 0.45, ease: 'easeOut' }}
      className="relative w-full max-w-md bg-[#090c0c] border border-[#343a34] shadow-[0_25px_70px_rgba(0,0,0,0.6)] overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-px bg-[#806d4b]/60" />

      <button
        onClick={onClose}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#555b55] hover:text-[#a4a89e] transition-colors"
        aria-label="Close"
      >
        <X className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <div className="px-6 py-7 sm:px-8 sm:py-9 text-center">
        {/* IKONA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.4 }}
          className="flex justify-center mb-5"
        >
          <ShieldAlert className="w-10 h-10 sm:w-12 sm:h-12 text-[#87927e]" strokeWidth={1.2} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: 0.4 }}>
          <div className="text-[8px] sm:text-[9px] tracking-[0.25em] text-[#686e67] uppercase mb-2">
            INVESTIGATION STATUS
          </div>
          <h2 className="text-xl sm:text-2xl tracking-[0.16em] text-[#c1c3ba] uppercase">
            LEVEL COMPLETED
          </h2>
          <p className="mt-2 text-[9px] sm:text-[10px] tracking-[0.18em] text-[#7f867d] uppercase">
            SECURITY CLEARANCE UPDATED
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-6 mb-7 py-3 border-y border-[#292e29]"
        >
          <span className="text-[8px] tracking-[0.2em] text-[#5f655e] uppercase">
            EVIDENCE REWARD
          </span>
          <div className="mt-1 text-lg sm:text-xl tracking-[0.12em] text-[#a89468]">
            +{rewardXP} XP
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 0.4 }}
          onClick={onNext}
          className="group w-full flex items-center justify-between px-4 sm:px-5 py-3 border border-[#4e574d] bg-[#080a0a] text-[#8e9689] hover:border-[#7c8874] hover:text-[#b2b8aa] transition-all duration-300 text-left"
        >
          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase">
            INITIATE NEXT PROTOCOL
          </span>
          <ChevronRight className="w-4 h-4 text-[#626a60] group-hover:text-[#9ba592] group-hover:translate-x-1 transition-all" />
        </motion.button>
      </div>
    </motion.div>
  </motion.div>
);