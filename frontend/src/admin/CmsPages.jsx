import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import { Plus, Edit2, Trash2, ExternalLink, X, AlertCircle } from 'lucide-react';

const CmsPages = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/pages/cms-pages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPages(response.data);
    } catch (error) {
      console.error('Error fetching CMS pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    try {
      await axios.delete(`${API_URL}/api/pages/cms-pages/delete/${selectedId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPages();
      setShowModal(false);
      setSelectedId(null);
    } catch (error) {
      console.error('Error deleting CMS page:', error);
      // Fallback if needed, but we prefer no alerts. A toast would be better.
      // We will just close modal for now
      setShowModal(false);
    }
  };

  const openModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow ml-64 p-8">
        <AdminHeader title="CMS Pages" subtitle="Create and manage static CMS landing pages.">
          <button
            onClick={() => navigate('/admin/pages/new')}
            className="flex items-center space-x-2 bg-primary text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/10 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Page</span>
          </button>
        </AdminHeader>

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Title</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Slug</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Published</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-12 text-center"><div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
              ) : pages.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-xs font-bold text-gray-300 italic">No CMS pages created yet</td></tr>
              ) : pages.map((page) => (
                <tr key={page._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 font-bold text-primary">{page.title}</td>
                  <td className="px-6 py-4 text-sm text-secondary">{page.slug}</td>
                  <td className={`px-6 py-4 text-sm font-black uppercase tracking-[0.15em] ${page.isPublished ? 'text-emerald-600' : 'text-amber-600'}`}>{page.isPublished ? 'Yes' : 'Draft'}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => window.open(`/pages/${page.slug}`, '_blank')}
                        className="p-2 bg-gray-50 rounded-lg text-primary hover:bg-primary hover:text-white transition-all"
                        title="View page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => navigate(`/admin/pages/edit/${page._id}`)}
                        className="p-2 bg-gray-50 rounded-lg text-primary hover:bg-primary hover:text-white transition-all"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openModal(page._id)}
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
              <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">Delete Page?</h3>
              <p className="text-sm font-medium text-gray-500 mb-8">
                Are you sure you want to delete this page? This action cannot be undone.
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

    </div>
  );
};

export default CmsPages;
