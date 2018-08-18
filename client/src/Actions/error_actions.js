import actionTypes from './index';

export function onError(error) {
  return {
    type: actionTypes.RESPONSE_ERROR,
    payload: {
      status: error ? error.status : 500,
      message: error ? error.message : 'Something went wrong',
    }
  }
}

export function resetErrorState() {
  return {
    type: actionTypes.RESET_ERROR,
    payload: {}
  }
}

export function onInvalidToken(payload) {
  return {
    type: actionTypes.INVALID_TOKEN,
    payload
  }
}

