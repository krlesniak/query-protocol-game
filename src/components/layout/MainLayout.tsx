import { useState, useRef, useEffect } from 'react';
import { Terminal, Play, ShieldAlert, Image as ImageIcon, X, ChevronRight, ChevronLeft } from 'lucide-react';
import Editor, { type OnMount } from '@monaco-editor/react';
import { dbService } from '../../db/DatabaseService';
import type { QueryExecResult } from 'sql.js';
import type { editor as MonacoEditorTypes } from 'monaco-editor';
import { motion, AnimatePresence } from 'framer-motion';

import { useGameStore } from '../../store/gameStore';
import { LevelValidator } from '../../game/levelValidator';
import { LEVELS } from '../../game/levels';
import { EVIDENCE_DB } from '../../game/evidence';

import { Header } from './Header';
import { DatabaseSidebar } from './DatabaseSidebar';
import { MissionSidebar } from './MissionSidebar';
import { SystemLog, type LogEntry } from './SystemLog';

const TABLE_SCHEMA: Record<string, string[]> = {
  employees: ['id', 'username', 'full_name', 'department', 'pos', 'clearance_level', 'status', 'assigned_location_id'],
  locations: ['id', 'name', 'sector', 'security_level'],
  access_logs: ['id', 'employee_id', 'location_id', 'action', 'created_at', 'access_granted'],
  messages: ['id', 'sender_id', 'receiver_id', 'created_at', 'subject', 'body', 'is_encrypted'],
  incidents: ['id', 'location_id', 'created_at', 'severity', 'description'],
};

interface MainLayoutProps {
  onReturnToMenu: () => void;
}

