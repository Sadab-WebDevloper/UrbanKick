import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      const { token, ...userData } = response.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Registering user with data:', { ...userData, password: '***' });
      console.log('API URL:', `${API_URL}/api/auth/register`);
      
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      console.log('Registration response:', response.data);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/users/profile`,
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Update failed' 
      };
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(
        `${API_URL}/api/users/upload-image`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      setUser(prev => ({ ...prev, profileImage: response.data.profileImage }));
      return { success: true, profileImage: response.data.profileImage };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Upload failed' 
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    uploadProfileImage,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
