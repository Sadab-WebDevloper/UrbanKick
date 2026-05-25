import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Shield, 
  Camera,
  LogOut,
  Check,
  AlertCircle
} from 'lucide-react';
import { API_URL } from '../config/api';

const Profile = () => {
  const { user, logout, uploadProfileImage } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const fileInputRef = useRef(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setStatus({ type: 'error', message: 'Please upload an image file' });
      return;
    }

    setUploading(true);
    setStatus({ type: '', message: '' });

    const result = await uploadProfileImage(file);
    
    if (result.success) {
      setStatus({ type: 'success', message: 'Profile picture updated!' });
    } else {
      setStatus({ type: 'error', message: result.message });
    }
    
    setUploading(false);
    
    // Clear status after 3 seconds
    setTimeout(() => setStatus({ type: '', message: '' }), 3000);
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden border border-gray-100">
          {/* Header/Cover */}
          <div className="h-32 bg-gradient-to-r from-primary via-slate-800 to-primary relative">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>

          <div className="px-6 pb-8">
            {/* Profile Avatar Section */}
            <div className="relative flex flex-col items-center -mt-16 mb-6">
              <div className="relative group cursor-pointer" onClick={handleImageClick}>
                <div className="w-40 h-40 rounded-[2.5rem] border-8 border-white overflow-hidden shadow-2xl bg-gray-100 transition-transform duration-500 group-hover:scale-[1.02]">
                  {user.profileImage ? (
                    <img 
                      src={getFullImageUrl(user.profileImage)} 
                      alt={user.firstName} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary text-white text-5xl font-bold">
                      {user.firstName[0]}
                    </div>
                  )}
                  
                  {/* Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-10 h-10 text-white" />
                  </div>

                  {/* Loading Spinner */}
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <button 
                  className="absolute bottom-2 right-2 bg-accent p-3 rounded-2xl text-white shadow-xl hover:scale-110 transition-transform active:scale-95"
                >
                  <Camera className="w-5 h-5" />
                </button>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              {/* Status Message */}
              {status.message && (
                <div className={`mt-4 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-bold animate-fade-in ${
                  status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {status.type === 'success' ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  <span>{status.message}</span>
                </div>
              )}
            </div>

            {/* User Info Section */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-black text-primary tracking-tight">
                {user.firstName} {user.lastName}
              </h1>
              <div className="inline-flex items-center mt-1 px-4 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-black uppercase tracking-widest">
                {user.role} Account
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 hover:border-accent/20 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Full Name</p>
                      <p className="text-base font-bold text-primary">{user.firstName} {user.lastName}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 hover:border-accent/20 transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-base font-bold text-primary truncate max-w-[120px]">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50/50 p-4 rounded-3xl border border-gray-100 hover:border-accent/20 transition-colors group">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-shadow">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Account Security</p>
                    <p className="text-xs font-medium text-secondary mt-0.5">Your account is secured with 256-bit encryption.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={logout}
                className="flex-1 flex items-center justify-center space-x-3 py-4 rounded-3xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-all active:scale-95"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
              <button 
                className="flex-[2] py-4 rounded-3xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:bg-slate-800 transition-all active:scale-95"
              >
                Edit Account Settings
              </button>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-gray-400 text-sm font-medium">
          UrbanKick Premium Member since {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Profile;