export const MainLayout = ({ onReturnToMenu }: MainLayoutProps) => {
  const { 
    currentLevel, queryAttempts, unlockedTables, completedQueries,
    addScore, unlockTable, addEvidence, completeCurrentLevel, resetGame, incrementQueryAttempts 
  } = useGameStore();

  const [viewedLevel, setViewedLevel] = useState(currentLevel);
  const levelData = LEVELS.find(l => l.id === viewedLevel) || LEVELS[LEVELS.length - 1];

  const initialQuery = (() => {
    if (currentLevel > 1 && !completedQueries[currentLevel]) {
      return `-- Protocol LVL_${currentLevel.toString().padStart(2, '0')}\n`;
    }
    return completedQueries[currentLevel] || `-- Protocol LVL_${currentLevel.toString().padStart(2, '0')}\n`;
  })();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<QueryExecResult[]>([]);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [execTime, setExecTime] = useState(0);
  
  const [showLevelUp, setShowLevelUp] = useState(false); 
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [newTableFlash, setNewTableFlash] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; desc: string } | null>(null);

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, time: new Date().toLocaleTimeString(), msg: 'NEXUS_OS connection initialized', type: 'info' },
    { id: 2, time: new Date().toLocaleTimeString(), msg: 'Awaiting query input...', type: 'info' },
  ]);

  const editorRef = useRef<MonacoEditorTypes.IStandaloneCodeEditor | null>(null);
  const queryHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  const logIdCounter = useRef<number>(3);
  
  // Zachowujemy to co gracz pisał przed przełączeniem levelu
  const currentQueryDraft = useRef(initialQuery); 

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedEvidence(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'warning') => {
    setLogs((prev) => [{ id: logIdCounter.current++, time: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 50));
  };

  const handleReset = () => {
    if(window.confirm("WARNING: Are you sure you want to reset all investigation progress?")) {
      resetGame();
      
      setViewedLevel(1);
      setQuery(`-- Protocol LVL_01\n`);
      currentQueryDraft.current = `-- Protocol LVL_01\n`;
      
      setResults([]);
      setSqlError(null);
      queryHistory.current = [];
      addLog("[System] System rebooted. Progress wiped.", "warning");
    }
  };

  // NAWIGACJA STRZAŁKAMI PO ARCHIWALNYCH POZIOMACH
  const handleNavigate = (dir: 'prev' | 'next') => {
    if (viewedLevel === currentLevel) {
      currentQueryDraft.current = query; 
    }
    const newLevel = dir === 'prev' ? viewedLevel - 1 : viewedLevel + 1;
    setViewedLevel(newLevel);
    
    if (newLevel === currentLevel) {
      setQuery(currentQueryDraft.current);
    } else {
      setQuery(completedQueries[newLevel] || `-- No history available\n`);
    }
    setResults([]);
    setSqlError(null);
  };

  const handleNextLevel = () => {
    setShowLevelUp(false);
    
    const efficiencyBonus = queryAttempts <= 3 ? 50 : 0;
    const totalReward = levelData.rewardXP + efficiencyBonus;

    addScore(totalReward);
    addLog(`[SYSTEM] Protocol completed. Reward: +${levelData.rewardXP} XP`, 'success');
    if (efficiencyBonus > 0) addLog(`[SYSTEM] Efficiency Bonus (Attempts: ${queryAttempts}): +${efficiencyBonus} XP`, 'info');

    if (levelData.unlocksTable) {
      unlockTable(levelData.unlocksTable);
      setNewTableFlash(levelData.unlocksTable);
      addLog(`[NEW ASSET] New table unlocked: ${levelData.unlocksTable.toUpperCase()}`, 'warning');
      setTimeout(() => setNewTableFlash(null), 3000);
    }
    if (levelData.unlocksEvidence) {
      addEvidence(levelData.unlocksEvidence);
      const evData = EVIDENCE_DB[levelData.unlocksEvidence];
      setToast({ title: 'EVIDENCE ACQUIRED', desc: evData ? evData.title : 'New case file added.' });
      addLog(`[EVIDENCE] New evidence secured.`, 'warning');
      setTimeout(() => setToast(null), 4000);
    }

    completeCurrentLevel(query); 


    const nextLevel = currentLevel + 1;
    setViewedLevel(nextLevel);
    const initial = `-- Protocol LVL_${nextLevel.toString().padStart(2, '0')}\n`;
    setQuery(initial);
    currentQueryDraft.current = initial;
    setResults([]);
    setSqlError(null);
  };

  const handleRunQuery = (sqlToRun: string) => {
    const startTime = performance.now();
    try {
      addLog(`Executing query...`, 'info');

      // --- SQL FIREWALL ---
      const lockedTables = Object.keys(TABLE_SCHEMA).filter(t => !unlockedTables.includes(t));
      const attemptedTable = lockedTables.find(t => new RegExp(`\\b${t}\\b`, 'i').test(sqlToRun));
      
      if (attemptedTable) {
        addLog(`[ACCESS DENIED] Attempted access to locked table '${attemptedTable}'.`, 'error');
        setSqlError(`SECURITY OVERRIDE: Access to table '${attemptedTable}' is denied. Level up to unlock.`);
        setResults([]);
        return; 
      }

      const res = dbService.execute(sqlToRun);
      
      if (viewedLevel === currentLevel) {
        incrementQueryAttempts();
      }

      if (queryHistory.current[queryHistory.current.length - 1] !== sqlToRun) {
        queryHistory.current.push(sqlToRun);
      }
      historyIndex.current = queryHistory.current.length;

      const endTime = performance.now();
      const timeMs = Math.round(endTime - startTime);

      setExecTime(timeMs);
      setResults(res);
      setSqlError(null);

      const rowCount = res.length > 0 ? res[0].values.length : 0;
      addLog(`Query executed successfully: ${rowCount} rows found (${timeMs}ms)`, 'success');

      if (res.length > 0) {
        const parsedResult = {
          columns: res[0].columns,
          rows: res[0].values.map(row => {
            const rowObj: Record<string, unknown> = {};
            res[0].columns.forEach((col, i) => rowObj[col] = row[i]);
            return rowObj;
          })
        };
        const validation = LevelValidator.validate(parsedResult, levelData.requiredRows, levelData.maxRows);

        if (validation.success) {
          if (viewedLevel === currentLevel) {
            addLog(`[SYSTEM] LEVEL COMPLETED: ${levelData.title}`, 'success');
            setShowLevelUp(true);
          } else {
            addLog(`[SYSTEM] ARCHIVE QUERY VERIFIED: Saved query is working correctly.`, 'success');
          }
        } else {
          addLog(`[ANALYZE DENIED] ${validation.message}`, 'warning');
        }
      }

    } catch (error: unknown) {
      setResults([]);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSqlError(errorMessage);
      addLog(`[SQL Error] ${errorMessage}`, 'error');
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme('obsidian-custom-theme', {
    base: 'vs-dark',
    inherit: true,

    rules: [
        // SQL keywords (SELECT, FROM, WHERE) — wyrazisty, lodowy błękit (zamiast fioletu)
        { token: 'keyword', foreground: '66B2FF', fontStyle: 'bold' },
        { token: 'keyword.sql', foreground: '66B2FF', fontStyle: 'bold' },

        // Nazwy tabel i kolumn — jasny, bardzo czytelny szaro-biały
        { token: 'identifier', foreground: 'D1D9E0' },
        { token: 'identifier.sql', foreground: 'D1D9E0' },

        // Stringi — jaskrawy, terminalowy zielony (idealnie pasuje do klimatu)
        { token: 'string', foreground: '8BD49C' },
        { token: 'string.sql', foreground: '8BD49C' },
        { token: 'string.quote.sql', foreground: '8BD49C' },

        // Liczby — wyraźny, ostry żółty
        { token: 'number', foreground: 'F0C674' },
        { token: 'number.sql', foreground: 'F0C674' },

        // Operatory (=, <>, >=) — stonowany niebiesko-szary
        { token: 'operator', foreground: '88A4B8' },
        { token: 'operator.sql', foreground: '88A4B8' },

        // Komentarze — rozjaśniony szary (nie znikną w czarnym tle)
        { token: 'comment', foreground: '7A8B99', fontStyle: 'italic' },
        { token: 'comment.sql', foreground: '7A8B99', fontStyle: 'italic' },

        // Nawiasy / separatory
        { token: 'delimiter', foreground: '9BA8B5' },
        { token: 'delimiter.sql', foreground: '9BA8B5' },

        // NULL / TRUE / FALSE — stonowany, ale widoczny pomarańcz
        { token: 'constant', foreground: 'E59B76' },
        { token: 'constant.sql', foreground: 'E59B76' },
    ],

    colors: {
        // Główne tło dokładnie w klimacie strony
        'editor.background': '#0D1217',
        'editor.foreground': '#C5D4E0',

        // Aktywna linia (bardzo delikatne podświetlenie)
        'editor.lineHighlightBackground': '#141B22',
        'editor.lineHighlightBorder': '#00000000',

        // Zaznaczenie tekstu (bardziej nasycony, czytelny niebieski)
        'editor.selectionBackground': '#1D3B53',
        'editor.inactiveSelectionBackground': '#152A3B',

        // Kursor
        'editorCursor.foreground': '#8BD49C',

        // Numery linii (wystarczający kontrast, ale nie krzyczą)
        'editorLineNumber.foreground': '#4C5966',
        'editorLineNumber.activeForeground': '#8BA2B5',

        // Scrollbar (dopasowany do tła)
        'scrollbarSlider.background': '#212D38',
        'scrollbarSlider.hoverBackground': '#304152',
        'scrollbarSlider.activeBackground': '#3E556B',

        // Linie pomocnicze (wcięcia)
        'editorIndentGuide.background': '#162029',
        'editorIndentGuide.activeBackground': '#2A3C4D',

        // Nawiasy
        'editorBracketMatch.background': '#1A3B34',
        'editorBracketMatch.border': '#499373',

        // Wyszukiwanie (Find)
        'editor.findMatchBackground': '#435C3A',
        'editor.findMatchHighlightBackground': '#2C3D26',

        // Widgety Monaco (okienka z podpowiedziami)
        'editorWidget.background': '#10161C',
        'editorWidget.border': '#253340',
        'editorSuggestWidget.background': '#10161C',
        'editorSuggestWidget.border': '#253340',
        'editorSuggestWidget.selectedBackground': '#192C3D',
        'editorHoverWidget.background': '#10161C',
        'editorHoverWidget.border': '#253340',
    }
    });
    monaco.editor.setTheme('obsidian-custom-theme');

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      handleRunQuery(editor.getValue());
    });

    editor.onKeyDown((e) => {
      const pos = editor.getPosition();
      const lineCount = editor.getModel()?.getLineCount() || 1;
      
      if (e.keyCode === monaco.KeyCode.UpArrow && pos?.lineNumber === 1) {
        if (historyIndex.current > 0) {
          e.preventDefault(); 
          historyIndex.current--;
          editor.setValue(queryHistory.current[historyIndex.current]);
        }
      }
      if (e.keyCode === monaco.KeyCode.DownArrow && pos?.lineNumber === lineCount) {
        if (historyIndex.current < queryHistory.current.length - 1) {
          e.preventDefault();
          historyIndex.current++;
          editor.setValue(queryHistory.current[historyIndex.current]);
        } else if (historyIndex.current === queryHistory.current.length - 1) {
          e.preventDefault();
          historyIndex.current++;
          editor.setValue(""); 
        }
      }
    });
  };

  const columns = results.length > 0 ? results[0].columns : [];
  const rows = results.length > 0 ? results[0].values : [];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)] font-sans selection:bg-[var(--accent)]/20 selection:text-[var(--accent-bright)]">

      {/* --- EVIDENCE TOAST --- */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-[200] bg-[#1a1f24] border border-[var(--border)] border-l-4 border-l-[var(--accent-yellow)] p-5 flex items-start gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-w-[300px] pointer-events-none"
          >
            <ImageIcon className="w-6 h-6 text-[var(--accent-yellow)] shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1.5">
              <div className="font-mono text-[10px] tracking-widest text-[var(--accent-yellow)] font-bold">{toast.title}</div>
              <div className="font-mono text-[13px] text-white truncate max-w-[220px]">{toast.desc}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- LEVEL UP OVERLAY --- */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm transition-all"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} 
              className="relative bg-[var(--surface-1)] border-2 border-[var(--accent-bright)] p-10 flex flex-col items-center shadow-[0_0_80px_rgba(163,199,168,0.2)]"
            >
              <button onClick={() => setShowLevelUp(false)} className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-[var(--accent-bright)] transition-colors">
                <X className="w-6 h-6" />
              </button>
              <ShieldAlert className="w-20 h-20 text-[var(--accent-bright)] mb-6 animate-pulse" />
              <h2 className="text-4xl font-mono text-[var(--text-main)] mb-2 tracking-[0.3em]">LEVEL COMPLETED</h2>
              <p className="text-[var(--accent-bright)] font-mono tracking-widest text-lg">SECURITY CLEARANCE UPDATED</p>
              <p className="text-[var(--text-muted)] font-mono mt-6 mb-8">+ {levelData.rewardXP} XP </p>

              <button onClick={handleNextLevel} className="px-8 py-3 bg-[var(--accent-surface)] border border-[var(--accent-bright)] text-[var(--accent-bright)] font-mono tracking-widest hover:bg-[var(--accent)] hover:text-[var(--bg-base)] transition-colors flex items-center gap-3 group">
                INITIATE NEXT PROTOCOL 
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- EVIDENCE LIGHTBOX --- */}
      <AnimatePresence>
        {selectedEvidence && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            className="absolute inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedEvidence(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} 
              className="bg-[var(--surface-1)] border border-[var(--border)] w-full max-w-2xl flex flex-col shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]">
                <span className="font-mono text-[11px] text-[var(--text-secondary)] tracking-widest">CASE FILE</span>
                <button onClick={() => setSelectedEvidence(null)} className="text-[var(--text-muted)] hover:text-white transition-colors">
                   <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 flex flex-col gap-4">
                {(() => {
                  const ev = EVIDENCE_DB[selectedEvidence];
                  if (!ev) return <p className="font-mono text-[var(--error)]">FILE CORRUPTED OR NOT FOUND</p>;
                  return (
                    <>
                      <h2 className="text-xl font-mono text-[var(--text-main)] uppercase tracking-wide">{ev.title}</h2>
                      <span className="text-[10px] font-mono text-[var(--accent-yellow)] px-2 py-0.5 border border-[var(--accent-yellow)] self-start rounded-sm">{ev.type}</span>
                      
                      <div className="w-full h-48 border border-dashed border-[var(--border)] flex items-center justify-center bg-[var(--bg-base)] text-[var(--text-muted)] mt-2">
                         <ImageIcon className="w-8 h-8 opacity-50 mb-2" />
                         <span className="font-mono text-[10px] block w-full text-center">IMAGE_DATA_MISSING</span>
                      </div>

                      <p className="font-mono text-[13px] text-[var(--text-secondary)] leading-relaxed mt-4">
                        {ev.description}
                      </p>
                    </>
                  )
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header onReset={handleReset} onReturnToMenu={onReturnToMenu} />

      {/* MAIN AREA */}
      <div className="h-[calc(100vh-54px)] p-2 flex flex-col gap-2 min-h-0">
        <div className="flex-1 min-h-0 grid grid-cols-[225px_minmax(0,1fr)_300px] gap-2">

          <DatabaseSidebar newTableFlash={newTableFlash} />

          {/* CENTER: SQL EDITOR & RESULTS */}
          <main className="min-w-0 min-h-0 flex flex-col gap-2">
            
            <section className="flex-1 min-h-0 flex flex-col border border-[var(--border)] bg-[var(--surface-1)] focus-within:border-[var(--accent-muted)] transition-colors duration-200 overflow-hidden">
              <div className="h-11 border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[var(--text-muted)] text-[10px]">01</span>
                  <Terminal className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                  <span className="text-[11px] tracking-widest text-[var(--text-secondary)]">SQL CONSOLE</span>
                </div>

                {/* --- NAWIGACJA STRZAŁKAMI --- */}
                <div className="flex items-center gap-3">
                  {currentLevel > 1 && (
                    <div className="flex items-center bg-[var(--surface-2)] rounded-sm border border-[var(--border)] overflow-hidden">
                      <button
                        onClick={() => handleNavigate('prev')}
                        disabled={viewedLevel === 1}
                        className="p-1.5 hover:bg-[var(--surface-3)] text-[var(--text-secondary)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-mono text-[10px] px-2 text-[var(--text-muted)]">
                        LVL {viewedLevel}/{currentLevel}
                      </span>
                      <button
                        onClick={() => handleNavigate('next')}
                        disabled={viewedLevel === currentLevel}
                        className="p-1.5 hover:bg-[var(--surface-3)] text-[var(--text-secondary)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <motion.button 
                    whileTap={{ scale: 0.97 }}
                    onClick={() => editorRef.current && handleRunQuery(editorRef.current.getValue())} 
                    className="flex items-center gap-2 px-3 py-1.5 border border-[var(--accent-muted)] text-[var(--accent-bright)] hover:border-[var(--accent)] hover:bg-[var(--accent-surface)] font-mono text-[11px] tracking-wide transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    RUN
                    <span className="text-[var(--text-muted)]">CTRL+ENTER</span>
                  </motion.button>
                </div>
              </div>

              <div className="flex-1 overflow-hidden bg-[var(--surface-1)] py-2">
                <Editor
                  height="100%"
                  defaultLanguage="sql"
                  value={query}
                  onChange={(val) => setQuery(val || '')}
                  onMount={handleEditorDidMount}
                  options={{ minimap: { enabled: false }, fontSize: 15, fontFamily: '"JetBrains Mono", monospace', lineHeight: 22, padding: { top: 4 }, scrollBeyondLastLine: false, overviewRulerBorder: false, hideCursorInOverviewRuler: true, matchBrackets: 'always', renderLineHighlight: 'all' }}
                />
              </div>
            </section>

            <section className="flex-1 min-h-0 flex flex-col border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden">
              <div className="h-10 border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[12px] tracking-widest text-[var(--text-secondary)]">RESULT</span>
                </div>
                <span className="font-mono text-[11px] text-[var(--text-muted)]">{rows.length} ROWS · {execTime}ms</span>
              </div>

              <div className="flex-1 overflow-auto bg-[var(--surface-1)]">
                {sqlError ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-6 text-center">
                    <span className="font-mono text-[12px] tracking-widest text-[var(--error)] mb-2">QUERY FAILED</span>
                    <span className="font-mono text-[11px] text-[var(--error)] opacity-80 max-w-md">{sqlError}</span>
                  </motion.div>
                ) : rows.length === 0 ? (
                  <div className="h-full flex items-center justify-center font-mono text-[10px] text-[var(--text-muted)]">[ NO RESULTS TO DISPLAY ]</div>
                ) : (
                  <motion.table initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-left font-mono text-xs whitespace-nowrap">
                    <thead className="border-b border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface-1)] sticky top-0 z-10">
                      <tr>
                        {columns.map((col, idx) => (
                          <th key={idx} className={`px-4 py-2.5 font-normal ${idx !== 0 ? 'border-l border-[var(--border)]' : ''}`}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-[var(--border-soft)] hover:bg-[var(--surface-2)]">
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className={`px-4 py-2.5 ${cellIdx !== 0 ? 'border-l border-[var(--border-soft)]' : ''} ${cellIdx === 1 ? 'text-[var(--accent-bright)]' : 'text-[var(--text-secondary)]'}`}>
                              {cell !== null ? String(cell) : 'NULL'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </motion.table>
                )}
              </div>
            </section>
          </main>

          <MissionSidebar onLog={addLog} onOpenEvidence={setSelectedEvidence} viewedLevel={viewedLevel} />

        </div>

        <SystemLog logs={logs} />
      </div>
    </div>
  );
};