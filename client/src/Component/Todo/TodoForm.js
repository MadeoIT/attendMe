import React from 'react';
import { Button, Form, Segment, Grid, Icon } from 'semantic-ui-react';

const TodoForm = (props) => {
  return (
    <Grid centered columns={2}>
      <Grid.Column>
        <Segment raised>
          <Form onSubmit={(e) => props.onFormSubmit(e)} className="todos-form" >
            <Form.Input
              required
              className="todos-input-content"
              onChange={(e) => props.onChange(e)}
              type="text"
              name="content"
              value={props.content || ''}
            />
            <Button type="submit" className="todos-save" primary size='tiny'>
              Add
            </Button>
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default TodoForm;