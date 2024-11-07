import { MercadoPagoConfig, Preference } from 'mercadopago';

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { items, payer, metadata } = JSON.parse(event.body);

    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    const preference = new Preference(client);
    const result = await preference.create({
      items,
      payer,
      metadata,
      back_urls: {
        success: `${process.env.URL}/success`,
        failure: `${process.env.URL}/failure`,
        pending: `${process.env.URL}/pending`
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      statement_descriptor: "ESTACIONAMENTO PORTO SANTOS",
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        init_point: result.init_point,
        id: result.id 
      })
    };
  } catch (error) {
    console.error('Error creating checkout:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Error creating checkout',
        details: error.message 
      })
    };
  }
};