import React from 'react';
import { FaUsers } from 'react-icons/fa';

const TotalContacts = ({ value = '0', updated = '' }) => (
  <div className="rounded-xl border bg-blue-50 border-blue-200 p-6 min-h-[170px] shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-2 mb-2">
      <FaUsers className="w-6 h-6 text-blue-500" />
      <span className="font-semibold text-lg text-blue-700">
        Total Contacts
      </span>
    </div>
    <div className="text-3xl font-bold text-blue-700 mb-1">{value}</div>
    <div className="text-xs text-gray-500 mt-2">Last updated: {updated}</div>
  </div>
);

export default TotalContacts;
