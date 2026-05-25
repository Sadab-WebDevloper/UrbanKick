const express = require('express');
const router = express.Router();
const {
  getPages,
  getPageBySlug,
  getAdminPages,
  getAdminPageById,
  createPage,
  updatePage,
  deletePage,
} = require('../controllers/pageController');
const { protect } = require('../middleware/authMiddleware');

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

router.get('/cms-pages', protect, admin, getAdminPages);
router.get('/cms-pages/:id', protect, admin, getAdminPageById);
router.post('/cms-pages/create', protect, admin, createPage);
router.put('/cms-pages/update/:id', protect, admin, updatePage);
router.delete('/cms-pages/delete/:id', protect, admin, deletePage);

router.get('/', getPages);
router.get('/:slug', getPageBySlug);

module.exports = router;
