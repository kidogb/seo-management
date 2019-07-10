import { getUploadFile, getAllUploadFile, addUploadFile, removeUploadFile } from '@/services/api';
import { routerRedux } from 'dva/router';
import { message, notification } from 'antd';
import { MAX_FILE_UPLOAD_CONCURRENT } from '@/common/constant';
export default {
  namespace: 'fileUpload',

  state: {
    data: {
      results: [],
      count: 0,
      previous: null,
      next: null,
    },
    totalData: [],
    listFileId: [], // list
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
      yield put(
        routerRedux.push(`/image/list`));
    },
    *addSingleFile({ payload, callback }, { call, put }) {
      const response = yield call(addUploadFile, {
        title: payload.name,
        note: payload.name,
        file: payload.originFileObj,
      });
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
      // message.success('Thêm sản phẩm thành công');
    },
    *addMultiFile({ payload, callback }, { call, put }) {
      let ps_imgs = [];
      // const uploadResList = yield payload.map(file =>{
      //   return call(addUploadFile, {
      //     title: file.name,
      //     note: file.name,
      //     file: file.originFileObj,
      //   });
      // });
      // yield uploadResList.map(uploadRes => {
      //   if(uploadRes.id) ps_imgs.push(uploadRes.id);
      // });
      // yield put({
      //   type: 'saveMultiFile',
      //   payload: ps_imgs,
      // });
      // if (callback) callback(ps_imgs); 
      try {
        for (let i = 0; i <= payload.length - MAX_FILE_UPLOAD_CONCURRENT; i = i + MAX_FILE_UPLOAD_CONCURRENT) {
          const arr = payload.slice(i, i + MAX_FILE_UPLOAD_CONCURRENT);
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
        if (payload.length % MAX_FILE_UPLOAD_CONCURRENT !== 0) {
          const lastArr = payload.slice(MAX_FILE_UPLOAD_CONCURRENT * Math.floor(payload.length / MAX_FILE_UPLOAD_CONCURRENT), payload.length);
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
        if (ps_imgs.length === 0 && payload.length !== 0) {
          notification.error({
            message: "Lỗi upload ảnh!",
            description: "Có lỗi trong quá trình upload ảnh. Vui lòng thử lại!"
          });
        } else if (ps_imgs.length < payload.length) {
          notification.error({
            message: "Lỗi upload ảnh!",
            description: "Có lỗi trong quá trình upload ảnh. Một số ảnh có thể không được upload thành công!"
          });
        }
        if (callback) callback(ps_imgs);
      } catch (error) {
        notification.error({
          message: "Lỗi upload ảnh!",
          description: { error }
        });
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUploadFile, payload);
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
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
    saveAll(state, action) {
      return {
        ...state,
        totalData: action.payload,
      };
    },
    saveMultiFile(state, action) {
      return {
        ...state,
        listFileId: action.payload,
      };
    },
  },
};