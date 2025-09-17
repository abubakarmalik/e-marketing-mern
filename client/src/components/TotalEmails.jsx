import React from 'react';
import { FaEnvelope } from 'react-icons/fa';

const TotalEmails = ({ value = '0', updated = '' }) => (
  <div className="rounded-xl border bg-green-50 border-green-200 p-6 min-h-[170px] shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center gap-2 mb-2">
      <FaEnvelope className="w-6 h-6 text-green-500" />
      <span className="font-semibold text-lg text-green-700">Total Emails</span>
    </div>
    <div className="text-3xl font-bold text-green-700 mb-1">{value}</div>
    <div className="text-xs text-gray-500 mt-2">Last updated: {updated}</div>
  </div>
);

export default TotalEmails;
