import { combineReducers } from 'redux';
import todo_reducers from '../Component/Todo/todo_reducers';
import auth_reducers from '../Component/Auth/auth_reducers';
import loading_reducer from '../Reducers/loading_reducer';
import error_reducer from '../Reducers/error_reducer';

export default combineReducers({
  todos: todo_reducers,
  auth: auth_reducers,
  loading: loading_reducer,
  error: error_reducer
})