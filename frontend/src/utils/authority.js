export function getAuthority() {
  return localStorage.getItem('delp-token');
}

export function setAuthority(token) {
  if (token == null) {
    return localStorage.removeItem('delp-token');
  }
  return localStorage.setItem('delp-token', token);
}

export function getUserInfo() {
  return JSON.parse(localStorage.getItem('delp-profile'));
}

export function setUserInfo(data) {
  if (data == null) {
    return localStorage.removeItem('delp-profile');
  }
  return localStorage.setItem('delp-profile', JSON.stringify(data));
}
