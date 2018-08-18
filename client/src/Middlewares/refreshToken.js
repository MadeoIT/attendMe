import axios from 'axios';
import { getHeaders, getCsrfToken, getGeolocation } from '../Utils';
import { onError } from '../Actions/error_actions';
import { onRequestEnd } from '../Actions/loading_action';
import actionTypes from '../Actions';

const baseUrl = process.env.BASE_URL

/**
 * This middleware gets invoked in case of 401
 * If the first request fails with a 401, it try to obtain a new token.
 * If the token is obtained it sends the previous request.l
 * Otherwise it send the action to the error handler middleware.
 */
export default ({ dispatch }) => next => async action => {
  if (action.type === actionTypes.INVALID_TOKEN) {
    try {
      //Request to obtain a new token
      await axios.post(`${baseUrl}/api/auth/relogin`);

      //If valid execute the previous request
      const { method, request, onSuccess } = action.payload;

      const csrfToken = getCsrfToken();
      const headers = getHeaders({ 'csrf-token': csrfToken })

      const response = await axios[method](...request, headers);

      dispatch(onSuccess(response.data));
      dispatch(onRequestEnd());
      return;

    } catch (error) {
      dispatch(onError(error.response));
      dispatch(onRequestEnd());
      return;
    }
  }

  next(action);
}