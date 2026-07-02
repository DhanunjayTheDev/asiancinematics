import { useState, useRef, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiDownload, FiPrinter, FiSave, FiList } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import api from '../lib/api';

interface LineItem {
  id: number;
  brand: string;
  model: string;
  description: string;
  qty: number | '';
  unitPrice: number | '';
}

const newItem = (id: number): LineItem => ({
  id, brand: '', model: '', description: '', qty: '', unitPrice: '',
});

const InvoicePage = () => {
  const navigate = useNavigate();
  const [invoiceNo, setInvoiceNo] = useState('');
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [offerLabel, setOfferLabel] = useState('');
  const [offerTitle, setOfferTitle] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [items, setItems] = useState<LineItem[]>([newItem(1), newItem(2), newItem(3)]);
  const [notes, setNotes] = useState(
    'Quotation validity – 7 days only\nPrices may change without prior notice due to market / dollar fluctuations\nEarly booking eligible for special discount\nPremium quality with long operational life\nDamage-free installation – No unnecessary wall damage\nComplete support from planning → execution → handover\nBest balance of Quality + Pricing + Service'
  );
  const [paymentTerms, setPaymentTerms] = useState(
    '75% Advance – Full project confirmation\n25% Advance – Cabling / work initiation schedule'
  );
  const [authorizedBy, setAuthorizedBy] = useState('PRAVEEN KUMAR YOUGI A');
  const [designation, setDesignation] = useState('BY ECOP AVIRA TEAM');
  const [validityNote, setValidityNote] = useState(
    "This quotation is valid for seven (7) days from the date of issue. After this period, without prior notice, the offer shall be deemed terminated in accordance with the brand's policies and prevailing conditions."
  );
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const nextId = useRef(4);
  const printRef = useRef<HTMLDivElement>(null);

  // fetch next invoice number + recent invoices on mount
  useEffect(() => {
    api.get('/invoices/next-number')
      .then(({ data }) => setInvoiceNo(data.data.nextNumber))
      .catch(() => setInvoiceNo('INV-1001'));

    api.get('/invoices?limit=5')
      .then(({ data }) => setRecentInvoices(data.data || []))
      .catch(() => {});
  }, []);

  const addRow = () => setItems(prev => [...prev, newItem(nextId.current++)]);
  const removeRow = (id: number) => setItems(prev => prev.filter(i => i.id !== id));

  const updateItem = useCallback(<K extends keyof LineItem>(id: number, key: K, value: LineItem[K]) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [key]: value } : i));
  }, []);

  const rowTotal = (item: LineItem) => (Number(item.qty) || 0) * (Number(item.unitPrice) || 0);
  const grandTotal = items.reduce((sum, i) => sum + rowTotal(i), 0);
  const fmt = (n: number) => n > 0 ? n.toLocaleString('en-IN') : '0';

  const buildPayload = () => ({
    invoiceNo,
    date,
    offerLabel,
    offerTitle,
    customerName,
    customerPhone,
    customerAddress,
    items: items.map(i => ({
      brand: i.brand,
      model: i.model,
      description: i.description,
      qty: Number(i.qty) || 0,
      unitPrice: Number(i.unitPrice) || 0,
    })),
    notes,
    paymentTerms,
    validityNote,
    authorizedBy,
    designation,
  });

  const handleSave = async () => {
    if (!invoiceNo) { toast.error('Invoice number required'); return; }
    setSaving(true);
    try {
      await api.post('/invoices', buildPayload());
      toast.success(`Invoice ${invoiceNo} saved`);
      // fetch next number for next invoice
      const { data } = await api.get('/invoices/next-number');
      setInvoiceNo(data.data.nextNumber);
      const { data: listData } = await api.get('/invoices?limit=5');
      setRecentInvoices(listData.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save invoice');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const win = window.open('', '_blank', 'width=900,height=700');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>${invoiceNo}</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;font-size:9px;background:#fff;color:#000;}@page{size:A4 portrait;margin:10mm;}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}</style></head><body>${content.innerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 500);
  };

  const handleDownload = async () => {
    const content = printRef.current;
    if (!content) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(content, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: 720,
        windowWidth: 720,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const margin = 10;
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const contentW = pdfW - margin * 2;
      const imgH = (canvas.height * contentW) / canvas.width;
      const usableH = pdfH - margin * 2;

      if (imgH <= usableH) {
        pdf.addImage(imgData, 'PNG', margin, margin, contentW, imgH);
      } else {
        let yOffset = 0;
        while (yOffset < imgH) {
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, margin - yOffset, contentW, imgH);
          yOffset += usableH;
        }
      }
      pdf.save(`${invoiceNo}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const formatDate = (d: string) => {
    if (!d) return '';
    const [y, m, day] = d.split('-');
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${day} ${months[parseInt(m) - 1]} ${y}`;
  };

  return (
    <>
      <Helmet><title>Create Invoice | Admin</title></Helmet>

      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Create Invoice</h1>
            <p className="text-sm text-gray-400 mt-0.5">Fill details → save → download PDF</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => navigate('/invoices')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors border border-gray-700"
            >
              <FiList className="w-4 h-4" /> All Invoices
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <FiSave className="w-4 h-4" /> {saving ? 'Saving…' : 'Save Invoice'}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-sm font-medium transition-colors border border-gray-700"
            >
              <FiPrinter className="w-4 h-4" /> Print
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors"
            >
              <FiDownload className="w-4 h-4" /> {downloading ? 'Generating…' : 'Download PDF'}
            </button>
          </div>
        </div>

        {/* Recent invoice numbers */}
        {recentInvoices.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">Recent:</span>
            {recentInvoices.map((inv) => (
              <span key={inv._id} className="text-xs bg-gray-800 border border-gray-700 text-gray-300 px-2.5 py-1 rounded-lg font-mono">
                {inv.invoiceNo} {inv.customerName ? `· ${inv.customerName}` : ''}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* ── FORM ── */}
          <div className="space-y-5">
            {/* Invoice Meta */}
            <div className="bg-gray-900 rounded-2xl border border-blue-500/20 p-5 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2">Invoice Details</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Invoice Number</label>
                  <input
                    value={invoiceNo}
                    onChange={e => setInvoiceNo(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Offer Label <span className="text-gray-600">(top-right)</span></label>
                  <input
                    placeholder="e.g. 7.2.4 OFFER"
                    value={offerLabel}
                    onChange={e => setOfferLabel(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Offer Title <span className="text-gray-600">(center heading)</span></label>
                  <input
                    placeholder="e.g. 7.2.4 ELAC HOME THEATER"
                    value={offerTitle}
                    onChange={e => setOfferTitle(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Customer */}
            <div className="bg-gray-900 rounded-2xl border border-blue-500/20 p-5 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2">Customer / Project</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Customer Name</label>
                <input
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Mr. / Mrs. ..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Phone</label>
                  <input
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    placeholder="+91 ..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Address / Project Location</label>
                  <input
                    value={customerAddress}
                    onChange={e => setCustomerAddress(e.target.value)}
                    placeholder="City, State"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-gray-900 rounded-2xl border border-blue-500/20 p-5 space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2">Line Items</h2>
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={item.id} className="bg-gray-800/60 rounded-xl p-3 space-y-2 border border-gray-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500">#{idx + 1}</span>
                      <button onClick={() => removeRow(item.id)} className="text-red-500 hover:text-red-400 p-1">
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input placeholder="Brand" value={item.brand} onChange={e => updateItem(item.id, 'brand', e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
                      <input placeholder="Model" value={item.model} onChange={e => updateItem(item.id, 'model', e.target.value)}
                        className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
                    </div>
                    <input placeholder="Item Description" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500" />
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-500 font-medium">Qty</label>
                        <input type="number" placeholder="0" value={item.qty}
                          onChange={e => updateItem(item.id, 'qty', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 mt-0.5" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 font-medium">Unit Price (₹)</label>
                        <input type="number" placeholder="0" value={item.unitPrice}
                          onChange={e => updateItem(item.id, 'unitPrice', e.target.value === '' ? '' : Number(e.target.value))}
                          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 mt-0.5" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 font-medium">Total (₹)</label>
                        <div className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-1.5 text-xs text-yellow-400 font-semibold mt-0.5 min-h-[30px]">
                          {rowTotal(item) > 0 ? fmt(rowTotal(item)) : '—'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addRow}
                className="flex items-center gap-2 w-full justify-center py-2 border border-dashed border-gray-600 rounded-xl text-xs text-gray-400 hover:text-white hover:border-blue-500 transition-colors">
                <FiPlus className="w-3.5 h-3.5" /> Add Row
              </button>
              <div className="flex justify-end pt-1">
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-xl px-5 py-2 text-sm font-bold text-white">
                  Grand Total: <span className="text-yellow-400">₹{fmt(grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div className="bg-gray-900 rounded-2xl border border-blue-500/20 p-5 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2">Notes & Terms</h2>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Special Notes</label>
                <textarea rows={5} value={notes} onChange={e => setNotes(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Payment Terms</label>
                <textarea rows={3} value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Validity Note</label>
                <textarea rows={3} value={validityNote} onChange={e => setValidityNote(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none" />
              </div>
            </div>

            {/* Signature */}
            <div className="bg-gray-900 rounded-2xl border border-blue-500/20 p-5 space-y-4">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-gray-800 pb-2">Signature</h2>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Authorized By</label>
                  <input value={authorizedBy} onChange={e => setAuthorizedBy(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Designation / Team</label>
                  <input value={designation} onChange={e => setDesignation(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* ── PREVIEW ── */}
          <div className="xl:sticky xl:top-4 self-start">
            <div className="bg-gray-900 rounded-2xl border border-blue-500/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Live Preview · A4 Portrait</p>
                <button onClick={handleDownload} disabled={downloading}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg text-xs font-medium transition-colors">
                  <FiDownload className="w-3 h-3" /> {downloading ? 'Generating…' : 'Export PDF'}
                </button>
              </div>

              {/* Invoice Preview — fixed 720px width for consistent A4 PDF output */}
              <div style={{ overflowX: 'auto' }}>
                <div
                  ref={printRef}
                  style={{ fontFamily: 'Arial, sans-serif', fontSize: '9px', color: '#000', background: '#fff', padding: '8px', width: '720px' }}
                >
                  {/* Header */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
                    <tbody>
                      <tr>
                        <td style={{ background: '#cc0000', padding: '6px 8px', verticalAlign: 'middle', width: '55%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                            <img src="/logo.png" alt="logo" style={{ width: '34px', height: '34px', borderRadius: '50%', border: '2px solid #fff', objectFit: 'cover' }} />
                            <div>
                              <div style={{ color: '#fff', fontWeight: 900, fontSize: '12px', letterSpacing: '0.5px', fontFamily: 'Georgia, serif', textTransform: 'uppercase' }}>
                                Asian Cinematics
                              </div>
                              <div style={{ color: '#ffd700', fontSize: '7px', fontStyle: 'italic', fontWeight: 600, marginTop: '1px' }}>
                                WHERE DESIGN , TECHNOLOGY &amp; EMOTION UNITE
                              </div>
                            </div>
                          </div>
                          <div style={{ marginTop: '4px', color: '#fff', fontSize: '8px' }}>
                            <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ background: '#fff2', padding: '1px 5px', borderRadius: '3px' }}>Smart Security</span>
                              <span style={{ background: '#fff2', padding: '1px 5px', borderRadius: '3px' }}>Smart Entertainment</span>
                              <span style={{ background: '#fff2', padding: '1px 5px', borderRadius: '3px' }}>Decorative &amp; Lighting</span>
                            </div>
                            <div style={{ marginTop: '3px', fontWeight: 700, fontSize: '8px' }}>📞 9849697886 | 9966167886</div>
                            <div style={{ marginTop: '1px', fontSize: '7px', color: '#ffd700' }}>Asian Cinematics &amp; Pravara World Tech</div>
                          </div>
                        </td>
                        <td style={{ background: '#1a1a2e', padding: '6px 8px', verticalAlign: 'top', textAlign: 'right' }}>
                          <div style={{ color: '#ffd700', fontWeight: 700, fontSize: '9px', marginBottom: '3px' }}>{offerLabel || '— OFFER —'}</div>
                          <div style={{ color: '#aaa', fontSize: '8px', marginBottom: '2px' }}>Invoice No: <span style={{ color: '#fff', fontWeight: 700 }}>{invoiceNo}</span></div>
                          <div style={{ color: '#aaa', fontSize: '8px', marginBottom: '2px' }}>Date: <span style={{ color: '#fff', fontWeight: 700 }}>{formatDate(date)}</span></div>
                          {customerName && <div style={{ color: '#aaa', fontSize: '8px', marginBottom: '1px' }}>To: <span style={{ color: '#fff', fontWeight: 700 }}>{customerName}</span></div>}
                          {customerPhone && <div style={{ color: '#aaa', fontSize: '8px', marginBottom: '1px' }}>Ph: <span style={{ color: '#fff' }}>{customerPhone}</span></div>}
                          {customerAddress && <div style={{ color: '#aaa', fontSize: '8px' }}>{customerAddress}</div>}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Offer Title */}
                  <div style={{ background: '#111', color: '#fff', textAlign: 'center', padding: '5px', fontWeight: 900, fontSize: '11px', letterSpacing: '0.5px', marginBottom: '2px', border: '1px solid #333' }}>
                    {offerTitle || 'QUOTATION / INVOICE'}
                  </div>

                  {/* Items Table */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px', fontSize: '8px' }}>
                    <thead>
                      <tr style={{ background: '#222', color: '#fff' }}>
                        <th style={{ padding: '4px 5px', border: '1px solid #444', textAlign: 'center', width: '28px' }}>SL</th>
                        <th style={{ padding: '4px 5px', border: '1px solid #444', textAlign: 'left' }}>Brand</th>
                        <th style={{ padding: '4px 5px', border: '1px solid #444', textAlign: 'left' }}>Model</th>
                        <th style={{ padding: '4px 5px', border: '1px solid #444', textAlign: 'left' }}>Item Description</th>
                        <th style={{ padding: '4px 5px', border: '1px solid #444', textAlign: 'center', width: '32px' }}>Qty</th>
                        <th style={{ padding: '4px 5px', border: '1px solid #444', textAlign: 'right', width: '72px' }}>Unit Price (INR)</th>
                        <th style={{ padding: '4px 5px', border: '1px solid #444', textAlign: 'right', width: '72px' }}>Total (INR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => {
                        const total = rowTotal(item);
                        return (
                          <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fafafa' : '#f0f0f0' }}>
                            <td style={{ padding: '3px 5px', border: '1px solid #ddd', textAlign: 'center', fontWeight: 700 }}>{idx + 1}</td>
                            <td style={{ padding: '3px 5px', border: '1px solid #ddd', fontWeight: 600 }}>{item.brand}</td>
                            <td style={{ padding: '3px 5px', border: '1px solid #ddd' }}>{item.model}</td>
                            <td style={{ padding: '3px 5px', border: '1px solid #ddd' }}>{item.description}</td>
                            <td style={{ padding: '3px 5px', border: '1px solid #ddd', textAlign: 'center' }}>{item.qty !== '' ? item.qty : 0}</td>
                            <td style={{ padding: '3px 5px', border: '1px solid #ddd', textAlign: 'right' }}>{item.unitPrice !== '' ? Number(item.unitPrice).toLocaleString('en-IN') : 0}</td>
                            <td style={{ padding: '3px 5px', border: '1px solid #ddd', textAlign: 'right', fontWeight: 700, color: total > 0 ? '#b8860b' : '#999' }}>
                              {total > 0 ? fmt(total) : '0'}
                            </td>
                          </tr>
                        );
                      })}
                      <tr style={{ background: '#1a1a2e' }}>
                        <td colSpan={5} style={{ padding: '5px 8px', color: '#fff', fontWeight: 900, fontSize: '9px', textAlign: 'right', border: '1px solid #333' }}>Total cost</td>
                        <td colSpan={2} style={{ padding: '5px 8px', color: '#ffd700', fontWeight: 900, fontSize: '9px', textAlign: 'right', border: '1px solid #333' }}>Rs{fmt(grandTotal)}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Notes + Terms */}
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2px' }}>
                    <tbody>
                      <tr>
                        <td style={{ verticalAlign: 'top', padding: '5px 7px', border: '1px solid #ddd', width: '65%', fontSize: '7.5px' }}>
                          <div style={{ fontWeight: 700, marginBottom: '2px', color: '#cc0000' }}>⚠ Special Notes</div>
                          {notes.split('\n').filter(Boolean).map((n, i) => <div key={i} style={{ marginBottom: '1px' }}>* {n}</div>)}
                          <div style={{ marginTop: '5px', fontWeight: 700, color: '#333' }}>⚠ Terms &amp; Conditions</div>
                          <div style={{ marginTop: '1px' }}>* Prices are non-negotiable</div>
                          <div>* Kindly keep this quotation confidential. Do not send &amp; forward</div>
                          <div>* No payment without written approval from Director</div>
                          <div>* Any unlisted item will be charged extra</div>
                          <div>* Final pricing subject to payment confirmation</div>
                          <div style={{ marginTop: '5px', fontWeight: 700, color: '#333' }}>💳 Payment Terms</div>
                          {paymentTerms.split('\n').filter(Boolean).map((t, i) => <div key={i} style={{ marginBottom: '1px' }}>🔸 {t}</div>)}
                        </td>
                        <td style={{ verticalAlign: 'top', padding: '5px 7px', border: '1px solid #ddd', textAlign: 'center' }}>
                          <div style={{ marginBottom: '28px', fontSize: '7.5px', color: '#555', fontStyle: 'italic' }}>
                            Please confirm to proceed. Upon confirmation, we will issue the final quotation with bank details and work schedule.
                          </div>
                          <div style={{ borderTop: '1px solid #999', paddingTop: '4px' }}>
                            <div style={{ fontWeight: 900, color: '#cc0000', fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>THANKING YOU</div>
                            <div style={{ fontWeight: 700, fontSize: '8px', marginTop: '3px', color: '#1a1a2e', textTransform: 'uppercase' }}>{authorizedBy}</div>
                            <div style={{ fontSize: '7.5px', color: '#555', marginTop: '1px' }}>{designation}</div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {validityNote && (
                    <div style={{ fontSize: '7px', color: '#555', textAlign: 'justify', padding: '4px 7px', borderTop: '1px solid #ddd', fontStyle: 'italic' }}>
                      "{validityNote}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicePage;
