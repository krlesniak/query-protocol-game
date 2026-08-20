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
    className="fixed bottom-10 right-10 z-[200] bg-[#1a1f24] border border-[var(--border)] border-l-4 border-l-[var(--accent-yellow)] p-5 flex items-start gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] min-w-[300px] pointer-events-none"
  >
    <ImageIcon className="w-6 h-6 text-[var(--accent-yellow)] shrink-0 mt-0.5" />
    <div className="flex flex-col gap-1.5">
      <div className="font-mono text-[10px] tracking-widest text-[var(--accent-yellow)] font-bold">{title}</div>
      <div className="font-mono text-[13px] text-white truncate max-w-[220px]">{desc}</div>
    </div>
  </motion.div>
);