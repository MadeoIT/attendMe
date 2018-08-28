import React from 'react';
import Todos from "../../Component/Todo/Todos";
import Root from '../../Root';
import { mount } from 'enzyme';

const DOMelems = {
  todoContentUpdate: '.todos-cell-input',
  todoContent: '.todos-cell-data'
};

describe('Todo component integration test', () => {
  let Component;
  const todos = [
    { id: 1, content: 'todo1', completed: false },
    { id: 2, content: 'todo2', completed: false },
  ];
  const getAllTodos = jest.fn();

  beforeEach(() => {
    Component = mount(
      <Root>
        <Todos 
          getAllTodos={getAllTodos}
          todos={todos}
        />
      </Root>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    Component.unmount();
  });

  it('should render without crashing', () => {
    expect(Component).toBeDefined();
  });

  it.skip('should have initial state', () => {
    Component.update();
    expect(getAllTodos).toHaveBeenCalledTimes(1);
    expect(Component.find('Todos').prop('todos')).toHaveLength(2);
  })

  it.skip('should update the todo state from the Cell input', () => {
    Component
      .find('.todos-cell-data')
      .simulate('click');
      
    Component.update();
    Component
      .find(DOMelems.todoContentUpdate).at(0)
      .prop('onChange')();
    Component.update();
    const input = Component
      .find(DOMelems.todoContentUpdate).at(0);

    expect(input.prop('value')).toEqual('updated todo 1')
  });

})