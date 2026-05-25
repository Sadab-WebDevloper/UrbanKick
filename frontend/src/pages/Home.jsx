import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api';
import SEO from '../components/SEO';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero Slider Images
  const heroSlides = [
    {
      image: '/Nike-sports-shoes.jpg',
      title: 'Step Into',
      subtitle: 'Your Style',
      description: 'Discover premium sneakers that define your unique journey'
    },
    {
      image: '/Nike Runner.jpg',
      title: 'Elevate Your',
      subtitle: 'Game',
      description: 'Performance meets style in our exclusive collection'
    },
    {
      image: '/Nike SB Dunk Low.jpg',
      title: 'Walk With',
      subtitle: 'Confidence',
      description: 'Premium quality sneakers for every occasion'
    }
  ];

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/featured`);
      setFeaturedProducts(response.data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <SEO title="Home - UrbanKick" description="Discover premium sneakers that define your unique journey at UrbanKick." />
      {/* Hero Slider Section */}
      <section className="relative h-screen overflow-hidden bg-transparent">
        {/* Slider Container */}
        <div className="relative h-full">
          {heroSlides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentSlide
                  ? 'opacity-100 translate-x-0'
                  : index < currentSlide
                  ? 'opacity-0 -translate-x-full'
                  : 'opacity-0 translate-x-full'
              }`}
            >
              <div className="h-full flex items-center justify-center">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                  {/* Text Content */}
                  <div className="text-center lg:text-left z-10">
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none text-glow animate-slide-up">
                      {slide.title}
                      <br />
                      <span className="text-accent">{slide.subtitle}</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-8 animate-fade-in font-medium max-w-md mx-auto lg:mx-0 leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in">
                      <Link
                        to="/products"
                        className="inline-flex items-center justify-center bg-accent text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-accent/20"
                      >
                        Shop Now
                      </Link>
                      <Link
                        to="/products"
                        className="inline-flex items-center justify-center bg-white/5 text-white border border-white/10 px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-0.5"
                      >
                        Explore Collection
                      </Link>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative animate-fade-in flex justify-center">
                    <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 bg-white/5 aspect-square max-w-[460px] w-full flex items-center justify-center p-6">
                      <img
                        src={slide.image}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-700 animate-float"
                      />
                    </div>
                    <div className="absolute -bottom-4 right-4 md:right-10 bg-accent text-white px-8 py-4 rounded-3xl shadow-2xl shadow-accent/30 border border-white/10 transform hover:scale-105 transition-all">
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/80">New Arrivals</p>
                      <p className="text-3xl font-black tracking-tight leading-none mt-1">2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/5 hover:bg-white/15 text-white border border-white/10 p-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-md"
          aria-label="Previous slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/5 hover:bg-white/15 text-white border border-white/10 p-4 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 backdrop-blur-md"
          aria-label="Next slide"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-12 h-3 bg-accent'
                  : 'w-3 h-3 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-transparent border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-3 tracking-tighter leading-none text-glow animate-slide-up">
              Featured Collection
            </h2>
            <p className="text-lg text-gray-300 font-medium">Handpicked sneakers for the modern enthusiast</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group relative bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 rounded-[2.5rem] hover:border-accent/40 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(255,107,53,0.12)] animate-fade-in transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative aspect-square bg-white/5 rounded-[2rem] overflow-hidden mb-6 flex items-center justify-center">
                    <img
                      src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image.startsWith('/') ? '' : '/'}${product.image}`}
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.featured && (
                      <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider">
                        Featured
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
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl font-bold italic">No featured products available</p>
            </div>
          )}

          <div className="text-center mt-16 animate-fade-in">
            <Link
              to="/products"
              className="inline-flex items-center bg-accent text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-2xl shadow-accent/20"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-24 bg-transparent border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none text-glow">
                Join Our Community
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed font-medium">
                Sign up today and get exclusive access to new releases, special offers, and member-only events.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center bg-white text-primary px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-accent hover:text-white transition-all duration-300 transform hover:-translate-y-0.5 shadow-2xl hover:shadow-accent/25"
              >
                Get Started Free
              </Link>
            </div>
            <div className="order-1 lg:order-2 relative flex justify-center">
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 max-w-[460px] w-full">
                <img
                  src="/low-dunk.jpg"
                  alt="Nike Low-dunk"
                  className="w-full h-96 object-cover transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
