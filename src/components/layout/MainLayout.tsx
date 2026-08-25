import { useState, useRef, useEffect } from 'react';
import { dbService } from '../../db/DatabaseService';
import type { QueryExecResult } from 'sql.js';
import { AnimatePresence } from 'framer-motion';
import { FolderLock } from 'lucide-react';

import { useGameStore } from '../../store/gameStore';
import { LevelValidator } from '../../game/levelValidator';
import { LEVELS } from '../../game/levels';
import { useSound } from '../../hooks/useSound';

import { Header } from './Header';
import { DatabaseSidebar } from './DatabaseSidebar';
import { MissionSidebar } from './MissionSidebar';
import { SystemLog, type LogEntry } from './SystemLog';

import { ToastNotification } from '../ui/ToastNotification';
import { LevelUpModal } from '../ui/LevelUpModal';
import { EvidenceModal } from '../ui/EvidenceModal';
import { SchemaModal } from '../ui/SchemaModal';
import { CaseFileModal } from '../ui/CaseFileModal';
import { SqlEditor } from '../editor/SqlEditor';
import { SqlResults } from '../terminal/SqlResults';
import { TableInspectorModal } from '../ui/TableInspectorModal';
import { ActTransition } from '../ui/ActTransition';
import { FinalProtocol } from '../ui/FinalProtocol';
import { OutroCinematic } from '../intro/OutroCinematic';
import { CaseClosed } from '../ui/CaseClosed';

const TABLE_SCHEMA: Record<string, string[]> = {
  employees: ['id', 'username', 'full_name', 'department', 'pos', 'clearance_level', 'status', 'assigned_location_id'],
  locations: ['id', 'name', 'sector', 'security_level'],
  access_logs: ['id', 'employee_id', 'location_id', 'action_type', 'created_at', 'access_granted'],
  messages: ['id', 'sender_id', 'receiver_id', 'created_at', 'subject', 'body', 'is_encrypted'],
  incidents: ['id', 'location_id', 'created_at', 'severity', 'description'],
  audit_logs: ['id', 'employee_id', 'triggered_by', 'action', 'target', 'created_at'],
  internal_projects: ['id', 'project_code', 'lead_id'],
  infrastructure_nodes: ['id', 'node_name', 'parent_id', 'linked_sibling_id'],
};

