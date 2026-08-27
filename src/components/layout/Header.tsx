import { Terminal, Activity, Wifi, Clock3, LogOut, Settings } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface HeaderProps {
  onReturnToMenu: () => void;
  onOpenSettings: () => void;
}

export const Header = ({ onReturnToMenu, onOpenSettings }: HeaderProps) => {
  const { score } = useGameStore();

  return (
    <header className="h-14 shrink-0 border-b border-[var(--border)] bg-[var(--surface-1)] flex items-center justify-between px-3 sm:px-5">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="text-[var(--accent)] shrink-0">
          <Terminal className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={3.7} />
        </div>

        <div className="flex items-baseline gap-6 min-w-0">
          <button 
            onClick={onReturnToMenu}
            className="font-mono text-[15px] sm:text-[18px] tracking-wide text-[var(--text-main)] font-bold hover:text-[var(--accent-bright)] transition-colors duration-200 truncate"
          >
            Query Protocol
          </button>
          
          <div className="hidden md:flex items-center gap-4 font-mono text-[12px] text-[var(--text-muted)]">
            <span>NEXUS_OS // SESSION 03</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5 font-mono text-[11px] sm:text-[12px] text-[var(--text-muted)] shrink-0">
        
        {/* XP */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Activity className="w-3 h-3 text-[var(--accent-greeny)]" />
          <span> XP </span>
          <span className="text-[var(--accent-bright)] font-bold">{score}</span>
        </div>
        
        {/* LINK */}
        <div className="hidden sm:flex items-center gap-1.5">
          <Wifi className="w-3 h-3 text-[var(--accent-greeny)]" />
          <span>LINK</span>
          <span className="text-[var(--accent-secondary)]">SECURE</span>
        </div>
        
        {/* CLOCK */}
        <div className="hidden md:flex items-center gap-1.5">
          <Clock3 className="w-3 h-3 text-[var(--accent-greeny)]" />
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        
        {/* ACTION BUTTONS */}
        <div className="border-l border-[var(--border)] pl-3 sm:pl-5 ml-0 sm:ml-1 flex items-center gap-3 sm:gap-4">
          
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--accent-bright)] transition-colors duration-200"
            title="System Preferences"
          >
            <Settings className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>

          <button 
            onClick={onReturnToMenu}
            className="flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-red-400 transition-colors duration-200"
            title="Disconnect"
          >
            <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline tracking-widest">DISCONNECT</span>
          </button>
        </div>
      </div>
    </header>
  );
};