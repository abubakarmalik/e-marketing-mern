import React from 'react';
import { FaSpinner } from 'react-icons/fa';
import { MdOutlineDoNotDisturb } from 'react-icons/md';

const CurrentProcess = ({ value = '', updated = '', status = '' }) => (
  <div className="rounded-xl border bg-orange-50 border-orange-200 p-6 min-h-[170px] shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        {status === 'active' ? (
          <FaSpinner className={'w-6 h-6 text-orange-500 animate-spin '} />
        ) : (
          <MdOutlineDoNotDisturb className="w-6 h-6 text-orange-500" />
        )}

        <span className="font-semibold text-lg text-orange-700">
          Active Process
        </span>
      </div>
      {status === 'active' ? (
        <span className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full font-medium bg-green-100 text-green-800">
          <span className="h-2 w-2 rounded-full bg-green-400"></span>
          {status}
        </span>
      ) : (
        <span className="inline-flex items-center gap-2 px-3 py-1 text-xs rounded-full font-medium bg-orange-100 text-orange-700">
          <span className="h-2 w-2 rounded-full bg-orange-600"></span>
          {status}
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-orange-700 mb-1">{value}</div>
    <div className="text-xs text-gray-500 mt-2">Last updated: {updated}</div>
  </div>
);

export default CurrentProcess;
