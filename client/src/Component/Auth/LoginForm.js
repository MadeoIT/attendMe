import React from 'react';
import { Button, Form, Segment, Grid, Divider, Label } from 'semantic-ui-react';
import GoogleButton from './GoogleButton';

const LoginForm = (props) => {
  return (
    <Grid centered columns={2}>
      <Grid.Column>
        <Segment raised>

          <Form
            className="login-form"
            onSubmit={(e) => props.onFormSubmit(e)}
            loading={props.loading > 0 ? true : false}
          >
            <Form.Input
              fluid icon='mail' iconPosition='left'
              required
              type="text"
              className="login-email"
              name="email"
              onChange={(e) => props.onChange(e)}
              value={props.email || ''}
            />
            <Form.Input
              fluid icon='lock' iconPosition='left'
              required
              type="password"
              className="login-password"
              name="password"
              value={props.password || ''}
              onChange={(e) => props.onChange(e)}
            />
            <a onClick={props.toggle} style={{ cursor: 'pointer' }}>
              Forgot Password?
            </a>
            <br /><br />
            <Button primary fluid size='large'>Log in</Button>
          </Form>

          <Divider horizontal>Or</Divider>

          <GoogleButton loading={props.loading} />

        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default LoginForm;