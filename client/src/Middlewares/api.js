import axios from 'axios';
import actionType from '../Actions';
import { getHeaders, getCsrfToken, getGeolocation } from '../Utils';
import { onRequestStart, onRequestEnd } from '../Actions/loading_action';
import { onError, onInvalidToken } from '../Actions/error_actions';


/**
 * This middleware build api calls based on the action payload.
 * If the request is a 401 it will dispatch an Invalid Token action to the next middleware.
 * The next middleware will try to obtain another token.
 */
const api = ({ dispatch }) => next => action => {

  if (action.type !== actionType.API) {
    return next(action);
  }

  const { payload: { request, method, onSuccess } } = action;

  dispatch(onRequestStart());

  const csrfToken = getCsrfToken();
  const headers = getHeaders({ 'csrf-token': csrfToken });

  axios[method](...request, headers)
    .then(({ data }) => {

      dispatch(onSuccess(data));
      dispatch(onRequestEnd());
    })
    .catch(({ response }) => {
      
      if (response && response.status === 401) {
        return dispatch(onInvalidToken(action.payload));
      };

      dispatch(onError(response));
      dispatch(onRequestEnd());
    });
};

export default api;