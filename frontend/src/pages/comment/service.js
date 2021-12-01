import request from '@/utils/request';
import { DOMAIN, LIMIT, OFFSET } from '@/utils/constants';

export async function GetByPostID(params) {
    var url = new URL(`${DOMAIN}/api/post_comment/${params.post_id}`);
    // console.log(LIMIT)
    if (!params.offset) {
        params.offset = OFFSET;
        params.limit = LIMIT;
    }
    url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
    return request(url, {
        method: 'GET'
    });
}

export async function DeleteCommentByID(params) {
    return request(`${DOMAIN}/api/post_comment/${params.comment_id}`, {
        method: 'DELETE',
    });
}

export async function SendComment(params) {
    return request(`${DOMAIN}/api/post_comment`, {
        method: 'POST',
        body: JSON.stringify(params)
    });
}