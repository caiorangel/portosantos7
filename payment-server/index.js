import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-2287123931509222-092614-5513f13ca524bf5f3962e82fb57341fe-152737474'
});

app.post('/create-preference', async (req, res) => {
  try {
    const { items, payer, metadata } = req.body;

    const preference = new Preference(client);
    const result = await preference.create({
      items,
      payer,
      metadata,
      back_urls: {
        success: 'https://adorable-donut-d7c897.netlify.app/success',
        failure: 'https://adorable-donut-d7c897.netlify.app/failure',
        pending: 'https://adorable-donut-d7c897.netlify.app/pending'
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      statement_descriptor: "ESTACIONAMENTO PORTO SANTOS",
    });

    res.json({ preferenceId: result.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ error: 'Error creating payment preference' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Payment server running on port ${PORT}`);
});