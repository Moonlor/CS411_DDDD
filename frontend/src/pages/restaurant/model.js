import { SearchRestaurants, SearchRestaurantById, SearchRelatedPosts } from './service';
import { getAuthority, getUserInfo } from '@/utils/authority';
import { notification } from 'antd';

export default {
  namespace: 'restaurant',

  state: {
    restaurantList: undefined,
    restaurant: undefined,
    relatedPosts: undefined,
    offset: undefined,
    limit: undefined,
  },

  effects: {
    *search({ payload }, { call, put }) {
      const response = yield call(SearchRestaurants, payload);
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
    *getRestaurant({ payload }, { call, put }) {
      const response = yield call(SearchRestaurantById, payload);
      // console.log(response)
      yield put({
        type: 'saveRestaurant',
        payload: {
          restaurant: response.data[0]
        },
      });
    },
    *getRelatedPosts({ payload }, { call, put }) {
      const response = yield call(SearchRelatedPosts, payload);
      // console.log(response)
      yield put({
        type: 'saveRelatedPosts',
        payload: {
          relatedPosts: response.data,
          // offset: response.pageNumber,
          // limit: response.pageSize,
        },
      });
    },

  },

  reducers: {
    save(state, { payload: { rests: restaurantList, limit, offset } }) {
      return { ...state, restaurantList, limit, offset};
    },
    saveRestaurant(state, { payload: { restaurant } }) {
      // console.log("save restaurant: ", restaurant)
      return { ...state, restaurant};
    },
    saveRelatedPosts(state, { payload: { relatedPosts }}){
      return { ...state, relatedPosts}
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        // if ((pathname === '/restaurant')) {
        //   dispatch({ type: 'search', payload: {limit: 20, offset: 1}});
        // }
        if ((pathname === '/restaurant/detail')) {
          // console.log("query: ", query)
          dispatch({ type: 'getRestaurant', payload: { restaurant_id: query.restaurant_id}});
          dispatch({ type: 'getRelatedPosts', payload: { restaurant_id: query.restaurant_id, limit: 20, offset: 1}});
        }
      });
    },
  },

};
