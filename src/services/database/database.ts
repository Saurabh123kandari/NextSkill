import SQLite from 'react-native-sqlite-storage';

// Enable promise support
SQLite.enablePromise(true);

// Types
export interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty?: string;
  level?: string;
  duration: number;
  imageUrl?: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  description: string;
  content: string;
  order: number;
  duration: number;
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
  type?: 'video' | 'text' | 'quiz';
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface UserProgress {
  id: number;
  userId: string;
  courseId: number;
  lessonId?: number;
  type: 'lesson' | 'quiz' | 'assignment';
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
  progress: number; // percentage
  timeSpent: number; // in minutes
  lastAccessed: string;
  completedAt?: string;
}

class Database {
  private db: SQLite.SQLiteDatabase | null = null;
  private readonly dbName = 'NextSkill.db';
  private readonly dbVersion = '1.0';
  private readonly dbDisplayName = 'NextSkill Database';
  private readonly dbSize = 200000;

  /**
   * Initialize database connection
   */
  async init(): Promise<void> {
    try {
      this.db = await SQLite.openDatabase({
        name: this.dbName,
        location: 'default',
      });
      await this.createTables();
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  /**
   * Create database tables
   */
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const tables = [
      // Courses table
      `CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        difficulty TEXT,
        level TEXT,
        duration INTEGER DEFAULT 0,
        imageUrl TEXT,
        thumbnail TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Lessons table
      `CREATE TABLE IF NOT EXISTS lessons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        courseId INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        content TEXT,
        order_index INTEGER NOT NULL,
        duration INTEGER DEFAULT 0,
        videoUrl TEXT,
        type TEXT DEFAULT 'video',
        isCompleted INTEGER DEFAULT 0,
        isLocked INTEGER DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (courseId) REFERENCES courses (id) ON DELETE CASCADE
      )`,

      // UserProgress table
      `CREATE TABLE IF NOT EXISTS user_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL,
        courseId INTEGER NOT NULL,
        lessonId INTEGER,
        type TEXT NOT NULL DEFAULT 'lesson',
        status TEXT NOT NULL DEFAULT 'not-started',
        progress REAL DEFAULT 0.0,
        timeSpent INTEGER DEFAULT 0,
        lastAccessed DATETIME DEFAULT CURRENT_TIMESTAMP,
        completedAt DATETIME,
        FOREIGN KEY (courseId) REFERENCES courses (id) ON DELETE CASCADE,
        FOREIGN KEY (lessonId) REFERENCES lessons (id) ON DELETE CASCADE
      )`,
    ];

    for (const table of tables) {
      await this.db.executeSql(table);
    }
  }

  /**
   * Execute SQL query
   */
  private async executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
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

  // ==================== COURSE CRUD ====================

  /**
   * Create a new course
   */
  async createCourse(course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const query = `
      INSERT INTO courses (title, description, category, difficulty, level, duration, imageUrl, thumbnail)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      course.title,
      course.description,
      course.category,
      course.difficulty || null,
      course.level || null,
      course.duration,
      course.imageUrl || null,
      course.thumbnail || null,
    ];

