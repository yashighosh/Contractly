import api from './api';

const normalize = (t) => ({
  ...t,
  name: t.title, // Map backend title to frontend name
  type: t.isPublic ? 'system' : 'my',
  clauses: 0, // Placeholder as backend doesn't return clause count yet
  lastUsed: 'Never'
});

export const templateService = {
  getAll:   (params) => api.get('/v1/templates', { params }).then(r => r.data.data.map(normalize)),
  getById:  (id)     => api.get(`/v1/templates/${id}`).then(r => normalize(r.data.data)),
  create:   (data)   => api.post('/v1/templates', data).then(r => normalize(r.data.data)),
  update:   (id, d)  => api.put(`/v1/templates/${id}`, d).then(r => normalize(r.data.data)),
  delete:   (id)     => api.delete(`/v1/templates/${id}`).then(r => r.data.data),
};
