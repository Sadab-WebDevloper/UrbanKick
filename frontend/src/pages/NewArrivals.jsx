import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../config/api';
import { Sparkles, ArrowRight, ShoppingBag } from 'lucide-react';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

const NewArrivals = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated) {
        setProducts([
          { _id: 'dummy-1', name: 'Urban Glide', price: 4999, category: 'Streetwear', image: '/Nike-sports-shoes.jpg' },
          { _id: 'dummy-2', name: 'Velocity Runner X', price: 6599, category: 'Running', image: '/Nike Runner.jpg' },
          { _id: 'dummy-3', name: 'Classic Court Low', price: 5299, category: 'Casual', image: '/Nike SB Dunk Low.jpg' }
        ]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/products/new-arrivals`);
        setProducts(response.data.slice(0, 8));
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <SEO title="New Arrivals - UrbanKick" description="Explore the latest sneaker drops and new arrivals at UrbanKick." />
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Header */}
        <div className="relative rounded-[3rem] bg-zinc-950/80 border border-white/5 h-[340px] overflow-hidden mb-16 flex items-center p-10 md:p-14 shadow-2xl">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              className="w-full h-full object-cover opacity-30"
              alt="Latest kicks"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-2xl animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Just Dropped</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none">
              The Latest <br/> <span className="text-accent text-glow">Sneaker Heat</span>
            </h1>
            <p className="text-lg text-gray-300 font-medium mb-8">
              Explore the freshest arrivals from the world's top brands. Don't miss out on the most anticipated releases of the season.
            </p>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-white tracking-tight">Recent Releases</h2>
          <Link to="/products" className="group flex items-center space-x-2 text-sm font-black uppercase tracking-widest text-white hover:text-accent transition-colors">
            <span>View Full Collection</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-accent" />
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-zinc-900/50 backdrop-blur-md border border-white/5 p-6 rounded-[2.5rem] animate-pulse space-y-4">
                <div className="bg-white/5 aspect-square rounded-[2rem]"></div>
                <div className="h-4 bg-white/5 rounded-full w-3/4"></div>
                <div className="h-4 bg-white/5 rounded-full w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] backdrop-blur-md">
            <p className="text-gray-400 text-xl font-bold italic">No new arrivals available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Link 
                key={product._id} 
                to={`/products/${product._id}`}
                className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 rounded-[2.5rem] hover:border-accent/40 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(255,107,53,0.12)] animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative aspect-square bg-white/5 rounded-[2rem] overflow-hidden mb-6 flex items-center justify-center">
                  <img 
                    src={product.image?.startsWith('http') ? product.image : product.image?.startsWith('/uploads') ? `${API_URL}${product.image}` : product.image}
                    alt={product.name} 
                    className="w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute top-6 right-6">
                    <div className="bg-accent p-3 rounded-2xl shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{product.category}</p>
                  <h3 className="text-lg font-black text-white group-hover:text-accent transition-colors leading-tight mb-2 truncate">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-2xl font-black text-accent">₹{product.price}</p>
                    {product.sizes && product.sizes.length > 0 && (
                      <span className="text-[9px] font-bold text-gray-400 border border-white/10 px-2 py-0.5 rounded">
                        Sizes: {product.sizes.slice(0, 3).join(',')}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;
