import request from '@/utils/request';
import { DOMAIN, OFFSET, LIMIT } from '@/utils/constants';

// export async function GetPosts(params) {
//   var url = new URL(`${DOMAIN}/api/posts`);
//   url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
//   return request(url, {
//     method: 'GET'
//   });
// }
//
// export async function GetPostByID(params) {
//   return request(`${DOMAIN}/api/post/${params.post_id}`, {
//     method: 'GET',
//   });
// }
//
// export async function DeletePostByID(params) {
//   return request(`${DOMAIN}/api/post/${params.post_id}`, {
//     method: 'DELETE',
//   });
// }

export async function GetUserByUserId(params) {
  var url = new URL(`${DOMAIN}/api/user/${params.userId}`);
  url.search = new URLSearchParams({}).toString()
  return request(url, {
    method: 'GET'
  });
}

export async function GetPosts(params) {
  var url = new URL(`${DOMAIN}/api/posts`);
  url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
  return request(url, {
    method: 'GET'
  });
}

export async function GetPostsByUserId(params) {
  var url = new URL(`${DOMAIN}/api/user/${params.userId}/posts`);
  url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
  // console.log("getPostsByUsreId search url", url);
  return request(url, {
    method: 'GET'
  });
}

export async function GetFollowers(params) {
  var url = new URL(`${DOMAIN}/api/user/${params.userId}/follower`);
  url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
  // console.log("getFollower search url", url);
  return request(url, {
    method: 'GET'
  });
}

export async function GetFollowing(params) {
  var url = new URL(`${DOMAIN}/api/user/${params.userId}/following`);
  url.search = new URLSearchParams({offset: params.offset, limit: params.limit}).toString()
  // console.log("getFollowing search url", url);
  return request(url, {
    method: 'GET'
  });
}

export async function GetCheckFollow(params) {
  // params: {userId: userId, followerList: [{user1}, {user2}, ...]}
  var url = new URL(`${DOMAIN}/api/user/follow/${params.userId}/${params.otherId}`);
  url.search = new URLSearchParams().toString()
  // console.log("getCheckFollow search url", url);
  return request(url, {
    method: 'GET'
  });
}

export async function FollowUser(params) {
  var url = new URL(`${DOMAIN}/api/user/follow/${params.user1}/${params.user2}`);
  url.search = new URLSearchParams().toString()
  console.log("followUser search url", url);
  return request(url, {
    method: 'POST'
  });
}

export async function UnfollowUser(params) {
  var url = new URL(`${DOMAIN}/api/user/follow/${params.user1}/${params.user2}`);
  url.search = new URLSearchParams().toString()
  console.log("unfollowUser search url", url);
  return request(url, {
    method: 'DELETE'
  });
}

export async function DeletePostByID(params) {
  return request(`${DOMAIN}/api/post/${params.post_id}`, {
    method: 'DELETE',
  });
}

export async function UpdateProfile(params) {
  var url = new URL(`${DOMAIN}/api/user/${params.userInfo.user_id}/profile`);

  url.search = new URLSearchParams().toString()
  console.log("update profile url: ", url);
  console.log("body: ", JSON.stringify(params.userInfo));
  return request(url, {
    method: 'PUT',
    body: JSON.stringify(params.userInfo)
  });
}
//
// export async function SendPost(params) {
//   return request(`${DOMAIN}/api/post`, {
//     method: 'POST',
//     body: JSON.stringify(params)
//   });
// }
//
// export async function UpdatePost(params) {
//   return request(`${DOMAIN}/api/post`, {
//     method: 'PUT',
//     body: JSON.stringify(params)
//   });
// }
//
// export async function AdvSearch(params) {
//   var url = new URL(`${DOMAIN}/api/advance/likes/${params.likes}`);
//   if (!params.offset) {
//     params.offset = OFFSET;
//     params.limit = LIMIT;
//   }
//   url.search = new URLSearchParams({ offset: params.offset, limit: params.limit }).toString()
//   return request(url, {
//     method: 'GET'
//   });
// }
