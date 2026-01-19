import SQLite from 'react-native-sqlite-storage';
import { Alert } from 'react-native';

// Enable SQLite debugging in development
SQLite.DEBUG(true);
// Use the default location for SQLite databases
SQLite.enablePromise(true);

export interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  order: number;
  duration: number; // in minutes
  videoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonId: string;
  completed: boolean;
  completedAt?: string;
  score?: number;
  timeSpent: number; // in seconds
  createdAt: string;
  updatedAt: string;
}

class Database {
  private database: SQLite.SQLiteDatabase | null = null;
  private initialized: boolean = false;

  // Initialize the database
  public async init(): Promise<void> {
    try {
      // Open the database
      this.database = await SQLite.openDatabase({
        name: 'nextskill.db',
        location: 'default',
      });
      
      // Create tables if they don't exist
      await this.createTables();
      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      Alert.alert('Database Error', 'Failed to initialize the database');
    }
  }

  // Create database tables
  private async createTables(): Promise<void> {
    if (!this.database) {
      throw new Error('Database not initialized');
    }

    // Create Courses table
    await this.database.executeSql(`
      CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        imageUrl TEXT,
        category TEXT NOT NULL,
        difficulty TEXT NOT NULL,
        duration INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    // Create Lessons table
    await this.database.executeSql(`
      CREATE TABLE IF NOT EXISTS lessons (
        id TEXT PRIMARY KEY,
        courseId TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        content TEXT NOT NULL,
        order INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        videoUrl TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (courseId) REFERENCES courses (id) ON DELETE CASCADE
      );
    `);

    // Create UserProgress table
    await this.database.executeSql(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        courseId TEXT NOT NULL,
        lessonId TEXT NOT NULL,
        completed BOOLEAN NOT NULL,
        completedAt TEXT,
        score INTEGER,
        timeSpent INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (courseId) REFERENCES courses (id) ON DELETE CASCADE,
        FOREIGN KEY (lessonId) REFERENCES lessons (id) ON DELETE CASCADE
      );
    `);
  }

  // CRUD Operations for Courses
  public async getCourses(): Promise<Course[]> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      const [results] = await this.database!.executeSql('SELECT * FROM courses ORDER BY title ASC');
      const courses: Course[] = [];
      
      for (let i = 0; i < results.rows.length; i++) {
        courses.push(results.rows.item(i));
      }
      
