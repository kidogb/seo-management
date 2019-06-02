import { queryProduct, queryAllProduct, queryProductDetail, addProduct, removeProduct, updateProduct, addUploadFile } from '@/services/api';
import {routerRedux} from 'dva/router';
import { message } from 'antd';
import { MAX_FILE_UPLOAD_CONCURRENT } from '@/common/constant';
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
      try {
      const fileList = payload.upload.fileList;
      let ps_imgs = [];
      for (let i = 0; i <= fileList.length - MAX_FILE_UPLOAD_CONCURRENT; i = i + MAX_FILE_UPLOAD_CONCURRENT) {
        const arr = fileList.slice(i, i + MAX_FILE_UPLOAD_CONCURRENT);
        const uploadResList = yield arr.map(file => {
          return call(addUploadFile, {
            title: file.name,
            note: file.name,
            file: file.originFileObj,
          });
        });
        console.log(uploadResList);
        yield uploadResList.map(uploadRes => {
          if (uploadResList && uploadRes.id) ps_imgs.push(uploadRes.id);
        });
      }
      if (fileList.length % MAX_FILE_UPLOAD_CONCURRENT !== 0) {
        const lastArr = fileList.slice(MAX_FILE_UPLOAD_CONCURRENT * Math.floor(fileList.length / MAX_FILE_UPLOAD_CONCURRENT), fileList.length);
        const lastUploadResList = yield lastArr.map(file => {
          return call(addUploadFile, {
            title: file.name,
            note: file.name,
            file: file.originFileObj,
          });
        });
        console.log(lastUploadResList);
        yield lastUploadResList.map(lastUploadRes => {
          if (lastUploadRes && lastUploadRes.id) ps_imgs.push(lastUploadRes.id);
        });
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
      }} catch (error){
        notification.error({
          message: "Lỗi tạo sample!",
          description: { error }
        });
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
