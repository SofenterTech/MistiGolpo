import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Globe, Menu, X, Heart, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { cartCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cakes?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur shadow-sm border-b border-[#F4D6D2]">
      {/* Announcement Bar */}
      <div className="bg-[#8B3A3A] text-white text-xs py-1.5 px-4 text-center font-medium flex justify-between items-center max-w-7xl mx-auto">
        <span className="hidden sm:inline">📞 +880 1700-000000</span>
        <span className="mx-auto sm:mx-0">
          🚀 {t('ঢাকা শহরে দ্রুত ডেলিভারি | ১০০% তাজা কেক', 'Fast Delivery in Dhaka | 100% Fresh Bakery')}
        </span>
        <button
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          className="flex items-center gap-1 font-semibold hover:text-[#F4D6D2] transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          {language === 'bn' ? 'English' : 'বাংলা'}
        </button>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#2D2523] p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex flex-col items-start leading-tight group">
          <span className="text-2xl font-bold tracking-tight text-[#8B3A3A] group-hover:text-[#6a2a2a] transition-colors">
            মিষ্টি গল্প
          </span>
          <span className="text-[10px] tracking-widest text-[#756966] font-semibold uppercase">
            MistiGolpo <span className="text-[#D9A441] font-normal">by Sham</span>
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <input
            type="text"
            placeholder={t('কেক খুঁজুন (যেমন: চকলেট, জন্মদিন...)', 'Search cakes (e.g., Chocolate, Birthday...)')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#8B3A3A] transition-colors"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-[#756966] hover:text-[#8B3A3A]">
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <Link to="/track-order" className="hidden sm:flex items-center gap-1 text-xs text-[#756966] hover:text-[#8B3A3A] font-medium">
            <MapPin className="w-4 h-4 text-[#8B3A3A]" />
            {t('ট্যাক অর্ডার', 'Track Order')}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-xs text-[#2D2523] font-semibold bg-[#FFF3E8] px-3 py-1.5 rounded-full hover:bg-[#F4D6D2]">
                <User className="w-4 h-4 text-[#8B3A3A]" />
                <span className="max-w-[80px] truncate">{user.full_name}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#F4D6D2] rounded-lg shadow-lg py-2 hidden group-hover:block z-50">
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 text-xs font-bold text-[#8B3A3A] hover:bg-[#FFF3E8]">
                    ⚙️ {t('অ্যাডমিন প্যানেল', 'Admin Panel')}
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50"
                >
                  {t('লগআউট', 'Logout')}
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="text-xs font-bold text-[#8B3A3A] hover:underline flex items-center gap-1">
              <User className="w-4 h-4" />
              {t('লগইন', 'Login')}
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2 bg-[#FFF3E8] rounded-full hover:bg-[#F4D6D2] transition-colors">
            <ShoppingBag className="w-5 h-5 text-[#8B3A3A]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#8B3A3A] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:block bg-[#FFF3E8]/60 border-t border-[#F4D6D2]/50">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8 py-2 text-sm font-semibold text-[#2D2523]">
          <Link to="/" className="hover:text-[#8B3A3A] transition-colors">{t('হোম', 'Home')}</Link>
          <Link to="/cakes" className="hover:text-[#8B3A3A] transition-colors">{t('কেক সমূহ', 'All Cakes')}</Link>
          <Link to="/cakes?category=birthday-cakes" className="hover:text-[#8B3A3A] transition-colors">{t('জন্মদিনের কেক', 'Birthday Cakes')}</Link>
          <Link to="/cakes?category=chocolate-cakes" className="hover:text-[#8B3A3A] transition-colors">{t('চকলেট কেক', 'Chocolate Cakes')}</Link>
          <Link to="/custom-cakes" className="hover:text-[#8B3A3A] transition-colors text-[#8B3A3A]">{t('কাস্টম কেক', 'Custom Cakes')}</Link>
          <Link to="/about" className="hover:text-[#8B3A3A] transition-colors">{t('আমাদের গল্প', 'Our Story')}</Link>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#F4D6D2] px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder={t('কেক খুঁজুন...', 'Search cakes...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-lg py-2 pl-3 pr-9 text-sm"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-[#756966]">
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="flex flex-col gap-2 font-medium text-sm">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>{t('হোম', 'Home')}</Link>
            <Link to="/cakes" onClick={() => setMobileMenuOpen(false)}>{t('কেক সমূহ', 'All Cakes')}</Link>
            <Link to="/custom-cakes" onClick={() => setMobileMenuOpen(false)} className="text-[#8B3A3A] font-bold">{t('কাস্টম কেক', 'Custom Cakes')}</Link>
            <Link to="/track-order" onClick={() => setMobileMenuOpen(false)}>{t('ট্যাক অর্ডার', 'Track Order')}</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>{t('আমাদের গল্প', 'Our Story')}</Link>
          </div>
        </div>
      )}
    </header>
  );
};
