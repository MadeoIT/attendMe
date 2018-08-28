import axios from 'axios';
import actionType from '../Actions';
import { getHeaders } from '../Utils';
import { onRequestStart, onRequestEnd } from '../Actions/loading_action';
import { onError, onInvalidToken } from '../Actions/error_actions';
import { onMessage } from '../Actions/message_actions';

/**
 * This middleware build api calls based on the action payload (request).
 * If in the action a callback has been specified it will execute it.
 * If the request is a 401 it will dispatch an Invalid Token action to the next middleware.
 * The next middleware will try to obtain another token.
 */
const api = ({ dispatch, getState }) => next => action => {

  if (action.type !== actionType.API && action.type !== actionType.API_NO_TOKEN) {
    return next(action);
  }

  const { request, onSuccess, message, callback } = action.payload;

  dispatch(onRequestStart());

  const csrfToken = getState().auth.csrfToken;

  const headers = getHeaders({ 'csrf-token': csrfToken });
  const options = {
    headers, withCredentials: true
  }

  axios(request.url, {
    method: request.method,
    data: request.data,
    ...options
  })
    .then(({ data }) => {

      dispatch(onSuccess(data));
      dispatch(onRequestEnd());

      if (message) dispatch(onMessage(message));
      if (callback) callback();
    })
    .catch(({ response }) => {

      if (response && response.status === 401 && action.type !== actionType.API_NO_TOKEN) {
        return dispatch(onInvalidToken(action.payload));
      };

      dispatch(onError(response));
      dispatch(onRequestEnd());
    });
};

export default api;