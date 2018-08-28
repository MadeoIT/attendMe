import actionTypes from '../../Actions';

export const GET_TODOS = 'GET_TODOS';
export const CREATE_TODO = 'CREATE_TODO';
export const UPDATE_TODO = 'UPDATE_TODO';
export const UPDATE_TODO_PROPERTIES = 'UPDATE_TODO_PROPERTIES';
export const DELETE_TODO = 'DELETE_TODO';
export const ERROR_TODO = 'ERROR_TODO';
export const todoUrl = '/api/todos';

export function updateTodoProperties(id, property) {
  return {
    type: UPDATE_TODO_PROPERTIES,
    payload: {
      id, ...property
    }
  }
}

/**
 * Those are 'composite' actions. The first payload and type are for
 * building the API request in the middlewares and the second is to update the store.
 * The latter will get dispatched in case of success response from the API.
 * Option available: 
 * - request: object that takes request parameters;
 * - onSuccess: action to dispatch in case of success;
 * - message: a message to display once the action is terminated;
 * - callback: a simple callback function 
 */

export function getAllTodos() {
  return {
    type: actionTypes.API,
    payload: {
      request: {
        url: todoUrl,
        method: 'get',
      },
      onSuccess: (todos) => ({
        type: GET_TODOS,
        payload: todos
      })
    }
  }
};

export function createTodo(todoObj) {
  return {
    type: actionTypes.API,
    payload: {
      request: {
        url: todoUrl,
        data: todoObj,
        method: 'post'
      },
      onSuccess: (todo) => ({
        type: CREATE_TODO,
        payload: todo
      })
    }
  }
};

export function updateTodo(todoObj, todoId) {
  return {
    type: actionTypes.API,
    payload: {
      request: {
        url: `${todoUrl}/${todoId}`,
        data: todoObj,
        method: 'put'
      },
      onSuccess: (todo) => ({
        type: UPDATE_TODO,
        payload: todo
      })
    }
  }
};

export function updateTodoBatch(todos) {
  return {
    type: actionTypes.API,
    payload: {
      request: {
        url: todoUrl,
        data: todos,
        method: 'put'
      },
      onSuccess: (_) => ({
        type: 'NONE',
        payload: {}
      }),
      message: {
        header: 'Saved...'
      }
    }
  }
}

export function deleteTodo(todoId) {
  return {
    type: actionTypes.API,
    payload: {
      request: {
        url: `${todoUrl}/${todoId}`,
        method: 'delete'
      },
      onSuccess: (todo) => ({
        type: DELETE_TODO,
        payload: todo
      })
    }
  }
};