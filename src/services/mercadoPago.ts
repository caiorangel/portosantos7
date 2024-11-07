// src/services/mercadoPago.ts
import { PaymentPreference } from '../types/payment';

class MercadoPagoService {
  private apiUrl: string;

  constructor() {
    // Usando o caminho direto da função
    this.apiUrl = '/.netlify/functions/create-preference.js';
  }

  async createAndRedirect(data: PaymentPreference): Promise<void> {
    try {
      console.log('Creating payment preference...', data);
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          items: data.items,
          payer: data.payer,
          metadata: {
            customer_name: data.payer.name,
            customer_email: data.payer.email,
            customer_phone: data.payer.phone.number,
            license_plate: data.metadata.licensePlate,
            start_date: data.metadata.startDate,
            package_nights: data.metadata.packageNights,
            passengers: data.metadata.passengers,
            booking_timestamp: new Date().toISOString(),
            source: 'website'
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to create preference: ${errorText}`);
      }

      const result = await response.json();
      console.log('Payment preference created:', result);

      if (!result.init_point) {
        throw new Error('No init_point received from server');
      }

      console.log('Redirecting to:', result.init_point);
      window.location.href = result.init_point;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }
}

export const mercadoPagoService = new MercadoPagoService();
export default MercadoPagoService;
