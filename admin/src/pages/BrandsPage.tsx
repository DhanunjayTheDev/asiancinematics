import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import Button from '../components/Button';
import CustomSelect from '../components/CustomSelect';

const CATEGORIES = ['Home Theatre & AV', 'Smart Home & Automation', 'Security & Surveillance', 'Acoustic & Decoratives', 'Networking', 'Lighting', 'Tensile & Structural'];
const TIERS = ['Premium', 'Enterprise', 'Professional', 'Consumer'];

const BrandsPage = () => {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');
  const [form, setForm] = useState({ name: '', description: '', category: '', country: '', tier: 'Professional', isActive: true });

  useEffect(() => {
    setBrands([
      { _id: '1', name: 'Yamaha', description: 'Premium AV receivers & amplifiers', category: 'Home Theatre & AV', country: 'Japan', tier: 'Premium', isActive: true },
      { _id: '2', name: 'Hikvision', description: 'IP cameras & NVR systems', category: 'Security & Surveillance', country: 'China', tier: 'Professional', isActive: true },
      { _id: '3', name: 'Lutron', description: 'Smart lighting & shading systems', category: 'Smart Home & Automation', country: 'USA', tier: 'Premium', isActive: true },
      { _id: '4', name: 'Ubiquiti', description: 'Enterprise Wi-Fi & networking', category: 'Networking', country: 'USA', tier: 'Professional', isActive: true },
      { _id: '5', name: 'Barrisol', description: 'Stretch ceiling systems', category: 'Acoustic & Decoratives', country: 'France', tier: 'Premium', isActive: true },
      { _id: '6', name: 'Epson', description: '4K laser projectors', category: 'Home Theatre & AV', country: 'Japan', tier: 'Premium', isActive: true },
    ]);
  }, []);

  const filtered = filterCat === 'All' ? brands : brands.filter(b => b.category === filterCat);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', category: '', country: '', tier: 'Professional', isActive: true });
    setModalOpen(true);
  };

  const openEdit = (b: any) => {
    setEditing(b);
    setForm({ name: b.name, description: b.description, category: b.category, country: b.country, tier: b.tier, isActive: b.isActive });
    setModalOpen(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      if (editing) {
        setBrands((prev) => prev.map((b) => b._id === editing._id ? { ...b, ...form } : b));
        toast.success('Brand updated');
      } else {
        setBrands((prev) => [...prev, { _id: Date.now().toString(), ...form }]);
        toast.success('Brand added');
      }
      setModalOpen(false);
      setSaving(false);
    }, 400);
  };

  const handleToggle = (id: string) => {
    setBrands((prev) => prev.map((b) => b._id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this brand?')) return;
    setBrands((prev) => prev.filter((b) => b._id !== id));
    toast.success('Brand deleted');
  };

  const tierColors: Record<string, string> = {
    Premium: 'text-yellow-400 bg-yellow-400/10',
    Enterprise: 'text-blue-400 bg-blue-400/10',
    Professional: 'text-green-400 bg-green-400/10',
    Consumer: 'text-gray-400 bg-gray-400/10',
  };

  return (
    <>
      <Helmet><title>Brands | Admin – Pravara World Tech</title></Helmet>
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold text-white">Brands</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage partner & authorized brands</p>
          </div>
          <Button onClick={openCreate}>+ Add Brand</Button>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          {['All', ...CATEGORIES].map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${filterCat === cat ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? <Loading /> : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((b) => (
              <div key={b._id} className={`bg-gray-900 border rounded-2xl p-5 transition-colors ${b.isActive ? 'border-gray-800 hover:border-blue-500/40' : 'border-gray-800 opacity-60'}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-white">{b.name}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${tierColors[b.tier]}`}>{b.tier}</span>
                </div>
                <p className="text-xs text-gray-400 mb-1">{b.description}</p>
                <p className="text-[11px] text-gray-600 mb-1">{b.category}</p>
                <p className="text-[11px] text-gray-600 mb-4">{b.country}</p>
                <div className="flex gap-2">
                  <Button onClick={() => openEdit(b)} variant="ghost" size="sm">Edit</Button>
                  <Button onClick={() => handleToggle(b._id)} variant={b.isActive ? 'secondary' : 'success'} size="sm">
                    {b.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button onClick={() => handleDelete(b._id)} variant="danger" size="sm">✕</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Brand' : 'Add Brand'}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Brand Name</label>
              <input value={form.name} onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Country of Origin</label>
              <input value={form.country} onChange={(e) => setForm((f) => ({...f, country: e.target.value}))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Japan" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description</label>
            <input value={form.description} onChange={(e) => setForm((f) => ({...f, description: e.target.value}))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Category</label>
              <CustomSelect
                value={form.category}
                onChange={(v) => setForm((f) => ({ ...f, category: String(v) }))}
                options={[{ value: '', label: 'Select...' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Tier</label>
              <CustomSelect
                value={form.tier}
                onChange={(v) => setForm((f) => ({ ...f, tier: String(v) }))}
                options={TIERS.map((t) => ({ value: t, label: t }))}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isActive} onChange={(e) => setForm((f) => ({...f, isActive: e.target.checked}))} className="w-4 h-4 accent-blue-500" />
            <span className="text-sm text-gray-300">Active / Visible</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button onClick={() => setModalOpen(false)} variant="secondary">Cancel</Button>
            <Button onClick={handleSave} disabled={saving} loading={saving}>
              {editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default BrandsPage;
