const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

// @desc Get dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    
    // For now, since we don't have orders, we'll return some mock data for revenue/orders
    // but users and products are real.
    res.json({
      users: userCount,
      products: productCount,
      revenue: 0, 
      orders: 0, 
      recentProducts: await Product.find().sort({ createdAt: -1 }).limit(5),
      recentUsers: await User.find().select('-password').sort({ createdAt: -1 }).limit(5)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Update user details
router.put('/users/update/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;
    if (req.body.role) user.role = req.body.role;
    
    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Delete user
router.delete('/users/delete/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Prevent deleting self or other admins if needed, but for now simple delete
    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc Toggle user status (active/inactive)
router.post('/users/:id/toggle-status', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
