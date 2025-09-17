import React from 'react';
import { FaBroadcastTower } from 'react-icons/fa';

const LastBroadcast = ({ value = '0', updated = '', status = '' }) => (
  <div className="rounded-xl border bg-purple-50 border-purple-200 p-6 min-h-[170px] shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <FaBroadcastTower className="w-6 h-6 text-purple-500" />
        <span className="font-semibold text-lg text-purple-700">
          Last Broadcast
        </span>
      </div>
      {status && (
        <span className="px-3 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800">
          {status}
        </span>
      )}
    </div>
    <div className="text-3xl font-bold text-purple-700 mb-1">{value}</div>
    <div className="text-xs text-gray-500 mt-2">Last updated: {updated}</div>
  </div>
);

export default LastBroadcast;
