import initSqlJs from 'sql.js';
import type { Database, QueryExecResult } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';

class DatabaseService {
  private db: Database | null = null;
  public isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const SQL = await initSqlJs({
        locateFile: () => sqlWasmUrl,
      });

      this.db = new SQL.Database();
      this.isInitialized = true;
      console.log('[System] Silnik SQLite (WASM) zainicjowany pomyślnie.');
    } catch (error) {
      console.error('[System Error] Failed to load WASM engine:', error);
      throw error;
    }
  }

  execute(query: string): QueryExecResult[] {
    if (!this.db) {
      throw new Error("Brak połączenia z bazą danych.");
    }

    try {
      const restrictedKeywords = ['DROP', 'DELETE', 'UPDATE', 'ALTER', 'INSERT'];
      const upperQuery = query.toUpperCase();
      
      if (restrictedKeywords.some(keyword => upperQuery.includes(keyword))) {
         throw new Error("ACCESS_DENIED: Naruszenie protokołu. Dozwolony tylko odczyt (SELECT).");
      }

      return this.db.exec(query);
    } catch (error) {
      console.error('[SQL Error]', error);
      throw error;
    }
  }
  
  seed(query: string) {
    if (this.db) {
        this.db.exec(query);
    }
  }
}

export const dbService = new DatabaseService();