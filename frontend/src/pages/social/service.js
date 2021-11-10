import request from '@/utils/request';
import { DOMAIN, LIMIT, OFFSET } from '@/utils/constants';

export async function SearchSimiliar(params) {
  var url = new URL(`${DOMAIN}/api/advance/similar/${params.tag1}/${params.tag2}`);
  console.log(LIMIT)
  if (!params.offset) {
    params.offset = OFFSET;
    params.limit = LIMIT;
  }
  url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
  return request(url, {
    method: 'GET'
  });
}
