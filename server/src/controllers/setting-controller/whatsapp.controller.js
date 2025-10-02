const { requestLink, getStatus, unlink } = require('../../services/wa.service');

async function waStatus(_req, res) {
  try {
    const s = await getStatus();
    return res.json({ success: true, data: s, error: null });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to get WhatsApp status',
      data: null,
      error: { code: 500, details: err.message },
    });
  }
}

async function waLink(_req, res) {
  try {
    const s = await requestLink(); // { linked, status, number, qr? }
    return res.json({
      success: true,
      message: s.linked ? 'Already linked' : s.qr ? 'Scan QR' : 'Starting…',
      data: s,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to start WhatsApp link',
      data: null,
      error: { code: 500, details: err.message },
    });
  }
}

async function waUnlink(_req, res) {
  try {
    const s = await unlink();
    return res.json({
      success: true,
      message: 'WhatsApp unlinked',
      data: s,
      error: null,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to unlink WhatsApp',
      data: null,
      error: { code: 500, details: err.message },
    });
  }
}

module.exports = { waStatus, waLink, waUnlink };
