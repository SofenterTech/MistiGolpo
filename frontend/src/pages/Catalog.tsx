import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/ProductCard';
import { Filter, Search } from 'lucide-react';

export const Catalog: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const sortBy = searchParams.get('sort') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get('/api/categories'),
          axios.get('/api/products', {
            params: {
              category_slug: selectedCategory || undefined,
              search: searchQuery || undefined,
              sort_by: sortBy || undefined
            }
          })
        ]);
        setCategories(catRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="border-b border-[#F4D6D2] pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#8B3A3A]">
            {searchQuery
              ? t(`"${searchQuery}" এর অনুসন্ধান ফলাফল`, `Search results for "${searchQuery}"`)
              : selectedCategory
              ? t('ক্যাটাগরি কেক সমূহ', 'Category Cakes')
              : t('সব কেক সমূহ', 'All Cakes')}
          </h1>
          <p className="text-xs text-[#756966] mt-1">
            {t(`${products.length} টি সুস্বাদু কেক পাওয়া গিয়েছে`, `Found ${products.length} delicious cakes`)}
          </p>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#756966]">{t('সাজান:', 'Sort By:')}</span>
          <select
            value={sortBy}
            onChange={(e) => {
              searchParams.set('sort', e.target.value);
              setSearchParams(searchParams);
            }}
            className="bg-white border border-[#F4D6D2] rounded-lg px-3 py-1.5 text-xs text-[#2D2523] focus:outline-none"
          >
            <option value="">{t('নতুন থেকে পুরাতন', 'Newest')}</option>
            <option value="price_asc">{t('দাম: কম থেকে বেশি', 'Price: Low to High')}</option>
            <option value="price_desc">{t('দাম: বেশি থেকে কম', 'Price: High to Low')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Category Sidebar */}
        <div className="bg-white p-5 rounded-2xl border border-[#F4D6D2] h-fit space-y-4">
          <h3 className="font-bold text-sm text-[#8B3A3A] flex items-center gap-2">
            <Filter className="w-4 h-4" /> {t('ক্যাটাগরি', 'Categories')}
          </h3>
          <div className="space-y-1 text-xs">
            <button
              onClick={() => {
                searchParams.delete('category');
                setSearchParams(searchParams);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                !selectedCategory ? 'bg-[#8B3A3A] text-white' : 'hover:bg-[#FFF3E8] text-[#2D2523]'
              }`}
            >
              {t('সকল কেক', 'All Cakes')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  searchParams.set('category', cat.slug);
                  setSearchParams(searchParams);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat.slug ? 'bg-[#8B3A3A] text-white' : 'hover:bg-[#FFF3E8] text-[#2D2523]'
                }`}
              >
                {t(cat.name_bn, cat.name_en)}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-12 text-xs text-[#756966]">
              {t('লোড হচ্ছে...', 'Loading cakes...')}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#F4D6D2] p-8 space-y-2">
              <p className="text-sm font-bold text-[#8B3A3A]">{t('কোন কেক পাওয়া যায়নি', 'No cakes found')}</p>
              <p className="text-xs text-[#756966]">{t('অন্য কোনো ক্যাটাগরি বা কীওয়ার্ড দিয়ে চেষ্টা করুন।', 'Try selecting another category or search term.')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
