import fetch from 'node-fetch';

const API_BASE_URL = 'https://iarastudios.com/api/v1';
const WORKSPACE_SLUG = 'portosantos';
const API_KEY = 'GN1DPJZ-44V4C49-GJT1TYH-N8STKN9';

export const handler = async (event) => {
  // Always return proper CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { action, message, threadSlug } = JSON.parse(event.body);

    const apiHeaders = {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    let response;
    
    if (action === 'createThread') {
      response = await fetch(`${API_BASE_URL}/workspaces/${WORKSPACE_SLUG}/threads`, {
        method: 'POST',
        headers: apiHeaders
      });
    } else if (action === 'sendMessage' && threadSlug) {
      response = await fetch(`${API_BASE_URL}/workspaces/${WORKSPACE_SLUG}/threads/${threadSlug}/messages`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({ message })
      });
    } else {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid action or missing threadSlug' })
      };
    }

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(action === 'createThread' ? 
        { threadSlug: data.threadId } : 
        { response: data.response })
    };

  } catch (error) {
    console.error('Chat proxy error:', error);
    
    // Provide fallback responses for better user experience
    if (error.message.includes('API responded with status')) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          response: 'Desculpe, estou com dificuldades técnicas no momento. Por favor, tente novamente em alguns instantes.'
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred'
      })
    };
  }
};