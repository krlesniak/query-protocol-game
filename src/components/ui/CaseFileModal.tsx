import { motion } from 'framer-motion';
import { FolderLock, X, CheckSquare, Square } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { EVIDENCE_DB } from '../../game/evidence';

interface CaseFileModalProps {
  onClose: () => void;
  onOpenEvidence: (id: string) => void;
}

export const CaseFileModal = ({ onClose, onOpenEvidence }: CaseFileModalProps) => {
  const { collectedEvidence } = useGameStore();
  
  const allEvidence = Object.values(EVIDENCE_DB).sort((a, b) => a.sourceLevel - b.sourceLevel);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
      className="absolute inset-0 z-[90] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} 
        className="bg-[var(--surface-1)] border border-[var(--border)] w-full max-w-3xl max-h-[85vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[#131920] shrink-0">
          <div className="flex items-center gap-3">
            <FolderLock className="w-5 h-5 text-[var(--accent-muted)]" />
            <span className="font-mono text-[12px] text-[var(--text-main)] tracking-[0.2em] font-bold">
              CASE FILE #ORACLE-01
            </span>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white transition-colors bg-[var(--surface-2)] p-1 rounded-sm">
             <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 bg-[#0a0d10] p-6 overflow-y-auto">
          <div className="mb-8 border-l-2 border-[var(--accent-muted)] pl-4">
            <h2 className="font-mono text-xl text-white tracking-widest uppercase">Evidence Registry</h2>
            <p className="font-mono text-[12px] text-[var(--text-muted)] mt-1">
              Recovered: {collectedEvidence.length} / {allEvidence.length}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {allEvidence.map((ev, index) => {
              const isUnlocked = collectedEvidence.includes(ev.id);
              return (
                <button
                  key={ev.id}
                  disabled={!isUnlocked}
                  onClick={() => onOpenEvidence(ev.id)}
                  className={`flex items-center justify-between p-4 border rounded-sm font-mono text-left transition-colors ${
                    isUnlocked 
                    ? 'border-[var(--border)] bg-[var(--surface-1)] hover:bg-[var(--surface-2)] cursor-pointer' 
                    : 'border-white/5 bg-black/20 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {isUnlocked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500/80 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
                    )}
                    <div className="flex flex-col">
                      <span className={`text-[13px] font-bold tracking-widest ${isUnlocked ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
                        {index + 1}. {isUnlocked ? ev.title : '████████████'}
                      </span>
                      {isUnlocked && (
                        <span className="text-[10px] text-[var(--text-secondary)] mt-1">
                          LVL {ev.sourceLevel.toString().padStart(2, '0')} // {ev.type}
                        </span>
                      )}
                    </div>
                  </div>
                  {isUnlocked && (
                    <span className="text-[10px] text-[var(--accent-grey)] border border-[var(--accent-grey)]/30 px-2 py-1 rounded-sm bg-[var(--accent-muted)]/10 hidden sm:block">
                      VIEW FILE
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};