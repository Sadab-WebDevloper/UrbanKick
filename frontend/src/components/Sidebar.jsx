import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingBag, 
  Settings, 
  FileText,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LogoutModal from './LogoutModal';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'CMS Pages', path: '/admin/pages', icon: FileText },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={`w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 flex flex-col z-[60] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-black text-primary tracking-tighter">
            URBAN<span className="text-accent">KICK</span>
          </span>
        </Link>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Admin Control Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-grow px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={`flex items-center justify-between px-3 py-3 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-primary'
              }`}
            >
              <div className="flex items-center space-x-4">
                <item.icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-gray-400 group-hover:text-primary'}`} />
                <span className="font-bold text-sm tracking-tight">{item.name}</span>
              </div>
              {isActive && <ChevronRight className="w-4 h-4 text-accent" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User */}
      <div className="p-4 border-t border-gray-50">
        <button 
          onClick={() => setLogoutModalOpen(true)}
          className="w-full flex items-center space-x-4 px-3 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all duration-300"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-bold text-sm">Sign Out</span>
        </button>
      </div>

      <LogoutModal 
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={logout}
      />
    </div>
  );
};

export default Sidebar;
