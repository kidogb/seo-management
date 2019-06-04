import { updateSample, querySample, queryAllSample, querySampleDetail, addSample, removeSample, addUploadFile } from '@/services/api';
import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';
import { MAX_FILE_UPLOAD_CONCURRENT } from '@/common/constant';
export default {
  namespace: 'sample',

  state: {
    data: {
      results: [],
      count: 0,
      previous: null,
      next: null,
    },
    totalData: [],
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(querySample, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(queryAllSample, payload);
      yield put({
        type: 'saveAll',
        payload: response,
      });
    },
    *fetchDetail({ payload, callback }, { call, put }) {
      const response = yield call(querySampleDetail, payload);
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
        const length = fileList.length;
        for (let i = 0; i <= length - MAX_FILE_UPLOAD_CONCURRENT; i = i + MAX_FILE_UPLOAD_CONCURRENT) {
          const arr = fileList.slice(i, i + MAX_FILE_UPLOAD_CONCURRENT);
          const uploadResList = yield arr.map(file => {
            return call(addUploadFile, {
              title: file.name,
              note: file.name,
              file: file.originFileObj,
            });
          });
          yield uploadResList.map(uploadRes => {
            if (uploadResList && uploadRes.id) ps_imgs.push(uploadRes.id);
          });
        }
        if (length % MAX_FILE_UPLOAD_CONCURRENT !== 0) {
          const lastArr = fileList.slice(MAX_FILE_UPLOAD_CONCURRENT * Math.floor(length / MAX_FILE_UPLOAD_CONCURRENT), length);
          const lastUploadResList = yield lastArr.map(file => {
            return call(addUploadFile, {
              title: file.name,
              note: file.name,
              file: file.originFileObj,
            });
          });
          yield lastUploadResList.map(lastUploadRes => {
            if (lastUploadRes && lastUploadRes.id) ps_imgs.push(lastUploadRes.id);
          });
        }
        payload.upload = [];
        if (ps_imgs.length === 0) {
          notification.error({
            message: "Lỗi upload ảnh!",
            description: "Có lỗi trong quá trình upload ảnh. Vui lòng thử lại!"
          });
        } else if (ps_imgs.length < length) {
          notification.error({
            message: "Lỗi upload ảnh!",
            description: "Có lỗi trong quá trình upload ảnh. Một số ảnh có thể không được upload thành công!"
          });
          const response = yield call(addSample, { ...payload, ps_imgs });
          yield put({
            type: 'save',
            payload: response,
          });
          if (callback) callback(response);
        } else if (ps_imgs.length === length) {
          const response = yield call(addSample, { ...payload, ps_imgs });
          yield put({
            type: 'save',
            payload: response,
          });
          if (callback) callback(response);
        }
      } catch (error) {
        notification.error({
          message: "Lỗi tạo sample!",
          description: { error }
        });
      }
      // const uploadResList = yield fileList.slice(0,1).map(file =>{
      //   return call(addUploadFile, {
      //     title: file.name,
      //     note: file.name,
      //     file: file.originFileObj,
      //   });
      // });
      // const uploadResList1 = yield fileList.slice(2,5).map(file =>{
      //   return call(addUploadFile, {
      //     title: file.name,
      //     note: file.name,
      //     file: file.originFileObj,
      //   });
      // });
      // yield uploadResList.map(uploadRes => {
      //   if(uploadRes.id) ps_imgs.push(uploadRes.id);
      // });
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeSample, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
      if (callback) callback(response);
    },
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateSample, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put(
        routerRedux.push(`/sample/${payload.id}/detail`));
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
