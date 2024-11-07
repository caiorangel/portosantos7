import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  slug: string;
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'Como escolher o melhor estacionamento no Porto de Santos',
    excerpt: 'Dicas essenciais para escolher um estacionamento seguro e conveniente próximo ao Porto de Santos.',
    imageUrl: 'https://images.unsplash.com/photo-1590674899484-13da0f721f7f?auto=format&fit=crop&q=80&w=1200',
    date: '6 de novembro de 2024',
    slug: 'como-escolher-melhor-estacionamento-porto-santos'
  },
  {
    id: '2',
    title: 'Dicas para sua primeira viagem de cruzeiro',
    excerpt: 'Tudo o que você precisa saber para aproveitar ao máximo sua primeira experiência em um cruzeiro.',
    imageUrl: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&q=80&w=1200',
    date: '6 de novembro de 2024',
    slug: 'dicas-primeira-viagem-cruzeiro'
  },
  {
    id: '3',
    title: 'Segurança do seu veículo durante a viagem',
    excerpt: 'Conheça as medidas de segurança essenciais para proteger seu carro enquanto você viaja.',
    imageUrl: 'https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=1200',
    date: '6 de novembro de 2024',
    slug: 'seguranca-veiculo-durante-viagem'
  },
  {
    id: '4',
    title: 'Transfer para o Terminal: Como Funciona',
    excerpt: 'Entenda o processo completo do serviço de transfer do estacionamento até o terminal.',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200',
    date: '6 de novembro de 2024',
    slug: 'transfer-terminal-como-funciona'
  }
];

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    fetchPosts();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/.netlify/functions/get-posts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      setPosts(data.length > 0 ? data : FALLBACK_POSTS);
    } catch (error) {
      console.warn('Using fallback posts due to fetch error:', error);
      setPosts(FALLBACK_POSTS);
    } finally {
      setIsLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + (isMobile ? 1 : 4) >= posts.length ? 0 : prev + (isMobile ? 1 : 4)
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - (isMobile ? 1 : 4) < 0 ? Math.max(0, posts.length - (isMobile ? 1 : 4)) : prev - (isMobile ? 1 : 4)
    );
  };

  const visiblePosts = isMobile 
    ? [posts[currentIndex]]
    : posts.slice(currentIndex, currentIndex + 4);

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Blog do Porto</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Blog do Porto</h2>
        
        <div className="relative">
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all"
            aria-label="Posts anteriores"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <div className="overflow-hidden">
            <div className={`flex gap-6 transition-transform duration-500 ${
              isMobile ? 'flex-col items-center' : ''
            }`}>
              {visiblePosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="block w-full md:w-1/4 group"
                >
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-900 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all"
            aria-label="Próximos posts"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Blog;