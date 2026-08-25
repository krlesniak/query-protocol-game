import { motion } from 'framer-motion';
import { X, Volume2, Music, Type } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal = ({ onClose }: SettingsModalProps) => {
  const { 
    musicVolume, 
    sfxVolume, 
    editorFontSize, 
    setMusicVolume, 
    setSfxVolume, 
    setEditorFontSize 
  } = useGameStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#0d131a] border border-[var(--border)] shadow-2xl font-mono overflow-hidden"
      >
        {/* Background */}
        <div className="pointer-events-none absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1))] bg-[length:100%_4px]" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[#131920]">
          <h2 className="text-[var(--accent-bright)] text-sm tracking-[0.2em] uppercase font-bold flex items-center gap-2">
            <span className="text-[var(--accent)]">{'>'}</span> SYSTEM_PREFERENCES
          </h2>
          <button 
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 p-6 flex flex-col gap-8">
          
          {/* SFX */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs tracking-widest text-[var(--text-main)] uppercase">
              <span className="flex items-center gap-2"><Volume2 className="w-4 h-4 text-[var(--accent)]" /> SFX Volume</span>
              <span className="text-[var(--accent-grey)]">{Math.round(sfxVolume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.05"
              value={sfxVolume}
              onChange={(e) => setSfxVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-[var(--surface-3)] outline-none appearance-none cursor-pointer accent-[var(--accent-dark-grey)]"
            />
          </div>

          {/* Music */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs tracking-widest text-[var(--text-main)] uppercase">
              <span className="flex items-center gap-2"><Music className="w-4 h-4 text-[var(--accent)]" /> Ambience</span>
              <span className="text-[var(--accent-bright)]">{Math.round(musicVolume * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.05"
              value={musicVolume}
              onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
              className="w-full h-1 bg-[var(--surface-3)] outline-none appearance-none cursor-pointer accent-[var(--accent-dark-grey)]"
            />
          </div>

          {/* Font Size */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs tracking-widest text-[var(--text-main)] uppercase">
              <span className="flex items-center gap-2"><Type className="w-4 h-4 text-[var(--accent)]" /> Editor Font Size</span>
              <span className="text-[var(--accent-bright)]">{editorFontSize}px</span>
            </div>
            <input 
              type="range" 
              min="10" max="24" step="1"
              value={editorFontSize}
              onChange={(e) => setEditorFontSize(parseInt(e.target.value))}
              className="w-full h-1 bg-[var(--surface-3)] outline-none appearance-none cursor-pointer accent-[var(--accent-dark-grey)]"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="relative z-10 p-4 border-t border-[var(--border)] bg-[#0a0f14] flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 text-xs tracking-[0.2em] uppercase font-bold text-[var(--accent-bright)] border border-[var(--accent)] hover:bg-[var(--accent)] hover:text-black transition-colors"
          >
            APPLY_CHANGES
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};