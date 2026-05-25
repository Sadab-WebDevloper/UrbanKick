const express = require('express');
const router = express.Router();
const { getUsers, getUserProfile, updateUserProfile, uploadProfileImage } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/upload-image', protect, uploadProfileImage);

module.exports = router;
