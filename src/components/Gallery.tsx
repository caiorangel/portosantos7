import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  {
    url: 'https://estacionamentogonzaga.com.br/wp-content/uploads/2024/11/estacionamento-gonzaga-entrada.jpg.webp',
    title: 'Entrada Principal',
    description: 'Acesso amplo e seguro para seu veículo'
  },
  {
    url: 'https://estacionamentogonzaga.com.br/wp-content/uploads/2024/11/estacionamento-gonzaga-acesso-facil.jpg.webp',
    title: 'Acesso Facilitado',
    description: 'Entrada e saída rápida e conveniente'
  },
  {
    url: 'https://estacionamentogonzaga.com.br/wp-content/uploads/2024/11/estacionamento-gonzaga-vagas-amplas.jpg.webp',
    title: 'Vagas Amplas',
    description: 'Espaço confortável para seu veículo'
  },
  {
    url: 'https://estacionamentogonzaga.com.br/wp-content/uploads/2024/11/estacionamento-gonzaga-espaco-garantido.jpg.webp',
    title: 'Espaço Garantido',
    description: 'Vagas demarcadas e cobertas'
  },
  {
    url: 'https://estacionamentogonzaga.com.br/wp-content/uploads/2024/11/estacionamento-gonzaga-area-de-embarque.jpg.webp',
    title: 'Área de Embarque',
    description: 'Transfer exclusivo para o terminal'
  },
  {
    url: 'https://estacionamentogonzaga.com.br/wp-content/uploads/2024/11/estacionamento-gonzaga-area-segura.jpg.webp',
    title: 'Área Segura',
    description: 'Monitoramento 24 horas'
  }
];

export default function Gallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    const diff = touchStart - touchEnd;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Conheça Nossa Estrutura</h2>
        
        {/* Video Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          <div className="aspect-video relative overflow-hidden rounded-xl shadow-lg bg-black">
            <video
              className="w-full h-full object-cover"
              controls
              preload="metadata"
              poster="https://estacionamentogonzaga.com.br/wp-content/uploads/2024/11/Ola-Cruzeiristas-1.jpg"
            >
              <source src="https://estacionamentogonzaga.com.br/wp-content/uploads/2024/11/Estacionamento-Gonzaga-Video-Whats.mp4" type="video/mp4" />
            </video>
          </div>

          <div className="flex flex-col justify-center text-center lg:text-left">
            <h3 className="text-2xl font-bold mb-4 text-blue-900">
              Bem-vindo ao Estacionamento Porto Santos
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Oferecemos a melhor estrutura para seu veículo durante o cruzeiro. 
              Nossa equipe altamente treinada e nossas instalações modernas garantem 
              a segurança e o conforto que você merece.
            </p>
          </div>
        </div>

        {/* Gallery */}
        <div className="max-w-md mx-auto">
          <div 
            className="relative aspect-[9/16] rounded-xl shadow-lg overflow-hidden bg-gray-100"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-300 ${
                  index === currentIndex ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ pointerEvents: index === currentIndex ? 'auto' : 'none' }}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6 text-white">
                  <h4 className="font-semibold mb-1 text-center">{image.title}</h4>
                  <p className="text-sm text-white/90 text-center">{image.description}</p>
                </div>
              </div>
            ))}

            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-blue-900 scale-125' : 'bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}