import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import {
  fetchCategories,
  addCategory,
  selectCategories,
  fetchContacts,
  selectContacts,
  selectContactsLoading,
  addContact,
  deleteContact,
  updateContact,
  selectContactsPage,
  selectContactsLimit,
  selectContactsTotal,
  selectContactsFrom,
  selectContactsTo,
  selectContactsTotalPages,
  bulkUploadContacts,
} from '../contactSlice';
import TotalContacts from '../../../components/TotalContacts';
import ActiveCard from '../../../components/ActiveCard';
import WrongCard from '../../../components/WrongCard';
import CurrentProcess from '../../../components/CurrentProcess';
import ContactsTable from '../../../components/shared/ContentTable';
import TopBar from '../widgets/TopBar';
import AddContactModal from '../widgets/AddContactModal';
import AddCategoryModel from '../../../components/shared/AddCategoryModel';
import Filters from '../../../components/shared/Filters';
import UploadFileModel from '../../../components/shared/UploadFileModel';
import { parseContactsFile } from '../../../utils/parseContacts';
import WhatsappForm from '../widgets/WhatsappForm';

const Contact = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const contacts = useSelector(selectContacts);
  const contactsLoading = useSelector(selectContactsLoading);
  const page = useSelector(selectContactsPage);
  const limit = useSelector(selectContactsLimit);
  const total = useSelector(selectContactsTotal);
  const from = useSelector(selectContactsFrom);
  const to = useSelector(selectContactsTo);
  const totalPages = useSelector(selectContactsTotalPages);
  // ---------------- UI state ----------------
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All'); // holds categoryId or 'All'
  const [status, setStatus] = useState('All'); // 'All' | 'Active' | 'Inactive'
  const rows = contacts || [];
  const [addOpen, setAddOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [importInfo, setImportInfo] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchContacts({ page, limit: 10 }));
  }, [dispatch, page]);

  const statusData = {
    contacts: {
      value: total,
      updated: new Date().toISOString(),
    },
    correct: {
      title: 'Active Contacts',
      value: 0,
      updated: new Date().toISOString(),
    },
    wrong: {
      title: 'Inactive Contacts',
      value: 0,
      updated: new Date(Date.now() - 3600000).toISOString(),
    },
    process: {
      value: 'Whatsapp Campaign',
      status: 'idle',
      updated: new Date().toISOString(),
    },
  };

  const groupOptions = useMemo(
    () =>
      (categories || []).map((c) => ({
        value: c._id,
        label: c.name,
      })),

    [categories],
  );

  // keep track of numbers already in table (for dedupe)
  const existingNumbers = useMemo(
    () => new Set(rows.map((r) => r.number)),
    [rows],
  );

  const handleSaveCategory = ({ name }) =>
    toast.promise(
      dispatch(addCategory({ name }))
        .unwrap()
        .then(() => dispatch(fetchCategories())),
      {
        loading: 'Adding categoryâ€¦',
        success: 'Category added!',
        error: (e) => e || 'Failed to add category',
      },
    );

  // Optional: debounce query (250ms)
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 250);
    return () => clearTimeout(t);
  }, [query]);

  // Save handler works for both ADD and EDIT based on presence of id
  const handleSaveContact = async ({ id, number, category, status }) => {
    // status is boolean from modal
    if (id) {
      // UPDATE

      return toast.promise(
        dispatch(updateContact({ id, number, category, status }))
          .unwrap()
          .then(() => dispatch(fetchContacts({ page, limit }))),
        {
          loading: 'Updating contactâ€¦',
          success: 'Contact updated!',
          error: (e) => e || 'Failed to update contact',
        },
      );
    }
    // ADD
    return toast.promise(
      dispatch(addContact({ number, category }))
        .unwrap()
        .then(() => dispatch(fetchContacts({ page: 1, limit }))), // after add, go to first page
      {
        loading: 'Saving contactâ€¦',
        success: 'Contact added!',
        error: (e) => e || 'Failed to add contact',
      },
    );
  };

  // ...delete contact:
  const handleDelete = (row) =>
    toast.promise(
      dispatch(deleteContact(row.id))
        .unwrap()
        .then(() => dispatch(fetchContacts({ page, limit }))),
      {
        loading: 'Deletingâ€¦',
        success: 'Contact deleted',
        error: (e) => e || 'Failed to delete contact',
      },
    );
  // â¬‡ï¸ updated main handler

  const handleUploadConfirm = async (payload) => {
    // payload: { category, numbers }
    return toast.promise(
      dispatch(bulkUploadContacts(payload))
        .unwrap()
        .then((data) => {
          // close modal, refresh first page to show newest
          setUploadOpen(false);
          dispatch(fetchContacts({ page: 1, limit }));

          // build a friendly summary from server response
          const s = data?.summary || {};
          const inserted = data?.insertedCount ?? 0;
          const dupDB = data?.duplicatesInDB?.length ?? 0;
          const msg =
            `Imported ${inserted} new contact(s). ` +
            (dupDB ? `${dupDB} duplicate(s) already existed. ` : '') +
            (s.skippedInvalid ? `${s.skippedInvalid} invalid skipped.` : '');
          return msg.trim();
        }),
      {
        loading: 'Importing contactsâ€¦',
        success: (m) => m || 'Contacts imported!',
        error: (e) => e || 'Failed to import contacts',
      },
    );
  };

  //  name lookup for rendering (id -> name)
  const categoryNameById = useMemo(() => {
    const m = {};
    (categories || []).forEach((c) => {
      m[c._id] = c.name;
    });
    return m;
  }, [categories]);

  // ---------------- Filtering ----------------
  const filteredRows = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();

    return rows.filter((r) => {
      const statusStr = r.statusBool ? 'active' : 'inactive';
      const groupName = r.categoryName || categoryNameById[r.categoryId] || '';
      const matchQuery =
        !q ||
        r.number?.toLowerCase?.().includes(q) ||
        groupName.toLowerCase().includes(q) ||
        statusStr.includes(q);

      // filter by category _id
      const matchGroup = group === 'All' || r.categoryId === group;
      // filter by boolean status
      const matchStatus =
        status === 'All' ||
        (status === 'Active' ? r.statusBool === true : r.statusBool === false);

      return matchQuery && matchGroup && matchStatus;
    });
  }, [rows, debouncedQuery, group, status, categoryNameById]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4">
      <TopBar
        onAddContact={() => setAddOpen(true)}
        onAddGroup={() => setAddCategoryOpen(true)}
        onUploadFile={() => setUploadOpen(true)}
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
          groupOptions={[{ value: 'All', label: 'All' }, ...groupOptions]}
        />
      </div>
      <div className="flex flex-row gap-2">
        <div className="basis-1/2 bg-white p-4">
          {contactsLoading ? (
            <div className="p-6 text-sm text-gray-500">Loading contactsâ€¦</div>
          ) : (
            <ContactsTable
              rows={filteredRows.map((r) => ({
                ...r,
                group: r.categoryName || categoryNameById[r.categoryId] || '-',
                status: r.statusBool ? 'Active' : 'Inactive',
              }))}
              onEdit={(row) => {
                // prepare initial values for modal
                setEditingRow({
                  id: row.id,
                  number: row.number,
                  category: row.categoryId, // _id
                  status: row.statusBool, // boolean
                });
                setAddOpen(true);
              }}
              onDelete={handleDelete}
              page={page}
              total={total}
              pageSize={limit}
              from={from}
              to={to}
              totalPages={totalPages}
              onPrev={() =>
                dispatch(fetchContacts({ page: Math.max(1, page - 1), limit }))
              }
              onNext={() =>
                dispatch(
                  fetchContacts({
                    page: Math.min(page + 1, totalPages),
                    limit,
                  }),
                )
              }
            />
          )}
        </div>
        <div className="basis-1/2 bg-white p-4">
          <WhatsappForm groups={groupOptions} />
        </div>
      </div>
      <AddContactModal
        open={addOpen}
        onClose={() => {
          setAddOpen(false);
          setEditingRow(null);
        }}
        onSave={handleSaveContact}
        groups={groupOptions}
        initialValues={editingRow || undefined}
        title={editingRow ? 'Edit Contact' : 'Add Contact'}
        submitLabel={editingRow ? 'Update' : 'Save'}
      />
      <AddCategoryModel
        open={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        onSave={handleSaveCategory}
      />
      <UploadFileModel
        open={uploadOpen}
        groups={groupOptions}
        onClose={() => setUploadOpen(false)}
        onSave={handleUploadConfirm}
        title={'Upload Contacts (Excel/CSV)'}
        existingNumbers={existingNumbers}
      />
    </div>
  );
};

export default Contact;
