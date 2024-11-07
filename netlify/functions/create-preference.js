import { MercadoPagoConfig, Preference } from 'mercadopago';

const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Content-Type': 'application/json'
      }
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log('Dados recebidos:', data);

    const client = new MercadoPagoConfig({ 
      accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    const preference = new Preference(client);
    const result = await preference.create({
      items: data.items,
      payer: data.payer,
      metadata: data.metadata,
      back_urls: {
        success: 'https://estacionamentoportosantos.com.br/success',
        failure: 'https://estacionamentoportosantos.com.br/failure',
        pending: 'https://estacionamentoportosantos.com.br/pending'
      },
      auto_return: 'approved',
      statement_descriptor: "ESTACIONAMENTO PORTO SANTOS"
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Error creating payment preference',
        details: error.message
      })
    };
  }
};

export { handler };
