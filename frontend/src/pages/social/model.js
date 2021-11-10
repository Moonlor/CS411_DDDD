import { SearchSimiliar } from './service';
import { getAuthority, getUserInfo } from '@/utils/authority';
import { notification } from 'antd';

export default {
  namespace: 'advance',

  state: {
    similiarUserList: undefined,
    offset: undefined,
    limit: undefined,
  },

  effects: {
    *searchSimiliar({ payload }, { call, put }) {
      const response = yield call(SearchSimiliar, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          similiar: response.data,
          offset: response.pageNumber,
          limit: response.pageSize,
        },
      });
    },
  },

  reducers: {
    save(state, { payload: { similiar: similiarUserList, limit, offset } }) {
      return { ...state, similiarUserList, limit, offset};
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
      });
    },
  },

};
