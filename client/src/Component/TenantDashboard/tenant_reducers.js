import { GET_TENANT } from './tenant_actions';

export default (state = {}, { type, payload }) => {
  switch (type) {
    case GET_TENANT:
      return payload;
    default:
      return state;
  }
}