const mongoose = require('mongoose');

const SEND_STATUS = Object.freeze({
  PENDING: 0,
  SENT: 1,
  FAILED: 2,
});

const emailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\S+@\S+\.\S+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    sendStatus: {
      type: Number,
      enum: Object.values(SEND_STATUS),
      default: SEND_STATUS.PENDING,
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true,
    },
    note: { type: String, trim: true },
    lastSentDate: { type: Date, default: null },
    source: { type: String, trim: true },
  },
  { timestamps: true },
);

// Validate category is appropriate for emails
emailSchema.pre('validate', async function (next) {
  if (!this.category) return next();
  try {
    const Category = require('./category.model');
    const cat = await Category.findById(this.category).lean();
    if (!cat) return next(new Error('Category not found'));
    if (cat.entityType !== 'email' && cat.entityType !== 'both') {
      return next(new Error('Category is not valid for emails'));
    }
    next();
  } catch (err) {
    next(err);
  }
});

// Indexes
emailSchema.index({ email: 1 }, { unique: true });
emailSchema.index({ category: 1, isActive: 1, sendStatus: 1 });

Object.assign(emailSchema.statics, { SEND_STATUS });

module.exports = mongoose.model('Email', emailSchema);
