const express = require('express');
const { login } = require('../../controllers/auth-controllers/auth.controller');
const router = express.Router();

router.post('/login', login);

module.exports = router;
