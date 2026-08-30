import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

interface BootSequenceProps {
  bootLogs: string[];
  progress: number;
}

const INITIAL_ASCII_MAP = [
  ' <--- SECURE UPLINK ---> ',
  '                         ',
  ' [NODE_01]       [NODE_02]',
  '                         ',
  '                         ',
  '                         ',
  ' [NODE_03]       [NODE_04]',
  '                         ',
  ' STATUS: STANDBY          ',
  ' ENCRYPTION: PENDING      ',
];

const FINAL_ASCII_MAP = [
  ' <--- SECURE UPLINK ---> ',
  '                         ',
  ' [NODE_01] ═════ [NODE_02]',
  '     ║    \\          ║   ',
  '     ║      \\        ║   ',
  '     ║        \\      ║   ',
  ' [NODE_03] ═════ [NODE_04]',
  '                         ',
  ' STATUS: CONNECTED       ',
  ' ENCRYPTION: AES-256-GCM ',
];

const SCANNING_CHARS = ['.', '*', '+', ' ', ':', '-'];

const createScanningMap = (): string[] => {
  const randomChar = () => SCANNING_CHARS[Math.floor(Math.random() * SCANNING_CHARS.length)];
  return [
    ' <... SCANNING NODES ...> ',
    '                         ',
    ` [NODE_01] ${randomChar()} ${randomChar()} ${randomChar()} [NODE_02]`,
    `     ${randomChar()}    ${randomChar()}          ${randomChar()}   `,
    `     ${randomChar()}      ${randomChar()}        ${randomChar()}   `,
    `     ${randomChar()}        ${randomChar()}      ${randomChar()}   `,
    ` [NODE_03] ${randomChar()} ${randomChar()} ${randomChar()} [NODE_04]`,
    '                         ',
    ' STATUS: ROUTING...       ',
    ' ENCRYPTION: PENDING      ',
  ];
};

export const BootSequence = ({ bootLogs, progress }: BootSequenceProps) => {
  const [asciiMap, setAsciiMap] = useState<string[]>(INITIAL_ASCII_MAP);
  const totalBlocks = 20;
  const filledBlocks = useMemo(() => Math.floor((Math.min(progress, 100) / 100) * totalBlocks), [progress]);

  useEffect(() => {
    if (progress >= 100) return;
    const interval = window.setInterval(() => {
      setAsciiMap(createScanningMap());
    }, 140);
    return () => window.clearInterval(interval);
  }, [progress]);

  const displayMap = progress >= 100 ? FINAL_ASCII_MAP : asciiMap;

  return (
    <motion.div
      key="booting"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: 'brightness(1.35) blur(3px)' }}
      transition={{ duration: 0.55, ease: 'easeIn' }}
      className="w-full h-full max-w-6xl mx-auto p-5 sm:p-10 lg:p-14 flex flex-col lg:flex-row justify-between gap-8 lg:gap-12 text-[#b3b5ad] tracking-widest leading-relaxed overflow-hidden relative z-10"
    >
      {/* LEFT COLUMN */}
      <div className="flex-1 flex flex-col justify-end gap-6 sm:gap-8 min-w-0">
        
        {/* SYSTEM HEADER */}
        <div className="flex items-center justify-between border-b border-[#303630] pb-3">
          <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-[#70756d]">NEXUS INTERNAL SYSTEM</span>
          <span className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#806d4b]">SECURE BOOT</span>
        </div>

        {/* TERMINAL LOGS */}
        <div className="flex flex-col justify-end items-start text-[9px] sm:text-[11px] text-left w-full min-h-[180px] sm:min-h-[220px] font-mono">
          {bootLogs.map((log, index) => {
            const isLatest = index === bootLogs.length - 1;
            const isFinal = progress >= 100 && isLatest;

            return (
              <div key={`${index}-${log}`} className={`w-full break-words leading-relaxed ${isFinal ? 'text-[#a3ad82] font-bold mt-2' : 'text-[#8c9187]'}`}>
                <span className="text-[#555a53] mr-2">[{String(index + 1).padStart(2, '0')}]</span>
                <span>{log}</span>
              </div>
            );
          })}
          {progress < 100 && <div className="animate-pulse text-[#a3ad82] mt-2">_</div>}
        </div>

        {/* STATUS */}
        <div className="flex flex-col gap-4 sm:gap-5 w-full">
          <div className="flex flex-col gap-1">
            <span className="text-[#c0c2b9] text-xs sm:text-sm tracking-[0.18em] uppercase">QUERY_PROTOCOL</span>
            <span className="text-[#70756d] text-[9px] sm:text-[10px] tracking-[0.16em] uppercase">
              {progress >= 100 ? 'SECURE ENVIRONMENT READY' : 'INITIALIZING SECURE ENVIRONMENT'}
            </span>
          </div>

          {/* PROGRESS BAR */}
          <div className="flex items-center gap-1 p-1 border border-[#303630] bg-[#070909] shadow-[0_10px_30px_rgba(0,0,0,0.5)] w-full h-7 sm:h-9" aria-label={`System loading ${progress}%`}>
            {Array.from({ length: totalBlocks }).map((_, index) => {
              const active = index < filledBlocks;
              return (
                <div
                  key={index}
                  className={`flex-1 h-full transition-all duration-150 ${active ? 'bg-[#a3ad82] shadow-[0_0_8px_rgba(163,173,130,0.3)]' : 'bg-[#1a1e1c]'}`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] text-[#70756d] tracking-[0.18em]">SYSTEM LOAD</span>
            <span className="text-[#a3ad82] text-sm sm:text-base font-bold tracking-widest">{Math.min(progress, 100)}%</span>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="hidden lg:flex w-[330px] xl:w-[360px] flex-col justify-end">
        <div className="border border-[#303630] bg-[#090c0c]/90 p-6 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.6)] backdrop-blur-sm">
          {/* Top Rule */}
          <div className="absolute top-0 left-0 w-full h-px bg-[#806d4b] opacity-40" />

          {/* Header */}
          <div className="flex justify-between items-center mb-5 border-b border-[#303630] pb-3">
            <span className="text-[11px] tracking-[0.25em] font-bold text-[#806d4b]">UPLINK_MONITOR</span>
            <span className={`text-[10px] tracking-[0.2em] ${progress < 100 ? 'text-[#656a63]' : 'text-[#a3ad82]'}`}>
              {progress < 100 ? 'SYNCING' : 'SECURE'}
            </span>
          </div>

          {/* ASCII MAP */}
          <pre className="font-mono text-[13px] leading-[1.35] tracking-[0.08em] text-[#8c9187] whitespace-pre overflow-hidden">
            {displayMap.map((line, index) => {
              const highlight = progress >= 100 && (index === 2 || index === 6);
              return (
                <div key={`${index}-${line}`} className={highlight ? 'text-[#a3ad82]' : ''}>
                  {line}
                </div>
              );
            })}
          </pre>

          {/* Footer Diagnostics */}
          <div className="mt-5 pt-3 border-t border-[#303630] flex flex-col gap-1.5 text-[8px] tracking-[0.16em] text-[#656a63]">
            <span>ROUTE: INTERNAL</span>
            <span>CHANNEL: ENCRYPTED</span>
            <span>CLEARANCE: {progress >= 100 ? 'AUTHORIZED' : 'PENDING'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};