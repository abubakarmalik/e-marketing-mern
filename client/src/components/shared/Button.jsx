import React from 'react';

const Button = ({ label = '', onClick }) => {
  return (
    <div className="flex justify-end px-2 py-1">
      <button
        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded w-full"
        onClick={onClick}
      >
        {label}
      </button>
    </div>
  );
};

export default Button;
