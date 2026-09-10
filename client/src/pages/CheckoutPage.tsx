import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiMapPin, FiPlus, FiCheck, FiLock } from 'react-icons/fi';
import api from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import type { Address } from '../types';
import Loading from '../components/Loading';

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as string;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'online'>('COD');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  // Add address form
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home', fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '',
  });

  // Payment step (online, shown as fallback if the Razorpay modal is dismissed or fails)
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'payment'>('checkout');
  const [orderId, setOrderId] = useState('');
  const [payingNow, setPayingNow] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const subtotal = getTotal();
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18 * 100) / 100;
  const total = subtotal + shipping + tax;

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login?redirect=/checkout'); return; }
    if (items.length === 0) { navigate('/cart'); return; }
    api.get('/addresses').then(r => {
      const list = r.data.data || [];
      setAddresses(list);
      const def = list.find((a: Address) => a.isDefault);
      if (def) setSelectedAddress(def._id);
      else if (list.length > 0) setSelectedAddress(list[0]._id);
    }).catch(() => {}).finally(() => setPageLoading(false));
  }, [isAuthenticated, items.length, navigate]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode)
      return toast.error('Fill all required fields');
    setSavingAddress(true);
    try {
      const { data } = await api.post('/addresses', { ...newAddress, isDefault: addresses.length === 0 });
      const updated = [...addresses, data.data];
      setAddresses(updated);
      setSelectedAddress(data.data._id);
      setShowAddAddress(false);
      setNewAddress({ label: 'Home', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
      toast.success('Address saved');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress && !showAddAddress) return toast.error('Select a delivery address');

    let shippingAddress;
    if (selectedAddress) {
      const addr = addresses.find(a => a._id === selectedAddress);
      if (!addr) return toast.error('Select an address');
      shippingAddress = {
        fullName: addr.fullName, phone: addr.phone,
        addressLine1: addr.addressLine1, addressLine2: addr.addressLine2,
        city: addr.city, state: addr.state, pincode: addr.pincode, country: addr.country || 'India',
      };
    } else {
      shippingAddress = { ...newAddress, country: 'India' };
    }

    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map(i => ({ product: i.product._id, quantity: i.quantity })),
        shippingAddress,
        paymentMethod,
      });
      setOrderId(data.data._id);

      if (paymentMethod === 'online') {
        await openRazorpayCheckout(data.data._id);
      } else {
        clearCart();
        toast.success('Order placed successfully!');
        navigate(`/orders/${data.data._id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayCheckout = async (id: string) => {
    setPayingNow(true);
    try {
      const { data } = await api.post(`/orders/${id}/create-razorpay-order`);
      const { order_id, amount, currency, key } = data.data;

      const razorpay = new window.Razorpay({
        key: key || RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'Pravara World Tech',
        description: 'Order Payment',
        order_id,
        prefill: { name: user?.name, email: user?.email, contact: user?.phone },
        theme: { color: '#eab308' },
        handler: async (response) => {
          try {
            await api.post(`/orders/${id}/verify-payment`, response);
            clearCart();
            setShowSuccessPopup(true);
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Payment verification failed');
            setPaymentStep('payment');
          }
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled', { icon: 'ℹ️' });
            setPaymentStep('payment');
          },
        },
      });

      razorpay.on('payment.failed', (response) => {
        toast.error(response.error.description || 'Payment failed');
        setPaymentStep('payment');
      });

      razorpay.open();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start payment');
      setPaymentStep('payment');
    } finally {
      setPayingNow(false);
    }
  };

  if (pageLoading) return <Loading />;

  // ─── PAYMENT STEP (fallback after modal is dismissed/fails) ───────────────
  if (paymentStep === 'payment') {
    return (
      <>
        <Helmet><title>Payment | Pravara World Tech</title></Helmet>

        <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30 py-8 px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
              <p className="text-gray-400 mt-1">Your order is placed. Complete payment of <span className="text-yellow-400 font-semibold">₹{total.toLocaleString()}</span> to confirm it.</p>
            </div>

            <div className="bg-gray-900 border border-blue-500/20 rounded-2xl p-8 text-center space-y-5">
              <p className="text-gray-300 text-sm">Payment was not completed. You can retry securely via Razorpay.</p>
              <button
                onClick={() => openRazorpayCheckout(orderId)}
                disabled={payingNow}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 text-black font-bold py-3.5 rounded-xl transition"
              >
                {payingNow ? 'Opening Payment...' : `Pay ₹${total.toLocaleString()}`}
              </button>
              <button
                onClick={() => navigate(`/orders/${orderId}`)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition"
              >
                View Order
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-gray-900 border border-blue-500/20 rounded-2xl p-5">
              <h3 className="text-white font-semibold mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-400"><span>Subtotal</span><span className="text-gray-300">₹{subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-gray-400"><span>Shipping</span><span className="text-gray-300">{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
                <div className="flex justify-between text-gray-400"><span>Tax (18%)</span><span className="text-gray-300">₹{tax.toLocaleString()}</span></div>
                <div className="border-t border-blue-500/20 pt-2 flex justify-between font-bold text-white">
                  <span>Total</span><span className="text-yellow-400 text-lg">₹{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Success Popup */}
        {showSuccessPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-gray-900 border border-green-500/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheck className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-3">Payment Successful!</h2>
              <p className="text-gray-400 text-sm mb-6">
                Your order has been confirmed.
              </p>
              <button
                onClick={() => navigate(`/orders/${orderId}`)}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition"
              >
                View My Order
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // ─── CHECKOUT STEP ─────────────────────────────────────────────────────────
  return (
    <>
      <Helmet><title>Checkout | Pravara World Tech</title></Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-6">

              {/* ── Shipping Address ── */}
              <div className="bg-gray-900 border border-blue-500/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-white font-semibold flex items-center gap-2">
                    <FiMapPin className="text-blue-400 w-5 h-5" /> Delivery Address
                  </h2>
                  <button
                    onClick={() => setShowAddAddress(p => !p)}
                    className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition font-medium"
                  >
                    <FiPlus className="w-4 h-4" />
                    {showAddAddress ? 'Cancel' : 'Add New'}
                  </button>
                </div>

                {/* Saved Addresses */}
                {addresses.length > 0 && !showAddAddress && (
                  <div className="space-y-3">
                    {addresses.map(addr => (
                      <label
                        key={addr._id}
                        className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedAddress === addr._id
                            ? 'border-yellow-400/60 bg-yellow-400/5'
                            : 'border-gray-700 hover:border-gray-500 bg-black/20'
                        }`}
                      >
                        <input type="radio" name="address" value={addr._id}
                          checked={selectedAddress === addr._id}
                          onChange={() => setSelectedAddress(addr._id)}
                          className="mt-1 accent-yellow-400" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-semibold text-sm">{addr.label || 'Address'}</span>
                            {addr.isDefault && (
                              <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-yellow-500/40">Default</span>
                            )}
                          </div>
                          <p className="text-gray-300 text-sm">{addr.fullName} · {addr.phone}</p>
                          <p className="text-gray-400 text-sm">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                          <p className="text-gray-400 text-sm">{addr.city}, {addr.state} {addr.pincode}</p>
                        </div>
                        {selectedAddress === addr._id && <FiCheck className="text-yellow-400 w-5 h-5 mt-1 flex-shrink-0" />}
                      </label>
                    ))}
                  </div>
                )}

                {addresses.length === 0 && !showAddAddress && (
                  <div className="text-center py-6">
                    <p className="text-gray-400 text-sm mb-3">No saved addresses. Add one to continue.</p>
                    <button onClick={() => setShowAddAddress(true)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      + Add Address
                    </button>
                  </div>
                )}

                {/* Add New Address Form */}
                {showAddAddress && (
                  <form onSubmit={handleAddAddress} className="space-y-3 mt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Label</label>
                        <select value={newAddress.label} onChange={e => setNewAddress(p => ({ ...p, label: e.target.value }))}
                          className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition">
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Full Name *</label>
                        <input type="text" placeholder="Full name" value={newAddress.fullName}
                          onChange={e => setNewAddress(p => ({ ...p, fullName: e.target.value }))}
                          className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Phone *</label>
                      <input type="tel" placeholder="Phone number" value={newAddress.phone}
                        onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition" required />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Address Line 1 *</label>
                      <input type="text" placeholder="House no, Street, Area" value={newAddress.addressLine1}
                        onChange={e => setNewAddress(p => ({ ...p, addressLine1: e.target.value }))}
                        className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition" required />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Landmark (optional)</label>
                      <input type="text" placeholder="Landmark" value={newAddress.addressLine2}
                        onChange={e => setNewAddress(p => ({ ...p, addressLine2: e.target.value }))}
                        className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">City *</label>
                        <input type="text" placeholder="City" value={newAddress.city}
                          onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))}
                          className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition" required />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">State *</label>
                        <input type="text" placeholder="State" value={newAddress.state}
                          onChange={e => setNewAddress(p => ({ ...p, state: e.target.value }))}
                          className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition" required />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Pincode *</label>
                        <input type="text" placeholder="Pincode" value={newAddress.pincode}
                          onChange={e => setNewAddress(p => ({ ...p, pincode: e.target.value }))}
                          className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-yellow-400 transition" required />
                      </div>
                    </div>
                    <button type="submit" disabled={savingAddress}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition">
                      {savingAddress ? 'Saving...' : 'Save & Use This Address'}
                    </button>
                  </form>
                )}
              </div>

              {/* ── Payment Method ── */}
              <div className="bg-gray-900 border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-5">Payment Method</h2>

                <div className="space-y-3">
                  {/* COD */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD' ? 'border-yellow-400/60 bg-yellow-400/5' : 'border-gray-700 hover:border-gray-500 bg-black/20'
                  }`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="accent-yellow-400" />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">💵</span>
                      <div>
                        <p className="text-white font-semibold text-sm">Cash on Delivery</p>
                        <p className="text-gray-400 text-xs">Pay when your order arrives</p>
                      </div>
                    </div>
                    {paymentMethod === 'COD' && <FiCheck className="text-yellow-400 w-5 h-5 flex-shrink-0" />}
                  </label>

                  {/* Online */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'online' ? 'border-yellow-400/60 bg-yellow-400/5' : 'border-gray-700 hover:border-gray-500 bg-black/20'
                  }`}>
                    <input type="radio" name="payment" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="accent-yellow-400" />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">💳</span>
                      <div>
                        <p className="text-white font-semibold text-sm">Online Payment</p>
                        <p className="text-gray-400 text-xs">Pay securely via UPI, Cards, Netbanking &amp; Wallets (Razorpay)</p>
                      </div>
                    </div>
                    {paymentMethod === 'online' && <FiCheck className="text-yellow-400 w-5 h-5 flex-shrink-0" />}
                  </label>
                </div>

                {paymentMethod === 'online' && (
                  <div className="mt-4 bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 text-sm text-gray-300 flex items-start gap-2">
                    <FiLock className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span>You'll be redirected to Razorpay's secure checkout to pay <span className="text-yellow-400 font-semibold">₹{total.toLocaleString()}</span>. We never see or store your card, UPI, or bank details.</span>
                  </div>
                )}
              </div>

              {/* ── Cart Items ── */}
              <div className="bg-gray-900 border border-blue-500/20 rounded-2xl p-6">
                <h2 className="text-white font-semibold mb-4">Items ({items.length})</h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.product._id} className="flex items-center gap-4">
                      {item.product.images?.[0] && (
                        <img src={item.product.images[0]} alt={item.product.name}
                          className="w-14 h-14 rounded-xl object-cover bg-gray-800 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-white font-semibold text-sm whitespace-nowrap">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT – Order Summary */}
            <div className="space-y-4">
              <div className="bg-gray-900 border border-blue-500/20 rounded-2xl p-6 sticky top-6">
                <h3 className="text-white font-semibold text-lg mb-5">Order Summary</h3>

                <div className="space-y-3 text-sm mb-5">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-gray-300">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-green-400 font-medium' : 'text-gray-300'}>
                      {shipping === 0 ? 'Free' : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Tax (18%)</span>
                    <span className="text-gray-300">₹{tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-blue-500/20 pt-3 flex justify-between font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-400 text-xl">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {subtotal > 999 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4 text-xs text-green-400 font-medium text-center">
                    🎉 You saved ₹99 on shipping!
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || (!selectedAddress && !showAddAddress)}
                  className="w-full flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 text-black font-bold py-3.5 rounded-xl transition text-sm"
                >
                  {loading ? (
                    'Placing Order...'
                  ) : paymentMethod === 'online' ? (
                    <>
                      <FiLock className="w-4 h-4" />
                      Pay with Razorpay
                    </>
                  ) : (
                    'Place Order (COD)'
                  )}
                </button>

                {paymentMethod === 'online' && (
                  <p className="text-center text-gray-500 text-[11px] mt-3 flex items-center justify-center gap-1.5">
                    <FiLock className="w-3 h-3" /> Payments secured by Razorpay · 256-bit encryption
                  </p>
                )}

                <p className="text-center text-gray-600 text-xs mt-3">
                  By placing the order you agree to our terms of service
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;
