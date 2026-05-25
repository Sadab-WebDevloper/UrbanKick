import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Upload, 
  Check, 
  AlertCircle, 
  Camera,
  Save,
  Trash2,
  Image as ImageIcon,
  ChevronDown
} from 'lucide-react';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';

const ProductForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    sizes: '',
    featured: false,
    newArrival: false
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const categories = ['Sneakers', 'Running', 'Basketball', 'Lifestyle', 'Limited Edition'];

  useEffect(() => {
    if (isEditMode) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/${id}`);
      setFormData({
        ...response.data,
        featured: response.data.featured ?? false,
        newArrival: response.data.newArrival ?? false,
        sizes: response.data.sizes?.length ? response.data.sizes.join(', ') : '',
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      setStatus({ type: 'error', message: 'Failed to load product data' });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await axios.post(`${API_URL}/api/products/upload-image`, uploadFormData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setFormData({ ...formData, image: response.data.url });
      setStatus({ type: 'success', message: 'Image uploaded!' });
    } catch (error) {
      setStatus({ type: 'error', message: 'Upload failed' });
    } finally {
      setUploading(false);
      setTimeout(() => setStatus({ type: '', message: '' }), 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return setStatus({ type: 'error', message: 'Please upload an image' });
    
    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: formData.price !== '' ? Number(formData.price) : 0,
        stock: formData.stock !== '' ? Number(formData.stock) : 0,
        featured: !!formData.featured,
        newArrival: !!formData.newArrival,
        sizes: typeof formData.sizes === 'string'
          ? formData.sizes.split(',').map((size) => size.trim()).filter(Boolean)
          : formData.sizes,
      };
      console.log('ProductForm submit payload:', payload);

      if (isEditMode) {
        const resp = await axios.put(`${API_URL}/api/products/update/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Update product response:', resp.data);
        setStatus({ type: 'success', message: 'Product updated successfully!' });
        navigate('/admin/products');
        return;
      } else {
        const resp = await axios.post(`${API_URL}/api/products/create`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Create product response:', resp.data);
        setStatus({ type: 'success', message: 'Product created successfully!' });
        navigate('/admin/products');
        return;
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.response?.data?.message || 'Error saving product' });
    } finally {
      setLoading(false);
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-grow ml-64 p-8">
        <AdminHeader 
          title={isEditMode ? 'Edit Sneaker' : 'Add New Sneaker'} 
          subtitle={isEditMode ? 'Update product information' : 'Create a new inventory item'}
        />

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 animate-fade-in w-full">
          {/* Left: Product Visuals */}
          <div className="lg:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-50">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Product Media</h3>
              <div 
                className="aspect-square rounded-[2rem] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-accent transition-all"
                onClick={() => fileInputRef.current?.click()}
              >
                {formData.image ? (
                  <img src={getFullImageUrl(formData.image)} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center space-y-3 text-gray-300">
                    <ImageIcon className="w-12 h-12" />
                    <p className="text-xs font-bold">Select Product Image</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                {uploading && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 cursor-pointer">
                  <input type="checkbox" id="featured" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="w-5 h-5 rounded-lg border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-xs font-black text-primary uppercase tracking-wider">Featured in Collection</span>
                </label>

                <label className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 cursor-pointer">
                  <input type="checkbox" id="newArrival" checked={formData.newArrival} onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })} className="w-5 h-5 rounded-lg border-gray-300 text-primary focus:ring-primary" />
                  <span className="text-xs font-black text-primary uppercase tracking-wider">Mark as New Arrival</span>
                </label>
              </div>
            </div>

            {status.message && (
              <div className={`flex items-center space-x-3 p-5 rounded-3xl text-sm font-bold ${
                status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {status.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span>{status.message}</span>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="lg:w-2/3">
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 ml-1">Basic Information</h3>
              
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary outline-none focus:border-accent focus:bg-white transition-all shadow-sm"
                      placeholder="e.g. Nike Air Max Pulse"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <div className="relative">
                      <select 
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-6 pr-10 text-sm font-bold text-primary outline-none focus:border-accent focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
                      >
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    required
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary outline-none focus:border-accent focus:bg-white transition-all shadow-sm resize-none"
                    placeholder="Provide a detailed description of the product..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sizes</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="e.g. 7, 8, 9, 10"
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary outline-none focus:border-accent focus:bg-white transition-all shadow-sm"
                  />
                  <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Separate sizes with commas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price (INR)</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                      <input 
                        type="number" 
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-10 pr-6 text-sm font-bold text-primary outline-none focus:border-accent focus:bg-white transition-all shadow-sm"
                        placeholder="129.99"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Inventory Level (Stock)</label>
                    <input 
                      type="number" 
                      required
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary outline-none focus:border-accent focus:bg-white transition-all shadow-sm"
                      placeholder="100"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/products')}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl border border-gray-200 text-sm font-black uppercase tracking-widest text-gray-500 bg-gray-50 hover:bg-gray-100 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-primary text-white text-sm font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    {loading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update Product' : 'Save Product')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
