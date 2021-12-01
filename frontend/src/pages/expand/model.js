import { RunPro} from './service';
import moment from 'moment';
import { getAuthority, getUserInfo } from '@/utils/authority';
import { notification } from 'antd';

export default {
    namespace: 'proc',

    state: {
        dataList: undefined,
        offset: undefined,
        limit: undefined,
    },

    effects: {
        *runPro({ payload }, { call, put }) {
            const response = yield call(RunPro, payload);

            yield put({
                type: 'save',
                payload: {
                    data: response.data,
                    offset: response.pageNumber,
                    limit: response.pageSize,
                },
            });

        },
    },

    reducers: {
        save(state, { payload: { data: dataList, limit, offset } }) {
            return { ...state, dataList, limit, offset };
        },
    },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
            });
        },
    },

};
