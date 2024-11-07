import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Packages from '../components/Packages';
import Gallery from '../components/Gallery';
import Blog from '../components/Blog';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Contact from '../components/Contact';
import ChatBot from '../components/ChatBot';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <Packages />
      <Gallery />
      <Features />
      <Blog />
      <Testimonials />
      <FAQ />
      <Contact />
      <ChatBot />
    </>
  );
};

export default HomePage;