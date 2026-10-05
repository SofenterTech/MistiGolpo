import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { t } = useLanguage();
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-[#FFF3E8] rounded-full flex items-center justify-center mx-auto text-[#8B3A3A]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-[#8B3A3A]">{t('আপনার কার্ট খালি', 'Your Cart is Empty')}</h2>
        <p className="text-xs text-[#756966]">{t('এখনই আমাদের সুস্বাদু কেক সংগ্রহটি ঘুরে দেখুন।', 'Explore our delicious cake collection now.')}</p>
        <Link to="/cakes" className="inline-block bg-[#8B3A3A] text-white font-bold px-6 py-2.5 rounded-full text-xs hover:bg-[#6a2a2a]">
          {t('কেক দেখুন', 'Browse Cakes')}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-[#8B3A3A]">{t('শপিং কার্ট', 'Shopping Cart')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-[#F4D6D2] flex gap-4 items-center">
              <img
                src={item.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300'}
                alt={item.productNameEn}
                className="w-20 h-20 object-cover rounded-xl border border-[#F4D6D2]"
              />
              <div className="flex-1 space-y-1">
                <h3 className="text-sm font-bold text-[#2D2523]">{t(item.productNameBn, item.productNameEn)}</h3>
                {item.sizeBn && (
                  <p className="text-[11px] text-[#756966]">{t('সাইজ:', 'Size:')} {t(item.sizeBn, item.sizeEn || '')}</p>
                )}
                {item.cakeMessage && (
                  <p className="text-[11px] text-[#8B3A3A] italic">"{item.cakeMessage}"</p>
                )}
                <p className="text-xs font-bold text-[#8B3A3A]">৳{item.price}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-[#F4D6D2] rounded-lg overflow-hidden bg-[#FFF9F6]">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2.5 py-1 text-xs font-bold text-[#8B3A3A]">-</button>
                <span className="px-2 text-xs font-bold">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2.5 py-1 text-xs font-bold text-[#8B3A3A]">+</button>
              </div>

              {/* Delete */}
              <button onClick={() => removeFromCart(item.id)} className="text-[#756966] hover:text-red-600 p-2">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button onClick={clearCart} className="text-xs text-red-600 font-semibold hover:underline">
            {t('কার্ট খালি করুন', 'Clear Cart')}
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-3xl border border-[#F4D6D2] h-fit space-y-4">
          <h3 className="font-bold text-sm text-[#8B3A3A] border-b border-[#F4D6D2] pb-3">{t('অর্ডার সারসংক্ষেপ', 'Order Summary')}</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-[#756966]">
              <span>{t('সাবটোটাল', 'Subtotal')}</span>
              <span className="font-bold text-[#2D2523]">৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-[#756966]">
              <span>{t('ডেলিভারি চার্জ (আনুমানিক)', 'Delivery Fee (Est.)')}</span>
              <span className="font-bold text-[#2D2523]">৳৮০ - ৳১৫০</span>
            </div>
            <div className="border-t border-[#F4D6D2] pt-2 flex justify-between font-bold text-sm text-[#8B3A3A]">
              <span>{t('মোট', 'Total')}</span>
              <span>৳{subtotal}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#8B3A3A] hover:bg-[#6a2a2a] text-white font-bold py-3 rounded-full text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            {t('চেকআউটে যান', 'Proceed to Checkout')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
