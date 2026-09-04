import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { Address, Order, ServiceTicket, SiteVisit } from '../types';
import Loading from '../components/Loading';
import { Link, useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff, FiUser, FiMapPin, FiHeadphones, FiCalendar, FiShoppingBag, FiTrendingUp, FiArrowRight } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

interface AccountStats {
  totalOrders: number;
  totalSpent: number;
  activeTickets: number;
  upcomingVisits: number;
}

const orderStatusColors: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  payment_pending: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
  confirmed: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  processing: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
  shipped: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  delivered: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  cancelled: 'bg-red-500/15 text-red-300 border-red-500/30',
};

const panel = 'bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'profile' | 'addresses' | 'orders' | 'tickets' | 'visits'>('profile');
  const [loading, setLoading] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Account stats (hero strip)
  const [stats, setStats] = useState<AccountStats | null>(null);

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Data
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home', fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '',
  });
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [editForm, setEditForm] = useState({
    label: 'Home', fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', pincode: '',
  });
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    api.get('/auth/me/stats').then((r) => setStats(r.data.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'addresses') {
      setDataLoading(true);
      api.get('/addresses').then((r) => setAddresses(r.data.data)).catch((err) => {
        console.error('Failed to load addresses:', err);
        toast.error('Failed to load addresses');
      }).finally(() => setDataLoading(false));
    } else if (tab === 'orders') {
      setDataLoading(true);
      api.get('/orders', { params: { limit: 6 } }).then((r) => setOrders(r.data.data)).catch((err) => {
        console.error('Failed to load orders:', err);
        toast.error('Failed to load orders');
      }).finally(() => setDataLoading(false));
    } else if (tab === 'tickets') {
      setDataLoading(true);
      api.get('/services/tickets/my').then((r) => setTickets(r.data.data)).catch((err) => {
        console.error('Failed to load tickets:', err);
        toast.error('Failed to load tickets');
      }).finally(() => setDataLoading(false));
    } else if (tab === 'visits') {
      setDataLoading(true);
      api.get('/site-visits/my').then((r) => setVisits(r.data.data)).catch((err) => {
        console.error('Failed to load visits:', err);
        toast.error('Failed to load visits');
      }).finally(() => setDataLoading(false));
    }
  }, [tab]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, phone });
      toast.success('Profile updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      toast.success('Password changed');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      return toast.error('Please fill all required fields');
    }
    setAddingAddress(true);
    try {
      const { data } = await api.post('/addresses', { ...newAddress, isDefault: addresses.length === 0 });
      setAddresses(prev => [...prev, data.data]);
      setShowAddAddress(false);
      setNewAddress({ label: 'Home', fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
      toast.success('Address added');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to add address');
    } finally {
      setAddingAddress(false);
    }
  };

  const handleStartEdit = (a: Address) => {
    setEditingAddress(a);
    setEditForm({
      label: a.label || 'Home',
      fullName: a.fullName,
      phone: a.phone,
      addressLine1: a.addressLine1,
      addressLine2: a.addressLine2 || '',
      city: a.city,
      state: a.state,
      pincode: a.pincode,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;
    setSavingEdit(true);
    try {
      const { data } = await api.put(`/addresses/${editingAddress._id}`, editForm);
      setAddresses(prev => prev.map(a => a._id === editingAddress._id ? data.data : a));
      setEditingAddress(null);
      toast.success('Address updated');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update address');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses((p) => p.filter((a) => a._id !== id));
      toast.success('Address deleted');
    } catch {
      toast.error('Failed to delete address');
    }
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: FiUser },
    { key: 'addresses', label: 'Addresses', icon: FiMapPin },
    { key: 'orders', label: 'Orders', icon: FiShoppingBag },
    { key: 'tickets', label: 'Service Tickets', icon: FiHeadphones },
    { key: 'visits', label: 'Site Visits', icon: FiCalendar },
  ] as const;

  const initials = (user?.name || '?')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : null;

  // GSAP entrance
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (heroRef.current) {
        gsap.from(heroRef.current, { opacity: 0, y: 24, duration: 0.7, ease: 'power3.out' });
      }
      if (statsRef.current) {
        gsap.from(statsRef.current.children, {
          opacity: 0, y: 16, duration: 0.5, stagger: 0.08, delay: 0.15, ease: 'power3.out',
        });
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (contentRef.current) {
        gsap.from(contentRef.current, { opacity: 0, y: 16, duration: 0.5, ease: 'power3.out' });
      }
      gsap.utils.toArray('.profile-card-animate').forEach((card: any, idx: number) => {
        gsap.from(card, { opacity: 0, y: 14, duration: 0.45, delay: idx * 0.04, ease: 'power3.out' });
      });
    });
    return () => ctx.revert();
  }, [tab]);

  return (
    <>
      <Helmet>
        <title>My Account | Pravara World Tech</title>
      </Helmet>

      <div className="relative min-h-screen bg-black overflow-hidden">
        {/* Ambient background: glow orbs + grain */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-32 -left-24 w-[32rem] h-[32rem] rounded-full bg-amber-500/[0.06] blur-[120px]" />
          <div className="absolute top-1/3 -right-24 w-[28rem] h-[28rem] rounded-full bg-blue-600/[0.08] blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          {/* ── Hero ── */}
          <div ref={heroRef} className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center ring-2 ring-amber-400/40 ring-offset-4 ring-offset-black">
                  <span className="font-display text-2xl sm:text-3xl font-semibold text-black">{initials}</span>
                </div>
              </div>
              <div>
                {memberSince && (
                  <p className="text-[10px] tracking-[0.25em] text-amber-400/80 font-semibold uppercase mb-1.5">
                    Member since {memberSince}
                  </p>
                )}
                <h1 className="font-display text-3xl sm:text-4xl font-medium text-white tracking-tight">
                  {user?.name || 'My Account'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* ── Stats strip ── */}
          <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
            {[
              { label: 'Orders', value: stats?.totalOrders ?? '—', icon: FiShoppingBag },
              { label: 'Total Spent', value: stats ? `₹${stats.totalSpent.toLocaleString('en-IN')}` : '—', icon: FiTrendingUp },
              { label: 'Active Tickets', value: stats?.activeTickets ?? '—', icon: FiHeadphones },
              { label: 'Upcoming Visits', value: stats?.upcomingVisits ?? '—', icon: FiCalendar },
            ].map((s) => (
              <div key={s.label} className={`${panel} p-4 sm:p-5`}>
                <s.icon className="w-4 h-4 text-amber-400/70 mb-3" />
                <p className="font-display text-xl sm:text-2xl text-white leading-none">{s.value}</p>
                <p className="text-[11px] text-gray-500 mt-1.5 tracking-wide">{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 mb-8 -mx-1 px-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    active
                      ? 'bg-amber-400 text-black shadow-[0_0_0_1px_rgba(251,191,36,0.4)]'
                      : 'text-gray-400 hover:text-white border border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          <div ref={contentRef}>
            {tab === 'profile' && (
              <div className="space-y-5">
                <div className={`${panel} profile-card-animate p-6 sm:p-7`}>
                  <h2 className="font-display text-lg text-white mb-5">Personal Information</h2>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">NAME</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">PHONE</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">EMAIL</label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full bg-black/60 border border-white/[0.06] rounded-xl px-4 py-2.5 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto sm:px-8 bg-amber-400 hover:bg-amber-300 text-black font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>

                <div className={`${panel} profile-card-animate p-6 sm:p-7`}>
                  <h2 className="font-display text-lg text-white mb-5">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">CURRENT PASSWORD</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          required
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                        >
                          {showCurrentPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2 tracking-wide">NEW PASSWORD</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20 transition pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                        >
                          {showNewPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto sm:px-8 bg-white/10 hover:bg-white/[0.15] border border-white/10 text-white font-semibold py-2.5 rounded-xl transition disabled:opacity-50"
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>

                <button
                  onClick={handleLogout}
                  className="profile-card-animate w-full sm:w-auto sm:px-8 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition shadow-[0_0_0_1px_rgba(239,68,68,0.4)]"
                >
                  Sign Out
                </button>
              </div>
            )}

            {tab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500 text-sm">{addresses.length} saved address{addresses.length !== 1 ? 'es' : ''}</p>
                  <button
                    onClick={() => setShowAddAddress(p => !p)}
                    className="bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold px-4 py-2 rounded-full transition"
                  >
                    {showAddAddress ? 'Cancel' : '+ Add Address'}
                  </button>
                </div>

                {showAddAddress && (
                  <div className={`${panel} p-5`}>
                    <h3 className="text-white font-semibold mb-4 text-sm">New Address</h3>
                    <form onSubmit={handleAddAddress} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Label</label>
                          <select
                            value={newAddress.label}
                            onChange={e => setNewAddress(p => ({ ...p, label: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/60 transition"
                          >
                            <option value="Home">Home</option>
                            <option value="Work">Work</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Full Name *</label>
                          <input type="text" placeholder="Full name" value={newAddress.fullName}
                            onChange={e => setNewAddress(p => ({ ...p, fullName: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/60 transition" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Phone *</label>
                        <input type="tel" placeholder="Phone number" value={newAddress.phone}
                          onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/60 transition" required />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Address Line 1 *</label>
                        <input type="text" placeholder="House no, Street, Area" value={newAddress.addressLine1}
                          onChange={e => setNewAddress(p => ({ ...p, addressLine1: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/60 transition" required />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Address Line 2</label>
                        <input type="text" placeholder="Landmark (optional)" value={newAddress.addressLine2}
                          onChange={e => setNewAddress(p => ({ ...p, addressLine2: e.target.value }))}
                          className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/60 transition" />
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">City *</label>
                          <input type="text" placeholder="City" value={newAddress.city}
                            onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/60 transition" required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">State *</label>
                          <input type="text" placeholder="State" value={newAddress.state}
                            onChange={e => setNewAddress(p => ({ ...p, state: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/60 transition" required />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Pincode *</label>
                          <input type="text" placeholder="Pincode" value={newAddress.pincode}
                            onChange={e => setNewAddress(p => ({ ...p, pincode: e.target.value }))}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-amber-400/60 transition" required />
                        </div>
                      </div>
                      <button type="submit" disabled={addingAddress}
                        className="w-full bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-semibold py-2.5 rounded-xl transition">
                        {addingAddress ? 'Saving...' : 'Save Address'}
                      </button>
                    </form>
                  </div>
                )}

                {dataLoading ? (
                  <Loading text="Loading addresses..." />
                ) : addresses.length === 0 ? (
                  <p className="text-gray-500 text-center py-10 text-sm">No saved addresses. Add one above.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((a) => (
                      <div key={a._id} className={`${panel} profile-card-animate p-4 relative`}>
                        {editingAddress?._id === a._id ? (
                          <form onSubmit={handleSaveEdit} className="space-y-3">
                            <p className="text-white font-semibold text-sm mb-2">Edit Address</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Label</label>
                                <select value={editForm.label} onChange={e => setEditForm(p => ({ ...p, label: e.target.value }))}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400/60 transition">
                                  <option value="Home">Home</option>
                                  <option value="Work">Work</option>
                                  <option value="Other">Other</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Full Name *</label>
                                <input type="text" value={editForm.fullName} onChange={e => setEditForm(p => ({ ...p, fullName: e.target.value }))}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400/60 transition" required />
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Phone *</label>
                              <input type="tel" value={editForm.phone} onChange={e => setEditForm(p => ({ ...p, phone: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400/60 transition" required />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Address Line 1 *</label>
                              <input type="text" value={editForm.addressLine1} onChange={e => setEditForm(p => ({ ...p, addressLine1: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400/60 transition" required />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-500 mb-1">Landmark</label>
                              <input type="text" value={editForm.addressLine2} onChange={e => setEditForm(p => ({ ...p, addressLine2: e.target.value }))}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400/60 transition" />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">City *</label>
                                <input type="text" value={editForm.city} onChange={e => setEditForm(p => ({ ...p, city: e.target.value }))}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400/60 transition" required />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">State *</label>
                                <input type="text" value={editForm.state} onChange={e => setEditForm(p => ({ ...p, state: e.target.value }))}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400/60 transition" required />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-500 mb-1">Pincode *</label>
                                <input type="text" value={editForm.pincode} onChange={e => setEditForm(p => ({ ...p, pincode: e.target.value }))}
                                  className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400/60 transition" required />
                              </div>
                            </div>
                            <div className="flex gap-2 pt-1">
                              <button type="submit" disabled={savingEdit}
                                className="flex-1 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-black font-semibold py-2 rounded-lg text-xs transition">
                                {savingEdit ? 'Saving...' : 'Save'}
                              </button>
                              <button type="button" onClick={() => setEditingAddress(null)}
                                className="flex-1 bg-white/10 hover:bg-white/[0.15] text-white font-semibold py-2 rounded-lg text-xs transition">
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <>
                            {a.isDefault && (
                              <span className="absolute top-3 right-3 bg-amber-400/15 text-amber-300 text-[10px] font-semibold px-2 py-1 rounded-full border border-amber-400/30">
                                Default
                              </span>
                            )}
                            <p className="font-semibold text-white text-sm">{a.label || 'Address'}</p>
                            <p className="text-sm text-gray-400 mt-1">{a.fullName} · {a.phone}</p>
                            <p className="text-sm text-gray-500">{a.addressLine1}{a.addressLine2 ? `, ${a.addressLine2}` : ''}</p>
                            <p className="text-sm text-gray-500">{a.city}, {a.state} {a.pincode}</p>
                            <div className="flex gap-4 mt-3">
                              <button onClick={() => handleStartEdit(a)}
                                className="text-blue-400 text-xs hover:text-blue-300 transition font-medium">
                                Edit
                              </button>
                              <button onClick={() => handleDeleteAddress(a._id)}
                                className="text-red-400 text-xs hover:text-red-300 transition">
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'orders' && (
              <div className="space-y-4">
                {dataLoading ? (
                  <Loading text="Loading orders..." />
                ) : orders.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500 mb-4 text-sm">No orders yet.</p>
                    <Link to="/products" className="inline-block bg-amber-400 hover:bg-amber-300 text-black font-semibold px-6 py-2.5 rounded-full text-sm transition">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {orders.map((o) => (
                        <Link
                          key={o._id}
                          to={`/orders/${o._id}`}
                          className={`${panel} profile-card-animate flex items-center gap-4 p-4 hover:border-amber-400/30 transition-colors group`}
                        >
                          <div className="flex -space-x-3 shrink-0">
                            {o.items.slice(0, 3).map((item, i) => (
                              <div key={i} className="w-11 h-11 rounded-lg overflow-hidden border-2 border-black bg-gray-900">
                                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                              </div>
                            ))}
                            {o.items.length > 3 && (
                              <div className="w-11 h-11 rounded-lg border-2 border-black bg-gray-800 flex items-center justify-center text-[10px] text-gray-400 font-semibold">
                                +{o.items.length - 3}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{o.orderNumber}</p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {o.items.length} item{o.items.length > 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full border capitalize ${orderStatusColors[o.status] || 'bg-gray-700/30 text-gray-300 border-gray-600/30'}`}>
                              {o.status.replace('_', ' ')}
                            </span>
                            <p className="font-display text-white text-sm mt-1.5">₹{o.totalAmount.toLocaleString('en-IN')}</p>
                          </div>
                          <FiArrowRight className="w-4 h-4 text-gray-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </Link>
                      ))}
                    </div>
                    <Link
                      to="/orders"
                      className="flex items-center justify-center gap-2 text-sm text-amber-400 hover:text-amber-300 font-medium py-3 transition"
                    >
                      View All Orders <FiArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </>
                )}
              </div>
            )}

            {tab === 'tickets' && (
              <div>
                {dataLoading ? (
                  <Loading text="Loading tickets..." />
                ) : tickets.length === 0 ? (
                  <p className="text-gray-500 text-center py-10 text-sm">No service tickets yet.</p>
                ) : (
                  <div className="space-y-3">
                    {tickets.map((t) => (
                      <div
                        key={t._id}
                        className={`${panel} profile-card-animate p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3`}
                      >
                        <div>
                          <p className="font-medium text-white text-sm">{t.ticketNumber}</p>
                          <p className="text-sm text-gray-500">{t.subject}</p>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap w-fit capitalize ${
                            t.status === 'open'
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              : t.status === 'in_progress'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : t.status === 'resolved'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : 'bg-gray-500/15 text-gray-300 border border-gray-500/30'
                          }`}
                        >
                          {t.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'visits' && (
              <div>
                {dataLoading ? (
                  <Loading text="Loading visits..." />
                ) : visits.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-gray-500 mb-4 text-sm">No site visits booked.</p>
                    <Link
                      to="/book-visit"
                      className="inline-block bg-amber-400 hover:bg-amber-300 text-black font-semibold px-6 py-2.5 rounded-full text-sm transition"
                    >
                      Book a Visit
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {visits.map((v) => (
                      <div
                        key={v._id}
                        className={`${panel} profile-card-animate p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3`}
                      >
                        <div>
                          <p className="font-medium text-white text-sm">
                            {new Date(v.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </p>
                          <p className="text-sm text-gray-500">{v.timeSlot} · {v.location.city}</p>
                        </div>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap w-fit capitalize ${
                            v.status === 'scheduled'
                              ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              : v.status === 'confirmed'
                              ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                              : v.status === 'in_progress'
                              ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                              : v.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : v.status === 'cancelled'
                              ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                              : 'bg-gray-500/15 text-gray-300 border border-gray-500/30'
                          }`}
                        >
                          {v.status?.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
