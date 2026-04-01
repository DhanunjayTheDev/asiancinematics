import { Link } from 'react-router-dom';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import { FiShoppingCart } from 'react-icons/fi';

const ProductCard = ({ product }: { product: Product }) => {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) {
      toast.error('Out of stock');
      return;
    }
    addItem(product);
    toast.success('Added to cart');
  };

  return (
    <Link to={`/products/${product.slug}`} className="group">
      <div className="card hover:shadow-md transition-shadow duration-200 overflow-hidden p-0">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.images[0] ? (
            <img
              src={`/uploads/${product.images[0]}`}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-primary-600 font-medium mb-1">
            {typeof product.category === 'object' ? product.category.name : ''}
          </p>
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-gray-400 line-through">₹{product.comparePrice.toLocaleString()}</span>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="p-2 rounded-lg bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors disabled:opacity-50"
              aria-label="Add to cart"
            >
              <FiShoppingCart className="w-4 h-4" />
            </button>
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-orange-500 mt-2">Only {product.stock} left!</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
