import { useState, useRef, useEffect } from 'react';
import { dbService } from '../../db/DatabaseService';
import type { QueryExecResult } from 'sql.js';
import { AnimatePresence } from 'framer-motion';

import { useGameStore } from '../../store/gameStore';
import { LevelValidator } from '../../game/levelValidator';
import { LEVELS } from '../../game/levels';

import { Header } from './Header';
import { DatabaseSidebar } from './DatabaseSidebar';
import { MissionSidebar } from './MissionSidebar';
import { SystemLog, type LogEntry } from './SystemLog';

import { ToastNotification } from '../ui/ToastNotification';
import { LevelUpModal } from '../ui/LevelUpModal';
import { EvidenceModal } from '../ui/EvidenceModal';
import { SchemaModal } from '../ui/SchemaModal';
import { SqlEditor } from '../editor/SqlEditor';
import { SqlResults } from '../terminal/SqlResults';

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
  const { currentLevel, queryAttempts, unlockedTables, completedQueries, addScore, unlockTable, addEvidence, completeCurrentLevel, incrementQueryAttempts } = useGameStore();

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
  const [newTableFlash, setNewTableFlash] = useState<string | null>(null);
  const [toast, setToast] = useState<{ title: string; desc: string } | null>(null);
  const [showSchema, setShowSchema] = useState(false); 

  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, time: new Date().toLocaleTimeString(), msg: 'NEXUS_OS connection initialized', type: 'info' },
    { id: 2, time: new Date().toLocaleTimeString(), msg: 'Awaiting query input...', type: 'info' },
  ]);

  const logIdCounter = useRef<number>(3);
  const currentQueryDraft = useRef(initialQuery); 

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEvidence(null);
        setShowSchema(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const addLog = (msg: string, type: 'info' | 'success' | 'error' | 'warning') => {
    setLogs((prev) => [{ id: logIdCounter.current++, time: new Date().toLocaleTimeString(), msg, type }, ...prev].slice(0, 50));
  };

  const handleNavigate = (dir: 'prev' | 'next') => {
    if (viewedLevel === currentLevel) currentQueryDraft.current = query; 
    const newLevel = dir === 'prev' ? viewedLevel - 1 : viewedLevel + 1;
    setViewedLevel(newLevel);
    setQuery(newLevel === currentLevel ? currentQueryDraft.current : (completedQueries[newLevel] || `-- No history available\n`));
    setResults([]);
    setSqlError(null);
  };

  const handleNextLevel = () => {
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

      const lockedTables = Object.keys(TABLE_SCHEMA).filter(t => !unlockedTables.includes(t));
      const attemptedTable = lockedTables.find(t => new RegExp(`\\b${t}\\b`, 'i').test(sqlToRun));
      
      if (attemptedTable) {
        addLog(`[ACCESS DENIED] Attempted access to locked table '${attemptedTable}'.`, 'error');
        setSqlError(`SECURITY OVERRIDE: Access to table '${attemptedTable}' is denied. Level up to unlock.`);
        setResults([]);
        return; 
      }

      const forbiddenKeywords = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|REPLACE|CREATE)\b/i;
      if (levelData.requiredRows.length > 0 && forbiddenKeywords.test(sqlToRun)) {
        addLog(`[ACCESS DENIED] Write operations are locked.`, 'error');
        setSqlError(`SECURITY OVERRIDE: INSUFFICIENT PRIVILEGES. ACCOUNT RESTRICTED TO READ-ONLY MODE (SELECT).`);
        setResults([]);
        return; 
      }

      const res = dbService.execute(sqlToRun);
      if (viewedLevel === currentLevel) incrementQueryAttempts();

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
      
      if (validation.success) {
        if (viewedLevel === currentLevel) {
          addLog(`[SYSTEM] LEVEL COMPLETED`, 'success');
          setShowLevelUp(true);
        } else {
          addLog(`[SYSTEM] ARCHIVE QUERY VERIFIED`, 'success');
        }
      } else if (levelData.requiredRows.length > 0 || parsedResult.rows.length > 0) {
        addLog(`[ANALYZE DENIED] ${validation.message}`, 'warning');
      }

    } catch (error: unknown) {
      setResults([]);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setSqlError(errorMessage);
      addLog(`[SQL Error] ${errorMessage}`, 'error');
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[var(--bg-base)] text-[var(--text-main)] font-sans selection:bg-[var(--accent)]/20 selection:text-[var(--accent-bright)]">

      <AnimatePresence>
        {toast && <ToastNotification title={toast.title} desc={toast.desc} />}
        {showLevelUp && <LevelUpModal rewardXP={levelData.rewardXP} onNext={handleNextLevel} onClose={() => setShowLevelUp(false)} />}
        {selectedEvidence && <EvidenceModal evidenceId={selectedEvidence} onClose={() => setSelectedEvidence(null)} />}
        {showSchema && <SchemaModal tableCount={unlockedTables.length} onClose={() => setShowSchema(false)} />}
      </AnimatePresence>

      <Header onReturnToMenu={onReturnToMenu} />

      <div className="h-[calc(100vh-54px)] p-2 flex flex-col gap-2 min-h-0">
        <div className="flex-1 min-h-0 flex flex-col lg:grid lg:grid-cols-[225px_minmax(0,1fr)_300px] gap-2 overflow-y-auto lg:overflow-hidden">
          <DatabaseSidebar newTableFlash={newTableFlash} onOpenSchema={() => setShowSchema(true)} />

          <main className="min-w-0 min-h-[500px] lg:min-h-0 flex flex-col gap-2 shrink-0 lg:shrink">
            <SqlEditor query={query} setQuery={setQuery} onRunQuery={handleRunQuery} viewedLevel={viewedLevel} currentLevel={currentLevel} onNavigate={handleNavigate} />
            <SqlResults results={results} sqlError={sqlError} execTime={execTime} />
          </main>

          <MissionSidebar onLog={addLog} onOpenEvidence={setSelectedEvidence} viewedLevel={viewedLevel} />
        </div>

        <SystemLog logs={logs} />
      </div>
    </div>
  );
};