      return courses;
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  }

  public async getCourseById(id: string): Promise<Course | null> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      const [results] = await this.database!.executeSql('SELECT * FROM courses WHERE id = ?', [id]);
      
      if (results.rows.length > 0) {
        return results.rows.item(0);
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching course with id ${id}:`, error);
      return null;
    }
  }

  public async addCourse(course: Course): Promise<boolean> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      await this.database!.executeSql(
        `INSERT INTO courses (id, title, description, imageUrl, category, difficulty, duration, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          course.id,
          course.title,
          course.description,
          course.imageUrl,
          course.category,
          course.difficulty,
          course.duration,
          course.createdAt,
          course.updatedAt
        ]
      );
      
      return true;
    } catch (error) {
      console.error('Error adding course:', error);
      return false;
    }
  }

  public async updateCourse(course: Course): Promise<boolean> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      await this.database!.executeSql(
        `UPDATE courses 
         SET title = ?, description = ?, imageUrl = ?, category = ?, 
             difficulty = ?, duration = ?, updatedAt = ? 
         WHERE id = ?`,
        [
          course.title,
          course.description,
          course.imageUrl,
          course.category,
          course.difficulty,
          course.duration,
          new Date().toISOString(),
          course.id
        ]
      );
      
      return true;
    } catch (error) {
      console.error(`Error updating course with id ${course.id}:`, error);
      return false;
    }
  }

  public async deleteCourse(id: string): Promise<boolean> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      await this.database!.executeSql('DELETE FROM courses WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error(`Error deleting course with id ${id}:`, error);
      return false;
    }
  }

  // CRUD Operations for Lessons
  public async getLessons(courseId: string): Promise<Lesson[]> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      const [results] = await this.database!.executeSql(
        'SELECT * FROM lessons WHERE courseId = ? ORDER BY `order` ASC',
        [courseId]
      );
      
      const lessons: Lesson[] = [];
      
      for (let i = 0; i < results.rows.length; i++) {
        lessons.push(results.rows.item(i));
      }
      
      return lessons;
    } catch (error) {
      console.error(`Error fetching lessons for course ${courseId}:`, error);
      return [];
    }
  }

  public async getLessonById(id: string): Promise<Lesson | null> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      const [results] = await this.database!.executeSql('SELECT * FROM lessons WHERE id = ?', [id]);
      
      if (results.rows.length > 0) {
        return results.rows.item(0);
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching lesson with id ${id}:`, error);
      return null;
    }
  }

  public async addLesson(lesson: Lesson): Promise<boolean> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      await this.database!.executeSql(
        `INSERT INTO lessons (id, courseId, title, description, content, order, duration, videoUrl, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          lesson.id,
          lesson.courseId,
          lesson.title,
          lesson.description,
          lesson.content,
          lesson.order,
          lesson.duration,
          lesson.videoUrl || null,
          lesson.createdAt,
          lesson.updatedAt
        ]
      );
      
      return true;
    } catch (error) {
      console.error('Error adding lesson:', error);
      return false;
    }
  }

  public async updateLesson(lesson: Lesson): Promise<boolean> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      await this.database!.executeSql(
        `UPDATE lessons 
         SET courseId = ?, title = ?, description = ?, content = ?, 
             order = ?, duration = ?, videoUrl = ?, updatedAt = ? 
         WHERE id = ?`,
        [
          lesson.courseId,
          lesson.title,
          lesson.description,
          lesson.content,
          lesson.order,
          lesson.duration,
          lesson.videoUrl || null,
          new Date().toISOString(),
          lesson.id
        ]
      );
      
      return true;
    } catch (error) {
      console.error(`Error updating lesson with id ${lesson.id}:`, error);
      return false;
    }
  }

  public async deleteLesson(id: string): Promise<boolean> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      await this.database!.executeSql('DELETE FROM lessons WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error(`Error deleting lesson with id ${id}:`, error);
      return false;
    }
  }

  // CRUD Operations for UserProgress
  public async getUserProgress(userId: string, courseId?: string): Promise<UserProgress[]> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      let query = 'SELECT * FROM user_progress WHERE userId = ?';
      const params: string[] = [userId];
      
      if (courseId) {
        query += ' AND courseId = ?';
        params.push(courseId);
      }
      
      const [results] = await this.database!.executeSql(query, params);
      const progress: UserProgress[] = [];
      
      for (let i = 0; i < results.rows.length; i++) {
        progress.push(results.rows.item(i));
      }
      
      return progress;
    } catch (error) {
      console.error(`Error fetching user progress for user ${userId}:`, error);
      return [];
    }
  }

  public async getUserProgressForLesson(userId: string, lessonId: string): Promise<UserProgress | null> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      const [results] = await this.database!.executeSql(
        'SELECT * FROM user_progress WHERE userId = ? AND lessonId = ?',
        [userId, lessonId]
      );
      
      if (results.rows.length > 0) {
        return results.rows.item(0);
      }
      
      return null;
    } catch (error) {
      console.error(`Error fetching user progress for lesson ${lessonId}:`, error);
      return null;
    }
  }

  public async addUserProgress(progress: UserProgress): Promise<boolean> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      await this.database!.executeSql(
        `INSERT INTO user_progress (id, userId, courseId, lessonId, completed, completedAt, score, timeSpent, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          progress.id,
          progress.userId,
          progress.courseId,
          progress.lessonId,
          progress.completed ? 1 : 0,
          progress.completedAt || null,
          progress.score || null,
          progress.timeSpent,
          progress.createdAt,
          progress.updatedAt
        ]
      );
      
      return true;
    } catch (error) {
      console.error('Error adding user progress:', error);
      return false;
    }
  }

  public async updateUserProgress(progress: UserProgress): Promise<boolean> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      await this.database!.executeSql(
        `UPDATE user_progress 
         SET completed = ?, completedAt = ?, score = ?, timeSpent = ?, updatedAt = ? 
         WHERE id = ?`,
        [
          progress.completed ? 1 : 0,
          progress.completedAt || null,
          progress.score || null,
          progress.timeSpent,
          new Date().toISOString(),
          progress.id
        ]
      );
      
      return true;
    } catch (error) {
      console.error(`Error updating user progress with id ${progress.id}:`, error);
      return false;
    }
  }

  public async deleteUserProgress(id: string): Promise<boolean> {
    if (!this.database) {
      await this.init();
    }
    
    try {
      await this.database!.executeSql('DELETE FROM user_progress WHERE id = ?', [id]);
      return true;
    } catch (error) {
      console.error(`Error deleting user progress with id ${id}:`, error);
      return false;
    }
  }

  // Seed sample data
  public async seedSampleData(): Promise<void> {
    try {
      // Sample courses
      const courses: Course[] = [
        {
          id: '1',
          title: 'React Native Fundamentals',
          description: 'Learn the basics of React Native development including components, styling, and navigation.',
          imageUrl: 'https://example.com/react-native.jpg',
          category: 'Mobile Development',
          difficulty: 'beginner',
          duration: 120,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Advanced React Native Patterns',
          description: 'Explore advanced patterns and techniques for building complex React Native applications.',
          imageUrl: 'https://example.com/advanced-react-native.jpg',
          category: 'Mobile Development',
          difficulty: 'intermediate',
          duration: 180,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'React Native Performance Optimization',
          description: 'Learn how to optimize your React Native app for better performance and user experience.',
          imageUrl: 'https://example.com/performance.jpg',
          category: 'Mobile Development',
          difficulty: 'advanced',
          duration: 150,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Sample lessons
      const lessons: Lesson[] = [
        {
          id: '1',
          courseId: '1',
          title: 'Introduction to React Native',
          description: 'An overview of React Native and its core concepts.',
          content: 'React Native is a framework for building native mobile apps using JavaScript and React...',
          order: 1,
          duration: 15,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          courseId: '1',
          title: 'Setting Up Your Development Environment',
          description: 'Learn how to set up your development environment for React Native.',
          content: 'To get started with React Native development, you need to install Node.js, npm, and the React Native CLI...',
          order: 2,
          duration: 20,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          courseId: '1',
          title: 'Core Components and APIs',
          description: 'Explore the core components and APIs provided by React Native.',
          content: 'React Native provides a set of core components that map directly to native UI components...',
          order: 3,
          duration: 25,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          courseId: '2',
          title: 'State Management with Redux',
          description: 'Learn how to manage state in React Native apps using Redux.',
          content: 'Redux is a predictable state container for JavaScript apps that helps you write applications that behave consistently...',
          order: 1,
          duration: 30,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          courseId: '2',
          title: 'Navigation Patterns',
          description: 'Explore different navigation patterns in React Native.',
          content: 'Navigation is a critical part of any mobile app. React Navigation is a popular library for implementing navigation in React Native apps...',
          order: 2,
          duration: 25,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Sample user progress
      const userProgress: UserProgress[] = [
        {
          id: '1',
          userId: 'user1',
          courseId: '1',
          lessonId: '1',
          completed: true,
          completedAt: new Date().toISOString(),
          score: 95,
          timeSpent: 900,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          userId: 'user1',
          courseId: '1',
          lessonId: '2',
          completed: true,
          completedAt: new Date().toISOString(),
          score: 85,
          timeSpent: 1200,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          userId: 'user1',
          courseId: '1',
          lessonId: '3',
          completed: false,
          timeSpent: 600,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      // Insert sample data
      for (const course of courses) {
        await this.addCourse(course);
      }

      for (const lesson of lessons) {
        await this.addLesson(lesson);
      }

      for (const progress of userProgress) {
        await this.addUserProgress(progress);
      }

      console.log('Sample data seeded successfully');
    } catch (error) {
      console.error('Error seeding sample data:', error);
    }
  }

  // Close the database
  public async close(): Promise<void> {
    if (this.database) {
      await this.database.close();
      this.database = null;
      this.initialized = false;
      console.log('Database closed');
    }
  }
}

// Export a singleton instance
export const database = new Database();