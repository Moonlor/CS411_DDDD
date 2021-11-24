export function getAuthority() {
  return "is1fpGG9J8Zq19OGi67DxA";
  // return localStorage.getItem('docker-mgr-token');
}

export function setAuthority(token) {
  return localStorage.setItem('docker-mgr-token', token);
}

export function getUserInfo() {
  return "6ma0naV9VyXvUwFgyLmi_w";
  // return JSON.parse( `{
  //     "birth_date": "07/16/1975, 08:54:36",
  //     "email": "qdykUOG@gmail.com",
  //     "first_name": "Linna",
  //     "gender": "1",
  //     "last_name": "Danielle",
  //     "mobile": "268-792-3284",
  //     "password": ",f\"2fDU_",
  //     "user_id": "-0aZWYi2YicFaLxTru96nA"
  //   }`
  // )
  // return {
  //   "birth_date": "07/16/1975, 08:54:36",
  //   "email": "qdykUOG@gmail.com",
  //   "first_name": "Linna",
  //   "gender": "1",
  //   "last_name": "Danielle",
  //   "mobile": "268-792-3284",
  //   "password": ",f\"2fDU_",
  //   "user_id": "-0aZWYi2YicFaLxTru96nA"
  // };
  // return JSON.parse(localStorage.getItem('docker-mgr-profile'));
}

export function setUserInfo(data) {
  return localStorage.setItem('docker-mgr-profile', JSON.stringify(data));
}
