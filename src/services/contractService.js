import api from './api';

export const contractService = {
  getAll:      (params)      => api.get('/v1/contracts', { params }).then(r => r.data.data),
  getById:     (id)          => api.get(`/v1/contracts/${id}`).then(r => r.data.data),
  create:      (data)        => api.post('/v1/contracts', data).then(r => r.data.data),
  update:      (id, data)    => api.put(`/v1/contracts/${id}`, data).then(r => r.data.data),
  delete:      (id)          => api.delete(`/v1/contracts/${id}`).then(r => r.data.data),
  send:        (id, payload) => api.post(`/v1/contracts/${id}/send`, payload).then(r => r.data.data),
  duplicate:   (id)          => api.post(`/v1/contracts/${id}/duplicate`).then(r => r.data.data),
  download:    (id)          => api.get(`/v1/contracts/${id}/pdf`, { responseType: 'blob' }),
  
  // Audits
  getAuditLog: (id)          => api.get(`/v1/audit/contracts/${id}`).then(r => r.data.data),

  // Signatures
  getSignUrl:  (token)       => api.get(`/v1/sign/${token}`).then(r => r.data.data),
  sign:        (token, sig)  => api.post(`/v1/sign/${token}`, sig).then(r => r.data.data),
};
