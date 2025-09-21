import { useState, useEffect, useMemo } from 'react';
import TotalContacts from '../../../components/TotalContacts';
import ActiveCard from '../../../components/ActiveCard';
import WrongCard from '../../../components/WrongCard';
import CurrentProcess from '../../../components/CurrentProcess';
import ContactsTable from '../../../components/shared/ContentTable';
import TopBar from '../widgets/TopBar';
import AddContactModal from '../widgets/AddContactModal';
import AddCategoryModel from '../../../components/shared/AddCategoryModel';
import Filters from '../../../components/shared/Filters';
import UploadSheet from '../../../components/shared/UploadSheet';

const Contact = () => {
  const statusData = {
    contacts: {
      value: '2,345',
      updated: new Date().toISOString(),
    },
    correct: {
      title: 'Active Contacts',
      value: '1734',
      updated: new Date().toISOString(),
    },
    wrong: {
      title: 'Inactive Contacts',
      value: 2345 - 1734,
      updated: new Date(Date.now() - 3600000).toISOString(),
    },
    process: {
      value: 'Whatsapp Campaign',
      status: 'idle',
      updated: new Date().toISOString(),
    },
  };

  const allRows = [
    { id: 1, number: '03068824576', group: 'Office', status: 'Active' },
    { id: 2, number: '03068783212', group: 'Social', status: 'Inactive' },
    { id: 3, number: '03068783233', group: 'General', status: 'Active' },
  ];

  const groupOptions = [
    { value: 'All', label: 'All' },
    { value: 'Social', label: 'Social' },
    { value: 'Ofice', label: 'Office' },
    { value: 'General', label: 'General' },
  ];
  // ---------------- UI state ----------------
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All');
  const [status, setStatus] = useState('All');
  const [rows, setRows] = useState(allRows);
  const [addOpen, setAddOpen] = useState(false);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);

  const handleSaveCategory = async ({ name }) => {
    setCategories((prev) => [...prev, name]);
  };

  // Optional: debounce query (250ms)
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  const handleSaveContact = async ({ number, group, status }) => {
    setRows((prev) => [{ id: Date.now(), number, group, status }, ...prev]);
  };

  // ---------------- Filtering ----------------
  const filteredRows = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    return allRows.filter((r) => {
      const matchQuery =
        !q ||
        r.number.toLowerCase().includes(q) ||
        (r.group ?? '').toLowerCase().includes(q) ||
        (r.status ?? '').toLowerCase().includes(q);

      const matchGroup = group === 'All' || r.group === group;
      const matchStatus = status === 'All' || r.status === status;

      return matchQuery && matchGroup && matchStatus;
    });
  }, [allRows, debouncedQuery, group, status]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <TopBar
        onAddContact={() => setAddOpen(true)}
        onAddGroup={() => setAddCategoryOpen(true)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-4">
        <TotalContacts type="contacts" {...statusData.contacts} />
        <ActiveCard type="correct" {...statusData.correct} />
        <WrongCard type="wrong" {...statusData.wrong} />
        <CurrentProcess type="process" {...statusData.process} />
      </div>
      <div className="mb-8">
        <Filters
          query={query}
          onQueryChange={setQuery}
          group={group}
          onGroupChange={setGroup}
          status={status}
          onStatusChange={setStatus}
        />
      </div>
      <div className="flex flex-row gap-2">
        <div className="basis-1/2 bg-white p-4">
          <ContactsTable
            rows={filteredRows}
            onEdit={(row) => console.log('Edit', row)}
            onDelete={(row) => console.log('Delete', row)}
          />
          ;
        </div>
        <div className="basis-1/2 bg-white p-4">
          <UploadSheet />
        </div>
      </div>
      <AddContactModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={handleSaveContact}
        groups={groupOptions}
      />
      <AddCategoryModel
        open={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default Contact;
