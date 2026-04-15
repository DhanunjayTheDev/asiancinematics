import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiShoppingCart, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const cacheKey = `product_${slug}`;
        const cacheTTL = 15 * 60 * 1000; // 15 minutes for product details
        
        // Try to get from cache first
        let cachedProduct = cacheManager.get<Product>(cacheKey);
        if (cachedProduct) {
          setProduct(cachedProduct);
          setLoading(false);
          return;
        }
        
        // Check for pending request
        let productPromise = cacheManager.getPendingRequest<any>(cacheKey);
        if (!productPromise) {
          productPromise = api.get(`/products/${slug}`);
          cacheManager.setPendingRequest(cacheKey, productPromise);
        }
        
        const { data } = await productPromise;
        
        // Store in cache
        cacheManager.set(cacheKey, data.data, cacheTTL);
        setProduct(data.data);
        
        // Clear pending request
        cacheManager.clearPendingRequest(cacheKey);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <Loading />;
  if (!product) return <div className="min-h-screen bg-black flex items-center justify-center text-center text-gray-400">Product not found</div>;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success('Added to cart');
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Pravara World Tech</title>
        <meta name="description" content={product.shortDescription || product.description.slice(0, 160)} />
      </Helmet>

      <div className="min-h-screen bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Images */}
            <div>
              <div className="aspect-square bg-gray-800 rounded-xl overflow-hidden mb-6 border border-blue-500/20">
                {product.images[selectedImage] ? (
                  <img
                    src={`/uploads/${product.images[selectedImage]}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">
                    No Image
                  </div>
                )}
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-blue-400' : 'border-blue-500/30'}`}
                    >
                      <img src={`/uploads/${img}`} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {typeof product.category === 'object' && (
                <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded-full mb-4">
                  <span className="text-sm font-semibold text-blue-400">{product.category.name}</span>
                </div>
              )}
              <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2 mb-6">{product.name}</h1>

              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-bold text-yellow-400">₹{product.price.toLocaleString()}</span>
                {product.comparePrice && product.comparePrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">₹{product.comparePrice.toLocaleString()}</span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-8">
                {product.stock > 0 ? (
                  <>
                    <FiCheck className="w-5 h-5 text-green-400" />
                    <span className="text-base text-green-400 font-semibold">In Stock ({product.stock} available)</span>
                  </>
                ) : (
                  <span className="text-base text-red-400 font-semibold">Out of Stock</span>
                )}
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center border-2 border-blue-500/30 bg-blue-900/20 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-blue-500/20 text-white"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-2 font-bold text-white text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-3 hover:bg-blue-500/20 text-white"
                      aria-label="Increase quantity"
                    >
                      <FiPlus className="w-5 h-5" />
                    </button>
                  </div>
                  <button onClick={handleAddToCart} className="flex-1 flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">
                    <FiShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              )}

              <div className="border-t border-blue-500/20 pt-8">
                <h3 className="font-bold text-white mb-4 text-lg">Description</h3>
                <div className="text-gray-300 text-base leading-relaxed whitespace-pre-line">
                  {product.description}
                </div>
              </div>

              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="border-t border-blue-500/20 pt-8 mt-8">
                  <h3 className="font-bold text-white mb-4 text-lg">Specifications</h3>
                  <dl className="divide-y divide-blue-500/20">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="py-3 flex">
                        <dt className="w-1/3 text-base text-gray-400">{key}</dt>
                        <dd className="w-2/3 text-base text-white font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {product.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-3">
                  {product.tags.map((tag) => (
                    <span key={tag} className="px-4 py-2 bg-blue-500/20 border border-blue-500/40 text-blue-400 text-sm font-semibold rounded-full">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
