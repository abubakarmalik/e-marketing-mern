import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiWaLink, apiWaStatus, apiWaUnlink } from './api';

const initialState = {
  linked: false,
  number: null,
  status: 'UNLINKED', // UNLINKED | PAIRING | READY
  qr: null, // data url
  loading: false,
  error: null,
};

export const linkWhatsapp = createAsyncThunk(
  'settings/waLink',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiWaLink(); // { success, data:{ linked, status, number, qr? } }
      if (!res?.success)
        throw new Error(res?.message || 'Failed to start link');
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || e.message);
    }
  },
);

export const fetchWaStatus = createAsyncThunk(
  'settings/waStatus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiWaStatus();
      if (!res?.success)
        throw new Error(res?.message || 'Failed to fetch status');
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || e.message);
    }
  },
);

export const unlinkWhatsapp = createAsyncThunk(
  'settings/waUnlink',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiWaUnlink();
      if (!res?.success) throw new Error(res?.message || 'Failed to unlink');
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.response?.data?.message || e.message);
    }
  },
);

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearQr: (s) => {
      s.qr = null;
    },
  },
  extraReducers: (b) => {
    b
      // LINK
      .addCase(linkWhatsapp.pending, (s) => {
        s.loading = true;
        s.error = null;
        s.status = 'PAIRING'; // IMPORTANT: show waiting + enable polling immediately
        s.qr = null;
      })
      .addCase(linkWhatsapp.fulfilled, (s, a) => {
        s.loading = false;
        const d = a.payload || {};
        s.linked = !!d.linked;
        s.status = d.status ?? s.status;
        s.number = d.number ?? s.number;
        s.qr = d.qr ?? null;
      })
      .addCase(linkWhatsapp.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
        s.status = 'UNLINKED';
        s.qr = null;
      })

      // STATUS
      .addCase(fetchWaStatus.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchWaStatus.fulfilled, (s, a) => {
        s.loading = false;
        const d = a.payload || {};
        s.linked = !!d.linked;
        s.status = d.status ?? s.status;
        s.number = d.number ?? s.number;
        s.qr = d.status === 'PAIRING' ? d.qr ?? s.qr : null;
      })
      .addCase(fetchWaStatus.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      })

      // UNLINK
      .addCase(unlinkWhatsapp.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(unlinkWhatsapp.fulfilled, (s) => {
        s.loading = false;
        s.linked = false;
        s.number = null;
        s.status = 'UNLINKED';
        s.qr = null;
      })
      .addCase(unlinkWhatsapp.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error.message;
      });
  },
});

export const { clearQr } = slice.actions;
export default slice.reducer;

// selectors
export const selectWaLinked = (st) => st.settings.linked;
export const selectWaNumber = (st) => st.settings.number;
export const selectWaStatus = (st) => st.settings.status;
export const selectWaQr = (st) => st.settings.qr;
export const selectWaLoading = (st) => st.settings.loading;
export const selectWaError = (st) => st.settings.error;
