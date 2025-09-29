import { useState, useEffect } from 'react';
import {
  addCategory,
  fetchCategories,
} from '../../features/contacts/contactSlice';
import Modal from './DynamicModel';
import { toast } from 'react-hot-toast';

export default function AddCategoryModel({ open, onClose, onSave }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName('');
      setError('');
      setSubmitting(false);
    }
  }, [open]);

  const validate = () => {
    if (!name.trim()) {
      setError('Category name is required.');
      return false;
    }
    if (name.trim().length < 3) {
      setError('Category name must be at least 3 characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      await onSave?.({ name: name.trim() });
      onClose?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Group">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Category Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Group Name
          </label>
          <input
            type="text"
            placeholder="e.g. Office"
            className={`w-full px-3 py-2 rounded-lg border ${
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-300'
                : 'border-gray-300 focus:border-gray-500 focus:ring-gray-300'
            } outline-none ring-2 ring-transparent transition`}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
        </div>

        {/* Actions */}
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
