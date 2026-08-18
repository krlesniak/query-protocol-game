import { useEffect, useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { dbService } from './db/DatabaseService';
import { useGameStore } from './store/gameStore';
import { Terminal, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateDatabaseSQL } from './db/schemaGenerator';
import './index.css';

type AppState = 'booting' | 'menu' | 'playing';

function App() {
  const [appState, setAppState] = useState<AppState>('booting');
  const [progress, setProgress] = useState(0);
  const [showResetWarning, setShowResetWarning] = useState(false);

  const { currentLevel, score, collectedEvidence, resetGame } = useGameStore();
  const hasProgress = currentLevel > 1 || score > 0 || collectedEvidence.length > 0;

  useEffect(() => {
    const startSystem = async () => {
      try {
        const progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + Math.floor(Math.random() * 8) + 2;
          });
        }, 80);

        await dbService.init();
        try { 
          const fullSqlScript = generateDatabaseSQL();
          dbService.seed(fullSqlScript); 
        } catch { /* ignore */ }

        setTimeout(() => {
          clearInterval(progressInterval);
          setProgress(100);
          setTimeout(() => setAppState('menu'), 600);
        }, 1500);
      } catch (error) {
        console.error("Critical system error:", error);
      }
    };
    startSystem();
  }, []);

  const handleContinue = () => setAppState('playing');

  const handleNewGame = () => {
    if (hasProgress) {
      setShowResetWarning(true);
    } else {
      resetGame();
      setAppState('playing');
    }
  };

  const confirmReset = () => {
    resetGame();
    setShowResetWarning(false);
    setAppState('playing');
  };

  const totalBlocks = 20;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);

  return (
    <div className="h-screen w-full bg-[var(--bg-base)] flex items-center justify-center font-mono selection:bg-transparent overflow-hidden">
      
      {/* AnimatePresence mode="wait" czeka aż stara animacja się skończy przed załadowaniem nowej */}
      <AnimatePresence mode="wait">
        {appState === 'booting' && (
          <motion.div 
            key="booting"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center gap-8 absolute"
          >
            <div className="text-[var(--text-main)] text-base tracking-[0.2em] uppercase flex flex-col items-center gap-3">
              <span>Welcome to Query Protocol</span>
              <span className="text-[var(--text-muted)] text-sm tracking-widest animate-pulse">
                {progress === 100 ? 'System Ready.' : 'Please wait...'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 p-1.5 border border-[var(--border)] bg-[var(--surface-1)] shadow-2xl">
              {Array.from({ length: totalBlocks }).map((_, index) => (
                <div key={index} className={`h-8 w-3.5 transition-colors duration-75 ${index < filledBlocks ? 'bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]' : 'bg-[var(--surface-3)]'}`} />
              ))}
            </div>
            <div className="text-[var(--accent)] text-xl font-bold tracking-widest mt-2">{Math.min(progress, 100)}%</div>
          </motion.div>
        )}

        {appState === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-xl w-full flex flex-col gap-8 p-10 border border-[var(--border)] bg-[var(--surface-1)] shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
            
            <div className="flex flex-col gap-3 border-b border-[var(--border)] pb-6 mb-2">
              <Terminal className="w-10 h-10 text-[var(--accent)] mb-2" />
              <h1 className="text-3xl tracking-[0.2em] font-bold text-[var(--text-main)]">QUERY_PROTOCOL</h1>
              <p className="text-[var(--text-secondary)] text-xs tracking-widest uppercase">Nexus Dynamics // Authorized Personnel Only</p>
            </div>

            {!showResetWarning ? (
              <div className="flex flex-col gap-4">
                {hasProgress && (
                  <button onClick={handleContinue} className="flex items-center justify-between p-4 border border-[var(--accent)] bg-[var(--accent-surface)] text-[var(--accent-bright)] hover:bg-[var(--accent)] hover:text-black transition-all duration-200 group text-left">
                    <div>
                      <div className="tracking-widest text-sm font-bold">CONTINUE SESSION</div>
                      <div className="text-[10px] opacity-80 mt-1">LVL {currentLevel} // {score} XP</div>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                )}
                
                <button onClick={handleNewGame} className="flex items-center justify-between p-4 border border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-main)] hover:text-[var(--text-main)] transition-all duration-200 group text-left">
                  <div className="tracking-widest text-sm">INITIALIZE NEW INVESTIGATION</div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 border-l-2 border-[var(--accent-light-green)] pl-5 py-2">
                <div className="flex items-center gap-3 text-[var(--accent-light-green)]">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                  <span className="tracking-widest font-bold text-sm">WARNING: DATA OVERRIDE</span>
                </div>
                <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                  Starting a new investigation will erase all currently saved progress, collected evidence, and clearance levels. This action cannot be undone.
                </p>
                <div className="flex gap-4 mt-4">
                  <button onClick={confirmReset} className="px-5 py-2.5 bg-red-950/30 border border-[var(--error)] text-[var(--error)] hover:bg-[var(--error)] hover:text-white transition-colors text-xs tracking-widest font-bold">
                    CONFIRM
                  </button>
                  <button onClick={() => setShowResetWarning(false)} className="px-5 py-2.5 border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors text-xs tracking-widest">
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {appState === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {/* Przekazujemy funkcję powrotu do MainLayout */}
            <MainLayout onReturnToMenu={() => setAppState('menu')} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;