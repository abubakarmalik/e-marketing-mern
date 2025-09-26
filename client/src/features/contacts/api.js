// src/features/contacts/api.js  (or create src/features/categories/api.js)
import API from '../../app/api';

// GET /api/category  (auth required)
export const getCategories = async () => {
  const { data } = await API.get('/category');
  // backend returns: { success, count, data, error }
  return data;
};

// POST /api/category/add  (auth required) -> body: { name }
export const addCategoryApi = async (payload) => {
  const { data } = await API.post('/category/add', payload);
  return data;
};

// --- CONTACTS ---
export const getContacts = async (params = {}) => {
  // expects backend route: GET /api/contacts  → { success, count, data, error }
  // params: { page, limit }
  const { data } = await API.get('/contact', { params });
  return data;
};

export const addContactApi = async (payload) => {
  // expected: { number, group }
  // backend returns: { success, data, message?, error? }
  const { data } = await API.post('/contact/add', payload);
  return data;
};

// DELETE /contact/delete/:id
export const deleteContactApi = async (id) => {
  const { data } = await API.delete(`/contact/delete/${id}`);
  return data; // { success: true, message?, data?, error? }
};

// PUT /contact/update/:id
export const updateContactApi = async (id, payload) => {
  const { data } = await API.put(`/contact/update/${id}`, payload);
  return data; // { success, data, message?, error? }
};
