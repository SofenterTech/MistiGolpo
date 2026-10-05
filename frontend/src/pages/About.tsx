import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[#8B3A3A]">{t('আমাদের গল্প', 'Our Story')}</h1>
        <p className="text-xs text-[#D9A441] font-bold uppercase tracking-widest">MistiGolpo by Sham</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-[#F4D6D2] shadow-sm space-y-6 text-xs text-[#2D2523] leading-relaxed">
        <p>
          {t(
            'মিষ্টি গল্প (MistiGolpo) একটি আধুনিক, প্রিমিয়াম ও উৎসবমুখর বাংলাদেশি কেক ব্রান্ড। এটি প্রতিষ্ঠা করেছেন তরুণ কলেজ শিক্ষার্থী শাম।',
            'MistiGolpo is a modern, premium, Bengali-first celebration cake brand founded by a young college student, Sham.'
          )}
        </p>
        <p>
          {t(
            'প্রতিটি বিশেষ মুহূর্ত ও উৎসবকে মিষ্টি স্বাদে স্মরণীয় করে রাখাই আমাদের মূল কাজ। আমাদের প্রতিটি কেক তৈরি করা হয় সেরা মানের তাজা উপাদান ও দক্ষ হাতের স্পর্শে।',
            'Our mission is to turn every special occasion and celebration into sweet memories. Every cake is handcrafted with pure fresh ingredients and artistic care.'
          )}
        </p>
      </div>
    </div>
  );
};
