import axios from 'axios';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
}

const api = axios.create({
  baseURL: '/.netlify/functions',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await api.get('/get-posts');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch blog posts');
    }
    throw error;
  }
}

export async function createBlogPost(post: Omit<BlogPost, 'id' | 'date'>): Promise<BlogPost> {
  try {
    const response = await api.post('/create-post', post);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to create blog post');
    }
    throw error;
  }
}