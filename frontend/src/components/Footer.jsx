import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';

const Footer = () => {

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
                { 
                  icon: (
                    <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                    </svg>
                  ),
                  url: 'https://www.facebook.com/sadab.mamu.7' 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  ),
                  url: 'https://www.instagram.com/sadab_mamu/' 
                },
                { 
                  icon: (
                    <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
                    </svg>
                  ),
                  url: 'https://www.linkedin.com/in/mohmad-sadab-mamu-a73707338/' 
                }
              ].map((social, index) => (
                <a key={index} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-accent hover:border-accent hover:scale-105 transition-all duration-300">
                  {social.icon}
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
                <Link to="/pages/privacy-policy" className="text-sm font-bold text-gray-300 hover:text-accent transition-colors">Privacy Policy</Link>
                <Link to="/pages/terms-conditions" className="text-sm font-bold text-gray-300 hover:text-accent transition-colors">Terms of Service</Link>
                <Link to="/pages/help-faq" className="text-sm font-bold text-gray-300 hover:text-accent transition-colors">Help & FAQ</Link>
              </div>
            </div>
          </div>
          
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-16 pt-8 flex justify-center items-center">
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] text-center">
            &copy; {new Date().getFullYear()} UrbanKick. All Rights Reserved. Created By Sadab.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
