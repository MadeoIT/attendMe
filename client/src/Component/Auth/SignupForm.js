import React from 'react';
import { Button, Checkbox, Form, Segment, Divider } from 'semantic-ui-react'
import { Grid } from 'semantic-ui-react'
import GoogleButton from './GoogleButton';

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

            {/* Identity */}
            <Form.Input
              error={false}
              fluid icon='mail' iconPosition='left'
              required
              className="signup-email"
              name="email"
              onChange={(e) => props.onChange(e)}
              type="email"
              value={props.email || ''}
              placeholder='Email'
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
    
            {/* User Info */}
            <Divider horizontal>Info</Divider>

            <Form.Input
              error={false}
              className="signup-firstName"
              name="firstName"
              onChange={(e) => props.onChange(e)}
              type="text"
              value={props.firstName || ''}
              placeholder='First name'
            />

            <Form.Input
              error={false}
              className="signup-lastName"
              name="lastName"
              onChange={(e) => props.onChange(e)}
              type="text"
              value={props.lastName || ''}
              placeholder='Last name'
            />

            <Form.Input
              error={false}
              className="signup-userName"
              name="userName"
              onChange={(e) => props.onChange(e)}
              type="text"
              value={props.userName || ''}
              placeholder='User name'
            />
          
            {/* Address */}
            <Divider horizontal>Address</Divider>

            <Form.Input
              error={false}
              fluid icon='address book' iconPosition='left'
              required
              className="signup-streetAddress"
              name="streetAddress"
              onChange={(e) => props.onChange(e)}
              type="streetAddress"
              value={props.streetAddress || ''}
              placeholder='Address'
            />

            <Form.Input
              error={false}
              required
              className="signup-postCode"
              name="postCode"
              onChange={(e) => props.onChange(e)}
              type="postCode"
              value={props.postCode || ''}
              placeholder='Post code'
            />

            <Form.Input
              error={false}
              required
              className="signup-country"
              name="country"
              onChange={(e) => props.onChange(e)}
              type="country"
              value={props.country || ''}
              placeholder='Country'
            />
            
            <Form.Field>
              <Checkbox
                label='I agree to the Terms and Conditions'
              />
            </Form.Field>

            <Button primary fluid size='large'>Sign Up</Button>
          </Form>

          <Divider horizontal>Or</Divider>

          <GoogleButton loading={props.loading}/>

        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default SignupForm;