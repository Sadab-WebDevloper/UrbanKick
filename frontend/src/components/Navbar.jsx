import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Settings, LogOut, ChevronDown, Camera, X, User as UserIcon, Package, ShoppingCart } from 'lucide-react';
import { API_URL } from '../config/api';
import { useCart } from '../context/CartContext';
import LogoutModal from './LogoutModal';

const Navbar = () => {
  const { user, logout, isAuthenticated, updateProfile, uploadProfileImage } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editData, setEditData] = useState({ firstName: '', lastName: '' });
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user) {
      setEditData({ firstName: user.firstName, lastName: user.lastName });
    }
  }, [user]);

  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
    setProfileOpen(false);
  };

  const handleConfirmLogout = () => {
    logout();
    setLogoutModalOpen(false);
    navigate('/');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const result = await updateProfile(editData);
    if (result.success) {
      setStatus({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => {
        setSettingsOpen(false);
        setStatus({ type: '', message: '' });
      }, 1500);
    } else {
      setStatus({ type: 'error', message: result.message });
    }
    setUpdating(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const result = await uploadProfileImage(file);
    if (result.success) {
      setStatus({ type: 'success', message: 'Image updated!' });
    } else {
      setStatus({ type: 'error', message: result.message });
    }
    setUploading(false);
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b border-white/5 ${scrolled ? 'bg-zinc-950/90 shadow-2xl py-3 backdrop-blur-xl' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 group shrink-0">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-white font-black group-hover:rotate-6 transition-transform shadow-lg shadow-accent/20">U</div>
              <span className="text-2xl font-black text-white tracking-tighter hidden sm:block group-hover:text-gray-200 transition-colors">
                URBAN<span className="text-accent">KICK</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center space-x-10 absolute left-1/2 -translate-x-1/2 bg-zinc-900/50 backdrop-blur-md px-8 py-3 rounded-[2rem] border border-white/5">
              <Link to="/" className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-accent ${location.pathname === '/' ? 'text-accent' : 'text-gray-300'}`}>
                Home
              </Link>
              <Link to="/new-arrivals" className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-accent ${location.pathname === '/new-arrivals' ? 'text-accent' : 'text-gray-300'}`}>
                New Arrivals
              </Link>
              <Link to="/products" className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-accent ${location.pathname === '/products' ? 'text-accent' : 'text-gray-300'}`}>
                Products
              </Link>
              <Link to="/about" className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-accent ${location.pathname === '/about' ? 'text-accent' : 'text-gray-300'}`}>
                About
              </Link>
              <Link to="/contact" className={`text-xs font-black uppercase tracking-[0.2em] transition-all hover:text-accent ${location.pathname === '/contact' ? 'text-accent' : 'text-gray-300'}`}>
                Contact
              </Link>
            </div>

            <div className="flex items-center space-x-6">
              <Link to="/checkout" className="relative p-2 text-white hover:text-accent transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 bg-accent text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                    {cartCount}
                  </span>
                )}
              </Link>
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-3 bg-zinc-900/80 p-1.5 pr-4 rounded-full border border-white/10 hover:bg-zinc-800 hover:border-white/20 transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-zinc-800 shadow-sm bg-accent flex items-center justify-center text-white font-bold group-hover:border-accent transition-colors">
                      {user.profileImage ? (
                        <img src={getFullImageUrl(user.profileImage)} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user.firstName[0]
                      )}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className="text-xs font-black text-white leading-none uppercase group-hover:text-accent transition-colors">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-gray-400 font-bold tracking-widest mt-0.5 capitalize">{user.role}</p>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${profileOpen ? 'rotate-180 text-white' : ''}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-4 w-60 bg-zinc-900 rounded-[2rem] shadow-2xl border border-white/10 py-3 overflow-hidden animate-fade-in z-[110] backdrop-blur-xl">
                      <div className="px-3 space-y-1">
                        <button
                          onClick={() => { setSettingsOpen(true); setProfileOpen(false); }}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-white hover:bg-white/5 transition-all font-bold text-sm"
                        >
                          <Settings className="w-5 h-5 text-gray-400" />
                          <span>Profile Settings</span>
                        </button>
                        <button
                          onClick={() => { navigate('/myorders'); setProfileOpen(false); }}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-white hover:bg-white/5 transition-all font-bold text-sm"
                        >
                          <Package className="w-5 h-5 text-gray-400" />
                          <span>My Orders</span>
                        </button>
                        <button
                          onClick={handleLogoutClick}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all font-bold text-sm"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link to="/login" className="text-sm font-black uppercase tracking-widest text-gray-300 hover:text-accent transition-colors">Login</Link>
                  <Link to="/register" className="bg-accent text-white px-8 py-3 rounded-full text-sm font-black uppercase tracking-widest shadow-xl shadow-accent/20 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {settingsOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-zinc-950 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up border border-white/10">
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">Account Settings</h2>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Manage your identity and preferences</p>
              </div>
              <button onClick={() => setSettingsOpen(false)} className="p-3 hover:bg-white/10 text-gray-400 hover:text-white rounded-2xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 flex flex-col lg:flex-row gap-12">
              <div className="lg:w-1/3 flex flex-col items-center space-y-4">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-40 h-40 rounded-[2.5rem] border-4 border-zinc-800 overflow-hidden shadow-xl bg-zinc-900 transition-transform duration-500 group-hover:scale-[1.02]">
                    {user.profileImage ? (
                      <img src={getFullImageUrl(user.profileImage)} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-accent text-white text-5xl font-bold">{user.firstName[0]}</div>
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                    {uploading && (
                      <div className="absolute inset-0 bg-zinc-900/80 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                  <button className="absolute bottom-1 right-1 bg-accent p-2.5 rounded-xl text-white shadow-lg border border-orange-400"><Camera className="w-4 h-4" /></button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Click to update picture</p>
              </div>

              <form onSubmit={handleUpdate} className="lg:w-2/3 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={editData.firstName}
                        onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-accent focus:bg-white/10 transition-all placeholder-gray-600"
                        placeholder="First Name"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={editData.lastName}
                        onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm font-bold text-white outline-none focus:border-accent focus:bg-white/10 transition-all placeholder-gray-600"
                        placeholder="Last Name"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center justify-center bg-accent text-white rounded-full px-8 py-3 text-sm font-black uppercase tracking-[0.25em] transition hover:bg-orange-600 disabled:opacity-50 shadow-lg shadow-accent/20"
                  >
                    {updating ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
                {status.message && (
                  <div className={`rounded-2xl p-4 text-sm font-bold ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                    {status.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
      {logoutModalOpen && (
        <LogoutModal isOpen={logoutModalOpen} onClose={() => setLogoutModalOpen(false)} onConfirm={handleConfirmLogout} />
      )}
    </>
  );
};

export default Navbar;
