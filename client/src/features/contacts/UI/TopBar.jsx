import React from 'react';
import TopHeading from '../../../components/TopHeading';
import Button from '../../../components/Button';

const TopBar = ({ onAddContact, onAddGroup }) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 bg-white px-4 py-4 mb-4">
      <TopHeading
        heading="Contacts Administration"
        subheading="Manage your contacts you can add, edit or delete contacts"
      />
      <div className="flex-col">
        <Button label="Add Contact" onClick={onAddContact} />
        <Button label="Add Group" onClick={() => console.log('Add Group')} />
      </div>
    </div>
  );
};

export default TopBar;
