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
import { FiEye, FiEyeOff } from 'react-icons/fi';

gsap.registerPlugin(ScrollTrigger);

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'profile' | 'addresses' | 'tickets' | 'visits'>('profile');
  const [loading, setLoading] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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
  const [tickets, setTickets] = useState<ServiceTicket[]>([]);
  const [visits, setVisits] = useState<SiteVisit[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (tab === 'addresses') {
      setDataLoading(true);
      api.get('/addresses').then((r) => setAddresses(r.data.data)).catch((err) => {
        console.error('Failed to load addresses:', err);
        toast.error('Failed to load addresses');
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
    { key: 'profile', label: 'Profile' },
    { key: 'addresses', label: 'Addresses' },
    { key: 'tickets', label: 'Service Tickets' },
    { key: 'visits', label: 'Site Visits' },
  ] as const;

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

      gsap.utils.toArray('.profile-section-animate').forEach((section: any) => {
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
  }, [tab]);

  return (
    <>
      <Helmet>
        <title>My Profile | Pravara World Tech</title>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-black to-blue-950/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div ref={headerRef}>
            <h1 className="text-3xl font-bold text-white mb-6">My Account</h1>
          </div>

          <div ref={contentRef} className="flex gap-2 border-b border-blue-500/20 mb-8 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition ${
                  tab === t.key ? 'border-yellow-400 text-yellow-400' : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'profile' && (
            <div className="profile-section-animate space-y-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Personal Information</h2>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-black/60 border border-blue-500/20 rounded-lg px-4 py-2 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>

              <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                      >
                        {showCurrentPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full bg-black/40 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 transition pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform translate-y-1/2 text-gray-400 hover:text-gray-200 transition"
                      >
                        {showNewPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition transform hover:scale-105"
              >
                Sign Out
              </button>
            </div>
          )}

          {tab === 'addresses' && (
            <div className="profile-section-animate">
              {dataLoading ? (
                <Loading text="Loading addresses..." />
              ) : addresses.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No saved addresses.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((a) => (
                    <div key={a._id} className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-4 relative">
                      {a.isDefault && (
                        <span className="absolute top-2 right-2 bg-yellow-500/20 text-yellow-400 text-xs font-semibold px-2 py-1 rounded-full border border-yellow-500/40">
                          Default
                        </span>
                      )}
                      <p className="font-medium text-white">{a.label || 'Address'}</p>
                      <p className="text-sm text-gray-400">{a.addressLine1}, {a.city}</p>
                      <p className="text-sm text-gray-400">{a.state} - {a.pincode}</p>
                      <button
                        onClick={() => handleDeleteAddress(a._id)}
                        className="text-red-400 text-sm mt-2 hover:text-red-300 transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'tickets' && (
            <div className="profile-section-animate">
              {dataLoading ? (
                <Loading text="Loading tickets..." />
              ) : tickets.length === 0 ? (
                <p className="text-gray-400 text-center py-8">No service tickets yet.</p>
              ) : (
                <div className="space-y-4">
                  {tickets.map((t) => (
                    <div
                      key={t._id}
                      className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                    >
                      <div>
                        <p className="font-medium text-white">{t.ticketNumber}</p>
                        <p className="text-sm text-gray-400">{t.subject}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                          t.status === 'open'
                            ? 'bg-blue-500/20 text-blue-300'
                            : t.status === 'in_progress'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : t.status === 'resolved'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-gray-500/20 text-gray-300'
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
            <div className="profile-section-animate">
              {dataLoading ? (
                <Loading text="Loading visits..." />
              ) : visits.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No site visits booked.</p>
                  <Link
                    to="/book-visit"
                    className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition"
                  >
                    Book a Visit
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {visits.map((v) => (
                    <div
                      key={v._id}
                      className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/20 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {new Date(v.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-400">{v.timeSlot} — {v.location.city}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${
                          v.status === 'scheduled'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : v.status === 'confirmed'
                            ? 'bg-blue-500/20 text-blue-300'
                            : v.status === 'in_progress'
                            ? 'bg-purple-500/20 text-purple-300'
                            : v.status === 'completed'
                            ? 'bg-green-500/20 text-green-300'
                            : v.status === 'cancelled'
                            ? 'bg-red-500/20 text-red-300'
                            : 'bg-gray-500/20 text-gray-300'
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
    </>
  );
};

export default ProfilePage;
