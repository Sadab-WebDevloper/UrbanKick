import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  AlertCircle,
  X,
  CheckCircle2,
  Loader2,
  Eye,
  UserCheck,
  UserX,
  Pencil,
  Trash2
} from 'lucide-react';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/AdminLayout';

const AdminUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // New States for Real-time Interaction
  const [togglingId, setTogglingId] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setToast({ show: true, message: 'Failed to fetch users', type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
  };

  const handleToggleStatus = async (user) => {
    setTogglingId(user._id);
    try {
      const response = await axios.post(`${API_URL}/api/admin/users/${user._id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setUsers(users.map(u => u._id === user._id ? { ...u, isActive: response.data.isActive } : u));
      showToast(`User ${response.data.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling user:', error);
      showToast(error.response?.data?.message || 'Error updating user status', 'error');
    } finally {
      setTogglingId(null);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/admin/users/update/${editingUser._id}`, editingUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.map(u => u._id === editingUser._id ? response.data.user : u));
      showToast('User updated successfully');
      setEditingUser(null);
    } catch (error) {
      showToast(error.response?.data?.message || 'Update failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    setActionLoading(true);
    try {
      await axios.delete(`${API_URL}/api/admin/users/delete/${deletingUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== deletingUser._id));
      showToast('User deleted successfully');
      setDeletingUser(null);
    } catch (error) {
      showToast(error.response?.data?.message || 'Delete failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.role !== 'admin' && (
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <AdminLayout title="Customer Management" subtitle="Manage user access and track customer registrations.">
      <div className="relative">
        {/* Toast Notification */}
        {toast.show && (
          <div className={`fixed top-8 right-8 z-[200] flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl border animate-slide-in-right ${
            toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-green-50 border-green-100 text-green-600'
          }`}>
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            <span className="text-sm font-bold">{toast.message}</span>
          </div>
        )}

        {/* User Details Modal - Cleaned View */}
        {viewingUser && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in" onClick={() => setViewingUser(null)}>
            <div 
              className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up relative border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Profile Header - Compact */}
              <div className="h-24 bg-primary relative">
                <button 
                  onClick={() => setViewingUser(null)}
                  className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-8 pb-10 px-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-3xl font-black text-primary tracking-tight">{viewingUser.firstName} {viewingUser.lastName}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Customer Profile</p>
                  </div>
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${
                    viewingUser.isActive !== false ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
                  }`}>
                    {viewingUser.isActive !== false ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                    <p className="text-xs font-bold text-primary truncate">{viewingUser.email}</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Member Since</p>
                    <p className="text-xs font-bold text-primary">
                      {new Date(viewingUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">User ID</p>
                    <p className="text-xs font-bold text-primary">#{viewingUser._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-[2rem] border border-gray-100">
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Purchases</p>
                    <p className="text-xs font-bold text-primary">0 Orders</p>
                  </div>
                </div>
              </div>

              {/* Bottom Decorative Bar */}
              <div className="h-3 bg-gray-50 border-t border-gray-100"></div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up relative border border-gray-100">
              <div className="p-10">
                <h3 className="text-2xl font-black text-primary tracking-tight mb-8">Edit User Info</h3>
                <form onSubmit={handleUpdateUser} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                      <input 
                        type="text" 
                        required
                        value={editingUser.firstName}
                        onChange={(e) => setEditingUser({ ...editingUser, firstName: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary outline-none focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                      <input 
                        type="text" 
                        required
                        value={editingUser.lastName}
                        onChange={(e) => setEditingUser({ ...editingUser, lastName: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary outline-none focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all shadow-sm"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm font-bold text-primary outline-none focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all shadow-sm"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button 
                      type="submit"
                      disabled={actionLoading}
                      className="flex-grow py-4 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Save Changes'}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-8 py-4 rounded-2xl bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingUser && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-[3rem] shadow-2xl overflow-hidden animate-slide-up relative border border-gray-100 p-8 text-center">
              <div className="w-20 h-20 rounded-[2rem] bg-red-50 mx-auto flex items-center justify-center mb-6">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-black text-primary tracking-tight mb-2">Are you sure?</h3>
              <p className="text-xs text-secondary font-bold mb-8 px-4 opacity-70 leading-relaxed">
                You are about to permanently delete <span className="text-primary">{deletingUser.firstName} {deletingUser.lastName}</span>. This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={handleDeleteUser}
                  disabled={actionLoading}
                  className="w-full py-4 rounded-2xl bg-red-500 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-200 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Yes, Delete Account'}
                </button>
                <button 
                  onClick={() => setDeletingUser(null)}
                  className="w-full py-4 rounded-2xl bg-gray-50 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gray-100 transition-all active:scale-95"
                >
                  Keep Account
                </button>
              </div>
            </div>
          </div>
        )}



        {/* Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-50 mb-6">
          <div className="relative group w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-bold text-primary outline-none focus:bg-white focus:ring-2 focus:ring-primary/5 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Joined Date</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-xs font-bold text-gray-300 italic">No users found.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs shadow-md">
                          {u.firstName[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-primary">{u.firstName} {u.lastName}</p>
                          <p className="text-[9px] text-gray-400 font-medium">ID: {u._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-secondary">{u.email}</td>
                    <td className="px-6 py-4 text-xs font-medium text-secondary">
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${
                        u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${u.isActive !== false ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-[10px] font-bold ${u.isActive !== false ? 'text-green-600' : 'text-red-600'}`}>
                          {u.isActive !== false ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => setViewingUser(u)}
                          title="View Details"
                          className="p-2 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setEditingUser(u)}
                          title="Edit User"
                          className="p-2 rounded-xl bg-purple-50 text-purple-500 hover:bg-purple-500 hover:text-white transition-all duration-300"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeletingUser(u)}
                          title="Delete User"
                          className="p-2 rounded-xl bg-red-50/50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="w-px h-4 bg-gray-100 mx-1"></div>
                        <button 
                          onClick={() => handleToggleStatus(u)}
                          disabled={togglingId === u._id}
                          title={u.isActive !== false ? "Deactivate User" : "Activate User"}
                          className={`p-2 rounded-xl transition-all duration-300 disabled:opacity-50 ${
                            u.isActive !== false 
                              ? 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white' 
                              : 'bg-green-50 text-green-500 hover:bg-green-500 hover:text-white'
                          }`}
                        >
                          {togglingId === u._id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            u.isActive !== false ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
