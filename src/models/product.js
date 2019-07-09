import { queryProduct, queryAllProduct, queryProductDetail, addProduct, removeProduct, updateProduct, addUploadFile } from '@/services/api';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { MAX_FILE_UPLOAD_CONCURRENT } from '@/common/constant';
export default {
  namespace: 'product',

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
      const response = yield call(queryProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });

    },
    *fetchAll({ payload }, { call, put }) {
      const response = yield call(queryAllProduct, payload);
      yield put({
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
    *uploadAndAdd({ payload, callback }, { call, put }) {
      try {
        const fileList = payload.upload.fileList;
        const coverImg = payload.upload_cover ? payload.upload_cover.fileList : null;
        let profile_image_id = null;
        console.log(coverImg);
        let ps_imgs = [];
        let length = fileList.length;
        if (coverImg) {
          length = length + coverImg.length;
          // upload cover first
          const uploadCoverList = yield coverImg.map(img => {
            return call(addUploadFile, {
              title: img.name,
              note: img.name,
              file: img.originFileObj,
            });
          });
          if (uploadCoverList && uploadCoverList.length > 0) {
            yield uploadCoverList.map(uploadCover => {
              if (uploadCover && uploadCover.id) {
                ps_imgs.push(uploadCover.id);
                profile_image_id = uploadCover.id;
              }
            });
          }
        }
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
        payload.upload = []; //reset upload, avoid large size of request
        payload.upload_cover = []; //reset upload
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
          const response = yield call(addProduct, { ...payload, ps_imgs, profile_image_id });
          yield put({
            type: 'save',
            payload: response,
          });
          if (callback) callback(response);
        } else if (ps_imgs.length === length) {
          const response = yield call(addProduct, { ...payload, ps_imgs, profile_image_id });
          yield put({
            type: 'save',
            payload: response,
          });
          if (callback) callback(response);
        }
      } catch (error) {
        notification.error({
          message: "Lỗi tạo sản phẩm!",
          description: { error }
        });
      }
    },
    *add({ payload, callback }, { call, put }) {
      if (payload && payload.upload) payload.upload = [];
      const response = yield call(addProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback(response);
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
      if (payload && payload.upload) payload.upload = [];
      const response = yield call(updateProduct, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      yield put(
        routerRedux.push(`/production/${payload.id}/detail`));
      if (callback) callback();
    },
    *multiRemove({ payload, callback }, { call, put }) {
      yield payload.map(id => {
        return call(removeProduct, id);
      });
      // yield put({
      //   type: 'save',
      //   payload: response,
      // });
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
