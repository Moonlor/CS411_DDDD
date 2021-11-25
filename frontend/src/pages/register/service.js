import request from '@/utils/request';
import { DOMAIN } from '@/utils/constants';

export async function userRegister(params) {
  return request(`${DOMAIN}/api/signup`, {
    method: 'POST',
    body: JSON.stringify(params)
  });
}
