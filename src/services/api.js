import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryProduct(params) {
  return request(`/commonapis/products?${stringify(params)}`);
}

export async function queryAllProduct(params) {
  return request(`/commonapis/products?no_page&${stringify(params)}`);
}

export async function queryProductDetail(id) {
  return request(`/commonapis/products/${id}`);
}

export async function addProduct(params) {
  return request('/commonapis/products/', {
    method: 'POST',
    body: params,
  });
}

export async function removeProduct(id) {
  return request(`/commonapis/products/${id}/`, {
    method: 'DELETE',
  });
}

export async function updateProduct(payload) {
  return request(`/commonapis/products/${payload.id}/`, {
    method: 'PUT',
    body: payload,
  });
}

export async function addVariations(payload) {
  return request('/commonapis/variationproducts/', {
    method: 'POST',
    body: payload,
  });
}

export async function updateVariations(payload) {
  return request(`/commonapis/variationproducts/${payload.id}/`, {
    method: 'PUT',
    body: payload,
  });
}

export async function removeVariations(id) {
  return request(`/commonapis/variationproducts/${id}/`, {
    method: 'DELETE',
  });
}

export async function querySample(params) {
  return request(`/commonapis/samples?${stringify(params)}`);
}

export async function queryAllSample(params) {
  return request(`/commonapis/samples?no_page&${stringify(params)}`);
}

export async function querySampleDetail(id) {
  return request(`/commonapis/samples/${id}`);
}

export async function removeSample(id) {
  return request(`/commonapis/samples/${id}/`, {
    method: 'DELETE',
  });
}

export async function addSample(params) {
  return request('/commonapis/samples/', {
    method: 'POST',
    body: params,
  });
}

export async function updateSample(payload) {
  return request(`/commonapis/samples/${payload.id}/`, {
    method: 'PUT',
    body: payload,
  });
}

export async function getUploadFile(params) {
  return request(`/commonapis/fileuploads?${stringify(params)}`);
}

export async function getAllUploadFile(params) {
  return request(`/commonapis/fileuploads?no_page&${stringify(params)}`);
}

export async function addUploadFile(params) {
  let formData = new FormData();
  formData.append("file", params.file);
  formData.append("title", params.title);
  formData.append("note", params.note);
  return request('/commonapis/fileuploads/', {
    method: 'POST',
    body: formData,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function accountLogin(params) {
  return request('/commonapis/signin/', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
