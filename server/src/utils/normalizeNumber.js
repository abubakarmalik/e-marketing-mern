function normalizeNumber(raw) {
  if (raw === null || raw === undefined) return null;
  let s = String(raw).trim().replace(/\D/g, '');
  if (s.length === 10 && s.startsWith('3')) s = '0' + s;
  return s || null;
}

module.exports = { normalizeNumber };
