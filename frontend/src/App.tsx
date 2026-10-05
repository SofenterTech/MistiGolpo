import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Catalog } from './pages/Catalog';
import { ProductDetails } from './pages/ProductDetails';
import { CartPage } from './pages/CartPage';
import { Checkout } from './pages/Checkout';
import { OrderTrack } from './pages/OrderTrack';
import { CustomCake } from './pages/CustomCake';
import { About } from './pages/About';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col justify-between">
              <div>
                <Header />
                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/cakes" element={<Catalog />} />
                    <Route path="/products/:slug" element={<ProductDetails />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/track-order" element={<OrderTrack />} />
                    <Route path="/custom-cakes" element={<CustomCake />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                  </Routes>
                </main>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
