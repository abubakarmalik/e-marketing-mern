import API from '../../app/api';

export const login = async (credentials) => {
  const { data } = await API.post('/auth/login', credentials);
  return data;
};

export const logout = async (token) => {
  const { data } = await API.post('/auth/logout', { token });
  return data;
};
