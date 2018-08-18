import actionTypes from '../../Actions';
import { onError } from '../../Actions/error_actions';
import { url } from '../../config';

export const LOG_IN = 'LOG_IN';
export const SIGN_UP = 'SIGN_UP';
export const authUrl = `${url}/api/auth`;

export function setTenant(data) {
  return {
    type: LOG_IN,
    payload: data
  }
}

export function createTenant(_) {
  return {
    type: SIGN_UP
  }
}

export function login(credentialObj) {
  return {
    type: actionTypes.API,
    payload: {
      request: [
        `${authUrl}/login`,
        credentialObj
      ],
      method: 'post',
      onSuccess: setTenant
    }
  }
}

export function signup(tenantObj) {
  return {
    type: actionTypes.API,
    payload: {
      request: [
        `${authUrl}/signup`,
        tenantObj
      ],
      method: 'post',
      onSuccess: createTenant
    }
  }
}