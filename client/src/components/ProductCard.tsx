import { Link } from 'react-router-dom';
import { useState } from 'react';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiPlus, FiMinus } from 'react-icons/fi';

const ProductCard = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock <= 0) {
      toast.error('Out of stock');
      return;
    }
    addItem(product);
    setQuantity(1);
    toast.success('Added to cart');
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (quantity < product.stock) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      addItem(product, newQuantity - quantity);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Link to={`/products/${product.slug}`} className="group">
      <div className="bg-black border border-blue-500/20 rounded-lg overflow-hidden hover:border-yellow-400/50 transition-all duration-300">
        <div className="aspect-square bg-gradient-to-br from-blue-900/20 to-purple-900/20 relative overflow-hidden">
          {product.images[0] ? (
            <img
              src={`/uploads/${product.images[0]}`}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <FiShoppingCart className="w-10 h-10" />
            </div>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-medium">
                Out of Stock
              </span>
            </div>
          )}
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-semibold px-2.5 py-1 rounded-full">
              {Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}% OFF
            </span>
          )}
        </div>
        <div className="p-5">
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1.5">
            {typeof product.category === 'object' ? product.category.name : ''}
          </p>
          <h3 className="font-semibold text-white text-[15px] line-clamp-2 mb-3 leading-snug group-hover:text-yellow-400 transition-colors duration-200">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-yellow-400">₹{product.price.toLocaleString()}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-sm text-gray-500 line-through">₹{product.comparePrice.toLocaleString()}</span>
              )}
            </div>
            {quantity === 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="px-4 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                aria-label="Add to cart"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-600/40 rounded-full px-2 py-1">
                <button
                  onClick={handleDecrement}
                  className="p-1 hover:bg-blue-600/30 rounded-full text-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <FiMinus className="w-3 h-3" />
                </button>
                <span className="px-2 text-white font-semibold text-xs">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  disabled={quantity >= product.stock}
                  className="p-1 hover:bg-blue-600/30 rounded-full text-white transition-colors disabled:opacity-50"
                  aria-label="Increase quantity"
                >
                  <FiPlus className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-gray-400 mt-3">Only {product.stock} left in stock</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
