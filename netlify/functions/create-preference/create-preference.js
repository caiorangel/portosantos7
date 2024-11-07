import mercadopago from 'mercadopago';

export const handler = async (event) => {
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

    // Inicializar o SDK do Mercado Pago
    mercadopago.configure({
      access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
    });

    // Verificar se os dados necessários estão presentes
    if (!data.items || !data.payer || !data.payer.email) {
      console.error('Dados insuficientes fornecidos');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Dados insuficientes fornecidos' }),
      };
    }

    const preferenceData = {
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
    };

    const response = await mercadopago.preferences.create(preferenceData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        init_point: response.body.init_point,
        id: response.body.id
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
