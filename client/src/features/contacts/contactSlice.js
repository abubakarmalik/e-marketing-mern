import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCategories,
  addCategoryApi,
  getContacts,
  addContactApi,
  deleteContactApi,
  updateContactApi,
  bulkUploadContactsApi,
} from './api';

const initialState = {
  //category
  categories: [],
  count: 0,
  loading: false,
  creating: false,
  error: null,
  // contacts
  contacts: [],
  contactsCount: 0,
  contactsLoading: false,
  contactsError: null,
  // pagination
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  from: 0,
  to: 0,
  // uploads
  lastImport: null, // server summary of the last upload
  importing: false,
  importError: null,
};

// GET
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getCategories(); // { success, count, data }
      if (!res?.success)
        throw new Error(res?.message || 'Failed to load categories');
      return { list: res.data ?? [], count: res.count ?? 0 };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message ||
          err.message ||
          'Failed to load categories',
      );
    }
  },
);

// ADD
export const addCategory = createAsyncThunk(
  'categories/addOne',
  async ({ name }, { rejectWithValue }) => {
    try {
      const res = await addCategoryApi({ name }); // { success, count, data }
      if (!res?.success)
        throw new Error(res?.message || 'Failed to add category');
      // many APIs return the updated list; if yours returns only the new item, adjust below
      return { list: res.data ?? [], count: res.count ?? 0 };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || err.message || 'Failed to add category',
      );
    }
  },
);

//get contacts
export const fetchContacts = createAsyncThunk(
  'contacts/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const res = await getContacts(params); // { success, count, data, meta }
      if (!res?.success)
        throw new Error(res?.message || 'Failed to load contacts');
      return {
        list: res.data ?? [],
        count: res.count ?? 0,
        meta: res.meta ?? null,
      };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err.message ||
          'Failed to load contacts',
      );
    }
  },
);

// ADD CONTACT
export const addContact = createAsyncThunk(
  'contacts/addOne',
  async ({ number, category }, { rejectWithValue }) => {
    try {
      const res = await addContactApi({ number, category });
      if (!res?.success)
        throw new Error(res?.message || 'Failed to add contact');
      // res.data could be either the new item OR a full list.
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || 'Failed to add contact',
      );
    }
  },
);

// DELETE CONTACT
export const deleteContact = createAsyncThunk(
  'contacts/deleteOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await deleteContactApi(id);
      if (!res?.success)
        throw new Error(res?.message || 'Failed to delete contact');
      return { id };
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err.message ||
          'Failed to delete contact',
      );
    }
  },
);

// UPDATE CONTACT
export const updateContact = createAsyncThunk(
  'contacts/updateOne',
  async ({ id, number, category, status }, { rejectWithValue }) => {
    try {
      // backend expects: { number, category: <_id>, isActive: boolean }
      const res = await updateContactApi(id, {
        number,
        category,
        isActive: status, // <-- map UI boolean to backend field
      });
      if (!res?.success)
        throw new Error(res?.message || 'Failed to update contact');
      return res.data; // either updated item or list
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message ||
          err.message ||
          'Failed to update contact',
      );
    }
  },
);

// BULK UPLOAD
export const bulkUploadContacts = createAsyncThunk(
  'contacts/bulkUpload',
  async ({ category, numbers }, { rejectWithValue }) => {
    try {
      const res = await bulkUploadContactsApi({ category, numbers });
      if (!res?.success) throw new Error(res?.message || 'Bulk upload failed');
      return res.data; // { insertedCount, insertedIds, duplicatesInDB, summary }
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || err.message || 'Bulk upload failed',
      );
    }
  },
);

