import { useState } from 'react';
import { Database, Lock, ChevronRight } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { motion, AnimatePresence } from 'framer-motion';

const TABLE_SCHEMA: Record<string, string[]> = {
  employees: ['id', 'username', 'full_name', 'department', 'pos', 'clearance_level', 'status', 'assigned_location_id'],
  locations: ['id', 'name', 'sector', 'security_level'],
  access_logs: ['id', 'employee_id', 'location_id', 'action', 'created_at', 'access_granted'],
  messages: ['id', 'sender_id', 'receiver_id', 'created_at', 'subject', 'body', 'is_encrypted'],
  incidents: ['id', 'location_id', 'created_at', 'severity', 'description'],
};

interface DatabaseSidebarProps {
  newTableFlash: string | null;
}

export const DatabaseSidebar = ({ newTableFlash }: DatabaseSidebarProps) => {
  const { unlockedTables } = useGameStore();
  const [expandedTables, setExpandedTables] = useState<string[]>(['employees']);

  const toggleTable = (tableName: string) => {
    setExpandedTables(prev =>
      prev.includes(tableName) ? prev.filter(t => t !== tableName) : [...prev, tableName]
    );
  };

  return (
    <aside className="bg-[var(--surface-1)] border border-[var(--border)] flex flex-col min-h-0 overflow-hidden">
      <div className="h-11 px-4 border-b border-[var(--border)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          <span className="font-mono text-[11px] tracking-widest text-[var(--text-secondary)]">DATABASE</span>
        </div>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">SQLITE</span>
      </div>

      <div className="p-2 overflow-y-auto font-mono text-xs">
        {unlockedTables.map((tableName) => {
          const isExpanded = expandedTables.includes(tableName);
          const isNew = newTableFlash === tableName;
          const columns = TABLE_SCHEMA[tableName] || ['id', '...'];

          return (
            <div key={tableName} className="mb-1">
              <motion.div
                animate={isNew ? { backgroundColor: 'var(--surface-2)' } : {}}
                transition={{ duration: 0.2 }}
                onClick={() => toggleTable(tableName)}
                className={`flex items-center gap-1.5 px-2 py-2 border-l-2 cursor-pointer transition-colors ${isNew ? 'border-[var(--accent-bright)] text-[var(--accent-bright)]' : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface-2)] text-[var(--text-main)]'}`}
              >
                <ChevronRight className={`w-3 h-3 text-[var(--text-secondary)] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                <span>{tableName}</span>
                {isNew ? (
                  <span className="ml-auto text-[9px] text-[var(--accent-bright)]">NEW</span>
                ) : (
                  <span className="ml-auto text-[10px] text-[var(--text-muted)]">TABLE</span>
                )}
              </motion.div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-5 py-1 overflow-hidden"
                  >
                    {columns.map((col, index) => {
                      const isLast = index === columns.length - 1;
                      return (
                        <div key={col} className="relative flex items-center px-4 py-1.5 text-[var(--text-secondary)] hover:text-[var(--text-main)] cursor-pointer">
                          <div className={`absolute left-0 top-0 w-[1px] bg-[var(--border)] ${isLast ? 'h-1/2' : 'h-full'}`} />
                          <div className="absolute left-0 top-1/2 w-3 h-[1px] bg-[var(--border)]" />
                          <span className="ml-1">{col}</span>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
        <div className="my-3 border-t border-[var(--border)]" />
        <div className="flex items-center gap-2 px-2 py-2 text-[var(--text-muted)] cursor-not-allowed">
          <Lock className="w-3 h-3 text-[var(--error)] opacity-80" />
          <span>classified_data</span>
          <span className="ml-auto text-[10px] text-[var(--error)] opacity-80">LOCKED</span>
        </div>
      </div>

      <div className="mt-auto border-t border-[var(--border)] px-3 py-2 font-mono text-[11px] text-[var(--text-muted)] bg-[var(--bg-base)]">
        <div className="flex justify-between">
          <span>TABLES</span>
          <span>{unlockedTables.length} / 5</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>STATUS</span>
          <span className="text-[var(--accent-bright)]">READY</span>
        </div>
      </div>
    </aside>
  );
};