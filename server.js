import express from 'express';
import cors from 'cors';
import { createServer } from 'vite';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || 'TEST-3286097988616751-102919-aa9578e50ee02d46daa50bf06f4576cc-96981334'
});

app.post('/api/create-preference', async (req, res) => {
  try {
    const { items, payer, metadata } = req.body;

    const preference = new Preference(client);
    const result = await preference.create({
      items,
      payer,
      metadata,
      back_urls: {
        success: `${process.env.URL || 'http://localhost:5173'}/success`,
        failure: `${process.env.URL || 'http://localhost:5173'}/failure`,
        pending: `${process.env.URL || 'http://localhost:5173'}/pending`
      },
      auto_return: 'approved',
      payment_methods: {
        excluded_payment_methods: [],
        excluded_payment_types: [],
        installments: 12
      },
      statement_descriptor: "ESTACIONAMENTO PORTO SANTOS",
    });

    res.json({ init_point: result.init_point, id: result.id });
  } catch (error) {
    console.error('Error creating preference:', error);
    res.status(500).json({ error: 'Error creating payment preference' });
  }
});

// Create Vite server in middleware mode
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'spa'
});

// Use vite's connect instance as middleware
app.use(vite.middlewares);

const port = process.env.PORT || 5173;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});