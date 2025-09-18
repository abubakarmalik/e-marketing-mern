const { z } = require('zod');

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(20).trim(),
});

module.exports = { categorySchema };
