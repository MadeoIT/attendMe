import React from 'react';
import { connect } from 'react-redux';
import * as actions from './todo_actions';
import TodoList from './TodoList';
import TodoForm from './TodoForm';

class Todos extends React.Component {
  constructor(...args) {
    super(...args)

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.state = {}
  }

  componentDidMount() {
    this.props.getAllTodos();
  }

  onFormSubmit(e) {
    e.preventDefault();
    this.props.createTodo({ content: this.state.content });
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onDelete(id) {
    this.props.deleteTodo(id);
  }

  render() {
    return (
      <div>
        <TodoForm
          onChange={this.onChange}
          {...this.state}
          onFormSubmit={this.onFormSubmit}
        />
        <TodoList
          todos={this.props.todos}
          onDelete={this.onDelete}
        />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  todos: state.todos
});

export default connect(mapStateToProps, actions)(Todos);