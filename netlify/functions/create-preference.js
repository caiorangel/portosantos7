import { MercadoPagoConfig, Preference } from 'mercadopago';

const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { packageNights, price, customerData } = JSON.parse(event.body);

    const client = new MercadoPagoConfig({ 
      accessToken: 'APP_USR-0ee9476a-93ea-408c-969e-1799a499eacb'
    });

    const preference = new Preference(client);
    const result = await preference.create({
      items: [
        {
          title: `Pacote ${packageNights} Noites - Estacionamento Porto Santos`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: price,
        },
      ],
      payer: {
        name: customerData.name,
        email: customerData.email,
        phone: {
          number: customerData.phone
        }
      },
      metadata: {
        licensePlate: customerData.licensePlate,
        startDate: customerData.startDate,
        packageNights: packageNights
      },
      back_urls: {
        success: `${process.env.URL}/success`,
        failure: `${process.env.URL}/failure`,
        pending: `${process.env.URL}/pending`
      },
      auto_return: 'approved',
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ preferenceId: result.id })
    };
  } catch (error) {
    console.error('Error creating preference:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error creating payment preference' })
    };
  }
};