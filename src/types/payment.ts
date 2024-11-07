export interface PaymentPreference {
  items: Array<{
    title: string;
    quantity: number;
    currency_id: string;
    unit_price: number;
  }>;
  payer: {
    name: string;
    email: string;
    phone: {
      number: string;
    };
  };
  metadata: {
    licensePlate: string;
    startDate: string;
    packageNights: number;
    passengers: number;
  };
}