import { SendPost, GetPosts, GetPostByID, DeletePostByID, UpdatePost, AdvSearch, LikeByID, DislikeByID  } from './service';
import { getAuthority, getUserInfo } from '@/utils/authority';
import { notification } from 'antd';

export default {
  namespace: 'post',

  state: {
    postList: undefined,
    postDetail: undefined,
    offset: undefined,
    limit: undefined,
  },

  effects: {
    *get({ payload }, { call, put }) {
      const response = yield call(GetPosts, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          posts: response.data,
          offset: response.pageNumber,
          limit: response.pageSize,
        },
      });
    },

    *advSearch({ payload }, { call, put }) {
      const response = yield call(AdvSearch, payload);
      console.log(response)
      yield put({
        type: 'save',
        payload: {
          posts: response.data,
          offset: response.pageNumber,
          limit: response.pageSize,
        },
      });
    },

    *getByID({ payload }, { call, put }) {
      const response = yield call(GetPostByID, payload);
      console.log(response)
      yield put({
        type: 'saveDetail',
        payload: {
          postDetail: response.data[0],
        },
      });
    },

    *deleteByID({ payload }, { call, put }) {
      yield call(DeletePostByID, payload);
    },

    *sendPost({ payload}, { call, put }) {
      payload.user_id = getUserInfo();
      yield call(SendPost, payload);
      const response = yield call(GetPosts, {limit: payload.limit, offset: payload.offset});
      yield put({
        type: 'save',
        payload: {
          posts: response.data,
          offset: response.pageNumber,
          limit: response.pageSize,
        },
      });
      notification.success({
        message: 'You just sent a post!'
      })
    },

    *updatePost({ payload }, { call, put }) {
      payload.user_id = getUserInfo();
      yield call(UpdatePost, payload);
      notification.success({
        message: 'You just updated a post!'
      })
    },


    *like({ payload }, { call, put }) {
      yield call(LikeByID, payload);

      const response = yield call(GetPosts, payload);
      yield put({
        type: 'save',
        payload: {
          posts: response.data,
          offset: response.pageNumber,
          limit: response.pageSize,
        },
      });

    },

    *dislike({ payload }, { call, put }) {
      yield call(DislikeByID, payload);

      const response = yield call(GetPosts, payload);
      yield put({
        type: 'save',
        payload: {
          posts: response.data,
          offset: response.pageNumber,
          limit: response.pageSize,
        },
      });

    },


  },

  reducers: {
    save(state, { payload: { posts: postList, limit, offset } }) {
      return { ...state, postList, limit, offset};
    },
    saveDetail(state, { payload: { postDetail, limit, offset } }) {
      return { ...state, postDetail, limit, offset};
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        let token = getAuthority();
        if ((pathname === '/post') && token !== 'null') {
          dispatch({ type: 'get', payload: {limit: 20, offset: 1}});
        }
        if ((pathname === '/post/detail') && token !== 'null') {
          dispatch({ type: 'getByID', payload: { post_id: query.post_id} });
        }
      });
    },
  },

};
