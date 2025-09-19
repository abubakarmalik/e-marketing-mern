import React from 'react';

const SelectOptions = ({
  options = [],
  value,
  onChange,
  className = 'w-38',
}) => {
  return (
    <div className="">
      <div className="flex w-full max-w-2xl rounded-2xl shadow-lg border border-gray-200 bg-white overflow-hidden">
        {/* Select Dropdown */}
        <select
          value={String(value)}
          onChange={(e) => onChange?.(e.target.value)}
          className="px-4 py-3 bg-gray-50 text-gray-700 border-r border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all duration-200"
        >
          {options.map((opt, i) => (
            <option key={i} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectOptions;
