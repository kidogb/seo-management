import { queryProduct, queryProductDetail, addProduct, removeProduct, addUploadFile } from '@/services/api';
import {routerRedux} from 'dva/router';
import { message } from 'antd';
export default {
  namespace: 'product',

  state: {
    data: {
      results: [],
      count:0,
      previous: null,
      next: null,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(queryProductDetail, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *add({ payload, callback }, { call, put }) {
      const fileList = payload.upload.fileList;
      let ps_imgs = [];
      const uploadResList = yield fileList.map(file =>{
        return call(addUploadFile, {
          title: file.name,
          note: file.name,
          file: file.originFileObj,
        });
      });
      yield uploadResList.map(uploadRes => {
        if(uploadRes.id) ps_imgs.push(uploadRes.id);
      });
      const response = yield call(addProduct, {... payload, ps_imgs});
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
      // else yield put (
      //   routerRedux.push(`/production/list`));
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeProduct, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      console.log("Response: ", response);
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
