import { routerRedux } from 'dva/router';
import { setAuthority, setUserInfo } from '@/utils/authority';
import { accountLogin } from './service';
import { notification } from 'antd';

export default {
  namespace: 'userLogin',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      // Login successfully
      if (response.code === 200) {
        yield put({
          type: 'changeLoginStatus',
          payload: response,
        });
        let token = response.data[0].user_id;
        setAuthority(token);
        setUserInfo(token);
        yield put(routerRedux.replace('/'));
      } else {
        notification.error({
          message: response.msg,
          description: response.code,
        })
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      notification.success({
        message: 'Login success',
        description: 'Welcome to delp!',
      })
      return {
        ...state,
        status: payload.msg
      };
    },
  },
};
