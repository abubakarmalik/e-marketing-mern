const { z } = require('zod');

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(20).trim(),
});

const contactSchema = z.object({
  number: z
    .string()
    .length(11, 'Contact number must be exactly 11 digits')
    .regex(/^\d+$/, 'Contact number must be a valid number')
    .trim(),
  category: z.string().trim().min(1, 'Category Id is required').max(100),
  isActive: z.boolean().optional(),
});

module.exports = { categorySchema, contactSchema };
