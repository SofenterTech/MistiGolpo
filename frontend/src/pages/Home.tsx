import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Heart, Cake, Award, Truck } from 'lucide-react';
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
      <section className="bg-[#F1EEFB]">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-block bg-white text-[#E5097F] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {t('মিষ্টি গল্পে স্বাগতম', 'Welcome to MistiGolpo')}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-[#000305]">
              {t('আপনার বিশেষ দিন হোক', 'Make Your Special Day')}{' '}
              <span className="text-[#E5097F]">{t('আরও মিষ্টি', 'Sweeter')}</span>
            </h1>
            <p className="text-sm md:text-base text-[#555555] leading-relaxed max-w-lg mx-auto md:mx-0">
              {t(
                'প্রতিটি কেকে লুকিয়ে আছে একটি মিষ্টি গল্প। আমাদের খামারের তাজা উপাদান ও ভালোবাসায় তৈরি কাস্টমাইজড কেক দিয়ে সাজান আপনার উৎসব।',
                'Every cake holds a sweet story. Celebrate your precious moments with our handcrafted cakes made from pure, fresh ingredients.'
              )}
            </p>
            <div className="flex flex-wrap gap-3 pt-2 justify-center md:justify-start">
              <Link
                to="/cakes"
                className="bg-[#E5097F] hover:bg-[#C40770] text-white font-semibold px-6 py-3 rounded-md text-sm shadow-sm transition-colors flex items-center gap-2"
              >
                {t('এখনই অর্ডার করুন', 'Order Now')} <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/custom-cakes"
                className="bg-[#20134B] hover:bg-[#14093A] text-white font-semibold px-6 py-3 rounded-md text-sm shadow-sm transition-colors"
              >
                {t('কাস্টম কেক রিকোয়েস্ট', 'Custom Cake Request')}
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-8 border-white shadow-xl transform hover:scale-105 transition-transform duration-500">
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
        <div className="bg-white p-4 rounded-lg border border-[#E6E2F3] flex flex-col items-center">
          <Cake className="w-8 h-8 text-[#E5097F] mb-2" />
          <h4 className="text-xs font-bold text-[#222222]">{t('১০০% তাজা তৈরি', '100% Freshly Baked')}</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#E6E2F3] flex flex-col items-center">
          <Truck className="w-8 h-8 text-[#E5097F] mb-2" />
          <h4 className="text-xs font-bold text-[#222222]">{t('সময়মতো হোম ডেলিভারি', 'Timely Home Delivery')}</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#E6E2F3] flex flex-col items-center">
          <Heart className="w-8 h-8 text-[#E5097F] mb-2" />
          <h4 className="text-xs font-bold text-[#222222]">{t('হাতে তৈরি কেক', 'Handcrafted with Love')}</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-[#E6E2F3] flex flex-col items-center">
          <Award className="w-8 h-8 text-[#E5097F] mb-2" />
          <h4 className="text-xs font-bold text-[#222222]">{t('প্রিমিয়াম কোয়ালিটি', 'Premium Quality')}</h4>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-[#E2DEF5] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 space-y-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[#000305]">
              {t('পছন্দের', 'Shop By')} <span className="text-[#E5097F]">{t('ক্যাটাগরি', 'Category')}</span>
            </h2>
            <p className="text-xs text-[#555555]">{t('আপনার পছন্দের ক্যাটাগরি বেছে নিন', 'Choose your favorite cake category')}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/cakes?category=${cat.slug}`}
                className="group bg-white rounded-lg p-3 text-center hover:shadow-md transition-all"
              >
                <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-2 border-2 border-[#F1EEFB] group-hover:scale-105 transition-transform">
                  <img src={cat.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300'} alt={cat.name_en} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xs font-bold text-[#222222] group-hover:text-[#E5097F] truncate">
                  {t(cat.name_bn, cat.name_en)}
                </h3>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/cakes"
              className="inline-flex items-center gap-1 bg-[#E5097F] hover:bg-[#C40770] text-white text-xs font-semibold px-5 py-2.5 rounded-md transition-colors"
            >
              {t('সবগুলো দেখুন', 'View All')} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-8 space-y-1">
          <h2 className="text-2xl md:text-3xl font-bold text-[#000305]">
            {t('বেস্ট সেলিং', 'Bestseller')} <span className="text-[#E5097F]">{t('কেক', 'Cakes')}</span>
          </h2>
          <p className="text-xs text-[#666666]">{t('আমাদের সবচেয়ে জনপ্রিয় সুস্বাদু কেক', 'Most popular delicious cakes loved by everyone')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#F1EEFB] rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="w-40 h-40 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-[#E5097F] shrink-0">
            <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500" alt="Founder Shamia" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <span className="text-xs font-bold text-[#20134B] uppercase tracking-wider">
              MistiGolpo by Shami
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-[#000305]">
              {t('আমাদের প্রতিষ্ঠাতা ', 'Our Founder ')}
              <span className="text-[#E5097F]">{t('শামিয়ার গল্প', 'Shamia\'s Story')}</span>
            </h3>
            <p className="text-xs md:text-sm text-[#555555] leading-relaxed">
              {t(
                'কলেজ শিক্ষার্থী শামিয়ার কেক বেকিং এর প্রতি গভীর ভালোবাসা থেকে মিষ্টি গল্পের জন্ম। প্রতিটি উৎসব যেন আরও আনন্দময় ও কেকের মিষ্টি স্বাদে পরিপূর্ণ হয়ে ওঠে - এই লক্ষ্যেই আমাদের পথচলা।',
                'MistiGolpo started from a young college student Shamia\'s passionate love for baking. Our goal is to make every celebration full of warmth, joy, and authentic sweetness.'
              )}
            </p>
            <Link to="/about" className="inline-block text-xs font-bold text-[#E5097F] hover:underline">
              {t('আরও বিস্তারিত পড়ুন →', 'Read Full Brand Story →')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
