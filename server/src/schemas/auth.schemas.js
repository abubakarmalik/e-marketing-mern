const { z } = require('zod');

// validation schemas for user input
const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters')
    .trim(),
  username: z
    .string()
    .min(2, 'Username must be at least 2 characters')
    .max(100, 'Username cannot exceed 100 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers and underscore',
    )
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
});

// login schema
const loginSchema = z.object({
  username: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-zA-Z0-9_]+$/)
    .trim(),
  password: z
    .string()
    .min(6)
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
});

module.exports = { loginSchema, registerSchema };
