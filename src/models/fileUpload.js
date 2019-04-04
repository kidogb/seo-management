import { getUploadFile, addUploadFile} from '@/services/api';
import {routerRedux} from 'dva/router';
import { message } from 'antd';
export default {
  namespace: 'fileUpload',

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
      const response = yield call(getUploadFile, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addUploadFile, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
      // message.success('Thêm sản phẩm thành công');
      yield put (
        routerRedux.push(`/image/list`));
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
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
