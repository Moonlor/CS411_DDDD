export function getAuthority() {
  return "is1fpGG9J8Zq19OGi67DxA";
  // return localStorage.getItem('docker-mgr-token');
}

export function setAuthority(token) {
  return localStorage.setItem('docker-mgr-token', token);
}

export function getUserInfo() {
  return "GNOX8PWWmaeKO1_3UlTygg";
  // return JSON.parse(localStorage.getItem('docker-mgr-profile'));
}

export function setUserInfo(data) {
  return localStorage.setItem('docker-mgr-profile', JSON.stringify(data));
}
