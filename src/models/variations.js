import { addVariations, updateVariations, removeVariations } from '@/services/api';
import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';
export default {
  namespace: 'variations',

  state: {
    data: {
      results: [],
      count: 0,
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
      const response = yield call(addVariations, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
    },
    *addMultiVariation({ payload, callback }, { call, put }) {
      const variationResList = yield payload.map(variation => {
        return call(addVariations, variation);
      });
      const variationResSuccessList = variationResList.filter(Boolean);

      if (callback) callback(variationResSuccessList);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateVariations, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *updateMultiVariation({ payload, callback }, { call, put }) {
      const variationResList = yield payload.map(variation => {
        return call(updateVariations, variation);
      });
      const variationResSuccessList = variationResList.filter(Boolean);
      if (callback) callback(variationResSuccessList);
    },
    *remove({ payload, callback }, { call }) {
      const response = yield call(removeVariations, payload);
      if (callback) callback(response);
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
