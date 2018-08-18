import todo_reducers from '../../Component/Todo/todo_reducers';
import { GET_TODOS } from '../../Component/Todo/todo_actions'

describe('Todo Reducer', () => {
  it('GET_TODOS', () => {
    const action = {
      type: GET_TODOS,
      payload: [{name: 'todo'}]
    };
    const state = todo_reducers([], action);

    expect(state.length).toBe(1);
  });

  it('should handle unknown type', () => {
    const action = {
      type: 'UNKNOWN',
      payload: [{name: 'todo'}]
    };
    const state = todo_reducers([], action);

    expect(state.length).toBe(0);
  });
})