const express = require('express');
const authRoutes = require('./auth-routes/auth.route');
const categoryRoutes = require('./category-routes/category.route');
const contactRoutes = require('./contact-routes/contact.route');

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/category', categoryRoutes);
router.use('/contact', contactRoutes);

module.exports = router;
