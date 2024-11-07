import React from 'react';
import { MapPin, Phone, MessageCircleMore } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contato" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Contato</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Localização</h3>
              <p className="flex items-center gap-2 text-gray-600">
                <MapPin className="shrink-0" size={20} />
                <span>R. Cláudio Doneux, 54 - Gonzaga, Santos - SP, 11060-460</span>
              </p>
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Contatos</h3>
              <div className="space-y-4">
                <a href="tel:+551321389144" className="flex items-center gap-2 text-gray-600 hover:text-blue-900">
                  <Phone className="shrink-0" size={20} />
                  <span>+55 13 2138-9144</span>
                </a>
                <a href="https://wa.me/5513991260211" className="flex items-center gap-2 text-gray-600 hover:text-blue-900">
                  <MessageCircleMore className="shrink-0" size={20} />
                  <span>+55 13 99126-0211</span>
                </a>
              </div>
            </div>
          </div>
          <div className="h-96 rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3645.6768!2d-46.3334!3d-23.9673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce03a75!2sR.+Cl%C3%A1udio+Doneux%2C+54+-+Gonzaga%2C+Santos+-+SP%2C+11060-460!5e0!3m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}