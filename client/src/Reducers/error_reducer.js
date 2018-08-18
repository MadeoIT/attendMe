import actionTypes from '../Actions';

export default (state = null, { type, payload = { status: 500 } }) => {
  if (type === actionTypes.RESPONSE_ERROR) {
    return assignErrorMessage(payload);
  };

  if(type === actionTypes.RESET_ERROR){
    return null
  };

  return state;
};

function assignErrorMessage(payload) {
  switch (payload.status) {
    case 500:
      return payload.message || 'Something went wrong';
    case 400:
      return payload.message || 'Bad request';
    case 404:
      return payload.message || 'Resource not found';
    case 401:
      return payload.message || 'Unauthorized';
    default:
      return 'Something went wrong'
  };
}