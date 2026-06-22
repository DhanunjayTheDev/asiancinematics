import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { FiEye, FiEyeOff, FiMail, FiLock, FiArrowRight, FiHome } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const isSafeRedirect = (url: string): url is string => {
  if (!url) return false;
  return url.startsWith('/');
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectParam = searchParams.get('redirect');
  const redirect = (redirectParam && isSafeRedirect(redirectParam)) ? redirectParam : '/';
  const { login } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate(redirect);
    } catch (err: any) {
      const msg = err.message || err.response?.data?.message || 'Invalid credentials';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400 transition-colors';

  return (
    <>
      <Helmet>
        <title>Sign In | Pravara World Tech</title>
      </Helmet>

      <div className="min-h-screen bg-black flex">
        {/* Left Branding Panel */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
          <img
            src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop&q=60"
            alt="Pravara World Tech"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/85" />

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

          <div className="relative">
            <span className="text-xs font-semibold text-yellow-400 tracking-widest uppercase mb-4 block">Welcome Back</span>
            <h2 className="text-4xl font-bold text-white mb-4 leading-snug">
              Manage Your <br /><span className="text-yellow-400">Smart World</span>
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
              Sign in to track service requests, browse premium products, book site visits, and stay connected with our expert team.
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
              <h1 className="text-3xl font-bold text-white mb-1">Sign In</h1>
              <p className="text-gray-400 text-sm">Enter your customer account credentials</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide uppercase">Email Address</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`${inputCls} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5 tracking-wide uppercase">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    minLength={6}
                    placeholder="••••••••"
                    className={`${inputCls} pl-10 pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black font-bold rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Signing in...' : <><FiArrowRight className="w-4 h-4" /> Sign In</>}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800 space-y-3 text-center">
              <p className="text-sm text-gray-500">
                Don&apos;t have an account?{' '}
                <Link
                  to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`}
                  className="text-yellow-400 font-semibold hover:text-yellow-300 transition-colors"
                >
                  Create one free
                </Link>
              </p>
              <p className="text-xs text-gray-600">
                Want to join our team?{' '}
                <Link to="/join/freelancer" className="text-gray-400 hover:text-white transition-colors">Apply here →</Link>
              </p>
              <p className="text-xs text-gray-600">
                Staff / Admin?{' '}
                <a href={`${import.meta.env.VITE_ADMIN_URL}/login`} className="text-gray-400 hover:text-white transition-colors">Use Admin Panel →</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
