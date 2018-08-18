import React from 'react';
import { Button, Checkbox, Form, Segment, Icon } from 'semantic-ui-react'
import { Grid } from 'semantic-ui-react'

const renderOauthLink = (props) => {
  return props.loading > 0 ? <div></div> : 
  (
    <Segment raised>
      <Button color='google plus' fluid size='large'>
        <Icon name='google plus' /> Google Plus
          </Button><br />
      <Button color='facebook' fluid size='large'>
        <Icon name='facebook' /> Facebook
          </Button>
    </Segment>
  )
}

const SignupForm = (props) => {
  return (
    <Grid centered columns={2}>
      <Grid.Column>
        <Segment raised>
          <Form
            loading={props.loading > 0 ? true : false}
            className="signup-form"
            onSubmit={(e) => props.onFormSubmit(e)}
          >

            <Form.Input
              error={false}
              fluid icon='mail' iconPosition='left'
              required
              className="signup-email"
              name="email"
              onChange={(e) => props.onChange(e)}
              type="text"
              value={props.email || ''}
              placeholder='Email'
            />

            <Form.Input
              error={false}
              fluid icon='user' iconPosition='left'
              className="signup-fullName"
              name="fullName"
              onChange={(e) => props.onChange(e)}
              type="text"
              value={props.fullName || ''}
              placeholder='Full name'
            />

            <Form.Input
              error={false}
              fluid icon='lock' iconPosition='left'
              required
              className="signup-password"
              name="password"
              onChange={(e) => props.onChange(e)}
              type="password"
              value={props.password || ''}
              placeholder='Password'
            />

            <Form.Input
              error={false}
              className="confirm-password"
              name="confirmPassword"
              onChange={(e) => props.onChange(e)}
              type="password"
              value={props.confirmPassword || ''}
              placeholder='Confirm password'
            />

            <Form.Field>
              <Checkbox
                label='I agree to the Terms and Conditions'
              />
            </Form.Field>

            <Button fluid size='large'>Sign Up</Button>
          </Form>
        </Segment>

        {renderOauthLink(props)}

      </Grid.Column>
    </Grid>
  )
}

export default SignupForm;