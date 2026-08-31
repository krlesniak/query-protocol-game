import { motion } from 'framer-motion';
import { Database, X, KeyRound, Link2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';
import { useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { SCHEMA_RELATIONS, SCHEMA_TABLES, type SchemaField, type SchemaTable } from '../../db/schemaData';

interface SchemaModalProps {
  tableCount: number;
  onClose: () => void;
}

const TABLE_WIDTH = 290;
const TABLE_HEADER = 44;
const ROW_HEIGHT = 30;

type Position = { x: number; y: number; };

const POSITIONS: Record<string, Position> = {
  employees: { x: 500, y: 80 },
  locations: { x: 900, y: 80 },
  access_logs: { x: 100, y: 350 },
  messages: { x: 500, y: 440 },
  incidents: { x: 900, y: 390 },
  audit_logs: { x: 100, y: 730 },
  internal_projects: { x: 500, y: 820 },
  infrastructure_nodes: { x: 900, y: 700 },
};

const getFieldIndex = (table: SchemaTable, fieldName: string) => {
  return table.fields.findIndex(field => field.name === fieldName);
};

const getFieldPoint = (table: SchemaTable, fieldName: string, side: 'left' | 'right') => {
  const position = POSITIONS[table.name];
  const fieldIndex = getFieldIndex(table, fieldName);
  const y = position.y + TABLE_HEADER + fieldIndex * ROW_HEIGHT + ROW_HEIGHT / 2;
  return { x: side === 'left' ? position.x : position.x + TABLE_WIDTH, y };
};

const getRelationPath = (fromTable: SchemaTable, toTable: SchemaTable, fromField: string, toField: string) => {
  if (fromTable.name === toTable.name) {
    const from = getFieldPoint(fromTable, fromField, 'right');
    const to = getFieldPoint(toTable, toField, 'right');
    const curve = 80;
    return `M ${from.x} ${from.y} C ${from.x + curve} ${from.y}, ${to.x + curve} ${to.y}, ${to.x} ${to.y}`;
  }

  const fromPosition = POSITIONS[fromTable.name];
  const toPosition = POSITIONS[toTable.name];
  const fromOnRight = fromPosition.x < toPosition.x;
  
  const from = getFieldPoint(fromTable, fromField, fromOnRight ? 'right' : 'left');
  const to = getFieldPoint(toTable, toField, fromOnRight ? 'left' : 'right');
  
  const distance = Math.abs(to.x - from.x);
  const curve = Math.max(60, Math.min(180, distance * 0.35));
  const direction = to.x >= from.x ? 1 : -1;

  return `M ${from.x} ${from.y} C ${from.x + curve * direction} ${from.y}, ${to.x - curve * direction} ${to.y}, ${to.x} ${to.y}`;
};

const FieldRow = ({ field }: { field: SchemaField }) => (
  <div className={`h-[30px] flex items-center border-t border-[#303630] px-3 font-mono text-[10px] tracking-widest ${field.fk ? 'bg-[#0c0e0d]' : ''} hover:bg-[#121512] transition-colors`}>
    <div className="w-8 shrink-0 flex items-center">
      {field.pk && <span title="Primary Key" className="text-[#806d4b] font-bold">PK</span>}
      {!field.pk && field.fk && <span title="Foreign Key" className="text-[#a3ad82] font-bold">FK</span>}
    </div>
    <div className={`flex-1 truncate ${field.pk ? 'text-[#c0a66d] font-bold' : field.fk ? 'text-[#d4d6c8]' : 'text-[#8c9187]'}`}>{field.name}</div>
    <div className="text-[#555a53] text-[9px] ml-2 shrink-0">{field.type}</div>
  </div>
);

const TableNode = ({ table }: { table: SchemaTable }) => {
  const position = POSITIONS[table.name];
  return (
    <div className="absolute w-[290px] bg-[#090c0c] border border-[#303630] shadow-[0_12px_35px_rgba(0,0,0,0.6)] overflow-hidden" style={{ left: position.x, top: position.y }}>
      <div className="h-[44px] flex items-center justify-between px-4 border-b border-[#303630] bg-[#070909]">
        <div className="flex items-center gap-3 min-w-0">
          <Database className="w-3.5 h-3.5 text-[#a3ad82] shrink-0" />
          <span className="font-mono text-[11px] font-bold tracking-[0.2em] text-[#d4d6c8] uppercase truncate">{table.name}</span>
        </div>
        <span className="font-mono text-[8px] tracking-widest text-[#555a53] shrink-0">TABLE</span>
      </div>
      <div>{table.fields.map(field => <FieldRow key={field.name} field={field} />)}</div>
    </div>
  );
};

export const SchemaModal = ({ tableCount, onClose }: SchemaModalProps) => {
  const visibleTables = useMemo(() => SCHEMA_TABLES.slice(0, Math.min(tableCount, SCHEMA_TABLES.length)), [tableCount]);
  const visibleNames = useMemo(() => new Set(visibleTables.map(t => t.name)), [visibleTables]);
  const visibleRelations = useMemo(() => SCHEMA_RELATIONS.filter(r => visibleNames.has(r.fromTable) && visibleNames.has(r.toTable)), [visibleNames]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-6" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ duration: 0.25, ease: 'easeOut' }} className="relative bg-[#090c0c] border border-[#303630] w-full sm:w-[95vw] sm:max-w-7xl h-full sm:h-[90vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* HEADER */}
        <div className="shrink-0 flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b border-[#303630] bg-[#070909] z-10">
          <div className="flex items-center gap-3 min-w-0">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3ad82] shrink-0" />
            <div className="min-w-0">
              <div className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-[#c0c2b9] uppercase truncate font-bold">NEXUS_OS // DATABASE SCHEMA</div>
              <div className="font-mono text-[8px] sm:text-[9px] tracking-[0.16em] text-[#656a63] mt-1 uppercase">RELATIONAL STRUCTURE // READ ONLY</div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 sm:p-2 bg-[#0a0d0c] border border-[#303630] text-[#656a63] hover:text-[#d4d6c8] hover:border-[#a3ad82] transition-colors shrink-0">
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* SCHEMA AREA WITH REACT-ZOOM-PAN-PINCH */}
        <div className="flex-1 relative overflow-hidden bg-[#030505] cursor-grab active:cursor-grabbing">
          <div className="absolute inset-0 pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(rgba(163,173,130,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(163,173,130,0.035) 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
          
          <TransformWrapper initialScale={0.7} minScale={0.3} maxScale={2} centerZoomedOut={false}>
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <div className="absolute top-4 right-4 z-20 flex gap-2">
                  <button onClick={() => zoomIn()} className="p-2 sm:p-3 bg-[#070909]/80 border border-[#303630] text-[#70756d] hover:text-[#a3ad82] hover:border-[#a3ad82] backdrop-blur-md transition-all rounded-none"><ZoomIn className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                  <button onClick={() => zoomOut()} className="p-2 sm:p-3 bg-[#070909]/80 border border-[#303630] text-[#70756d] hover:text-[#a3ad82] hover:border-[#a3ad82] backdrop-blur-md transition-all rounded-none"><ZoomOut className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                  <button onClick={() => resetTransform()} className="p-2 sm:p-3 bg-[#070909]/80 border border-[#303630] text-[#70756d] hover:text-[#a3ad82] hover:border-[#a3ad82] backdrop-blur-md transition-all rounded-none"><Maximize className="w-4 h-4 sm:w-5 sm:h-5" /></button>
                </div>

                <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: "1400px", height: "1200px" }}>
                  <div className="relative w-[1400px] h-[1200px]">
                    {/* SVG CONNECTIONS */}
                    <svg className="absolute inset-0 pointer-events-none overflow-visible" width="1400" height="1200">
                      {visibleRelations.map((relation, index) => {
                        const fromTable = SCHEMA_TABLES.find(t => t.name === relation.fromTable);
                        const toTable = SCHEMA_TABLES.find(t => t.name === relation.toTable);
                        if (!fromTable || !toTable) return null;

                        const fromPosition = POSITIONS[fromTable.name];
                        const toPosition = POSITIONS[toTable.name];
                        const fromOnRight = fromPosition.x < toPosition.x;
                        const from = getFieldPoint(fromTable, relation.fromField, fromTable.name === toTable.name ? 'right' : fromOnRight ? 'right' : 'left');
                        const to = getFieldPoint(toTable, relation.toField, fromTable.name === toTable.name ? 'right' : fromOnRight ? 'left' : 'right');

                        return (
                          <g key={`${relation.fromTable}-${relation.fromField}-${index}`}>
                            <path d={getRelationPath(fromTable, toTable, relation.fromField, relation.toField)} fill="none" stroke="#555a53" strokeWidth="2" opacity="0.6" />
                            <circle cx={from.x} cy={from.y} r="4" fill="#806d4b" />
                            <circle cx={to.x} cy={to.y} r="4" fill="#a3ad82" />
                          </g>
                        );
                      })}
                    </svg>

                    {/* TABLES */}
                    {visibleTables.map(table => <TableNode key={table.name} table={table} />)}
                  </div>
                </TransformComponent>
              </>
            )}
          </TransformWrapper>
        </div>

        {/* FOOTER / LEGEND */}
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 border-t border-[#303630] bg-[#070909] z-10">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-[#806d4b]" />
              <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#806d4b] uppercase">PRIMARY KEY</span>
            </div>
            <div className="flex items-center gap-2">
              <Link2 className="w-3.5 h-3.5 text-[#a3ad82]" />
              <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-[#a3ad82] uppercase">FOREIGN KEY</span>
            </div>
            <span className="hidden sm:block font-mono text-[9px] tracking-[0.15em] text-[#656a63]">LINES REPRESENT DATA RELATIONSHIPS</span>
          </div>
          <div className="font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-[#70756d] uppercase">
            <span className="text-[#d4d6c8] font-bold">{visibleTables.length}</span> TABLES
            <span className="mx-2 text-[#303630]">|</span>
            <span className="text-[#d4d6c8] font-bold">{visibleRelations.length}</span> RELATIONS
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};