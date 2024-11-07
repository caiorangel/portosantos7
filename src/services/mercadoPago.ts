import { PaymentPreference } from '../types/payment';

class MercadoPagoService {
  private apiUrl: string;

  constructor() {
    // Use the current domain for API calls
    const domain = window.location.origin;
    this.apiUrl = `${domain}/.netlify/functions/create-preference`;
  }

  async createAndRedirect(data: PaymentPreference): Promise<void> {
    try {
      console.log('Creating payment preference...');
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
        }),
        credentials: 'same-origin'
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to create preference');
      }

      const { init_point } = await response.json();
      console.log('Redirecting to:', init_point);
      window.location.href = init_point;
    } catch (error) {
      console.error('Payment error:', error);
      throw new Error('Failed to create payment preference');
    }
  }
}

export const mercadoPagoService = new MercadoPagoService();