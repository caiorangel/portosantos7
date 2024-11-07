import React, { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="absolute inset-0 bg-white/95 backdrop-blur-md"></div>
      
      <nav className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="relative z-50 flex items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <img 
              src="https://iarazap.com/estacionamentoportosantos.png" 
              alt="Estacionamento Porto Santos" 
              className="h-12 w-auto"
            />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {[
              { label: 'Sobre', href: '#sobre' },
              { label: 'Pacotes', href: '#pacotes' },
              { label: 'Diferenciais', href: '#diferenciais' },
              { label: 'Depoimentos', href: '#depoimentos' },
              { label: 'FAQ', href: '#faq' },
              { label: 'Contato', href: '#contato' }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="nav-link text-gray-700 hover:text-blue-900"
              >
                {item.label}
              </a>
            ))}
            
            <a
              href="tel:+551321389144" 
              className="flex items-center gap-2 bg-blue-900 text-white px-6 py-2.5 
                       rounded-full hover:bg-blue-800 transition-all duration-300 
                       shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Phone size={18} />
              <span className="font-medium">13 2138-9144</span>
            </a>
          </div>

          <button 
            className="md:hidden relative z-50 p-2 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMenuOpen ? (
              <X size={24} className="text-gray-900" />
            ) : (
              <Menu size={24} className="text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`fixed inset-0 bg-white z-40 transition-transform duration-300 transform md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ top: '0', paddingTop: '5rem' }}
        >
          <div className="flex flex-col p-6 space-y-6">
            {[
              { label: 'Sobre', href: '#sobre' },
              { label: 'Pacotes', href: '#pacotes' },
              { label: 'Diferenciais', href: '#diferenciais' },
              { label: 'Depoimentos', href: '#depoimentos' },
              { label: 'FAQ', href: '#faq' },
              { label: 'Contato', href: '#contato' }
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-gray-800 hover:text-blue-900 transition-colors duration-300 
                         font-medium text-lg text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a
              href="tel:+551321389144" 
              className="flex items-center justify-center gap-2 bg-blue-900 text-white 
                       px-6 py-3 rounded-full hover:bg-blue-800 transition-all duration-300
                       shadow-lg hover:shadow-xl mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              <Phone size={18} />
              <span className="font-medium">13 2138-9144</span>
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}