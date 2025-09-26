import React from 'react';

const StatusBadge = ({ value }) => {
  const isActive = value?.toLowerCase() === 'active';
  const base =
    'inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full';
  return (
    <span
      className={
        isActive
          ? `${base} bg-green-50 text-green-700 ring-1 ring-green-200`
          : `${base} bg-purple-50 text-purple-700 ring-1 ring-purple-200`
      }
    >
      <span
        className={
          'h-1.5 w-1.5 rounded-full ' +
          (isActive ? 'bg-green-500' : 'bg-purple-500')
        }
      />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
};

const IconButton = ({ title, variant = 'edit', onClick }) => {
  const base =
    'inline-flex items-center justify-center h-8 w-8 rounded-lg transition-colors';
  const styles =
    variant === 'edit'
      ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 ring-1 ring-blue-200'
      : 'bg-rose-50 text-rose-600 hover:bg-rose-100 ring-1 ring-rose-200';
  return (
    <button className={`${base} ${styles}`} title={title} onClick={onClick}>
      {/* Edit icon */}
      {variant === 'edit' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M15.232 5.232l3.536 3.536M4 20h4.586a1 1 0 00.707-.293l9.9-9.9a2 2 0 000-2.828l-1.172-1.172a2 2 0 00-2.828 0l-9.9 9.9A1 1 0 004 15.414V20z" />
        </svg>
      ) : (
        // Trash icon
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-1-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2" />
        </svg>
      )}
    </button>
  );
};

export default function ContactsTable({
  rows = [],
  onEdit = () => {},
  onDelete = () => {},
  page = 1,
  total = 0,
  pageSize = 10,
  from = 0,
  to = 0,
  totalPages = Math.ceil(total / (pageSize || 10)), // optional prop
  onPrev = () => {},
  onNext = () => {},
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Table header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/60">
        <h3 className="text-sm font-semibold text-gray-800">Contacts</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="px-4 py-3 w-20">Sr No.</th>
              <th className="px-4 py-3">Number</th>
              <th className="px-4 py-3">Group</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Edit</th>
              <th className="px-4 py-3 text-center">Delete</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-gray-500"
                >
                  No contacts found.
                </td>
              </tr>
            ) : (
              rows.map((r, idx) => (
                <tr
                  key={r.id ?? idx}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-gray-700">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {r.number}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{r.group}</td>
                  <td className="px-4 py-3">
                    <StatusBadge value={r.status} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <IconButton
                      title="Edit"
                      variant="edit"
                      onClick={() => onEdit(r)}
                    />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <IconButton
                      title="Delete"
                      variant="delete"
                      onClick={() => onDelete(r)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer (optional: simple pagination placeholder) */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 text-xs text-gray-500">
        <span>
          {total > 0
            ? `Showing ${from}–${to} of ${total}`
            : `Showing 0 results`}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="px-2.5 py-1 rounded-lg ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50"
            onClick={onPrev}
            disabled={page <= 1}
          >
            Previous
          </button>
          <span className="min-w-[4rem] text-center">Page {page}</span>
          <button
            className="px-2.5 py-1 rounded-lg ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50"
            onClick={onNext}
            disabled={page >= totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
