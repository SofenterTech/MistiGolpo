import React, { useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Cake, Upload, CheckCircle2 } from 'lucide-react';

export const CustomCake: React.FC = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    flavor: 'Chocolate Truffle',
    weight: '2 Pound',
    cake_message: '',
    delivery_date: new Date().toISOString().split('T')[0],
    special_instructions: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/custom-cakes', form);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
        <h1 className="text-2xl font-bold text-[#8B3A3A]">{t('রিকোয়েস্ট জমা হয়েছে!', 'Request Received!')}</h1>
        <p className="text-xs text-[#756966]">
          {t('ধন্যবাদ! আমাদের টিম আপনার পছন্দের কেকের ডিজাইনের তথ্য নিয়ে খুব শীঘ্রই আপনার সাথে যোগাযোগ করবে।', 'Thank you! Our team will contact you shortly regarding your custom cake design.')}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">{t('বিশেষ ডিজাইন কেক', 'Custom Design Cake')}</span>
        <h1 className="text-2xl font-bold text-[#8B3A3A]">{t('আপনার স্বপ্নের কাস্টম কেক অর্ডার করুন', 'Order Your Custom Cake')}</h1>
        <p className="text-xs text-[#756966]">{t('আপনার পছন্দমতো ফ্লেভার, সাইজ ও ডিজাইন নির্বাচন করুন', 'Choose your custom flavor, weight, and design specifications')}</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-3xl border border-[#F4D6D2] shadow-sm space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-[#2D2523] mb-1">{t('আপনার নাম *', 'Full Name *')}</label>
            <input
              type="text"
              required
              value={form.customer_name}
              onChange={(e) => setForm({ ...form, customer_name: e.target.value })}
              className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
            />
          </div>
          <div>
            <label className="block font-bold text-[#2D2523] mb-1">{t('ফোন নম্বর *', 'Phone Number *')}</label>
            <input
              type="tel"
              required
              value={form.customer_phone}
              onChange={(e) => setForm({ ...form, customer_phone: e.target.value })}
              className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-[#2D2523] mb-1">{t('ফ্লেভার বেছে নিন', 'Select Flavor')}</label>
            <select
              value={form.flavor}
              onChange={(e) => setForm({ ...form, flavor: e.target.value })}
              className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
            >
              <option>Chocolate Truffle</option>
              <option>Red Velvet</option>
              <option>Vanilla Strawberry</option>
              <option>Black Forest</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-[#2D2523] mb-1">{t('ওজন/সাইজ', 'Weight / Size')}</label>
            <select
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
            >
              <option>1 Pound</option>
              <option>2 Pound</option>
              <option>3 Pound</option>
              <option>5 Pound Custom</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-bold text-[#2D2523] mb-1">{t('কেকের বার্তা', 'Cake Top Message')}</label>
          <input
            type="text"
            value={form.cake_message}
            onChange={(e) => setForm({ ...form, cake_message: e.target.value })}
            className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
          />
        </div>

        <div>
          <label className="block font-bold text-[#2D2523] mb-1">{t('বিশেষ নির্দেশনা', 'Special Instructions')}</label>
          <textarea
            rows={3}
            value={form.special_instructions}
            onChange={(e) => setForm({ ...form, special_instructions: e.target.value })}
            className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl p-2.5"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#8B3A3A] hover:bg-[#6a2a2a] text-white font-bold py-3 rounded-full shadow-md"
        >
          {loading ? t('জমা হচ্ছে...', 'Submitting...') : t('রিকোয়েস্ট পাঠান', 'Submit Custom Request')}
        </button>
      </form>
    </div>
  );
};
