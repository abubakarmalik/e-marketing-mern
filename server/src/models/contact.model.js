const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: (v) => /^\d{11}$/.test(v),
        message: (props) =>
          `${props.value} is not a valid 11-digit phone number!`,
      },
    },
    sendStatus: {
      type: Number,
      enum: [0, 1, 2],
      default: 0,
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    note: { type: String, trim: true, default: '' },
    lastMessageDate: { type: Date, default: null },
    source: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);

// Normalize number once (strip spaces, ensure leading + if already valid)
contactSchema.pre('save', function (next) {
  if (this.isModified('number') && this.number) {
    const cleaned = this.number.replace(/\s+/g, '');
    this.number = cleaned.startsWith('+') ? cleaned : cleaned;
  }
  next();
});

// Validate that if a category is provided it is appropriate for contacts
contactSchema.pre('validate', async function (next) {
  if (!this.category) return next();
  try {
    const Category = require('./category.model');
    const cat = await Category.findById(this.category).lean();
    if (!cat) return next(new Error('Category not found'));
    if (cat.entityType !== 'contact' && cat.entityType !== 'both') {
      return next(new Error('Category is not valid for contacts'));
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Indexes
contactSchema.index({ number: 1 }, { unique: true }); // prevent duplicates
contactSchema.index({ category: 1, isActive: 1, sendStatus: 1 }); // common broadcast filter
contactSchema.index({ lastMessageDate: -1 });

module.exports = mongoose.model('Contact', contactSchema);
