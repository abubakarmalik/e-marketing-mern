import { useState, useEffect } from 'react';
import Modal from '../../../components/DynamicModel';

const phoneRegex = /^03\d{9}$/;

export default function AddContactModal({
  open,
  onClose,
  onSave,
  groups = [],
}) {
  const [form, setForm] = useState({
    group: groups[0]?.value ?? 'Office',
    number: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({ group: groups[0]?.value ?? 'Office', number: '' });
      setErrors({});
      setSubmitting(false);
    }
  }, [open, groups]);

  const validate = () => {
    const e = {};
    if (!form.group) e.group = 'Please select a group.';
    if (!form.number.trim()) e.number = 'Number is required.';
    else if (!phoneRegex.test(form.number.trim()))
      e.number = 'Enter a valid phone number.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await onSave?.({
        number: form.number.trim(),
        group: form.group,
        status: 'Active', // default; adjust if needed
      });
      onClose?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Contact">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Group
          </label>
          <select
            className={`w-full px-3 py-2 rounded-lg border ${
              errors.group
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-300'
                : 'border-gray-300 focus:border-gray-500 focus:ring-gray-300'
            } bg-white outline-none ring-2 ring-transparent transition`}
            value={form.group}
            onChange={(e) => setForm((f) => ({ ...f, group: e.target.value }))}
          >
            {groups.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
          {errors.group && (
            <p className="mt-1 text-xs text-rose-600">{errors.group}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Enter Number
          </label>
          <div className="relative">
            <input
              type="tel"
              inputMode="tel"
              placeholder="e.g. 03001234567"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.number
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-300'
                  : 'border-gray-300 focus:border-gray-500 focus:ring-gray-300'
              } outline-none ring-2 ring-transparent transition`}
              value={form.number}
              onChange={(e) =>
                setForm((f) => ({ ...f, number: e.target.value }))
              }
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M22 16.92V21a1 1 0 01-1.09 1A19.91 19.91 0 013 4.09 1 1 0 014 3h4.09a1 1 0 011 .75l1 3a1 1 0 01-.29 1L8.21 9.79a16 16 0 007 7l1-1.59a1 1 0 011-.29l3 .99a1 1 0 01.79 1z"
              />
            </svg>
          </div>
          {errors.number && (
            <p className="mt-1 text-xs text-rose-600">{errors.number}</p>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg ring-1 ring-gray-300 hover:bg-gray-50 text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
