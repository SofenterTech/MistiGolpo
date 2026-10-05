import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Star, Heart, Cake, Award, Truck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const Home: React.FC = () => {
  const { t } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products?is_bestseller=true')
        ]);
        setCategories(catRes.data);
        setBestsellers(prodRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#8B3A3A] to-[#6a2a2a] text-white rounded-3xl mx-4 my-4 overflow-hidden shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
          <div className="space-y-6">
            <span className="inline-block bg-[#F4D6D2]/20 border border-[#F4D6D2]/30 text-[#F4D6D2] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {t('মিষ্টি গল্পে স্বাগতম', 'Welcome to MistiGolpo')}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              {t('আপনার বিশেষ দিন হোক আরও মিষ্টি', 'Make Your Special Day Sweeter')}
            </h1>
            <p className="text-sm md:text-base text-gray-200 leading-relaxed max-w-lg">
              {t(
                'প্রতিটি কেকে লুকিয়ে আছে একটি মিষ্টি গল্প। আমাদের খামারের তাজা উপাদান ও ভালোবাসায় তৈরি কাস্টমাইজড কেক দিয়ে সাজান আপনার উৎসব।',
                'Every cake holds a sweet story. Celebrate your precious moments with our handcrafted cakes made from pure, fresh ingredients.'
              )}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/cakes"
                className="bg-[#D9A441] hover:bg-[#c39134] text-[#2D2523] font-bold px-6 py-3 rounded-full text-sm shadow-md transition-all flex items-center gap-2"
              >
                {t('এখনই অর্ডার করুন', 'Order Now')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/custom-cakes"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-6 py-3 rounded-full text-sm transition-all"
              >
                {t('কাস্টম কেক রিকোয়েস্ট', 'Custom Cake Request')}
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-[#F4D6D2] shadow-2xl transform hover:scale-105 transition-transform duration-500">
              <img
                src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800"
                alt="MistiGolpo Cake"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white p-4 rounded-xl border border-[#F4D6D2] flex flex-col items-center">
          <Cake className="w-8 h-8 text-[#8B3A3A] mb-2" />
          <h4 className="text-xs font-bold text-[#2D2523]">{t('১০০% তাজা তৈরি', '100% Freshly Baked')}</h4>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#F4D6D2] flex flex-col items-center">
          <Truck className="w-8 h-8 text-[#8B3A3A] mb-2" />
          <h4 className="text-xs font-bold text-[#2D2523]">{t('সময়মতো হোম ডেলিভারি', 'Timely Home Delivery')}</h4>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#F4D6D2] flex flex-col items-center">
          <Heart className="w-8 h-8 text-[#8B3A3A] mb-2" />
          <h4 className="text-xs font-bold text-[#2D2523]">{t('হাতে তৈরি কেক', 'Handcrafted with Love')}</h4>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#F4D6D2] flex flex-col items-center">
          <Award className="w-8 h-8 text-[#8B3A3A] mb-2" />
          <h4 className="text-xs font-bold text-[#2D2523]">{t('প্রিমিয়াম কোয়ালিটি', 'Premium Quality')}</h4>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#8B3A3A]">{t('ক্যাটাগরি সমূহ', 'Categories')}</h2>
            <p className="text-xs text-[#756966] mt-1">{t('আপনার পছন্দের ক্যাটাগরি বেছে নিন', 'Choose your favorite cake category')}</p>
          </div>
          <Link to="/cakes" className="text-xs font-bold text-[#8B3A3A] hover:underline flex items-center gap-1">
            {t('সবগুলো দেখুন', 'View All')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/cakes?category=${cat.slug}`}
              className="group bg-white rounded-2xl p-3 text-center border border-[#F4D6D2] hover:border-[#8B3A3A] hover:shadow-md transition-all"
            >
              <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 border-2 border-[#FFF3E8] group-hover:scale-105 transition-transform">
                <img src={cat.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300'} alt={cat.name_en} className="w-full h-full object-cover" />
              </div>
              <h3 className="text-xs font-bold text-[#2D2523] group-hover:text-[#8B3A3A] truncate">
                {t(cat.name_bn, cat.name_en)}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#8B3A3A]">{t('বেস্ট সেলিং কেক', 'Bestseller Cakes')}</h2>
          <p className="text-xs text-[#756966] mt-1">{t('আমাদের সবচেয়ে জনপ্রিয় সুস্বাদু কেক', 'Most popular delicious cakes loved by everyone')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#FFF3E8] border border-[#F4D6D2] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-[#8B3A3A] shrink-0">
            <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500" alt="Founder Sham" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">
              MistiGolpo by Sham
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-[#8B3A3A]">
              {t('আমাদের প্রতিষ্ঠাতা শাম এর গল্প', 'Our Founder Sham\'s Story')}
            </h3>
            <p className="text-xs md:text-sm text-[#756966] leading-relaxed">
              {t(
                'কলেজ শিক্ষার্থী শামের কেক বেকিং এর প্রতি গভীর ভালোবাসা থেকে মিষ্টি গল্পের জন্ম। প্রতিটি উৎসব যেন আরও আনন্দময় ও কেকের মিষ্টি স্বাদে পরিপূর্ণ হয়ে ওঠে - এই লক্ষ্যেই আমাদের পথচলা।',
                'MistiGolpo started from a young college student Sham\'s passionate love for baking. Our goal is to make every celebration full of warmth, joy, and authentic sweetness.'
              )}
            </p>
            <Link to="/about" className="inline-block text-xs font-bold text-[#8B3A3A] hover:underline">
              {t('আরও বিস্তারিত পড়ুন →', 'Read Full Brand Story →')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
