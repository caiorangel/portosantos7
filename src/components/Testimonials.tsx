import React from 'react';

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">O que nossos clientes dizem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 mb-4">
              "Excelente serviço! Transfer pontual e equipe muito atenciosa. Recomendo!"
            </p>
            <p className="font-bold">Maria Silva</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 mb-4">
              "Estacionamento seguro e bem localizado. Ótimo custo-benefício."
            </p>
            <p className="font-bold">João Santos</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <p className="text-gray-600 mb-4">
              "Muito satisfeito com o serviço. Deixei meu carro por 8 dias e foi tudo perfeito."
            </p>
            <p className="font-bold">Pedro Oliveira</p>
          </div>
        </div>
      </div>
    </section>
  );
}