    const result = await this.executeQuery<{ insertId: number }>(
      query,
      params
    );
    return result[0]?.insertId || 0;
  }

  /**
   * Get all courses
   */
  async getCourses(): Promise<Course[]> {
    const query = 'SELECT * FROM courses ORDER BY createdAt DESC';
    return this.executeQuery<Course>(query);
  }

  /**
   * Get course by ID
   */
  async getCourseById(id: number): Promise<Course | null> {
    const query = 'SELECT * FROM courses WHERE id = ?';
    const results = await this.executeQuery<Course>(query, [id]);
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Update course
   */
  async updateCourse(id: number, course: Partial<Omit<Course, 'id' | 'createdAt'>>): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];

    if (course.title !== undefined) {
      updates.push('title = ?');
      params.push(course.title);
    }
    if (course.description !== undefined) {
      updates.push('description = ?');
      params.push(course.description);
    }
    if (course.category !== undefined) {
      updates.push('category = ?');
      params.push(course.category);
    }
    if (course.difficulty !== undefined) {
      updates.push('difficulty = ?');
      params.push(course.difficulty);
    }
    if (course.level !== undefined) {
      updates.push('level = ?');
      params.push(course.level);
    }
    if (course.duration !== undefined) {
      updates.push('duration = ?');
      params.push(course.duration);
    }
    if (course.imageUrl !== undefined) {
      updates.push('imageUrl = ?');
      params.push(course.imageUrl);
    }
    if (course.thumbnail !== undefined) {
      updates.push('thumbnail = ?');
      params.push(course.thumbnail);
    }

    if (updates.length === 0) return false;

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE courses SET ${updates.join(', ')} WHERE id = ?`;
    await this.executeQuery(query, params);
    return true;
  }

  /**
   * Delete course
   */
  async deleteCourse(id: number): Promise<boolean> {
    const query = 'DELETE FROM courses WHERE id = ?';
    await this.executeQuery(query, [id]);
    return true;
  }

  // ==================== LESSON CRUD ====================

  /**
   * Create a new lesson
   */
  async createLesson(lesson: Omit<Lesson, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const query = `
      INSERT INTO lessons (courseId, title, description, content, order_index, duration, videoUrl, type, isCompleted, isLocked)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      lesson.courseId,
      lesson.title,
      lesson.description,
      lesson.content || '',
      lesson.order,
      lesson.duration,
      lesson.videoUrl || null,
      lesson.type || 'video',
      lesson.isCompleted ? 1 : 0,
      lesson.isLocked ? 1 : 0,
    ];

    const result = await this.executeQuery<{ insertId: number }>(query, params);
    return result[0]?.insertId || 0;
  }

  /**
   * Get all lessons for a course
   */
  async getLessons(courseId: number): Promise<Lesson[]> {
    const query = 'SELECT * FROM lessons WHERE courseId = ? ORDER BY order_index ASC';
    const results = await this.executeQuery<any>(query, [courseId]);
    
    return results.map((row) => ({
      ...row,
      isCompleted: row.isCompleted === 1,
      isLocked: row.isLocked === 1,
      order: row.order_index,
    }));
  }

  /**
   * Get lesson by ID
   */
  async getLessonById(id: number): Promise<Lesson | null> {
    const query = 'SELECT * FROM lessons WHERE id = ?';
    const results = await this.executeQuery<any>(query, [id]);
    
    if (results.length === 0) return null;
    
    const row = results[0];
    return {
      ...row,
      isCompleted: row.isCompleted === 1,
      isLocked: row.isLocked === 1,
      order: row.order_index,
    };
  }

  /**
   * Update lesson
   */
  async updateLesson(id: number, lesson: Partial<Omit<Lesson, 'id' | 'createdAt'>>): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];

    if (lesson.title !== undefined) {
      updates.push('title = ?');
      params.push(lesson.title);
    }
    if (lesson.description !== undefined) {
      updates.push('description = ?');
      params.push(lesson.description);
    }
    if (lesson.content !== undefined) {
      updates.push('content = ?');
      params.push(lesson.content);
    }
    if (lesson.order !== undefined) {
      updates.push('order_index = ?');
      params.push(lesson.order);
    }
    if (lesson.duration !== undefined) {
      updates.push('duration = ?');
      params.push(lesson.duration);
    }
    if (lesson.videoUrl !== undefined) {
      updates.push('videoUrl = ?');
      params.push(lesson.videoUrl);
    }
    if (lesson.type !== undefined) {
      updates.push('type = ?');
      params.push(lesson.type);
    }
    if (lesson.isCompleted !== undefined) {
      updates.push('isCompleted = ?');
      params.push(lesson.isCompleted ? 1 : 0);
    }
    if (lesson.isLocked !== undefined) {
      updates.push('isLocked = ?');
      params.push(lesson.isLocked ? 1 : 0);
    }

    if (updates.length === 0) return false;

    updates.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE lessons SET ${updates.join(', ')} WHERE id = ?`;
    await this.executeQuery(query, params);
    return true;
  }

  /**
   * Delete lesson
   */
  async deleteLesson(id: number): Promise<boolean> {
    const query = 'DELETE FROM lessons WHERE id = ?';
    await this.executeQuery(query, [id]);
    return true;
  }

  // ==================== USER PROGRESS CRUD ====================

  /**
   * Create or update user progress
   */
  async createUserProgress(progress: Omit<UserProgress, 'id' | 'lastAccessed'>): Promise<number> {
    // Check if progress already exists
    const existingQuery = `
      SELECT id FROM user_progress 
      WHERE userId = ? AND courseId = ? AND (lessonId = ? OR (lessonId IS NULL AND ? IS NULL))
    `;
    const existing = await this.executeQuery<{ id: number }>(
      existingQuery,
      [progress.userId, progress.courseId, progress.lessonId || null, progress.lessonId || null]
    );

    if (existing.length > 0) {
      // Update existing progress
      await this.updateUserProgress(existing[0].id, progress);
      return existing[0].id;
    }

    // Create new progress
    const query = `
      INSERT INTO user_progress (userId, courseId, lessonId, type, status, progress, timeSpent, completedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      progress.userId,
      progress.courseId,
      progress.lessonId || null,
      progress.type,
      progress.status,
      progress.progress,
      progress.timeSpent,
      progress.completedAt || null,
    ];

    const result = await this.executeQuery<{ insertId: number }>(query, params);
    return result[0]?.insertId || 0;
  }

  /**
   * Get user progress
   */
  async getUserProgress(userId: string, courseId?: number, lessonId?: number): Promise<UserProgress[]> {
    let query = 'SELECT * FROM user_progress WHERE userId = ?';
    const params: any[] = [userId];

    if (courseId !== undefined) {
      query += ' AND courseId = ?';
      params.push(courseId);
    }

    if (lessonId !== undefined) {
      query += ' AND lessonId = ?';
      params.push(lessonId);
    }

    query += ' ORDER BY lastAccessed DESC';
    return this.executeQuery<UserProgress>(query, params);
  }

  /**
   * Update user progress
   */
  async updateUserProgress(id: number, progress: Partial<Omit<UserProgress, 'id' | 'userId'>>): Promise<boolean> {
    const updates: string[] = [];
    const params: any[] = [];

    if (progress.status !== undefined) {
      updates.push('status = ?');
      params.push(progress.status);
    }
    if (progress.progress !== undefined) {
      updates.push('progress = ?');
      params.push(progress.progress);
    }
    if (progress.timeSpent !== undefined) {
      updates.push('timeSpent = ?');
      params.push(progress.timeSpent);
    }
    if (progress.completedAt !== undefined) {
      updates.push('completedAt = ?');
      params.push(progress.completedAt);
    }

    if (updates.length === 0) return false;

    updates.push('lastAccessed = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE user_progress SET ${updates.join(', ')} WHERE id = ?`;
    await this.executeQuery(query, params);
    return true;
  }

  /**
   * Delete user progress
   */
  async deleteUserProgress(id: number): Promise<boolean> {
    const query = 'DELETE FROM user_progress WHERE id = ?';
    await this.executeQuery(query, [id]);
    return true;
  }

  // ==================== SEED DATA ====================

  /**
   * Seed sample courses
   */
  async seedCourses(): Promise<void> {
    const courses = [
      {
        title: 'React Native Fundamentals',
        description: 'Learn the basics of React Native development and build your first mobile app.',
        category: 'Mobile Development',
        difficulty: 'Beginner',
        level: 'beginner',
        duration: 120,
        thumbnail: 'https://example.com/react-native-thumb.jpg',
      },
      {
        title: 'Advanced JavaScript',
        description: 'Master advanced JavaScript concepts including closures, promises, and async/await.',
        category: 'Programming',
        difficulty: 'Advanced',
        level: 'advanced',
        duration: 180,
        thumbnail: 'https://example.com/js-thumb.jpg',
      },
      {
        title: 'UI/UX Design Principles',
        description: 'Learn the fundamentals of user interface and user experience design.',
        category: 'Design',
        difficulty: 'Intermediate',
        level: 'intermediate',
        duration: 90,
        thumbnail: 'https://example.com/design-thumb.jpg',
      },
    ];

    for (const course of courses) {
      await this.createCourse(course);
    }
    console.log('Courses seeded successfully');
  }

  /**
   * Seed sample lessons
   */
  async seedLessons(): Promise<void> {
    const courses = await this.getCourses();
    
    if (courses.length === 0) {
      console.log('No courses found. Please seed courses first.');
      return;
    }

    const reactNativeCourse = courses.find(c => c.title.includes('React Native'));
    const jsCourse = courses.find(c => c.title.includes('JavaScript'));

    if (reactNativeCourse) {
      const lessons = [
        {
          courseId: reactNativeCourse.id,
          title: 'Introduction to React Native',
          description: 'Get started with React Native and understand its core concepts.',
          content: 'React Native is a framework for building native mobile apps...',
          order: 1,
          duration: 15,
          type: 'video' as const,
          isCompleted: false,
          isLocked: false,
        },
        {
          courseId: reactNativeCourse.id,
          title: 'Components and Props',
          description: 'Learn how to create and use components in React Native.',
          content: 'Components are the building blocks of React Native apps...',
          order: 2,
          duration: 20,
          type: 'video' as const,
          isCompleted: false,
          isLocked: true,
        },
        {
          courseId: reactNativeCourse.id,
          title: 'State Management',
          description: 'Understand state management in React Native applications.',
          content: 'State management is crucial for building complex apps...',
          order: 3,
          duration: 25,
          type: 'video' as const,
          isCompleted: false,
          isLocked: true,
        },
      ];

      for (const lesson of lessons) {
        await this.createLesson(lesson);
      }
    }

    if (jsCourse) {
      const lessons = [
        {
          courseId: jsCourse.id,
          title: 'Closures and Scope',
          description: 'Deep dive into JavaScript closures and scope.',
          content: 'Closures are one of the most important concepts in JavaScript...',
          order: 1,
          duration: 30,
          type: 'video' as const,
          isCompleted: false,
          isLocked: false,
        },
        {
          courseId: jsCourse.id,
          title: 'Promises and Async/Await',
          description: 'Master asynchronous programming in JavaScript.',
          content: 'Promises provide a better way to handle asynchronous operations...',
          order: 2,
          duration: 35,
          type: 'video' as const,
          isCompleted: false,
          isLocked: true,
        },
      ];

      for (const lesson of lessons) {
        await this.createLesson(lesson);
      }
    }

    console.log('Lessons seeded successfully');
  }

  /**
   * Seed sample user progress
   */
  async seedUserProgress(userId: string): Promise<void> {
    const courses = await this.getCourses();
    const reactNativeCourse = courses.find(c => c.title.includes('React Native'));

    if (reactNativeCourse) {
      const lessons = await this.getLessons(reactNativeCourse.id);
      const firstLesson = lessons[0];

      if (firstLesson) {
        await this.createUserProgress({
          userId,
          courseId: reactNativeCourse.id,
          lessonId: firstLesson.id,
          type: 'lesson',
          status: 'in-progress',
          progress: 50,
          timeSpent: 10,
        });
      }

      // Course-level progress
      await this.createUserProgress({
        userId,
        courseId: reactNativeCourse.id,
        type: 'lesson',
        status: 'in-progress',
        progress: 25,
        timeSpent: 30,
      });
    }

    console.log('User progress seeded successfully');
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
      console.log('Database closed');
    }
  }
}

// Export singleton instance
export const database = new Database();
export default database;