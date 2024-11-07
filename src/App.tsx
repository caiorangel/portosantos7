import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CheckoutPage from './pages/CheckoutPage';
import AdminPage from './pages/AdminPage';
import BlogPost from './pages/BlogPost';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<AdminPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </main>
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Estacionamento Porto Santos. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;