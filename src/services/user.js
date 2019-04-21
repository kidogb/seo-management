import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/commonapis/currentUser');
}

export async function changePassword(params) {
  return request('/commonapis/password/change/', {
    method: 'POST',
    body: params,
  });
}

export async function registerUser(params) {
  return request('/commonapis/users/', {
    method: 'POST',
    body: params,
  });
}