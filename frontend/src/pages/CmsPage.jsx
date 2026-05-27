import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';

const CmsPage = () => {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const hardcodedPages = {
    'privacy-policy': {
      title: 'Privacy Policy',
      content: `
        <h1>Privacy Policy</h1>
        <p>Last updated: May 2026</p>
        <h2>1. Information We Collect</h2>
        <p>We collect information you provide directly to us, such as when you create or modify your account, make a purchase, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, payment method, and other information you choose to provide.</p>
        <h2>2. Use of Information</h2>
        <p>We may use the information we collect about you to provide, maintain, and improve our services. This includes processing transactions, sending you related information including confirmations and receipts, and providing customer support.</p>
        <h2>3. Data Security</h2>
        <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
      `
    },
    'about-us': {
      title: 'About Us',
      content: `
        <h1>About UrbanKick</h1>
        <p>Welcome to UrbanKick, your ultimate destination for premium sneakers and exclusive streetwear.</p>
        <p>Born from a deep passion for sneaker culture, our mission is to provide enthusiasts and casual wearers alike with access to the most sought-after footwear in the world.</p>
        <h2>Our Promise</h2>
        <p>Every pair of sneakers we sell is guaranteed 100% authentic. We take pride in our rigorous authentication process and our commitment to customer satisfaction.</p>
      `
    },
    'terms-conditions': {
      title: 'Terms of Service',
      content: `
        <h1>Terms of Service</h1>
        <p>Welcome to UrbanKick. By accessing our website, you agree to these Terms of Service.</p>
        <h2>1. User Accounts</h2>
        <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        <h2>2. Purchases</h2>
        <p>If you wish to purchase any product or service made available through the Service, you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.</p>
      `
    },
    'help-faq': {
      title: 'Help & FAQ',
      content: `
        <h1>Help & FAQ</h1>
        <h2>How do I know the sneakers are authentic?</h2>
        <p>Every pair goes through a rigorous multi-step authentication process by our team of experts before it's shipped to you.</p>
        <h2>What is your return policy?</h2>
        <p>We accept returns within 7 days of delivery for unworn sneakers with all original tags attached. Check our Returns page for more details.</p>
        <h2>When will my order ship?</h2>
        <p>Most orders are processed and shipped within 1-2 business days. Delivery times vary based on your location and the shipping method chosen at checkout.</p>
      `
    }
  };

  useEffect(() => {
    setLoading(true);
    // Simulate a brief loading state for smooth UI transitions
    setTimeout(() => {
      const pageData = hardcodedPages[slug];
      if (pageData) {
        setPage(pageData);
        setError('');
      } else {
        setPage(null);
        setError('Page not found');
      }
      setLoading(false);
    }, 400);
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
