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

  const { play: playHeartbeat } = useSound('heartbeat1.mp3', { volume: soundEnabled ? 1.0 : 0 });
  const { play: playBass } = useSound('bass_hit1.mp3', { volume: soundEnabled ? 1.0 : 0 });
  const { play: playGlitch } = useSound('glitch2.mp3', { volume: soundEnabled ? 0.5 : 0 });
  const { play: playGlitchLight } = useSound('glitch_light.mp3', { volume: soundEnabled ? 1 : 0 });
  const { play: playError } = useSound('error.mp3', { volume: soundEnabled ? 0.6 : 0 });
  const { play: playSuccess } = useSound('success.mp3', { volume: soundEnabled ? 0.5 : 0 });
  const { play: playBeep } = useSound('beep2.mp3', { volume: soundEnabled ? 0.9 : 0 });

  const handleEasterEggClick = () => {
    if (jumpscarePhase !== 0 || oraclePhase !== 0) return;

    if (!isSecretDiscovered) {
      discoverEasterEgg(evidenceId);
    }

    const actionType = ev?.easterEgg?.actionType || 'standard';

    if (actionType === 'oracle_eyes') {
      setShowSecret(false);
      setOraclePhase(1); 
      
      setTimeout(() => {
        setOraclePhase(2); 
        playBass();
      }, 100);
      
      setTimeout(() => {
        setOraclePhase(3); 
        playGlitch();
        playError();
      }, 200);
      
      setTimeout(() => {
        setOraclePhase(0); 
        setShowSecret(true); 
      }, 2200);
      return;
    }

    // jumpscare mechanic
    if (actionType === 'jumpscare') {
      playHeartbeat();
      playGlitch();
      setShowSecret(false);
      
      setJumpscarePhase(1);
      
      // trace detected effect
      setTimeout(() => {
        setJumpscarePhase(2);
      }, 500);

      // end
      setTimeout(() => {
        setJumpscarePhase(0);
        setShowSecret(true);
      }, 2000);
      return;
    }

    // password mechanic
    if (actionType === 'password' && !isSecretDiscovered) {
      playBeep();
      setShowPasswordPrompt(true);
      setPasswordInput('');
      setPasswordError(false);
      return;
    }

    // redacted mechanic
    if (actionType === 'redacted') {
      playGlitchLight();
    } else {
      playBeep();
    }
    
    setShowSecret(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = ev?.easterEgg?.actionConfig?.expectedPassword?.toUpperCase();
    if (passwordInput.toUpperCase() === expected) {
      playSuccess();
      setShowPasswordPrompt(false);
      setShowSecret(true);
    } else {
      playError();
      setPasswordError(true);
      setPasswordInput('');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} 
        className="bg-[var(--surface-1)] border border-[var(--border)] w-[95vw] max-w-7xl h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        
        <AnimatePresence>
          {oraclePhase === 1 && <div className="fixed inset-0 z-[9999] bg-black pointer-events-none" />}
          {oraclePhase === 2 && <div className="fixed inset-0 z-[9999] bg-white pointer-events-none" />}
          {oraclePhase === 3 && (
            <div className="fixed inset-0 z-[9999] bg-black pointer-events-none flex flex-col items-center justify-center overflow-hidden">
              <div 
                className="absolute inset-0 opacity-50 mix-blend-screen animate-pulse" 
                style={{ 
                  backgroundImage: 'url(/assets/evidence/oracle_face.jpg)', 
                  backgroundSize: 'cover', backgroundPosition: 'center', filter: 'contrast(200%) grayscale(100%)'
                }} 
              />
              <div className="relative z-10 font-mono text-[var(--accent-bright)] text-xl sm:text-3xl text-center space-y-2 font-bold drop-shadow-[0_0_15px_rgba(163,199,168,0.8)]">
                <p className="animate-pulse">CONNECTION ESTABLISHED</p>
                <p className="animate-pulse delay-75">ORACLE_01</p>
                <p className="animate-pulse delay-150 text-red-500">CAMERA: UNKNOWN</p>
                <div className="mt-12 bg-black/80 p-4 border border-[var(--accent-bright)] backdrop-blur-md">
                  <p className="text-white text-2xl sm:text-4xl tracking-widest uppercase">&gt; YOU SHOULDN'T HAVE FOUND THIS.</p>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
            </div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {jumpscarePhase === 1 && (
            <motion.div
              className="absolute inset-0 z-[600] pointer-events-none overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{
                  backgroundColor: [
                    '#000000',
                    '#080000',
                    '#1a0000',
                    '#050000',
                    '#320000',
                    '#100000',
                    '#000000',
                  ],
                  opacity: [0.8, 1, 0.9, 1, 0.85, 1],
                }}
                transition={{
                  duration: 0.18,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0"
              />

              {/* glitch */}
              <motion.div
                animate={{
                  backgroundColor: [
                    '#080000',
                    '#260000',
                    '#520000',
                    '#150000',
                    '#3a0000',
                    '#000000',
                  ],
                  opacity: [0, 0.5, 0.8, 0.2, 0.6, 0],
                }}
                transition={{
                  duration: 0.22,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 mix-blend-screen"
              />

              {GLITCH_BLOCKS.map((block, i) => (
                <motion.div
                  key={i}
                  animate={{
                    x: block.xParams,
                    y: block.yParams,
                    opacity: [0, 0.8, 0.1, 1, 0, 0.6, 0],
                    backgroundColor: [
                      '#120000',
                      '#3d0000',
                      '#680000',
                      '#21000f',
                      '#080000',
                    ],
                  }}
                  transition={{
                    duration: block.duration,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute mix-blend-screen"
                  style={{
                    left: block.left,
                    top: block.top,
                    width: block.width,
                    height: block.height,
                  }}
                />
              ))}
              <motion.div
                animate={{
                  x: [-12, 18, -20, 14, -8, 0],
                  y: [6, -8, 12, -10, 5, 0],
                  opacity: [0.1, 0.5, 0.15, 0.7, 0.2, 0.1],
                }}
                transition={{
                  duration: 0.12,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 bg-[#160000] mix-blend-overlay"
              />
              <motion.div
                animate={{
                  scaleX: [1, 1.04, 0.97, 1.02, 1],
                  opacity: [0, 0.5, 0.1, 0.7, 0],
                  backgroundColor: [
                    '#050000',
                    '#300000',
                    '#100000',
                    '#4a0000',
                    '#000000',
                  ],
                }}
                transition={{
                  duration: 0.1,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 mix-blend-overlay"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle, transparent 15%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.95) 100%)',
                }}
              />
              <motion.div
                animate={{
                  opacity: [0, 0.2, 0, 0.35, 0, 0.15, 0],
                }}
                transition={{
                  duration: 0.25,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute inset-0 bg-[#350000] mix-blend-color"
              />
            </motion.div>
          )}

          {/* Skeleton head */}
          {jumpscarePhase === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-[500] bg-[#050000] flex items-center justify-center pointer-events-none"
            >
              <motion.div
                animate={{
                  opacity: [0.7, 1, 0.75, 1, 0.8],
                  scale: [1, 1.02, 0.99, 1.01, 1],
                }}
                transition={{
                  duration: 0.3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="text-4xl sm:text-6xl font-black text-[#6b0000] tracking-[0.3em] font-mono flex items-center gap-6"
                style={{
                  textShadow:
                    '0 0 5px #250000, 0 0 15px #500000, 0 0 35px #350000',
                }}
              >
                <Skull className="w-16 h-16 text-[#520000]" />
                TRACE DETECTED
                <Skull className="w-16 h-16 text-[#520000]" />
              </motion.div>

              <motion.div
                animate={{
                  opacity: [0, 0.25, 0, 0.35, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-[#300000] mix-blend-screen pointer-events-none"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Password */}
        <AnimatePresence>
          {showPasswordPrompt && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="bg-[#0d131a] border-2 border-red-900/50 shadow-[0_0_50px_rgba(239,68,68,0.2)] p-8 w-[90%] max-w-md">
                <div className="flex justify-between items-center mb-6 border-b border-red-900/50 pb-4">
                  <h3 className="text-red-500 font-mono tracking-widest font-bold">UNAUTHORIZED ACCESS</h3>
                  <button onClick={() => setShowPasswordPrompt(false)} className="text-[var(--text-muted)] hover:text-red-500"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                  <label className="text-[var(--text-muted)] font-mono text-xs tracking-widest">ENTER DECRYPTION KEY:</label>
                  <input 
                    type="text" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="bg-[#05090c] border border-red-900/50 text-red-400 font-mono p-3 focus:outline-none focus:border-red-500 uppercase tracking-widest"
                    autoFocus
                  />
                  {passwordError && <span className="text-red-500 text-xs font-mono animate-pulse">INVALID KEY. ACCESS DENIED.</span>}
                  <button type="submit" className="mt-2 bg-red-950/30 border border-red-900/50 text-red-400 hover:bg-red-900 hover:text-white p-3 font-mono tracking-widest transition-colors">
                    DECRYPT
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Easter Egg Hint */}
        <AnimatePresence>
          {showSecret && ev?.easterEgg && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-4 sm:bottom-10 left-1/2 -translate-x-1/2 z-[200] max-w-lg w-[90%] bg-black/90 border border-[var(--accent-bright)] p-4 sm:p-6 shadow-[0_0_50px_rgba(163,199,168,0.3)] backdrop-blur-xl"
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4 border-b border-[var(--accent-bright)]/30 pb-2">
                <div className="flex items-center gap-2 text-[var(--accent-bright)] font-mono text-[10px] sm:text-xs tracking-widest font-bold">
                  <Key className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
                  [HIDDEN DATA FRAGMENT RECOVERED]
                </div>
                <button onClick={() => setShowSecret(false)} className="text-[var(--text-muted)] hover:text-[var(--accent-bright)]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="font-mono text-[11px] sm:text-sm text-[#e2e8f0] leading-relaxed">
                {ev.easterEgg.message}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border)] bg-[#131920] shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-muted)] shrink-0" />
            <span className="font-mono text-[10px] sm:text-[12px] text-[var(--text-main)] tracking-[0.1em] sm:tracking-[0.2em] font-bold truncate">
              NEXUS_OS // CLASSIFIED DATA
            </span>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            {ev?.easterEgg && (
              <span className={`hidden sm:flex font-mono text-[9px] sm:text-[10px] tracking-widest px-2 py-1 border rounded-sm ${isSecretDiscovered ? 'text-[var(--accent-bright)] border-[var(--accent-bright)] bg-[var(--accent)]/10' : 'text-[var(--text-muted)] border-[var(--text-muted)] opacity-50'}`}>
                {isSecretDiscovered ? 'SECRET: FOUND' : 'SECRET: UNKNOWN'}
              </span>
            )}
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white transition-colors bg-[var(--surface-2)] p-1 rounded-sm shrink-0">
               <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
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
                  initialScale={1} minScale={0.8} maxScale={5} centerZoomedOut={true}
                  doubleClick={{ mode: "zoomIn", step: 1 }} wheel={{ step: 0.15 }}
                >
                  {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                      {/* ZOOM BUTTONS */}
                      <div className="absolute top-4 right-4 z-20 flex flex-col sm:flex-row gap-2">
                        <button onClick={() => zoomIn()} className="p-2 sm:p-3 bg-[#0a0d10]/80 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-bright)] hover:border-[var(--accent-bright)] backdrop-blur-md rounded-sm transition-all shadow-xl" title="Zoom In"><ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                        <button onClick={() => zoomOut()} className="p-2 sm:p-3 bg-[#0a0d10]/80 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-bright)] hover:border-[var(--accent-bright)] backdrop-blur-md rounded-sm transition-all shadow-xl" title="Zoom Out"><ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                        <button onClick={() => resetTransform()} className="p-2 sm:p-3 bg-[#0a0d10]/80 border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent-bright)] hover:border-[var(--accent-bright)] backdrop-blur-md rounded-sm transition-all shadow-xl" title="Reset View"><Maximize className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                      </div>

                      <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img 
                            src={ev.imagePath} alt={ev.title} 
                            className="w-full h-full object-contain relative z-10 shadow-2xl border border-white/5 cursor-grab active:cursor-grabbing" 
                            onError={() => setImageError(true)} 
                          />
                          
                          {/* HOTSPOT EASTER EGGA */}
                          {ev.easterEgg && (
                            <div 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEasterEggClick();
                              }}
                              className={`absolute z-20 transition-all duration-500 cursor-crosshair overflow-hidden
                                ${showSecret 
                                  ? 'border border-[var(--accent-light-green)]/40 bg-[var(--accent-bright)]/10' 
                                  : 'hover:border hover:border-[var(--accent-light-green)] hover:bg-[var(--accent-light-green)]/20 hover:shadow-[0_0_15px_rgba(163,199,168,0.5)]'
                                }`}
                              style={{
                                left: `${ev.easterEgg.x}%`, top: `${ev.easterEgg.y}%`, width: `${ev.easterEgg.width}%`, height: `${ev.easterEgg.height}%`
                              }}
                            >
                              {/* REDACTED text */}
                              {ev.easterEgg.actionType === 'redacted' && isSecretDiscovered && (
                                <div className="w-full h-full bg-[#0a0d10] border border-[var(--accent-bright)] text-[var(--accent-bright)] flex items-center justify-center font-mono text-[8px] sm:text-[10px] whitespace-nowrap z-30 shadow-[0_0_10px_rgba(163,199,168,0.5)]">
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