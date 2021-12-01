import request from '@/utils/request';
import { DOMAIN, OFFSET, LIMIT } from '@/utils/constants';

export async function GetPosts(params) {
  var url = new URL(`${DOMAIN}/api/posts`);
  if (!params.offset) {
    params.offset = OFFSET;
    params.limit = LIMIT;
  }
  url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
  return request(url, {
    method: 'GET'
  });
}

export async function GetPostByID(params) {
  return request(`${DOMAIN}/api/post/${params.post_id}`, {
    method: 'GET',
  });
}

export async function DeletePostByID(params) {
  return request(`${DOMAIN}/api/post/${params.post_id}`, {
    method: 'DELETE',
  });
}

export async function SendPost(params) {
  return request(`${DOMAIN}/api/post`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}

export async function UpdatePost(params) {
  return request(`${DOMAIN}/api/post`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

export async function LikeByID(params) {
  return request(`${DOMAIN}/api/post/${params.post_id}/like`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

export async function DislikeByID(params) {
  return request(`${DOMAIN}/api/post/${params.post_id}/dislike`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}

export async function AdvSearch(params) {
  var url = new URL(`${DOMAIN}/api/advance/likes/${params.likes}`);
  if (!params.offset) {
    params.offset = OFFSET;
    params.limit = LIMIT;
  }
  url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
  return request(url, {
    method: 'GET'
  });
}
