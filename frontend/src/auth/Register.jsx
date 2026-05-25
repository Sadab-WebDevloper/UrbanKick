import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password requirements
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!/[A-Z]/.test(formData.password)) {
      setError('Password must include at least one uppercase letter');
      return;
    }

    if (!/[!@#$%^&*]/.test(formData.password)) {
      setError('Password must include at least one special character (!@#$%^&*)');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      });
      
      if (result.success) {
        // Navigate to login page after successful registration
        navigate('/login');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Network error. Please check if the backend is running.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full animate-slide-up">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-primary mb-3 tracking-tighter">
            Join <span className="text-accent">UrbanKick</span>
          </h2>
          <p className="text-secondary text-lg font-medium">
            Create your account and start shopping
          </p>
        </div>

        <form className="space-y-5 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-gray-50" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-2 border-red-100 text-red-600 px-5 py-4 rounded-2xl text-sm font-bold animate-fade-in">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl text-primary font-bold placeholder-gray-400 focus:outline-none focus:border-accent focus:bg-white transition-all duration-300"
                  placeholder="John"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl text-primary font-bold placeholder-gray-400 focus:outline-none focus:border-accent focus:bg-white transition-all duration-300"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl text-primary font-bold placeholder-gray-400 focus:outline-none focus:border-accent focus:bg-white transition-all duration-300"
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-6 py-4 pr-14 bg-gray-50 border-2 border-gray-50 rounded-2xl text-primary font-bold placeholder-gray-400 focus:outline-none focus:border-accent focus:bg-white transition-all duration-300"
                  placeholder="Min. 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-2"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-primary text-white font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-800 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-primary/20"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Creating...
                </span>
              ) : (
                'Create Account Now'
              )}
            </button>
          </div>

          <div className="text-center pt-6 border-t border-gray-50 mt-6">
            <p className="text-secondary text-sm font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-accent font-black hover:underline underline-offset-4 ml-1">
                Sign In here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
