import {
  DeletePostByID, GetPostsByUserId,
  GetFollowers, GetFollowing, GetUserByUserId, GetCheckFollow,
  FollowUser, UpdateProfile, UnfollowUser,} from './service';
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
    numPosts: 0,
    numFollowers: 0,
    numFollowing: 0,
    followMap: new Map()
  },

  effects: {
    *getUser({ payload: {userId} }, { call, put }){
      console.log("getUser: userId ", userId);
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
      console.log("getFollowers followerList: ", followerList)
      yield put({
        type: 'saveFollowers',
        payload: {
          followerList: followerList,
          // offset: response.pageNumber,
          // limit: response.pageSize,
          numFollowers: response.total
        },
      });

      // update followMap
      const responses = yield followerList.map((follower)=>
        call(GetCheckFollow, { userId: payload.userId, otherId: follower.user_id})
      );
      // const response1 = yield [call(GetCheckFollow, { userId: payload.userId, otherId: followerList[0].user_id})];
      console.log("getFollowMap responses: ", responses);
      let newMap = new Map();
      responses.forEach((response) => {
        const followerId = response.data[0].user2, followed = response.data[0].followed[0];
        newMap.set(followerId, followed);
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
      console.log("getFollowing response: ", response);

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
      console.log("saveUser: ", userInfo);
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
      console.log("save: followMap ", followMap)
      return { ...state, followMap};
    }
  },

  subscriptions: {
    setup({ dispatch }) {
      // console.log("setup, dispatching getUser")
      // console.log("setup: ", getUserInfo());
      const userId = getUserInfo();
      dispatch({ type: 'getUser', payload: {userId: userId}});
      dispatch({ type: 'getPosts', payload: {userId: userId, limit: 20, offset: 1 }});
      dispatch({ type: 'getFollowers', payload: {userId: userId, limit: 20, offset: 1 }});
      dispatch({ type: 'getFollowing', payload: {userId: userId, limit: 20, offset: 1 }});


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
