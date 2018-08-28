import todo_reducers from '../../Component/Todo/todo_reducers';
import { 
  GET_TODOS, UPDATE_TODO, DELETE_TODO, CREATE_TODO, UPDATE_TODO_PROPERTIES
} from '../../Component/Todo/todo_actions'

describe('Todo Reducer', () => {
  it('it should GET_TODOS', () => {
    const action = {
      type: GET_TODOS,
      payload: [{ name: 'todo' }]
    };
    const state = todo_reducers([], action);

    expect(state.length).toBe(1);
  });

  it('should CREATE_TODO', () => {
    const state = [
      { id: 1, content: 'todo1', completed: false },
    ];
    const action = {
      type: CREATE_TODO,
      payload: { id: 2, content: 'todo2', completed: false }
    };
    const newState = todo_reducers(state, action);

    expect(newState).toHaveLength(2);
    expect(newState).toContain(action.payload);
  })

  it('should UPDATE_TODO', () => {
    const state = [
      { id: 1, content: 'todo1', completed: false },
      { id: 2, content: 'todo2', completed: false },
      { id: 3, content: 'todo3', completed: false }
    ];
    const action = {
      type: UPDATE_TODO,
      payload: { id: 2, content: 'todo2 updated', completed: false }
    };
    const newState = todo_reducers(state, action);

    expect(newState).toHaveLength(3);
    expect(newState[1]).toMatchObject(action.payload)
    expect(newState).not.toContain(state[1]);
  });

  it('should UPDATE_TODO_PROPERTIES', () => {
    const state = [
      { id: 1, content: 'todo1', completed: false },
      { id: 2, content: 'todo2', completed: false },
      { id: 3, content: 'todo3', completed: false }
    ];
    const action = {
      type: UPDATE_TODO_PROPERTIES,
      payload: { id: 3, content: 'todo3 updated'}
    };
    const newState = todo_reducers(state, action);

    expect(newState).toHaveLength(3);
    expect(newState[2]).toMatchObject({ 
      id: 3, content: 'todo3 updated', completed: false, modified: true
    })
    expect(newState).not.toContain(state[2]);
  })

  it('should DELETE_TODO', () => {
    const state = [
      { id: 1, content: 'todo1', completed: false },
      { id: 2, content: 'todo2', completed: false },
      { id: 3, content: 'todo3', completed: false }
    ];
    const action = {
      type: DELETE_TODO,
      payload: { id: 2 }
    };
    const newState = todo_reducers(state, action);

    expect(newState).toHaveLength(2);
    expect(newState).not.toContain(state[1]);
  });

  it('should handle unknown type', () => {
    const action = {
      type: 'UNKNOWN',
      payload: [{ name: 'todo' }]
    };
    const state = todo_reducers([], action);

    expect(state.length).toBe(0);
  });
});