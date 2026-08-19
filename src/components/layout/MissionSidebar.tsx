import { ShieldAlert, Key, Image as ImageIcon, FileText, Terminal as TerminalIcon, FileCode2 } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { LEVELS } from '../../game/levels';
import { EVIDENCE_DB } from '../../game/evidence';
import { motion, AnimatePresence } from 'framer-motion';

interface MissionSidebarProps {
  onLog: (msg: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  onOpenEvidence: (id: string) => void;
  viewedLevel: number;
}

export const MissionSidebar = ({ onLog, onOpenEvidence, viewedLevel }: MissionSidebarProps) => {
  const { currentLevel, collectedEvidence, usedHints, applyHint, score } = useGameStore();
  const levelData = LEVELS.find(l => l.id === viewedLevel) || LEVELS[LEVELS.length - 1];
  
  const isHistorical = viewedLevel < currentLevel;

  const getEvidenceIcon = (type: string) => {
    switch(type) {
      case 'DOCUMENT': return <FileText className="w-3.5 h-3.5 text-[var(--accent-yellow)]" />;
      case 'IMAGE': return <ImageIcon className="w-3.5 h-3.5 text-[var(--accent-bright)]" />;
      case 'LOG': return <TerminalIcon className="w-3.5 h-3.5 text-[var(--accent-greeny)]" />;
      default: return <FileCode2 className="w-3.5 h-3.5 text-[var(--text-muted)]" />;
    }
  };

  return (
    <aside className="min-h-0 flex flex-col gap-2">
      {/* MISSION SECTION */}
      <section className="flex-[3] min-h-0 bg-[var(--surface-1)] border border-[var(--border)] flex flex-col overflow-hidden">
        <div className="h-11 border-b border-[var(--border)] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[var(--accent-greeny)]" />
            <span className="font-mono text-[11px] tracking-widest text-[var(--text-secondary)]">
              {isHistorical ? "ARCHIVED MISSION" : "CURRENT MISSION"}
            </span>
          </div>
          <span className="font-mono text-[11px] text-[var(--accent-greeny)] font-bold">
            LVL_{viewedLevel.toString().padStart(2, '0')}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={viewedLevel}
            initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
            className="p-5 overflow-y-auto flex flex-col h-full gap-5"
          >
            <div>
              <div className="font-mono text-[12px] tracking-widest text-[var(--text-main)] mb-2 uppercase">{levelData.title}</div>
              <p className="text-[13px] leading-6 text-[var(--text-secondary)]">{levelData.briefing}</p>
            </div>

            <div className="border-l-2 border-[var(--accent-yellow)] pl-4 flex flex-col gap-4">
              <div>
                <div className="font-mono text-[12px] tracking-widest text-[var(--accent-yellow)] mb-1">TASK</div>
                <p className="text-[13px] leading-6 text-[var(--text-main)]">{levelData.objective}</p>
              </div>
              {!isHistorical && (
                <>
                  <div>
                    <div className="font-mono text-[11px] tracking-widest text-[var(--text-muted)] mb-1">REWARD</div>
                    <p className="font-mono text-[11px] text-[var(--accent-bright)]">+{levelData.rewardXP} XP</p>
                  </div>
                  {levelData.unlocksTable && (
                    <div>
                      <div className="font-mono text-[11px] tracking-widest text-[var(--text-muted)] mb-1">POTENTIAL UNLOCK</div>
                      <p className="font-mono text-[11px] text-[var(--text-secondary)]">{levelData.unlocksTable.toUpperCase()} DATA</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* AVAILABLE HINTS */}
            <div className="mt-auto flex flex-col gap-2 border-t border-[var(--border)] pt-4">
              <span className="font-mono text-[11px] tracking-widest text-[var(--text-secondary)] mb-1">
                {isHistorical ? "HINTS (ARCHIVED):" : "AVAILABLE HINTS:"}
              </span>
              {levelData.hints?.map(hint => {
                const isUsed = usedHints[viewedLevel]?.includes(hint.id);
                const canAfford = score >= hint.cost; 

                return (
                  <button 
                    key={hint.id}
                    disabled={isUsed || (!canAfford && !isUsed) || isHistorical} 
                    onClick={() => {
                      if (!isUsed && canAfford && !isHistorical) {
                        applyHint(viewedLevel, hint.id, hint.cost);
                        onLog(`[SYSTEM] Hint used: -${hint.cost} XP`, 'warning');
                      } else if (!canAfford && !isUsed) {
                        onLog(`[SYSTEM] INSUFFICIENT XP. Wymagane: ${hint.cost} XP.`, 'error');
                      }
                    }}
                    className={`w-full flex items-center justify-between border px-3 py-2 transition-colors duration-200 ${
                      isUsed 
                        ? 'border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-main)] cursor-default' 
                        : !canAfford || isHistorical
                          ? 'border-red-900/30 bg-red-950/10 text-[var(--text-muted)] cursor-not-allowed opacity-70'
                          : 'border-[var(--border)] hover:border-[var(--accent-muted)] hover:bg-[var(--surface-2)] group cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center gap-2 max-w-[80%]">
                      <Key className={`w-3.5 h-3.5 shrink-0 ${
                        isUsed ? 'text-[var(--accent-yellow)]' : !canAfford || isHistorical ? 'text-[var(--error)] opacity-50' : 'text-[var(--text-muted)] group-hover:text-[var(--accent)]'
                      }`} />
                      <span className={`font-mono text-[11px] text-left truncate transition-colors ${
                        isUsed ? 'text-[var(--text-main)] break-words whitespace-normal' : !canAfford || isHistorical ? 'text-[var(--text-muted)]' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-main)]'
                      }`}>
                        {isUsed ? hint.text : `REQUEST HINT 0${hint.id}`}
                      </span>
                    </div>
                    {!isUsed && !isHistorical && (
                      <span className={`font-mono text-[11px] shrink-0 ml-2 ${!canAfford ? 'text-[var(--error)]' : 'text-[var(--text-muted)]'}`}>
                        -{hint.cost} XP
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* EVIDENCE SECTION  */}
      <section className="flex-[2] min-h-0 bg-[var(--surface-1)] border border-[var(--border)] flex flex-col overflow-hidden">
        <div className="h-11 border-b border-[var(--border)] px-4 flex items-center justify-between shrink-0 bg-[#0d1217]">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
            <span className="font-mono text-[11px] tracking-widest text-[var(--text-secondary)]">CASE FILE / EVIDENCE</span>
          </div>
          <span className="font-mono text-[11px] text-[var(--text-muted)]">{collectedEvidence.length} ITEMS</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 bg-[var(--bg-base)]">
          {collectedEvidence.length === 0 ? (
            <div className="h-full border border-dashed border-[var(--border)] flex flex-col items-center justify-center text-center px-6">
              <FileCode2 className="w-6 h-6 text-[var(--text-faint)] mb-3" />
              <span className="font-mono text-[11px] tracking-widest text-[var(--text-muted)]">NO EVIDENCE</span>
            </div>
          ) : (
            <div className="space-y-2">
              {collectedEvidence.map(evId => {
                const ev = EVIDENCE_DB[evId] || { title: evId, type: 'UNKNOWN', id: evId };
                return (
                  <div 
                    key={evId} 
                    onClick={() => onOpenEvidence(evId)} 
                    className="group flex flex-col p-2.5 bg-[var(--surface-1)] border border-[var(--border)] cursor-pointer hover:bg-[#1a2228] hover:border-[var(--accent-muted)] transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {getEvidenceIcon(ev.type)}
                        <span className="font-mono text-[10px] tracking-wider text-[var(--text-main)] group-hover:text-[var(--accent-bright)] transition-colors truncate max-w-[130px]">
                          {ev.id}
                        </span>
                      </div>
                      <span className="text-[8px] font-mono border border-[var(--border)] px-1.5 py-0.5 text-[var(--text-muted)] bg-[var(--bg-base)] tracking-widest">
                        {ev.type}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[var(--text-secondary)] truncate pl-5">
                      {ev.title}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </aside>
  );
};