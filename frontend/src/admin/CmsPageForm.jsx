import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // Import quill styles

const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const CmsPageForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const loadPage = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/pages/cms-pages/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const page = response.data;
        setTitle(page.title);
        setSlug(page.slug || generateSlug(page.title));
        setContent(page.content || '');
        setIsPublished(page.isPublished !== false);
      } catch (error) {
        console.error('Error loading CMS page:', error);
      }
    };
    loadPage();
  }, [id, token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        title,
        slug: slug || generateSlug(title),
        content,
        isPublished,
      };

      if (id) {
        await axios.put(`${API_URL}/api/pages/cms-pages/update/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${API_URL}/api/pages/cms-pages/create`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      navigate('/admin/pages');
    } catch (error) {
      console.error('CMS page save error:', error);
      const message =
        error.response?.data?.message ||
        error.response?.statusText ||
        error.message ||
        'Could not save page';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
  ];

  return (
    <AdminLayout
      title={id ? 'Edit CMS Page' : 'Create CMS Page'}
      subtitle="Publish content pages that render by slug in the frontend."
      headerActions={
        <Link
          to="/admin/pages"
          className="inline-flex items-center space-x-2 bg-white text-primary border border-primary px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:bg-primary hover:text-white transition-all"
        >
          <span>Back to pages</span>
        </Link>
      }
    >

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 p-8 max-w-4xl">
          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="text-sm font-bold text-gray-700">Page Title</span>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(generateSlug(e.target.value));
                }}
                required
                className="mt-2 w-full rounded-3xl border text-black  px-5 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
              <p className="mt-2 text-xs text-gray-500">
                Page URL: <span className="font-semibold">/pages/{slug || generateSlug(title) || 'your-slug'}</span>
              </p>
            </label>

            <div className="block">
              <span className="text-sm font-bold text-gray-700 mb-2 block">Content</span>
              <div className="bg-white rounded-xl text-black overflow-hidden border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <ReactQuill 
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  className="min-h-[260px]"
                />
              </div>
            </div>

            <label className="inline-flex items-center gap-3 text-sm font-bold text-gray-700">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              Publish page
            </label>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center ml-8 justify-center rounded-3xl bg-primary px-7 py-3 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-primary/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Saving...' : id ? 'Update Page' : 'Create Page'}
            </button>
          </form>
        </div>
    </AdminLayout>
  );
};

export default CmsPageForm;
