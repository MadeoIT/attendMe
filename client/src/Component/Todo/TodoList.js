import React from 'react';

const renderTodoList = ({ todos, onDelete }) => todos.map((todo, idx) => {
  return (
    <tr key={idx} className="todos-tr">
      <th>{todo.name}</th>
      <th>
        <button 
          onClick={() => onDelete(todo.id)}
          className='todos-delete'
        >
          Delete
        </button>
      </th>
    </tr>
  )
})

const TodoList = (props) => {
  return (
    <table>
      <tbody>
        <tr>
          <th>Todo</th>
          <th></th>
        </tr>
        {renderTodoList(props)}
      </tbody>
    </table>
  )
}

export default TodoList;