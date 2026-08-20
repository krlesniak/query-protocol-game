import { useRef, useEffect } from 'react';
import { Terminal, Play, ChevronRight, ChevronLeft } from 'lucide-react';
import Editor, { type OnMount } from '@monaco-editor/react';
import type { editor as MonacoEditorTypes } from 'monaco-editor';
import { motion } from 'framer-motion';

interface SqlEditorProps {
  query: string;
  setQuery: (val: string) => void;
  onRunQuery: (sql: string) => void;
  viewedLevel: number;
  currentLevel: number;
  onNavigate: (dir: 'prev' | 'next') => void;
}

export const SqlEditor = ({ query, setQuery, onRunQuery, viewedLevel, currentLevel, onNavigate }: SqlEditorProps) => {
  const editorRef = useRef<MonacoEditorTypes.IStandaloneCodeEditor | null>(null);
  const queryHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);
  
  const onRunQueryRef = useRef(onRunQuery);
  useEffect(() => { onRunQueryRef.current = onRunQuery; }, [onRunQuery]);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    monaco.editor.defineTheme('nexus-graphite', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'keyword', foreground: '5D8F6C', fontStyle: 'bold' },
        { token: 'keyword.sql', foreground: '5D8F6C', fontStyle: 'bold' },
        { token: 'identifier', foreground: 'D1D9E0' },
        { token: 'identifier.sql', foreground: 'D1D9E0' },
        { token: 'string', foreground: 'D2A878' },
        { token: 'string.sql', foreground: 'D2A878' },
        { token: 'string.quote.sql', foreground: 'D2A878' },
        { token: 'number', foreground: 'F0C674' },
        { token: 'number.sql', foreground: 'F0C674' },
        { token: 'operator', foreground: '88A4B8' },
        { token: 'operator.sql', foreground: '88A4B8' },
        { token: 'comment', foreground: '7A8B99', fontStyle: 'italic' },
        { token: 'comment.sql', foreground: '7A8B99', fontStyle: 'italic' },
        { token: 'delimiter', foreground: '9BA8B5' },
        { token: 'delimiter.sql', foreground: '9BA8B5' },
        { token: 'constant', foreground: 'E59B76' },
        { token: 'constant.sql', foreground: 'E59B76' },
      ],
      colors: {
        'editor.background': '#0F1115',
        'editor.foreground': '#C5D4E0',
        'editor.lineHighlightBackground': '#141B22',
        'editor.lineHighlightBorder': '#00000000',
        'editor.selectionBackground': '#1D3B53',
        'editor.inactiveSelectionBackground': '#152A3B',
        'editorCursor.foreground': '#5D8F6C',
        'editorLineNumber.foreground': '#4C5966',
        'editorLineNumber.activeForeground': '#8BA2B5',
        'scrollbarSlider.background': '#212D38',
        'scrollbarSlider.hoverBackground': '#304152',
        'scrollbarSlider.activeBackground': '#3E556B',
        'editorIndentGuide.background': '#162029',
        'editorIndentGuide.activeBackground': '#2A3C4D',
        'editorBracketMatch.background': '#1A3B34',
        'editorBracketMatch.border': '#499373',
        'editor.findMatchBackground': '#435C3A',
        'editor.findMatchHighlightBackground': '#2C3D26',
        'editorWidget.background': '#10161C',
        'editorWidget.border': '#253340',
        'editorSuggestWidget.background': '#10161C',
        'editorSuggestWidget.border': '#253340',
        'editorSuggestWidget.selectedBackground': '#192C3D',
        'editorHoverWidget.background': '#10161C',
        'editorHoverWidget.border': '#253340',
      }
    });
    monaco.editor.setTheme('nexus-graphite');

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      const currentSql = editor.getValue();
      onRunQueryRef.current(currentSql);
      
      if (queryHistory.current[queryHistory.current.length - 1] !== currentSql) {
        queryHistory.current.push(currentSql);
      }
      historyIndex.current = queryHistory.current.length;
    });

    editor.onKeyDown((e) => {
      const pos = editor.getPosition();
      const lineCount = editor.getModel()?.getLineCount() || 1;
      
      if (e.keyCode === monaco.KeyCode.UpArrow && pos?.lineNumber === 1) {
        if (historyIndex.current > 0) {
          e.preventDefault(); 
          historyIndex.current--;
          editor.setValue(queryHistory.current[historyIndex.current]);
        }
      }
      if (e.keyCode === monaco.KeyCode.DownArrow && pos?.lineNumber === lineCount) {
        if (historyIndex.current < queryHistory.current.length - 1) {
          e.preventDefault();
          historyIndex.current++;
          editor.setValue(queryHistory.current[historyIndex.current]);
        } else if (historyIndex.current === queryHistory.current.length - 1) {
          e.preventDefault();
          historyIndex.current++;
          editor.setValue(""); 
        }
      }
    });
  };

  const handleRunClick = () => {
    if (editorRef.current) {
      const currentSql = editorRef.current.getValue();
      onRunQuery(currentSql);
      if (queryHistory.current[queryHistory.current.length - 1] !== currentSql) {
        queryHistory.current.push(currentSql);
      }
      historyIndex.current = queryHistory.current.length;
    }
  };

  return (
    <section className="flex-1 min-h-0 flex flex-col border border-[var(--border)] bg-[var(--surface-1)] focus-within:border-[var(--accent-muted)] transition-colors duration-200 overflow-hidden">
      <div className="h-11 border-b border-[var(--border)] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2 font-mono">
          <span className="text-[var(--text-muted)] text-[10px]">01</span>
          <Terminal className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          <span className="text-[11px] tracking-widest text-[var(--text-secondary)]">SQL CONSOLE</span>
        </div>

        <div className="flex items-center gap-3">
          {currentLevel > 1 && (
            <div className="flex items-center bg-[var(--surface-2)] rounded-sm border border-[var(--border)] overflow-hidden">
              <button
                onClick={() => onNavigate('prev')}
                disabled={viewedLevel === 1}
                className="p-1.5 hover:bg-[var(--surface-3)] text-[var(--text-secondary)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="font-mono text-[10px] px-2 text-[var(--text-muted)]">
                LVL {viewedLevel}/{currentLevel}
              </span>
              <button
                onClick={() => onNavigate('next')}
                disabled={viewedLevel === currentLevel}
                className="p-1.5 hover:bg-[var(--surface-3)] text-[var(--text-secondary)] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          <motion.button 
            whileTap={{ scale: 0.97 }}
            onClick={handleRunClick} 
            className="flex items-center gap-2 px-3 py-1.5 border border-[var(--accent-muted)] text-[var(--accent-bright)] hover:border-[var(--accent)] hover:bg-[var(--accent-surface)] font-mono text-[11px] tracking-wide transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            RUN
            <span className="hidden sm:inline text-[var(--text-muted)]">CTRL+ENTER</span>
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden bg-[var(--surface-1)] py-2">
        <Editor
          height="100%"
          defaultLanguage="sql"
          value={query}
          onChange={(val) => setQuery(val || '')}
          onMount={handleEditorDidMount}
          options={{ minimap: { enabled: false }, fontSize: 15, fontFamily: '"JetBrains Mono", monospace', lineHeight: 22, padding: { top: 4 }, scrollBeyondLastLine: false, overviewRulerBorder: false, hideCursorInOverviewRuler: true, matchBrackets: 'always', renderLineHighlight: 'all' }}
        />
      </div>
    </section>
  );
};