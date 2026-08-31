import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, AlertTriangle, ZoomIn, ZoomOut, Maximize, Key, Skull } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { EVIDENCE_DB } from '../../game/evidence';
import { useGameStore } from '../../store/gameStore';
import { useSound } from '../../hooks/useSound';

const GLITCH_BLOCKS = [...Array(12)].map(() => ({
  xParams: [0, Math.random() * 50 - 25, Math.random() * -50 + 25, 0],
  yParams: [0, Math.random() * 50 - 25, Math.random() * -50 + 25, 0],
  duration: 0.1 + Math.random() * 0.2,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  width: `${Math.random() * 40 + 10}%`,
  height: `${Math.random() * 10 + 2}%`,
}));

interface EvidenceModalProps {
  evidenceId: string;
  onClose: () => void;
}

export const EvidenceModal = ({ evidenceId, onClose }: EvidenceModalProps) => {
  const [imageError, setImageError] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [jumpscarePhase, setJumpscarePhase] = useState(0);
  const [oraclePhase, setOraclePhase] = useState(0);

  const { discoveredEasterEggs, discoverEasterEgg, soundEnabled } = useGameStore();
  const ev = EVIDENCE_DB[evidenceId];
  const isSecretDiscovered = discoveredEasterEggs.includes(evidenceId);

  // Audio setup
  const { play: playHeartbeat } = useSound('heartbeat1.mp3', { volume: soundEnabled ? 1.0 : 0 });
  const { play: playBass } = useSound('bass_hit1.mp3', { volume: soundEnabled ? 1.0 : 0 });
  const { play: playGlitch } = useSound('glitch2.mp3', { volume: soundEnabled ? 0.5 : 0 });
  const { play: playGlitch2 } = useSound('glitch1.mp3', { volume: soundEnabled ? 0.15 : 0 });
  const { play: playGlitchLight } = useSound('glitch_light.mp3', { volume: soundEnabled ? 1 : 0 });
  const { play: playError } = useSound('error.mp3', { volume: soundEnabled ? 0.6 : 0 });
  const { play: playSuccess } = useSound('success.mp3', { volume: soundEnabled ? 0.5 : 0 });
  const { play: playBeep } = useSound('beep2.mp3', { volume: soundEnabled ? 0.9 : 0 });

  const handleEasterEggClick = () => {
    if (jumpscarePhase !== 0 || oraclePhase !== 0) return;
    const actionType = ev?.easterEgg?.actionType || 'standard';

    if (actionType === 'oracle_eyes') {
      if (!isSecretDiscovered) discoverEasterEgg(evidenceId);
      setShowSecret(false); setOraclePhase(1); 
      setTimeout(() => { setOraclePhase(2); playBass(); }, 100);
      setTimeout(() => { setOraclePhase(3); playGlitch2(); playHeartbeat(); }, 200);
      setTimeout(() => { setOraclePhase(0); setShowSecret(true); }, 8000);
      return;
    }

    if (actionType === 'jumpscare') {
      if (!isSecretDiscovered) discoverEasterEgg(evidenceId);
      playHeartbeat(); playGlitch(); setShowSecret(false); setJumpscarePhase(1);
      setTimeout(() => { setJumpscarePhase(2); }, 500);
      setTimeout(() => { setJumpscarePhase(0); setShowSecret(true); }, 2000);
      return;
    }

    if (actionType === 'password' && !isSecretDiscovered) {
      playBeep(); setShowPasswordPrompt(true); setPasswordInput(''); setPasswordError(false); return;
    }

    if (!isSecretDiscovered) discoverEasterEgg(evidenceId);
    if (actionType === 'redacted') playGlitchLight(); else playBeep();
    setShowSecret(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = ev?.easterEgg?.actionConfig?.expectedPassword?.toUpperCase();
    if (passwordInput.toUpperCase() === expected) {
      playSuccess(); setShowPasswordPrompt(false); discoverEasterEgg(evidenceId); setShowSecret(true);
    } else {
      playError(); setPasswordError(true); setPasswordInput('');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] flex items-center justify-center bg-[#030505]/95 backdrop-blur-md p-2 sm:p-6" onClick={onClose}>
      
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} className="bg-[#090c0c] border border-[#303630] w-[95vw] max-w-7xl h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden relative" onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#303630] bg-[#070909] shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-[#806d4b] shrink-0" />
            <span className="font-mono text-[10px] sm:text-[12px] text-[#c0c2b9] tracking-[0.1em] sm:tracking-[0.2em] font-bold truncate uppercase">NEXUS_OS // CLASSIFIED DATA</span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            {ev?.easterEgg && (
              <span className={`hidden sm:flex font-mono text-[9px] sm:text-[10px] tracking-widest px-2 py-1 border rounded-none uppercase ${isSecretDiscovered ? 'text-[#a3ad82] border-[#4e574d] bg-[#0a0d0c]' : 'text-[#555a53] border-[#303630]'}`}>
                {isSecretDiscovered ? 'SECRET: FOUND' : 'SECRET: UNKNOWN'}
              </span>
            )}
            <button onClick={onClose} className="text-[#656a63] hover:text-[#d4d6c8] transition-colors bg-[#0a0d0c] border border-[#303630] hover:border-[#a3ad82] p-1.5 rounded-none shrink-0">
               <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
        
        {/* BODY */}
        {!ev ? (
          <div className="p-10 text-center font-mono text-[#956b59] text-sm sm:text-base tracking-widest uppercase">ERROR: FILE CORRUPTED OR NOT FOUND</div>
        ) : (
          <div className="flex flex-col lg:flex-row h-full min-h-0 overflow-hidden">
            
            {/* IMAGE VIEWER  */}
            <div className="lg:w-[65%] xl:w-[70%] bg-[#030505] border-b lg:border-b-0 lg:border-r border-[#303630] relative flex shrink-0 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(163,173,130,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(163,173,130,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              {!imageError ? (
                <TransformWrapper initialScale={1} minScale={0.8} maxScale={5} centerZoomedOut={true} doubleClick={{ mode: "zoomIn", step: 1 }} wheel={{ step: 0.15 }}>
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex gap-2">
                        <button onClick={() => zoomIn()} className="p-2 sm:p-3 bg-[#070909]/80 border border-[#303630] text-[#70756d] hover:text-[#a3ad82] hover:border-[#a3ad82] backdrop-blur-md transition-all shadow-xl rounded-none"><ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                        <button onClick={() => zoomOut()} className="p-2 sm:p-3 bg-[#070909]/80 border border-[#303630] text-[#70756d] hover:text-[#a3ad82] hover:border-[#a3ad82] backdrop-blur-md transition-all shadow-xl rounded-none"><ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                        <button onClick={() => resetTransform()} className="p-2 sm:p-3 bg-[#070909]/80 border border-[#303630] text-[#70756d] hover:text-[#a3ad82] hover:border-[#a3ad82] backdrop-blur-md transition-all shadow-xl rounded-none"><Maximize className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                      </div>
                      
                      <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img 
                            src={ev.imagePath} 
                            alt={ev.title} 
                            className="w-full h-full object-contain relative z-10 shadow-2xl border border-[#303630]/20 cursor-grab active:cursor-grabbing" 
                            onError={() => setImageError(true)} 
                          />
                          
                          {ev.easterEgg && (
                            <div 
                              onClick={(e) => { e.stopPropagation(); handleEasterEggClick(); }}
                              className={`absolute z-20 transition-all duration-300 cursor-crosshair overflow-hidden ${showSecret ? 'border border-[#a3ad82]/60 bg-[#a3ad82]/15' : 'hover:border hover:border-[#a3ad82] hover:bg-[#a3ad82]/20 hover:shadow-[0_0_15px_rgba(163,173,130,0.3)]'}`}
                              style={{ left: `${ev.easterEgg.x}%`, top: `${ev.easterEgg.y}%`, width: `${ev.easterEgg.width}%`, height: `${ev.easterEgg.height}%` }}
                            >
                              {ev.easterEgg.actionType === 'redacted' && isSecretDiscovered && (
                                <div className="w-full h-full bg-[#050707] border border-[#a3ad82] text-[#a3ad82] flex items-center justify-center font-mono text-[7px] sm:text-[10px] whitespace-nowrap z-30 shadow-[0_0_10px_rgba(163,173,130,0.3)] tracking-widest">
                                  {ev.easterEgg.actionConfig?.revealedText}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                      </TransformComponent>
                    </>
                  )}
                </TransformWrapper>
              ) : (
                <div className="flex flex-col items-center justify-center text-[#555a53] z-10 w-full h-full border border-dashed border-[#303630] bg-[#050707]/50 backdrop-blur-sm p-4 sm:p-8">
                  <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 mb-3 sm:mb-4 text-[#806d4b] opacity-50" />
                  <span className="font-mono text-[10px] sm:text-[12px] tracking-[0.1em] text-[#806d4b] mb-2 font-bold text-center">DECRYPTION PENDING</span>
                  <span className="font-mono text-[9px] sm:text-[11px] text-center max-w-xs opacity-70">Graphic asset `{ev.imagePath}` could not be loaded.</span>
                </div>
              )}
            </div>

            {/* TEXT PANEL */}
            <div className="lg:w-[35%] xl:w-[30%] flex flex-col p-5 sm:p-8 bg-[#090c0c] lg:overflow-y-auto z-10 relative shadow-[0_-10px_30px_rgba(0,0,0,0.3)] lg:shadow-[-10px_0_30px_rgba(0,0,0,0.3)]">
              <div className="mb-5 sm:mb-8 shrink-0">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-mono text-[#c0c2b9] tracking-[0.15em] uppercase leading-tight mb-4 sm:mb-6">{ev.title}</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="text-[8px] sm:text-[10px] font-mono text-[#a3ad82] px-2 py-1 border border-[#4e574d] bg-[#0a0d0c] rounded-none tracking-widest uppercase">TYPE: {ev.type}</span>
                  <span className="text-[8px] sm:text-[10px] font-mono text-[#806d4b] px-2 py-1 border border-[#665b43] bg-[#0c0e0d] rounded-none tracking-widest uppercase">SOURCE_LVL: {ev.sourceLevel.toString().padStart(2, '0')}</span>
                  <span className="text-[8px] sm:text-[10px] font-mono text-[#656a63] px-2 py-1 border border-[#303630] bg-[#050707] rounded-none tracking-widest uppercase">ID: {ev.id}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-mono text-[10px] sm:text-[12px] tracking-[0.2em] text-[#70756d] mb-3 sm:mb-4 border-b border-[#303630] pb-2 uppercase">INVESTIGATOR'S NOTES //</h3>
                <p className="font-mono text-[11px] sm:text-[13px] text-[#b3b5ad] leading-relaxed whitespace-pre-wrap">{ev.storyDescription || ev.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* EASTER EGG HINT MODAL */}
        <AnimatePresence>
          {showSecret && ev?.easterEgg && (
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 20, scale: 0.95 }} 
              transition={{ duration: 0.3, ease: 'easeOut' }} 
              className="absolute bottom-0 right-0 sm:bottom-6 sm:right-6 z-[200] w-[85%] sm:w-[420px] max-h-[60vh] flex flex-col bg-[#070909] border-t sm:border border-[#303630] shadow-[0_0_40px_rgba(0,0,0,0.9)] font-mono overflow-hidden"
            >
              <div className="h-1 w-full bg-[#a3ad82] shrink-0" />
              
              <div className="p-4 sm:p-5 flex flex-col min-h-0 overflow-y-auto">
                
                {/* Header Hint */}
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-[#a3ad82] text-[10px] sm:text-[11px] tracking-widest font-bold uppercase">
                      <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="truncate">HIDDEN DATA FRAGMENT</span>
                    </div>
                    <div className="mt-1 text-[8px] sm:text-[9px] tracking-widest text-[#656a63] uppercase">
                      NEXUS DATABASE // RECOVERY CHANNEL
                    </div>
                  </div>
                  <button onClick={() => setShowSecret(false)} className="text-[#656a63] hover:text-[#d4d6c8] transition-colors bg-[#0a0d0c] border border-[#303630] hover:border-[#a3ad82] p-1 shrink-0">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="border-t border-b border-[#303630] py-4 my-2 overflow-y-auto min-h-0">
                  <p className="font-mono text-[11px] sm:text-[13px] text-[#d4d6c8] leading-relaxed tracking-wide whitespace-pre-wrap">
                    {ev.easterEgg.message}
                  </p>
                </div>

                <div className="mt-2 text-[8px] sm:text-[9px] tracking-[0.2em] text-[#555a53] uppercase shrink-0">
                  CLASSIFICATION: RESTRICTED
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ORACLE EYES OVERLAY */}
        {oraclePhase === 3 && (
          <div className="fixed inset-0 z-[9999] bg-black pointer-events-none flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-60 mix-blend-screen" style={{ backgroundImage: 'url(/assets/evidence/oracle_eyes_01.png)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'contrast(125%) grayscale(100%) brightness(82%)' }} />
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 25%, rgba(0,0,0,0.45) 65%, #000 100%)' }} />
            <div className="relative z-10 font-mono text-center px-4">
              <p className="text-[8px] sm:text-[10px] tracking-[0.45em] text-[#75827A]/60 mb-6 sm:mb-10 uppercase">RECOVERED TRANSMISSION // ORACLE_01</p>
              <p className="text-base sm:text-2xl tracking-[0.25em] text-[#A8B2AB]/80 mb-2 sm:mb-3 uppercase">IF YOU FOUND THIS</p>
              <p className="text-base sm:text-2xl tracking-[0.25em] text-[#A8B2AB]/80 uppercase">THEY ALREADY KNOW.</p>
              <div className="mt-6 sm:mt-10 h-px w-20 sm:w-32 mx-auto bg-[#75827A]/30" />
              <p className="mt-6 sm:mt-10 text-lg sm:text-3xl tracking-[0.18em] text-[#D0D5D1] font-bold uppercase">DO NOT TRUST THE LOGS.</p>
              <p className="mt-4 sm:mt-5 text-[9px] sm:text-xs tracking-[0.35em] text-[#75827A]/70 uppercase">THEY WERE NEVER MEANT TO TELL THE TRUTH.</p>
            </div>
          </div>
        )}

        {/* JUMPSCARE OVERLAYS */}
        <AnimatePresence>
          {jumpscarePhase === 1 && (
            <motion.div className="absolute inset-0 z-[600] pointer-events-none overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div animate={{ backgroundColor: ['#000000', '#080000', '#1a0000', '#050000', '#320000', '#100000', '#000000'], opacity: [0.8, 1, 0.9, 1, 0.85, 1] }} transition={{ duration: 0.18, repeat: Infinity, ease: 'linear' }} className="absolute inset-0" />
              <motion.div animate={{ backgroundColor: ['#080000', '#260000', '#520000', '#150000', '#3a0000', '#000000'], opacity: [0, 0.5, 0.8, 0.2, 0.6, 0] }} transition={{ duration: 0.22, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 mix-blend-screen" />
              {GLITCH_BLOCKS.map((block, i) => (
                <motion.div key={i} animate={{ x: block.xParams, y: block.yParams, opacity: [0, 0.8, 0.1, 1, 0, 0.6, 0], backgroundColor: ['#120000', '#3d0000', '#680000', '#21000f', '#080000'] }} transition={{ duration: block.duration, repeat: Infinity, ease: 'linear' }} className="absolute mix-blend-screen" style={{ left: block.left, top: block.top, width: block.width, height: block.height }} />
              ))}
              <motion.div animate={{ x: [-12, 18, -20, 14, -8, 0], y: [6, -8, 12, -10, 5, 0], opacity: [0.1, 0.5, 0.15, 0.7, 0.2, 0.1] }} transition={{ duration: 0.12, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 bg-[#160000] mix-blend-overlay" />
              <motion.div animate={{ scaleX: [1, 1.04, 0.97, 1.02, 1], opacity: [0, 0.5, 0.1, 0.7, 0], backgroundColor: ['#050000', '#300000', '#100000', '#4a0000', '#000000'] }} transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 mix-blend-overlay" />
            </motion.div>
          )}

          {jumpscarePhase === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[500] bg-[#050000] flex items-center justify-center pointer-events-none">
              <motion.div animate={{ opacity: [0.7, 1, 0.75, 1, 0.8], scale: [1, 1.02, 0.99, 1.01, 1] }} transition={{ duration: 0.3, repeat: Infinity, ease: 'linear' }} className="text-2xl sm:text-6xl font-black text-[#6b0000] tracking-[0.3em] font-mono flex items-center gap-4 sm:gap-6 px-4 text-center" style={{ textShadow: '0 0 5px #250000, 0 0 15px #500000, 0 0 35px #350000' }}>
                <Skull className="hidden sm:block w-16 h-16 text-[#520000]" /> TRACE DETECTED <Skull className="hidden sm:block w-16 h-16 text-[#520000]" />
              </motion.div>
              <motion.div animate={{ opacity: [0, 0.25, 0, 0.35, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="absolute inset-0 bg-[#300000] mix-blend-screen pointer-events-none" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* PASSWORD PROMPT */}
        <AnimatePresence>
          {showPasswordPrompt && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[300] bg-[#020506]/85 backdrop-blur-[3px] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0, y: 8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.98 }} transition={{ duration: 0.18 }} className="relative w-full max-w-md bg-[#090d0f] border border-[#3a4440] shadow-[0_18px_60px_rgba(0,0,0,0.75)] overflow-hidden">
                <div className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_2px,#aab5ad_3px)]" />
                <div className="relative px-5 sm:px-6 pt-5 border-b border-[#303936] pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#8b7442]" />
                      <div>
                        <div className="text-[#b8b9ad] font-mono text-[9px] sm:text-[11px] tracking-[0.22em] uppercase">NEXUS SECURITY NETWORK</div>
                        <div className="text-[#66716c] font-mono text-[7px] sm:text-[9px] tracking-[0.18em] mt-1 uppercase">RESTRICTED TERMINAL</div>
                      </div>
                    </div>
                    <button onClick={() => setShowPasswordPrompt(false)} className="text-[#59625f] hover:text-[#a08a52] transition-colors"><X className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                  </div>
                </div>

                <div className="relative p-5 sm:p-6">
                  <div className="mb-5 sm:mb-6">
                    <div className="text-[#8d927f] font-mono text-[10px] sm:text-xs tracking-[0.18em] uppercase">AUTHENTICATION REQUIRED</div>
                    <div className="text-[#4f5a55] font-mono text-[8px] sm:text-[9px] tracking-[0.16em] mt-1.5 uppercase">SECURITY LEVEL: EXECUTIVE / RESTRICTED</div>
                  </div>
                  <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-3 sm:gap-4">
                    <label className="text-[#707974] font-mono text-[9px] sm:text-[10px] tracking-[0.18em] uppercase">ENTER DECRYPTION KEY</label>
                    <div className="relative">
                      <input type="text" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} autoFocus className="w-full bg-[#040708] border border-[#343d3a] text-[#a9ae99] font-mono text-xs sm:text-sm px-3 sm:px-4 py-2.5 sm:py-3 outline-none tracking-[0.16em] uppercase transition-all focus:border-[#716544]" />
                    </div>
                    {passwordError && (
                      <div className="border-l-2 border-[#76584d] bg-[#160f0d] px-3 py-2 text-[#a87965] font-mono text-[8px] sm:text-[9px] tracking-[0.12em] uppercase">AUTHENTICATION FAILURE — ACCESS DENIED</div>
                    )}
                    <button type="submit" className="mt-2 bg-[#111715] border border-[#454b45] text-[#9a9b87] hover:bg-[#171d1a] hover:border-[#756a4d] hover:text-[#b5aa7c] p-2.5 sm:p-3 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] transition-all duration-200 uppercase">AUTHENTICATE</button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </motion.div>
  );
};