const slice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (b) => {
    b
      // fetch
      .addCase(fetchCategories.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchCategories.fulfilled, (s, a) => {
        s.loading = false;
        s.categories = a.payload.list;
        s.count = a.payload.count;
      })
      .addCase(fetchCategories.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || 'Failed to load categories';
      })
      // add
      .addCase(addCategory.pending, (s) => {
        s.creating = true;
        s.error = null;
      })
      .addCase(addCategory.fulfilled, (s, a) => {
        s.creating = false;
        // if backend returns full list, replace; if it returns just the new category, push it
        if (Array.isArray(a.payload.list)) {
          s.categories = a.payload.list;
          s.count = a.payload.count;
        } else if (a.payload?.item) {
          s.categories.unshift(a.payload.item);
          s.count += 1;
        }
      })
      .addCase(addCategory.rejected, (s, a) => {
        s.creating = false;
        s.error = a.payload || 'Failed to add category';
      })
      // --- contacts cases ---
      .addCase(fetchContacts.pending, (s) => {
        s.contactsLoading = true;
        s.contactsError = null;
      })
      .addCase(fetchContacts.fulfilled, (s, a) => {
        s.contactsLoading = false;
        s.contacts = normalizeContacts(a.payload.list);
        s.contactsCount = a.payload.count;
        // pull pagination from server meta if available
        const m = a.payload?.meta || {};
        s.page = m.page ?? s.page;
        s.limit = m.limit ?? s.limit;
        s.total = m.total ?? s.contactsCount;
        s.totalPages =
          m.totalPages ??
          Math.ceil(
            (m.total ?? s.contactsCount) / ((m.limit ?? s.limit) || 10),
          );
        s.from = m.from ?? 0;
        s.to = m.to ?? s.contacts.length;
      })
      .addCase(fetchContacts.rejected, (s, a) => {
        s.contactsLoading = false;
        s.contactsError = a.payload || 'Failed to load contacts';
      })

      // --- addContact cases ---
      .addCase(addContact.pending, (s) => {
        s.contactsError = null;
      })
      .addCase(addContact.fulfilled, (s, a) => {
        const payload = a.payload;
        if (Array.isArray(payload)) {
          // backend returned full updated list
          s.contacts = normalizeContacts(payload);
          s.contactsCount = payload.length;
        } else if (payload && typeof payload === 'object') {
          // backend returned just the new contact
          const item = normalizeContact(payload);
          s.contacts.unshift(item);
          s.contactsCount += 1;
        }
      })
      .addCase(addContact.rejected, (s, a) => {
        s.contactsError = a.payload || 'Failed to add contact';
      })
      // --- deleteContact cases ---
      .addCase(deleteContact.pending, (s) => {
        s.contactsError = null;
      })
      .addCase(deleteContact.fulfilled, (s, a) => {
        const { id } = a.payload;
        s.contacts = s.contacts.filter((c) => c.id !== id);
        if (s.contactsCount > 0) s.contactsCount -= 1;
      })
      .addCase(deleteContact.rejected, (s, a) => {
        s.contactsError = a.payload || 'Failed to delete contact';
      })
      // --- updateContact cases ---
      .addCase(updateContact.pending, (s) => {
        s.contactsError = null;
      })
      .addCase(updateContact.fulfilled, (s, a) => {
        const payload = a.payload;
        if (Array.isArray(payload)) {
          s.contacts = normalizeContacts(payload);
          s.contactsCount = payload.length;
          return;
        }
        if (payload && typeof payload === 'object') {
          const updated = normalizeContact(payload);
          s.contacts = s.contacts.map((c) =>
            c.id === updated.id ? updated : c,
          );
        }
      })
      // --- uploadsContacts cases ---
      .addCase(updateContact.rejected, (s, a) => {
        s.contactsError = a.payload || 'Failed to update contact';
      })
      .addCase(bulkUploadContacts.pending, (s) => {
        s.importing = true;
        s.importError = null;
      })
      .addCase(bulkUploadContacts.fulfilled, (s, a) => {
        s.importing = false;
        s.lastImport = a.payload; // keep summary in store (optional for a details view)
      })
      .addCase(bulkUploadContacts.rejected, (s, a) => {
        s.importing = false;
        s.importError = a.payload || 'Bulk upload failed';
      });
  },
});

export default slice.reducer;

// category selectors
export const selectCategories = (state) => state.contacts.categories;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesCreating = (state) => state.categories.creating;

// contact selector
export const selectContacts = (state) => state.contacts.contacts;
export const selectContactsLoading = (state) => state.contacts.contactsLoading;
export const selectContactsCount = (state) => state.contacts.contactsCount;

// --- helpers to normalize contact shape ---
// Expect backend contact:
// { _id, number, category: <id or populated { _id, name }>, status?: boolean, isActive?: boolean }
const normalizeContact = (c) => {
  const cat = c.category;
  const categoryId =
    typeof cat === 'object' && cat !== null ? cat._id || cat.id : cat;
  const categoryName =
    typeof cat === 'object' && cat !== null ? cat.name || cat.label : undefined;
  // Status comes as boolean (preferred), OR string sometimes; normalize to boolean
  let statusBool;
  if (typeof c.status === 'boolean') statusBool = c.status;
  else if (typeof c.isActive === 'boolean') statusBool = c.isActive;
  else statusBool = String(c.status || '').toLowerCase() === 'active';

  return {
    id: c.id || c._id || c.contactId,
    number: c.number,
    categoryId: categoryId || null,
    categoryName,
    statusBool: Boolean(statusBool),
  };
};
const normalizeContacts = (list) => list.map(normalizeContact);

export const selectContactsPage = (state) => state.contacts.page;
export const selectContactsLimit = (state) => state.contacts.limit;
export const selectContactsTotal = (state) => state.contacts.total;
export const selectContactsTotalPages = (state) => state.contacts.totalPages;
export const selectContactsFrom = (state) => state.contacts.from;
export const selectContactsTo = (state) => state.contacts.to;
