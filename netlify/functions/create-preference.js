// netlify/functions/create-preference.js
const mercadopago = require('mercadopago');

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Nova forma de configurar o Mercado Pago (V2)
    const client = new mercadopago.MercadoPagoConfig({
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    // Nova forma de criar preferência (V2)
    const preference = new mercadopago.Preference(client);

    const data = JSON.parse(event.body);
    
    const result = await preference.create({
      items: data.items,
      payer: data.payer,
      metadata: data.metadata,
      back_urls: {
        success: `https://estacionamentoportosantos.com.br/success`,
        failure: `https://estacionamentoportosantos.com.br/failure`,
        pending: `https://estacionamentoportosantos.com.br/pending`
      },
      auto_return: 'approved'
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
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Error creating payment preference',
        details: error.message
      })
    };
  }
};

exports.handler = handler;
