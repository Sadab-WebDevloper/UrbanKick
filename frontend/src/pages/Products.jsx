import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import SEO from '../components/SEO';
import { useAuth } from '../context/AuthContext';

import { SearchX, Plus, Search, SlidersHorizontal } from 'lucide-react';

const Products = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated) {
        setProducts([
          {
            _id: 'dummy-1',
            name: 'Urban Glide',
            description: 'Experience premium comfort with our signature streetwear classic.',
            price: 4999,
            category: 'Streetwear',
            image: '/Nike Runner.jpg',
            stock: 15
          },
          {
            _id: 'dummy-2',
            name: 'Velocity Runner X',
            description: 'Engineered for maximum speed and style on the tracks.',
            price: 6599,
            category: 'Running',
            image: '/Nike Runner.jpg',
            stock: 5
          },
          {
            _id: 'dummy-3',
            name: 'Classic Court Low',
            description: 'Timeless design meets modern durability.',
            price: 5299,
            category: 'Casual',
            image: '/Nike SB Dunk Low.jpg',
            stock: 0
          }
        ]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [isAuthenticated]);

  const filteredProducts = products.filter(product => {
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesSearch = !filters.search || 
      product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      product.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesMinPrice = !filters.minPrice || product.price >= parseFloat(filters.minPrice);
    const matchesMaxPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);
    
    return matchesCategory && matchesSearch && matchesMinPrice && matchesMaxPrice;
  });

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12">
      <SEO title="Shop Premium Sneakers - UrbanKick" description="Browse and shop from our curated collection of premium sneakers." />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter leading-none text-glow">
            Our Collection
          </h1>
          <p className="text-lg text-gray-300 font-medium">Find your perfect pair from our curated selection</p>
        </div>

        {/* Filters - Optimized for consistency and size */}
        <div className="bg-zinc-950/80 rounded-[2.5rem] shadow-2xl p-4 md:p-6 mb-12 border border-white/5 backdrop-blur-md animate-fade-in mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            {/* Search Box - Compact and Balanced */}
            <div className="relative w-full md:w-64 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-accent transition-colors" />
              <input
                type="text"
                placeholder="Search sneakers..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold placeholder-gray-500 focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300 text-sm"
              />
            </div>
            
            {/* Divider for Desktop */}
            <div className="hidden md:block w-px h-8 bg-white/10"></div>

            {/* Other Filters Row */}
            <div className="flex flex-wrap items-center justify-center gap-4">
              {/* Category Select */}
              <div className="relative">
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="appearance-none w-40 pl-4 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300 cursor-pointer text-sm bg-zinc-900"
                >
                  <option value="" className="bg-zinc-900">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat} className="bg-zinc-900">{cat}</option>
                  ))}
                </select>
                <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Price Range Compact */}
              <div className="flex items-center gap-3">
                <div className="relative w-24">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full pl-6 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold placeholder-gray-500 focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300 text-sm"
                  />
                </div>
                <div className="w-2 h-0.5 bg-white/20 rounded-full"></div>
                <div className="relative w-24">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full pl-6 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-bold placeholder-gray-500 focus:outline-none focus:border-accent focus:bg-white/10 transition-all duration-300 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 rounded-[2.5rem] hover:border-accent/40 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(255,107,53,0.12)] animate-fade-in transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="relative aspect-square bg-white/5 rounded-[2rem] overflow-hidden mb-6 flex items-center justify-center">
                    <img
                      src={product.image?.startsWith('http') ? product.image : product.image?.startsWith('/uploads') ? `${API_URL}${product.image}` : product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.stock > 0 ? (
                      <div className="absolute top-4 right-4 bg-green-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        In Stock
                      </div>
                    ) : (
                      <div className="absolute top-4 right-4 bg-red-500/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        Sold Out
                      </div>
                    )}
                  </div>
                  <div className="px-2">
                    <h3 className="text-lg font-black text-white group-hover:text-accent transition-colors leading-tight mb-2 truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm font-medium mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-2xl font-black text-accent">
                        ₹{product.price}
                      </span>
                      <span className="text-xs bg-white/5 border border-white/10 text-gray-400 px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] backdrop-blur-md max-w-2xl mx-auto relative overflow-hidden">
            {/* Background Decorative Element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/5 blur-[100px] rounded-full"></div>
            
            <div className="relative flex justify-center mb-10">
              <div className="group relative">
                <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-150 animate-pulse transition-colors duration-700"></div>
                <div className="relative bg-white/5 p-10 rounded-full border border-white/10 transform group-hover:rotate-[15deg] transition-all duration-700 ease-out">
                  <SearchX className="w-20 h-20 text-white stroke-[1.25] group-hover:text-accent transition-colors duration-500" />
                </div>
                {/* Micro-animation dots */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full animate-bounce delay-100"></div>
                <div className="absolute -bottom-4 -left-4 w-3 h-3 bg-white/30 rounded-full animate-bounce delay-300"></div>
              </div>
            </div>

            <div className="relative">
              <h3 className="text-5xl font-black mb-6 text-white tracking-tight">
                Oops! No Matches Found
              </h3>
              <p className="text-gray-300 text-xl mb-12 max-w-lg mx-auto leading-relaxed font-medium">
                We couldn't find any sneakers matching your specific criteria. <br/>
                <span className="text-gray-500 text-lg">Try searching for something else or clearing your filters.</span>
              </p>
              
              <button
                onClick={() => setFilters({ category: '', search: '', minPrice: '', maxPrice: '' })}
                className="group relative inline-flex items-center space-x-3 bg-accent text-white px-10 py-4 rounded-2xl font-bold hover:bg-orange-600 transition-all duration-300 shadow-2xl shadow-accent/20 transform hover:-translate-y-1 active:translate-y-0"
              >
                <span>Clear All Filters</span>
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:rotate-90 transition-transform">
                  <Plus className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
