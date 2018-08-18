import { SIGN_UP, LOG_IN } from './auth_actions';

export default function (state = { isAuthorized: false }, { type, payload }) {
  switch (type) {
    case LOG_IN:
      return login(payload);
    default:
      return state;
  }
}

function login(payload) {
  if(payload.csrfToken){
    localStorage.setItem('csrf-token', payload.csrfToken);
  };
  return { isAuthorized: true };
}