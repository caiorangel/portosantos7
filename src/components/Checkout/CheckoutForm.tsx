import React, { useState, useEffect } from 'react';
import { Car, Calendar, Package, User, Mail, Phone, Users } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { mercadoPagoService } from '../../services/mercadoPago';

const packages = [
  { nights: 3, price: 249 },
  { nights: 4, price: 299 },
  { nights: 5, price: 319 },
  { nights: 6, price: 359 },
  { nights: 7, price: 399 }
];

interface CheckoutFormProps {
  initialPackage: number;
}

export default function CheckoutForm({ initialPackage = 3 }: CheckoutFormProps) {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    licensePlate: '',
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || '',
    packageNights: initialPackage,
    passengers: 1
  });

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const bestPackage = packages.find(pkg => pkg.nights === diffNights) || 
          packages.reduce((prev, curr) => {
            return Math.abs(curr.nights - diffNights) < Math.abs(prev.nights - diffNights) ? curr : prev;
          });

        setFormData(prev => ({
          ...prev,
          packageNights: bestPackage.nights
        }));
      }
    }
  }, [formData.startDate, formData.endDate]);

  const selectedPackage = packages.find(
    (pkg) => pkg.nights === Number(formData.packageNights)
  );

  const calculateTotalPrice = () => {
    const basePrice = selectedPackage?.price || 0;
    const extraPassengerFee = formData.passengers > 4 ? 50 : 0;
    return basePrice + extraPassengerFee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await mercadoPagoService.createAndRedirect({
        items: [{
          title: `Pacote ${formData.packageNights} Noites - Estacionamento Porto Santos`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: calculateTotalPrice(),
        }],
        payer: {
          name: formData.fullName,
          email: formData.email,
          phone: {
            number: formData.phone.replace(/\D/g, '')
          }
        },
        metadata: {
          licensePlate: formData.licensePlate,
          startDate: formData.startDate,
          packageNights: formData.packageNights,
          passengers: formData.passengers
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      setError('Erro ao processar pagamento. Por favor, tente novamente.');
      toast.error('Erro ao processar pagamento. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="(13) 99999-9999"
                  required
                />
              </div>
            </div>
          </div>

          {/* Vehicle and Package Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Placa do Veículo
              </label>
              <div className="relative">
                <Car className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
                <input
                  type="text"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData(prev => ({ ...prev, licensePlate: e.target.value.toUpperCase() }))}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="ABC1D23"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Entrada
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                  style={{ paddingLeft: '2.5rem' }}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data de Saída
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                  style={{ paddingLeft: '2.5rem' }}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Passageiros
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
                <input
                  type="number"
                  min="1"
                  max="8"
                  value={formData.passengers}
                  onChange={(e) => setFormData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
              {formData.passengers > 4 && (
                <p className="text-sm text-orange-600 mt-1">
                  Será cobrada uma taxa adicional de R$ 50,00 para mais de 4 passageiros.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pacote
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" size={20} />
                <select
                  value={formData.packageNights}
                  onChange={(e) => setFormData(prev => ({ ...prev, packageNights: parseInt(e.target.value) }))}
                  className="pl-10 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                  style={{ paddingLeft: '2.5rem' }}
                >
                  {packages.map((pkg) => (
                    <option key={pkg.nights} value={pkg.nights}>
                      {pkg.nights} Noites - R$ {pkg.price}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold text-blue-900">
              R$ {calculateTotalPrice()}
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            {isLoading ? 'Processando...' : 'Continuar para Pagamento'}
          </button>
        </div>
      </form>
    </div>
  );
}