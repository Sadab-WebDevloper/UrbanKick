import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { API_URL } from '../config/api';
import { CheckCircle, MapPin, CreditCard, ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart, updateQuantity, removeFromCart } = useCart();
  const { token, user } = useAuth();
  const navigate = useNavigate();
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/products');
    }
  }, [cartItems, navigate, orderPlaced]);

  const placeOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const orderData = {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod: 'Cash On Delivery',
        itemsPrice: cartTotal,
        shippingPrice: 0, // Free shipping for simplicity
        totalPrice: cartTotal,
      };

      const { data } = await axios.post(`${API_URL}/api/orders`, orderData, config);
      
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-transparent pt-32 pb-16 flex items-center justify-center px-4">
        <div className="bg-zinc-950/80 p-12 rounded-[3rem] shadow-2xl border border-white/10 max-w-2xl w-full text-center animate-slide-up backdrop-blur-md">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
            <CheckCircle className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-4xl font-black text-white mb-4 tracking-tighter text-glow">Order Confirmed!</h2>
          <p className="text-gray-300 font-medium mb-10 leading-relaxed text-lg">
            Thank you for shopping with UrbanKick, {user?.firstName}. Your order has been placed successfully and will be shipped soon. 
            <br/><br/>
            <span className="text-accent font-bold">Payment Method: Cash on Delivery</span>
          </p>
          <button 
            onClick={() => navigate('/products')}
            className="inline-flex items-center space-x-3 bg-accent text-white px-10 py-4 rounded-full text-sm font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:bg-orange-600 transition-all hover:-translate-y-1"
          >
            <span>Continue Shopping</span>
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12 animate-slide-up">
          <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <ShoppingBag className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter text-glow">Complete Your Order</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start">
          
          <form onSubmit={placeOrder} className="space-y-8 animate-fade-in">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl text-sm font-bold">
                {error}
              </div>
            )}
            
            <div className="bg-zinc-900/40 border border-white/5 p-8 md:p-10 rounded-[3rem] shadow-xl backdrop-blur-md">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-accent/10 p-3 rounded-2xl text-accent">
                  <MapPin className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Shipping Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Address</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.address}
                    onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-accent focus:bg-white/10 transition-all placeholder-gray-600"
                    placeholder="123 Sneaker Street, Apt 4B"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-accent focus:bg-white/10 transition-all placeholder-gray-600"
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.postalCode}
                    onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-accent focus:bg-white/10 transition-all placeholder-gray-600"
                    placeholder="10001"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold text-white outline-none focus:border-accent focus:bg-white/10 transition-all placeholder-gray-600"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 p-8 md:p-10 rounded-[3rem] shadow-xl backdrop-blur-md">
              <div className="flex items-center space-x-4 mb-8">
                <div className="bg-accent/10 p-3 rounded-2xl text-accent">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">Payment Method</h2>
              </div>
              
              <div className="bg-white/5 border border-accent/40 rounded-2xl p-6 flex items-center justify-between relative overflow-hidden group cursor-default">
                <div className="absolute inset-0 bg-accent/5"></div>
                <div className="relative z-10 flex items-center space-x-4">
                  <div className="w-6 h-6 rounded-full border-4 border-accent bg-transparent flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-accent rounded-full"></div>
                  </div>
                  <span className="text-white font-bold text-lg">Cash on Delivery</span>
                </div>
                <span className="relative z-10 text-xs font-black uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-full">Selected</span>
              </div>
              <p className="mt-4 text-sm text-gray-400 font-medium ml-2">You will pay for this order when it arrives at your doorstep.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent text-white py-6 rounded-2xl text-lg font-black uppercase tracking-[0.2em] shadow-xl shadow-accent/20 hover:bg-orange-600 transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center justify-center space-x-3 group"
            >
              <span>{loading ? 'Processing...' : 'Place Order Now'}</span>
              {!loading && <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-zinc-950/80 border border-white/10 p-8 md:p-10 rounded-[3rem] shadow-2xl sticky top-32 animate-fade-in delay-200 backdrop-blur-xl">
            <h2 className="text-2xl font-black text-white tracking-tight mb-8">Order Summary</h2>
            
            <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item, index) => (
                <div key={index} className="flex space-x-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="w-20 h-20 bg-zinc-900 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2">
                    <img src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image}`} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-white font-bold text-sm mb-1 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-400 font-medium mb-2">Size: {item.size} | Color: {item.color}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-accent font-black text-sm">₹{(item.price * item.qty).toFixed(2)}</span>
                      
                      <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-1 border border-white/5">
                        <button 
                          onClick={() => updateQuantity(item.product, item.size, item.color, item.qty - 1)}
                          disabled={item.qty <= 1}
                          type="button"
                          className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">{item.qty}</span>
                        <button 
                          onClick={() => updateQuantity(item.product, item.size, item.color, item.qty + 1)}
                          type="button"
                          className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.product, item.size, item.color)}
                        type="button"
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all ml-2 border border-transparent hover:border-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold">Subtotal</span>
                <span className="text-white font-black">₹{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400 font-bold">Shipping</span>
                <span className="text-green-400 font-black">Free</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10 mt-4">
                <span className="text-lg text-white font-bold">Total</span>
                <span className="text-3xl text-accent font-black text-glow">₹{cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
