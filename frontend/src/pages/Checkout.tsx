import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { CheckCircle2, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { t } = useLanguage();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    delivery_division: 'Dhaka',
    delivery_district: 'Dhaka',
    delivery_area: 'Dhanmondi',
    delivery_address: '',
    delivery_date: new Date().toISOString().split('T')[0],
    delivery_slot: '10:00 AM - 02:00 PM',
    payment_method: 'COD',
    coupon_code: ''
  });

  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [orderCreated, setOrderCreated] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deliveryFee = form.delivery_district === 'Dhaka' ? 80 : 150;
  const totalAmount = Math.max(0, subtotal + deliveryFee - discount);

  const handleApplyCoupon = async () => {
    if (!form.coupon_code) return;
    try {
      const res = await axios.post('/api/coupons/validate', {
        code: form.coupon_code,
        cart_total: subtotal
      });
      setDiscount(res.data.discount_amount);
      setCouponApplied(true);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid coupon code');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customer_name || !form.customer_phone || !form.delivery_address) {
      setError(t('অনুগ্রহ করে নাম, ফোন নম্বর ও সঠিক ঠিকানা প্রদান করুন।', 'Please fill name, phone, and delivery address.'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderData = {
        session_or_user_id: 'guest',
        customer_name: form.customer_name,
        customer_phone: form.customer_phone,
        customer_email: form.customer_email || undefined,
        delivery_division: form.delivery_division,
        delivery_district: form.delivery_district,
        delivery_area: form.delivery_area,
        delivery_address: form.delivery_address,
        delivery_date: form.delivery_date,
        delivery_slot: form.delivery_slot,
        payment_method: form.payment_method,
        coupon_code: couponApplied ? form.coupon_code : undefined,
        items: items.map(i => ({
          product_id: i.productId,
          quantity: i.quantity,
          cake_message: i.cakeMessage
        }))
      };

      const res = await axios.post('/api/orders', orderData);
      setOrderCreated(res.data);
      clearCart();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (orderCreated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-[#8B3A3A]">
          {t('ধন্যবাদ! আপনার অর্ডারটি সফলভাবে জমা হয়েছে।', 'Thank you! Your order has been placed.')}
        </h1>
        <p className="text-sm font-semibold text-[#2D2523]">
          {t('অর্ডার আইডি:', 'Order ID:')} <span className="text-[#8B3A3A] font-extrabold">{orderCreated.order_number}</span>
        </p>
        <div className="bg-white p-6 rounded-2xl border border-[#F4D6D2] text-left text-xs space-y-2">
          <p><strong>{t('গ্রাহকের নাম:', 'Customer:')}</strong> {orderCreated.customer_name}</p>
          <p><strong>{t('মোবাইল:', 'Phone:')}</strong> {orderCreated.customer_phone}</p>
          <p><strong>{t('ঠিকানা:', 'Address:')}</strong> {orderCreated.delivery_address}</p>
          <p><strong>{t('ডেলিভারির তারিখ:', 'Delivery Date:')}</strong> {orderCreated.delivery_date} ({orderCreated.delivery_slot})</p>
          <p><strong>{t('সর্বমোট মূল্য:', 'Total Amount:')}</strong> ৳{orderCreated.total_amount}</p>
        </div>
        <button
          onClick={() => navigate(`/track-order?order=${orderCreated.order_number}`)}
          className="bg-[#8B3A3A] text-white font-bold px-8 py-3 rounded-full text-xs hover:bg-[#6a2a2a]"
        >
          {t('অর্ডার ট্যাক করুন', 'Track Your Order')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-[#8B3A3A]">{t('চেকআউট', 'Checkout')}</h1>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Fields */}
        <div className="lg:col-span-2 space-y-6 bg-white p-6 rounded-3xl border border-[#F4D6D2]">
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#8B3A3A] border-b border-[#F4D6D2] pb-2">
              ১. {t('ব্যক্তিগত তথ্য', 'Personal Information')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D2523] mb-1">{t('আপনার নাম *', 'Full Name *')}</label>
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
                  className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5 focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2D2523] mb-1">{t('ফোন নম্বর *', 'Phone Number *')}</label>
                <input
                  type="tel"
                  required
                  placeholder="01700000000"
                  value={form.customer_phone}
                  onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
                  className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#8B3A3A] border-b border-[#F4D6D2] pb-2">
              ২. {t('ডেলিভারি ঠিকানা ও সময়', 'Delivery Address & Slot')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D2523] mb-1">{t('বিভাগ', 'Division')}</label>
                <input
                  type="text"
                  value={form.delivery_division}
                  onChange={(e) => setForm({ ...form, delivery_division: e.target.value })}
                  className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2D2523] mb-1">{t('জেলা', 'District')}</label>
                <select
                  value={form.delivery_district}
                  onChange={(e) => setForm({ ...form, delivery_district: e.target.value })}
                  className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
                >
                  <option value="Dhaka">Dhaka (ঢাকা)</option>
                  <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                  <option value="Sylhet">Sylhet (সিলেট)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#2D2523] mb-1">{t('এলাকা', 'Area')}</label>
                <input
                  type="text"
                  value={form.delivery_area}
                  onChange={(e) => setForm({ ...form, delivery_area: e.target.value })}
                  className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-bold text-[#2D2523] mb-1">{t('সম্পূর্ণ ঠিকানা *', 'Full Address *')}</label>
              <textarea
                required
                rows={2}
                placeholder={t('বাসা/রোড নম্বর, ল্যান্ডমার্ক...', 'House/Road No, Landmark...')}
                value={form.delivery_address}
                onChange={(e) => setForm({ ...form, delivery_address: e.target.value })}
                className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-[#2D2523] mb-1">{t('ডেলিভারির তারিখ', 'Delivery Date')}</label>
                <input
                  type="date"
                  value={form.delivery_date}
                  onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
                  className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
                />
              </div>
              <div>
                <label className="block font-bold text-[#2D2523] mb-1">{t('সময় স্লট', 'Time Slot')}</label>
                <select
                  value={form.delivery_slot}
                  onChange={(e) => setForm({ ...form, delivery_slot: e.target.value })}
                  className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
                >
                  <option>10:00 AM - 02:00 PM</option>
                  <option>02:00 PM - 06:00 PM</option>
                  <option>06:00 PM - 09:00 PM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-[#8B3A3A] border-b border-[#F4D6D2] pb-2">
              ৩. {t('পেমেন্ট মাধ্যম', 'Payment Method')}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {['COD', 'BKASH', 'NAGAD', 'CARD'].map((pm) => (
                <button
                  key={pm}
                  type="button"
                  onClick={() => setForm({ ...form, payment_method: pm })}
                  className={`p-3 rounded-xl border text-center font-bold transition-all ${
                    form.payment_method === pm
                      ? 'bg-[#8B3A3A] text-white border-[#8B3A3A]'
                      : 'bg-white text-[#2D2523] border-[#F4D6D2]'
                  }`}
                >
                  {pm === 'COD' ? 'ক্যাশ অন ডেলিভারি' : pm}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-white p-6 rounded-3xl border border-[#F4D6D2] h-fit space-y-4">
          <h3 className="font-bold text-sm text-[#8B3A3A] border-b border-[#F4D6D2] pb-3">{t('মূল্য বিবরণী', 'Payment Details')}</h3>

          {/* Coupon */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('কুপন কোড (যেমন: MISTI10)', 'Coupon code')}
              value={form.coupon_code}
              onChange={(e) => setForm({ ...form, coupon_code: e.target.value })}
              className="flex-1 bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2 text-xs uppercase"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="bg-[#D9A441] text-[#2D2523] font-bold px-3 text-xs rounded-xl hover:bg-[#c39134]"
            >
              {t('প্রয়োগ', 'Apply')}
            </button>
          </div>

          <div className="space-y-2 text-xs pt-2">
            <div className="flex justify-between text-[#756966]">
              <span>{t('সাবটোটাল', 'Subtotal')}</span>
              <span>৳{subtotal}</span>
            </div>
            <div className="flex justify-between text-[#756966]">
              <span>{t('ডেলিভারি চার্জ', 'Delivery Fee')}</span>
              <span>৳{deliveryFee}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 font-bold">
                <span>{t('ডিসকাউন্ট', 'Discount')}</span>
                <span>-৳{discount}</span>
              </div>
            )}
            <div className="border-t border-[#F4D6D2] pt-2 flex justify-between font-extrabold text-sm text-[#8B3A3A]">
              <span>{t('সর্বমোট মূল্য', 'Total Payable')}</span>
              <span>৳{totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B3A3A] hover:bg-[#6a2a2a] text-white font-bold py-3.5 rounded-full text-xs shadow-md transition-all"
          >
            {loading ? t('প্রসেস হচ্ছে...', 'Processing Order...') : t('অর্ডার নিশ্চিত করুন', 'Confirm Order')}
          </button>
        </div>
      </form>
    </div>
  );
};
