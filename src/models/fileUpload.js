import { getUploadFile, getAllUploadFile, addUploadFile} from '@/services/api';
import {routerRedux} from 'dva/router';
import { message } from 'antd';
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
      const length = payload.length;
      let i = 0;
      // if (length <= 2){
      //   yield payload.map(file =>{
      //     return call(addUploadFile, {
      //       title: file.name,
      //       note: file.name,
      //       file: file.originFileObj,
      //     });
      //   });
      // } else {
      //   while (i < length -2){
      //     const arr = payload.slice (i, i+2);
      //     i++;
      //   }
      // }
      const num = Math.floor(length/2);
      const e = length%2;
      let uploadResList = [];
      for (let i = 0; i < num; i++) {
        const arr = payload.slice(2*i, 2*i +1);
        const resList = yield array.map(file =>{
          return call(addUploadFile, {
            title: file.name,
            note: file.name,
            file: file.originFileObj,
          });
        });
        uploadResList.push(...resList);
      }
      if (e === 1){
        const lastArr = payload.slice(length-1, length);
        const lastResList = yield lastArr.map(file =>{
          return call(addUploadFile, {
            title: file.name,
            note: file.name,
            file: file.originFileObj,
          });
        });
        uploadResList.push(...lastResList);
      }
      yield uploadResList.map(uploadRes => {
        if(uploadRes.id) ps_imgs.push(uploadRes.id);
      });
      yield put({
        type: 'saveMultiFile',
        payload: ps_imgs,
      });
      if (callback) callback(ps_imgs); 
    }
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
