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

  // Default posts if database is empty
  const defaultPosts = [
    {
      id: '1',
      title: 'Como escolher o melhor estacionamento no Porto de Santos',
      excerpt: 'Dicas essenciais para escolher um estacionamento seguro e conveniente próximo ao Porto de Santos.',
      content: `<p>Ao planejar uma viagem de navio partindo do Porto de Santos, uma das principais preocupações é onde deixar o carro com segurança. Aqui estão algumas dicas importantes para fazer a melhor escolha:</p>
      <h2>1. Localização Estratégica</h2>
      <p>Procure um estacionamento próximo ao terminal de passageiros, idealmente a não mais que 10 minutos de distância.</p>
      <h2>2. Segurança</h2>
      <p>Verifique se o local possui:</p>
      <ul>
        <li>Câmeras de monitoramento 24h</li>
        <li>Equipe de segurança</li>
        <li>Iluminação adequada</li>
        <li>Seguro para veículos</li>
      </ul>`,
      imageUrl: 'https://images.unsplash.com/photo-1590674899484-13da0f721f7f?auto=format&fit=crop&q=80&w=1200',
      date: '6 de novembro de 2024',
      slug: 'como-escolher-melhor-estacionamento-porto-santos'
    },
    {
      id: '2',
      title: 'Dicas para sua primeira viagem de cruzeiro',
      excerpt: 'Tudo o que você precisa saber para aproveitar ao máximo sua primeira experiência em um cruzeiro.',
      content: `<p>Preparar-se para sua primeira viagem de cruzeiro pode ser empolgante e um pouco intimidador. Aqui estão algumas dicas valiosas:</p>
      <h2>1. Planejamento</h2>
      <p>Chegue com antecedência ao porto e garanta que toda sua documentação está em ordem.</p>
      <h2>2. O que levar</h2>
      <p>Lista de itens essenciais:</p>
      <ul>
        <li>Documentos originais</li>
        <li>Roupas adequadas</li>
        <li>Medicamentos necessários</li>
        <li>Cartão de crédito internacional</li>
      </ul>`,
      imageUrl: 'https://images.unsplash.com/photo-1599640842225-85d111c60e6b?auto=format&fit=crop&q=80&w=1200',
      date: '6 de novembro de 2024',
      slug: 'dicas-primeira-viagem-cruzeiro'
    }
  ];

  try {
    const connection = await pool.getConnection();

    try {
      const [posts] = await connection.execute(
        'SELECT * FROM blog_posts ORDER BY created_at DESC'
      );

      // If no posts in database, return default posts
      if (!posts || posts.length === 0) {
        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(defaultPosts)
        };
      }

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
          date: new Date(post.created_at).toLocaleDateString('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }),
          slug: post.slug
        })))
      };
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error fetching posts:', error);
    
    // Return default posts on error
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(defaultPosts)
    };
  }
};