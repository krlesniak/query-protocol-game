import { motion } from 'framer-motion';
import type { QueryExecResult } from 'sql.js';

interface SqlResultsProps {
  results: QueryExecResult[];
  sqlError: string | null;
  execTime: number;
}

export const SqlResults = ({ results, sqlError, execTime }: SqlResultsProps) => {
  const columns = results.length > 0 ? results[0].columns : [];
  const rows = results.length > 0 ? results[0].values : [];

  return (
    <section className="flex-1 min-h-0 flex flex-col border border-[var(--border)] bg-[var(--surface-1)] overflow-hidden">
      <div className="h-8 sm:h-10 border-b border-[var(--border)] flex items-center justify-between px-3 sm:px-4 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] sm:text-[12px] tracking-widest text-[var(--text-secondary)]">RESULT</span>
        </div>
        <span className="font-mono text-[9px] sm:text-[11px] text-[var(--text-muted)]">{rows.length} ROWS · {execTime}ms</span>
      </div>

      <div className="flex-1 overflow-auto bg-[var(--surface-1)]">
        {sqlError ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center">
            <span className="font-mono text-[10px] sm:text-[12px] tracking-widest text-[var(--error)] mb-2">QUERY FAILED</span>
            <span className="font-mono text-[10px] sm:text-[11px] text-[var(--error)] opacity-80 max-w-xs sm:max-w-md">{sqlError}</span>
          </motion.div>
        ) : rows.length === 0 ? (
          <div className="h-full flex items-center justify-center font-mono text-[9px] sm:text-[10px] text-[var(--text-muted)]">[ NO RESULTS TO DISPLAY ]</div>
        ) : (
          <motion.table initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full text-left font-mono text-[10px] sm:text-xs">
            <thead className="border-b border-[var(--border)] text-[var(--text-muted)] bg-[var(--surface-1)] sticky top-0 z-10">
              <tr>
                {columns.map((col, idx) => (
                  <th key={idx} className={`px-3 sm:px-4 py-2 sm:py-2.5 font-normal whitespace-nowrap ${idx !== 0 ? 'border-l border-[var(--border)]' : ''}`}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-[var(--border-soft)] hover:bg-[var(--surface-2)] align-top">
                  {row.map((cell, cellIdx) => (
                    <td 
                      key={cellIdx} 
                      className={`px-3 sm:px-4 py-2 sm:py-2.5 max-w-[150px] sm:max-w-[300px] break-words whitespace-pre-wrap ${cellIdx !== 0 ? 'border-l border-[var(--border-soft)]' : ''} ${cellIdx === 1 ? 'text-[var(--accent-bright)]' : 'text-[var(--text-secondary)]'}`}
                    >
                      {cell !== null ? String(cell) : <span className="italic opacity-50">NULL</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </motion.table>
        )}
      </div>
    </section>
  );
};