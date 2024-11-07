import React, { useState, useEffect } from 'react';
import { MessageCircleMore, Phone, ChevronDown } from 'lucide-react';
import PriceCalculator from './PriceCalculator';

export default function Hero() {
  const [availableSpots, setAvailableSpots] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const getRandomSpots = () => Math.floor(Math.random() * 4) + 2;
    setAvailableSpots(getRandomSpots());
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setAvailableSpots(getRandomSpots());
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('pacotes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      className={`relative min-h-[140vh] md:min-h-screen w-full flex items-center transform transition-opacity duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-blue-900/85 to-blue-800/90 z-10"></div>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-150"
          style={{ filter: 'brightness(0.7) contrast(1.2)' }}
        >
          <source src="https://iarazap.com/navio.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-20 w-full pt-20 md:pt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
            <div className="flex-1 text-center md:text-left max-w-2xl mx-auto md:mx-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
                Estacionamento Seguro no
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent block mt-2">
                  Porto de Santos
                </span>
              </h1>

              {availableSpots < 6 && (
                <div className="inline-block mb-8 px-6 py-3 bg-red-500/20 backdrop-blur-sm rounded-lg border border-red-500/30">
                  <p className="text-red-200 font-medium flex items-center gap-2 text-lg">
                    <span className="animate-pulse">🚨</span>
                    Apenas {availableSpots} vagas disponíveis para hoje!
                  </p>
                </div>
              )}

              <p className="text-xl mb-8 text-blue-100/90 leading-relaxed">
                Seu veículo protegido a apenas 8 minutos do Terminal, com transfer exclusivo 
                e seguro Porto Seguro incluso em todos os pacotes.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <a
                  href="https://wa.me/5513991260211"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary group flex items-center gap-3 justify-center w-full sm:w-auto"
                >
                  <MessageCircleMore className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Reserve via WhatsApp</span>
                </a>
                <a
                  href="tel:+551321389144"
                  className="btn-secondary group flex items-center gap-3 justify-center w-full sm:w-auto"
                >
                  <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Ligar Agora</span>
                </a>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md pb-12 md:pb-0 mx-auto md:mx-0">
              <PriceCalculator />
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={scrollToFeatures}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
                 text-white/80 hover:text-white transition-all duration-300 
                 animate-bounce hover:scale-110 focus:outline-none 
                 focus:ring-2 focus:ring-white/50 rounded-full p-2"
        aria-label="Ver mais informações"
      >
        <ChevronDown size={32} />
      </button>
    </section>
  );
}