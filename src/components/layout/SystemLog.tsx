import { motion, AnimatePresence } from 'framer-motion';

export type LogEntry = {
  id: number;
  time: string;
  msg: string;
  type: 'info' | 'success' | 'error' | 'warning';
};

interface SystemLogProps {
  logs: LogEntry[];
}

export const SystemLog = ({ logs }: SystemLogProps) => {
  return (
    <footer className="h-44 shrink-0 bg-[var(--surface-1)] border border-[var(--border)] font-mono overflow-hidden flex flex-col">
      <div className="h-8 border-b border-[var(--border)] px-6 py-3 flex items-center justify-between shrink-0 shadow-sm z-10">
        <span className="text-[11px] tracking-widest text-[var(--text-muted)]">SYSTEM LOG</span>
        <span className="text-[11px] text-[var(--accent)]">● ONLINE</span>
      </div>

      <div className="px-4 py-2 text-[12px] leading-5 overflow-y-auto flex-1 flex flex-col-reverse">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}
              className="flex hover:bg-[var(--surface-2)] transition-colors px-2 rounded-sm"
            >
              <span className="text-[var(--text-faint)] w-[65px] shrink-0 mr-4">[{log.time}]</span>
              <span className={log.type === 'error' ? 'text-[var(--error)]' : log.type === 'success' ? 'text-[var(--accent)]' : log.type === 'warning' ? 'text-[var(--warning)]' : 'text-[var(--text-secondary)]'}>
                {log.msg}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </footer>
  );
};