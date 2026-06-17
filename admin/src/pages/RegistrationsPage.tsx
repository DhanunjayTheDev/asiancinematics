import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiEye, FiUser, FiBriefcase, FiUsers, FiPlus, FiEyeOff } from 'react-icons/fi';
import api from '../lib/api';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

type RegStatus = 'pending' | 'approved' | 'rejected';
type RegType = 'all' | 'partner' | 'freelancer' | 'employee';

const typeConfig: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  partner:    { label: 'Partner',    color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', icon: <FiUsers className="w-3.5 h-3.5" /> },
  freelancer: { label: 'Freelancer', color: 'text-cyan-400',   bg: 'bg-cyan-400/10 border-cyan-400/30',     icon: <FiBriefcase className="w-3.5 h-3.5" /> },
  employee:   { label: 'Employee',   color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/30',   icon: <FiUser className="w-3.5 h-3.5" /> },
};

const statusConfig: Record<RegStatus, { label: string; color: string; bg: string }> = {
  pending:  { label: 'Pending',  color: 'text-amber-400',  bg: 'bg-amber-400/10 border-amber-400/30' },
  approved: { label: 'Approved', color: 'text-green-400',  bg: 'bg-green-400/10 border-green-400/30' },
  rejected: { label: 'Rejected', color: 'text-red-400',    bg: 'bg-red-400/10 border-red-400/30' },
};

const RegistrationsPage = () => {
  const [regs, setRegs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState<RegType>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [updating, setUpdating] = useState(false);

  // Create staff directly
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', phone: '', password: '', role: 'employee' as 'employee' | 'freelancer' });
  const [showCreatePwd, setShowCreatePwd] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/auth/users', createForm);
      toast.success(`${createForm.role === 'employee' ? 'Employee' : 'Freelancer'} account created`);
      setShowCreateModal(false);
      setCreateForm({ name: '', email: '', phone: '', password: '', role: 'employee' });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    } finally {
      setCreating(false);
    }
  };

  const fetchRegs = () => {
    setLoading(true);
    const params: any = { page, limit: 20 };
    if (filterType !== 'all') params.type = filterType;
    if (filterStatus !== 'all') params.status = filterStatus;

    api.get('/registrations/all', { params })
      .then(({ data }) => {
        setRegs(data.data);
        setTotalPages(data.meta?.totalPages || 1);
      })
      .catch(() => toast.error('Failed to load registrations'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { setPage(1); }, [filterType, filterStatus]);
  useEffect(() => { fetchRegs(); }, [page, filterType, filterStatus]);

  const openDetail = (reg: any) => {
    setSelected(reg);
    setRejectionReason('');
    setShowModal(true);
  };

  const handleStatusUpdate = async (status: 'approved' | 'rejected') => {
    if (!selected) return;
    if (status === 'rejected' && !rejectionReason.trim()) {
      toast.error('Enter a rejection reason');
      return;
    }
    setUpdating(true);
    try {
      await api.put(`/registrations/${selected._id}/status`, { status, rejectionReason });
      toast.success(`Registration ${status}`);
      setShowModal(false);
      fetchRegs();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(false);
    }
  };

  if (loading && regs.length === 0) return <Loading />;

  return (
    <>
      <Helmet><title>Registrations | Admin</title></Helmet>

      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Registrations</h1>
            <p className="text-sm text-gray-400 mt-1">Partner, Freelancer & Employee applications</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex-shrink-0"
          >
            <FiPlus className="w-4 h-4" /> Create Staff
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-gray-500 self-center">Type:</span>
            {(['all', 'partner', 'freelancer', 'employee'] as RegType[]).map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterType === t ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                {t === 'all' ? 'All Types' : typeConfig[t].label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-xs text-gray-500 self-center">Status:</span>
            {(['all', 'pending', 'approved', 'rejected']).map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
                {s === 'all' ? 'All Status' : statusConfig[s as RegStatus].label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-800/50">
                <th className="px-4 py-3 text-left font-semibold text-gray-300">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Name / Contact</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Type</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">City</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Role-specific</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {regs.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-10 text-center text-gray-400">No registrations found</td></tr>
              ) : regs.map((r, idx) => {
                const tc = typeConfig[r.type] || typeConfig.partner;
                const sc = statusConfig[r.status as RegStatus] || statusConfig.pending;
                const roleDetail = r.type === 'partner' ? r.partnerType
                  : r.type === 'freelancer' ? r.skills?.slice(0, 2).join(', ')
                  : r.position;
                return (
                  <tr key={r._id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                    <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * 20 + idx + 1}</td>
                    <td className="px-4 py-3">
                      <div className="text-white font-medium">{r.name}</div>
                      <div className="text-xs text-gray-400">{r.email}</div>
                      <div className="text-xs text-gray-500">{r.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${tc.bg} ${tc.color}`}>
                        {tc.icon} {tc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{r.city || '—'}</td>
                    <td className="px-4 py-3 text-gray-300 text-xs">{roleDetail || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${sc.bg} ${sc.color}`}>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => openDetail(r)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium">
                        <FiEye className="w-3.5 h-3.5" /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Create Staff Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-md">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
              <div>
                <h2 className="text-lg font-bold text-white">Create Staff Account</h2>
                <p className="text-xs text-gray-400 mt-0.5">Directly create an employee or freelancer login</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-white"><FiX className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Role</label>
                <div className="flex gap-3">
                  {(['employee', 'freelancer'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setCreateForm(f => ({ ...f, role: r }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize border transition ${createForm.role === r ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-gray-400'}`}
                    >
                      {r === 'employee' ? '👤 Employee' : '💼 Freelancer'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Full Name *</label>
                <input
                  required
                  value={createForm.name}
                  onChange={e => setCreateForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Full name"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email *</label>
                <input
                  required
                  type="email"
                  value={createForm.email}
                  onChange={e => setCreateForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="email@example.com"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Phone *</label>
                <input
                  required
                  type="tel"
                  value={createForm.phone}
                  onChange={e => setCreateForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="10-digit mobile number"
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password *</label>
                <div className="relative">
                  <input
                    required
                    type={showCreatePwd ? 'text' : 'password'}
                    value={createForm.password}
                    onChange={e => setCreateForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Min. 8 characters"
                    minLength={8}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 pr-10"
                  />
                  <button type="button" onClick={() => setShowCreatePwd(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                    {showCreatePwd ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-gray-800 text-gray-300 hover:bg-gray-700 transition">
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50">
                  {creating ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700 sticky top-0 bg-gray-900">
              <div>
                <h2 className="text-lg font-bold text-white">{selected.name}</h2>
                <p className="text-sm text-gray-400 capitalize">{selected.type} Application · {selected.status}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white"><FiX className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-4 text-sm">
              {/* Contact */}
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-gray-400 text-xs">Email</p><p className="text-white">{selected.email}</p></div>
                <div><p className="text-gray-400 text-xs">Phone</p><p className="text-white">{selected.phone}</p></div>
                {selected.city && <div><p className="text-gray-400 text-xs">City</p><p className="text-white">{selected.city}</p></div>}
              </div>

              {/* Partner specifics */}
              {selected.type === 'partner' && (
                <div className="grid grid-cols-2 gap-3">
                  {selected.company && <div><p className="text-gray-400 text-xs">Company</p><p className="text-white">{selected.company}</p></div>}
                  {selected.partnerType && <div><p className="text-gray-400 text-xs">Partner Type</p><p className="text-white">{selected.partnerType}</p></div>}
                </div>
              )}

              {/* Freelancer specifics */}
              {selected.type === 'freelancer' && (
                <div className="space-y-2">
                  {selected.skills?.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {selected.skills.map((s: string) => (
                          <span key={s} className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    {selected.availability && <div><p className="text-gray-400 text-xs">Availability</p><p className="text-white">{selected.availability}</p></div>}
                    {selected.portfolio && <div><p className="text-gray-400 text-xs">Portfolio</p><a href={selected.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">View</a></div>}
                  </div>
                </div>
              )}

              {/* Employee specifics */}
              {selected.type === 'employee' && (
                <div className="grid grid-cols-2 gap-3">
                  {selected.position && <div><p className="text-gray-400 text-xs">Position</p><p className="text-white">{selected.position}</p></div>}
                  {selected.qualification && <div><p className="text-gray-400 text-xs">Qualification</p><p className="text-white">{selected.qualification}</p></div>}
                  {selected.resumeLink && <div className="col-span-2"><p className="text-gray-400 text-xs">Resume</p><a href={selected.resumeLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline text-xs">View Resume</a></div>}
                </div>
              )}

              {selected.experience && <div><p className="text-gray-400 text-xs">Experience</p><p className="text-white">{selected.experience}</p></div>}
              {selected.message && <div><p className="text-gray-400 text-xs">Message</p><p className="text-white">{selected.message}</p></div>}

              {selected.status === 'rejected' && selected.rejectionReason && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                  <p className="text-xs text-red-400 font-semibold mb-1">Rejection Reason</p>
                  <p className="text-white text-sm">{selected.rejectionReason}</p>
                </div>
              )}

              {selected.status === 'approved' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3">
                  <p className="text-xs text-green-400 font-semibold">✓ Application approved. User account created.</p>
                </div>
              )}

              {/* Actions only for pending */}
              {selected.status === 'pending' && (
                <div className="space-y-3 pt-2 border-t border-gray-700">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Rejection Reason (required if rejecting)</label>
                    <textarea
                      value={rejectionReason}
                      onChange={e => setRejectionReason(e.target.value)}
                      rows={2}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 resize-none"
                      placeholder="Reason for rejection..."
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleStatusUpdate('rejected')}
                      disabled={updating}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600/20 border border-red-600/40 hover:bg-red-600/30 text-red-400 font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                    >
                      <FiX className="w-4 h-4" /> Reject
                    </button>
                    <button
                      onClick={() => handleStatusUpdate('approved')}
                      disabled={updating}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
                    >
                      <FiCheck className="w-4 h-4" /> {updating ? 'Processing...' : 'Approve'}
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 text-center">Approving creates a user account. The applicant can log in with the email + password they set during registration.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegistrationsPage;
