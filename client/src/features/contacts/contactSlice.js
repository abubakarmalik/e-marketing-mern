// src/features/contacts/contactSlice.js  (or make src/features/categories/categorySlice.js)
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCategories, addCategoryApi } from './api';

const initialState = {
  categories: [],
  count: 0,
  loading: false,
  creating: false,
  error: null,
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

const slice = createSlice({
  name: 'categories',
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
      });
  },
});

export default slice.reducer;

// selectors
export const selectCategories = (state) => state.categories.categories;
export const selectCategoriesLoading = (state) => state.categories.loading;
export const selectCategoriesCreating = (state) => state.categories.creating;
