import React from 'react';
import { connect } from 'react-redux';
import * as actions from './todo_actions';
import { resetState } from '../../Utils';
import TodoList from './TodoList';
import TodoForm from './TodoForm';
import { selectTodosWithModified } from './todo_reducers';

export class Todos extends React.Component {
  constructor(...args) {
    super(...args)

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onUpdate = this.onUpdate.bind(this);

    this.state = {
      isFocused: false
    }
  }

  componentDidMount() {
    this.props.getAllTodos();
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.props.createTodo({ content: this.state.content });
    resetState(this.state, this);
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onDelete(id) {
    this.props.deleteTodo(id);
  }

  onUpdate() {
    this.props.updateTodoBatch(this.props.todos);
  }

  render() {
    return (
      <div>
        <TodoForm
          onChange={this.onChange}
          onFormSubmit={this.onFormSubmit}
          {...this.state}
        />
        <TodoList
          updateTodoProperties={this.props.updateTodoProperties}
          todos={this.props.todos}
          onUpdate={this.onUpdate}
          onDelete={this.onDelete}
          modifiedTodos={this.props.modifiedTodos}
          {...this.state}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  todos: state.todos,
  modifiedTodos: selectTodosWithModified(state.todos)
});

export default connect(mapStateToProps, actions)(Todos);