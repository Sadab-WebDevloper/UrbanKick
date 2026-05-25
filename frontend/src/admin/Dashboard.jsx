import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package,
  TrendingUp,
  Activity,
  ArrowRight,
  Search,
  Bell,
  User as UserIcon,
  ChevronDown,
  Settings,
  LogOut
} from 'lucide-react';
import { API_URL } from '../config/api';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import AdminHeader from '../components/AdminHeader';

const Dashboard = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const getFullImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-grow flex items-center justify-center bg-gray-50">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `₹${stats?.revenue || '0'}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Total Orders', value: stats?.orders || '0', icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Users', value: stats?.users || '0', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Total Products', value: stats?.products || '0', icon: Package, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-grow ml-64 p-8 overflow-y-auto">
        <AdminHeader title="Overview" subtitle={`Welcome back, ${user?.firstName}.`} />

        {/* Stats Grid - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white p-5 rounded-[1.25rem] shadow-sm border border-gray-50 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bg} p-3 rounded-xl transition-transform group-hover:scale-110`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex items-center space-x-1 text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg text-[9px] font-black">
                  <TrendingUp className="w-2.5 h-2.5" />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl font-black text-primary mt-1 tracking-tighter">{stat.value}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* Recent Products - Full Width */}
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-50 overflow-hidden">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-primary tracking-tight">Recent Products</h2>
                <p className="text-[11px] text-secondary font-bold mt-1 opacity-60">Monitor your latest inventory additions and stock status.</p>
              </div>
              <button 
                onClick={() => navigate('/admin/products')}
                className="flex items-center space-x-2 px-6 py-2.5 bg-gray-50 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300 group"
              >
                <span>View Inventory</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Product</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Category</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Price</th>
                    <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Last Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats?.recentProducts?.length > 0 ? stats.recentProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 rounded-[1.2rem] bg-gray-50 overflow-hidden shadow-inner border border-gray-100 p-1.5 transition-transform group-hover:scale-105">
                            <img src={getFullImageUrl(product.image)} alt={product.name} className="w-full h-full object-contain" />
                          </div>
                          <span className="text-sm font-black text-primary group-hover:text-accent transition-colors">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-primary">₹{product.price}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500 shadow-lg shadow-green-100' : 'bg-red-500 shadow-lg shadow-red-100'}`}></div>
                          <span className={`text-[11px] font-black ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? 'AVAILABLE' : 'OUT OF STOCK'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                          {new Date(product.updatedAt || product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-8 py-16 text-center text-xs font-black text-gray-300 italic opacity-50 tracking-widest uppercase">No products registered yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
