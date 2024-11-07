import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Wallet } from '@mercadopago/sdk-react';

interface CheckoutSummaryProps {
  price: number;
  isLoading: boolean;
  preferenceId: string | null;
  onSubmit: () => void;
}

const benefits = [
  'Vagas Demarcadas',
  'Estacionamento Coberto',
  'Seguro Porto Seguro',
  'Serviço de Manobrista',
  'Transfer Terminal',
  'Transfer Particular',
];

export default function CheckoutSummary({ 
  price, 
  isLoading, 
  preferenceId, 
  onSubmit 
}: CheckoutSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Benefícios Inclusos</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="text-green-500" size={20} />
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-blue-900">
            R$ {price}
          </span>
        </div>

        {preferenceId ? (
          <Wallet 
            initialization={{ preferenceId }}
            customization={{ texts: { valueProp: 'smart_payment' } }}
          />
        ) : (
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            {isLoading ? 'Processando...' : 'Continuar para Pagamento'}
          </button>
        )}
      </div>
    </div>
  );
}