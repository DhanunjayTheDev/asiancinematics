import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiUpload, FiX } from 'react-icons/fi';
import api from '../lib/api';
import { cacheManager } from '../lib/cache';
import { uploadManyToCloudinary } from '../lib/cloudinary';
import CustomSelect from '../components/CustomSelect';
import Button from '../components/Button';

const emptyForm = {
  name: '',
  description: '',
  price: '',
  compareAtPrice: '',
  category: '',
  stock: '0',
  isFeatured: false,
  tags: '',
};

type KV = { key: string; value: string };

const inputCls = 'w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition text-sm';
const labelCls = 'block text-xs font-semibold text-gray-400 mb-1.5';

const ProductFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isEdit = Boolean(id);
  const existingProduct = (location.state as any)?.product;

  const [form, setForm] = useState(emptyForm);
  const [specs, setSpecs] = useState<KV[]>([{ key: '', value: '' }]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cacheKey = 'admin_categories';
        const cacheTTL = 30 * 60 * 1000;
        const cached = cacheManager.get(cacheKey) as any[] | null;
        if (cached) { setCategories(cached); return; }
        const pending = cacheManager.getPendingRequest(cacheKey);
        const promise = pending || api.get('/categories');
        if (!pending) cacheManager.setPendingRequest(cacheKey, promise);
        const { data } = await promise as { data: { data: any[] } };
        cacheManager.set(cacheKey, data.data, cacheTTL);
        setCategories(data.data);
        cacheManager.clearPendingRequest(cacheKey);
      } catch {
        toast.error('Failed to load categories');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isEdit || !existingProduct) return;
    const p = existingProduct;
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: String(p.price || ''),
      compareAtPrice: p.compareAtPrice ? String(p.compareAtPrice) : '',
      category: p.category?._id || p.category || '',
      stock: String(p.stock ?? 0),
      isFeatured: p.isFeatured || false,
      tags: (p.tags || []).join(', '),
    });
    if (p.specifications && typeof p.specifications === 'object') {
      const kvs = Object.entries(p.specifications).map(([key, value]) => ({ key, value: String(value) }));
      setSpecs(kvs.length ? kvs : [{ key: '', value: '' }]);
    }
    if (p.images?.length) setExistingImages(p.images);
  }, [isEdit, existingProduct]);

  const f = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeNewImage = (i: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== i));
    setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
  };

  const removeExistingImage = (i: number) => {
    setExistingImages(prev => prev.filter((_, idx) => idx !== i));
  };

  const addSpecRow = () => setSpecs(prev => [...prev, { key: '', value: '' }]);
  const removeSpecRow = (i: number) => setSpecs(prev => prev.filter((_, idx) => idx !== i));
  const updateSpec = (i: number, field: 'key' | 'value', val: string) =>
    setSpecs(prev => prev.map((row, idx) => idx === i ? { ...row, [field]: val } : row));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name required'); return; }
    if (!form.price) { toast.error('Price required'); return; }

    setSaving(true);
    try {
      // Upload new images to Cloudinary directly from browser
      let uploadedUrls: string[] = [];
      if (images.length) {
        toast.loading('Uploading images...', { id: 'img-upload' });
        uploadedUrls = await uploadManyToCloudinary(images);
        toast.dismiss('img-upload');
      }

      const allImages = [...existingImages, ...uploadedUrls];

      const validSpecs = specs.filter(s => s.key.trim() && s.value.trim());
      const specsObj: Record<string, string> = {};
      validSpecs.forEach(s => { specsObj[s.key.trim()] = s.value.trim(); });

      const body: any = {
        name: form.name.trim(),
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        isFeatured: form.isFeatured,
        images: allImages,
      };
      if (form.compareAtPrice) body.compareAtPrice = Number(form.compareAtPrice);
      if (form.category) body.category = form.category;
      if (form.tags) body.tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
      if (validSpecs.length) body.specifications = specsObj;

      if (isEdit) {
        await api.put(`/products/${id}`, body);
        toast.success('Product updated');
      } else {
        await api.post('/products', body);
        toast.success('Product created');
      }
      navigate('/products');
    } catch (err: any) {
      toast.dismiss('img-upload');
      toast.error(err.response?.data?.message || err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Helmet><title>{isEdit ? 'Edit Product' : 'Add Product'} | Admin</title></Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/products')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{isEdit ? 'Update product details' : 'Fill in the details to create a new product'}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Images */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">Product Images</h2>

            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {existingImages.map((url, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-700">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500">
                      <FiX className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New image previews */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-blue-500/40">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-500">
                      <FiX className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="button" onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border border-gray-700 border-dashed rounded-xl text-gray-400 hover:text-white hover:border-gray-500 transition-colors text-sm w-full justify-center">
              <FiUpload className="w-4 h-4" />
              {imagePreviews.length + existingImages.length === 0 ? 'Upload Images' : 'Add More Images'}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageFiles} className="hidden" />
            <p className="text-xs text-gray-600">Up to 5 images. Uploaded to Cloudinary.</p>
          </div>

          {/* Basic Info */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">Basic Information</h2>
            <div>
              <label className={labelCls}>Product Name <span className="text-red-400">*</span></label>
              <input type="text" value={form.name} onChange={f('name')} required placeholder="e.g. Smart Security Camera" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Description</label>
              <textarea value={form.description} onChange={f('description')} rows={4} placeholder="Describe the product..." className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price (₹) <span className="text-red-400">*</span></label>
                <input type="number" value={form.price} onChange={f('price')} required min="0" placeholder="0" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Compare At Price (₹)</label>
                <input type="number" value={form.compareAtPrice} onChange={f('compareAtPrice')} min="0" placeholder="Original / MRP" className={inputCls} />
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-white border-b border-gray-800 pb-3">Inventory & Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Category</label>
                <CustomSelect
                  value={form.category}
                  onChange={(value) => setForm(prev => ({ ...prev, category: String(value) }))}
                  options={[
                    { value: '', label: 'Select category' },
                    ...categories.map((c: any) => ({ value: c._id, label: c.name })),
                  ]}
                />
              </div>
              <div>
                <label className={labelCls}>Stock Quantity</label>
                <input type="number" value={form.stock} onChange={f('stock')} min="0" placeholder="0" className={inputCls} />
                {Number(form.stock) === 0 && <p className="text-xs text-red-400 mt-1">Out of stock</p>}
              </div>
            </div>
            <div>
              <label className={labelCls}>Tags <span className="text-gray-600 font-normal">(comma-separated)</span></label>
              <input type="text" value={form.tags} onChange={f('tags')} placeholder="e.g. CCTV, IP Camera, Outdoor" className={inputCls} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div onClick={() => setForm(prev => ({ ...prev, isFeatured: !prev.isFeatured }))}
                className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${form.isFeatured ? 'bg-blue-500' : 'bg-gray-700'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isFeatured ? 'translate-x-5' : 'translate-x-0.5'}`} />
              </div>
              <span className="text-sm text-gray-300">Featured Product</span>
              {form.isFeatured && <span className="text-xs text-yellow-400">⭐ Shown on homepage</span>}
            </label>
          </div>

          {/* Specifications — key-value pairs */}
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <div>
                <h2 className="text-sm font-semibold text-white">Specifications</h2>
                <p className="text-xs text-gray-500 mt-0.5">Optional product specs shown on detail page</p>
              </div>
              <button type="button" onClick={addSpecRow}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-semibold rounded-lg hover:bg-blue-600/30 transition-colors">
                <FiPlus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            <div className="space-y-2">
              {specs.map((row, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Key (e.g. Resolution)"
                    value={row.key}
                    onChange={(e) => updateSpec(i, 'key', e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 4K)"
                    value={row.value}
                    onChange={(e) => updateSpec(i, 'value', e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 text-sm"
                  />
                  <button type="button" onClick={() => removeSpecRow(i)}
                    className="p-2 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pb-8">
            <Button type="submit" disabled={saving} loading={saving} className="flex-1 flex items-center justify-center gap-2">
              <FiSave className="w-4 h-4" />
              {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/products')} className="px-8">
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductFormPage;
