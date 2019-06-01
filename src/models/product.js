import { queryProduct, queryAllProduct, queryProductDetail, addProduct, removeProduct, updateProduct, addUploadFile } from '@/services/api';
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
    totalData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      
    },
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(queryAllProduct, payload);
      yield put ({
        type: 'saveAll',
        payload: response,
      })
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
      for (let i = 0; i < fileList.length; i = i + 2) {
        let arr = [];
        if (i + 1 < fileList.length) {
          arr.push(fileList[i], fileList[i + 1]);
          const uploadResList = yield arr.map(file => {
            return call(addUploadFile, {
              title: file.name,
              note: file.name,
              file: file.originFileObj,
            });
          });
          yield uploadResList.map(uploadRes => {
            if (uploadRes.id) ps_imgs.push(uploadRes.id);
          });
        } else {
          const uploadRes = yield call(addUploadFile, {
            title: fileList[i].name,
            note: fileList[i].name,
            file: fileList[i].originFileObj,
          });
          if (uploadRes.id) ps_imgs.push(uploadRes.id);
        }
      }
      if (ps_imgs.length === 0) {
        notification.error({
          message: "Lỗi upload ảnh!",
          description: "Có lỗi trong quá trình upload ảnh. Vui lòng thử lại!"
        });
      } else if (ps_imgs.length < fileList.length) {
        notification.error({
          message: "Lỗi upload ảnh!",
          description: "Có lỗi trong quá trình upload ảnh. Một số ảnh có thể không được upload thành công!"
        });
        const response = yield call(addProduct, { ...payload, ps_imgs });
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);
      } else if (ps_imgs.length === fileList.length) {
        const response = yield call(addProduct, { ...payload, ps_imgs });
        yield put({
          type: 'save',
          payload: response,
        });
        if (callback) callback(response);
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeProduct, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put (
        routerRedux.push(`/production/${payload.id}/detail`));
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
    saveAll(state, action) {
      return {
        ...state,
        totalData: action.payload,
      };
    },
  },
};
