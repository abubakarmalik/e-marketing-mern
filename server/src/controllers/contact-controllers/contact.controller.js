const Contact = require('../../models/contact.model');
const Category = require('../../models/category.model');

// get all contacts
const getContacts = async (_req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
      error: { code: 500, details: error.message },
    });
  }
};

// add a new contact
const addContact = async (req, res) => {
  const { number, category } = req.body || {};
  try {
    // optional: normalize a blank/empty category to null
    const categoryId =
      category && String(category).trim().length ? category : null;

    if (categoryId) {
      const categoryDoc = await Category.findById(categoryId);
      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: 'Category not found',
          data: null,
          error: { code: 400, details: 'Invalid category _id' },
        });
      }
      if (
        categoryDoc.entityType !== 'contact' &&
        categoryDoc.entityType !== 'both'
      ) {
        return res.status(400).json({
          success: false,
          message: 'Category is not valid for contacts',
          data: null,
          error: { code: 400, details: `entityType=${categoryDoc.entityType}` },
        });
      }
    }

    const existingContact = await Contact.findOne({ number });
    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'Contact already exists',
        data: null,
        error: { code: 400, details: 'Duplicate contact' },
      });
    }

    const newContact = await Contact.create({ number, category: categoryId });
    return res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: newContact,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
      error: { code: 500, details: error.message },
    });
  }
};

// update a contact
const updateContact = async (req, res) => {
  // gettting id from params and number, isActive from body
  const { id } = req.params;
  const { number, category, isActive } = req.body;

  try {
    // optional: normalize a blank/empty category to null
    const categoryId =
      category && String(category).trim().length ? category : null;
    if (categoryId) {
      const categoryDoc = await Category.findById(categoryId);
      if (!categoryDoc) {
        return res.status(400).json({
          success: false,
          message: 'Category not found',
          data: null,
          error: { code: 400, details: 'Invalid category _id' },
        });
      }
      if (
        categoryDoc.entityType !== 'contact' &&
        categoryDoc.entityType !== 'both'
      ) {
        return res.status(400).json({
          success: false,
          message: 'Category is not valid for contacts',
          data: null,
          error: { code: 400, details: `entityType=${categoryDoc.entityType}` },
        });
      }
    }
    // find the contact to update
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
        data: null,
        error: { code: 404, details: 'Contact not found' },
      });
    }

    contact.number = number || contact.number;
    contact.category = category || contact.category;
    contact.isActive = isActive !== undefined ? isActive : contact.isActive;

    await contact.save();
    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
      error: { code: 500, details: error.message },
    });
  }
};

// delete a contact
const deleteContact = async (req, res) => {
  const { id } = req.params;

  // find the contact by id and delete
  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
        data: null,
        error: { code: 404, details: 'Contact not found' },
      });
    }
    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
      data: contact,
      error: null,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: null,
      error: { code: 500, details: error.message },
    });
  }
};

module.exports = {
  getContacts,
  addContact,
  updateContact,
  deleteContact,
};
