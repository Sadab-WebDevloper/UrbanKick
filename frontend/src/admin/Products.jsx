import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  X,
  AlertCircle
} from 'lucide-react';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';

const AdminProducts = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await axios.delete(`${API_URL}/api/products/delete/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      setShowModal(false);
      setSelectedId(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      setShowModal(false);
    }
  };

  const openModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const filteredProducts = products;

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  return (
    <AdminLayout 
      title="Inventory" 
      subtitle="Manage your sneakers and stock levels."
      headerActions={
        <button 
          onClick={() => navigate('/admin/products/new')}
          className="flex items-center space-x-2 bg-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Product</span>
        </button>
      }
    >

        {/* Filters - Compact */}


        {/* Products Table - Compact */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Product</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : filteredProducts.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-xs font-bold text-gray-300 italic">No products found</td></tr>
              ) : filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-50 overflow-hidden shadow-sm border border-gray-100 p-1">
                        <img src={getFullImageUrl(product.image)} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{product.name}</span>
                        {product.newArrival && (
                          <span className="text-xs font-black uppercase tracking-widest bg-accent/10 text-accent px-2 py-0.5 rounded-lg">New</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[9px] font-black uppercase tracking-widest">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold ${product.stock > 10 ? 'text-green-600' : 'text-red-600'}`}>{product.stock} units</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button onClick={() => navigate(`/products/${product._id}`)} className="p-2 bg-gray-50 rounded-lg text-primary hover:bg-primary hover:text-white transition-all">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/products/edit/${product._id}`)} 
                          className="p-2 bg-gray-50 rounded-lg text-primary hover:bg-primary hover:text-white transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={() => openModal(product._id)} 
                          className="p-2 bg-gray-50 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-sm w-full p-6 animate-slide-up relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">Delete Product?</h3>
              <p className="text-sm font-medium text-gray-500 mb-8">
                Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex w-full space-x-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-sm font-black uppercase tracking-widest text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-3 text-sm font-black uppercase tracking-widest text-white bg-red-500 rounded-xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
