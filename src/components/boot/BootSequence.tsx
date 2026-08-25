import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BootSequenceProps {
  bootLogs: string[];
  progress: number;
}

const FINAL_ASCII_MAP = [
  " <--- SECURE UPLINK ---> ",
  "                         ",
  " [NODE_01] ═════ [NODE_02]",
  "     ║    \\          ║   ",
  "     ║      \\        ║   ",
  "     ║        \\      ║   ",
  " [NODE_03] ═════ [NODE_04]",
  "                         ",
  " STATUS: CONNECTED       ",
  " ENCRYPTION: AES-256-GCM "
];

export const BootSequence = ({ bootLogs, progress }: BootSequenceProps) => {
  const [asciiMap, setAsciiMap] = useState<string[]>([
    " <... INITIALIZING ...>   ",
    "                          ",
    " [NODE_01]       [NODE_02]",
    "                          ",
    "                          ",
    "                          ",
    " [NODE_03]       [NODE_04]",
    "                          ",
    " STATUS: STANDBY          ",
    " ENCRYPTION: PENDING      "
  ]);
  
  const totalBlocks = 20;
  const filledBlocks = Math.floor((progress / 100) * totalBlocks);

  // node map animation effect
  useEffect(() => {
    if (progress === 100) return;

    const interval = setInterval(() => {
      const chars = ['.', '*', '+', ' ', ':', '-'];
      const r = () => chars[Math.floor(Math.random() * chars.length)];

      setAsciiMap([
        " <... SCANNING NODES ...> ",
        "                          ",
        ` [NODE_01] ${r()} ${r()} ${r()} [NODE_02]`,
        `     ${r()}    ${r()}          ${r()}   `,
        `     ${r()}      ${r()}        ${r()}   `,
        `     ${r()}        ${r()}      ${r()}   `,
        ` [NODE_03] ${r()} ${r()} ${r()} [NODE_04]`,
        "                          ",
        " STATUS: ROUTING...       ",
        " ENCRYPTION: PENDING      "
      ]);
    }, 90);

    return () => clearInterval(interval);
  }, [progress]);

  const displayMap = progress === 100 ? FINAL_ASCII_MAP : asciiMap;

  return (
    <motion.div 
      key="booting"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'brightness(2) blur(5px)' }}
      transition={{ duration: 0.6, ease: "easeIn" }}
      className="w-full h-full max-w-6xl p-12 flex justify-between gap-12 text-[var(--text-secondary)] tracking-widest leading-relaxed"
    >
      {/* LEFT COLUMN - LOGS AND PROGRESS BAR */}
      <div className="flex-1 flex flex-col justify-end gap-10">
        
        {/* Terminal Logs */}
        <div className="flex flex-col justify-end items-start text-[12px] text-left">
          {bootLogs.map((log, index) => (
            <div key={index} className={index === bootLogs.length - 1 && progress === 100 ? "text-[var(--accent)] font-bold mt-4 text-[14px]" : ""}>
              {log}
            </div>
          ))}
          {progress < 100 && <div className="animate-pulse text-[var(--accent)] mt-2">_</div>}
        </div>

        {/* Load Progress */}
        <div className="flex flex-col items-start gap-6 shrink-0 pb-10 w-full">
          <div className="text-[var(--text-main)] text-base tracking-[0.2em] uppercase flex flex-col items-start gap-3 text-left">
            <span>Welcome to Query Protocol</span>
            <span className="text-[var(--text-muted)] text-sm tracking-widest animate-pulse">
              {progress === 100 ? 'PROTOCOL ENGAGED.' : 'LOADING SECURE ENVIRONMENT...'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 border border-[var(--border)] bg-[var(--surface-1)] shadow-2xl">
            {Array.from({ length: totalBlocks }).map((_, index) => (
              <div 
                key={index} 
                className={`h-8 w-3.5 transition-colors duration-75 ${
                  index < filledBlocks 
                    ? 'bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]' 
                    : 'bg-[var(--surface-3)]'
                }`} 
              />
            ))}
          </div>
          
          <div className="text-[var(--accent)] text-xl font-bold tracking-widest text-left">
            {Math.min(progress, 100)}%
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - ASCII NODE MAP */}
      <div className="hidden lg:flex w-[350px] flex-col justify-end pb-10">
        <div className="border border-[var(--border)] bg-[#05090c]/50 backdrop-blur-sm p-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-40"></div>
          
          <div className="flex justify-between items-center mb-6 border-b border-[var(--border)] pb-3">
            <span className="text-[var(--accent)] text-[14px] tracking-[0.3em] font-bold">UPLINK_MONITOR</span>
            <span className={`text-[14px] tracking-widest ${progress < 100 ? 'animate-pulse text-[var(--text-secondary)]' : 'text-[var(--accent)]'}`}>
              {progress < 100 ? 'SYNCING' : 'SECURE'}
            </span>
          </div>

          {/* ASCII Node Map */}
          <pre className="font-mono text-[16px] leading-tight tracking-[0.1em] text-[var(--text-secondary)] whitespace-pre">
            {displayMap.map((line, i) => (
              <div key={i} className={progress === 100 && (i === 2 || i === 6) ? 'text-[var(--accent)]' : ''}>
                {line}
              </div>
            ))}
          </pre>
        </div>
      </div>
    </motion.div>
  );
};