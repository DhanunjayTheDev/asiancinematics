import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEye } from 'react-icons/fi';
import api from '../lib/api';
import Loading from '../components/Loading';
import Button from '../components/Button';
import Pagination from '../components/Pagination';

const InvoicesListPage = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  const fetchInvoices = () => {
    setLoading(true);
    const params: any = { page, limit: 20 };
    if (search) params.search = search;
    api.get('/invoices', { params })
      .then(({ data }) => {
        setInvoices(data.data || []);
        setTotalPages(data.meta?.totalPages || 1);
      })
      .catch(() => toast.error('Failed to load invoices'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchInvoices(); }, [page]);

  const handleDelete = async (id: string, invoiceNo: string) => {
    if (!confirm(`Delete invoice ${invoiceNo}?`)) return;
    try {
      await api.delete(`/invoices/${id}`);
      toast.success('Invoice deleted');
      fetchInvoices();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${day} ${months[parseInt(m) - 1]} ${y}`;
  };

  return (
    <>
      <Helmet><title>Invoices | Admin</title></Helmet>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Invoices</h1>
            <p className="text-sm text-gray-400 mt-0.5">All saved quotations &amp; invoices</p>
          </div>
          <div className="flex gap-2">
            <form onSubmit={(e) => { e.preventDefault(); setPage(1); fetchInvoices(); }} className="flex gap-2">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Invoice no / customer…"
                className="input-field w-48"
              />
              <Button type="submit" size="sm">Search</Button>
            </form>
            <Button size="sm" onClick={() => navigate('/invoices/new')} className="flex items-center gap-1.5">
              <FiPlus className="w-4 h-4" /> New Invoice
            </Button>
          </div>
        </div>

        {loading ? <Loading /> : invoices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm mb-4">No invoices saved yet.</p>
            <Button onClick={() => navigate('/invoices/new')} className="inline-flex items-center gap-2">
              <FiPlus className="w-4 h-4" /> Create First Invoice
            </Button>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-2xl border border-blue-500/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black text-gray-400 text-left">
                  <tr>
                    <th className="px-5 py-3 font-medium">Invoice No</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Offer Title</th>
                    <th className="px-5 py-3 font-medium">Items</th>
                    <th className="px-5 py-3 font-medium text-right">Grand Total</th>
                    <th className="px-5 py-3 font-medium">Created By</th>
                    <th className="px-5 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-500/10">
                  {invoices.map((inv) => (
                    <tr key={inv._id} className="hover:bg-blue-500/5 transition-colors">
                      <td className="px-5 py-3">
                        <span className="font-mono text-blue-400 font-semibold text-xs">{inv.invoiceNo}</span>
                      </td>
                      <td className="px-5 py-3 text-gray-300 text-xs">{formatDate(inv.date)}</td>
                      <td className="px-5 py-3">
                        <div className="text-white text-xs font-medium">{inv.customerName || '—'}</div>
                        {inv.customerPhone && <div className="text-gray-500 text-[10px]">{inv.customerPhone}</div>}
                      </td>
                      <td className="px-5 py-3 text-gray-300 text-xs max-w-[160px] truncate">{inv.offerTitle || '—'}</td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{inv.items?.length || 0} items</td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-yellow-400 font-bold text-sm">
                          {inv.grandTotal > 0 ? `₹${inv.grandTotal.toLocaleString('en-IN')}` : '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-400 text-xs">{inv.createdBy?.name || '—'}</td>
                      <td className="px-5 py-3">
                        <div className="flex gap-3">
                          <button
                            onClick={() => navigate('/invoices/new', { state: { invoice: inv } })}
                            className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
                          >
                            <FiEye className="w-3.5 h-3.5" /> View
                          </button>
                          <button
                            onClick={() => handleDelete(inv._id, inv.invoiceNo)}
                            className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </>
  );
};

export default InvoicesListPage;
