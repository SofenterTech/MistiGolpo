import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Search, CheckCircle2, Clock, Truck, Package, HeartHandshake } from 'lucide-react';

export const OrderTrack: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTrack = async (num: string) => {
    if (!num) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/orders/track/${num.trim()}`);
      setOrder(res.data);
    } catch (err: any) {
      setError(t('অর্ডারটি পাওয়া যায়নি। অনুগ্রহ করে সঠিক অর্ডার নম্বর প্রদান করুন।', 'Order not found. Please check order number.'));
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('order')) {
      fetchTrack(searchParams.get('order')!);
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTrack(orderNumber);
  };

  const steps = [
    { key: 'PENDING', labelBn: 'অর্ডার জমা হয়েছে', labelEn: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', labelBn: 'কনফার্ম করা হয়েছে', labelEn: 'Confirmed', icon: CheckCircle2 },
    { key: 'PREPARING', labelBn: 'তৈরি করা হচ্ছে', labelEn: 'Preparing', icon: Package },
    { key: 'OUT_FOR_DELIVERY', labelBn: 'ডেলিভারির জন্য বের হয়েছে', labelEn: 'Out for Delivery', icon: Truck },
    { key: 'DELIVERED', labelBn: 'ডেলিভারি সম্পন্ন', labelEn: 'Delivered', icon: HeartHandshake },
  ];

  const getStepIndex = (status: string) => {
    const idx = steps.findIndex(s => s.key === status);
    return idx === -1 ? 0 : idx;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-[#E5097F]">{t('অর্ডার ট্র্যাকিং', 'Track Your Order')}</h1>
        <p className="text-xs text-[#666666]">{t('আপনার কেকের অবস্থান জেনে নিন খুব সহজেই', 'Stay updated on your cake status in real time')}</p>
      </div>

      {/* Search Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
        <input
          type="text"
          placeholder={t('অর্ডার নম্বর (যেমন: MG-20260327-1234)', 'Order ID (e.g., MG-20260327-1234)')}
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          className="flex-1 bg-white border border-[#E6E2F3] rounded-md px-4 py-2.5 text-xs focus:outline-none focus:border-[#E5097F]"
        />
        <button type="submit" className="bg-[#E5097F] text-white font-bold px-6 py-2.5 rounded-md text-xs hover:bg-[#C40770]">
          {t('ট্র্যাক করুন', 'Track')}
        </button>
      </form>

      {error && <div className="text-center text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">{error}</div>}

      {order && (
        <div className="bg-white p-6 rounded-xl border border-[#E6E2F3] shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-[#E6E2F3] pb-4 text-xs">
            <div>
              <p className="text-[#666666]">{t('অর্ডার নম্বর:', 'Order ID:')}</p>
              <p className="font-extrabold text-sm text-[#E5097F]">{order.order_number}</p>
            </div>
            <div className="text-right">
              <p className="text-[#666666]">{t('ডেলিভারির তারিখ:', 'Delivery Date:')}</p>
              <p className="font-bold text-[#222222]">{order.delivery_date} ({order.delivery_slot})</p>
            </div>
          </div>

          {/* Stepper Status */}
          <div className="py-4">
            <div className="grid grid-cols-5 gap-2 text-center">
              {steps.map((step, idx) => {
                const currentIdx = getStepIndex(order.order_status);
                const isDone = idx <= currentIdx;
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex flex-col items-center space-y-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDone ? 'bg-[#E5097F] text-white shadow-md' : 'bg-[#F7F8F9] text-[#666666] border border-[#E6E2F3]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold ${isDone ? 'text-[#E5097F]' : 'text-[#666666]'}`}>
                      {t(step.labelBn, step.labelEn)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
