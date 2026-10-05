import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, ArrowLeft, Check, AlertCircle } from 'lucide-react';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [cakeMessage, setCakeMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/${slug}`);
        setProduct(res.data);
        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedVariant(res.data.variants[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <div className="text-center py-20 text-xs text-[#756966]">{t('লোড হচ্ছে...', 'Loading product details...')}</div>;
  if (!product) return <div className="text-center py-20 text-sm font-bold text-[#8B3A3A]">{t('কেক পাওয়া যায়নি', 'Product not found')}</div>;

  const basePrice = product.discount_price || product.base_price;
  const finalUnitPrice = basePrice + (selectedVariant ? selectedVariant.price_adjustment : 0);

  const handleAddToCart = () => {
    addToCart({
      id: `${product.id}-${selectedVariant ? selectedVariant.id : 'default'}`,
      productId: product.id,
      productNameBn: product.name_bn,
      productNameEn: product.name_en,
      price: finalUnitPrice,
      quantity,
      imageUrl: product.images?.[0]?.image_url,
      sizeBn: selectedVariant?.size_bn,
      sizeEn: selectedVariant?.size_en,
      cakeMessage
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-xs font-bold text-[#8B3A3A] hover:underline">
        <ArrowLeft className="w-4 h-4" /> {t('ফিরে যান', 'Go Back')}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-3xl p-6 md:p-8 border border-[#F4D6D2] shadow-sm">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden border border-[#F4D6D2] bg-[#FFF9F6]">
            <img
              src={product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'}
              alt={product.name_en}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-[#2D2523]">{t(product.name_bn, product.name_en)}</h1>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-2xl font-extrabold text-[#8B3A3A]">৳{finalUnitPrice}</span>
              {product.discount_price && (
                <span className="text-sm text-[#756966] line-through">৳{product.base_price}</span>
              )}
            </div>
          </div>

          <p className="text-xs text-[#756966] leading-relaxed">
            {t(product.description_bn || '', product.description_en || '')}
          </p>

          {/* Variants / Size */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#2D2523]">{t('সাইজ বেছে নিন:', 'Select Size:')}</label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      selectedVariant?.id === v.id
                        ? 'bg-[#8B3A3A] text-white border-[#8B3A3A]'
                        : 'bg-white text-[#2D2523] border-[#F4D6D2] hover:border-[#8B3A3A]'
                    }`}
                  >
                    {t(v.size_bn, v.size_en)} (+৳{v.price_adjustment})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cake Message Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#2D2523]">
              {t('কেকের উপরের বার্তা (ঐচ্ছিক):', 'Cake Top Message (Optional):')}
            </label>
            <input
              type="text"
              placeholder={t('যেমন: হ্যাপি বার্থডে সামিন!', 'e.g., Happy Birthday Samin!')}
              value={cakeMessage}
              onChange={(e) => setCakeMessage(e.target.value)}
              className="w-full bg-[#FFF9F6] border border-[#F4D6D2] rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#8B3A3A]"
            />
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-[#2D2523]">{t('পরিমাণ:', 'Quantity:')}</span>
            <div className="flex items-center border border-[#F4D6D2] rounded-xl overflow-hidden bg-[#FFF9F6]">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 font-bold text-[#8B3A3A]">-</button>
              <span className="px-4 text-xs font-bold">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="px-3 py-1 font-bold text-[#8B3A3A]">+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-4">
            <button
              onClick={handleAddToCart}
              className={`flex-1 py-3 px-6 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
                added ? 'bg-[#3F7D58] text-white' : 'bg-[#8B3A3A] hover:bg-[#6a2a2a] text-white'
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
              {added ? t('কার্টে যোগ করা হয়েছে!', 'Added to Cart!') : t('কার্টে যোগ করুন', 'Add to Cart')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
