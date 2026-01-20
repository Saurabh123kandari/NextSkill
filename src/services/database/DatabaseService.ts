import SQLite from 'react-native-sqlite-storage';

// Enable promise support
SQLite.enablePromise(true);

interface DatabaseConfig {
  name: string;
  location: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private readonly config: DatabaseConfig = {
    name: 'NextSkill.db',
    location: 'default',
  };

  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase(this.config);
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        role TEXT DEFAULT 'student',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Courses table
      `CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        instructor TEXT NOT NULL,
        thumbnail_url TEXT,
        duration INTEGER DEFAULT 0,
        level TEXT DEFAULT 'beginner',
        category TEXT NOT NULL,
        rating REAL DEFAULT 0.0,
        students_count INTEGER DEFAULT 0,
        is_enrolled BOOLEAN DEFAULT FALSE,
        progress REAL DEFAULT 0.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Lessons table
      `CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT DEFAULT 'video',
        content_url TEXT,
        duration INTEGER DEFAULT 0,
        order_index INTEGER NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE,
        is_locked BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
      )`,

      // Quizzes table
      `CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        course_id INTEGER,
        lesson_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        time_limit INTEGER,
        passing_score INTEGER DEFAULT 70,
        max_attempts INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
        FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE
      )`,

      // Questions table
      `CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id INTEGER NOT NULL,
        type TEXT DEFAULT 'multiple-choice',
        question_text TEXT NOT NULL,
        options TEXT,
        correct_answer TEXT NOT NULL,
        explanation TEXT,
        points INTEGER DEFAULT 1,
        order_index INTEGER NOT NULL,
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
      )`,

      // Progress table
      `CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        course_id INTEGER,
        lesson_id INTEGER,
        quiz_id INTEGER,
        type TEXT NOT NULL,
        status TEXT DEFAULT 'not-started',
        progress_percentage REAL DEFAULT 0.0,
        time_spent INTEGER DEFAULT 0,
        last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
        FOREIGN KEY (lesson_id) REFERENCES lessons (id) ON DELETE CASCADE,
        FOREIGN KEY (quiz_id) REFERENCES quizzes (id) ON DELETE CASCADE
      )`,

      // Achievements table
      `CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        type TEXT NOT NULL,
        criteria TEXT,
        points INTEGER DEFAULT 0,
        is_unlocked BOOLEAN DEFAULT FALSE,
        unlocked_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Quiz Results table (for tracking completed quizzes)
      `CREATE TABLE IF NOT EXISTS quiz_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quiz_id TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT,
        score INTEGER NOT NULL,
        total_questions INTEGER NOT NULL,
        percentage INTEGER NOT NULL,
        passed INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
    ];

    for (const table of tables) {
      await this.db.executeSql(table);
    }
  }

  async executeQuery<T = any>(
    query: string,
    params: any[] = []
  ): Promise<T[]> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const [results] = await this.db.executeSql(query, params);
      const rows: T[] = [];

      for (let i = 0; i < results.rows.length; i++) {
        rows.push(results.rows.item(i));
      }

      return rows;
    } catch (error) {
      console.error('Query execution failed:', error);
      throw error;
    }
  }

  async executeUpdate(
    query: string,
    params: any[] = []
  ): Promise<SQLite.ResultSet> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      const [results] = await this.db.executeSql(query, params);
      return results;
    } catch (error) {
      console.error('Update execution failed:', error);
      throw error;
    }
  }

  async transaction(queries: Array<{ query: string; params?: any[] }>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    try {
      await this.db.transaction((tx) => {
        queries.forEach(({ query, params = [] }) => {
          tx.executeSql(query, params);
        });
      });
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log('Database closed');
    }
  }

  // Utility methods for common operations
  async insert(table: string, data: Record<string, any>): Promise<number> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map(() => '?').join(', ');

    const query = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    const result = await this.executeUpdate(query, values);

    return result.insertId;
  }

  async update(
    table: string,
    data: Record<string, any>,
    where: string,
    whereParams: any[] = []
  ): Promise<number> {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map(col => `${col} = ?`).join(', ');

    const query = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    const result = await this.executeUpdate(query, [...values, ...whereParams]);

    return result.rowsAffected;
  }

  async delete(table: string, where: string, whereParams: any[] = []): Promise<number> {
    const query = `DELETE FROM ${table} WHERE ${where}`;
    const result = await this.executeUpdate(query, whereParams);

    return result.rowsAffected;
  }

  async findById<T = any>(table: string, id: number): Promise<T | null> {
    const results = await this.executeQuery<T>(`SELECT * FROM ${table} WHERE id = ?`, [id]);
    return results.length > 0 ? results[0] : null;
  }

  async findAll<T = any>(table: string, orderBy?: string): Promise<T[]> {
    const query = orderBy ? `SELECT * FROM ${table} ORDER BY ${orderBy}` : `SELECT * FROM ${table}`;
    return this.executeQuery<T>(query);
  }
}

export const databaseService = new DatabaseService();
export default databaseService;
