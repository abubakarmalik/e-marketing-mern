import React from 'react';
import TopHeading from '../../../components/shared/TopHeading';
import Button from '../../../components/shared/Button';

const TopBar = ({ onAddContact, onAddGroup, onUploadFile }) => {
  return (
    <div className="flex justify-between items-center border-b border-gray-200 bg-white px-4 py-4 mb-4">
      <TopHeading
        heading="Contacts Administration"
        subheading="Manage your contacts you can add, edit or delete contacts"
      />

      <div className="flex">
        <Button label="Add Contact" onClick={onAddContact} />
        <Button label="Create Group" onClick={onAddGroup} />
        <Button label="Upload Contacts" onClick={onUploadFile} />
      </div>
    </div>
  );
};

export default TopBar;
