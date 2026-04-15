import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import type { Address } from '../types';
import Loading from '../components/Loading';

gsap.registerPlugin(ScrollTrigger);

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'online'>('COD');
  const [loading, setLoading] = useState(false);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '', label: 'Home',
  });
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const subtotal = getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    if (items.length === 0) {
      navigate('/cart');
      return;
    }
    api.get('/addresses').then((r) => {
      setAddresses(r.data.data || []);
      const defaultAddr = (r.data.data || []).find((a: Address) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr._id);
    }).catch(() => {});
  }, [isAuthenticated, items.length, navigate]);

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

      if (contentRef.current) {
        gsap.from(contentRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.6,
          delay: 0.1,
          ease: 'power3.out',
        });
      }

      gsap.utils.toArray('.checkout-section-animate').forEach((section: any) => {
        gsap.from(section, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            scrub: false,
          },
          ease: 'power3.out',
        });
      });
    });

    return () => ctx.revert();
  }, [items]);

  const handlePlaceOrder = async () => {
    let shippingAddress;

    if (selectedAddress) {
      const addr = addresses.find((a) => a._id === selectedAddress);
      if (!addr) return toast.error('Select an address');
      shippingAddress = {
        fullName: addr.fullName, phone: addr.phone,
        addressLine1: addr.addressLine1, addressLine2: addr.addressLine2,
        city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country,
      };
    } else {
      if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
        return toast.error('Fill all required address fields');
      }
      shippingAddress = newAddress;

      try {
        await api.post('/addresses', { ...newAddress, isDefault: addresses.length === 0 });
      } catch { /* continue with order */ }
    }

    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
        shippingAddress,
        paymentMethod,
      });

      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.data._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Checkout | Pravara World Tech</title></Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div ref={headerRef}>
            <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>
          </div>

        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="checkout-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
              <h2 className="font-semibold text-white mb-4">Shipping Address</h2>

              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map((addr) => (
                    <label key={addr._id} className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedAddress === addr._id ? 'border-yellow-400 bg-yellow-400/10' : 'border-blue-500/20 hover:border-blue-500/40'}`}>
                      <input type="radio" name="address" checked={selectedAddress === addr._id} onChange={() => { setSelectedAddress(addr._id); setShowNewAddress(false); }} className="mt-1" />
                      <div>
                        <p className="font-medium text-sm text-white">{addr.fullName} <span className="text-gray-400">({addr.label})</span></p>
                        <p className="text-sm text-gray-400">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                        <p className="text-sm text-gray-400">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-sm text-gray-400">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <button
                onClick={() => { setShowNewAddress(!showNewAddress); setSelectedAddress(''); }}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition"
              >
                + Add New Address
              </button>

              {showNewAddress && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <input className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition" placeholder="Full Name *" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                  <input className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition" placeholder="Phone *" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                  <input className="sm:col-span-2 bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition" placeholder="Address Line 1 *" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
                  <input className="sm:col-span-2 bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition" placeholder="Address Line 2" value={newAddress.addressLine2} onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })} />
                  <input className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition" placeholder="City *" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                  <input className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition" placeholder="State *" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                  <input className="bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition" placeholder="Pincode *" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="checkout-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
              <h2 className="font-semibold text-white mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-yellow-400 bg-yellow-400/10' : 'border-blue-500/20 hover:border-blue-500/40'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <div>
                    <p className="font-medium text-sm text-white">Cash on Delivery</p>
                    <p className="text-xs text-gray-400">Pay when you receive your order</p>
                  </div>
                </label>
                <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-yellow-400 bg-yellow-400/10' : 'border-blue-500/20 hover:border-blue-500/40'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                  <div>
                    <p className="font-medium text-sm text-white">Online Payment</p>
                    <p className="text-xs text-gray-400">Pay securely using UPI, Cards, or Net Banking</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="checkout-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6 h-fit sticky top-24">
            <h3 className="font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between text-sm">
                  <span className="text-gray-400 line-clamp-1 flex-1">{item.product.name} x{item.quantity}</span>
                  <span className="font-medium text-gray-300 ml-2">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <dl className="space-y-2 text-sm border-t border-blue-500/20 pt-3">
              <div className="flex justify-between text-gray-400"><dt>Subtotal</dt><dd className="text-gray-300">₹{subtotal.toLocaleString()}</dd></div>
              <div className="flex justify-between text-gray-400"><dt>Shipping</dt><dd className="text-gray-300">{shipping === 0 ? 'Free' : `₹${shipping}`}</dd></div>
              <div className="flex justify-between text-gray-400"><dt>Tax (18%)</dt><dd className="text-gray-300">₹{tax.toLocaleString()}</dd></div>
              <div className="border-t border-blue-500/20 pt-2 flex justify-between font-semibold text-white">
                <dt>Total</dt><dd className="text-lg text-yellow-400">₹{total.toLocaleString()}</dd>
              </div>
            </dl>
            <button
              onClick={handlePlaceOrder}
              disabled={loading || (!selectedAddress && !showNewAddress)}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;
