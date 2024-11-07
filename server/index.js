import express from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({ 
  accessToken: 'TEST-3286097988616751-102919-aa9578e50ee02d46daa50bf06f4576cc-96981334'
});

app.post('/create-preference', async (req, res) => {
  try {
    const { packageDetails, customerInfo } = req.body;
    
    const preference = new Preference(client);
    const result = await preference.create({
      items: [
        {
          title: `Pacote de ${packageDetails.nights} Noites - Estacionamento Porto Santos`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: packageDetails.price
        }
      ],
      payer: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: {
          number: customerInfo.phone
        }
      },
      metadata: {
        vehiclePlate: customerInfo.vehiclePlate,
        startDate: customerInfo.startDate
      },
      back_urls: {
        success: "https://jade-medovik-b09119.netlify.app/success",
        failure: "https://jade-medovik-b09119.netlify.app/failure",
        pending: "https://jade-medovik-b09119.netlify.app/pending"
      },
      auto_return: "approved"
    });

    res.json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating preference' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});