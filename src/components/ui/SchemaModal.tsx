import { motion } from 'framer-motion';
import { Database, X } from 'lucide-react';

interface SchemaModalProps {
  tableCount: number;
  onClose: () => void;
}

export const SchemaModal = ({ tableCount, onClose }: SchemaModalProps) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
    className="absolute inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4"
    onClick={onClose}
  >
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} 
      className="bg-[var(--surface-1)] border border-[var(--border)] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[var(--border)] bg-[#131920]">
        <div className="flex items-center gap-2 sm:gap-3">
          <Database className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-bright)] shrink-0" />
          <span className="font-mono text-[10px] sm:text-[12px] text-[var(--accent-bright)] tracking-[0.1em] sm:tracking-[0.2em] font-bold truncate">
            NEXUS_OS // DATABASE SCHEMA V{Math.min(tableCount, 8)}.0
          </span>
        </div>
        <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white transition-colors bg-[var(--surface-2)] p-1 rounded-sm shrink-0">
           <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      
      <div className="flex-1 bg-[#0a0d10] relative flex items-center justify-center p-4 sm:p-8 min-h-[300px] sm:min-h-[400px] overflow-auto">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        <img 
          src={`/assets/schema/schema${Math.min(tableCount, 8)}.png`} 
          alt="Database Schema" 
          className="max-w-full max-h-full object-contain relative z-10 border border-white/5 shadow-2xl"
        />
      </div>
    </motion.div>
  </motion.div>
);