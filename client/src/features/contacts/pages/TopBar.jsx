import React from 'react';
import TopHeading from '../../../components/TopHeading';
import AddButton from '../../../components/AddButton';

const TopBar = () => {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 bg-white px-4 py-4 mb-4">
      <TopHeading
        heading="Contacts Administration"
        subheading="Manage your contacts you can add, edit or delete contacts"
      />
      <AddButton />
    </div>
  );
};

export default TopBar;
