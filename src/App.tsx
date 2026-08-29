import { useEffect, useState } from 'react';
import { MainLayout } from './components/layout/MainLayout';
import { IntroCinematic } from './components/intro/IntroCinematic';
import { dbService } from './db/DatabaseService';
import { useGameStore } from './store/gameStore';
import {
  Terminal,
  AlertTriangle,
  ChevronRight,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { generateDatabaseSQL } from './db/schemaGenerator';
import { useSound } from './hooks/useSound';
import { BootSequence } from './components/boot/BootSequence';
import './index.css';

type AppState =
  | 'booting'
  | 'menu'
  | 'intro'
  | 'playing';

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

const delay = (ms: number) =>
  new Promise<void>((resolve) =>
    setTimeout(resolve, ms)
  );

function App() {
  const [appState, setAppState] =
    useState<AppState>('booting');

  const [bootLogs, setBootLogs] =
    useState<string[]>([]);

  const [progress, setProgress] =
    useState(0);

  const [showResetWarning, setShowResetWarning] =
    useState(false);

  const {
    currentLevel,
    score,
    collectedEvidence,
    resetGame,
    hasSeenIntro,
    setHasSeenIntro,
    soundEnabled,
    toggleSound,
    musicVolume,
    sfxVolume,
  } = useGameStore();

  const hasProgress =
    currentLevel > 1 ||
    score > 0 ||
    collectedEvidence.length > 0;

  /*
   * Background system hum.
   */
  useSound('hum2.mp3', {
    volume: soundEnabled ? musicVolume : 0,
    loop: true,
    autoPlay: true,
  });

  const { play: playClick } = useSound(
    'mouse.mp3',
    {
      volume: soundEnabled ? sfxVolume : 0,
    }
  );

  const { play: playKeyboard } = useSound(
    'keyboard.mp3',
    {
      volume: soundEnabled ? sfxVolume : 0,
    }
  );

  const { play: playBeep } = useSound(
    'beep2.mp3',
    {
      volume: soundEnabled ? sfxVolume : 0,
    }
  );

  /*
   * SYSTEM BOOT
   */
  useEffect(() => {
    let aborted = false;

    const initializeDatabase = async () => {
      try {
        await dbService.init();

        try {
          const fullSqlScript =
            generateDatabaseSQL();

          dbService.seed(fullSqlScript);
        } catch (error) {
          console.warn(
            'Database seed failed:',
            error
          );
        }
      } catch (error) {
        console.error(
          'Database initialization failed:',
          error
        );
      }
    };

    const runVisualBoot = async () => {
      await delay(800);

      for (
        let i = 0;
        i < BOOT_LOGS.length;
        i += 1
      ) {
        if (aborted) return;

        setBootLogs((previous) => [
          ...previous,
          BOOT_LOGS[i],
        ]);

        const newProgress = Math.floor(
          ((i + 1) / BOOT_LOGS.length) * 100
        );

        setProgress(newProgress);

        playKeyboard();

        const waitTime =
          i === BOOT_LOGS.length - 1
            ? 1000
            : Math.random() * 350 + 80;

        await delay(waitTime);
      }

      if (aborted) return;

      playBeep();

      await delay(800);
    };

    const startSystem = async () => {
      try {
        await Promise.all([
          initializeDatabase(),
          runVisualBoot(),
        ]);

        if (!aborted) {
          setAppState('menu');
        }
      } catch (error) {
        console.error(
          'Critical system error:',
          error
        );
      }
    };

    startSystem();

    return () => {
      aborted = true;
    };
  }, [playBeep, playKeyboard]);

  /*
   * CONTINUE EXISTING SESSION
   */
  const handleContinue = () => {
    playClick();

    window.setTimeout(() => {
      setAppState('playing');
    }, 100);
  };

  /*
   * START GAME / INTRO
   */
  const startGameFlow = () => {
    window.setTimeout(() => {
      if (!hasSeenIntro) {
        setAppState('intro');
      } else {
        setAppState('playing');
      }
    }, 100);
  };

  /*
   * NEW INVESTIGATION
   */
  const handleNewGame = () => {
    playClick();

    if (hasProgress) {
      setShowResetWarning(true);
      return;
    }

    resetGame();
    startGameFlow();
  };

  /*
   * CONFIRM RESET
   */
  const confirmReset = () => {
    playClick();

    resetGame();
    setShowResetWarning(false);
    startGameFlow();
  };

  /*
   * SOUND TOGGLE
   */
  const handleSoundToggle = () => {
    playClick();
    toggleSound();
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        bg-[var(--bg-base)]
        flex
        items-center
        justify-center
        font-mono
        selection:bg-[var(--accent)]/30
        selection:text-[var(--accent-bright)]
        overflow-hidden
        relative
      "
    >
      {/* SOUND CONTROL */}

      {(appState === 'booting' ||
        appState === 'menu') && (
        <div className="fixed top-4 right-4 sm:top-8 sm:right-8 z-[9999]">
          <button
            type="button"
            onClick={handleSoundToggle}
            aria-label={
              soundEnabled
                ? 'Mute sound'
                : 'Enable sound'
            }
            className="
              p-2
              sm:p-3
              border
              border-[var(--border)]
              bg-[var(--surface-1)]
              text-[var(--text-secondary)]
              hover:text-[var(--accent-bright)]
              hover:border-[var(--accent)]
              transition-all
              duration-300
              group
            "
          >
            {soundEnabled ? (
              <Volume2
                className="
                  w-4
                  h-4
                  sm:w-5
                  sm:h-5
                  opacity-70
                  group-hover:opacity-100
                  transition-opacity
                "
              />
            ) : (
              <VolumeX
                className="
                  w-4
                  h-4
                  sm:w-5
                  sm:h-5
                  opacity-70
                  group-hover:opacity-100
                  transition-opacity
                "
              />
            )}
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">

        {appState === 'booting' && (
          <BootSequence
            bootLogs={bootLogs}
            progress={progress}
          />
        )}

        {appState === 'menu' && (
          <motion.div
            key="menu"
            initial={{
              opacity: 0,
              y: 10,
              filter: 'blur(10px)',
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
            }}
            exit={{
              opacity: 0,
              scale: 0.98,
              filter: 'blur(5px)',
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
            }}
            className="
              max-w-xl
              w-[calc(100%-2rem)]
              sm:w-full
              flex
              flex-col
              gap-6
              sm:gap-8
              p-6
              sm:p-10
              border
              border-[var(--border)]
              bg-[var(--surface-1)]
              shadow-2xl
              relative
              overflow-hidden
              mx-auto
            "
          >
            {/* TOP LINE */}

            <div
              className="
                absolute
                top-0
                left-0
                w-full
                h-px
                bg-[var(--accent)]
                opacity-40
              "
            />

            {/* HEADER */}

            <div
              className="
                flex
                flex-col
                gap-2
                sm:gap-3
                border-b
                border-[var(--border)]
                pb-4
                sm:pb-6
              "
            >
              <Terminal
                className="
                  w-8
                  h-8
                  sm:w-10
                  sm:h-10
                  text-[var(--accent)]
                  mb-1
                  sm:mb-2
                "
              />

              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  tracking-[0.15em]
                  sm:tracking-[0.2em]
                  font-bold
                  text-[var(--text-main)]
                  break-words
                "
              >
                QUERY_PROTOCOL
              </h1>

              <p
                className="
                  text-[var(--text-secondary)]
                  text-[10px]
                  sm:text-xs
                  tracking-widest
                  uppercase
                "
              >
                Nexus Dynamics // Authorized
                Personnel Only
              </p>
            </div>

            {/* MAIN MENU */}

            {!showResetWarning ? (
              <div className="flex flex-col gap-3 sm:gap-4">
                {/* CONTINUE */}

                {hasProgress && (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="
                      group
                      relative
                      flex
                      items-center
                      justify-between
                      p-4
                      sm:p-5
                      border
                      border-[var(--accent)]
                      bg-[var(--accent-surface)]
                      transition-all
                      duration-300
                      overflow-hidden
                      text-left
                    "
                  >
                    <div className="relative z-10 flex flex-col">
                      <span
                        className="
                          tracking-[0.15em]
                          sm:tracking-[0.2em]
                          text-xs
                          sm:text-sm
                          font-bold
                          text-[var(--accent-bright)]
                          group-hover:text-black
                          transition-colors
                          duration-300
                        "
                      >
                        CONTINUE SESSION
                      </span>

                      <span
                        className="
                          text-[9px]
                          sm:text-[10px]
                          tracking-widest
                          opacity-80
                          mt-1
                          text-[var(--accent-bright)]
                          group-hover:text-black
                          transition-colors
                          duration-300
                        "
                      >
                        LVL {currentLevel} //{' '}
                        {score} XP
                      </span>
                    </div>

                    <ChevronRight
                      className="
                        relative
                        z-10
                        w-4
                        h-4
                        sm:w-5
                        sm:h-5
                        text-[var(--accent-bright)]
                        group-hover:text-black
                        group-hover:translate-x-2
                        transition-all
                        shrink-0
                      "
                    />

                    <div
                      className="
                        absolute
                        inset-0
                        bg-[var(--accent)]
                        scale-x-0
                        group-hover:scale-x-100
                        origin-left
                        transition-transform
                        duration-300
                        ease-out
                        z-0
                      "
                    />
                  </button>
                )}

                {/* NEW GAME */}

                <button
                  type="button"
                  onClick={handleNewGame}
                  className="
                    group
                    relative
                    flex
                    items-center
                    justify-between
                    p-4
                    sm:p-5
                    border
                    border-[var(--border)]
                    bg-transparent
                    transition-all
                    duration-300
                    overflow-hidden
                    text-left
                  "
                >
                  <span
                    className="
                      relative
                      z-10
                      tracking-[0.15em]
                      sm:tracking-[0.2em]
                      text-xs
                      sm:text-sm
                      text-[var(--text-secondary)]
                      group-hover:text-black
                      transition-colors
                      duration-300
                      font-bold
                    "
                  >
                    INITIALIZE NEW INVESTIGATION
                  </span>

                  <ChevronRight
                    className="
                      relative
                      z-10
                      w-4
                      h-4
                      sm:w-5
                      sm:h-5
                      text-[var(--text-secondary)]
                      group-hover:text-black
                      group-hover:translate-x-2
                      transition-all
                      shrink-0
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-[var(--text-main)]
                      scale-x-0
                      group-hover:scale-x-100
                      origin-left
                      transition-transform
                      duration-300
                      ease-out
                      z-0
                    "
                  />
                </button>
              </div>
            ) : (
              /* RESET WARNING */

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  sm:gap-4
                  border-l-2
                  border-[var(--error)]
                  pl-4
                  sm:pl-5
                  py-2
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    sm:gap-3
                    text-[var(--error)]
                  "
                >
                  <AlertTriangle
                    className="
                      w-5
                      h-5
                      sm:w-6
                      sm:h-6
                      animate-pulse
                      shrink-0
                    "
                  />

                  <span
                    className="
                      tracking-widest
                      font-bold
                      text-xs
                      sm:text-sm
                    "
                  >
                    WARNING: DATA OVERRIDE
                  </span>
                </div>

                <p
                  className="
                    text-[11px]
                    sm:text-[12px]
                    text-[var(--text-secondary)]
                    leading-relaxed
                    tracking-wide
                  "
                >
                  Starting a new investigation
                  will erase all currently saved
                  progress, collected evidence, and
                  clearance levels. This action
                  cannot be undone.
                </p>

                <div
                  className="
                    flex
                    flex-col
                    sm:flex-row
                    gap-3
                    sm:gap-4
                    mt-2
                    sm:mt-4
                  "
                >
                  <button
                    type="button"
                    onClick={confirmReset}
                    className="
                      w-full
                      sm:w-auto
                      px-4
                      sm:px-5
                      py-3
                      bg-red-950/20
                      border
                      border-[var(--error)]
                      text-[var(--error)]
                      hover:bg-[var(--error)]
                      hover:text-white
                      transition-colors
                      text-[10px]
                      sm:text-xs
                      tracking-widest
                      font-bold
                      text-center
                    "
                  >
                    CONFIRM PURGE
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setShowResetWarning(false);
                    }}
                    className="
                      w-full
                      sm:w-auto
                      px-4
                      sm:px-5
                      py-3
                      border
                      border-[var(--border)]
                      text-[var(--text-secondary)]
                      hover:text-[var(--text-main)]
                      transition-colors
                      text-[10px]
                      sm:text-xs
                      tracking-widest
                      text-center
                    "
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {appState === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <IntroCinematic
              onComplete={() => {
                setHasSeenIntro();
                setAppState('playing');
              }}
            />
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
            <MainLayout
              onReturnToMenu={() =>
                setAppState('menu')
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;