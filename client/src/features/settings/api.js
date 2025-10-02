import API from '../../app/api';

export const apiWaLink = () =>
  API.get('/settings/whatsapp/link').then((r) => r.data);
export const apiWaStatus = () =>
  API.get('/settings/whatsapp/status').then((r) => r.data);
export const apiWaUnlink = () =>
  API.post('/settings/whatsapp/unlink').then((r) => r.data);
