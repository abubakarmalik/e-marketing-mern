// models/Category.js
const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true, index: true },
    entityType: {
      type: String,
      enum: ['contact', 'email', 'both'],
      default: 'contact',
      index: true,
    },
  },
  { timestamps: true },
);

// helpful index
categorySchema.index({ isActive: 1 });

module.exports = mongoose.model('Category', categorySchema);
