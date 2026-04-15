import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
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

  return (
    <>
      <Helmet>
        <title>Register | Pravara World Tech</title>
      </Helmet>

      <div className="min-h-[70vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <span className="text-white font-semibold">AC</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Create Account</h1>
            <p className="text-gray-500 mt-2">Join Pravara World Tech today</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="input-field" placeholder="John Doe" autoComplete="name" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="input-field" placeholder="you@example.com" autoComplete="email" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="input-field" placeholder="9876543210" pattern="[0-9]{10}" title="Enter a valid 10-digit phone number" autoComplete="tel" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} className="input-field" placeholder="••••••••" autoComplete="new-password" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required minLength={6} className="input-field" placeholder="••••••••" autoComplete="new-password" />
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{' '}
              <Link to={`/login${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="text-primary-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
