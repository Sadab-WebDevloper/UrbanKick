import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';

const Footer = () => {
  const [cmsPages, setCmsPages] = useState([]);

  useEffect(() => {
    const fetchCmsPages = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/pages`);
        if (response.data && Array.isArray(response.data)) {
          const publishedPages = response.data.filter(p => p.isPublished !== false);
          setCmsPages(publishedPages);
        } else {
          console.error('API did not return an array for CMS pages:', response.data);
          setCmsPages([]);
        }
      } catch (error) {
        console.error('Error fetching CMS pages for footer:', error);
      }
    };

    fetchCmsPages();
  }, []);

  return (
    <footer className="bg-zinc-950 text-white mt-auto border-t border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Column */}
          <div className="space-y-6 lg:col-span-1">
            <h3 className="text-3xl font-black tracking-tighter uppercase leading-none flex items-center gap-2">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-lg">U</div>
              <span>URBAN<span className="text-accent">KICK</span></span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed font-medium max-w-[280px]">
              Premium footwear engineered for the streets and designed for the bold. Step into the future of sneaker culture.
            </p>
            <div className="flex space-x-3">
              {[
                { label: 'FB', url: 'https://facebook.com' },
                { label: 'IG', url: 'https://instagram.com' },
                { label: 'X', url: 'https://twitter.com' }
              ].map((social, index) => (
                <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300">
                  <span className="text-[10px] font-black uppercase">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Center Graphic */}
          <div className="hidden lg:flex flex-col justify-center items-center relative col-span-1">
            <div className="relative group">
              <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full scale-150 opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>
              <img
                src="/footer-sneaker.png"
                alt="UrbanKick Silhouette"
                className="w-40 h-auto object-contain opacity-40 group-hover:opacity-100 transition-all duration-500 animate-float relative z-10 cursor-pointer"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">Est. 2026</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div className="flex flex-col sm:flex-row gap-12 lg:col-span-2 lg:justify-end">
            <div className="min-w-[120px]">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-gray-500">Explore</h4>
              <div className="flex flex-col space-y-3">
                <Link to="/" className="text-sm font-bold text-gray-300 hover:text-accent transition-colors">Home</Link>
                <Link to="/products" className="text-sm font-bold text-gray-300 hover:text-accent transition-colors">All Sneakers</Link>
                <Link to="/new-arrivals" className="text-sm font-bold text-gray-300 hover:text-accent transition-colors">New Arrivals</Link>
                <Link to="/about" className="text-sm font-bold text-gray-300 hover:text-accent transition-colors">About Us</Link>
                <Link to="/contact" className="text-sm font-bold text-gray-300 hover:text-accent transition-colors">Contact</Link>
              </div>
            </div>
            
            <div className="min-w-[120px]">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 text-gray-500">Support</h4>
              <div className="flex flex-col space-y-3">
                {/* Dynamically loaded CMS pages */}
                {cmsPages.map(page => (
                  <Link 
                    key={page._id} 
                    to={`/pages/${page.slug}`} 
                    className="text-sm font-bold text-gray-300 hover:text-accent transition-colors"
                  >
                    {page.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} UrbanKick. All Rights Reserved. Created By Sadab.
          </p>
          <div className="flex space-x-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            {cmsPages.length === 0 && (
              <>
                <Link to="/pages/privacy-policy" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</Link>
                <Link to="/pages/terms-conditions" className="hover:text-white transition-colors cursor-pointer">Terms of Service</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
