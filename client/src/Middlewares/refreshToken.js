import axios from 'axios';
import { getHeaders } from '../Utils';
import { onError } from '../Actions/error_actions';
import { onRequestEnd } from '../Actions/loading_action';
import actionTypes from '../Actions';

import { url } from '../config';
import { onMessage } from '../Actions/message_actions';

/**
 * This middleware gets invoked in case of 401 error status in the previous middleware (api)
 * It will first try to obtain a new token from the 'relogin' end point.
 * If the token is obtained it sends the previous request.
 * Otherwise it will dispatch an error.
 */
export default ({ dispatch, getState }) => next => async action => {
  if (action.type === actionTypes.INVALID_TOKEN) {
    try {
      
      const csrfToken = getState().auth.csrfToken;

      const headers = getHeaders({ 'csrf-token': csrfToken });

      const options = {
        headers, withCredentials: true
      };

      //Request to obtain a new token (attached to the cookie)
      await axios(`${url}/api/auth/relogin`, {
        method: 'post', 
        ...options
      });

      //If valid execute the previous request
      const { request, onSuccess, callback, message } = action.payload;
      
      const response = await axios(request.url, {
        method: request.method,
        data: request.data,
        ...options
      });

      dispatch(onSuccess(response.data));
      dispatch(onMessage(message));
      dispatch(onRequestEnd());

      if (callback) {
        callback();
      };

      return;

    } catch (error) {
      dispatch(onError(error.response));
      dispatch(onRequestEnd());
      return;
    }
  }

  next(action);
}