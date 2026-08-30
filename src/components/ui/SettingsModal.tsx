import { motion } from 'framer-motion';
import { X, Volume2, Music, Type } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const { musicVolume, sfxVolume, editorFontSize, setMusicVolume, setSfxVolume, setEditorFontSize } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} transition={{ duration: 0.3 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#090c0c] border border-[#303630] shadow-[0_25px_80px_rgba(0,0,0,0.7)] font-mono overflow-hidden"
      >
        {/* Subtle Scanlines Background */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.15] bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.015)_0px,rgba(255,255,255,0.015)_1px,rgba(0,0,0,0.03)_1px,rgba(0,0,0,0.03)_4px)] mix-blend-screen" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-[#303630] bg-[#070909]">
          <h2 className="text-[#a3ad82] text-sm sm:text-base tracking-[0.2em] uppercase font-bold flex items-center gap-3">
            <span className="text-[#806d4b]">{'>'}</span> SYSTEM_PREFERENCES
          </h2>
          <button onClick={onClose} className="text-[#656a63] hover:text-[#d4d6c8] transition-colors bg-[#0a0d0c] border border-[#303630] hover:border-[#a3ad82] p-1.5 rounded-none">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-8 bg-[#050707]">
          {/* SFX */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs sm:text-sm tracking-widest text-[#b3b5ad] uppercase">
              <span className="flex items-center gap-3"><Volume2 className="w-5 h-5 text-[#806d4b]" /> SFX VOLUME</span>
              <span className="text-[#c0c2b9] font-bold">{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={sfxVolume} onChange={(e) => setSfxVolume(parseFloat(e.target.value))} className="w-full h-2 bg-[#1a1e1c] outline-none appearance-none cursor-pointer accent-[#a3ad82]" />
          </div>

          {/* Music */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs sm:text-sm tracking-widest text-[#b3b5ad] uppercase">
              <span className="flex items-center gap-3"><Music className="w-5 h-5 text-[#806d4b]" /> AMBIENCE</span>
              <span className="text-[#c0c2b9] font-bold">{Math.round(musicVolume * 100)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.01" value={musicVolume} onChange={(e) => setMusicVolume(parseFloat(e.target.value))} className="w-full h-2 bg-[#1a1e1c] outline-none appearance-none cursor-pointer accent-[#a3ad82]" />
          </div>

          {/* Font Size */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-xs sm:text-sm tracking-widest text-[#b3b5ad] uppercase">
              <span className="flex items-center gap-3"><Type className="w-5 h-5 text-[#806d4b]" /> EDITOR FONT SIZE</span>
              <span className="text-[#c0c2b9] font-bold">{editorFontSize}PX</span>
            </div>
            <input type="range" min="10" max="24" step="1" value={editorFontSize} onChange={(e) => setEditorFontSize(parseInt(e.target.value))} className="w-full h-2 bg-[#1a1e1c] outline-none appearance-none cursor-pointer accent-[#a3ad82]" />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 p-5 border-t border-[#303630] bg-[#070909] flex justify-end">
          <button onClick={onClose} className="px-6 py-3 text-xs sm:text-sm tracking-[0.2em] uppercase font-bold text-[#a3ad82] border border-[#4e574d] bg-[#0a0d0c] hover:bg-[#121512] hover:border-[#a3ad82] transition-colors duration-300">
            APPLY_CHANGES
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};