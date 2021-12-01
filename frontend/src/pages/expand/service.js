import request from '@/utils/request';
import { DOMAIN, LIMIT, OFFSET } from '@/utils/constants';

export async function RunPro(params) {
    var url = new URL(`${DOMAIN}/api/store_procedure/${params.likes}`);
    // console.log(LIMIT)
    if (!params.offset) {
        params.offset = OFFSET;
        params.limit = LIMIT;
    }
    url.search = new URLSearchParams({ offset: params.offset, limit: params.limit, user_id: params.user_id }).toString()
    return request(url, {
        method: 'POST'
    });
}