import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

interface IntroCinematicProps {
  onComplete: () => void;
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const TypewriterText = ({ text, typingSpeed = 40, onComplete, className = '', silent = false, onTypeSound }: { text: string; typingSpeed?: number; onComplete?: () => void; className?: string; silent?: boolean; onTypeSound?: () => void; }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      if (text.charAt(i) !== ' ' && !silent && onTypeSound) onTypeSound();
      i++;
      if (i >= text.length) { clearInterval(timer); onComplete?.(); }
    }, typingSpeed);

    return () => clearInterval(timer);
  }, [text, typingSpeed, onComplete, silent, onTypeSound]);

  return <span className={className}>{displayed}</span>;
};

export const IntroCinematic = ({ onComplete }: IntroCinematicProps) => {
  const [phase, setPhase] = useState(0);
  const [subPhase, setSubPhase] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showSkip, setShowSkip] = useState(false);

  const isMounted = useRef(true);
  const isSkipped = useRef(false);
  const done = useRef(false);

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const keyboardAudioRef = useRef<HTMLAudioElement | null>(null);

  const serverLights = useMemo(() => Array.from({ length: 96 }, (_, i) => ({
    isNode07: i === 47,
    hasLight: i % 4 !== 0,
    shutdownDelay: ((i * 47) % 2300) / 1000,
  })), []);

  const playSound = useCallback((fileName: string, volume: number = 0.4) => {
    try {
      const audio = new Audio(`/assets/audio/${fileName}`);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch { /* ignore errors */ }
  }, []);

  const playKeyboardSound = useCallback(() => {
    try {
      if (!keyboardAudioRef.current) return;
      keyboardAudioRef.current.currentTime = 0;
      keyboardAudioRef.current.play().catch(() => {});
    } catch { /* ignore errors */ }
  }, []);

  const finishIntro = useCallback(() => {
    if (done.current) return;
    done.current = true;
    isSkipped.current = true;
    if (bgmRef.current) { bgmRef.current.pause(); bgmRef.current.currentTime = 0; }
    if (keyboardAudioRef.current) keyboardAudioRef.current.pause();
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Enter') finishIntro(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [finishIntro]);

  useEffect(() => {
    const skipTimer = setTimeout(() => { if (isMounted.current) setShowSkip(true); }, 3000);
    return () => clearTimeout(skipTimer);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    isSkipped.current = false;
    done.current = false;
    keyboardAudioRef.current = new Audio('/assets/audio/keyboard.mp3');
    keyboardAudioRef.current.volume = 0.10;

    const wait = async (ms: number) => {
      if (!isMounted.current || isSkipped.current) return false;
      await delay(ms);
      return isMounted.current && !isSkipped.current;
    };

    const triggerGlitch = (durationMs: number) => {
      if (!isMounted.current || isSkipped.current) return;
      setIsGlitching(true);
      setTimeout(() => { if (isMounted.current) setIsGlitching(false); }, durationMs);
    };

    const runTimeline = async () => {
      try {
        bgmRef.current = new Audio('/assets/audio/hum3.mp3');
        bgmRef.current.volume = 0.32;
        bgmRef.current.loop = true;
        bgmRef.current.play().catch(() => {});
      } catch { /* ignore errors */ }

      if (!(await wait(800))) return;
      setPhase(1); setSubPhase(1); 
      if (!(await wait(1300))) return;
      setSubPhase(2); 
      if (!(await wait(1700))) return;
      setSubPhase(3); playSound('beep2.mp3', 0.22); 
      if (!(await wait(450))) return;
      setSubPhase(4); playSound('beep2.mp3', 0.22); 
      if (!(await wait(450))) return;
      setSubPhase(5); playSound('beep2.mp3', 0.22); 
      if (!(await wait(450))) return;
      setSubPhase(6); playSound('beep2.mp3', 0.22); 
      if (!(await wait(450))) return;
      setSubPhase(6); playSound('beep2.mp3', 0.22); 
      setSubPhase(7); 
      if (!(await wait(1100))) return;

      setPhase(2); setSubPhase(1); 
      if (!(await wait(2100))) return;
      setSubPhase(2); playSound('glitch1.mp3', 0.025); triggerGlitch(180); 
      if (!(await wait(2500))) return;

      setPhase(3); setSubPhase(1); playSound('static.mp3', 0.055); 
      if (!(await wait(1500))) return;
      setSubPhase(2); 
      if (!(await wait(2100))) return;
      setSubPhase(3); 
      if (!(await wait(1900))) return;

      setPhase(4); setSubPhase(1); playSound('oracle_voice_1.mp3', 0.20); 
      if (!(await wait(4300))) return;
      setSubPhase(2); playSound('scene2.mp3', 0.18); 
      if (!(await wait(3000))) return;
      setSubPhase(3); playSound('oracle_voice_3.mp3', 0.20); 
      if (!(await wait(1400))) return;
      triggerGlitch(220); playSound('bass_hit.mp3', 0.45); 
      if (!(await wait(1500))) return;

      setPhase(5); setSubPhase(1); playSound('heartbeat1.mp3', 0.22); 
      if (!(await wait(8000))) return;

      setPhase(6); setSubPhase(1); 
      if (!(await wait(2100))) return;
      setSubPhase(2); playSound('beep2.mp3', 0.20); 
      if (!(await wait(2100))) return;

      setPhase(7); setSubPhase(1); playSound('beep2.mp3', 0.20); 
      if (!(await wait(1200))) return;
      setSubPhase(2); 
      if (!(await wait(1200))) return;
      setSubPhase(3); 
      if (!(await wait(2300))) return;
      playSound('bass_hit.mp3', 0.35); 
      if (!(await wait(150))) return;

      finishIntro();
    };

    runTimeline();

    return () => {
      isMounted.current = false;
      if (bgmRef.current) bgmRef.current.pause();
      if (keyboardAudioRef.current) keyboardAudioRef.current.pause();
    };
  }, [finishIntro, playSound]);

  const renderServerRoom = () => (
    <div className="absolute inset-0 overflow-hidden flex items-center justify-center opacity-60 z-0">
      <div className="server-room-scene">
        <div className="absolute inset-0 bg-[#050605]" />
        <div className="absolute inset-[7%] border border-[#56604c]/30">
          <div className="absolute inset-[3%] border border-[#3c4338]/40" />
        </div>

        {serverLights.map((rack, i) => (
          <div key={i} className={`absolute h-[14%] w-[5.2%] bg-[#080a08] border border-[#252b24] ${rack.isNode07 ? 'border-[#8a7135]/60' : ''}`} style={{ left: `${9 + (i % 12) * 7.1}%`, top: `${13 + Math.floor(i / 12) * 20}%` }}>
            <div className="absolute inset-[12%] border border-[#1b211b]" />
            {rack.hasLight && (
              <>
                <div className="absolute left-[22%] top-[28%] w-[2px] h-[2px] bg-[#87966f]/45 rounded-full" style={{ animation: `rack-status 2.8s ease-in-out infinite`, animationDelay: `${rack.shutdownDelay}s` }} />
                <div className="absolute left-[22%] top-[48%] w-[2px] h-[2px] bg-[#a17c35]/35 rounded-full" style={{ animation: `rack-status 4.2s ease-in-out infinite`, animationDelay: `${rack.shutdownDelay + 0.8}s` }} />
              </>
            )}
            {rack.isNode07 && (
              <>
                <div className="absolute inset-[-5px] border border-[#a17c35]/50" />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[6px] sm:text-[7px] tracking-widest text-[#a17c35]/80">NODE_07</div>
                <div className="absolute left-[20%] top-[28%] w-[3px] h-[3px] rounded-full bg-[#a17c35]/80" style={{ animation: 'node07-pulse 2.8s ease-in-out infinite' }} />
              </>
            )}
          </div>
        ))}

        <div className="absolute top-[8%] left-[5%] right-[5%] h-[2px] bg-[#52594c]/30" />
        <div className="absolute bottom-[9%] left-[5%] right-[5%] h-[2px] bg-[#52594c]/25" />
        <div className="absolute left-[47%] top-[9%] bottom-[9%] w-[6%] border-x border-[#626957]/15" />
        <div className="absolute right-[3%] top-[20%] w-[5%] h-[55%] border border-[#42483e]/40 bg-[#080908]">
          <div className="absolute inset-2 flex flex-col justify-around">
            <div className="border border-[#4a5145]/30 aspect-square rounded-full" />
            <div className="border border-[#4a5145]/30 aspect-square rounded-full" />
            <div className="border border-[#4a5145]/30 aspect-square rounded-full" />
          </div>
        </div>
        <div className="absolute bottom-[5%] left-[42%] w-[16%] h-[7%] border border-[#626957]/40 bg-[#090a09] flex items-center justify-center">
          <span className="text-[6px] sm:text-[8px] tracking-widest text-[#8d947e]/60">SERVER_ROOM_03</span>
        </div>
        <div className="absolute top-[43%] left-[18%] text-[6px] tracking-widest text-[#6d7663]/40">COLD AISLE</div>
        <div className="absolute top-[43%] right-[18%] text-[6px] tracking-widest text-[#6d7663]/40">COLD AISLE</div>
        <div className="absolute top-[8%] right-[8%] text-[6px] tracking-widest text-[#777d6e]/45">CCTV-03</div>
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(130,140,120,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(130,140,120,0.4)_1px,transparent_1px)] bg-[size:45px_45px]" />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[999] bg-[#030403] text-[#87966f] font-mono overflow-hidden select-none flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="pointer-events-none absolute inset-0 z-50 crt-overlay opacity-20" />
      <div className="pointer-events-none absolute inset-0 z-40 scanlines opacity-40" />
      <div className="pointer-events-none absolute inset-0 z-30 vignette" />
      <div className="pointer-events-none absolute inset-0 z-20 film-noise" />

      <div className={`relative z-10 w-full max-w-3xl text-left h-full flex flex-col justify-center transition-all ${isGlitching ? 'system-interference' : ''} ${phase === 4 ? 'unstable-system' : ''}`}>
        
        {phase === 1 && (
          <div className="text-xs sm:text-sm md:text-base tracking-widest text-[#87966f] terminal-text flex flex-col gap-1 break-words">
            {subPhase >= 1 && <TypewriterText text="NEXUS_OS v7.4.1" typingSpeed={30} onTypeSound={playKeyboardSound} />}<br />
            {subPhase >= 2 && <TypewriterText text="INITIALIZING CORE SYSTEMS..." typingSpeed={40} onTypeSound={playKeyboardSound} />}<br />
            {subPhase >= 3 && <TypewriterText text="MEMORY................ OK" typingSpeed={10} silent />}
            {subPhase >= 4 && <TypewriterText text="SECURITY KERNEL....... OK" typingSpeed={10} silent />}
            {subPhase >= 5 && <TypewriterText text="DATABASE.............. OK" typingSpeed={10} silent />}
            {subPhase >= 6 && <TypewriterText text="ACCESS CONTROL........ OK" typingSpeed={10} silent />}
            {subPhase >= 7 && <TypewriterText text="AUDIT SYSTEM.......... OK" typingSpeed={20} silent />}
            <div className="mt-2 text-[#a3ad82]/60"><span className="animate-pulse">_</span></div>
          </div>
        )}

        {phase === 2 && (
          <div className="text-xs sm:text-sm md:text-lg tracking-widest text-[#87966f] terminal-text flex flex-col gap-6">
            <div>
              {subPhase >= 1 && <TypewriterText text="LAST SYSTEM INTEGRITY CHECK" typingSpeed={40} onTypeSound={playKeyboardSound} />}<br />
              {subPhase >= 1 && <span className="opacity-50"><TypewriterText text="47 HOURS AGO" typingSpeed={50} onTypeSound={playKeyboardSound} /></span>}
            </div>
            {subPhase >= 2 && (
              <div className="text-[#a17c35] terminal-warning mt-4 border-l border-[#a17c35]/60 pl-3 sm:pl-4">
                <p className="font-bold">WARNING:</p>
                <TypewriterText text="AUDIT SYSTEM HAS NOT RESPONDED." typingSpeed={40} silent />
              </div>
            )}
          </div>
        )}

        {phase === 3 && (
          <div className="text-xs sm:text-sm md:text-lg tracking-widest text-[#87966f] terminal-text flex flex-col gap-4">
            {subPhase >= 1 && <TypewriterText text="> UNREGISTERED DATABASE EVENT" typingSpeed={30} silent />}
            {subPhase >= 2 && (
              <div className="pl-3 sm:pl-4 mt-2 flex flex-col gap-2 opacity-80 border-l border-[#87966f]/30 break-words">
                <TypewriterText text="SOURCE: ORACLE_01" typingSpeed={20} onTypeSound={playKeyboardSound} />
                <TypewriterText text="CHANNEL: INTERNAL" typingSpeed={20} silent />
                <TypewriterText text="AUTHORITY: NONE" typingSpeed={20} silent />
                <TypewriterText text="ENCRYPTION: █████████████" typingSpeed={10} silent />
              </div>
            )}
            {subPhase >= 3 && <div className="mt-6 opacity-60"><TypewriterText text="RECOVERY ATTEMPT..." typingSpeed={75} silent /></div>}
          </div>
        )}

        {phase === 4 && (
          <div className="flex flex-col items-start justify-center w-full gap-6 sm:gap-8 pl-3 sm:pl-4 border-l-2 border-[#87966f]/30">
            {subPhase >= 1 && <div className="text-base sm:text-xl md:text-3xl text-[#87966f]/75 font-normal tracking-[0.08em] sm:tracking-widest leading-relaxed"><TypewriterText text="IF YOU ARE READING THIS," typingSpeed={60} silent /><br /><TypewriterText text="I DID NOT LEAVE NEXUS." typingSpeed={70} silent /></div>}
            {subPhase >= 2 && <div className="text-base sm:text-xl md:text-3xl text-[#87966f]/75 font-normal tracking-[0.08em] sm:tracking-widest leading-relaxed"><TypewriterText text="THE LOGS WILL TELL YOU" typingSpeed={60} silent /><br /><TypewriterText text="THAT I DID." typingSpeed={70} silent /></div>}
            {subPhase >= 3 && <div className="text-base sm:text-xl md:text-3xl font-bold tracking-[0.08em] sm:tracking-widest leading-relaxed mt-2 sm:mt-4 text-[#a3ad82]"><TypewriterText text="THEY ARE LYING." typingSpeed={100} silent /></div>}
          </div>
        )}

        {phase === 5 && (
          <>
            {renderServerRoom()}
            <div className="relative z-10 w-full max-w-xl flex flex-col gap-5 sm:gap-7 bg-[#030403]/85 p-5 sm:p-7 border border-[#87966f]/20 backdrop-blur-[2px] shadow-[0_0_60px_rgba(0,0,0,0.8)]">
              <div>
                <p className="opacity-45 mb-2 text-[9px] sm:text-[10px] tracking-widest">{'>>'} LAST KNOWN LOCATION</p>
                <div className="text-lg sm:text-xl md:text-2xl text-[#a3ad82] tracking-widest"><TypewriterText text="SERVER_ROOM_03" typingSpeed={40} onTypeSound={playKeyboardSound} /></div>
                <p className="mt-1 sm:mt-2 opacity-40 text-[9px] sm:text-[10px]">TIMESTAMP: 23:47:00</p>
              </div>
              <div className="border-t border-[#87966f]/10 pt-4">
                <p className="opacity-45 mb-2 text-[9px] sm:text-[10px] tracking-widest">{'>>'} ASSOCIATED INFRASTRUCTURE</p>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[#a3ad82] tracking-widest"><TypewriterText text="NODE_07" typingSpeed={80} onTypeSound={playKeyboardSound} /></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-[9px] sm:text-[10px] tracking-widest text-[#87966f]/60">
                <div>VISIBILITY:<span className="text-[#a17c35]/80 ml-2">RESTRICTED</span></div>
                <div>NETWORK:<span className="text-[#87966f]/70 ml-2">NO RECORD</span></div>
                <div>ROUTE:<span className="text-[#a17c35]/80 ml-2">REDACTED</span></div>
                <div>STATUS:<span className="text-[#7a302b]/80 ml-2">UNVERIFIED</span></div>
              </div>
              <div className="text-[#7a302b]/80 mt-1 text-[9px] sm:text-[10px] font-bold border border-[#7a302b]/25 p-2 w-max tracking-widest"><TypewriterText text="[TRANSMISSION TERMINATED]" typingSpeed={30} silent /></div>
            </div>
          </>
        )}

        {phase === 6 && (
          <div className="text-xs sm:text-sm md:text-lg tracking-[0.12em] sm:tracking-widest text-[#87966f]/80 flex flex-col gap-4 sm:gap-6 mt-8 sm:mt-12 border-l-2 border-[#87966f]/30 pl-4 sm:pl-6 break-words">
            <div><TypewriterText text="NEXUS INTERNAL INVESTIGATION" typingSpeed={30} className="opacity-50 block" onTypeSound={playKeyboardSound} /><TypewriterText text="CASE #ORACLE-01" typingSpeed={30} className="opacity-50 block" onTypeSound={playKeyboardSound} /></div>
            <div className="mt-4 sm:mt-8"><TypewriterText text="AUTHORIZED INVESTIGATOR DETECTED." typingSpeed={40} className="text-[#a3ad82] block" onTypeSound={playKeyboardSound} /></div>
            {subPhase >= 2 && <div className="mt-2 sm:mt-4 text-base sm:text-xl md:text-2xl"><span className="opacity-60">DATABASE ACCESS: </span><span className="text-[#a3ad82] font-bold">GRANTED</span></div>}
          </div>
        )}

        {phase === 7 && (
          <div className="text-xs sm:text-sm md:text-lg tracking-[0.1em] sm:tracking-widest text-[#87966f] terminal-text flex flex-col gap-2 sm:gap-3 font-mono break-words">
            {subPhase >= 1 && <TypewriterText text="NEXUS DATABASE" typingSpeed={40} onTypeSound={playKeyboardSound} />}
            {subPhase >= 1 && <div className="opacity-50"><TypewriterText text="AUDIT_LOGS .............. OK" typingSpeed={25} silent /></div>}
            {subPhase >= 1 && <div className="opacity-50"><TypewriterText text="DATABASE ACCESS ......... GRANTED" typingSpeed={25} silent /></div>}
            {subPhase >= 2 && <div className="mt-4 sm:mt-6"><TypewriterText text="CASE: ORACLE-01" typingSpeed={35} silent /></div>}
            {subPhase >= 3 && <div className="mt-2 sm:mt-3"><TypewriterText text="> employees" typingSpeed={50} onTypeSound={playKeyboardSound} /></div>}
            {subPhase >= 3 && <div className="opacity-55"><TypewriterText text="> 258 RECORDS" typingSpeed={30} silent /></div>}
            {subPhase >= 3 && <div className="opacity-55"><TypewriterText text="> FIRST QUERY REQUIRED" typingSpeed={40} silent /></div>}
            {subPhase >= 3 && <p className="mt-2 sm:mt-4 text-[#a3ad82]">{'>'}<span className="animate-pulse">_</span></p>}
          </div>
        )}
      </div>

      {showSkip && <button onClick={finishIntro} className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 text-[#87966f]/35 hover:text-[#a3ad82] font-mono text-[10px] sm:text-xs tracking-[0.2em] transition-colors z-[100] border border-[#87966f]/15 hover:border-[#87966f]/50 px-3 py-1 bg-black/50">[ENTER] SKIP</button>}

      <style>{`.crt-overlay{background:linear-gradient(rgba(18,16,16,0) 50%,rgba(0,0,0,0.28) 50%),linear-gradient(90deg,rgba(120,120,100,0.025),rgba(120,140,100,0.018),rgba(80,70,40,0.025));background-size:100% 4px,5px 100%;}.scanlines{background:linear-gradient(to bottom,rgba(255,255,255,0),rgba(255,255,255,0) 50%,rgba(0,0,0,0.16) 50%,rgba(0,0,0,0.16));background-size:100% 4px;animation:scanline 12s linear infinite;}@keyframes scanline{0%{background-position:0 0;}100%{background-position:0 100%;}}.vignette{box-shadow:inset 0 0 180px rgba(0,0,0,0.98);}.film-noise{opacity:0.025;background-image:repeating-radial-gradient(circle at 0 0,rgba(255,255,255,0.4) 0,rgba(255,255,255,0.4) 1px,transparent 1px,transparent 3px);background-size:7px 7px;animation:noise-shift 0.18s steps(2) infinite;}@keyframes noise-shift{0%{transform:translate(0,0);}25%{transform:translate(-1px,1px);}50%{transform:translate(1px,-1px);}75%{transform:translate(1px,1px);}100%{transform:translate(0,0);}}.terminal-text{text-shadow:0 0 5px rgba(135,150,111,0.16);}.terminal-warning{text-shadow:0 0 5px rgba(161,124,53,0.12);}.system-interference{animation:analog-interference 0.18s linear infinite;}@keyframes analog-interference{0%{transform:translate(0,0);filter:none;}25%{transform:translate(-2px,0);filter:brightness(0.92);}50%{transform:translate(2px,1px);filter:brightness(1.05);}75%{transform:translate(-1px,-1px);filter:contrast(1.08);}100%{transform:translate(0,0);filter:none;}}.unstable-system{animation:unstable-shake 4.5s ease-in-out infinite;}@keyframes unstable-shake{0%,100%{transform:translate(0);}48%{transform:translate(0);}49%{transform:translate(-1px,0);}50%{transform:translate(1px,0);}51%{transform:translate(0,0);}77%{transform:translate(0);}78%{transform:translate(-1px,1px);}79%{transform:translate(0,0);}}.server-room-scene{position:relative;width:145%;height:145%;transform:perspective(900px) rotateX(4deg) scale(1.05);animation:server-room-push 12s forwards ease-in-out;background:linear-gradient(90deg,#030403 0%,#090b08 45%,#030403 100%);}@keyframes server-room-push{from{transform:perspective(900px) rotateX(4deg) scale(1.02);}to{transform:perspective(900px) rotateX(4deg) scale(1.12);}}@keyframes rack-status{0%,100%{opacity:0.25;}50%{opacity:0.65;}}@keyframes node07-pulse{0%,100%{opacity:0.35;box-shadow:0 0 2px rgba(161,124,53,0.15);}50%{opacity:0.9;box-shadow:0 0 7px rgba(161,124,53,0.35);}}@media(max-width:640px){.server-room-scene{width:180%;height:150%;}}`}</style>
    </div>
  );
};