const express = require('express');
const {
  login,
  register,
  logout,
} = require('../../controllers/auth-controllers/auth.controller');
const { loginSchema, registerSchema } = require('../../schemas/auth.schemas');
const { validate } = require('../../middlewares/validateRequest');
const { requireAuth } = require('../../middlewares/auth');

const router = express.Router();

router.post('/login', validate(loginSchema), login);
router.post('/register', validate(registerSchema), register);
router.post('/logout', requireAuth, logout);

module.exports = router;
