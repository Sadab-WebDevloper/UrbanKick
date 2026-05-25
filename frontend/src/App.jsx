import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { HelmetProvider } from 'react-helmet-async';

// Layout Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import NewArrivals from './pages/NewArrivals';
import CmsPage from './pages/CmsPage';

// Auth Pages
import Login from './auth/Login';
import Register from './auth/Register';

// User Pages
import Profile from './user/Profile';
import MyOrders from './user/MyOrders';
import Checkout from './pages/Checkout';

// Admin Pages
import Dashboard from './admin/Dashboard';
import AdminProducts from './admin/Products';
import AdminUsers from './admin/Users';
import ProductForm from './admin/ProductForm';
import CmsPages from './admin/CmsPages';
import CmsPageForm from './admin/CmsPageForm';
import AdminOrders from './admin/Orders';

// Auth Helper
import ProtectedRoute from './components/ProtectedRoute';

// Redirects Admins to Dashboard if they try to access public/user pages
const PublicRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};

// Redirects logged in users away from Login/Register pages
const AuthRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<PublicRoute><Home /></PublicRoute>} />
          <Route path="/products" element={<PublicRoute><Products /></PublicRoute>} />
          <Route path="/products/:id" element={<PublicRoute><ProductDetail /></PublicRoute>} />
          <Route path="/new-arrivals" element={<PublicRoute><NewArrivals /></PublicRoute>} />
          <Route path="/about" element={<PublicRoute><About /></PublicRoute>} />
          <Route path="/contact" element={<PublicRoute><Contact /></PublicRoute>} />
          <Route path="/pages/:slug" element={<PublicRoute><CmsPage /></PublicRoute>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          
          {/* User Routes */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute userOnly={true}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/myorders" 
            element={
              <ProtectedRoute userOnly={true}>
                <MyOrders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute userOnly={true}>
                <Checkout />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminProducts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products/new" 
            element={
              <ProtectedRoute adminOnly={true}>
                <ProductForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products/edit/:id" 
            element={
              <ProtectedRoute adminOnly={true}>
                <ProductForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/pages" 
            element={
              <ProtectedRoute adminOnly={true}>
                <CmsPages />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/pages/new" 
            element={
              <ProtectedRoute adminOnly={true}>
                <CmsPageForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/pages/edit/:id" 
            element={
              <ProtectedRoute adminOnly={true}>
                <CmsPageForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminUsers />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminOrders />
              </ProtectedRoute>
            } 
          />
          
          {/* Catch-all 404 Route */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-transparent pt-24 pb-16">
              <div className="bg-zinc-900/40 border border-white/5 p-12 rounded-[3rem] backdrop-blur-md text-center max-w-lg mx-auto shadow-2xl">
                <p className="text-xl font-black text-white mb-4">Error 404</p>
                <p className="text-gray-400 font-medium">The page you are looking for doesn't exist or has been moved.</p>
              </div>
            </div>
          } />
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppContent />
          </Router>
        </CartProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
