import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Table as TableIcon, X, Hash, Type, LayoutList } from 'lucide-react';
import { dbService } from '../../db/DatabaseService';
import type { SqlValue } from 'sql.js';

interface TableInspectorModalProps {
  tableName: string;
  onClose: () => void;
}

export const TableInspectorModal = ({ tableName, onClose }: TableInspectorModalProps) => {
  const [columns, setColumns] = useState<{ name: string; type: string; pk: boolean }[]>([]);
  const [previewData, setPreviewData] = useState<{ cols: string[]; rows: SqlValue[][] }>({ cols: [], rows: [] });
  const [rowCount, setRowCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTableData = () => {
      try {
        const pragmaRes = dbService.execute(`PRAGMA table_info(${tableName});`);
        if (pragmaRes.length > 0) {
          const colsInfo = pragmaRes[0].values.map(val => ({
            name: String(val[1]),
            type: String(val[2]),
            pk: Boolean(val[5])
          }));
          setColumns(colsInfo);
        }

        const countRes = dbService.execute(`SELECT COUNT(*) FROM ${tableName};`);
        if (countRes.length > 0) {
          setRowCount(Number(countRes[0].values[0][0]));
        }

        const dataRes = dbService.execute(`SELECT * FROM ${tableName} LIMIT 10;`);
        if (dataRes.length > 0) {
          setPreviewData({
            cols: dataRes[0].columns,
            rows: dataRes[0].values 
          });
        }
      } catch {
        setError("Failed to inspect table structure.");
      }
    };

    loadTableData();
  }, [tableName]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} 
        className="bg-[var(--surface-1)] border border-[var(--border)] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] bg-[#131920] shrink-0">
          <div className="flex items-center gap-3">
            <TableIcon className="w-5 h-5 text-[var(--accent-bright)]" />
            <span className="font-mono text-[12px] text-[var(--accent-bright)] tracking-[0.2em] font-bold">
              NEXUS_OS // TABLE INSPECTOR
            </span>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white transition-colors bg-[var(--surface-2)] p-1 rounded-sm">
             <X className="w-5 h-5" />
          </button>
        </div>

        {error ? (
          <div className="p-8 font-mono text-red-500/80">{error}</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 bg-[#0a0d10] font-mono">
            <div className="mb-6 border-l-2 border-[var(--accent-bright)] pl-4">
              <h2 className="text-2xl text-white tracking-widest">{tableName.toUpperCase()}</h2>
              <div className="flex gap-4 mt-2 text-[12px] text-[var(--text-muted)]">
                <span className="flex items-center gap-1"><Hash className="w-3 h-3" /> TOTAL RECORDS: {rowCount}</span>
                <span className="flex items-center gap-1"><LayoutList className="w-3 h-3" /> COLUMNS: {columns.length}</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/3 border border-[var(--border)] bg-[var(--surface-1)] p-4">
                <h3 className="text-[11px] tracking-[0.1em] text-[var(--text-secondary)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2">
                  <Type className="w-4 h-4" /> SCHEMA STRUCTURE
                </h3>
                <ul className="flex flex-col gap-2">
                  {columns.map((col) => (
                    <li key={col.name} className="flex items-center justify-between text-[13px]">
                      <span className={`font-bold ${col.pk ? 'text-amber-400/80' : 'text-[var(--accent-light-grey)]'}`}>
                        {col.name} {col.pk && '(PK)'}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)] bg-[var(--surface-2)] px-2 py-0.5 rounded-sm">
                        {col.type}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:w-2/3 border border-[var(--border)] bg-[var(--surface-1)] p-4 overflow-hidden flex flex-col">
                <h3 className="text-[11px] tracking-[0.1em] text-[var(--text-secondary)] mb-4 flex items-center gap-2 border-b border-[var(--border)] pb-2 shrink-0">
                  <TableIcon className="w-4 h-4" /> DATA PREVIEW (TOP 10)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px]">
                    <thead>
                      <tr className="border-b border-[var(--border)] text-[var(--text-muted)]">
                        {previewData.cols.map((col) => (
                          <th key={col} className="p-2 font-normal whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.length > 0 ? (
                        previewData.rows.map((row, i) => (
                          <tr key={i} className="border-b border-[var(--border)] hover:bg-[var(--surface-2)] transition-colors">
                            {row.map((val, j) => (
                              <td key={j} className="p-2 whitespace-nowrap text-[var(--accent-light-grey)]">
                                {val === null ? <span className="text-red-400/50 italic">NULL</span> : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={previewData.cols.length} className="p-4 text-center text-[var(--text-muted)] italic">
                            [ TABLE IS EMPTY ]
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}
      </motion.div>
    </motion.div>
  );
};