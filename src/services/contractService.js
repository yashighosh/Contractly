import api from './api';

export const contractService = {
  getAll:      (params)      => api.get('/contracts', { params }),
  getById:     (id)          => api.get(`/contracts/${id}`),
  create:      (data)        => api.post('/contracts', data),
  update:      (id, data)    => api.put(`/contracts/${id}`, data),
  delete:      (id)          => api.delete(`/contracts/${id}`),
  send:        (id, payload) => api.post(`/contracts/${id}/send`, payload),
  remind:      (id)          => api.post(`/contracts/${id}/remind`),
  getSignUrl:  (token)       => api.get(`/contracts/sign/${token}`),
  sign:        (token, sig)  => api.post(`/contracts/sign/${token}`, sig),
  download:    (id)          => api.get(`/contracts/${id}/pdf`, { responseType: 'blob' }),
  renew:       (id)          => api.post(`/contracts/${id}/renew`),
  duplicate:   (id)          => api.post(`/contracts/${id}/duplicate`),
  getAuditLog: (id)          => api.get(`/contracts/${id}/audit`),
};
