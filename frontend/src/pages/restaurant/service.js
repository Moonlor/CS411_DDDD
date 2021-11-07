import request from '@/utils/request';
import { DOMAIN } from '@/utils/constants';

export async function SearchResuaurant(params) {
  var url = new URL(`${DOMAIN}/api/restaurant/search/${params.keyword}`);
  url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
  return request(url, {
    method: 'GET'
  });
}
