import api from './api';

export const templateService = {
  getAll:   (params) => api.get('/v1/templates', { params }).then(r => r.data.data),
  getById:  (id)     => api.get(`/v1/templates/${id}`).then(r => r.data.data),
  create:   (data)   => api.post('/v1/templates', data).then(r => r.data.data),
  update:   (id, d)  => api.put(`/v1/templates/${id}`, d).then(r => r.data.data),
  delete:   (id)     => api.delete(`/v1/templates/${id}`).then(r => r.data.data),
};
