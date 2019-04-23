import { addProductVariations } from '@/services/api';
import {routerRedux} from 'dva/router';
import { message } from 'antd';
export default {
  namespace: 'variations',

  state: {
    data: {
      results: [],
      count:0,
      previous: null,
      next: null,
    },
  },

  effects: {
    // *fetch({ payload }, { call, put }) {
    //   const response = yield call(queryProduct, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
      
    // },
    // *fetchDetail({ payload, callback }, { call, put }) {
    //   const response = yield call(queryProductDetail, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback(response);
    // },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addProductVariations, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    // *remove({ payload, callback }, { call, put }) {
    //   const response = yield call(removeProduct, payload);
    //   // yield put({
    //   //   type: 'save',
    //   //   payload: response,
    //   // });
    //   console.log("Response: ", response);
    //   if (callback) callback(response);
    // },
    // *update({ payload, callback }, { call, put }) {
    //   const response = yield call(updateRule, payload);
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
  },
};
