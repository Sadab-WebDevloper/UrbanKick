# UrbanKick - Shoes E-commerce Website

A full-stack shoes e-commerce website built with React, Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Backend (Port 7000)
```bash
cd backend
npm install
npm run dev
```
Backend will run on: `http://localhost:7000`

### Frontend (Port 3001)
```bash
cd frontend
npm install
npm start
```
Frontend will run on: `http://localhost:3000`

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

## 🔧 Configuration

### Backend (.env)
```
PORT=7000
MONGO_URI=mongodb://localhost:27017/urbankick
JWT_SECRET=8dF2xQ9vLp7Nc4ZtR6mKb1HyU3wEs8Jq5aBn2Cx7Rf9Tk4
FRONTEND_URL=http://localhost:3001
```

### Frontend (.env)
```
PORT=3001
REACT_APP_API_URL=http://localhost:7000
```

## 📁 Project Structure

```
UrbanKick/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── index.js         # Entry point
│
└── frontend/
    ├── public/
    └── src/
        ├── components/  # Reusable components
        ├── context/     # React context (Auth)
        ├── pages/       # Page components
        ├── config/      # API configuration
        └── App.jsx      # Main app component
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `POST /api/users/upload-image` - Upload profile image (Protected)

## 🎨 Features

- ✅ User Authentication (Register/Login)
- ✅ Product Listing with Filters
- ✅ Product Detail View
- ✅ User Profile Management
- ✅ Responsive Design (Mobile & Desktop)
- ✅ Professional UI with Tailwind CSS
- ✅ Protected Routes
- ✅ Image Upload Support

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios
- Tailwind CSS
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing
- Multer for file uploads
- CORS enabled

## 📝 Notes

- Make sure MongoDB is running before starting the backend
- Backend supports CORS for both port 3000 and 3001
- All API calls are centralized in `frontend/src/config/api.js`
- JWT tokens are stored in localStorage

## 🎯 Future Enhancements

- Shopping Cart functionality
- Payment integration (Stripe)
- Order management
- Admin dashboard
- Product reviews and ratings
- Wishlist feature
