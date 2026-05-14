import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiMapPin, FiPlus, FiCheck, FiUpload, FiX } from 'react-icons/fi';
import api from '../lib/api';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import type { Address } from '../types';
import Loading from '../components/Loading';
import qrImage from '../assets/qr.jpeg';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

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

  // Payment step (online)
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'payment'>('checkout');
  const [orderId, setOrderId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
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
        setPaymentStep('payment');
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

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB');
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setScreenshotPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitPayment = async () => {
    if (!utrNumber) return toast.error('Enter UTR / reference number');
    if (!screenshotFile) return toast.error('Upload payment screenshot');

    setSubmittingPayment(true);
    try {
      await api.put(`/orders/${orderId}/payment`, {
        utrNumber,
        paymentScreenshot: screenshotPreview,
      });
      clearCart();
      setShowSuccessPopup(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmittingPayment(false);
    }
  };

  if (pageLoading) return <Loading />;

  // ─── PAYMENT STEP ──────────────────────────────────────────────────────────
  if (paymentStep === 'payment') {
    return (
      <>
        <Helmet><title>Payment | Pravara World Tech</title></Helmet>

        <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30 py-8 px-4">
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Complete Payment</h1>
              <p className="text-gray-400 mt-1">Scan the QR code and pay <span className="text-yellow-400 font-semibold">₹{total.toLocaleString()}</span></p>
            </div>

            {/* QR Card */}
            <div className="bg-gray-900 border border-blue-500/20 rounded-2xl p-8 text-center">
              <h2 className="text-white font-semibold text-lg mb-6">Scan & Pay via UPI</h2>
              <div className="inline-block bg-white p-3 rounded-xl mb-4">
                <img src={qrImage} alt="Payment QR" className="w-56 h-56 object-contain" />
              </div>
              <p className="text-gray-400 text-sm mb-1">UPI ID: <span className="font-mono text-yellow-400">9849697886@okhdfcbank</span></p>
              <p className="text-white font-bold text-lg mt-2">₹{total.toLocaleString()}</p>
              <p className="text-gray-500 text-xs mt-1">Pay exactly this amount</p>
            </div>

            {/* Payment Proof Form */}
            <div className="bg-gray-900 border border-blue-500/20 rounded-2xl p-6 space-y-5">
              <h2 className="text-white font-semibold text-lg">Upload Payment Proof</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  UTR / Reference Number <span className="text-yellow-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="12-digit UTR number from payment receipt"
                  value={utrNumber}
                  onChange={e => setUtrNumber(e.target.value)}
                  className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Screenshot <span className="text-yellow-400">*</span>
                </label>
                <label className="block w-full cursor-pointer">
                  <div className="bg-black/40 border border-blue-500/30 border-dashed rounded-xl p-6 text-center hover:border-yellow-400/60 hover:bg-blue-900/10 transition">
                    {screenshotPreview ? (
                      <div className="relative inline-block">
                        <img src={screenshotPreview} alt="Preview" className="h-40 rounded-lg mx-auto" />
                        <button type="button" onClick={e => { e.preventDefault(); setScreenshotFile(null); setScreenshotPreview(''); }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          <FiX className="w-3 h-3" />
                        </button>
                        <p className="text-xs text-gray-400 mt-2">Click to change</p>
                      </div>
                    ) : (
                      <>
                        <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Click to upload screenshot</p>
                        <p className="text-xs text-gray-600 mt-1">JPG, PNG up to 5MB</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotChange} />
                </label>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/20 rounded-xl p-4">
                <p className="text-sm text-gray-300">
                  <span className="font-semibold text-white">📝 Note:</span> Admin will verify your payment within 24 hours and confirm your order.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setPaymentStep('checkout')}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 rounded-xl transition">
                  Back
                </button>
                <button
                  onClick={handleSubmitPayment}
                  disabled={submittingPayment || !utrNumber || !screenshotFile}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 text-black font-bold py-3 rounded-xl transition"
                >
                  {submittingPayment ? 'Submitting...' : 'Submit Payment'}
                </button>
              </div>
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
              <h2 className="text-xl font-bold text-white mb-3">Payment Submitted!</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-2">
                We will verify your payment and update you soon.
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Your order is confirmed and pending payment verification. You'll receive an update within 24 hours.
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
                      <span className="text-2xl">📱</span>
                      <div>
                        <p className="text-white font-semibold text-sm">Online Payment (UPI/QR)</p>
                        <p className="text-gray-400 text-xs">Pay via UPI · QR code shown after placing order</p>
                      </div>
                    </div>
                    {paymentMethod === 'online' && <FiCheck className="text-yellow-400 w-5 h-5 flex-shrink-0" />}
                  </label>
                </div>

                {paymentMethod === 'online' && (
                  <div className="mt-4 bg-blue-900/20 border border-blue-500/20 rounded-xl p-4 text-sm text-gray-300">
                    📲 After placing the order, scan the QR code to pay <span className="text-yellow-400 font-semibold">₹{total.toLocaleString()}</span> and upload your payment screenshot to confirm.
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
                  className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-40 text-black font-bold py-3.5 rounded-xl transition text-sm"
                >
                  {loading ? 'Placing Order...' : paymentMethod === 'online' ? 'Place Order & Pay' : 'Place Order (COD)'}
                </button>

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
