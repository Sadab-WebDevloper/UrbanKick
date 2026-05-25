import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <SEO title="Contact Us - UrbanKick" description="Get in touch with the UrbanKick team for support and inquiries." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20 animate-slide-up mt-8">
          <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <MessageSquare className="w-4 h-4" />
            <span>Support Center</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 text-glow">
            Let's <span className="text-accent">Connect</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
            Got questions about a drop? Need help with sizing? Or just want to talk kicks? Our dedicated team is standing by to assist you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
          
          {/* Contact Information */}
          <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-black text-white tracking-tight mb-8">Get In Touch</h2>
            
            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md shadow-xl hover:border-accent/30 transition-colors group">
              <div className="flex items-start space-x-6">
                <div className="bg-accent/10 p-4 rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg mb-2">Flagship Store</h3>
                  <p className="text-gray-400 font-medium leading-relaxed">
                    123 Streetwear Avenue,<br />
                    Sneaker District, NY 10012<br />
                    United States
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md shadow-xl hover:border-accent/30 transition-colors group">
              <div className="flex items-start space-x-6">
                <div className="bg-accent/10 p-4 rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg mb-2">Email Support</h3>
                  <p className="text-gray-400 font-medium mb-1">General: info@urbankick.com</p>
                  <p className="text-gray-400 font-medium">Orders: support@urbankick.com</p>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-md shadow-xl hover:border-accent/30 transition-colors group">
              <div className="flex items-start space-x-6">
                <div className="bg-accent/10 p-4 rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg mb-2">Operating Hours</h3>
                  <p className="text-gray-400 font-medium mb-1">Mon - Fri: 10:00 AM - 8:00 PM</p>
                  <p className="text-gray-400 font-medium">Sat - Sun: 11:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="animate-slide-up delay-200">
            <div className="bg-zinc-950/80 p-8 md:p-12 rounded-[3rem] shadow-2xl border border-white/10 relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
              
              <h2 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight">
                Drop Us A Line
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white placeholder-gray-500 outline-none focus:border-accent focus:bg-white/10 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white placeholder-gray-500 outline-none focus:border-accent focus:bg-white/10 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white placeholder-gray-500 outline-none focus:border-accent focus:bg-white/10 transition-all"
                    placeholder="Order Inquiry / Sizing Help"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                  <textarea 
                    required
                    rows="6"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white placeholder-gray-500 outline-none focus:border-accent focus:bg-white/10 transition-all resize-none"
                    placeholder="Write your message here..."
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-accent text-white py-5 rounded-2xl text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 flex items-center justify-center space-x-3 group"
                >
                  <span>Send Message</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {sent && (
                  <div className="bg-green-500/10 text-green-400 p-5 rounded-2xl text-center text-sm font-bold animate-fade-in border border-green-500/20 flex items-center justify-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Your message has been received! We'll be in touch shortly.
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div className="mt-32 pt-20 border-t border-white/5">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4 text-glow">Frequently Asked</h2>
            <p className="text-gray-400 font-medium">Quick answers to common questions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 max-w-5xl mx-auto animate-fade-in delay-200">
            {[
              { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. Express options are available at checkout." },
              { q: "Are your sneakers authentic?", a: "100%. Every single pair goes through a rigorous authentication process by our expert team." },
              { q: "What is your return policy?", a: "We offer a 14-day return window for unworn items in their original condition and packaging." },
              { q: "Do you ship internationally?", a: "Yes, we ship to over 45 countries worldwide. Shipping rates are calculated at checkout." }
            ].map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-[2rem] p-8 hover:bg-white/10 transition-colors">
                <h4 className="text-lg font-black text-white mb-3">{faq.q}</h4>
                <p className="text-gray-400 font-medium leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
