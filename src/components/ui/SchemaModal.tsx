import { motion } from 'framer-motion';
import { Database, X } from 'lucide-react';

interface SchemaModalProps {
  tableCount: number;
  onClose: () => void;
}

export const SchemaModal = ({ tableCount, onClose }: SchemaModalProps) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
    className="absolute inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6"
    onClick={onClose}
  >
    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} 
      className="bg-[#090c0c] border border-[#303630] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.7)] overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-[#303630] bg-[#070909]">
        <div className="flex items-center gap-3 sm:gap-4">
          <Database className="w-4 h-4 sm:w-5 sm:h-5 text-[#a3ad82] shrink-0" />
          <span className="font-mono text-xs sm:text-sm text-[#a3ad82] tracking-[0.2em] font-bold truncate uppercase">
            NEXUS_OS // DATABASE SCHEMA V{Math.min(tableCount, 8)}.0
          </span>
        </div>
        <button onClick={onClose} className="text-[#656a63] hover:text-[#d4d6c8] transition-colors p-1 bg-[#0a0d0c] border border-[#303630] hover:border-[#a3ad82] rounded-none shrink-0">
           <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
      
      <div className="flex-1 bg-[#050707] relative flex items-center justify-center p-4 sm:p-8 min-h-[300px] sm:min-h-[400px] overflow-auto">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(163,173,130,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(163,173,130,0.03) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <img 
          src={`/assets/schema/schema${Math.min(tableCount, 8)}.png`} 
          alt="Database Schema" 
          className="max-w-full max-h-full object-contain relative z-10 border border-[#303630] shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
        />
      </div>
    </motion.div>
  </motion.div>
);