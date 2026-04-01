import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import type { Address } from '../types';
import Loading from '../components/Loading';

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
      <Helmet><title>Checkout | Asian Cinematics</title></Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Shipping Address</h2>

              {addresses.length > 0 && (
                <div className="space-y-3 mb-4">
                  {addresses.map((addr) => (
                    <label key={addr._id} className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedAddress === addr._id ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="address" checked={selectedAddress === addr._id} onChange={() => { setSelectedAddress(addr._id); setShowNewAddress(false); }} className="mt-1" />
                      <div>
                        <p className="font-medium text-sm">{addr.fullName} <span className="text-gray-400">({addr.label})</span></p>
                        <p className="text-sm text-gray-500">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                        <p className="text-sm text-gray-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                        <p className="text-sm text-gray-500">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <button
                onClick={() => { setShowNewAddress(!showNewAddress); setSelectedAddress(''); }}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                + Add New Address
              </button>

              {showNewAddress && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <input className="input-field" placeholder="Full Name *" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
                  <input className="input-field" placeholder="Phone *" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
                  <input className="input-field sm:col-span-2" placeholder="Address Line 1 *" value={newAddress.addressLine1} onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })} />
                  <input className="input-field sm:col-span-2" placeholder="Address Line 2" value={newAddress.addressLine2} onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })} />
                  <input className="input-field" placeholder="City *" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                  <input className="input-field" placeholder="State *" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
                  <input className="input-field" placeholder="Pincode *" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="space-y-3">
                <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${paymentMethod === 'COD' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <div>
                    <p className="font-medium text-sm">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
                <label className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer ${paymentMethod === 'online' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'}`}>
                  <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                  <div>
                    <p className="font-medium text-sm">Online Payment</p>
                    <p className="text-xs text-gray-500">Pay securely using UPI, Cards, or Net Banking</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="card h-fit sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex justify-between text-sm">
                  <span className="text-gray-600 line-clamp-1 flex-1">{item.product.name} x{item.quantity}</span>
                  <span className="font-medium ml-2">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <dl className="space-y-2 text-sm border-t border-gray-100 pt-3">
              <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd>₹{subtotal.toLocaleString()}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Shipping</dt><dd>{shipping === 0 ? 'Free' : `₹${shipping}`}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Tax (18%)</dt><dd>₹{tax.toLocaleString()}</dd></div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold text-gray-900">
                <dt>Total</dt><dd className="text-lg">₹{total.toLocaleString()}</dd>
              </div>
            </dl>
            <button
              onClick={handlePlaceOrder}
              disabled={loading || (!selectedAddress && !showNewAddress)}
              className="btn-primary w-full mt-6"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
