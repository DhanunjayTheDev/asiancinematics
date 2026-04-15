import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { FiMail, FiPhone, FiUser, FiCalendar, FiDollarSign, FiMessageSquare, FiFilter, FiChevronDown } from 'react-icons/fi';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';
import CustomSelect from '../components/CustomSelect';

const statusConfig: Record<string, { color: string; bg: string; dot: string; label: string }> = {
  new: { color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/30', dot: 'bg-blue-400', label: 'New' },
  contacted: { color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/30', dot: 'bg-amber-400', label: 'Contacted' },
  qualified: { color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/30', dot: 'bg-cyan-400', label: 'Qualified' },
  proposal_sent: { color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/30', dot: 'bg-purple-400', label: 'Proposal Sent' },
  converted: { color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/30', dot: 'bg-emerald-400', label: 'Converted' },
  closed: { color: 'text-gray-400', bg: 'bg-gray-400/10 border-gray-400/30', dot: 'bg-gray-500', label: 'Closed' },
};

const sourceIcons: Record<string, string> = {
  website: '🌐',
  whatsapp: '💬',
  phone: '📞',
  email: '📧',
  other: '📋',
};

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selected, setSelected] = useState<any>(null);
  const [newStatus, setNewStatus] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [view, setView] = useState<'cards' | 'table'>('cards');

  const fetchInquiries = () => {
    setLoading(true);
    api.get('/inquiries/all', { params: { page, limit: 20 } }).then(({ data }) => {
      setInquiries(data.data);
      setTotalPages(data.meta?.totalPages || 1);
    }).catch(() => toast.error('Failed to load inquiries')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchInquiries(); }, [page]);

  const handleStatusUpdate = async () => {
    if (!selected || !newStatus) return;
    try {
      await api.put(`/inquiries/${selected._id}/status`, { status: newStatus });
      toast.success('Status updated');
      setSelected(null);
      fetchInquiries();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  const filtered = filterStatus === 'all' ? inquiries : inquiries.filter((i) => i.status === filterStatus);

  const getStatusCounts = () => {
    const counts: Record<string, number> = { all: inquiries.length };
    inquiries.forEach((i) => { counts[i.status] = (counts[i.status] || 0) + 1; });
    return counts;
  };
  const counts = getStatusCounts();

  return (
    <>
      <Helmet><title>Inquiries | Admin</title></Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Inquiries & Leads</h1>
            <p className="text-sm text-gray-400 mt-1">{inquiries.length} total inquiries</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setView('cards')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${view === 'cards' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              Cards
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${view === 'table' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}
            >
              Table
            </button>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[{ key: 'all', label: 'All' }, ...Object.entries(statusConfig).map(([key, val]) => ({ key, label: val.label }))].map((s) => (
            <button
              key={s.key}
              onClick={() => setFilterStatus(s.key)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                filterStatus === s.key
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-300'
              }`}
            >
              {s.label}
              {counts[s.key] !== undefined && (
                <span className={`min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-[10px] font-bold ${
                  filterStatus === s.key ? 'bg-white/20' : 'bg-gray-800'
                }`}>
                  {counts[s.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? <Loading /> : filtered.length === 0 ? (
          <div className="text-center py-16">
            <FiMail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No inquiries found</p>
            <p className="text-gray-600 text-sm mt-1">Inquiries will appear here when customers reach out</p>
          </div>
        ) : view === 'cards' ? (
          /* Card View */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((inq) => {
              const status = statusConfig[inq.status] || statusConfig.new;
              return (
                <div
                  key={inq._id}
                  className="group bg-gradient-to-b from-gray-900 to-gray-900/50 border border-gray-800 rounded-2xl p-5 hover:border-blue-500/40 transition-all duration-300 cursor-pointer"
                  onClick={() => { setSelected(inq); setNewStatus(inq.status); }}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${status.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                        <span className={status.color}>{status.label}</span>
                      </span>
                    </div>
                    <span className="text-lg">{sourceIcons[inq.source] || '📋'}</span>
                  </div>

                  {/* Subject */}
                  <h3 className="text-sm font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-300 transition-colors">
                    {inq.subject || 'No Subject'}
                  </h3>

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <FiUser className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate font-medium text-gray-300">{inq.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <FiMail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                      <span className="truncate">{inq.email}</span>
                    </div>
                    {inq.phone && (
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <FiPhone className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                        <span>{inq.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Message Preview */}
                  {inq.message && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
                      {inq.message}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                    {inq.budget ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <FiDollarSign className="w-3 h-3" />₹{typeof inq.budget === 'number' ? inq.budget.toLocaleString() : inq.budget}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-600">No budget</span>
                    )}
                    <span className="flex items-center gap-1 text-[11px] text-gray-500">
                      <FiCalendar className="w-3 h-3" />
                      {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View */
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black/60">
                  <tr>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Lead</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Contact</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Subject</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Budget</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filtered.map((inq) => {
                    const status = statusConfig[inq.status] || statusConfig.new;
                    return (
                      <tr
                        key={inq._id}
                        className="hover:bg-blue-500/5 cursor-pointer transition-colors"
                        onClick={() => { setSelected(inq); setNewStatus(inq.status); }}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center text-blue-400 text-xs font-bold flex-shrink-0">
                              {inq.name?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm">{inq.name}</p>
                              <p className="text-[11px] text-gray-500">{sourceIcons[inq.source]} {inq.source}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-gray-300">{inq.email}</p>
                          <p className="text-[11px] text-gray-500">{inq.phone}</p>
                        </td>
                        <td className="px-5 py-4 max-w-xs">
                          <p className="text-sm text-white truncate font-medium">{inq.subject}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-semibold text-emerald-400">
                            {inq.budget ? `₹${typeof inq.budget === 'number' ? inq.budget.toLocaleString() : inq.budget}` : '—'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${status.bg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            <span className={status.color}>{status.label}</span>
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>

      {/* Detail / Manage Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full z-10 border border-blue-500/20 overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Inquiry Details</h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${(statusConfig[selected.status] || statusConfig.new).bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${(statusConfig[selected.status] || statusConfig.new).dot}`}></span>
                      <span className={(statusConfig[selected.status] || statusConfig.new).color}>{(statusConfig[selected.status] || statusConfig.new).label}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                      {sourceIcons[selected.source]} via {selected.source}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors">
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[50vh] overflow-y-auto">
              {/* Subject */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Subject</p>
                <p className="text-sm text-white font-medium">{selected.subject}</p>
              </div>

              {/* Contact Details Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FiUser className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px] text-gray-500 font-semibold">Name</span>
                  </div>
                  <p className="text-sm text-white font-medium">{selected.name}</p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FiPhone className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px] text-gray-500 font-semibold">Phone</span>
                  </div>
                  <p className="text-sm text-white font-medium">{selected.phone || '—'}</p>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1">
                  <FiMail className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-[11px] text-gray-500 font-semibold">Email</span>
                </div>
                <p className="text-sm text-white font-medium">{selected.email}</p>
              </div>

              {/* Budget */}
              {selected.budget && (
                <div className="bg-emerald-400/5 border border-emerald-400/20 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FiDollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] text-gray-500 font-semibold">Budget</span>
                  </div>
                  <p className="text-sm text-emerald-400 font-bold">₹{typeof selected.budget === 'number' ? selected.budget.toLocaleString() : selected.budget}</p>
                </div>
              )}

              {/* Message */}
              {selected.message && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FiMessageSquare className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">Message</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed bg-gray-800/50 rounded-xl p-4">{selected.message}</p>
                </div>
              )}

              {/* Requirements */}
              {selected.requirements && (
                <div>
                  <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-2">Requirements</p>
                  <p className="text-sm text-gray-300 leading-relaxed bg-gray-800/50 rounded-xl p-4">{selected.requirements}</p>
                </div>
              )}
            </div>

            {/* Modal Footer - Status Update */}
            <div className="p-6 border-t border-gray-800 bg-gray-900">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Update Status</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <CustomSelect
                    value={newStatus}
                    onChange={(value) => setNewStatus(String(value))}
                    options={[
                      { value: 'new', label: 'New' },
                      { value: 'contacted', label: 'Contacted' },
                      { value: 'qualified', label: 'Qualified' },
                      { value: 'proposal_sent', label: 'Proposal Sent' },
                      { value: 'converted', label: 'Converted' },
                      { value: 'closed', label: 'Closed' },
                    ]}
                  />
                </div>
                <button 
                  onClick={handleStatusUpdate} 
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-600/30"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InquiriesPage;
