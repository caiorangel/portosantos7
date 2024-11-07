import React from 'react';
import { useSearchParams } from 'react-router-dom';
import CheckoutForm from '../components/Checkout/CheckoutForm';

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const selectedPackage = parseInt(searchParams.get('package') || '3', 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Finalizar Reserva</h1>
        <CheckoutForm initialPackage={selectedPackage} />
      </div>
    </div>
  );
}