const express = require('express');
const {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} = require('../../controllers/category-controllers/category.controller');
const { categorySchema } = require('../../schemas/contact.schemas');
const { validate } = require('../../middlewares/validateRequest');
const { requireAuth } = require('../../middlewares/auth');

const router = express.Router();

router.get('/', requireAuth, getCategories);
router.post('/add', requireAuth, validate(categorySchema), addCategory);
router.put(
  '/update/:id',
  requireAuth,
  validate(categorySchema),
  updateCategory,
);
router.delete('/delete/:id', requireAuth, deleteCategory);

module.exports = router;
