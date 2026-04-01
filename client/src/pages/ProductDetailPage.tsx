import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiShoppingCart, FiMinus, FiPlus, FiCheck } from 'react-icons/fi';
import api from '../lib/api';
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
        const { data } = await api.get(`/products/${slug}`);
        setProduct(data.data);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) return <Loading />;
  if (!product) return <div className="text-center py-20 text-gray-500">Product not found</div>;

  const handleAddToCart = () => {
    addItem(product, quantity);
    toast.success('Added to cart');
  };

  return (
    <>
      <Helmet>
        <title>{product.name} | Asian Cinematics</title>
        <meta name="description" content={product.shortDescription || product.description.slice(0, 160)} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
              {product.images[selectedImage] ? (
                <img
                  src={`/uploads/${product.images[selectedImage]}`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg">
                  No Image
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-primary-500' : 'border-gray-200'}`}
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
              <span className="text-sm text-primary-600 font-medium">{product.category.name}</span>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mt-1 mb-4">{product.name}</h1>

            <div className="flex items-baseline space-x-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
              {product.comparePrice && product.comparePrice > product.price && (
                <span className="text-lg text-gray-400 line-through">₹{product.comparePrice.toLocaleString()}</span>
              )}
            </div>

            <div className="flex items-center space-x-2 mb-6">
              {product.stock > 0 ? (
                <>
                  <FiCheck className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">In Stock ({product.stock} available)</span>
                </>
              ) : (
                <span className="text-sm text-red-500 font-medium">Out of Stock</span>
              )}
            </div>

            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-50"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-gray-50"
                    aria-label="Increase quantity"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={handleAddToCart} className="btn-primary flex items-center space-x-2">
                  <FiShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            )}

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>

            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <div className="border-t border-gray-100 pt-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                <dl className="divide-y divide-gray-100">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="py-2 flex">
                      <dt className="w-1/3 text-sm text-gray-500">{key}</dt>
                      <dd className="w-2/3 text-sm text-gray-900">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {product.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="badge bg-gray-100 text-gray-600">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
