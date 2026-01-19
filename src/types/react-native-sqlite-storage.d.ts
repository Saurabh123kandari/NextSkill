declare module 'react-native-sqlite-storage' {
  export interface SQLiteParams {
    name?: string;
    location?: string;
    createFromLocation?: number | string;
    key?: string;
    readOnly?: boolean;
  }

  export interface SQLiteDatabase {
    transaction(
      fn: (tx: SQLiteTransaction) => void,
      error?: (error: any) => void,
      success?: () => void
    ): void;
    readTransaction(
      fn: (tx: SQLiteTransaction) => void,
      error?: (error: any) => void,
      success?: () => void
    ): void;
    executeSql(
      statement: string,
      params?: any[],
      success?: (statement: SQLiteStatement, resultSet: SQLiteResultSet) => void,
      error?: (error: any) => void
    ): Promise<[SQLiteResultSet]>;
    close(): Promise<void>;
  }

  export interface SQLiteTransaction {
    executeSql(
      statement: string,
      params?: any[],
      success?: (tx: SQLiteTransaction, resultSet: SQLiteResultSet) => void,
      error?: (error: any) => void
    ): void;
  }

  export interface SQLiteStatement {
    sql: string;
  }

  export interface SQLiteResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: {
      length: number;
      item(index: number): any;
      raw(): any[];
    };
  }

  export function openDatabase(
    params: SQLiteParams,
    success?: (db: SQLiteDatabase) => void,
    error?: (error: any) => void
  ): Promise<SQLiteDatabase>;

  export function deleteDatabase(
    params: SQLiteParams,
    success?: () => void,
    error?: (error: any) => void
  ): Promise<void>;

  export function enablePromise(enabled: boolean): void;
  export function DEBUG(debug: boolean): void;
  export function echoTest(): Promise<string>;
}