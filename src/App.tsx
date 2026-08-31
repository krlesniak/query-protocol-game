import { useEffect, useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { IntroCinematic } from './components/intro/IntroCinematic';
import { dbService } from './db/DatabaseService';
import { useGameStore } from './store/gameStore';
import { Terminal, AlertTriangle, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { generateDatabaseSQL } from './db/schemaGenerator';
import { useSound } from './hooks/useSound';
import { BootSequence } from './components/boot/BootSequence';
import './index.css';

type AppState = 'booting' | 'menu' | 'intro' | 'playing';

const BOOT_LOGS = [
  'NEXUS_OS BIOS v9.01.4 (SECURE BOOT ENABLED)',
  'PROCESSOR: ORACLE_NEURAL_NET_v2 DETECTED',
  'MAIN MEMORY: 1024 TB SECURE RAM ALLOCATED... OK',
  'MOUNTING ENCRYPTED VOLUMES...',
  'VFS: MOUNTED ROOT (EXT4 FILESYSTEM) READ-ONLY.',
  'INITIALIZING DATABASE PROTOCOLS...',
  'ESTABLISHING SECURE UPLINK...',
  'BYPASSING EXTERNAL FIREWALLS...',
  'CHECKING CLEARANCE LEVELS...',
  'ACCESS GRANTED.',
  'SYSTEM READY.',
];

const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

function App() {
  const [appState, setAppState] = useState<AppState>('booting');
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [showResetWarning, setShowResetWarning] = useState(false);
  
  const [mousePos, setMousePos] = useState({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });

  const { currentLevel, score, collectedEvidence, resetGame, hasSeenIntro, setHasSeenIntro, soundEnabled, toggleSound, musicVolume, sfxVolume } = useGameStore();

  const hasProgress = currentLevel > 1 || score > 0 || collectedEvidence.length > 0;

  useSound('hum2.mp3', { volume: soundEnabled ? musicVolume : 0, loop: true, autoPlay: true });
  const { play: playClick } = useSound('mouse.mp3', { volume: soundEnabled ? sfxVolume : 0 });
  const { play: playKeyboard } = useSound('keyboard.mp3', { volume: soundEnabled ? sfxVolume : 0 });
  const { play: playBeep } = useSound('beep2.mp3', { volume: soundEnabled ? sfxVolume : 0 });

  useEffect(() => {
    let aborted = false;

    const initializeDatabase = async () => {
      try {
        await dbService.init();
        try {
          const fullSqlScript = generateDatabaseSQL();
          dbService.seed(fullSqlScript);
        } catch (error) { console.warn('Database seed failed:', error); }
      } catch (error) { console.error('Database initialization failed:', error); }
    };

    const runVisualBoot = async () => {
      await delay(800);
      for (let i = 0; i < BOOT_LOGS.length; i += 1) {
        if (aborted) return;
        setBootLogs((previous) => [...previous, BOOT_LOGS[i]]);
        setProgress(Math.floor(((i + 1) / BOOT_LOGS.length) * 100));
        playKeyboard();
        await delay(i === BOOT_LOGS.length - 1 ? 1000 : Math.random() * 350 + 80);
      }
      if (aborted) return;
      playBeep();
      await delay(800);
    };

    const startSystem = async () => {
      try {
        await Promise.all([initializeDatabase(), runVisualBoot()]);
        if (!aborted) setAppState('menu');
      } catch (error) { console.error('Critical system error:', error); }
    };

    startSystem();
    return () => { aborted = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinue = () => { playClick(); window.setTimeout(() => { setAppState('playing'); }, 100); };
  const startGameFlow = () => { window.setTimeout(() => { if (!hasSeenIntro) { setAppState('intro'); } else { setAppState('playing'); } }, 100); };
  const handleNewGame = () => { playClick(); if (hasProgress) { setShowResetWarning(true); return; } resetGame(); startGameFlow(); };
  const confirmReset = () => { playClick(); resetGame(); setShowResetWarning(false); startGameFlow(); };
  const handleSoundToggle = () => { playClick(); toggleSound(); };

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      setMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      className="min-h-screen w-full bg-[#030505] text-[#b3b5ad] flex items-center justify-center font-mono selection:bg-[#806d4b]/30 selection:text-[#d4d6c8] overflow-hidden relative"
    >
      
      {/* GLOBAL CRT OVERLAYS FOR BOOT AND MENU */}
      {(appState === 'booting' || appState === 'menu') && (
        <>
          <div className="pointer-events-none absolute inset-0 z-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.015)_0px,rgba(255,255,255,0.015)_1px,rgba(0,0,0,0.03)_1px,rgba(0,0,0,0.03)_4px)] opacity-30 mix-blend-screen" />
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.3)_65%,rgba(0,0,0,0.85)_100%)]" />
          <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.45\'/%3E%3C/svg%3E")' }} />
          
          <div 
            className="pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300"
            style={{ background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(163,173,130,0.06), transparent 40%)` }}
          />
        </>
      )}

      {/* SOUND CONTROL */}
      {(appState === 'booting' || appState === 'menu') && (
        <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[9999]">
          <button type="button" onClick={handleSoundToggle} className="p-3 sm:p-4 border border-[#444a43] bg-[#080b0b]/90 text-[#737970] hover:text-[#aaa18a] hover:border-[#806d4b]/70 hover:bg-[#0c0f0e] transition-all duration-300 group backdrop-blur-sm relative z-20">
            {soundEnabled ? <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 opacity-70 group-hover:opacity-100 transition-opacity" /> : <VolumeX className="w-5 h-5 sm:w-6 sm:h-6 opacity-70 group-hover:opacity-100 transition-opacity" />}
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {appState === 'booting' && <BootSequence bootLogs={bootLogs} progress={progress} />}

        {appState === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }} transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-2xl w-[calc(100%-2rem)] sm:w-full flex flex-col gap-8 sm:gap-10 p-6 sm:p-12 border border-[#303630] bg-[#090c0c]/95 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-[4px] relative overflow-hidden mx-auto z-10"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-[#806d4b]/60" />

            <div className="flex flex-col gap-3 sm:gap-4 border-b border-[#303630] pb-6 sm:pb-8">
              <Terminal className="w-10 h-10 sm:w-12 sm:h-12 text-[#a3ad82] mb-2 sm:mb-3" />
              <h1 className="text-3xl sm:text-4xl tracking-[0.15em] sm:tracking-[0.2em] font-bold text-[#c0c2b9] break-words">QUERY_PROTOCOL</h1>
              <p className="text-[#656a63] text-xs sm:text-sm tracking-widest uppercase">Nexus Dynamics // Authorized Personnel Only</p>
            </div>

            {!showResetWarning ? (
              <div className="flex flex-col gap-4 sm:gap-5">
                {hasProgress && (
                  <button type="button" onClick={handleContinue} className="group relative flex items-center justify-between p-5 sm:p-6 border border-[#806d4b]/50 bg-[#120f0a] hover:border-[#806d4b] hover:bg-[#1a150e] transition-all duration-300 overflow-hidden text-left">
                    <div className="relative z-10 flex flex-col">
                      <span className="tracking-[0.15em] sm:tracking-[0.2em] text-sm sm:text-base font-bold text-[#c0a66d] group-hover:text-[#e8d299] transition-colors duration-300">CONTINUE SESSION</span>
                      <span className="text-[10px] sm:text-xs tracking-widest opacity-80 mt-1.5 text-[#a18a5d] group-hover:text-[#d1ba8a] transition-colors duration-300">LVL {currentLevel} // {score} XP</span>
                    </div>
                    <ChevronRight className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 text-[#a18a5d] group-hover:text-[#e8d299] group-hover:translate-x-2 transition-all shrink-0" />
                  </button>
                )}
                <button type="button" onClick={handleNewGame} className="group relative flex items-center justify-between p-5 sm:p-6 border border-[#4e574d] bg-[#080a0a] hover:border-[#a3ad82]/70 hover:bg-[#0c0e0d] transition-all duration-300 overflow-hidden text-left">
                  <span className="relative z-10 tracking-[0.15em] sm:tracking-[0.2em] text-sm sm:text-base text-[#8c9187] group-hover:text-[#c4c5bc] transition-colors duration-300 font-bold">INITIALIZE NEW INVESTIGATION</span>
                  <ChevronRight className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 text-[#656a62] group-hover:text-[#a3ad82] group-hover:translate-x-2 transition-all shrink-0" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 sm:gap-5 border-l-4 border-[#956b59] bg-[#140c0a]/50 pl-5 sm:pl-6 py-4 pr-4">
                <div className="flex items-center gap-3 text-[#9a7061]">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse shrink-0" />
                  <span className="tracking-widest font-bold text-xs sm:text-sm uppercase">WARNING: DATA OVERRIDE</span>
                </div>
                <p className="text-xs sm:text-sm text-[#777a72] leading-relaxed tracking-wide">Starting a new investigation will erase all currently saved progress, collected evidence, and clearance levels. This action cannot be undone.</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3 sm:mt-5">
                  <button type="button" onClick={confirmReset} className="w-full sm:w-auto px-5 sm:px-6 py-3.5 bg-[#180f0c] border border-[#76584f]/60 text-[#a47766] hover:bg-[#261611] hover:border-[#946b5b] transition-colors text-xs sm:text-sm tracking-widest font-bold text-center uppercase">CONFIRM PURGE</button>
                  <button type="button" onClick={() => { playClick(); setShowResetWarning(false); }} className="w-full sm:w-auto px-5 sm:px-6 py-3.5 border border-[#414740] bg-[#080a0a] text-[#686d65] hover:bg-[#101310] hover:text-[#9a9d94] transition-colors text-xs sm:text-sm tracking-widest text-center uppercase">CANCEL</button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {appState === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-full z-20 relative">
            <IntroCinematic onComplete={() => { setHasSeenIntro(); setAppState('playing'); }} />
          </motion.div>
        )}

        {appState === 'playing' && (
          <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="w-full h-full z-20 relative">
            <MainLayout onReturnToMenu={() => setAppState('menu')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;