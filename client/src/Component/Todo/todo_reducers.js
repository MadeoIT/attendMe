import * as R from 'ramda';
import { 
  GET_TODOS, CREATE_TODO, UPDATE_TODO, DELETE_TODO, UPDATE_TODO_PROPERTIES, RESET_UPDATED_TODOS
} from './todo_actions';

export default function (state = [], { payload, type }) {
  switch (type) {
    case GET_TODOS:
      return payload;
    case CREATE_TODO:
      return [...state, payload];
    case UPDATE_TODO:
      return updateTodo(state, payload);
    case UPDATE_TODO_PROPERTIES:
      return updateTodoProperties(state, payload);
    case RESET_UPDATED_TODOS:
      return resetUpdatedTodos(state);
    case DELETE_TODO:
      return removeTodo(state, payload)
    default:
      return state;
  }
};

/**
 * Reset the updated todo
 * @param {Array<Object>} state array of todos
 * Once the todos have been updated delete the modified property
 */
function resetUpdatedTodos(state) {
  return state.map(todo => {
    if(todo.modified === true) {
      const newTodoObj = {...todo};
      delete newTodoObj.modified;
      return newTodoObj;
    }
    return todo;
  });
}

/**
 * Update a single todo property
 * @param {Array} state array of todos
 * @param {Object} payload {id: 1, propertyToUpdate: 'value'}
 * Find the todo by id, and substitute the updated property
 * Add the property 'modified' to mark that the todo has been modified
 */
function updateTodoProperties(state, payload) {
  const todoToUpdate = state.find(todo => todo.id === payload.id);
  const newTodo = {
    ...R.omit([Object.keys(payload)], todoToUpdate),
    ...payload,
    modified: true
  };
  return updateTodo(state, newTodo);
}

/**
 * Update todo
 * @param {Array} state array of todos
 * @param {Object} payload todo object
 * Update a single todo and place it at the same index of the old one
 */
function updateTodo(state, payload) {
  const index = state.findIndex(todo => todo.id === Number(payload.id))
  return R.insert(
    index, 
    payload,
    removeTodo(state, payload)
  )
};

function removeTodo(state, payload) {
  return state.filter(todo => todo.id !== Number(payload.id));
}

//Selectors
export function selectTodosWithModified(state) {
  return state.filter(todo => todo.modified === true);
}

