import { MercadoPagoConfig, Preference } from 'mercadopago';

export const handler = async (event) => {
  console.log('Handler started, method:', event.httpMethod);
  
  // Get the origin from the request headers
  const origin = event.headers.origin || 'https://estacionamentoportosantos.com.br';
  
  const headers = {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json'
  };

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
    console.log('Parsing request body...');
    const { items, payer, metadata } = JSON.parse(event.body);

    console.log('Configuring MercadoPago...');
    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    const siteUrl = process.env.URL || 'https://estacionamentoportosantos.com.br';

    console.log('Creating preference...');
    const preference = new Preference(client);
    const result = await preference.create({
      items,
      payer,
      metadata,
      back_urls: {
        success: `${siteUrl}/success`,
        failure: `${siteUrl}/failure`,
        pending: `${siteUrl}/pending`
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      statement_descriptor: "ESTACIONAMENTO PORTO SANTOS",
      notification_url: `${siteUrl}/.netlify/functions/webhook`
    });

    console.log('Preference created successfully');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        init_point: result.init_point,
        id: result.id 
      })
    };
  } catch (error) {
    console.error('Error creating preference:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Error creating preference',
        details: error.message 
      })
    };
  }
};