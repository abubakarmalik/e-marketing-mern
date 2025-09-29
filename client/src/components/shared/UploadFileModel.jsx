import { useState, useEffect, useRef } from 'react';
import Modal from './DynamicModel';
import * as XLSX from 'xlsx';
import { parseContactsFile } from '../../utils/parseContacts';

export default function UploadFileModel({
  open,
  onClose,
  title = 'Upload Contacts (Excel/CSV)',
  groups = [],
  maxSizeMB = 10,
  existingNumbers = new Set(),
  onSave, // (payload) => void  // optional
}) {
  const [file, setFile] = useState(null);
  const [group, setGroup] = useState(groups[0]?.value ?? '');
  const [error, setError] = useState('');
  const [columns, setColumns] = useState([]);
  const [columnIndex, setColumnIndex] = useState(0);

  const [summary, setSummary] = useState(null); // stats after process
  const [payload, setPayload] = useState(null); // { category, numbers }
  const [isProcessing, setIsProcessing] = useState(false);
  const [processed, setProcessed] = useState(false); // <-- controls which button is visible

  const inputRef = useRef(null);

  // reset state whenever modal opens
  useEffect(() => {
    if (open) {
      setFile(null);
      setGroup(groups[0]?.value ?? '');
      setError('');
      setColumns([]);
      setColumnIndex(0);
      setSummary(null);
      setPayload(null);
      setIsProcessing(false);
      setProcessed(false); // <-- start in "Process" mode
    }
  }, [open, groups]);

  const handlePick = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const ext = '.' + f.name.split('.').pop().toLowerCase();
    if (!['.xlsx', '.xls', '.csv'].includes(ext)) {
      setError('Only .xlsx, .xls, or .csv files are allowed.');
      return;
    }
    if (f.size > maxSizeMB * 1024 * 1024) {
      setError(`Max file size is ${maxSizeMB}MB.`);
      return;
    }
    setError('');
    setFile(f);

    try {
      const buf = await f.arrayBuffer();
      const wb = XLSX.read(buf);
      const sh = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sh, { header: 1 });

      const firstRow = rows?.[0] || [];
      const derived =
        firstRow.length > 0
          ? firstRow.map((h, i) =>
              typeof h === 'string' && h.trim()
                ? h.trim()
                : `Column ${String.fromCharCode(65 + i)}`,
            )
          : ['Column A'];

      setColumns(derived);
      setColumnIndex(0);
    } catch {
      setColumns(['Column A']);
      setColumnIndex(0);
    }
  };

  // PROCESS (only button visible initially)
  const handleProcess = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please choose a file.');
    if (!group) return setError('Please select a group.');

    setIsProcessing(true);
    try {
      const { clean, stats } = await parseContactsFile(
        file,
        existingNumbers,
        columnIndex,
      );
      const pl = { category: group, numbers: clean };
      setSummary(stats);
      setPayload(pl);

      // switch to SAVE mode (hide Process, show Save)
      setProcessed(true);
    } catch {
      setError('Failed to process file.');
      setSummary(null);
      setPayload(null);
      setProcessed(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // SAVE (only visible after processed)
  const handleSave = () => {
    onClose();
    if (!payload) return;
    onSave?.(payload); // wire to API later if you want
  };

  const copyJSON = async () => {
    if (!payload) return;
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
  };
  const downloadJSON = () => {
    if (!payload) return;
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts_payload.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleProcess} className="space-y-5">
        {/* Group */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Group
          </label>
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:border-gray-500 focus:ring-2 focus:ring-gray-300 outline-none"
            disabled={processed} // lock after processing
          >
            {groups.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* File */}
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-center">
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handlePick}
            className="hidden"
            id="upload-contacts-input"
            disabled={processed} // lock after processing
          />
          <label
            htmlFor="upload-contacts-input"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white cursor-pointer ${
              processed
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            Choose File
          </label>
          {file && (
            <div className="mt-3 text-sm text-gray-700">
              {file.name} ({(file.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}
          {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
        </div>

        {/* Number column selector */}
        {columns.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number column
            </label>
            <select
              value={columnIndex}
              onChange={(e) => setColumnIndex(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:border-gray-500 focus:ring-2 focus:ring-gray-300 outline-none"
              disabled={processed} // lock after processing
            >
              {columns.map((name, idx) => (
                <option key={idx} value={idx}>
                  {name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              We’ll read numbers from this column and enforce{' '}
              <code>03XXXXXXXXX</code>.
            </p>
          </div>
        )}

        {/* Summary + JSON actions (shown only after Process) */}
        {processed && summary && (
          <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-700 space-y-2">
            <div className="grid grid-cols-2 gap-y-1">
              <p>
                <span className="font-medium">Valid:</span> {summary.valid}
              </p>
              <p>
                <span className="font-medium">Invalid skipped:</span>{' '}
                {summary.skippedInvalid}
              </p>
              <p>
                <span className="font-medium">Duplicates skipped:</span>{' '}
                {summary.skippedDuplicate}
              </p>
              <p>
                <span className="font-medium">Total rows:</span>{' '}
                {summary.totalRows}
              </p>
            </div>

            {/* ⚠️ Show warning if limit reached */}
            {summary.limitApplied && summary.valid >= summary.limitApplied && (
              <p className="mt-2 text-xs text-amber-600 font-medium">
                ⚠️ Only the first {summary.limitApplied} valid numbers were
                kept. Extra rows beyond this limit were skipped.
              </p>
            )}

            {payload && (
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={copyJSON}
                  className="px-3 py-2 rounded-lg ring-1 ring-gray-300 hover:bg-gray-100"
                >
                  Copy JSON
                </button>
                <button
                  type="button"
                  onClick={downloadJSON}
                  className="px-3 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800"
                >
                  Download JSON
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer — toggle buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg ring-1 ring-gray-300 hover:bg-gray-50 text-gray-700"
          >
            Close
          </button>

          {!processed && (
            <button
              type="submit"
              disabled={!file || isProcessing}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Process'}
            </button>
          )}

          {processed && (
            <button
              type="button"
              onClick={handleSave}
              disabled={!payload}
              className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
            >
              Save
            </button>
          )}
        </div>
      </form>
    </Modal>
  );
}
