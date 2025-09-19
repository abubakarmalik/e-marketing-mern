import { useState } from 'react';
import Searchbar from './Searchbar';
import SelectOptions from './SelectOptions';

const Filters = ({
  query,
  onQueryChange,
  group,
  onGroupChange,
  status,
  onStatusChange,
}) => {
  const groups = [
    { value: 'All', label: 'All' },
    { value: 'Social', label: 'Social' },
    { value: 'Ofice', label: 'Office' },
    { value: 'General', label: 'General' },
  ];
  const statuses = [
    { value: 'All', label: 'All' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  return (
    <div className="flex items-center space-x-3 w-full">
      <Searchbar
        value={query}
        onChange={onQueryChange}
        placeholder="Search numbers by status, group and number..."
      />
      <SelectOptions options={groups} value={group} onChange={onGroupChange} />
      <SelectOptions
        options={statuses}
        value={status}
        onChange={onStatusChange}
      />
    </div>
  );
};

export default Filters;
