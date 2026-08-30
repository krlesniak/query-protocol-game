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
          const colsInfo = pragmaRes[0].values.map(val => ({ name: String(val[1]), type: String(val[2]), pk: Boolean(val[5]) }));
          setColumns(colsInfo);
        }
        const countRes = dbService.execute(`SELECT COUNT(*) FROM ${tableName};`);
        if (countRes.length > 0) { setRowCount(Number(countRes[0].values[0][0])); }
        const dataRes = dbService.execute(`SELECT * FROM ${tableName} LIMIT 10;`);
        if (dataRes.length > 0) { setPreviewData({ cols: dataRes[0].columns, rows: dataRes[0].values }); }
      } catch { setError("Failed to inspect table structure."); }
    };
    loadTableData();
  }, [tableName]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
      className="absolute inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.3 }}
        className="bg-[#090c0c] border border-[#303630] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-[#303630] bg-[#070909] shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <TableIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3ad82] shrink-0" />
            <span className="font-mono text-xs sm:text-sm text-[#a3ad82] tracking-[0.2em] font-bold truncate uppercase">
              NEXUS_OS // TABLE INSPECTOR
            </span>
          </div>
          <button onClick={onClose} className="text-[#656a63] hover:text-[#d4d6c8] transition-colors bg-[#0a0d0c] border border-[#303630] hover:border-[#a3ad82] p-1 rounded-none shrink-0">
             <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {error ? (
          <div className="p-6 sm:p-10 font-mono text-[#956b59] text-sm tracking-widest uppercase">{error}</div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#050707] font-mono">
            <div className="mb-6 sm:mb-8 border-l-2 border-[#806d4b] pl-4 sm:pl-5">
              <h2 className="text-xl sm:text-3xl text-[#c0c2b9] tracking-widest uppercase font-bold">{tableName}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-3 text-[10px] sm:text-xs tracking-widest text-[#70756d] uppercase">
                <span className="flex items-center gap-2"><Hash className="w-3.5 h-3.5 text-[#806d4b]" /> TOTAL RECORDS: {rowCount}</span>
                <span className="flex items-center gap-2"><LayoutList className="w-3.5 h-3.5 text-[#806d4b]" /> COLUMNS: {columns.length}</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-5 sm:gap-8">
              {/* SCHEMA STRUCTURE */}
              <div className="lg:w-1/3 border border-[#303630] bg-[#090c0c] p-4 sm:p-6 shadow-sm">
                <h3 className="text-[10px] sm:text-xs tracking-[0.15em] text-[#806d4b] mb-4 sm:mb-5 flex items-center gap-3 border-b border-[#303630] pb-3 uppercase font-bold">
                  <Type className="w-4 h-4 shrink-0" /> SCHEMA STRUCTURE
                </h3>
                <ul className="flex flex-col gap-3">
                  {columns.map((col) => (
                    <li key={col.name} className="flex items-center justify-between text-[11px] sm:text-[13px] tracking-wide">
                      <span className={`font-bold uppercase truncate mr-3 ${col.pk ? 'text-[#806d4b]' : 'text-[#b3b5ad]'}`}>
                        {col.name} {col.pk && '(PK)'}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-[#656a63] bg-[#050707] border border-[#1a1e1c] px-2 py-1 rounded-none shrink-0 tracking-widest uppercase">
                        {col.type}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DATA PREVIEW */}
              <div className="lg:w-2/3 border border-[#303630] bg-[#090c0c] p-4 sm:p-6 shadow-sm overflow-hidden flex flex-col">
                <h3 className="text-[10px] sm:text-xs tracking-[0.15em] text-[#a3ad82] mb-4 sm:mb-5 flex items-center gap-3 border-b border-[#303630] pb-3 shrink-0 uppercase font-bold">
                  <TableIcon className="w-4 h-4 shrink-0" /> DATA PREVIEW (TOP 10)
                </h3>
                <div className="overflow-x-auto pb-2">
                  <table className="w-full text-left text-[11px] sm:text-[13px] tracking-wide">
                    <thead>
                      <tr className="border-b border-[#4e574d] text-[#8c9187] uppercase">
                        {previewData.cols.map((col) => (
                          <th key={col} className="p-3 font-bold whitespace-nowrap">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.length > 0 ? (
                        previewData.rows.map((row, i) => (
                          <tr key={i} className="border-b border-[#1a1e1c] hover:bg-[#121512] transition-colors">
                            {row.map((val, j) => (
                              <td key={j} className="p-3 whitespace-nowrap text-[#b3b5ad] max-w-[150px] sm:max-w-[300px] truncate">
                                {val === null ? <span className="text-[#956b59] italic">NULL</span> : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={previewData.cols.length} className="p-6 text-center text-[#656a63] italic tracking-widest uppercase">
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