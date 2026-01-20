import { databaseService } from '../DatabaseService';
import { QuizResultRecord } from '../models';
import { QuizResult } from '@/types';

export class QuizResultRepository {
  /**
   * Save a quiz result to the database
   */
  async saveQuizResult(result: QuizResult): Promise<number> {
    const query = `
      INSERT INTO quiz_results (quiz_id, category, difficulty, score, total_questions, percentage, passed)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const passed = result.percentage >= 70 ? 1 : 0;

    const dbResult = await databaseService.executeUpdate(query, [
      result.id,
      result.category,
      result.difficulty || null,
      result.score,
      result.totalQuestions,
      result.percentage,
      passed,
    ]);

    return dbResult.insertId;
  }

  /**
   * Get the total count of completed quizzes
   */
  async getQuizCount(): Promise<number> {
    const results = await databaseService.executeQuery<{ count: number }>(
      'SELECT COUNT(*) as count FROM quiz_results'
    );
    return results[0]?.count || 0;
  }

  /**
   * Get recent quiz results for activity feed
   */
  async getRecentResults(limit: number = 5): Promise<QuizResultRecord[]> {
    const query = `
      SELECT * FROM quiz_results 
      ORDER BY created_at DESC 
      LIMIT ?
    `;
    return databaseService.executeQuery<QuizResultRecord>(query, [limit]);
  }

  /**
   * Get average score across all quizzes
   */
  async getAverageScore(): Promise<number> {
    const results = await databaseService.executeQuery<{ avg_score: number }>(
      'SELECT AVG(percentage) as avg_score FROM quiz_results'
    );
    return Math.round(results[0]?.avg_score || 0);
  }

  /**
   * Get quiz result by ID
   */
  async findById(id: number): Promise<QuizResultRecord | null> {
    const results = await databaseService.executeQuery<QuizResultRecord>(
      'SELECT * FROM quiz_results WHERE id = ?',
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }

  /**
   * Get all quiz results
   */
  async findAll(): Promise<QuizResultRecord[]> {
    return databaseService.executeQuery<QuizResultRecord>(
      'SELECT * FROM quiz_results ORDER BY created_at DESC'
    );
  }

  /**
   * Get passed quizzes count
   */
  async getPassedCount(): Promise<number> {
    const results = await databaseService.executeQuery<{ count: number }>(
      'SELECT COUNT(*) as count FROM quiz_results WHERE passed = 1'
    );
    return results[0]?.count || 0;
  }

  /**
   * Get quizzes by category
   */
  async findByCategory(category: string): Promise<QuizResultRecord[]> {
    return databaseService.executeQuery<QuizResultRecord>(
      'SELECT * FROM quiz_results WHERE category = ? ORDER BY created_at DESC',
      [category]
    );
  }

  /**
   * Delete a quiz result
   */
  async delete(id: number): Promise<boolean> {
    const result = await databaseService.executeUpdate(
      'DELETE FROM quiz_results WHERE id = ?',
      [id]
    );
    return result.rowsAffected > 0;
  }

  /**
   * Clear all quiz results
   */
  async clearAll(): Promise<number> {
    const result = await databaseService.executeUpdate('DELETE FROM quiz_results');
    return result.rowsAffected;
  }

  /**
   * Get stats summary
   */
  async getStats(): Promise<{
    totalQuizzes: number;
    passedQuizzes: number;
    averageScore: number;
  }> {
    const [total, passed, avgScore] = await Promise.all([
      this.getQuizCount(),
      this.getPassedCount(),
      this.getAverageScore(),
    ]);

    return {
      totalQuizzes: total,
      passedQuizzes: passed,
      averageScore: avgScore,
    };
  }
}

export const quizResultRepository = new QuizResultRepository();
export default quizResultRepository;
