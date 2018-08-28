import actionTypes from '../Actions';

export default (state = null, { payload, type }) => {
  switch (type) {
    case actionTypes.RESPONSE_MSG:
      return payload ? payload : null;
    case actionTypes.RESET_MSG:
      return null;
    default:
      return state;
  }
}