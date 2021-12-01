import { GetByPostID, DeleteCommentByID, SendComment } from './service';
import moment from 'moment';
import { getAuthority, getUserInfo } from '@/utils/authority';
import { notification } from 'antd';

export default {
    namespace: 'comment',

    state: {
        commentList: undefined,
        offset: undefined,
        limit: undefined,
    },

    effects: {
        *getByPostID({ payload }, { call, put }) {
            const response = yield call(GetByPostID, payload);

            yield put({
                type: 'save',
                payload: {
                    comments: response.data,
                    offset: response.pageNumber,
                    limit: response.pageSize,
                },
            });

        },

        *send({ payload }, { call, put }) {
            payload.date = moment().format('YYYY-MM-DD HH:mm:ss');
            yield call(SendComment, payload);

            const response = yield call(GetByPostID, payload);

            yield put({
                type: 'save',
                payload: {
                    comments: response.data,
                    offset: response.pageNumber,
                    limit: response.pageSize,
                },
            });

        },

        *delete({ payload }, { call, put }) {
            yield call(DeleteCommentByID, payload);

            const response = yield call(GetByPostID, payload);

            yield put({
                type: 'save',
                payload: {
                    comments: response.data,
                    offset: response.pageNumber,
                    limit: response.pageSize,
                },
            });

        },
    },

    reducers: {
        save(state, { payload: { comments: commentList, limit, offset } }) {
            return { ...state, commentList, limit, offset };
        },
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
            });
        },
    },

};
