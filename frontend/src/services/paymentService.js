import api from './api';

export const paymentService = {
  createOrder: (planId) => api.post('/v1/payments/order', { planId }).then(res => res.data.data),
  createRegistrationOrder: (planId, email) => api.post('/v1/payments/registration-order', { planId, email }).then(res => res.data.data),
  verifyPayment: (data) => api.post('/v1/payments/verify', data).then(res => res.data),
};
