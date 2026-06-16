import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiLock, FiArrowRight, FiHome } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const isSafeRedirect = (url: string): url is string => {
  if (!url) return false;
  if (url.startsWith('/')) return true;
  return false;
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const redirect = (redirectParam && isSafeRedirect(redirectParam)) ? redirectParam : '/';
  const { register } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created successfully!');
      navigate(redirect);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors';

  return (
    <>
      <Helmet>
        <title>Create Account | Pravara World Tech</title>
      </Helmet>

      <div className="min-h-screen bg-black flex">
        {/* Left Branding panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&auto=format&fit=crop&q=60"
            alt="Pravara World Tech"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/85" />

          {/* Logo */}
          <div className="relative">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                <span className="text-black font-black text-sm">PW</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Pravara World Tech</p>
                <p className="text-yellow-400 text-[10px] font-semibold tracking-widest uppercase">Smart · Secure · Premium</p>
              </div>
            </Link>
          </div>

          {/* Middle content */}
          <div className="relative">
            <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">Join Us Today</span>
            <h2 className="text-4xl font-bold text-white mb-4 leading-snug">
              Your Smart Home <br /><span className="text-yellow-400">Journey Starts Here</span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Get access to exclusive deals, track your orders, book site visits, and manage your service requests all in one place.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                { value: '2500+', label: 'Projects' },
                { value: '50+', label: 'Cities' },
                { value: '23+', label: 'Years' },
              ].map(s => (
                <div key={s.label} className="bg-black/40 backdrop-blur border border-yellow-500/20 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-yellow-400">{s.value}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative text-[11px] text-gray-500">
            © 2025 Pravara World Tech. All rights reserved.
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-black">
          <div className="w-full max-w-md">
            {/* Mobile logo + home */}
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center">
                  <span className="text-black font-black text-xs">PW</span>
                </div>
                <p className="text-white font-bold text-sm">Pravara World Tech</p>
              </Link>
              <Link to="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors">
                <FiHome className="w-3.5 h-3.5" /> Home
              </Link>
            </div>

            {/* Desktop home button */}
            <div className="hidden lg:flex justify-end mb-4">
              <Link to="/" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-yellow-400 transition-colors">
                <FiHome className="w-3.5 h-3.5" /> Back to Home
              </Link>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-1">Create Account</h1>
              <p className="text-gray-400 text-sm">Fill in the details below to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide uppercase">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange}
                    required autoComplete="name" placeholder="Praveen Kumar"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide uppercase">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange}
                    required autoComplete="email" placeholder="you@example.com"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide uppercase">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="tel" name="phone" value={form.phone} onChange={handleChange}
                    required autoComplete="tel" placeholder="+91 98496 97886"
                    pattern="[0-9]{10}" title="Enter a valid 10-digit phone number"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide uppercase">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                    required minLength={6} autoComplete="new-password" placeholder="Min. 6 characters"
                    className={`${inputCls} pl-10 pr-11`}
                  />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition-colors">
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide uppercase">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                    required minLength={6} autoComplete="new-password" placeholder="Re-enter password"
                    className={`${inputCls} pl-10 pr-11`}
                  />
                  <button type="button" onClick={() => setShowConfirm(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition-colors">
                    {showConfirm ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Creating Account...' : <><FiArrowRight className="w-4 h-4" /> Create Account</>}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link
                  to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
                  className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors"
                >
                  Sign in
                </Link>
              </p>
              <p className="text-xs text-gray-600 mt-3">
                Want to partner with us?{' '}
                <Link to="/join/partner" className="text-gray-400 hover:text-white transition-colors">Join With Us →</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
