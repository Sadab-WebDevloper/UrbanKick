import React, { useState, useRef } from 'react';
import { X, User, Mail, Camera, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';

const AccountSettingsModal = ({ isOpen, onClose }) => {
  const { user, updateProfile, uploadProfileImage } = useAuth();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg('');
    const result = await updateProfile(formData);
    setIsSaving(false);
    if (result.success) {
      onClose();
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setErrorMsg('');
      const result = await uploadProfileImage(file);
      setIsUploading(false);
      if (!result.success) {
        setErrorMsg(result.message);
      }
    }
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up relative border border-gray-50"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black text-primary tracking-tight">Account Settings</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
                Manage your identity and preferences
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-2xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-4">
          {errorMsg && (
            <div className="mb-6 rounded-2xl bg-red-50 border border-red-100 px-5 py-3 text-sm text-red-600 font-bold">
              {errorMsg}
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-12">
            {/* Left: Profile Image */}
            <div className="flex flex-col items-center space-y-4">
              <div 
                className="relative group cursor-pointer"
                onClick={handleImageClick}
              >
                <div className="w-48 h-48 rounded-[2.5rem] bg-gray-50 border-2 border-gray-100 overflow-hidden shadow-xl group-hover:border-accent transition-all ring-8 ring-gray-50/50">
                  {isUploading ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50">
                      <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    </div>
                  ) : user?.profileImage ? (
                    <img 
                      src={getFullImageUrl(user.profileImage)} 
                      alt="Profile" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <User className="w-20 h-20" />
                    </div>
                  )}
                </div>
                
                {/* Camera Icon Overlay */}
                <div className="absolute bottom-2 right-2 w-10 h-10 bg-accent text-white rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all border-4 border-white">
                  <Camera className="w-5 h-5" />
                </div>
                
                <input 
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Click to update picture
              </p>
            </div>

            {/* Right: Form Fields */}
            <div className="flex-grow space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">First Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/5 focus:bg-white transition-all"
                      placeholder="Enter first name"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Last Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/5 focus:bg-white transition-all"
                      placeholder="Enter last name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Email Address (Read Only)</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input 
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50/30 border border-gray-100 rounded-2xl text-sm font-bold text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full mt-4 py-4 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center space-x-3 disabled:opacity-70"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountSettingsModal;
