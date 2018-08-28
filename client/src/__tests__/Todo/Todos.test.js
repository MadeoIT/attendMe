import React from 'react';
import TodosConnected, { Todos } from '../../Component/Todo/Todos';
import { shallow } from 'enzyme';

const DOMelems = {
  todoTableRow: '.todos-tr',
  todoContent: '.todos-input-content',
  TodoForm: 'TodoForm'
}

describe('Todos', () => {
  const todos = [
    { id: 1, content: 'todo1', completed: false },
    { id: 2, content: 'todo2', completed: false },
  ];

  describe('Todos component', () => {
    let Component, spyFormSubmit, spyDelete, spyUpdate;
    const getAllTodos = jest.fn();
    const createTodo = jest.fn();
    const deleteTodo = jest.fn();
    const updateTodo = jest.fn();

    beforeEach(() => {
      spyFormSubmit = jest.spyOn(Todos.prototype, 'onFormSubmit');
      spyUpdate = jest.spyOn(Todos.prototype, 'onUpdate');
      spyDelete = jest.spyOn(Todos.prototype, 'onDelete');
      Component = shallow(<Todos
        getAllTodos={getAllTodos}
        createTodo={createTodo}
        deleteTodo={deleteTodo}
        updateTodo={updateTodo}
        todos={todos}
        modifiedTodos={[]}
      />);
    });

    it('should render without crash', () => {
      expect(getAllTodos).toHaveBeenCalled();
      expect(Component).toBeDefined();
    });

    it('should render a list of 2 todos', () => {
      expect(Component
        .find('TodoList')
        .dive()
        .find('.todos-tr')
      ).toHaveLength(2);
    })

    it('should sumbit the form', () => {
      Component
        .find(DOMelems.TodoForm)
        .dive()
        .find('.todos-form')
        .simulate('submit', { preventDefault() { } })
      Component.update();

      expect(spyFormSubmit).toHaveBeenCalled();
    });

    it('should update the state with the todo', () => {
      Component
        .find(DOMelems.TodoForm)
        .dive()
        .find(DOMelems.todoContent)
        .simulate('change', { target: { name: 'content', value: 'todo3' } })
      Component.update();

      expect(Component
        .find(DOMelems.TodoForm)
        .dive()
        .find(DOMelems.todoContent)
        .prop('value')
      ).toEqual('todo3')
    });

    it('should call the delete function', () => {
      Component
        .find('TodoList')
        .dive()
        .find('.todos-delete')
        .at(0)
        .simulate('click');
      Component.update();

      expect(spyDelete).toHaveBeenCalled();
    })
  });

});