const Product = require('../models/Product');

// @desc Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get new arrival products
exports.getNewArrivals = async (req, res) => {
  try {
    const products = await Product.find({ newArrival: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create new product
exports.createProduct = async (req, res) => {
  try {
    console.log('📥 [createProduct] Incoming req.body:', JSON.stringify(req.body, null, 2));
    
    // Clean up body just in case it contains fields we shouldn't manually set
    const productData = { ...req.body };
    delete productData._id;
    delete productData.__v;
    delete productData.createdAt;
    delete productData.updatedAt;

    const product = new Product(productData);
    const newProduct = await product.save();
    console.log('✅ [createProduct] Product created successfully:', newProduct._id);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('❌ [createProduct] Failed to create product:', err.message);
    res.status(400).json({ message: err.message });
  }
};

// @desc Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update product
exports.updateProduct = async (req, res) => {
  try {
    console.log(`📥 [updateProduct] ID: ${req.params.id}, req.body:`, JSON.stringify(req.body, null, 2));
    
    // Clean up read-only or immutable fields
    const updateData = { ...req.body };
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!product) {
      console.warn(`⚠️ [updateProduct] Product with ID ${req.params.id} not found.`);
      return res.status(404).json({ message: 'Product not found' });
    }
    
    console.log('✅ [updateProduct] Product updated successfully:', product._id);
    res.json(product);
  } catch (err) {
    console.error('❌ [updateProduct] Failed to update product:', err.message);
    res.status(400).json({ message: err.message });
  }
};

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/products/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

exports.uploadProductImage = (req, res) => {
  const uploadSingle = upload.single('image');
  
  uploadSingle(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    
    res.json({
      url: `/uploads/products/${req.file.filename}`
    });
  });
};

// @desc Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
