// src/services/db/index.ts
import SQLite from 'react-native-sqlite-storage';

SQLite.DEBUG(true);
SQLite.enablePromise(true);

const DB_NAME = 'nextskill.db';

export async function getDBConnection() {
  return SQLite.openDatabase({ name: DB_NAME, location: 'default' });
}

export async function createTables(db: any) {
  // example table
  const query = `CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    created_at INTEGER
  );`;
  await db.executeSql(query);
}

export async function closeDB(db: any) {
  if (db) {
    await db.close();
  }
}
