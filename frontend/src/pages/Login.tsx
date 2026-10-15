import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const { t } = useLanguage();
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ full_name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let ok = false;
      if (isRegister) {
        ok = await register(form.full_name, form.email, form.password, form.phone);
      } else {
        ok = await login(form.email, form.password);
      }

      if (ok) {
        navigate('/');
      } else {
        setError(t('অবৈধ ইমেইল বা পাসওয়ার্ড', 'Invalid email or password'));
      }
    } catch {
      setError(t('একটি সমস্যা দেখা দিয়েছে', 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-6 rounded-xl border border-[#E6E2F3] shadow-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#E5097F]">
            {isRegister ? t('নতুন অ্যাকাউন্ট তৈরি করুন', 'Create Account') : t('স্বাগতম!', 'Welcome Back!')}
          </h1>
        </div>

        {error && <div className="bg-red-50 text-red-600 border border-red-200 text-xs p-3 rounded-xl">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block font-bold text-[#222222] mb-1">{t('পূর্ণ নাম', 'Full Name')}</label>
              <input
                type="text"
                required
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                className="w-full bg-[#F7F8F9] border border-[#E6E2F3] rounded-xl p-2.5"
              />
            </div>
          )}

          <div>
            <label className="block font-bold text-[#222222] mb-1">{t('ইমেইল ঠিকানা', 'Email Address')}</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#F7F8F9] border border-[#E6E2F3] rounded-xl p-2.5"
            />
          </div>

          <div>
            <label className="block font-bold text-[#222222] mb-1">{t('পাসওয়ার্ড', 'Password')}</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-[#F7F8F9] border border-[#E6E2F3] rounded-xl p-2.5"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E5097F] hover:bg-[#C40770] text-white font-bold py-3 rounded-md shadow-md"
          >
            {loading ? t('প্রসেস হচ্ছে...', 'Processing...') : isRegister ? t('রেজিস্টার করুন', 'Register') : t('লগইন করুন', 'Login')}
          </button>
        </form>

        <div className="text-center text-xs text-[#666666]">
          <button onClick={() => setIsRegister(!isRegister)} className="text-[#E5097F] font-bold hover:underline">
            {isRegister ? t('অ্যাকাউন্ট আছে? লগইন করুন', 'Have an account? Login') : t('নতুন অ্যাকাউন্ট খুলুন', 'Create new account')}
          </button>
        </div>
      </div>
    </div>
  );
};
