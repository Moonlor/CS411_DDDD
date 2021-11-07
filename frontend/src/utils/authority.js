export function getAuthority() {
  return "is1fpGG9J8Zq19OGi67DxA";
  // return localStorage.getItem('docker-mgr-token');
}

export function setAuthority(token) {
  return localStorage.setItem('docker-mgr-token', token);
}

export function getUserInfo() {
  return "is1fpGG9J8Zq19OGi67DxA";
  // return JSON.parse(localStorage.getItem('docker-mgr-user'));
}

export function setUserInfo(data) {
  return localStorage.setItem('docker-mgr-user', JSON.stringify(data));
}
