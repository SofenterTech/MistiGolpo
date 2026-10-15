import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Globe, Menu, X, MapPin } from 'lucide-react';
import { useLanguage, Language } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const LANGUAGE_OPTIONS: { value: Language; label: string }[] = [
  { value: 'bn', label: 'বাংলা' },
  { value: 'en', label: 'EN' },
];

const LanguageSwitch: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div
      role="group"
      aria-label={t('ভাষা নির্বাচন করুন', 'Choose language')}
      className="flex items-center gap-1 shrink-0"
    >
      <Globe className="w-3.5 h-3.5 text-white/70" aria-hidden="true" />
      <div className="flex items-center bg-white/10 rounded-full p-0.5">
        {LANGUAGE_OPTIONS.map((opt) => {
          const active = language === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLanguage(opt.value)}
              aria-pressed={active}
              lang={opt.value}
              className={`px-2.5 py-1 rounded-full text-[11px] font-bold leading-none transition-colors ${
                active ? 'bg-white text-[#20134B] shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const Header: React.FC = () => {
  const { t } = useLanguage();
  const { cartCount } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/cakes?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Announcement Bar */}
      <div className="bg-[#20134B] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-3 font-medium">
          <span className="hidden sm:inline shrink-0">📞 +880 1700-000000</span>
          <span className="min-w-0 truncate sm:text-center">
            🚀 {t('সিলেট শহরে দ্রুত ডেলিভারি | ১০০% তাজা কেক', 'Fast Delivery in Sylhet | 100% Fresh Bakery')}
          </span>
          <LanguageSwitch />
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#222222] p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={t('মেনু', 'Menu')}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex flex-col items-start leading-tight group">
          <span className="text-2xl font-bold tracking-tight text-[#E5097F] group-hover:text-[#C40770] transition-colors">
            মিষ্টি গল্প
          </span>
          <span className="text-[10px] tracking-widest text-[#666666] font-semibold uppercase">
            MistiGolpo <span className="text-[#20134B] font-bold">by Shami</span>
          </span>
        </Link>

        {/* Search Bar - Desktop */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <input
            type="text"
            placeholder={t('কেক খুঁজুন (যেমন: চকলেট, জন্মদিন...)', 'Search cakes (e.g., Chocolate, Birthday...)')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F7F8F9] border border-[#E6E2F3] rounded-md py-2 pl-4 pr-10 text-sm focus:outline-none focus:border-[#E5097F] transition-colors"
          />
          <button type="submit" className="absolute right-3 top-2.5 text-[#666666] hover:text-[#E5097F]" aria-label={t('খুঁজুন', 'Search')}>
            <Search className="w-4 h-4" />
          </button>
        </form>

        {/* Action Icons */}
        <div className="flex items-center gap-4">
          <Link to="/track-order" className="hidden sm:flex items-center gap-1 text-xs text-[#666666] hover:text-[#E5097F] font-medium">
            <MapPin className="w-4 h-4 text-[#E5097F]" />
            {t('অর্ডার ট্র্যাক', 'Track Order')}
          </Link>

          {user ? (
            <div className="relative group">
              <button className="flex items-center gap-1.5 text-xs text-[#222222] font-semibold bg-[#F1EEFB] px-3 py-1.5 rounded-full hover:bg-[#E2DEF5]">
                <User className="w-4 h-4 text-[#E5097F]" />
                <span className="max-w-[80px] truncate">{user.full_name}</span>
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#E6E2F3] rounded-lg shadow-lg py-2 hidden group-hover:block z-50">
                {isAdmin && (
                  <Link to="/admin" className="block px-4 py-2 text-xs font-bold text-[#E5097F] hover:bg-[#F1EEFB]">
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
            <Link to="/login" className="text-xs font-bold text-[#E5097F] hover:underline flex items-center gap-1">
              <User className="w-4 h-4" />
              {t('লগইন', 'Login')}
            </Link>
          )}

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2 bg-[#F1EEFB] rounded-full hover:bg-[#E2DEF5] transition-colors" aria-label={t('কার্ট', 'Cart')}>
            <ShoppingBag className="w-5 h-5 text-[#E5097F]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E5097F] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:block bg-white border-t border-[#E6E2F3]">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8 py-2.5 text-sm font-semibold text-[#222222]">
          <Link to="/" className="hover:text-[#E5097F] transition-colors">{t('হোম', 'Home')}</Link>
          <Link to="/cakes" className="hover:text-[#E5097F] transition-colors">{t('কেক সমূহ', 'All Cakes')}</Link>
          <Link to="/cakes?category=birthday-cakes" className="hover:text-[#E5097F] transition-colors">{t('জন্মদিনের কেক', 'Birthday Cakes')}</Link>
          <Link to="/cakes?category=chocolate-cakes" className="hover:text-[#E5097F] transition-colors">{t('চকলেট কেক', 'Chocolate Cakes')}</Link>
          <Link to="/custom-cakes" className="text-[#E5097F] hover:text-[#C40770] transition-colors">{t('কাস্টম কেক', 'Custom Cakes')}</Link>
          <Link to="/about" className="hover:text-[#E5097F] transition-colors">{t('আমাদের গল্প', 'Our Story')}</Link>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#E6E2F3] px-4 py-3 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder={t('কেক খুঁজুন...', 'Search cakes...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F8F9] border border-[#E6E2F3] rounded-md py-2 pl-3 pr-9 text-sm"
            />
            <button type="submit" className="absolute right-3 top-2.5 text-[#666666]" aria-label={t('খুঁজুন', 'Search')}>
              <Search className="w-4 h-4" />
            </button>
          </form>
          <div className="flex flex-col gap-2 font-medium text-sm text-[#222222]">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>{t('হোম', 'Home')}</Link>
            <Link to="/cakes" onClick={() => setMobileMenuOpen(false)}>{t('কেক সমূহ', 'All Cakes')}</Link>
            <Link to="/custom-cakes" onClick={() => setMobileMenuOpen(false)} className="text-[#E5097F] font-bold">{t('কাস্টম কেক', 'Custom Cakes')}</Link>
            <Link to="/track-order" onClick={() => setMobileMenuOpen(false)}>{t('অর্ডার ট্র্যাক', 'Track Order')}</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>{t('আমাদের গল্প', 'Our Story')}</Link>
          </div>
        </div>
      )}
    </header>
  );
};
