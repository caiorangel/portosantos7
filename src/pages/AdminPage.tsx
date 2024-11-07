import React, { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  date: string;
  slug: string;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [newPost, setNewPost] = useState({
    title: '',
    excerpt: '',
    content: '',
    imageUrl: ''
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/.netlify/functions/create-post', {
        method: 'POST',
        body: JSON.stringify({
          ...newPost,
          date: new Date().toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          }),
          slug: newPost.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        toast.success('Post criado com sucesso!');
        setNewPost({ title: '', excerpt: '', content: '', imageUrl: '' });
        fetchPosts();
      } else {
        toast.error('Erro ao criar post');
      }
    } catch (error) {
      toast.error('Erro ao criar post');
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/.netlify/functions/get-posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      toast.error('Erro ao carregar posts');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const response = await fetch(`/.netlify/functions/delete-post/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Post excluído com sucesso');
        fetchPosts();
      } else {
        toast.error('Erro ao excluir post');
      }
    } catch (error) {
      toast.error('Erro ao excluir post');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Gerenciar Blog</h1>

        {/* Create/Edit Form */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">
            {editingId ? 'Editar Post' : 'Novo Post'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da Imagem
              </label>
              <input
                type="url"
                value={newPost.imageUrl}
                onChange={(e) => setNewPost(prev => ({ ...prev, imageUrl: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Resumo
              </label>
              <textarea
                value={newPost.excerpt}
                onChange={(e) => setNewPost(prev => ({ ...prev, excerpt: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Conteúdo (HTML)
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                rows={10}
                required
              />
            </div>

            <div className="flex justify-end gap-4">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNewPost({ title: '', excerpt: '', content: '', imageUrl: '' });
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                {editingId ? 'Atualizar' : 'Publicar'}
              </button>
            </div>
          </form>
        </div>

        {/* Posts List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {posts.map((post) => (
              <div key={post.id} className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-gray-500">{post.date}</p>
                    <p className="text-sm text-gray-600 mt-1">{post.excerpt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(post.id);
                        setNewPost({
                          title: post.title,
                          excerpt: post.excerpt,
                          content: post.content,
                          imageUrl: post.imageUrl
                        });
                      }}
                      className="p-2 text-blue-600 hover:text-blue-900"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}