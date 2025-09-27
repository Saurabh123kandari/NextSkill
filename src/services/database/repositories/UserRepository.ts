import { databaseService } from '../DatabaseService';
import { User, QueryOptions } from '../models';

export class UserRepository {
  async create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const query = `
      INSERT INTO users (email, name, password_hash, avatar_url, role, updated_at)
      VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    
    const result = await databaseService.executeUpdate(query, [
      userData.email,
      userData.name,
      userData.password_hash,
      userData.avatar_url || null,
      userData.role,
    ]);

    return result.insertId;
  }

  async findById(id: number): Promise<User | null> {
    const results = await databaseService.executeQuery<User>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return results.length > 0 ? results[0] : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const results = await databaseService.executeQuery<User>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return results.length > 0 ? results[0] : null;
  }

  async findAll(options?: QueryOptions): Promise<User[]> {
    let query = 'SELECT * FROM users';
    const params: any[] = [];

    if (options?.where) {
      const whereClauses = options.where.map(clause => 
        `${clause.column} ${clause.operator} ?`
      );
      query += ` WHERE ${whereClauses.join(' AND ')}`;
      params.push(...options.where.map(clause => clause.value));
    }

    if (options?.orderBy) {
      const orderClauses = options.orderBy.map(clause => 
        `${clause.column} ${clause.direction}`
      );
      query += ` ORDER BY ${orderClauses.join(', ')}`;
    }

    if (options?.limit) {
      query += ` LIMIT ${options.limit}`;
      if (options?.offset) {
        query += ` OFFSET ${options.offset}`;
      }
    }

    return databaseService.executeQuery<User>(query, params);
  }

  async update(
    id: number,
    userData: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
  ): Promise<boolean> {
    const updateFields: string[] = [];
    const params: any[] = [];

    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        params.push(value);
      }
    });

    if (updateFields.length === 0) return false;

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    const result = await databaseService.executeUpdate(query, params);

    return result.rowsAffected > 0;
  }

  async delete(id: number): Promise<boolean> {
    const result = await databaseService.executeUpdate(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.rowsAffected > 0;
  }

  async emailExists(email: string): Promise<boolean> {
    const results = await databaseService.executeQuery<{ count: number }>(
      'SELECT COUNT(*) as count FROM users WHERE email = ?',
      [email]
    );
    return results[0]?.count > 0;
  }

  async getTotalCount(): Promise<number> {
    const results = await databaseService.executeQuery<{ count: number }>(
      'SELECT COUNT(*) as count FROM users'
    );
    return results[0]?.count || 0;
  }

  async searchByName(searchTerm: string): Promise<User[]> {
    const query = `
      SELECT * FROM users 
      WHERE name LIKE ? OR email LIKE ?
      ORDER BY name ASC
    `;
    const searchPattern = `%${searchTerm}%`;
    
    return databaseService.executeQuery<User>(query, [searchPattern, searchPattern]);
  }
}

export const userRepository = new UserRepository();
