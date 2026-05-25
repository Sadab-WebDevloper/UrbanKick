const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getFeaturedProducts, 
  getNewArrivals,
  createProduct, 
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImage
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// Routes mapping
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id', getProductById);

// Protected Admin Routes
router.post('/create', protect, admin, createProduct);
router.post('/upload-image', protect, admin, uploadProductImage);
router.put('/update/:id', protect, admin, updateProduct);
router.delete('/delete/:id', protect, admin, deleteProduct);

module.exports = router;
