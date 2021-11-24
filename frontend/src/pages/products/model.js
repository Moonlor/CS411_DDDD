export default {
  namespace: 'products',
  state: {products: [
    { name: 'dva', id: 1 },
    { name: 'antd', id: 2 },
      ]},
  effects: {
    *getUser({ payload }, {call, put}){
      yield put({ type: 'saveUser', payload: { userInfo: 'userInfo' }})
    }
  },
  reducers: {
    'delete'(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    },
    // saveUser(state, {payload: {userInfo} }){
    //   return {...state, userInfo};
    // }
  },
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //
  //   }
  // }
};
