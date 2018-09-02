import { LOG_IN, LOG_OUT, SIGN_UP } from './auth_actions';

export default function (state = { isAuthorized: false }, { type, payload }) {
  switch (type) {
    case SIGN_UP:
      return {
        email: payload.email
      }
    case LOG_IN:
      return { 
        isAuthorized: !!payload.csrfToken,
        csrfToken: payload.csrfToken,
        id: payload.id,
        email: payload.email
      };
    case LOG_OUT:
      return logout()
    default:
      return state;
  }
};

function logout() {
  localStorage.removeItem('csrf-token'); //Anti-pattern side effect
  return { isAuthorized: false }
};
