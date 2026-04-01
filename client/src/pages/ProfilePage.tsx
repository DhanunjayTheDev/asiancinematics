import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import type { Address, Order, ServiceTicket, SiteVisit } from '../types';
import Loading from '../components/Loading';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuthStore();
  const [tab, setTab] = useState<'profile' | 'addresses' | 'tickets' | 'visits'>('profile');
  const [loading, setLoading] = useState(false);

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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

  return (
    <>
      <Helmet>
        <title>My Profile | Asian Cinematics</title>
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>

        <div className="flex gap-2 border-b border-gray-200 mb-8 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition ${
                tab === t.key ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'profile' && (
          <div className="space-y-8">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" value={user?.email || ''} disabled className="input-field bg-gray-50" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} className="input-field" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            </div>

            <button onClick={logout} className="btn-danger">
              Sign Out
            </button>
          </div>
        )}

        {tab === 'addresses' && (
          <div>
            {dataLoading ? (
              <Loading text="Loading addresses..." />
            ) : addresses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No saved addresses.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((a) => (
                  <div key={a._id} className="card p-4 relative">
                    {a.isDefault && <span className="badge bg-primary-100 text-primary-700 absolute top-2 right-2">Default</span>}
                    <p className="font-medium text-gray-900">{a.label || 'Address'}</p>
                    <p className="text-sm text-gray-600">{a.addressLine1}, {a.city}</p>
                    <p className="text-sm text-gray-600">{a.state} - {a.pincode}</p>
                    <button onClick={() => handleDeleteAddress(a._id)} className="text-red-500 text-sm mt-2 hover:underline">
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'tickets' && (
          <div>
            {dataLoading ? (
              <Loading text="Loading tickets..." />
            ) : tickets.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No service tickets yet.</p>
            ) : (
              <div className="space-y-4">
                {tickets.map((t) => (
                  <div key={t._id} className="card p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{t.ticketNumber}</p>
                      <p className="text-sm text-gray-600">{t.subject}</p>
                    </div>
                    <span className={`badge ${
                      t.status === 'open' ? 'bg-blue-100 text-blue-700' :
                      t.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                      t.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{t.status.replace('_', ' ')}</span>
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
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No site visits booked.</p>
                <Link to="/book-visit" className="btn-primary">Book a Visit</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {visits.map((v) => (
                  <div key={v._id} className="card p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(v.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-gray-600">{v.timeSlot} — {v.location.city}</p>
                    </div>
                    <span className={`badge ${
                      v.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      v.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      v.status === 'completed' ? 'bg-green-100 text-green-700' :
                      v.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{v.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
