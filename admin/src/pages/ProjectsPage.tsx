import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { FiMapPin, FiCalendar, FiStar } from 'react-icons/fi';
import Loading from '../components/Loading';
import Modal from '../components/Modal';
import CustomSelect from '../components/CustomSelect';
import Button from '../components/Button';

const CATEGORIES = ['Home Theatre', 'Stretch Ceiling', 'Epoxy Flooring', 'Smart Home', 'CCTV & Security', 'Tensile Structure', 'Lighting', 'Other'];

const ProjectsPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: '', location: '', completedDate: '',
    client: '', tags: '', featured: false,
  });

  // For now use local state; once /projects API is wired this switches to api calls
  useEffect(() => {
    setProjects([
      { _id: '1', title: 'Luxury Home Theatre – Jubilee Hills', category: 'Home Theatre', location: 'Hyderabad', completedDate: '2025-12', client: 'Private Residence', featured: true, tags: ['Dolby Atmos', 'Stretch Ceiling'] },
      { _id: '2', title: 'Star Ceiling – Banjara Hills Villa', category: 'Stretch Ceiling', location: 'Hyderabad', completedDate: '2025-11', client: 'Villa Project', featured: true, tags: ['Star Ceiling'] },
      { _id: '3', title: 'Tensile Carport – IT Park', category: 'Tensile Structure', location: 'Hyderabad', completedDate: '2025-08', client: 'IT Campus', featured: false, tags: ['PVDF Fabric'] },
    ]);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', description: '', category: '', location: '', completedDate: '', client: '', tags: '', featured: false });
    setModalOpen(true);
  };

  const openEdit = (p: any) => {
    setEditing(p);
    setForm({ title: p.title, description: p.description || '', category: p.category, location: p.location, completedDate: p.completedDate, client: p.client || '', tags: (p.tags || []).join(', '), featured: p.featured });
    setModalOpen(true);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      const tags = form.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
      if (editing) {
        setProjects((prev) => prev.map((p) => p._id === editing._id ? { ...p, ...form, tags } : p));
        toast.success('Project updated');
      } else {
        setProjects((prev) => [...prev, { _id: Date.now().toString(), ...form, tags }]);
        toast.success('Project created');
      }
      setModalOpen(false);
      setSaving(false);
    }, 400);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this project?')) return;
    setProjects((prev) => prev.filter((p) => p._id !== id));
    toast.success('Project deleted');
  };

  return (
    <>
      <Helmet><title>Projects | Admin – Pravara World Tech</title></Helmet>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-sm text-gray-400 mt-0.5">Manage completed project portfolio</p>
          </div>
          <Button onClick={openCreate}>+ Add Project</Button>
        </div>

        {loading ? <Loading /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <div key={p._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-blue-500/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-semibold text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">{p.category}</span>
                  {p.featured && <FiStar className="w-4 h-4 text-yellow-400" />}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{p.title}</h3>
                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5"><FiMapPin className="w-3 h-3 text-blue-400" />{p.location}</div>
                  <div className="flex items-center gap-1.5"><FiCalendar className="w-3 h-3 text-blue-400" />{p.completedDate}</div>
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {(p.tags || []).map((tag: string) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-gray-800 text-gray-400 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => openEdit(p)} variant="ghost" size="sm">Edit</Button>
                  <Button onClick={() => handleDelete(p._id)} variant="danger" size="sm">Delete</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Project' : 'Add Project'}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Project Title</label>
            <input value={form.title} onChange={(e) => setForm((f) => ({...f, title: e.target.value}))}
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
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Location</label>
              <input value={form.location} onChange={(e) => setForm((f) => ({...f, location: e.target.value}))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Hyderabad" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Completed Date</label>
              <input value={form.completedDate} onChange={(e) => setForm((f) => ({...f, completedDate: e.target.value}))} type="month"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Client Name</label>
              <input value={form.client} onChange={(e) => setForm((f) => ({...f, client: e.target.value}))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Private Client" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({...f, description: e.target.value}))} rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Tags (comma separated)</label>
            <input value={form.tags} onChange={(e) => setForm((f) => ({...f, tags: e.target.value}))}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Dolby Atmos, Stretch Ceiling" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({...f, featured: e.target.checked}))} className="w-4 h-4 accent-blue-500" />
            <span className="text-sm text-gray-300">Mark as Featured</span>
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

export default ProjectsPage;
