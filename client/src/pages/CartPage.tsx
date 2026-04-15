import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCartStore } from '../store/cartStore';
import EmptyState from '../components/EmptyState';

gsap.registerPlugin(ScrollTrigger);

const CartPage = () => {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const headerRef = useRef<HTMLDivElement>(null);
  const cartContainerRef = useRef<HTMLDivElement>(null);
  const subtotal = getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          ease: 'power3.out',
        });
      }

      gsap.utils.toArray('.cart-item-animate').forEach((item: any, idx: number) => {
        gsap.from(item, {
          opacity: 0,
          x: -30,
          duration: 0.5,
          delay: idx * 0.05,
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            scrub: false,
          },
          ease: 'power3.out',
        });
      });

      if (cartContainerRef.current) {
        gsap.from(cartContainerRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          delay: 0.2,
          ease: 'power3.out',
        });
      }
    });

    return () => ctx.revert();
  }, [items]);

  return (
    <>
      <Helmet><title>Cart | Pravara World Tech</title></Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div ref={headerRef} className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Shopping Cart</h1>
          </div>

          {items.length === 0 ? (
            <EmptyState
              title="Your cart is empty"
              description="Browse our products and add items to your cart."
              action={<Link to="/products" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition mt-2">Browse Products</Link>}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.product._id} className="cart-item-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-5 flex items-start space-x-4 hover:border-blue-500/40 transition">
                    <div className="w-20 h-20 bg-black/40 rounded-lg overflow-hidden shrink-0 border border-blue-500/20">
                      {item.product.images[0] ? (
                        <img src={`/uploads/${item.product.images[0]}`} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">No Image</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product.slug}`} className="font-medium text-white hover:text-yellow-400 line-clamp-1 transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-yellow-400 mt-1">₹{item.product.price.toLocaleString()}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center border border-blue-500/30 rounded-full bg-black/40">
                          <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="p-1.5 hover:bg-blue-500/20 text-gray-400 hover:text-gray-200" aria-label="Decrease">
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-medium text-gray-300">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="p-1.5 hover:bg-blue-500/20 text-gray-400 hover:text-gray-200" aria-label="Increase">
                            <FiPlus className="w-3 h-3" />
                          </button>
                        </div>
                        <button onClick={() => removeItem(item.product._id)} className="text-red-400 hover:text-red-300 p-1" aria-label="Remove">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="font-semibold text-yellow-400">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}

                <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300 transition">
                  Clear Cart
                </button>
              </div>

              <div ref={cartContainerRef} className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6 h-fit sticky top-24">
                <h3 className="font-semibold text-white mb-4">Order Summary</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-400"><dt>Subtotal</dt><dd className="font-medium text-gray-300">₹{subtotal.toLocaleString()}</dd></div>
                  <div className="flex justify-between text-gray-400"><dt>Shipping</dt><dd className="font-medium text-gray-300">{shipping === 0 ? 'Free' : `₹${shipping}`}</dd></div>
                  <div className="flex justify-between text-gray-400"><dt>Tax (18%)</dt><dd className="font-medium text-gray-300">₹{tax.toLocaleString()}</dd></div>
                  <div className="border-t border-blue-500/20 pt-3 flex justify-between">
                    <dt className="font-semibold text-white">Total</dt>
                    <dd className="font-bold text-lg text-yellow-400">₹{total.toLocaleString()}</dd>
                  </div>
                </dl>
                {subtotal < 999 && (
                  <p className="text-xs text-green-400 mt-3">Add ₹{(999 - subtotal).toLocaleString()} more for free shipping!</p>
                )}
                <Link to="/checkout" className="w-full mt-6 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition">
                  <span>Proceed to Checkout</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPage;
