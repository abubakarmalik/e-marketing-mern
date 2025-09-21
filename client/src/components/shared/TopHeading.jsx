import React from 'react';

const TopHeading = ({ heading, subheading }) => {
  return (
    <div className="flex flex-col justify-start px-4 py-2">
      <h1 className="font-bold text-2xl text-black">{heading}</h1>
      <h2 className="text-md text-gray-500">{subheading}</h2>
    </div>
  );
};

export default TopHeading;
