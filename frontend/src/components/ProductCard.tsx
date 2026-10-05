import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export const ProductCard: React.FC<{ product: any }> = ({ product }) => {
  const { t } = useLanguage();
  const { addToCart } = useCart();

  const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url ||
                       product.images?.[0]?.image_url ||
                       'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const effectivePrice = product.discount_price ? product.discount_price : product.base_price;
    addToCart({
      id: `${product.id}-default`,
      productId: product.id,
      productNameBn: product.name_bn,
      productNameEn: product.name_en,
      price: effectivePrice,
      quantity: 1,
      imageUrl: primaryImage
    });
  };

  return (
    <Link
      to={`/products/${product.slug}`}
      className="group bg-white rounded-2xl border border-[#F4D6D2] overflow-hidden shadow-sm hover:shadow-md hover:border-[#8B3A3A] transition-all flex flex-col justify-between"
    >
      <div>
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-[#FFF9F6]">
          <img
            src={primaryImage}
            alt={product.name_en}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {product.discount_price && (
            <span className="absolute top-3 left-3 bg-[#8B3A3A] text-white text-[10px] font-bold px-2 py-1 rounded-md">
              {Math.round(((product.base_price - product.discount_price) / product.base_price) * 100)}% OFF
            </span>
          )}
        </div>

        {/* Info */}
        <div className="p-4 space-y-1.5">
          <h3 className="font-bold text-sm text-[#2D2523] group-hover:text-[#8B3A3A] transition-colors line-clamp-1">
            {t(product.name_bn, product.name_en)}
          </h3>
          <p className="text-xs text-[#756966] line-clamp-2">
            {t(product.description_bn || '', product.description_en || '')}
          </p>
        </div>
      </div>

      {/* Footer / Price & CTA */}
      <div className="p-4 pt-0 flex items-center justify-between border-t border-transparent">
        <div>
          <span className="text-sm font-extrabold text-[#8B3A3A]">
            ৳{product.discount_price || product.base_price}
          </span>
          {product.discount_price && (
            <span className="text-xs text-[#756966] line-through ml-1.5">
              ৳{product.base_price}
            </span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-[#FFF3E8] hover:bg-[#8B3A3A] text-[#8B3A3A] hover:text-white p-2 rounded-full transition-colors"
          title={t('কার্টে যোগ করুন', 'Add to Cart')}
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </Link>
  );
};
