import { registerUser } from '@/services/user';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload, callback }, { call, put }) {
      const response = yield call(registerUser, payload);
      // yield put({
      //   type: 'registerHandle',
      //   payload: response,
      // });
      if (callback) callback(response);
    },
  },

  reducers: {
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};
