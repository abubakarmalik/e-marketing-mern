const express = require('express');
const authRoutes = require('./auth-routes/auth.route');
const categoryRoutes = require('./category/category.route');

const router = express.Router();
router.use('/auth', authRoutes);
router.use('/category', categoryRoutes);

module.exports = router;
