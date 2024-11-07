import jwt from 'jsonwebtoken';
import pool from '../db.js';

export async function verifyToken(token) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const connection = await pool.getConnection();

    try {
      const [users] = await connection.execute(
        'SELECT id, username FROM users WHERE id = ?',
        [decoded.userId]
      );

      return users[0] || null;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}