import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { Package, DollarSign, Users, ShoppingBag } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axios.get('/api/admin/dashboard'),
          axios.get('/api/admin/orders')
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const handleUpdateStatus = async (orderId: int, newStatus: string) => {
    try {
      await axios.put(`/api/admin/orders/${orderId}/status?status_str=${newStatus}`);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: newStatus } : o));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20 text-xs text-[#756966]">{t('অ্যাডমিন তথ্য লোড হচ্ছে...', 'Loading admin dashboard...')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#8B3A3A]">{t('অ্যাডমিন ড্যাশবোর্ড', 'Admin Dashboard')}</h1>
        <p className="text-xs text-[#756966]">{t('মিষ্টি গল্পের বিক্রয় ও অর্ডার পরিচালনা করুন', 'Manage MistiGolpo sales, products, and customer orders')}</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#F4D6D2]">
            <span className="text-xs text-[#756966]">{t('মোট বিক্রয়', 'Total Revenue')}</span>
            <p className="text-xl font-extrabold text-[#8B3A3A]">৳{stats.total_revenue}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#F4D6D2]">
            <span className="text-xs text-[#756966]">{t('মোট অর্ডার', 'Total Orders')}</span>
            <p className="text-xl font-extrabold text-[#2D2523]">{stats.total_orders}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#F4D6D2]">
            <span className="text-xs text-[#756966]">{t('পেন্ডিং অর্ডার', 'Pending Orders')}</span>
            <p className="text-xl font-extrabold text-[#D9A441]">{stats.pending_orders}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#F4D6D2]">
            <span className="text-xs text-[#756966]">{t('মোট কেক', 'Total Products')}</span>
            <p className="text-xl font-extrabold text-[#3F7D58]">{stats.total_products}</p>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#F4D6D2] p-6 space-y-4">
        <h2 className="font-bold text-sm text-[#8B3A3A]">{t('সাম্প্রতিক অর্ডার সমূহ', 'Recent Customer Orders')}</h2>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#F4D6D2] text-[#756966]">
                <th className="py-2 px-3">Order ID</th>
                <th className="py-2 px-3">Customer</th>
                <th className="py-2 px-3">Phone</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-gray-100 hover:bg-[#FFF9F6]">
                  <td className="py-2 px-3 font-bold text-[#8B3A3A]">{o.order_number}</td>
                  <td className="py-2 px-3">{o.customer_name}</td>
                  <td className="py-2 px-3">{o.customer_phone}</td>
                  <td className="py-2 px-3 font-bold">৳{o.total_amount}</td>
                  <td className="py-2 px-3 font-semibold">{o.order_status}</td>
                  <td className="py-2 px-3">
                    <select
                      value={o.order_status}
                      onChange={(e) => handleUpdateStatus(o.id, e.target.value)}
                      className="bg-[#FFF9F6] border border-[#F4D6D2] rounded p-1 text-[11px]"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PREPARING">PREPARING</option>
                      <option value="OUT_FOR_DELIVERY">OUT_FOR_DELIVERY</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
