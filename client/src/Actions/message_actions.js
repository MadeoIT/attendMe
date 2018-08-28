import actionTypes from '../Actions';

export function onMessage(message) {
  return {
    type: actionTypes.RESPONSE_MSG,
    payload: message
  }
};

export function resetMessageState() {
  return {
    type: actionTypes.RESET_MSG,
    payload: {}
  }
}