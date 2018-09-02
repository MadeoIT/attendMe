import actionTypes from '../../Actions';

export const LOG_IN = 'LOG_IN';
export const SIGN_UP = 'SIGN_UP';
export const SIGN_UP_GOOGLE = 'SIGN_UP_GOOGLE'
export const LOG_OUT = 'LOG_OUT';
export const authUrl = '/api/auth';

/**
 * Those are 'composite' actions. The first payload and type are for
 * building the API request in the middlewares and the second is to update the store.
 * The latter will get dispatched in case of success response from the API.
 * Option available: 
 * - request: object that takes request parameters;
 * - onSuccess: action to dispatch in case of success;
 * - message: a message to display once the action is terminated;
 * - callback: a simple callback function 
 */

export function login(credentialObj, callback) {
  return {
    type: actionTypes.API_NO_TOKEN,
    payload: {
      request: {
        url: `${authUrl}/login`,
        method: 'post',
        data: credentialObj
      },
      onSuccess: (data) => ({
        type: LOG_IN,
        payload: data
      }),
      message: {
        header: 'Log in successfully'
      },
      callback
    }
  }
};

export function signup(tenantObj, callback) {
  return {
    type: actionTypes.API_NO_TOKEN,
    payload: {
      request: {
        url: `${authUrl}/signup`,
        method: 'post',
        data: tenantObj
      },
      onSuccess: (data) => ({
        type: SIGN_UP,
        payload: data
      }),
      message: {
        header: 'Your user registration was successful',
        content: 'Please check your email to confirm your account!'
      },
      callback
    }
  }
};

export function signupGoogle(csrfToken) {
  return {
    type: LOG_IN,
    payload: { csrfToken }
  }
};

export function logout() {
  return {
    type: actionTypes.API,
    payload: {
      request: {
        url: `${authUrl}/logout`,
        method: 'post',
      },
      onSuccess: () => ({ type: LOG_OUT }),
      message: {
        header: 'Log out successfully'
      }
    }
  }
};

export function confirmEmail(tokenId) {
  return {
    type: actionTypes.API,
    payload: {
      request: {
        url: `${authUrl}/signup/${tokenId}`,
        method: 'get'
      },
      onSuccess: (_) => ({ type: 'NONE' }),
      message: {
        header: 'Congratulations!',
        content: 'Your email has been verified, you can now log in'
      }
    }
  }
};

export function resendConfirmEmail(email) {
  return {
    type: actionTypes.API,
    payload: {
      request: {
        url: `${authUrl}/signup/resend`,
        method: 'post',
        data: { email }
      },
      onSuccess: (_) => ({ type: 'NONE' }),
      message: {
        header: 'Email sent'
      }
    }
  }
};

export function sendResetPasswordEmail(email, callback) {
  return {
    type: actionTypes.API_NO_TOKEN,
    payload: {
      request: {
        url: `${authUrl}/password`,
        method: 'post',
        data: { email }
      },
      onSuccess: (_) => ({ type: 'NONE' }),
      message: {
        header: 'Email has been sent'
      },
      callback
    }
  }
};

export function resetPassword(token, password, callback) {
  return {
    type: actionTypes.API_NO_TOKEN,
    payload: {
      request: {
        url: `${authUrl}/password/${token}`,
        method: 'post',
        data: { password }
      },
      onSuccess: (_) => ({ type: 'NONE' }),
      message: {
        header: 'Your password has been reset'
      },
      callback
    }
  }
};