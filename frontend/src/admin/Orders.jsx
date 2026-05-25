import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import AdminHeader from '../components/AdminHeader';
import { X, AlertCircle } from 'lucide-react';

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const deliverHandler = async () => {
    if (selectedOrderId) {
      try {
        await axios.put(`${API_URL}/api/orders/${selectedOrderId}/deliver`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchOrders();
        setShowModal(false);
        setSelectedOrderId(null);
      } catch (err) {
        setError('Failed to update order status');
        setShowModal(false);
      }
    }
  };

  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-grow ml-64 p-8">
        <AdminHeader 
          title="Orders Management" 
          subtitle="View and update customer orders"
        />

        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-50 p-8">
          {error && <div className="mb-6 text-red-500 font-bold">{error}</div>}
          
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-xs font-black uppercase tracking-widest text-gray-400">
                    <th className="pb-4 font-medium">ID</th>
                    <th className="pb-4 font-medium">User</th>
                    <th className="pb-4 font-medium">Date</th>
                    <th className="pb-4 font-medium">Total</th>
                    <th className="pb-4 font-medium">Delivered</th>
                    <th className="pb-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-medium text-gray-500">{order._id.substring(0, 8)}...</td>
                      <td className="py-4 font-bold text-gray-800">{order.user && order.user.firstName}</td>
                      <td className="py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 font-black text-primary">₹{order.totalPrice.toFixed(2)}</td>
                      <td className="py-4">
                        {order.isDelivered ? (
                          <span className="text-green-500 font-bold text-xs bg-green-50 px-2 py-1 rounded">Yes</span>
                        ) : (
                          <span className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded">No</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        {!order.isDelivered && (
                          <button
                            onClick={() => openModal(order._id)}
                            className="text-xs font-black uppercase tracking-widest bg-primary text-white px-4 py-2 rounded-xl hover:bg-slate-800 transition"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 max-w-sm w-full p-6 animate-slide-up relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex flex-col items-center text-center mt-4">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-black text-gray-800 tracking-tight mb-2">Mark as Delivered?</h3>
              <p className="text-sm font-medium text-gray-500 mb-8">
                Are you sure you want to mark this order as delivered? This action cannot be undone and will notify the user.
              </p>
              <div className="flex w-full space-x-3">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 text-sm font-black uppercase tracking-widest text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={deliverHandler}
                  className="flex-1 py-3 text-sm font-black uppercase tracking-widest text-white bg-accent rounded-xl hover:bg-orange-600 shadow-lg shadow-accent/20 transition-all"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
