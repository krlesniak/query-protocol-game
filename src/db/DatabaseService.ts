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
      console.log('[System] SQLite engine initialized successfully.');
    } catch (error) {
      console.error('[System Error] Failed to load WASM engine:', error);
      throw error;
    }
  }

  execute(query: string): QueryExecResult[] {
    if (!this.db) {
      throw new Error("No database connection available.");
    }

    try {
      const restrictedKeywords = ['DROP', 'DELETE', 'UPDATE', 'ALTER', 'INSERT'];
      const upperQuery = query.toUpperCase();
      
      const queryWithoutStrings = upperQuery.replace(/'[^']*'/g, '');
      
      const isTriggerAllowed = upperQuery.includes('CREATE TRIGGER');
      
      if (!isTriggerAllowed && restrictedKeywords.some(keyword => queryWithoutStrings.includes(keyword))) {
         throw new Error("ACCESS_DENIED: Write operations are locked. Only SELECT queries are allowed.");
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