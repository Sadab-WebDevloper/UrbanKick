import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config/api';
import LogoutModal from './LogoutModal';
import AccountSettingsModal from './AccountSettingsModal';

const AdminHeader = ({ title, subtitle, children }) => {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tight">{title}</h1>
          {subtitle && <p className="text-xs text-secondary font-medium mt-0.5">{subtitle}</p>}
        </div>

        {/* Search Bar - Common for Admin */}
        <div className="relative group hidden lg:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/5 transition-all w-64 shadow-sm"
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        {children}
        
        <button className="relative p-2.5 bg-white border border-gray-100 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent rounded-full border-2 border-white"></span>
        </button>
        
        {/* User Profile Capsule with Dropdown */}
        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center bg-white border rounded-full pl-1.5 pr-4 py-1.5 shadow-sm hover:shadow-md transition-all cursor-pointer group ${isDropdownOpen ? 'border-primary ring-4 ring-primary/5' : 'border-gray-100'}`}
          >
            <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
              {user?.profileImage ? (
                <img 
                  src={getFullImageUrl(user.profileImage)} 
                  alt={user.firstName} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary text-white text-xs font-bold uppercase">
                  {user?.firstName?.[0]}
                </div>
              )}
            </div>
            <div className="ml-3 mr-6 hidden sm:block">
              <p className="text-[11px] font-black text-primary leading-tight uppercase tracking-tight">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] font-bold text-secondary/60 leading-tight">Admin</p>
            </div>
            <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-primary transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-[2rem] shadow-2xl border border-gray-50 p-3 z-20 animate-slide-up">
                <div className="space-y-1">
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setSettingsModalOpen(true);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-primary hover:bg-gray-50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                      <Settings className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">Profile Settings</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setLogoutModalOpen(true);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-50/50 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all">
                      <LogOut className="w-5 h-5 text-red-400 group-hover:text-red-500" />
                    </div>
                    <span className="font-bold text-sm tracking-tight">Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <LogoutModal 
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={logout}
      />

      <AccountSettingsModal 
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />
    </div>
  );
};

export default AdminHeader;
