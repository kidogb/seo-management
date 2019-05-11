import { getUploadFile, getAllUploadFile, addUploadFile} from '@/services/api';
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
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(getAllUploadFile, payload);
      yield put({
        type: 'saveAll',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const file = payload.file;
      const response = yield call(addUploadFile, {
          title: payload.title,
          note: payload.note,
          file: payload.file.file.originFileObj,
      });
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
      // message.success('Thêm sản phẩm thành công');
      yield put (
        routerRedux.push(`/image/list`));
    },
    // *remove({ payload, callback }, { call, put }) {
    //   const response = yield call(removeRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    saveAll(state, action) {
      return {
        ...state,
        totalData: action.payload,
      };
    },
  },
};
