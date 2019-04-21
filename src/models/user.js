import { query as queryUsers, queryCurrent } from '@/services/user';
import { accountLogin } from '@/services/api';
import { changePassword } from '@/services/user';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
  },

  effects: {
    // *fetch(_, { call, put }) {
    //   const response = yield call(queryUsers);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *changePassword({ payload, callback }, { call }) {
      const response = yield call(changePassword, payload);
      if (callback) callback(response);
    },
  },

  reducers: {
    // save(state, action) {
    //   return {
    //     ...state,
    //     list: action.payload,
    //   };
    // },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
  },
};
