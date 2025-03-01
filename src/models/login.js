import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { accountLogin } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import token from '../utils/token';

export default {
  namespace: 'login',

  state: {
    currentAuthority: 'guest',
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response && response.token) {
        token.save(response.token);
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          if (redirect.includes('user/login')) redirect = '';
          else {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.match(/^\/.*#/)) {
                redirect = redirect.substr(redirect.indexOf('#') + 1);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *logout(_, { put }) {
      token.remove(); // remove token
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          token: '',
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority((payload && payload.user) ? payload.user.user_type : 'guest');
      return {
        ...state,
        data: payload,
        status: (payload && payload.user) ? 'ok' : 'error',
      };
    },
  },
};
