import { motion } from 'framer-motion';
import { Image as ImageIcon } from 'lucide-react';

interface ToastProps {
  title: string;
  desc: string;
}

export const ToastNotification = ({ title, desc }: ToastProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50, scale: 0.9 }} 
    animate={{ opacity: 1, y: 0, scale: 1 }} 
    exit={{ opacity: 0, y: 20, scale: 0.9 }}
    className="fixed bottom-6 sm:bottom-10 right-6 sm:right-10 z-[200] bg-[#090c0c] border border-[#303630] border-l-4 border-l-[#806d4b] p-4 sm:p-5 flex items-start gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-w-[280px] sm:min-w-[320px] pointer-events-none"
  >
    <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#806d4b] shrink-0 mt-0.5" />
    <div className="flex flex-col gap-1.5">
      <div className="font-mono text-[10px] sm:text-xs tracking-widest text-[#806d4b] font-bold uppercase">{title}</div>
      <div className="font-mono text-xs sm:text-sm text-[#d4d6c8] truncate max-w-[200px] sm:max-w-[240px]">{desc}</div>
    </div>
  </motion.div>
);