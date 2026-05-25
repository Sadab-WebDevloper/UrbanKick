import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';

const CmsPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/pages/${slug}`);
        setPage(response.data);
      } catch (error) {
        setError('Page not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent pt-24 pb-16">
        <div className="bg-zinc-900/40 border border-white/5 p-12 rounded-[3rem] backdrop-blur-md text-center max-w-lg mx-auto shadow-2xl">
          <p className="text-xl font-black text-white mb-4">Error 404</p>
          <p className="text-gray-400 font-medium">{error || "This page doesn't exist or has been removed."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Removed redundant header title and slug */}
        
        <div className="bg-zinc-950/80 rounded-[3rem] p-8 md:p-14 shadow-2xl border border-white/5 backdrop-blur-md animate-fade-in delay-200">
          <div 
            className="prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:text-white prose-p:text-gray-300 prose-p:font-medium prose-a:text-accent hover:prose-a:text-orange-500 prose-strong:text-white prose-li:text-gray-300"
            dangerouslySetInnerHTML={{ __html: page.content }} 
          />
        </div>
      </div>
    </div>
  );
};

export default CmsPage;
