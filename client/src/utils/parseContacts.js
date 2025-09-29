import * as XLSX from 'xlsx';

const PAK_PHONE_REGEX = /^03\d{9}$/;

export function normalizeMsisdn(raw) {
  if (raw === null || raw === undefined) return null;
  let s = String(raw).trim().replace(/\D/g, '');
  if (s.length === 10 && s.startsWith('3')) s = '0' + s; // add leading 0
  return PAK_PHONE_REGEX.test(s) ? s : null;
}

/**
 * @param {File} file
 * @param {Set<string>} existingNumbers
 * @param {number} columnIndex
 * @param {number} limit default = 1000
 */
export async function parseContactsFile(
  file,
  existingNumbers = new Set(),
  columnIndex = 0,
  limit = 1000,
) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

  const seen = new Set();
  const already = new Set(existingNumbers);

  let totalRows = 0,
    valid = 0,
    skippedInvalid = 0,
    skippedDuplicate = 0;
  const clean = [];

  for (const row of rows) {
    totalRows++;
    const candidate = row?.[columnIndex];
    const normalized = normalizeMsisdn(candidate);

    if (!normalized) {
      skippedInvalid++;
      continue;
    }
    if (seen.has(normalized) || already.has(normalized)) {
      skippedDuplicate++;
      continue;
    }

    // ✅ enforce limit
    if (clean.length < limit) {
      seen.add(normalized);
      clean.push(normalized);
      valid++;
    } else {
      // skip extra rows silently after 1000
      break;
    }
  }

  return {
    clean,
    stats: {
      totalRows,
      valid,
      skippedInvalid,
      skippedDuplicate,
      limitApplied: limit,
    },
  };
}
