import React from 'react';
import { Shield, Truck, Camera, CreditCard, Clock, MapPin } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Segurança Garantida",
    description: "Sistema de segurança integrado com câmeras HD e vigilância 24h.",
    stats: "100% Monitorado",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: Truck,
    title: "Transfer Exclusivo",
    description: "Serviço de transfer particular incluso em todos os pacotes.",
    stats: "8min até o Porto",
    gradient: "from-green-500 to-green-600"
  },
  {
    icon: Camera,
    title: "Monitoramento 24/7",
    description: "Câmeras de última geração com gravação em tempo real.",
    stats: "32 Câmeras HD",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: CreditCard,
    title: "Pagamento Flexível",
    description: "Diversas formas de pagamento, inclusive parcelamento.",
    stats: "100% Seguro",
    gradient: "from-orange-500 to-orange-600"
  },
  {
    icon: Clock,
    title: "Check-in Express",
    description: "Processo simplificado de entrada e saída de veículos.",
    stats: "< 5min",
    gradient: "from-pink-500 to-pink-600"
  },
  {
    icon: MapPin,
    title: "Localização Prime",
    description: "Fácil acesso ao Porto de Santos com transfer incluso.",
    stats: "35 Anos",
    gradient: "from-cyan-500 to-cyan-600"
  }
];

export default function Features() {
  return (
    <section id="diferenciais" className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 
                         rounded-full text-sm font-medium mb-4">
            Nossos Diferenciais
          </span>
          <h2 className="text-4xl font-bold mb-6 text-gradient">
            Por que Escolher Nosso Estacionamento?
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Combinamos tecnologia, segurança e praticidade para oferecer a melhor 
            experiência em estacionamento próximo ao Porto de Santos.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card group">
              <div className="flex flex-col items-center text-center">
                {/* Feature Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} 
                              transform group-hover:scale-110 transition-all duration-300 mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>

                {/* Stats Badge */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-full 
                                text-sm font-medium text-gray-600 group-hover:bg-gray-200 
                                transition-colors duration-300">
                    {feature.stats}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 
                             transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                {/* Background Icon */}
                <feature.icon className="feature-icon" />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "5,000+", label: "Clientes Satisfeitos" },
            { value: "99.9%", label: "Taxa de Segurança" },
            { value: "24/7", label: "Suporte Disponível" },
            { value: "35 Anos", label: "de Experiência" }
          ].map((stat, index) => (
            <div key={index} className="glass-card rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-gradient mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}