import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login as loginApi, logout as logoutApi } from './api';
import { toast } from 'react-hot-toast';

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await loginApi(credentials);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (token) => {
  try {
    await logoutApi(token);
    return true;
  } catch (err) {
    return false;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        // API returns { success, message, data: { user, token }, error }
        const payload = action.payload || {};
        const data = payload.data || {};
        state.user = data.user || null;
        state.token = data.token || null;
        state.isAuthenticated = Boolean(data.token);
        toast.success(payload.message || 'Login successful!');
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        // action.payload is likely a string message from rejectWithValue
        let message = action.payload || action.error?.message || 'Login failed';
        // If backend returned structured error, try to read details
        if (action.payload && typeof action.payload === 'object') {
          message =
            action.payload.message ||
            action.payload.error?.details ||
            JSON.stringify(action.payload);
        }
        state.error = message;
        toast.error(message);
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        toast.success('Logged out!');
      });
  },
});

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
