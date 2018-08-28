import React from 'react';
import { Table, Button, Grid, Segment, Checkbox, Icon, TableCell } from 'semantic-ui-react';
import TodoCell from './TodoCell';

const renderTodoList = ({ todos, onDelete, updateTodoProperties }) => todos.map((todo, idx) => {
  return (
    <Table.Row key={idx} className="todos-tr">

      <Table.Cell>
        <TodoCell
          updateTodoProperties={updateTodoProperties}
          data={{ value: todo.content, id: todo.id, name: 'content' }}
        />
      </Table.Cell>

      <Table.Cell>
        <Checkbox
          checked={todo.completed}
          onChange={(e) => updateTodoProperties(todo.id, { completed: !todo.completed })}
        />
      </Table.Cell>
      <Table.Cell>
        <Button
          onClick={() => onDelete(todo.id)}
          className='todos-delete'
          size='mini'
        >
          <Icon name='trash' />
        </Button>
      </Table.Cell>
    </Table.Row>
  )
});

const renderSaveButton = ({ modifiedTodos, onUpdate }) => {
  return modifiedTodos.length > 0
    ? <Button positive onClick={onUpdate} size='tiny'>Save</Button>
    : null
}

const TodoList = (props) => {
  return (
    <Grid centered columns={2}>
      <Grid.Column>
        <Segment raised>
          <Table>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Todo</Table.Cell>
                <Table.Cell></Table.Cell>
                <Table.Cell>
                  {renderSaveButton(props)}
                </Table.Cell>
              </Table.Row>
              {renderTodoList(props)}
            </Table.Body>
          </Table>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default TodoList;