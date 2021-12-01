import {
  DeletePostByID, GetPostsByUserId,
  GetFollowers, GetFollowing, GetUserByUserId, GetCheckFollow, GetCheckins,
  FollowUser, UpdateProfile, UnfollowUser,} from './service';
import { SearchRestaurantById } from '../restaurant/service'
import { getAuthority, getUserInfo } from '@/utils/authority';
import { notification } from 'antd';

export default {
  namespace: 'profile',

  state: {
    userInfo: {},
    subPageIdx: 0,
    postList: [],
    followerList: [],
    followingList: [],
    checkinList: [],
    numPosts: 0,
    numFollowers: 0,
    numFollowing: 0,
    followMap: new Map()
  },

  effects: {
    *getUser({ payload: {userId} }, { call, put }){
      // console.log("getUser: userId ", userId);
      const response = yield call(GetUserByUserId, {userId});
      // console.log("get user by userid: ", response);
      const userInfo = response.data[0];
      yield put({
        type: 'saveUser', payload: {userInfo: userInfo}
      });
    }
    ,
    *getPosts({ payload }, { call, put }) {
      const response = yield call(GetPostsByUserId, payload);
      // console.log("getPostsByUserId response: ", response);

      yield put({
        type: 'savePosts',
        payload: {
          posts: response.data,
          // offset: response.pageNumber,
          // limit: response.pageSize,
          numPosts: response.total
        },
      });
    },
    *getFollowers({ payload }, { call, put }) {
      const response = yield call(GetFollowers, payload);
      // console.log("getFollowers response: ", response);
      const followerList = response.data;
      // console.log("getFollowers followerList: ", followerList)
      yield put({
        type: 'saveFollowers',
        payload: {
          followerList: followerList,
          // offset: response.pageNumber,
          // limit: response.pageSize,
          numFollowers: response.total
        },
      });

      yield put({
        type: 'getFollowMap',
        payload: {
          userId: payload.userId,
          userList: followerList
        },
      });

    },

    *getFollowMap({ payload }, { call, put }) {
      const userId = payload.userId, userList = payload.userList;
      // update followMap
      const responses = yield userList.map((other)=>
        call(GetCheckFollow, { userId: userId, otherId: other.user_id})
      );
      // const response1 = yield [call(GetCheckFollow, { userId: payload.userId, otherId: followerList[0].user_id})];
      // console.log("getFollowMap responses: ", responses);
      let newMap = new Map();
      responses.forEach((response) => {
        const otherId = response.data[0].user2, followed = response.data[0].followed[0];
        newMap.set(otherId, followed);
      })
      yield put({
        type: 'saveFollowMap',
        payload: {
          followMap: newMap
        },
      });
    },

    *getFollowing({ payload }, { call, put }) {
      const response = yield call(GetFollowing, payload);
      // console.log("getFollowing response: ", response);

      yield put({
        type: 'saveFollowing',
        payload: {
          followingList: response.data,
          // offset: response.pageNumber,
          // limit: response.pageSize,
          numFollowing: response.total
        },
      });
    },

    *getCheckins({ payload }, { call, put }) {
      const response = yield call(GetCheckins, payload);
      console.log("getCheckins response: ", response);
      // const checkinSimpleList = response.data;
      const checkinList = response.data;
      // yield put({
      //   type: 'getCheckinDetails',
      //   payload: {
      //     checkinSimpleList: checkinSimpleList
      //   }
      // })
      yield put({
            type: 'saveCheckins',
            payload: {
              checkinList: checkinList,
              // offset: response.pageNumber,
              // limit: response.pageSize,
            },
          });

    },


    *followUser({ payload }, { call, put }){
      const response = yield call(FollowUser, payload);

    },
    *unfollowUser({ payload }, { call, put }){
      const response = yield call(UnfollowUser, payload);

    },

    *deleteByID({ payload }, { call, put }) {
      yield call(DeletePostByID, payload);
    },
    *updateProfile({ payload }, { call, put }){
      yield call(UpdateProfile, payload);
      notification.success({
        message: 'Profile Updated.'
      })
    },
  },

  reducers: {
    saveUser(state, { payload: { userInfo} }){
      // console.log("saveUser: ", userInfo);
      return {...state, userInfo};
    },
    saveSubPageIdx(state, { payload: { key: subPageIdx } }){
      return {...state, subPageIdx};
    },
    savePosts(state, { payload: { posts: postList, numPosts } }) {
      // console.log("savePosts: ", postList);
      return { ...state, postList, numPosts};
    },
    saveFollowing(state, { payload: { followingList: followingList, numFollowing } }) {
      // console.log("saveFollowing: ", followingList);
      return { ...state, followingList, numFollowing};
    },
    saveFollowers(state, { payload: { followerList: followerList, numFollowers } }) {
      // console.log("saveFollowers: ", followerList);
      return { ...state, followerList, numFollowers};
    },
    saveFollowMap(state, { payload: { followMap} }){
      const oldMap = new Map(state.followMap);
      // console.log("save: followMap", followMap)
      // console.log("save: oldMap before ", oldMap)
      followMap.forEach((value, key) => {
        // console.log("key: ", key, "value: ", value);
        oldMap.set(key, value);
      })
      // console.log("save: oldMap ", oldMap)
      return { ...state, followMap: oldMap};
    },
    saveCheckins(state, { payload: { checkinList } }) {
      // console.log("saveFollowers: ", followerList);
      return { ...state, checkinList };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      // console.log("setup, dispatching getUser")
      // console.log("setup: ", getUserInfo());
      return history.listen(({ pathname, query }) => {
        const userId = getUserInfo();
        console.log("userId: ", userId)
          if ((pathname === '/profile')) {
            dispatch({ type: 'getUser', payload: {userId: userId}});
            dispatch({ type: 'getPosts', payload: {userId: userId, limit: 20, offset: 1 }});
            dispatch({ type: 'getFollowers', payload: {userId: userId, limit: 20, offset: 1 }});
            dispatch({ type: 'getFollowing', payload: {userId: userId, limit: 20, offset: 1 }});
            dispatch({ type: 'getCheckins', payload: {userId: userId, limit: 20, offset: 1}});
          }
        });

      // return history.listen(({ pathname, query }) => {
      //   // let token = getAuthority();
      //   // if ((pathname === '/post') && token !== 'null') {
      //   //   dispatch({ type: 'get', payload: {limit: 20, offset: 1}});
      //   // }
      //   // if ((pathname === '/post/detail') && token !== 'null') {
      //   //   dispatch({ type: 'getByID', payload: { post_id: query.post_id} });
      //   // }
      // });
    },
  },

};
