import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { FiEye, FiEyeOff, FiMail, FiLock, FiShield } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      const statusCode = err.response?.status;
      if (statusCode === 401) {
        toast.error('Invalid email or password.');
      } else if (statusCode === 429) {
        toast.error('Too many login attempts. Try again later.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Admin Login | Pravara World Tech</title></Helmet>

      <style>{`
        .admin-input::placeholder { color: rgba(156,163,175,0.3) !important; }
        .admin-input:-webkit-autofill,
        .admin-input:-webkit-autofill:hover,
        .admin-input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 1000px #13131f inset !important;
          -webkit-text-fill-color: white !important;
          caret-color: white;
        }
      `}</style>

      <div className="min-h-screen w-full flex bg-[#060608]">
        {/* Left panel — branding */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-[#060608] to-indigo-900/30" />
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl" />
          </div>

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <span className="text-white font-black text-sm">PW</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">Pravara World Tech</p>
                <p className="text-blue-400 text-[10px] font-semibold uppercase tracking-widest">Admin Console</p>
              </div>
            </div>
          </div>

          {/* Center content */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <FiShield className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-300 text-xs font-semibold tracking-wide">Secure Admin Access</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Manage your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                entire business
              </span>
            </h1>
            <p className="text-gray-400 text-base leading-relaxed max-w-sm">
              Control products, services, orders, customers and deals from one powerful dashboard.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4 max-w-sm">
              {[
                { label: 'Products', desc: 'Inventory & pricing' },
                { label: 'Services', desc: 'Catalog management' },
                { label: 'Orders', desc: 'Fulfillment tracking' },
                { label: 'Deals', desc: 'Special offers' },
              ].map((item) => (
                <div key={item.label} className="bg-white/4 border border-white/6 rounded-xl px-4 py-3">
                  <p className="text-white text-sm font-semibold">{item.label}</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10">
            <p className="text-gray-600 text-xs">© {new Date().getFullYear()} Pravara World Tech. All rights reserved.</p>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 relative">
          <div className="absolute inset-0 bg-[#0a0a12] lg:bg-transparent" />

          <div className="relative w-full max-w-sm">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-3 mb-10">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-black text-xs">PW</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">Pravara World Tech</p>
                <p className="text-blue-400 text-[10px] font-semibold uppercase tracking-widest">Admin Console</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
              <p className="text-gray-500 text-sm">Sign in to your admin account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    required
                    autoComplete="email"
                    className="admin-input w-full pl-10 pr-4 py-3 bg-[#13131f] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-[#16162a] transition-all caret-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    className="admin-input w-full pl-10 pr-11 py-3 bg-[#13131f] border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-[#16162a] transition-all caret-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-blue-400 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex-1 h-px bg-white/6" />
              <FiShield className="w-3.5 h-3.5 text-gray-700" />
              <div className="flex-1 h-px bg-white/6" />
            </div>
            <p className="text-center text-[11px] text-gray-600 mt-3">Authorized personnel only</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
