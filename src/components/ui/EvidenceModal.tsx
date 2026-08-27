import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, X, AlertTriangle, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
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
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} 
        className="bg-[var(--surface-1)] border border-[var(--border)] w-[95vw] max-w-7xl h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border)] bg-[#131920] shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-muted)] shrink-0" />
            <span className="font-mono text-[10px] sm:text-[12px] text-[var(--text-main)] tracking-[0.1em] sm:tracking-[0.2em] font-bold truncate">
              NEXUS_OS // CLASSIFIED DATA
            </span>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white transition-colors bg-[var(--surface-2)] p-1 rounded-sm shrink-0">
             <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        
        {!ev ? (
          <div className="p-10 text-center font-mono text-red-500/80 text-sm sm:text-base">ERROR: FILE CORRUPTED OR NOT FOUND</div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full min-h-0 overflow-hidden">
            
            {/* IMAGE CONTAINER with ZOOM FUNCTIONALITY */}
            <div className="lg:w-[65%] xl:w-[70%] bg-[#010203] border-b lg:border-b-0 lg:border-r border-[var(--border)] relative flex shrink-0 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {!imageError ? (
                <TransformWrapper
                  initialScale={1}
                  minScale={0.8}
                  maxScale={5}
                  centerZoomedOut={true}
                  doubleClick={{ mode: "zoomIn", step: 1 }}
                  wheel={{ step: 0.15 }}
                >
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      {/* ZOOM BUTTONS */}
                      <div className="absolute top-4 right-4 z-20 flex flex-col sm:flex-row gap-2">
                        <button onClick={() => zoomIn()} className="p-2 sm:p-3 bg-[#0a0d10]/80 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-bright)] hover:border-[var(--accent-bright)] backdrop-blur-md rounded-sm transition-all shadow-xl" title="Zoom In">
                          <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button onClick={() => zoomOut()} className="p-2 sm:p-3 bg-[#0a0d10]/80 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-bright)] hover:border-[var(--accent-bright)] backdrop-blur-md rounded-sm transition-all shadow-xl" title="Zoom Out">
                          <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button onClick={() => resetTransform()} className="p-2 sm:p-3 bg-[#0a0d10]/80 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-bright)] hover:border-[var(--accent-bright)] backdrop-blur-md rounded-sm transition-all shadow-xl" title="Reset View">
                          <Maximize className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>

                      {/* Kontener z obrazem - obsługuje mysz i dotyk */}
                      <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <img 
                          src={ev.imagePath} 
                          alt={ev.title} 
                          className="w-full h-full object-contain relative z-10 shadow-2xl border border-white/5 cursor-grab active:cursor-grabbing" 
                          onError={() => setImageError(true)} 
                        />
                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              ) : (
                <div className="flex flex-col items-center justify-center text-[var(--text-muted)] z-10 w-full h-full border border-dashed border-[var(--border)] bg-black/20 backdrop-blur-sm p-4 sm:p-8">
                  <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-[var(--accent-muted)] opacity-50" />
                  <span className="font-mono text-[10px] sm:text-[12px] tracking-[0.1em] text-[var(--accent-muted)] mb-2 font-bold text-center">DECRYPTION PENDING</span>
                  <span className="font-mono text-[9px] sm:text-[11px] text-center max-w-xs opacity-70">Graphic asset `{ev.imagePath}` could not be loaded. Please ensure the file exists.</span>
                </div>
              )}
            </div>

            {/* DETAILS */}
            <div className="lg:w-[35%] xl:w-[30%] flex flex-col p-4 sm:p-8 bg-[var(--surface-1)] lg:overflow-y-auto z-10 relative shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
              <div className="mb-6 sm:mb-8 shrink-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-mono text-white tracking-wide uppercase leading-tight mb-4 sm:mb-6">{ev.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400/80 px-2 py-1 border border-emerald-500/30 bg-emerald-500/10 rounded-sm">
                    TYPE: {ev.type}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-amber-400/80 px-2 py-1 border border-amber-500/30 bg-amber-500/10 rounded-sm">
                    SOURCE_LVL: {ev.sourceLevel.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-muted)] px-2 py-1 border border-[var(--border)] bg-[var(--surface-2)] rounded-sm">
                    ID: {ev.id}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-[10px] sm:text-[12px] tracking-[0.2em] text-[var(--text-secondary)] mb-3 sm:mb-4 border-b border-[var(--border)] pb-2">
                  INVESTIGATOR'S NOTES //
                </h3>
                <p className="font-mono text-[12px] sm:text-[14px] text-[#AAB4BE] leading-relaxed whitespace-pre-wrap">
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