export const MainLayout = ({ onReturnToMenu }: { onReturnToMenu: () => void }) => {
  const { 
    currentLevel, 
    queryAttempts, 
    unlockedTables, 
    completedQueries, 
    completedLevels,
    addScore, 
    unlockTable, 
    addEvidence, 
    completeCurrentLevel, 
    incrementQueryAttempts,
    incrementFailedQueries,
    incrementPlayTime
  } = useGameStore();

  const [viewedLevel, setViewedLevel] = useState(currentLevel);
  const levelData = LEVELS.find(l => l.id === viewedLevel) || LEVELS[LEVELS.length - 1];

  const initialQuery = (() => {
    if (currentLevel > 1 && !completedQueries[currentLevel]) return `-- Protocol LVL_${currentLevel.toString().padStart(2, '0')}\n`;
    return completedQueries[currentLevel] || `-- Protocol LVL_${currentLevel.toString().padStart(2, '0')}\n`;
  })();

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<QueryExecResult[]>([]);
  const [sqlError, setSqlError] = useState<string | null>(null);
  const [execTime, setExecTime] = useState(0);
  
  const [showLevelUp, setShowLevelUp] = useState(false); 
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null);
  const [showCaseFile, setShowCaseFile] = useState(false); 
  const [newTableFlash, setNewTableFlash] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; desc: string } | null>(null);
  const [showSchema, setShowSchema] = useState(false);
  const [inspectedTable, setInspectedTable] = useState<string | null>(null);
  const [activeTransition, setActiveTransition] = useState<number | null>(
    currentLevel === 1 && completedLevels.length === 0 ? 0 : null
  );
  const [showFinalProtocol, setShowFinalProtocol] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const [showStats, setShowStats] = useState(false);
  

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, time: new Date().toLocaleTimeString(), msg: 'NEXUS_OS connection initialized', type: 'info' },
    { id: 2, time: new Date().toLocaleTimeString(), msg: 'Awaiting query input...', type: 'info' },
  ]);

  const logIdCounter = useRef<number>(3);
  const currentQueryDraft = useRef(initialQuery); 

  useSound('hum2.mp3', { volume: 0.05, loop: true, autoPlay: true });
  const { play: playClick } = useSound('mouse.mp3', { volume: 0.3 });
  const { play: playRun } = useSound('beep2.mp3', { volume: 0.5 });
  const { play: playSuccess } = useSound('success.mp3', { volume: 0.5 }); 

  useEffect(() => {
    const timer = setInterval(() => {
      incrementPlayTime();
    }, 1000);
    return () => clearInterval(timer);
  }, [incrementPlayTime]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedEvidence || showSchema || showCaseFile || inspectedTable) {
          playClick();
        }
        setSelectedEvidence(null);
        setShowSchema(false);
        setShowCaseFile(false); 
        setInspectedTable(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedEvidence, showSchema, showCaseFile, inspectedTable, playClick]);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'warning') => {
    setLogs((prev) => [{ id: logIdCounter.current++, time: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 50));
  };

  const handleNavigate = (dir: 'prev' | 'next') => {
    playClick();
    if (viewedLevel === currentLevel) currentQueryDraft.current = query; 
    const newLevel = dir === 'prev' ? viewedLevel - 1 : viewedLevel + 1;
    setViewedLevel(newLevel);
    setQuery(newLevel === currentLevel ? currentQueryDraft.current : (completedQueries[newLevel] || `-- No history available\n`));
    setResults([]);
    setSqlError(null);
  };

  const handleNextLevel = () => {
    playClick();
    setShowLevelUp(false);
    
    const efficiencyBonus = queryAttempts <= 5 ? 50 : (queryAttempts <= 10 ? 25 : 0);
    
    addScore(levelData.rewardXP + efficiencyBonus);
    addLog(`[SYSTEM] Protocol completed. Reward: +${levelData.rewardXP} XP`, 'success');
    addLog(efficiencyBonus > 0 ? `[SYSTEM] Efficiency Bonus: +${efficiencyBonus} XP` : `[SYSTEM] High attempt rate. Bonus denied.`, efficiencyBonus > 0 ? 'info' : 'warning');

    if (levelData.unlocksTable) {
      const tablesToUnlock = Array.isArray(levelData.unlocksTable) ? levelData.unlocksTable : [levelData.unlocksTable];
      tablesToUnlock.forEach(table => {
        unlockTable(table);
        addLog(`[NEW ASSET] New table unlocked: ${table.toUpperCase()}`, 'warning');
      });
      setNewTableFlash(tablesToUnlock[0]);
      setTimeout(() => setNewTableFlash(null), 3000);
    }
    
    if (levelData.unlocksEvidence) {
      addEvidence(levelData.unlocksEvidence);
      setToast({ title: 'EVIDENCE ACQUIRED', desc: 'New case file added to database.' });
      addLog(`[EVIDENCE] New evidence secured.`, 'warning');
      setTimeout(() => setToast(null), 4000);
    }

    completeCurrentLevel(query); 
    const nextLevel = currentLevel + 1;
    
    if ([5, 10, 15, 20, 25, 29].includes(currentLevel)) {
      setActiveTransition(currentLevel);
    } else {
      proceedToLevel(nextLevel);
    }
  };

  const proceedToLevel = (nextLevel: number) => {
    setViewedLevel(nextLevel);
    const initial = `-- Protocol LVL_${nextLevel.toString().padStart(2, '0')}\n`;
    setQuery(initial);
    currentQueryDraft.current = initial;
    setResults([]);
    setSqlError(null);
  };

  const handleRunQuery = (sqlToRun: string) => {
    playRun();
    if (viewedLevel === currentLevel) incrementQueryAttempts();
    
    const startTime = performance.now();
    try {
      addLog(`Executing query...`, 'info');

      const lockedTables = Object.keys(TABLE_SCHEMA).filter(t => !unlockedTables.includes(t));
      const attemptedTable = lockedTables.find(t => new RegExp(`\\b${t}\\b`, 'i').test(sqlToRun));
      
      if (attemptedTable) {
        playRun();
        if (viewedLevel === currentLevel) incrementFailedQueries();
        addLog(`[ACCESS DENIED] Attempted access to locked table '${attemptedTable}'.`, 'error');
        setSqlError(`SECURITY OVERRIDE: Access to table '${attemptedTable}' is denied. Level up to unlock.`);
        setResults([]);
        return; 
      }

      const forbiddenKeywords = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|REPLACE|CREATE)\b/i;
      if (levelData.requiredRows.length > 0 && forbiddenKeywords.test(sqlToRun)) {
        playRun();
        if (viewedLevel === currentLevel) incrementFailedQueries();
        addLog(`[ACCESS DENIED] Write operations are locked.`, 'error');
        setSqlError(`SECURITY OVERRIDE: INSUFFICIENT PRIVILEGES. ACCOUNT RESTRICTED TO READ-ONLY MODE (SELECT).`);
        setResults([]);
        return; 
      }

      const res = dbService.execute(sqlToRun);

      const timeMs = Math.round(performance.now() - startTime);
      setExecTime(timeMs);
      setResults(res);
      setSqlError(null);

      const parsedResult = res.length > 0 ? {
        columns: res[0].columns,
        rows: res[0].values.map(row => {
          const rowObj: Record<string, unknown> = {};
          res[0].columns.forEach((col, i) => rowObj[col] = row[i]);
          return rowObj;
        })
      } : { columns: [], rows: [] };

      addLog(`Query executed successfully: ${parsedResult.rows.length} rows found (${timeMs}ms)`, 'success');

      const validation = LevelValidator.validate(parsedResult, levelData.requiredRows, levelData.maxRows);
      
      const upperQuery = sqlToRun.toUpperCase();
      const hasRequiredKeywords = levelData.requiredKeywords 
        ? levelData.requiredKeywords.every(keyword => upperQuery.includes(keyword.toUpperCase())) 
        : true;
      
      if (validation.success && hasRequiredKeywords) {
        if (currentLevel === 30 && viewedLevel === 30) {
          playRun();
          addLog(`[SYSTEM] CRITICAL ANOMALY DETECTED. CONNECTION UNSTABLE.`, 'error');
          setShowFinalProtocol(true);
        } else {
          playSuccess();
          if (viewedLevel === currentLevel) {
            addLog(`[SYSTEM] LEVEL COMPLETED`, 'success');
            setShowLevelUp(true);
          } else {
            addLog(`[SYSTEM] ARCHIVE QUERY VERIFIED`, 'success');
          }
        }
      } else if (validation.success && !hasRequiredKeywords) {
        playRun();
        if (viewedLevel === currentLevel) incrementFailedQueries();
        
        const missing = levelData.requiredKeywords?.filter(k => !upperQuery.includes(k.toUpperCase())) || [];
        const errorMsg = `RESULT MATCHES, BUT LOGIC IS INCOMPLETE. REQUIRED SYNTAX MISSING: ${missing.join(', ')}`;
        
        addLog(`[ANALYZE DENIED] Missing query logic.`, 'warning');
        setSqlError(errorMsg);
      } else {
        playRun();
        if (viewedLevel === currentLevel) incrementFailedQueries();
        if (levelData.requiredRows.length > 0 || parsedResult.rows.length > 0) {
          addLog(`[ANALYZE DENIED] ${validation.message}`, 'warning');
        }
      }

    } catch (error: unknown) {
      playRun();
      if (viewedLevel === currentLevel) incrementFailedQueries();
      setResults([]);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSqlError(errorMessage);
      addLog(`[SQL Error] ${errorMessage}`, 'error');
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)] font-sans selection:bg-[var(--accent)]/20 selection:text-[var(--accent-bright)]">

      <AnimatePresence>
        {toast && <ToastNotification key="toast" title={toast.title} desc={toast.desc} />}
        
        {activeTransition !== null && (
          <ActTransition 
            key="act-transition" 
            levelCompleted={activeTransition} 
            onComplete={() => {
              const finishedLevel = activeTransition;
              setActiveTransition(null);
              if (finishedLevel > 0) {
                proceedToLevel(finishedLevel + 1); 
              }
            }} 
          />
        )}

        {showFinalProtocol && !showOutro && !showStats && (
          <FinalProtocol 
            key="final-protocol"
            onComplete={() => {
              setShowOutro(true);
            }} 
          />
        )}

        {showOutro && !showStats && (
          <OutroCinematic 
            key="outro-cinematic"
            onComplete={() => {
              setShowStats(true); 
            }} 
          />
        )}

        {/* STATISTICS */}
        {showStats && (
          <CaseClosed 
            key="case-closed" 
            onReturnToMenu={() => { 
              playClick(); 
              onReturnToMenu(); 
            }} 
          />
        )}
        
        {showLevelUp && <LevelUpModal key="levelup" rewardXP={levelData.rewardXP} onNext={handleNextLevel} onClose={() => setShowLevelUp(false)} />}
        {showCaseFile && <CaseFileModal key="casefile" onClose={() => { playClick(); setShowCaseFile(false); }} onOpenEvidence={(id) => { playClick(); setSelectedEvidence(id); }} />}
        {selectedEvidence && <EvidenceModal key="evidence" evidenceId={selectedEvidence} onClose={() => { playClick(); setSelectedEvidence(null); }} />}
        {showSchema && <SchemaModal key="schema" tableCount={unlockedTables.length} onClose={() => { playClick(); setShowSchema(false); }} />}
        {inspectedTable && <TableInspectorModal key="inspector" tableName={inspectedTable} onClose={() => { playClick(); setInspectedTable(null); }} />}
      </AnimatePresence>

      <Header onReturnToMenu={() => { playClick(); onReturnToMenu(); }} />

      <div className="h-[calc(100vh-54px)] p-2 flex flex-col gap-2 min-h-0">
        <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[225px_minmax(0,1fr)_300px] gap-2 overflow-y-auto lg:overflow-hidden">
          <DatabaseSidebar 
            newTableFlash={newTableFlash} 
            onOpenSchema={() => { playClick(); setShowSchema(true); }} 
            onInspectTable={(tableName) => { playClick(); setInspectedTable(tableName); }}
          />

          <main className="min-w-0 min-h-[500px] lg:min-h-0 flex flex-col gap-2 shrink-0 lg:shrink">
            <SqlEditor query={query} setQuery={setQuery} onRunQuery={handleRunQuery} viewedLevel={viewedLevel} currentLevel={currentLevel} onNavigate={handleNavigate} />
            <SqlResults results={results} sqlError={sqlError} execTime={execTime} />
          </main>

          <div className="flex flex-col gap-2 min-h-0 shrink-0 lg:shrink">
            <button 
              onClick={() => { playClick(); setShowCaseFile(true); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#131920] border border-[var(--border)] hover:border-[var(--accent-muted)] hover:bg-[var(--surface-2)] text-[var(--accent-bright)] transition-all font-mono text-[11px] tracking-[0.2em] uppercase shadow-sm shrink-0"
            >
              <FolderLock className="w-4 h-4" />
              CASE FILE
            </button>
            <MissionSidebar onLog={addLog} onOpenEvidence={(id) => { playClick(); setSelectedEvidence(id); }} viewedLevel={viewedLevel} />
          </div>

        </div>

        <SystemLog logs={logs} />
      </div>
    </div>
  );
};