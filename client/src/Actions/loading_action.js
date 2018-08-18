import actionTypes from './index';

export function onRequestStart() {
  return {
    type: actionTypes.REQUEST_START,
    payload: {}
  }
}

export function onRequestEnd() {
  return {
    type: actionTypes.REQUEST_END,
    payload: {}
  }
}