import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, X, AlertTriangle } from 'lucide-react';
import { EVIDENCE_DB } from '../../game/evidence';

interface EvidenceModalProps {
  evidenceId: string;
  onClose: () => void;
}

export const EvidenceModal = ({ evidenceId, onClose }: EvidenceModalProps) => {
  const [imageError, setImageError] = useState(false);
  const ev = EVIDENCE_DB[evidenceId];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} 
        className="bg-[var(--surface-1)] border border-[var(--border)] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[#131920] shrink-0">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-[var(--accent-muted)]" />
            <span className="font-mono text-[12px] text-[var(--text-main)] tracking-[0.2em] font-bold">
              NEXUS_OS // CLASSIFIED DATA
            </span>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white transition-colors bg-[var(--surface-2)] p-1 rounded-sm">
             <X className="w-5 h-5" />
          </button>
        </div>
        
        {!ev ? (
          <div className="p-10 text-center font-mono text-red-500/80">ERROR: FILE CORRUPTED OR NOT FOUND</div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full min-h-0 overflow-y-auto lg:overflow-hidden">
            
            {/* GRAFIKA */}
            <div className="lg:w-3/5 bg-[#0a0d10] border-r border-[var(--border)] relative flex items-center justify-center p-4 min-h-[300px]">
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              {!imageError ? (
                <img src={ev.imagePath} alt={ev.title} className="max-w-full max-h-full object-contain relative z-10 shadow-2xl border border-white/5" onError={() => setImageError(true)} />
              ) : (
                <div className="flex flex-col items-center justify-center text-[var(--text-muted)] z-10 w-full h-full border border-dashed border-[var(--border)] bg-black/20 backdrop-blur-sm p-8">
                  <AlertTriangle className="w-12 h-12 mb-4 text-[var(--accent-muted)] opacity-50" />
                  <span className="font-mono text-[12px] tracking-[0.1em] text-[var(--accent-muted)] mb-2 font-bold">DECRYPTION PENDING</span>
                  <span className="font-mono text-[11px] text-center max-w-xs opacity-70">Graphic asset `{ev.imagePath}` could not be loaded. Please ensure the file exists.</span>
                </div>
              )}
            </div>

            {/* DANE */}
            <div className="lg:w-2/5 flex flex-col p-8 bg-[var(--surface-1)] lg:overflow-y-auto">
              <div className="mb-8 shrink-0">
                <h2 className="text-xl lg:text-2xl font-mono text-white tracking-wide uppercase leading-tight mb-4">{ev.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[10px] font-mono text-emerald-400/80 px-2 py-1 border border-emerald-500/30 bg-emerald-500/10 rounded-sm">
                    TYPE: {ev.type}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400/80 px-2 py-1 border border-amber-500/30 bg-amber-500/10 rounded-sm">
                    SOURCE_LVL: {ev.sourceLevel.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] px-2 py-1 border border-[var(--border)] bg-[var(--surface-2)] rounded-sm">
                    ID: {ev.id}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-[11px] tracking-widest text-[var(--text-secondary)] mb-4 border-b border-[var(--border)] pb-2">
                  INVESTIGATOR'S NOTES //
                </h3>
                <p className="font-mono text-[13px] text-[#AAB4BE] leading-relaxed whitespace-pre-wrap">
                  {ev.storyDescription || ev.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};