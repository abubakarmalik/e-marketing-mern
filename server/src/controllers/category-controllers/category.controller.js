const { da } = require('zod/v4/locales');
const Category = require('../../models/category.model');

const getCategories = async (req, res) => {
  try {
    const { entityType } = req.query;

    const filter = {};
    if (entityType) filter.entityType = entityType;

    const categories = await Category.find(filter).sort({ name: 1 }).lean();
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
      error: { code: 500, details: err.message },
    });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, entityType = 'contact' } = req.body;

    // Check for duplicate name
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category already exists',
        data: null,
        error: { code: 400, details: 'Duplicate category' },
      });
    }

    const category = await Category.create({
      name,
      entityType,
    });
    res.status(201).json({
      success: true,
      message: 'Category created',
      data: category,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
      error: { code: 500, details: err.message },
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, entityType, isActive } = req.body;

    // Find the category to update
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        data: null,
        error: { code: 404, details: 'Category not found' },
      });
    }

    // Update the category
    category.name = name || category.name;
    category.entityType = entityType || category.entityType;
    category.isActive = isActive !== undefined ? isActive : category.isActive;

    await category.save();
    res.status(200).json({
      success: true,
      message: 'Category updated',
      data: category,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
      error: { code: 500, details: err.message },
    });
  }
};

// Delete category

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the category to delete
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
        data: null,
        error: { code: 404, details: 'Category not found' },
      });
    }

    // Delete the category
    await category.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Category deleted',
      data: null,
      error: null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
      data: null,
      error: { code: 500, details: err.message },
    });
  }
};

module.exports = { getCategories, addCategory, updateCategory, deleteCategory };
