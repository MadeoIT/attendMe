import actionTypes from '../../Actions';
import { url } from '../../config';

export const GET_TODOS = 'GET_TODOS';
export const CREATE_TODO = 'CREATE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const ERROR_TODO = 'ERROR_TODO';
export const todoUrl = `${url}/api/todos`;

export function setTodos(todos) {
  return {
    type: GET_TODOS,
    payload: todos
  }
};

export function setTodo(todo) {
  return {
    type: CREATE_TODO,
    payload: todo
  }
};

export function unsetTodo(todo) {
  return {
    type: DELETE_TODO,
    payload: todo
  }
}

export function getAllTodos() {
  return {
    type: actionTypes.API,
    payload: {
      request: [
        todoUrl
      ],
      method: 'get',
      onSuccess: setTodos
    }
  }
};

export function createTodo(todoObj) {
  return {
    type: actionTypes.API,
    payload: {
      request: [
        todoUrl,
        todoObj
      ],
      method: 'post',
      onSuccess: setTodo   
    }
  }
}

export function deleteTodo(todoId) {
  return {
    type: actionTypes.API,
    payload: {
      request: [
        `${todoUrl}/${todoId}`
      ],
      method: 'delete',
      onSuccess: unsetTodo
    }
  }
}