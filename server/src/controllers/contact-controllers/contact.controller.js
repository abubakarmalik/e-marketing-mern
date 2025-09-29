const Contact = require('../../models/contact.model');
const Category = require('../../models/category.model');
const { normalizeNumber } = require('../../utils/normalizeNumber');

// get all contacts (paginated)
const getContacts = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit, 10) || 10, 1);
    const skip = (page - 1) * limit;

    const [contacts, total] = await Promise.all([
      Contact.find()
        .sort({ createdAt: -1 }) // optional, but nice
        .skip(skip)
        .limit(limit),
      Contact.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
      error: null,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        from: total === 0 ? 0 : skip + 1,
        to: skip + contacts.length,
      },
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

// upload bulk contacts
const bulkAddContacts = async (req, res) => {
  try {
    const { category, numbers } = req.body || {};
    console.log(req.body);

    if (!Array.isArray(numbers)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload: 'numbers' must be an array",
        data: null,
        error: { code: 400, details: 'numbers must be an array' },
      });
    }

    // ---- Category validation (same semantics as addContact) ----
    const categoryId =
      category && String(category).trim().length ? category : null;

    if (categoryId) {
      const categoryDoc = await Category.findById(categoryId).lean();
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

    // ---- Normalize + dedupe within upload; cap to 1000 valid entries ----
    const LIMIT = 1000;
    const seen = new Set();
    const clean = [];
    let skippedInvalid = 0;

    for (const raw of numbers) {
      const normalized = normalizeNumber(raw);
      // Let schema do the strict 11-digit check.
      // We still skip blatantly empty normalization results to save DB work.
      if (!normalized) {
        skippedInvalid++;
        continue;
      }
      if (seen.has(normalized)) continue; // dedupe inside this payload
      seen.add(normalized);
      clean.push(normalized);
      if (clean.length >= LIMIT) break; // apply server-side cap
    }

    if (clean.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No valid-looking numbers to insert after normalization',
        data: {
          insertedCount: 0,
          insertedIds: [],
          duplicatesInDB: [],
          summary: {
            totalReceived: numbers.length,
            validAfterNormalize: 0,
            validCapped: 0,
            skippedInvalid,
            skippedDuplicateInUpload: numbers.length - skippedInvalid - 0, // rough (schema will be final guard)
            skippedDuplicateInDB: 0,
            limitApplied: LIMIT,
          },
        },
        error: null,
      });
    }

    // ---- De-dupe vs DB in one query ----
    const existing = await Contact.find({ number: { $in: clean } })
      .select('number')
      .lean();
    const existingSet = new Set(existing.map((d) => d.number));

    const toInsert = clean.filter((n) => !existingSet.has(n));
    const duplicatesInDB = clean.filter((n) => existingSet.has(n));

    // ---- Bulk insert; let schema enforce 11 digits + unique index ----
    let insertedDocs = [];
    if (toInsert.length > 0) {
      try {
        insertedDocs = await Contact.insertMany(
          toInsert.map((number) => ({
            number, // schema validates /^\d{11}$/
            category: categoryId, // same semantics as single addContact
            isActive: true, // default active (matches your model field name)
          })),
          { ordered: false }, // continue past duplicates/validation errors
        );
      } catch (e) {
        // insertMany with { ordered:false } continues on errors.
        // Some docs may still be inserted. We won’t fail the whole request.
        // If needed, you can inspect e.writeErrors here.
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Bulk contacts processed',
      data: {
        insertedCount: insertedDocs.length,
        insertedIds: insertedDocs.map((d) => d._id),
        duplicatesInDB, // numbers that already existed
        summary: {
          totalReceived: numbers.length,
          validAfterNormalize: clean.length,
          validCapped: clean.length, // already capped above
          inserted: insertedDocs.length,
          skippedInvalid, // normalization yielded nothing (e.g., non-digits)
          skippedDuplicateInUpload:
            clean.length + skippedInvalid < numbers.length
              ? numbers.length - (clean.length + skippedInvalid)
              : 0,
          skippedDuplicateInDB: duplicatesInDB.length,
          limitApplied: LIMIT,
        },
      },
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Bulk add failed',
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
  bulkAddContacts,
};
