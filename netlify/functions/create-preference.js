// netlify/functions/create-preference.js
import { MercadoPagoConfig, Preference } from 'mercadopago';

export const handler = async (event) => {
  // Headers para CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
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
    console.log('1. Iniciando função');

    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('Access token não configurado');
    }

    const data = JSON.parse(event.body);
    console.log('2. Dados recebidos:', data);

    // Configuração do Mercado Pago com nova sintaxe
    const client = new MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    console.log('3. Cliente MP configurado');

    const preference = new Preference(client);
    console.log('4. Iniciando criação da preferência');

    const result = await preference.create({
      items: data.items,
      payer: data.payer,
      back_urls: {
        success: 'https://estacionamentoportosantos.com.br/success',
        failure: 'https://estacionamentoportosantos.com.br/failure',
        pending: 'https://estacionamentoportosantos.com.br/pending'
      },
      auto_return: 'approved',
      notification_url: 'https://estacionamentoportosantos.com.br/api/webhook',
      statement_descriptor: 'ESTACIONAMENTO PORTO SANTOS',
      metadata: data.metadata
    });

    console.log('5. Preferência criada:', result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        init_point: result.init_point,
        id: result.id
      })
    };

  } catch (error) {
    console.error('Erro detalhado:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Error creating payment preference',
        details: error.message,
        stack: error.stack
      })
    };
  }
};
