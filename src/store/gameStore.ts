import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface GameState {
  currentLevel: number;
  score: number;
  unlockedTables: string[];
  collectedEvidence: string[];
  completedLevels: number[];
  usedHints: Record<number, number[]>;
  queryAttempts: number;
  completedQueries: Record<number, string>; // <-- NOWE: Zapisane zapytania

  addScore: (points: number) => void;
  setCurrentLevel: (level: number) => void;
  unlockTable: (tableName: string) => void;
  addEvidence: (evidenceId: string) => void;
  completeLevel: (levelId: number) => void;
  completeCurrentLevel: (successfulQuery: string) => void; // <-- NOWE: Przyjmuje zapytanie
  resetGame: () => void;
  
  applyHint: (levelId: number, hintId: number, cost: number) => void;
  incrementQueryAttempts: () => void;

  isTableUnlocked: (tableName: string) => boolean;
  hasEvidence: (evidenceId: string) => boolean;
  isLevelCompleted: (levelId: number) => boolean;
}

const initialState = {
  currentLevel: 1,
  score: 0,
  unlockedTables: ['employees'],
  collectedEvidence: [],
  completedLevels: [],
  usedHints: {},
  queryAttempts: 0,
  completedQueries: {},
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addScore: (points: number) =>
        set((state) => ({
          score: Math.max(0, state.score + points),
        })),

      setCurrentLevel: (level: number) =>
        set({ currentLevel: level }),

      unlockTable: (tableName: string) =>
        set((state) => ({
          unlockedTables: state.unlockedTables.includes(tableName)
            ? state.unlockedTables
            : [...state.unlockedTables, tableName],
        })),

      addEvidence: (evidenceId: string) =>
        set((state) => ({
          collectedEvidence: state.collectedEvidence.includes(evidenceId)
            ? state.collectedEvidence
            : [...state.collectedEvidence, evidenceId],
        })),

      completeLevel: (levelId: number) =>
        set((state) => ({
          completedLevels: state.completedLevels.includes(levelId)
            ? state.completedLevels
            : [...state.completedLevels, levelId],
        })),

      // ZMODYFIKOWANA FUNKCJA
      completeCurrentLevel: (successfulQuery: string) =>
        set((state) => {
          const newCompletedLevels = state.completedLevels.includes(state.currentLevel)
            ? state.completedLevels
            : [...state.completedLevels, state.currentLevel];

          return {
            completedLevels: newCompletedLevels,
            completedQueries: { ...state.completedQueries, [state.currentLevel]: successfulQuery },
            currentLevel: state.currentLevel + 1,
            queryAttempts: 0, 
          };
        }),

      applyHint: (levelId: number, hintId: number, cost: number) =>
        set((state) => {
          const levelHints = state.usedHints[levelId] || [];
          if (levelHints.includes(hintId)) return state;
          if (state.score < cost) return state;

          return {
            usedHints: { ...state.usedHints, [levelId]: [...levelHints, hintId] },
            score: state.score - cost, 
          };
        }),

      incrementQueryAttempts: () => set((state) => ({ queryAttempts: state.queryAttempts + 1 })),

      resetGame: () => set(initialState),

      isTableUnlocked: (tableName: string) => get().unlockedTables.includes(tableName),
      hasEvidence: (evidenceId: string) => get().collectedEvidence.includes(evidenceId),
      isLevelCompleted: (levelId: number) => get().completedLevels.includes(levelId),
    }),
    {
      name: 'query-protocol-game',
    }
  )
);