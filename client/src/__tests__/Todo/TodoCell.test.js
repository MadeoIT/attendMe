import { Todos } from "../../Component/Todo/Todos";
import { mount } from 'enzyme';
import React from 'react';
import TodoCell from "../../Component/Todo/TodoCell";

const DOMelems = {
  todoCellInput: '.todos-cell-input',
  todoCellData: '.todos-cell-data'
};

describe('TodoCell component', () => {
  let Component, spyBlur;
  const getAllTodos = jest.fn();
  const updateTodoProperties = jest.fn();
  const todos = [
    { id: 1, content: 'todo1', completed: false },
    { id: 2, content: 'todo2', completed: false }
  ];

  beforeEach(() => {
    spyBlur = jest.spyOn(TodoCell.prototype, 'onBlur');
    Component = mount(<Todos
      getAllTodos={getAllTodos}
      updateTodoProperties={updateTodoProperties}
      todos={todos}
      modifiedTodos={[]}
    />)
  });

  afterEach(() => {
    Component.unmount();
  })

  it('should click on the cell and focus on the input', () => {
    Component
      .find(DOMelems.todoCellData).at(0)
      .prop('onClick')();
    Component.update();

    const input = Component
      .find(DOMelems.todoCellInput)

    expect(input).toHaveLength(2);
    expect(input.at(0).prop('value')).toEqual('todo1');
  });

  it('should blur on the input and update the state', () => {
    const event = { target: { name: 'content', value: 'todo1 update' } }
    Component
      .find(DOMelems.todoCellData).at(0)
      .prop('onClick')();
    Component.update();
    Component
      .find(DOMelems.todoCellInput).at(0)
      .prop('onChange')(event)

    expect(updateTodoProperties).toHaveBeenCalled();
    Component.update();
    Component
      .find(DOMelems.todoCellInput).at(0)
      .prop('onBlur')();
    Component.update();

    expect(spyBlur).toHaveBeenCalled();
  });
});