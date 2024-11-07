import pool from '../db.js';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    };
  }

  try {
    const connection = await pool.getConnection();

    try {
      const [posts] = await connection.execute(
        'SELECT * FROM blog_posts ORDER BY created_at DESC'
      );

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(posts.map(post => ({
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          imageUrl: post.image_url,
          date: post.created_at,
          slug: post.slug
        })))
      };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Error fetching posts' })
    };
  }
};