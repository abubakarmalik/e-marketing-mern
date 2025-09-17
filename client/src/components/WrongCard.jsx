import React from 'react';
import { MdGroupOff } from 'react-icons/md';

const WrongCard = ({ title, value, updated }) => {
  return (
    <>
      <div className="rounded-xl border bg-purple-50 border-purple-200 p-6 min-h-[170px] shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-2">
          <MdGroupOff className="w-6 h-6 text-purple-500" />
          <span className="font-semibold text-lg text-purple-700">{title}</span>
        </div>
        <div className="text-3xl font-bold text-purple-700 mb-1">{value}</div>
        <div className="text-xs text-gray-500 mt-2">
          Last updated: {updated}
        </div>
      </div>
    </>
  );
};

export default WrongCard;
