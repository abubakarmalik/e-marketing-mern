// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    isActive: { type: Boolean, default: true },
    entityType: {
      type: String,
      enum: ['contact', 'email', 'both'],
      default: 'contact',
      index: true,
    },
  },
  { timestamps: true },
);

// helpful indexes
categorySchema.index({ parent: 1 });
categorySchema.index({ isActive: 1 });

// prevent self/loop parent
categorySchema.pre('save', async function (next) {
  if (!this.parent) return next();
  if (this._id?.equals?.(this.parent)) {
    return next(new Error('Category cannot be its own parent.'));
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
