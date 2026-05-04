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

// ✅ ADD THIS
import qrImage from '../assets/qr.jpeg';

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
  const [paymentStep, setPaymentStep] = useState<'address' | 'payment'>('address');
  const [orderId, setOrderId] = useState<string>('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [submitingPayment, setSubmitingPayment] = useState(false);
  
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
  }, [items, paymentStep]);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error('Image size should be less than 5MB');
      }
      setScreenshotFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
      } catch {}
    }

    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        items: items.map((i) => ({ product: i.product._id, quantity: i.quantity })),
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

  const handleSubmitPayment = async () => {
    if (!utrNumber || !screenshotFile) {
      return toast.error('Please provide UTR number and payment screenshot');
    }

    setSubmitingPayment(true);
    try {
      await api.put(`/orders/${orderId}/payment`, {
        utrNumber,
        paymentScreenshot: screenshotPreview,
      });

      clearCart();
      toast.success('Payment submitted! Waiting for admin verification...');
      navigate(`/orders/${orderId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit payment');
    } finally {
      setSubmitingPayment(false);
    }
  };

  if (paymentStep === 'payment' && paymentMethod === 'online') {
    return (
      <>
        <Helmet><title>Payment | Pravara World Tech</title></Helmet>

        <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div ref={headerRef}>
              <h1 className="text-2xl font-bold text-white mb-2">Complete Your Payment</h1>
              <p className="text-gray-400 mb-8">
                Scan the QR code below to pay ₹{total.toLocaleString()}
              </p>
            </div>

            <div ref={contentRef} className="space-y-6">

              {/* ✅ STATIC QR */}
              <div className="checkout-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-8 text-center">
                <h2 className="text-lg font-semibold text-white mb-6">Scan to Pay</h2>

                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-lg">
                    <img
                      src={qrImage}
                      alt="QR Code"
                      className="w-64 h-64 object-contain"
                    />
                  </div>
                </div>

                <p className="text-gray-400 text-sm mb-4">
                  UPI Payment ID:
                  <span className="font-mono text-yellow-400"> 9843550515@okhdfcbank</span>
                </p>

                <p className="text-yellow-400 font-semibold">
                  Pay exactly ₹{total.toLocaleString()}
                </p>
              </div>

              {/* REST OF YOUR CODE CONTINUES SAME (FORM + SUMMARY etc.) */}              {/* Payment Details Form */}
              <div className="checkout-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Payment Details</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      UTR / Reference Number <span className="text-yellow-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter UTR number from payment receipt"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Payment Screenshot <span className="text-yellow-400">*</span>
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="w-full bg-black/40 border border-blue-500/30 border-dashed rounded-lg p-6 cursor-pointer hover:bg-blue-900/20 transition">
                        <div className="text-center">
                          {screenshotPreview ? (
                            <>
                              <img src={screenshotPreview} alt="Preview" className="h-40 mx-auto mb-2 rounded" />
                              <p className="text-sm text-gray-400">Click to change image</p>
                            </>
                          ) : (
                            <>
                              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v4m0-4h-4m4 0h4M12 28l8-8m0 0l8 8m-8-8V8m0 0H8m4 0h8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-400">Click to upload payment screenshot</p>
                            </>
                          )}
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleScreenshotChange} />
                      </label>
                    </div>
                  </div>

                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
                    <p className="text-sm text-gray-300">
                      <span className="font-semibold text-white">📝 Important:</span> After submitting payment details, our admin will verify the payment within 24 hours. Your order will be confirmed only after verification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setPaymentStep('address')}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitPayment}
                    disabled={submitingPayment || !utrNumber || !screenshotFile}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
                  >
                    {submitingPayment ? 'Submitting...' : 'Submit Payment'}
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="checkout-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
                <h3 className="font-semibold text-white mb-4">Order Summary</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <dt>Subtotal</dt>
                    <dd className="text-gray-300">₹{subtotal.toLocaleString()}</dd>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <dt>Shipping</dt>
                    <dd className="text-gray-300">{shipping === 0 ? 'Free' : `₹${shipping}`}</dd>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <dt>Tax (18%)</dt>
                    <dd className="text-gray-300">₹{tax.toLocaleString()}</dd>
                  </div>
                  <div className="border-t border-blue-500/20 pt-2 flex justify-between font-semibold text-white">
                    <dt>Total</dt>
                    <dd className="text-lg text-yellow-400">₹{total.toLocaleString()}</dd>
                  </div>
                </dl>
              </div>

            </div>
          </div>
        </div>
      </>
    );
  }  return (
    <>
      <Helmet><title>Checkout | Pravara World Tech</title></Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div ref={headerRef}>
            <h1 className="text-2xl font-bold text-white mb-8">Checkout</h1>
          </div>

          <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-6">

              {/* Address */}
              <div className="checkout-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
                <h2 className="font-semibold text-white mb-4">Shipping Address</h2>

                {addresses.map((addr) => (
                  <label key={addr._id} className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      checked={selectedAddress === addr._id}
                      onChange={() => setSelectedAddress(addr._id)}
                    />
                    <div>
                      <p className="text-white">{addr.fullName}</p>
                      <p className="text-gray-400 text-sm">{addr.addressLine1}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Payment */}
              <div className="checkout-section-animate bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
                <h2 className="font-semibold text-white mb-4">Payment Method</h2>

                <label className="flex items-center space-x-3">
                  <input type="radio" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <span>Cash on Delivery</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input type="radio" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} />
                  <span>Online Payment</span>
                </label>
              </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 p-6 rounded-lg">
              <h3 className="text-white mb-4">Summary</h3>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-blue-600 py-3 rounded"
              >
                Continue to Payment
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;