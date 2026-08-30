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
      className="absolute inset-0 z-[90] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} 
        className="bg-[#090c0c] border border-[#303630] w-full max-w-3xl max-h-[85vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-[#303630] bg-[#070909] shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <FolderLock className="w-4 h-4 sm:w-5 sm:h-5 text-[#806d4b] shrink-0" />
            <span className="font-mono text-xs sm:text-sm text-[#c0c2b9] tracking-[0.2em] font-bold truncate uppercase">
              CASE FILE #ORACLE-01
            </span>
          </div>
          <button onClick={onClose} className="text-[#656a63] hover:text-[#d4d6c8] transition-colors p-1 bg-[#0a0d0c] border border-[#303630] hover:border-[#a3ad82] rounded-none shrink-0">
             <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        {/* BODY */}
        <div className="flex-1 bg-[#050707] p-5 sm:p-8 overflow-y-auto">
          <div className="mb-6 sm:mb-8 border-l-2 border-[#a3ad82] pl-4 sm:pl-5">
            <h2 className="font-mono text-base sm:text-lg text-[#b3b5ad] tracking-widest uppercase">EVIDENCE REGISTRY</h2>
            <p className="font-mono text-[10px] sm:text-xs text-[#70756d] tracking-widest mt-1.5 uppercase">
              RECOVERED: {collectedEvidence.length} / {allEvidence.length}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {allEvidence.map((ev, index) => {
              const isUnlocked = collectedEvidence.includes(ev.id);
              return (
                <button
                  key={ev.id}
                  disabled={!isUnlocked}
                  onClick={() => onOpenEvidence(ev.id)}
                  className={`flex items-center justify-between p-4 sm:p-5 border rounded-none font-mono text-left transition-all duration-300 ${isUnlocked ? 'border-[#4e574d] bg-[#0a0d0c] hover:bg-[#121512] hover:border-[#a3ad82] cursor-pointer group' : 'border-[#1a1e1c] bg-[#030505] opacity-60 cursor-not-allowed'}`}
                >
                  <div className="flex items-center gap-4 sm:gap-5 overflow-hidden">
                    {isUnlocked ? (
                      <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3ad82] shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 sm:w-5 sm:h-5 text-[#454a44] shrink-0" />
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs sm:text-sm font-bold tracking-[0.15em] uppercase truncate transition-colors ${isUnlocked ? 'text-[#c0c2b9] group-hover:text-[#d4d6c8]' : 'text-[#555a53]'}`}>
                        {String(index + 1).padStart(2, '0')}. {isUnlocked ? ev.title : '████████████'}
                      </span>
                      {isUnlocked && (
                        <span className="text-[9px] sm:text-[10px] text-[#70756d] tracking-widest mt-1.5 truncate uppercase">
                          LVL {ev.sourceLevel.toString().padStart(2, '0')} // {ev.type}
                        </span>
                      )}
                    </div>
                  </div>
                  {isUnlocked && (
                    <span className="text-[9px] sm:text-[10px] text-[#806d4b] border border-[#806d4b]/40 px-3 py-1.5 bg-[#806d4b]/10 hidden sm:block shrink-0 ml-3 tracking-widest uppercase transition-colors group-hover:bg-[#806d4b]/20 group-hover:text-[#a8956d]">
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