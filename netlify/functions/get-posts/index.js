import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler = async (event) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
      }
    };
  }

  try {
    // Fetch posts from Supabase
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // If no posts exist yet, return sample data
    if (!posts || posts.length === 0) {
      const samplePosts = [
        {
          id: '1',
          title: 'Dicas para Estacionar no Porto de Santos',
          excerpt: 'Confira as melhores dicas para estacionar seu veículo com segurança no Porto de Santos.',
          imageUrl: 'https://images.unsplash.com/photo-1520105072000-f44fc083e508?auto=format&fit=crop&q=80&w=800',
          date: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Como Funciona o Transfer para o Terminal',
          excerpt: 'Entenda o processo de transfer exclusivo do nosso estacionamento para o terminal.',
          imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=800',
          date: new Date().toISOString()
        }
      ];

      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(samplePosts)
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(posts)
    };

  } catch (error) {
    console.error('Error fetching posts:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: error.message || 'Failed to fetch blog posts'
      })
    };
  }
};