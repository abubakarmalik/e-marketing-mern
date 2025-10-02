const express = require('express');
const { requireAuth } = require('../../middlewares/auth');
const {
  waStatus,
  waLink,
  waUnlink,
} = require('../../controllers/setting-controller/whatsapp.controller');

const router = express.Router();

// GET /api/settings/whatsapp/link  -> start client, return { status, qr? }
router.get('/whatsapp/link', requireAuth, waLink);

// GET /api/settings/whatsapp/status -> poll state (PAIRING with qr or READY)
router.get('/whatsapp/status', requireAuth, waStatus);

// POST /api/settings/whatsapp/unlink -> logout + clear session
router.post('/whatsapp/unlink', requireAuth, waUnlink);

module.exports = router;
