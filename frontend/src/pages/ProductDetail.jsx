import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import { useCart } from '../context/CartContext';
import SEO from '../components/SEO';

const RelatedProducts = ({ currentId, category }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelated = async () => {

      try {
        const response = await axios.get(`${API_URL}/api/products`);
        const sameCategory = response.data
          .filter((item) => item._id !== currentId && item.category === category);
        const otherProducts = response.data
          .filter((item) => item._id !== currentId && item.category !== category);
        const filtered = sameCategory.slice(0, 3);
        const fallback = filtered.length < 3 ? otherProducts.slice(0, 3 - filtered.length) : [];
        setRelated([...filtered, ...fallback]);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRelated();
  }, [currentId, category]);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading related products...</div>;
  }

  if (related.length === 0) {
    return <div className="text-sm text-gray-500">No related products found yet.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {related.map((item) => (
        <Link
          key={item._id}
          to={`/products/${item._id}`}
          className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 p-4 rounded-[2rem] hover:border-accent/40 transition-all duration-300 shadow-xl hover:shadow-[0_0_20px_rgba(255,107,53,0.08)]"
        >
          <div className="aspect-square bg-white/5 rounded-[1.5rem] overflow-hidden mb-4 flex items-center justify-center">
            <img
              src={item.image.startsWith('http') ? item.image : `${API_URL}${item.image.startsWith('/') ? '' : '/'}${item.image}`}
              alt={item.name}
              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="px-2">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-2">{item.category}</p>
            <h3 className="text-base font-black text-white group-hover:text-accent transition-colors mb-2 line-clamp-1">{item.name}</h3>
            <p className="text-lg font-black text-accent">₹{item.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, clearCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {

      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(response.data);
        if (response.data.sizes?.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
        if (response.data.colors?.length > 0) {
          setSelectedColor(response.data.colors[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-transparent">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-transparent">
        <h2 className="text-2xl font-black text-white mb-4">Product not found</h2>
        <button
          onClick={() => navigate('/products')}
          className="bg-accent text-white px-8 py-3.5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition shadow-lg shadow-accent/20"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-8">
      <SEO title={`${product.name} - UrbanKick`} description={product.description} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-gray-400 hover:text-accent mb-6 transition font-bold uppercase tracking-wider text-xs"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>

        <div className="bg-zinc-950/80 rounded-[3rem] shadow-2xl overflow-hidden border border-white/5 backdrop-blur-md animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 p-8">
            <div className="bg-white/5 rounded-[2rem] overflow-hidden flex items-center justify-center p-8 border border-white/5">
              <img
                src={product.image?.startsWith('http') ? product.image : product.image?.startsWith('/uploads') ? `${API_URL}${product.image}` : product.image}
                alt={product.name}
                className="w-full max-w-[380px] max-h-[380px] object-contain transition-transform duration-500 hover:scale-105"
              />
            </div>

            <div>
              <h1 className="text-4xl font-black text-white tracking-tight mb-4">{product.name}</h1>
              <div className="flex items-center mb-6">
                <span className="text-4xl font-black text-accent mr-4 text-glow">₹{product.price}</span>
                <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-gray-300 uppercase tracking-wider">{product.category}</span>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed font-medium">{product.description}</p>

              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Select Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-5 py-2.5 border-2 rounded-xl transition-all font-bold text-sm ${
                          selectedSize === size
                            ? 'border-accent bg-accent text-white shadow-lg shadow-accent/20'
                            : 'border-white/10 text-white hover:border-accent bg-zinc-900/50'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-3">Select Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-5 py-2.5 border-2 rounded-xl transition capitalize font-bold text-sm ${
                          selectedColor === color
                            ? 'border-accent bg-accent text-white shadow-lg shadow-accent/20'
                            : 'border-white/10 text-white hover:border-accent bg-zinc-900/50'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                {product.stock > 0 ? (
                  <span className="text-green-400 font-bold bg-green-500/10 px-4 py-2 rounded-xl inline-block border border-green-500/20 text-sm">✓ In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-400 font-bold bg-red-500/10 px-4 py-2 rounded-xl inline-block border border-red-500/20 text-sm">✗ Out of Stock</span>
                )}
              </div>

              <button
                disabled={product.stock === 0}
                onClick={() => {
                  clearCart();
                  addToCart(product, 1, selectedSize, selectedColor);
                  navigate('/checkout');
                }}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 transform active:scale-95 ${
                  product.stock > 0
                    ? 'bg-accent text-white hover:bg-orange-600 shadow-xl shadow-accent/20 hover:-translate-y-0.5'
                    : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                }`}
              >
                {product.stock > 0 ? 'Buy Now (COD)' : 'Out of Stock'}
              </button>

              <div className="mt-8 border-t border-white/10 pt-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Product Features</h3>
                <ul className="space-y-3 text-gray-300 font-medium text-sm">
                  {[
                    'Premium Quality Materials',
                    'Free Shipping on Orders Over ₹1000',
                    '30-Day Return Policy',
                    'Authentic Products Guaranteed',
                  ].map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-zinc-950/50 rounded-[2.5rem] p-8 border-t border-white/5 shadow-2xl backdrop-blur-md">
            <h2 className="text-2xl font-black text-white tracking-tight mb-6">Related Products</h2>
            <RelatedProducts currentId={product._id} category={product.category} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
