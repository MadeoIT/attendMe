import { GET_TODOS, CREATE_TODO, DELETE_TODO } from './todo_actions';

export default function (state = [], { payload, type }) {
  switch (type) {
    case GET_TODOS:
      return payload;
    case CREATE_TODO:
      return [...state, payload];
    case DELETE_TODO:
      return [...state.filter(todo => todo.id !== payload.id)];
    default:
      return state;
  }
}