import React from 'react';

const Searchbar = ({ value, onChange, placeholder = 'Search ' }) => {
  return (
    <div className="relative flex-1 ">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-gray-500 focus:ring-2 focus:ring-gray-300 outline-none transition-all duration-300"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z"
        />
      </svg>
    </div>
  );
};

export default Searchbar;
