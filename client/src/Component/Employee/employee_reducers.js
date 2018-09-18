import { GET_EMPLOYES, GET_EMPLOYEE } from './employee_actions';

export default (state = [], { type, payload }) => {
  switch (type) {
    case GET_EMPLOYES:
      return [...state, ...payload];
    case GET_EMPLOYEE:
      return [...state, payload]
    default:
      return state;
  }
};