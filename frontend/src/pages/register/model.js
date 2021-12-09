import { routerRedux } from 'dva/router';
import { setAuthority, setUserInfo } from '@/utils/authority';
import { userRegister } from './service';
import { notification } from 'antd';

export default {
  namespace: 'userRegister',

  state: {
    status: undefined,
  },

  effects: {
    *register({ payload }, { call, put }) {
      const response = yield call(userRegister, payload);
      console.log(response);
      if (response.code === 200) {

        let token = response.data[0].user_id;
        notification.success({
          message: 'Congratulations! You have created your account!',
          description: 'Welcome to Delp!',
        })
        setAuthority(token);
        setUserInfo(token);
        yield put(routerRedux.replace('/'));
      } else {
        notification.error({
          message: 'Opps, something went wrong: ' + response.msg,
          description: 'Create account failed',
        })
      }
    }
  },

  reducers: {},
};
