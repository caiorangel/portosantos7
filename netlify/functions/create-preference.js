// netlify/functions/create-preference.js
import { MercadoPagoConfig, Preference } from 'mercadopago';

const handler = async (event) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': 'https://estacionamentoportosantos.com.br',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // Tratamento do preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    console.log('1. Iniciando criação de preferência');
    const data = JSON.parse(event.body);
    console.log('2. Dados recebidos:', data);

    // Verifica se o token está configurado
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
      throw new Error('Token do Mercado Pago não configurado');
    }

    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    const preference = new Preference(client);
    
    const baseUrl = process.env.SITE_URL || 'https://estacionamentoportosantos.com.br';
    
    const preferenceData = {
      items: [{
        title: `Pacote ${data.packageNights} Noites - Estacionamento Porto Santos`,
        quantity: 1,
        currency_id: 'BRL',
        unit_price: data.price,
      }],
      payer: {
        name: data.customerData.name,
        email: data.customerData.email,
        phone: {
          number: data.customerData.phone
        }
      },
      metadata: {
        licensePlate: data.customerData.licensePlate,
        startDate: data.customerData.startDate,
        packageNights: data.packageNights
      },
      back_urls: {
        success: `${baseUrl}/success`,
        failure: `${baseUrl}/failure`,
        pending: `${baseUrl}/pending`
      },
      auto_return: 'approved',
      statement_descriptor: "ESTACIONAMENTO PORTO SANTOS"
    };

    console.log('3. Criando preferência com dados:', preferenceData);
    
    const result = await preference.create(preferenceData);
    console.log('4. Preferência criada:', result);

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
        details: error.message
      })
    };
  }
};

export { handler };
