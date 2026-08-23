import { Terminal, Activity, Wifi, Clock3, LogOut, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface HeaderProps {
  onReturnToMenu: () => void;
}

export const Header = ({ onReturnToMenu }: HeaderProps) => {
  const { score, soundEnabled, toggleSound } = useGameStore();

  return (
    <header className="h-14 shrink-0 border-b border-[var(--border)] bg-[var(--surface-1)] flex items-center justify-between px-5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="text-[var(--accent)]">
          <Terminal className="w-5 h-5" strokeWidth={3.7} />
        </div>

        <div className="flex items-baseline gap-6">
          <button 
            onClick={onReturnToMenu}
            className="font-mono text-[18px] tracking-wide text-[var(--text-main)] font-bold hover:text-[var(--accent-bright)] transition-colors duration-200"
          >
            query_protocol_
          </button>
          
          <div className="hidden sm:flex items-center gap-4 font-mono text-[12px] text-[var(--text-muted)]">
            <span>NEXUS_OS // SESSION 03</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-5 font-mono text-[12px] text-[var(--text-muted)]">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3 h-3 text-[var(--accent-greeny)]" />
          <span>XP</span>
          <span className="text-[var(--accent-bright)] font-bold">{score}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-[var(--accent-greeny)]" />
          <span>LINK</span>
          <span className="text-[var(--accent-secondary)]">SECURE</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <Clock3 className="w-3 h-3 text-[var(--accent-greeny)]" />
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        
        <div className="border-l border-[var(--border)] pl-5 ml-1 flex items-center gap-4">
          <button 
            onClick={toggleSound}
            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-bright)] transition-colors duration-200"
            title={soundEnabled ? "Mute Sound" : "Enable Sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-500/70" />}
          </button>

          <button 
            onClick={onReturnToMenu}
            className="hidden sm:flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-bright)] transition-colors duration-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline tracking-widest">DISCONNECT</span>
          </button>
        </div>
      </div>
    </header>
  );
};