const { da } = require('zod/v4/locales');
const Category = require('../../models/category.model');

const getCategories = async (req, res) => {
  try {
    const { entityType } = req.query;
    console.log(entityType);

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
    const {
      name,
      parent = null,
      entityType = 'contact',
      isActive = true,
    } = req.body;

    // If parent provided, ensure it exists and is not creating a loop
    if (parent) {
      const parentCat = await Category.findById(parent);
      if (!parentCat) {
        return res.status(400).json({
          success: false,
          message: 'Parent category not found',
          data: null,
          error: { code: 400, details: 'Parent category not found' },
        });
      }
      // prevent parent loop (direct cycle)
      if (parentCat._id.equals(parentCat.parent)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid parent category',
          data: null,
          error: { code: 400, details: 'Invalid parent category' },
        });
      }
    }

    const category = await Category.create({
      name,
      parent,
      entityType,
      isActive,
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
    const { name, parent, entityType, isActive } = req.body;
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
    category.parent = parent || category.parent;
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

module.exports = { getCategories, addCategory, updateCategory };
