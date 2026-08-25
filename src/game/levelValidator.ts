export class LevelValidator {
  static validate(
    result: { columns: string[]; rows: Record<string, unknown>[] } | null,
    requiredRows: Record<string, unknown>[],
    maxRows?: number
  ): { success: boolean; message: string } {
    
    if (requiredRows.length === 0) {
      if (!result || result.rows.length === 0) {
        return { success: true, message: 'QUERY EXECUTED. DATABASE MODIFIED.' };
      }
      return { success: false, message: 'QUERY REJECTED. ERROR: EXPECTED DDL/DML, RECEIVED DATA ROWS.' };
    }

    if (!result || result.rows.length === 0) {
      return { success: false, message: 'QUERY REJECTED. ERROR: EMPTY_RESULT_SET. No data matched the criteria.' };
    }

    if (maxRows && result.rows.length > maxRows) {
      return { 
        success: false, 
        message: `QUERY REJECTED. ERROR: EXCESSIVE_NOISE. Expected max ${maxRows} rows, received ${result.rows.length}. Isolate the evidence.`
      };
    }

    const expectedColumns = Object.keys(requiredRows[0]);
    if (result.columns.length !== expectedColumns.length) {
      return { 
        success: false, 
        message: `QUERY REJECTED. ERROR: COLUMN_MISMATCH. Expected ${expectedColumns.length} columns, received ${result.columns.length}.`
      };
    }

    for (const requiredRow of requiredRows) {
      const matchFound = result.rows.some((resultRow) => {
        return Object.entries(requiredRow).every(([key, value]) => {
          return resultRow[key] === value;
        });
      });

      if (!matchFound) {
        return { 
          success: false, 
          message: 'QUERY EXECUTED. ACCESS DENIED. Result does not match case parameters.' 
        };
      }
    }

    return { success: true, message: 'EVIDENCE VERIFIED. ACCESS GRANTED.' };
  }
}