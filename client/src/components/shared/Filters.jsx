import { useState } from 'react';
import Searchbar from '../Searchbar';
import SelectOptions from '../SelectOptions';

const Filters = ({
  query,
  onQueryChange,
  group,
  onGroupChange,
  status,
  onStatusChange,
  groupOptions = [],
}) => {
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
      <SelectOptions
        options={groupOptions}
        value={group}
        onChange={onGroupChange}
      />
      <SelectOptions
        options={statuses}
        value={status}
        onChange={onStatusChange}
      />
    </div>
  );
};

export default Filters;
