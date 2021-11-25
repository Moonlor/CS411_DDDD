import request from '@/utils/request';
import { DOMAIN } from '@/utils/constants';

export async function accountLogin(params) {
  return request(`${DOMAIN}/api/login`, {
    method: 'PUT',
    body: JSON.stringify(params)
  });
}
