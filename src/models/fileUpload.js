import { getUploadFile, getAllUploadFile, addUploadFile} from '@/services/api';
import {routerRedux} from 'dva/router';
import { message, notification } from 'antd';
export default {
  namespace: 'fileUpload',

  state: {
    data: {
      results: [],
      count:0,
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
      yield put (
        routerRedux.push(`/image/list`));
    },
    *addMultiFile ({payload, callback}, {call, put}) {
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
      for (let i = 0; i < payload.length; i = i + 2) {
        let arr = [];
        if (i + 1 < payload.length) {
          arr.push(payload[i], payload[i + 1]);
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
            title: payload[i].name,
            note: payload[i].name,
            file: payload[i].originFileObj,
          });
          if (uploadRes.id) ps_imgs.push(uploadRes.id);
        }
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
      console.log(error);
    }
  },
    // *remove({ payload, callback }, { call, put }) {
    //   const response = yield call(removeRule, payload);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    //   if (callback) callback();
    // },
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