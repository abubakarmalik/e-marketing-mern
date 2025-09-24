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
