import pool from '../db.js';
import { verifyToken } from '../utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Verify authentication
    const token = event.headers.authorization?.split(' ')[1];
    const user = await verifyToken(token);
    
    if (!user) {
      return {
        statusCode: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Unauthorized' })
      };
    }

    const post = JSON.parse(event.body);
    const connection = await pool.getConnection();

    try {
      const [result] = await connection.execute(
        'INSERT INTO blog_posts (title, excerpt, content, image_url, slug, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [post.title, post.excerpt, post.content, post.imageUrl, post.slug]
      );

      const newPost = {
        id: result.insertId,
        ...post,
        date: new Date().toISOString()
      };

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(newPost)
      };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error creating post:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Error creating post' })
    };
  }
};