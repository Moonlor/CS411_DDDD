import { SearchResuaurant } from './service';
import { getAuthority, getUserInfo } from '@/utils/authority';
import { notification } from 'antd';

export default {
  namespace: 'restaurant',

  state: {
    restaurantList: undefined,
    offset: undefined,
    limit: undefined,
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(SearchResuaurant, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          rests: response.data,
          offset: response.pageNumber,
          limit: response.pageSize,
        },
      });
    },
  },

  reducers: {
    save(state, { payload: { rests: restaurantList, limit, offset } }) {
      return { ...state, restaurantList, limit, offset};
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
      });
    },
  },

};
