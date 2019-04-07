import { updateSample, querySample, querySampleDetail, addSample, removeSample, addUploadFile} from '@/services/api';
import {routerRedux} from 'dva/router';
import { message } from 'antd';
export default {
  namespace: 'sample',

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
      const response = yield call(querySample, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(querySampleDetail, payload);
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
      const response = yield call(addSample, {... payload, ps_imgs});
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
      yield put (
        routerRedux.push(`/sample/list`));
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeSample, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateSample, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
      yield put (
        routerRedux.push(`/sample/${payload.id}/detail`));
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
