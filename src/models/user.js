import { query as queryUsers, queryCurrent } from '@/services/user';
import { accountLogin } from '@/services/api';

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
