import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/orders/myorders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        setError('Failed to load your orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token]);

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="mb-12 animate-slide-up">
          <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <Package className="w-4 h-4" />
            <span>Order History</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter text-glow">My Orders</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-sm font-bold animate-fade-in mb-8">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-zinc-900/40 border border-white/5 p-12 rounded-[3rem] backdrop-blur-md text-center animate-fade-in shadow-xl">
            <Package className="w-16 h-16 text-gray-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black text-white mb-4">No Orders Yet</h2>
            <p className="text-gray-400 font-medium mb-8">Looks like you haven't placed any orders with us yet.</p>
            <Link to="/products" className="inline-flex items-center justify-center bg-accent text-white px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition shadow-lg shadow-accent/20">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl backdrop-blur-md animate-fade-in group">
                <div className="bg-white/5 border-b border-white/5 p-6 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Order Placed</p>
                    <p className="text-sm font-bold text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Total Amount</p>
                    <p className="text-sm font-black text-white">₹{order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Order ID</p>
                    <p className="text-sm font-bold text-gray-300">#{order._id.substring(0, 8)}</p>
                  </div>
                  <div>
                    {order.isDelivered ? (
                      <div className="flex items-center space-x-2 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                        <CheckCircle className="w-4 h-4" />
                        <span>Delivered</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 bg-accent/10 border border-accent/20 text-accent px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                        <Clock className="w-4 h-4 animate-pulse" />
                        <span>Processing</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  <div className="space-y-6">
                    {order.orderItems.map((item, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-6 items-center sm:items-start p-4 rounded-2xl bg-black/20 border border-white/5 group-hover:border-white/10 transition-colors">
                        <div className="w-24 h-24 bg-white/5 rounded-xl flex items-center justify-center p-2 shrink-0">
                          <img 
                            src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`} 
                            alt={item.name} 
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                          <h3 className="text-white font-bold text-lg mb-2">{item.name}</h3>
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium text-gray-400">
                            <span className="bg-white/5 px-3 py-1 rounded-lg">Size: {item.size}</span>
                            <span className="bg-white/5 px-3 py-1 rounded-lg capitalize">Color: {item.color}</span>
                            <span className="bg-white/5 px-3 py-1 rounded-lg">Qty: {item.qty}</span>
                          </div>
                        </div>
                        <div className="text-xl font-black text-white shrink-0">
                          ₹{(item.price * item.qty).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Shipping Address</h4>
                      <p className="text-sm font-medium text-gray-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-4">Payment Method</h4>
                      <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-2xl border border-white/5 text-sm font-medium text-gray-300">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="text-accent text-xs font-bold">$</span>
                        </div>
                        <span>{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
