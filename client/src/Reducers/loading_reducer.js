import actionTypes from '../Actions';

export default (state = 0, { type }) =>  {
  switch (type) {
    case actionTypes.REQUEST_START:
      return state + 1;
    case actionTypes.REQUEST_END:
      return state - 1;
    default:
      return state;
  }
};
