import React from 'react';

export default function FAQ() {
  return (
    <section id="faq" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold mb-2">Como funciona o transfer?</h3>
            <p className="text-gray-600">
              Oferecemos transfer particular de ida e volta para o Terminal, incluído em todos os pacotes.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold mb-2">O estacionamento é coberto?</h3>
            <p className="text-gray-600">
              Sim, todas as vagas são cobertas e demarcadas.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold mb-2">Qual o horário de funcionamento?</h3>
            <p className="text-gray-600">
              Funcionamos 24 horas por dia, 7 dias por semana.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}