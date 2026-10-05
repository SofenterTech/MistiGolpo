import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#2D2523] text-white pt-12 pb-6 border-t-4 border-[#8B3A3A]">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <h3 className="text-2xl font-bold text-[#F4D6D2]">মিষ্টি গল্প</h3>
          <p className="text-xs text-[#D9A441] font-semibold mt-0.5">MistiGolpo by Sham</p>
          <p className="text-xs text-gray-300 mt-3 leading-relaxed">
            {t(
              'প্রতিটি কেকে একটি মিষ্টি গল্প। সেরা মানের উপাদান ও ভালোবাসায় তৈরি প্রিমিয়াম কেক।',
              'A sweet story in every cake. Handcrafted premium cakes made with passion and pure ingredients.'
            )}
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-sm font-bold text-[#D9A441] mb-3">{t('দ্রুত লিংক', 'Quick Links')}</h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><Link to="/cakes" className="hover:text-[#F4D6D2]">{t('কেক ক্যাটালগ', 'Cake Catalog')}</Link></li>
            <li><Link to="/custom-cakes" className="hover:text-[#F4D6D2]">{t('কাস্টম কেক রিকোয়েস্ট', 'Custom Cake Request')}</Link></li>
            <li><Link to="/track-order" className="hover:text-[#F4D6D2]">{t('অর্ডার ট্যাক করুন', 'Track Order')}</Link></li>
            <li><Link to="/about" className="hover:text-[#F4D6D2]">{t('আমাদের গল্প', 'Our Story')}</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-sm font-bold text-[#D9A441] mb-3">{t('জনপ্রিয় ক্যাটাগরি', 'Popular Categories')}</h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><Link to="/cakes?category=birthday-cakes" className="hover:text-[#F4D6D2]">{t('জন্মদিনের কেক', 'Birthday Cakes')}</Link></li>
            <li><Link to="/cakes?category=chocolate-cakes" className="hover:text-[#F4D6D2]">{t('চকলেট কেক', 'Chocolate Cakes')}</Link></li>
            <li><Link to="/cakes?category=red-velvet-cakes" className="hover:text-[#F4D6D2]">{t('রেড ভেলভেট কেক', 'Red Velvet Cakes')}</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-bold text-[#D9A441] mb-3">{t('যোগাযোগ', 'Contact Us')}</h4>
          <div className="space-y-2 text-xs text-gray-300">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#8B3A3A]" /> Dhanmondi, Dhaka, Bangladesh</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-[#8B3A3A]" /> +880 1700-000000</p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-[#8B3A3A]" /> hello@mistigolpo.com</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-gray-800 text-center text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© {new Date().getFullYear()} MistiGolpo by Sham. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> in Dhaka, Bangladesh
        </p>
      </div>
    </footer>
  );
};
