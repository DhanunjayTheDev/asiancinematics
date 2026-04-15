import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { FiPhone, FiMail, FiMapPin } from 'react-icons/fi';
import Loading from '../components/Loading';
import Button from '../components/Button';

const STATUS_OPTIONS = ['pending', 'contacted', 'approved', 'rejected', 'active'];
const PARTNER_TYPES = ['Dealer / Distributor', 'Channel Partner', 'Business Associate', 'Architect / Interior Designer', 'Contractor', 'Other'];

const statusColor: Record<string, string> = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  contacted: 'text-blue-400 bg-blue-400/10',
  approved: 'text-green-400 bg-green-400/10',
  active: 'text-emerald-400 bg-emerald-400/10',
  rejected: 'text-red-400 bg-red-400/10',
};

const PartnersPage = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    setPartners([
      { _id: '1', name: 'Ravi AV Solutions', company: 'Ravi AV', phone: '9876543230', email: 'ravi@avsolutions.com', city: 'Bangalore', partnerType: 'Dealer / Distributor', status: 'active', createdAt: '2025-09-01' },
      { _id: '2', name: 'Suresh Interior', company: 'Suresh Designs', phone: '9876543231', email: 'suresh@designs.com', city: 'Chennai', partnerType: 'Architect / Interior Designer', status: 'pending', createdAt: '2026-03-15' },
      { _id: '3', name: 'Kumar Tech', company: 'Kumar Technologies', phone: '9876543232', email: 'kumar@tech.com', city: 'Hyderabad', partnerType: 'Channel Partner', status: 'approved', createdAt: '2026-01-20' },
      { _id: '4', name: 'Arjun Contractors', company: 'Arjun Build', phone: '9876543233', email: 'arjun@build.com', city: 'Pune', partnerType: 'Contractor', status: 'contacted', createdAt: '2026-04-01' },
    ]);
  }, []);

  const filtered = filterStatus === 'all' ? partners : partners.filter(p => p.status === filterStatus);

  const handleStatusChange = (id: string, status: string) => {
    setPartners((prev) => prev.map((p) => p._id === id ? { ...p, status } : p));
    toast.success('Status updated');
  };

  return (
    <>
      <Helmet><title>Partners | Admin – Pravara World Tech</title></Helmet>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Partner Network</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage dealer, channel partner & associate registrations</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="bg-gray-800 px-3 py-1 rounded-full">{partners.length} Total</span>
            <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full">{partners.filter(p => p.status === 'active').length} Active</span>
            <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full">{partners.filter(p => p.status === 'pending').length} Pending</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {['all', ...STATUS_OPTIONS].map((s) => (
            <Button
              key={s}
              onClick={() => setFilterStatus(s)}
              variant={filterStatus === s ? 'primary' : 'secondary'}
              size="sm"
            >
              {s}
            </Button>
          ))}
        </div>

        {loading ? <Loading /> : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">Partner</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">Type</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">City</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">Contact</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-white">{p.name}</div>
                      <div className="text-xs text-gray-500">{p.company}</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">{p.partnerType}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-1 text-xs text-gray-400"><FiMapPin className="w-3 h-3 text-blue-400" />{p.city}</span>
                    </td>
                    <td className="px-5 py-4 space-y-1">
                      <a href={`tel:${p.phone}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"><FiPhone className="w-3 h-3 text-blue-400" />{p.phone}</a>
                      <a href={`mailto:${p.email}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white"><FiMail className="w-3 h-3 text-blue-400" />{p.email}</a>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusColor[p.status]}`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <select value={p.status} onChange={(e) => handleStatusChange(p._id, e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500">
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-500">No partners found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default PartnersPage;
