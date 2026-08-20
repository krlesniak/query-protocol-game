export class LevelValidator {
  static validate(
    result: { columns: string[]; rows: Record<string, unknown>[] } | null,
    requiredRows: Record<string, unknown>[],
    maxRows?: number
  ): { success: boolean; message: string } {
    
    if (requiredRows.length === 0) {
      if (!result || result.rows.length === 0) {
        return { success: true, message: 'Operation completed successfully.' };
      }
      return { success: false, message: 'Expected modification of the database (DDL/DML), but the query returned data rows.' };
    }

    // sprawdzenie czy w ogóle są wyniki dla standardowych SELECTów
    if (!result || result.rows.length === 0) {
      return { success: false, message: 'The query did not return any data.' };
    }

    // sprawdzenie szumu 
    if (maxRows && result.rows.length > maxRows) {
      return { 
        success: false, 
        message: `Excessive information noise detected (${result.rows.length} results returned). Think again and isolate evidence.`
      };
    }

    const expectedColumns = Object.keys(requiredRows[0]);
    if (result.columns.length !== expectedColumns.length) {
      return { 
        success: false, 
        message: 'The number of columns returned does not match the expected number of columns for this investigation (expected: ' + expectedColumns.length + ', got: ' + result.columns.length + ').'
      };
    }

    // sprawdzenie konkretnych wartości
    for (const requiredRow of requiredRows) {
      const matchFound = result.rows.some((resultRow) => {
        return Object.entries(requiredRow).every(([key, value]) => {
          return resultRow[key] === value;
        });
      });

      if (!matchFound) {
        return { 
          success: false, 
          message: 'The data returned does not contain key evidence for this investigation or the conditions are incorrect.' 
        };
      }
    }

    return { success: true, message: 'Dane uwierzytelnione.' };
  }
}