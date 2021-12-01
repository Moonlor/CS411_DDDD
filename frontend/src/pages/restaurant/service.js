import request from '@/utils/request';
import { DOMAIN } from '@/utils/constants';

export async function SearchRestaurants(params) {
  var url = new URL(`${DOMAIN}/api/restaurant/search/${params.keyword}`);
  url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
  return request(url, {
    method: 'GET'
  });
}

export async function SearchRestaurantById(params){
  var url = new URL(`${DOMAIN}/api/restaurant/${params.restaurant_id}`);
  url.search = new URLSearchParams({}).toString()
  // console.log("get restaurant url: ", url)
  return request(url, {
    method: 'GET'
  });
}

export async function SearchRelatedPosts(params){
  var url = new URL(`${DOMAIN}/api/post/restaurant/${params.restaurant_id}`);
  url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
  // console.log("get restaurant url: ", url)
  return request(url, {
    method: 'GET'
  });
}

